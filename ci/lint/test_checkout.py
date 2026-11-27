#!/usr/bin/env python3
"""Replay the workflow checkout against real offline Git fixtures. No packages needed."""
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[2]
WORKFLOW = ROOT / ".github/workflows/lint.yml"
ORIGINAL = "2c1a6aed84b720e68a5056487540b65716b9cfd0"
GITLINK = "160000 commit 4971f6cd29d5791956fa5f0e403b7c5364918782\tdesign/apptradingpessarocapital"
GIT = shutil.which("git")


def command(args, cwd, env, check=True, data=None):
    result = subprocess.run(args, cwd=cwd, env=env, input=data,
                            stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    if check and result.returncode:
        raise AssertionError(f"{args}: exit {result.returncode}\n{result.stdout.decode()}")
    return result


def checkout_step():
    # This deliberately small parser accepts only the first workflow step and its
    # literal run block. It never executes a separate copy of the new recipe.
    text = WORKFLOW.read_text()
    first = text.split("    steps:\n", 1)[1].split("      - ")[1]
    if first.startswith("uses: actions/checkout@"):
        return "action", first.splitlines()[0].split("@", 1)[1].split()[0]
    script = first.split("        run: |\n", 1)[1]
    lines = script.splitlines()
    assert lines and all(not line or line.startswith("          ") for line in lines)
    assert 'REPOSITORY: ${{ github.repository }}' in first
    assert 'EVENT_SHA: ${{ github.sha }}' in first
    return "shell", "\n".join(line[10:] for line in lines) + "\n"


class CheckoutTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        assert GIT, "Git is required"
        cls.temp = tempfile.TemporaryDirectory(prefix="portal-checkout-")
        cls.addClassCleanup(cls.temp.cleanup)
        cls.base = Path(cls.temp.name)
        cls.home = cls.base / "home"
        cls.home.mkdir()
        cls.env = {k: v for k, v in os.environ.items() if not k.startswith("GIT_")}
        cls.env.update(HOME=str(cls.home), GIT_CONFIG_NOSYSTEM="1",
                       GIT_CONFIG_GLOBAL=os.devnull, GIT_TERMINAL_PROMPT="0",
                       GIT_AUTHOR_NAME="Fixture", GIT_AUTHOR_EMAIL="fixture@example.invalid",
                       GIT_COMMITTER_NAME="Fixture", GIT_COMMITTER_EMAIL="fixture@example.invalid")
        cls.source = cls.base / "source"
        cls.source.mkdir()
        cls.git(cls.source, "init", "-q")
        tree = cls.git(ROOT, "ls-tree", "-rz", ORIGINAL).stdout.split(b"\0")
        cls.files = {}
        for entry in filter(None, tree):
            meta, name = entry.split(b"\t", 1)
            mode, kind, oid = meta.decode().split()
            if kind == "blob":
                name = os.fsdecode(name)
                content = cls.git(ROOT, "cat-file", "blob", oid).stdout
                cls.files[name] = content
                target = cls.source / name
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(content)
                if mode == "100755":
                    target.chmod(0o755)
        assert len(cls.files) == 113, f"original ordinary files={len(cls.files)}"
        cls.git(cls.source, "add", ".")
        cls.git(cls.source, "update-index", "--add", "--cacheinfo",
                "160000,4971f6cd29d5791956fa5f0e403b7c5364918782,design/apptradingpessarocapital")
        cls.git(cls.source, "commit", "-qm", "original files and malformed gitlink")
        cls.ordinary = cls.git(cls.source, "rev-parse", "HEAD").stdout.decode().strip()
        # Two real parents; the merge exists only under refs/pull/1/merge, not a branch.
        tree_id = cls.git(cls.source, "rev-parse", "HEAD^{tree}").stdout.decode().strip()
        side = cls.git(cls.source, "commit-tree", tree_id, "-p", cls.ordinary,
                       data=b"side\n").stdout.decode().strip()
        cls.merge = cls.git(cls.source, "commit-tree", tree_id, "-p", cls.ordinary,
                            "-p", side, data=b"synthetic merge\n").stdout.decode().strip()
        cls.git(cls.source, "update-ref", "refs/pull/1/merge", cls.merge)
        # Test-only Git URL rewrite keeps the production script's HTTPS URL intact.
        cls.config = cls.base / "gitconfig"
        cls.git(cls.source, "config", "--file", str(cls.config),
                f"url.{cls.source.as_uri()}.insteadOf", "https://github.com/fixture/portal.git")
        cls.config_bytes = cls.config.read_bytes()
        cls.env["GIT_CONFIG_GLOBAL"] = str(cls.config)
        cls.kind, cls.recipe = checkout_step()
        cls.workspaces = 0
        print(f"fixture: original_ordinary_files={len(cls.files)} gitlinks=1 merge_parents=2", flush=True)

    @classmethod
    def git(cls, cwd, *args, check=True, data=None):
        return command([GIT, *args], cwd, cls.env, check, data)

    def replay(self, sha, fault=None):
        type(self).workspaces += 1
        work = self.base / f"workspace-{self.workspaces}"
        work.mkdir()
        env = self.env.copy()
        env.update(GITHUB_WORKSPACE=str(work), REPOSITORY="fixture/portal")
        env.pop("EVENT_SHA", None)
        if sha is not None:
            env["EVENT_SHA"] = sha
        if self.kind == "action":
            self.assertEqual(self.recipe, "3d3c42e5aac5ba805825da76410c181273ba90b1")
            self.git(work, "clone", "--no-recurse-submodules", str(self.source), ".")
            self.git(work, "checkout", "--detach", self.ordinary)
            # The pinned action's unconditional auth cleanup traverses submodules.
            # Replay the proven failing native command, not an unavailable action runner.
            result = self.git(work, "submodule", "foreach", "--recursive", ":", check=False)
        else:
            if fault:
                shim = self.base / f"shim-{self.workspaces}"
                shim.mkdir()
                wrapper = shim / "git"
                wrapper.write_text("#!/bin/bash\n" + fault + '\nexec "$REAL_GIT" "$@"\n')
                wrapper.chmod(0o755)
                env.update(PATH=str(shim) + os.pathsep + env["PATH"], REAL_GIT=GIT)
            result = command(["bash", "--noprofile", "--norc", "-e", "-o", "pipefail", "-c", self.recipe],
                             work, env, check=False)
        return result, work

    def assert_success(self, sha):
        result, work = self.replay(sha)
        self.assertEqual(result.returncode, 0, result.stdout.decode())
        self.assertEqual(self.git(work, "rev-parse", "HEAD").stdout.decode().strip(), sha)
        entries = self.git(work, "ls-tree", "-r", "HEAD").stdout.decode().splitlines()
        self.assertIn(GITLINK, entries)
        self.assertEqual(sum(" blob " in line for line in entries), len(self.files))
        for name, content in self.files.items():
            self.assertEqual((work / name).read_bytes(), content, name)
        # Verify the malformed condition survived and would still break action cleanup.
        bad = self.git(work, "submodule", "foreach", "--recursive", ":", check=False)
        self.assertEqual(bad.returncode, 128, bad.stdout.decode())
        self.assertIn(b"No url found for submodule path", bad.stdout)
        config = self.git(work, "config", "--local", "--list").stdout.decode()
        self.assertNotRegex(config.lower(), r"extraheader|credential|insteadof|token|sshcommand")
        self.assertFalse((work / ".git-credentials").exists())
        self.assertFalse((self.home / ".git-credentials").exists())
        self.assertEqual(self.config.read_bytes(), self.config_bytes)
        print(f"checkout: sha={sha} ordinary_files_verified={len(self.files)} gitlinks_verified=1", flush=True)

    def assert_rejected(self, sha, diagnostic, fault=None):
        self.assertEqual(self.kind, "shell", "negative cases require the executable workflow recipe")
        result, _ = self.replay(sha, fault)
        self.assertNotEqual(result.returncode, 0, "checkout accepted a forged success")
        self.assertIn(diagnostic, result.stdout.decode())

    def test_01_ordinary_commit(self):
        self.assert_success(self.ordinary)

    def test_02_synthetic_merge_commit(self):
        self.assert_success(self.merge)

    def test_03_missing_and_invalid_sha(self):
        for sha in [None, "", "not-a-sha", "HEAD", "--help", "a" * 39, "A" * 40,
                    "$(touch injected)", "a" * 40 + "; exit 0"]:
            with self.subTest(sha=sha):
                self.assert_rejected(sha, "Invalid event SHA")

    def test_04_nonexistent_sha(self):
        self.assert_rejected("f" * 40, "not our ref")

    def test_05_identity_mismatch(self):
        self.assert_rejected(self.merge, "Event SHA mismatch",
                             'if [[ "$1" == checkout ]]; then '
                             '"$REAL_GIT" "$@" && '
                             '"$REAL_GIT" commit --allow-empty -qm "forged checkout success"; exit $?; fi')

    def test_06_fetch_error(self):
        self.assert_rejected(self.ordinary, "injected fetch failure",
                             'if [[ "$1" == fetch ]]; then echo "injected fetch failure"; exit 71; fi')

    def test_07_checkout_error(self):
        self.assert_rejected(self.ordinary, "injected checkout failure",
                             'if [[ "$1" == checkout ]]; then echo "injected checkout failure"; exit 72; fi')

    def test_08_forged_fetch_success(self):
        self.assert_rejected(self.ordinary, "FETCH_HEAD",
                             'if [[ "$1" == fetch ]]; then exit 0; fi')


    def test_09_forged_checkout_success(self):
        self.assert_rejected(self.ordinary, "unknown revision",
                             'if [[ "$1" == checkout ]]; then exit 0; fi')

    def test_10_failed_identity_command(self):
        self.assert_rejected(self.ordinary, "injected identity failure",
                             'if [[ "$1" == rev-parse ]]; then echo "$EVENT_SHA"; '
                             'echo "injected identity failure" >&2; exit 73; fi')


if __name__ == "__main__":
    print("checkout cases=18 (10 tests, including 9 missing/invalid SHA inputs)", flush=True)
    unittest.main(verbosity=2)
