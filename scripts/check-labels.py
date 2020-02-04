import os
import json

LABEL_KEY = "Change"
LABEL_SEP = ": "

def is_change(label):
	return label.startswith(LABEL_KEY + LABEL_SEP)

labels = json.loads(os.environ['PR_LABELS'])

if (count := len(labels)) != 1:
	raise Exception('Expected exactly one change label, got %i' % count)

label, *other = filter(is_change, labels)
key, value = label.split(LABEL_SEP)

print('SemVer change is %s' % value)
