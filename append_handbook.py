import codecs

content = codecs.open(r'C:\Users\shadrack bett\.gemini\antigravity\brain\731000a7-a51d-4e8c-9b1f-af6a312bdf3a\majustwe_handbook.md', 'r', 'utf-8').read()

new_section = """
## 6. Amendments & The Constitution

**Q: Can the welfare constitution be changed?**
A: Yes. Amendments can only be made through a majority vote during an Annual General Meeting or a Special Meeting called specifically for that purpose.

**Q: How much notice is given before voting on a rule change?**
A: Any proposed amendments must be shared with all registered members at least **two (2) weeks** prior to the voting day.

**Q: What happens if there is a legal contradiction in the rules?**
A: In the event of any oversight, contradiction, or deficiency in the welfare's constitution, the laws of the Republic of Kenya shall take absolute precedence.
"""

content = content + new_section
codecs.open(r'C:\Users\shadrack bett\.gemini\antigravity\brain\731000a7-a51d-4e8c-9b1f-af6a312bdf3a\majustwe_handbook.md', 'w', 'utf-8').write(content)
print("Appended Article 10")
