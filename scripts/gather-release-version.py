import os
import re

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

github = GitHub(os.environ['BOT_PERSONAL_ACCESS_TOKEN'])

def get_pr_by_commit_sha(commit_sha):
	results = github.search_issues(query=commit_sha)

	if (pr_count := results.totalCount) != 1:
		raise Exception("Cannot continue: expected 1 PR associated with commit %s, got %i" % (commit_sha, pr_count))

	pr = results.get_page(0)[0]

	return pr

PR_LISTS = {
	"major": [],
	"minor": [],
	"patch": [],
}

def show_output_in_console():
	for change_type, list_of_prs in PR_LISTS.items():
		print("%s (%i):" % (change_type, len(list_of_prs)))

		for pr in list_of_prs:
			print("\t%s\n\tby @%s\n\t%s\n" % (pr.title, pr.user.login, pr.html_url))

repo_remote = github.get_repo('parzh/retryable')
pull_request = repo_remote.get_pull(int(os.environ['PR_NUMBER']))

def post_output_as_message(release_version):
	message_lines = [
		"Hello 👋! Pardon the interruption.",
		"",
		"I've figured out that this pull request represents a '**%s**' release." % (release_version),
		"",
		"Below you can see a list of other pull requests that will be merged by merging this one.",
		"",
	]

	for change_type, list_of_prs in PR_LISTS.items():
		message_lines.extend([
			"#### Pull requests with `%s` change (%i):" % (change_type, len(list_of_prs)),
			"",
		])

		for pr in list_of_prs:
			message_lines.append("- #%i" % (pr.number))

		message_lines.append("")

	message = "\n".join(message_lines).replace("\n\n\n", "\n\n")

	pull_request.create_issue_comment(message)

# ***

CHANGE_TYPE = {
	"major": 3,
	"minor": 2,
	"patch": 1,
}

# that's what we're gonna figure out
# 0 is erroneous, means unknown type
release_type = 0

merge_commits_shas = os.environ['MERGES'].split('\n')

for merge_commit_sha in merge_commits_shas:
	# get PR by its number
	pr = get_pr_by_commit_sha(merge_commit_sha)

	# get PR change type
	pr_change_type = get_pr_change_type(pr)

	# save PR under change type
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

# get label from remote that corresponds the release version
change_label, *other = filter(is_change(release_version), repo_remote.get_labels())

# set the label to the PR
pull_request.add_to_labels(change_label) # TODO: uncomment

# show all the outputs
print('Automatically added label "%s" to pull request #%i' % (change_label.name, pull_request.number))
print("")
show_output_in_console()
post_output_as_message(release_version)