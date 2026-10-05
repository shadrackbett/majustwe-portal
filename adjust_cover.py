import codecs
import re

content = codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'r', 'utf-8').read()

# Reduce padding to ensure it fits on one page
content = content.replace("padding: 150px 20px;", "padding: 50px 20px;")
content = content.replace("margin-top: 100px;", "margin-top: 30px;")
content = content.replace("margin-top: 50px;", "margin-top: 20px;")

# Ensure the logo is not too big
content = content.replace("max-width: 200px;", "max-width: 150px;")

codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'w', 'utf-8').write(content)
print("Adjusted CSS to fit cover page content on one page")
