import codecs

content = codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'r', 'utf-8').read()

# Make it denser
content = content.replace("line-height: 1.6;", "line-height: 1.3;")
content = content.replace("padding: 50px 20px;", "padding: 10px 20px;")
content = content.replace("page-break-after: always;", "margin-bottom: 15px;")  # Removes from cover-page and toc
content = content.replace("margin-top: 30px;", "margin-top: 10px;")
content = content.replace("margin-top: 40px;", "margin-top: 15px;")
content = content.replace("margin-top: 20px;", "margin-top: 10px;")
content = content.replace("margin-bottom: 20px;", "margin-bottom: 8px;")
content = content.replace('<div class="page-break"></div>', "")
content = content.replace("page-break-before: always;", "")
content = content.replace("padding: 20px;", "padding: 10px;") # affects body, but body padding in print is 0 anyway.
content = content.replace("padding-bottom: 5px;", "padding-bottom: 2px;")

# Specific fix for the Q&A padding to save space
content = content.replace("padding-left: 15px;", "padding-left: 10px;")
content = content.replace("margin-bottom: 10px;", "margin-bottom: 5px;") # From h1

codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'w', 'utf-8').write(content)
print("Squished HTML layout to save paper")
