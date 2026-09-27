import codecs
import json

filepath = 'frontend/package.json'
with codecs.open(filepath, 'r', 'utf-8') as f:
    data = json.load(f)

data['scripts']['build'] = "CI=false react-scripts build"

with codecs.open(filepath, 'w', 'utf-8') as f:
    json.dump(data, f, indent=2)

print("Restored CI=false")
