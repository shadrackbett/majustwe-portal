import codecs

content = codecs.open(r'C:\Users\shadrack bett\.gemini\antigravity\brain\731000a7-a51d-4e8c-9b1f-af6a312bdf3a\majustwe_handbook.md', 'r', 'utf-8').read()

target = """*Prepared by **Shadrack Bett***"""
replace = """*Prepared by **Shadrack Bett***
*Current as of **01 October 2026***

> [!TIP]
> **[Scan or click here to access the MAJUSTWE Member Portal](https://majustwe-portal-mu.vercel.app/)**
> <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://majustwe-portal-mu.vercel.app/" width="100" />"""

content = content.replace(target, replace)
codecs.open(r'C:\Users\shadrack bett\.gemini\antigravity\brain\731000a7-a51d-4e8c-9b1f-af6a312bdf3a\majustwe_handbook.md', 'w', 'utf-8').write(content)
print("Updated Markdown Handbook with date and QR code")
