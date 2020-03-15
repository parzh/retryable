import os

from re import sub as replace
from sys import argv
from github import Github

ghub = Github(os.environ["BOT_PERSONAL_ACCESS_TOKEN"])
repo = ghub.get_repo("parzh/retryable")

def get_pr_by_commit_sha(commit_sha):
	issues = ghub.search_issues(query=commit_sha)
	prs = []

	for issue in issues:
		pr = repo.get_pull(issue.number)

		if pr.head.label != "parzh:develop":
			if not prs:
				prs.append(pr)

			else:
				raise Exception(f"Got >1 PRs associated with commit {commit_sha}")

	return prs[0]

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
		raise Exception(f'{error} on PR #{pr.number}; please debug "check-pr-labels.yml" workflow')

	key, change_type = label.name.split(PR_LABEL_SEP)

	return change_type

PR_LISTS = {
	"major": [],
	"minor": [],
	"patch": [],
}

CHANGE_TYPE = {
	"major": 3,
	"minor": 2,
	"patch": 1,
}

# that's what we're gonna figure out
# 0 is erroneous, means unknown type
release_type = 0

merge_commits_shas = argv[1].split("\n")

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

pull_request = repo.get_pull(int(os.environ["PR_NUMBER"]))

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

def get_pr_change_label():
	# get all change labels from remote
	change_labels = list(filter(is_change(), repo.get_labels()))

	# get all labels from PR
	pr_labels = list(pull_request.get_labels())

	# remove all change labels from PR
	for label in change_labels:
		if label in pr_labels:
			pull_request.remove_from_labels(label)

	# get corresponding change label
	change_label, *other = list(filter(is_change(release_version), change_labels))

	# set it to the PR
	pull_request.add_to_labels(change_label)

	return change_label

# set the label to the PR
change_label = get_pr_change_label(release_version)

# show all the outputs
def joint(lines):
	return replace(r"\n{2,}", "\n\n", "\n".join(lines))

def compose_output_console():
	console_lines = [
		f"Automatically added label \"{change_label.name}\" to pull request #{pull_request.number}",
		"",
	]

	for change_type, list_of_prs in PR_LISTS.items():
		console_lines.append(f"{ change_type} ({ len(list_of_prs) }):")

		for pr in list_of_prs:
			console_lines.extend([
				f"\t{pr.title}",
				f"\tby @{pr.user.login}",
				f"\t{pr.html_url}",
				""
			])

		console_lines.append("")

	return joint(console_lines)

def compose_output_comment():
	comment_lines = [
		"Hello 👋! Pardon the interruption.",
		"",
		f"I've figured out that this pull request represents a **`{release_version}`** release.",
		"",
		"Below you can see a list of other pull requests that will be merged by merging this one.",
		"",
	]

	for change_type, list_of_prs in PR_LISTS.items():
		comment_lines.extend([
			f"#### Pull requests with `{change_type}` change ({ len(list_of_prs) }):",
			"",
		])

		for pr in list_of_prs:
			comment_lines.append(f"- #{pr.number}")

		comment_lines.append("")

	return joint(comment_lines)

print(compose_output_console())
pull_request.create_issue_comment(compose_output_comment())
