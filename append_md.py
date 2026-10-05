import codecs

content = codecs.open(r'C:\Users\shadrack bett\.gemini\antigravity\brain\731000a7-a51d-4e8c-9b1f-af6a312bdf3a\majustwe_handbook.md', 'r', 'utf-8').read()

new_section_md = """
---

> [!CAUTION]
> ## APPENDIX: OFFICIALS' BYLAWS (RESTRICTED USE)
> The following bylaws are strictly for use and enforcement by the MAJUSTWE Executive Committee and Officials.
> 
> ### 1. Meeting Schedule
> General meetings shall be held strictly on the **first Saturday of every term**.
> 
> ### 2. Benefit & Contribution Tiers
> When a bereavement occurs, mandatory contributions are strictly categorized as follows:
> - **Loss of a Parent/Guardian:** Ksh 200 per member.
> - **Loss of a Principal Member / Spouse:** Ksh 500 per member.
> 
> ### 3. Claim Verification & Payout
> - All bereavement claims must first be **verified by the respective Zonal Representatives and the Secretary** before any processing can occur.
> - Once verified, the Treasurer is authorized to make an **immediate 50% payout** of the expected total to the bereaved member to assist with urgent logistics, prior to the collection of the remaining funds.
> 
> ### 4. Discipline & Code of Conduct
> - **Absences:** Fines will be strictly levied against members who are absent from scheduled meetings (the exact penalty structure is determined by the executive, e.g., a Ksh 1,000 fine for 3 consecutive absences without a valid apology).
> - **Conduct:** Any member found in a state of inebriation during official welfare meetings or functions faces **immediate expulsion** from the welfare.
"""

content = content + new_section_md
codecs.open(r'C:\Users\shadrack bett\.gemini\antigravity\brain\731000a7-a51d-4e8c-9b1f-af6a312bdf3a\majustwe_handbook.md', 'w', 'utf-8').write(content)
print("Updated Markdown Handbook")
