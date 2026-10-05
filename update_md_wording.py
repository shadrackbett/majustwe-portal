import codecs

content = codecs.open(r'C:\Users\shadrack bett\.gemini\antigravity\brain\731000a7-a51d-4e8c-9b1f-af6a312bdf3a\majustwe_handbook.md', 'r', 'utf-8').read()

target = """> [!CAUTION]
> ## APPENDIX: OFFICIALS' BYLAWS (RESTRICTED USE)
> The following bylaws are strictly for use and enforcement by the MAJUSTWE Executive Committee and Officials."""

replacement = """> [!NOTE]
> ## APPENDIX: OFFICIALS' BYLAWS (FOR OFFICIAL USE)
> The following bylaws provide operational guidelines for use by the MAJUSTWE Executive Committee and Officials."""

content = content.replace(target, replacement)
codecs.open(r'C:\Users\shadrack bett\.gemini\antigravity\brain\731000a7-a51d-4e8c-9b1f-af6a312bdf3a\majustwe_handbook.md', 'w', 'utf-8').write(content)
print("Updated Markdown with new bylaws wording")
