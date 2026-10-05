import codecs
import re

content = codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'r', 'utf-8').read()

# Delete the TOC completely
content = re.sub(r'<!-- Table of Contents -->.*?</div>', '', content, flags=re.DOTALL)

codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'w', 'utf-8').write(content)
print("Removed TOC")
