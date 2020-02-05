import os
import re

from git import Repo
from github import Github as GitHub

PR_LABEL_SEP = ": "
PR_LABEL_CHANGE_KEY = "Change"

def is_change(change_type=None):
	def is_change_internal(label):
		if change_type:
			return label.name.endswith(change_type)

		else:
			return label.name.startswith(PR_LABEL_CHANGE_KEY + PR_LABEL_SEP)

	return is_change_internal

CHANGE_TYPE = {
	"patch": 1,
	"minor": 2,
	"major": 3
}

def get_pr_change_type(pr):
	label, *other = filter(is_change(), pr.labels)

	try:
		if len(other):
			raise "Got >1 change labels"

		if not label:
			raise "Found no change labels"

	except str as error:
		raise Exception("%s on PR #%i; please debug 'check-pr-labels.yml' workflow" % (error, pr.number))

	key, change_type = label.name.split(PR_LABEL_SEP)

	return change_type

PR_LISTS = {
	"patch": [],
	"minor": [],
	"major": []
}

def show_output_in_console():
	for change_type, list_of_prs in PR_LISTS.items():
		print("'%s' PRs (%i):" % (change_type, len(list_of_prs)))

		for pr in list_of_prs:
			print('\t%s\n\t by @%s\n\t%s' % (pr.title, pr.user.login, pr.html_url))
			print("")

# ***

# that's what we're gonna figure out
# 0 is erroneous, means unknown type
release_type = 0

github = GitHub(os.environ['BOT_PERSONAL_ACCESS_TOKEN'])
repo_remote = github.get_repo('parzh/retryable')
pull_request = repo_remote.get_pull(int(os.environ['PR_NUMBER']))

merge_commits_shas = os.environ['MERGES'].split('\n')
repo_local = Repo.init('.')

PR_NUMBER_PATTERN = "\s#(\d+)\s"
PR_NUMBER_PATTERN_GROUP_NUMBER = 1

for merge_commit_sha in merge_commits_shas:
	# get merge commit
	merge_commit = repo_local.commit(merge_commit_sha)

	# get merge commit message (it holds the PR number)
	message = merge_commit.message

	# find PR number in the message
	pr_number: str = re.search(PR_NUMBER_PATTERN, message).group(PR_NUMBER_PATTERN_GROUP_NUMBER)

	# get PR by its number
	pr = repo_remote.get_pull(int(pr_number))

	# get and save PR change type
	pr_change_type = get_pr_change_type(pr)
	PR_LISTS[pr_change_type].append(pr)

	# update release type, based on the PR change type
	release_type = max(release_type, CHANGE_TYPE[pr_change_type])

# ***

RELEASE_VERSIONS = [
	None,
	"patch",
	"minor",
	"major"
]

# verify that 'release_type' is valid
assert release_type, "Could not gather release version"
assert release_type <= 3, "Unknown error: unexpected release type"

# get release version (e.g., 'patch')
release_version = RELEASE_VERSIONS[release_type]

# get all labels of the remote repo
repo_remote_labels = repo_remote.get_labels()

# get label that corresponds the release version
change_label, *other = filter(is_change(release_version), repo_remote_labels)

# set the label to the PR
pull_request.add_to_labels(change_label)

# show all the outputs
print('Automatically added label "%s" to pull request #%i' % (change_label.name, pull_request.number))
print("")
show_output_in_console()
