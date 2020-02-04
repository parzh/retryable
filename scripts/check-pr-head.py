import os

PR_HEAD_EXPECTED = "parzh:develop"
actual = os.environ["PR_HEAD"]

if actual != PR_HEAD_EXPECTED:
	raise Exception('Expected PR head "%s", instead got "%s"' % (PR_HEAD_EXPECTED, actual))
