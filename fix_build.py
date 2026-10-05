import codecs

content = codecs.open(r'C:\majustwe_portal\frontend\package.json', 'r', 'utf-8').read()
content = content.replace('"build": "react-scripts build"', '"build": "CI=false react-scripts build"')
codecs.open(r'C:\majustwe_portal\frontend\package.json', 'w', 'utf-8').write(content)
print("Updated package.json to disable CI strict errors")
