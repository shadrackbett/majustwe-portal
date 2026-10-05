import codecs

content = codecs.open(r'C:\Users\shadrack bett\.gemini\antigravity\brain\731000a7-a51d-4e8c-9b1f-af6a312bdf3a\majustwe_handbook.md', 'r', 'utf-8').read()

# 1. Add "Prepared by Shadrack Bett"
target_md_cover = """# MAJUSTWE Official Handbook (Q&A)

Welcome to the Matuga Junior Schools Teachers' Welfare (MAJUSTWE) handbook. This document breaks down our constitution into a simple, easy-to-read Question & Answer format."""
replace_md_cover = """# MAJUSTWE Official Handbook (Q&A)
*Prepared by **Shadrack Bett***

Welcome to the Matuga Junior Schools Teachers' Welfare (MAJUSTWE) handbook. This document breaks down our constitution into a simple, easy-to-read Question & Answer format."""
content = content.replace(target_md_cover, replace_md_cover)

# 2. Add details required and their use to Section 1
target_md_details = """**Q: What are the financial requirements to join?**"""
replace_md_details = """**Q: What details do I need to provide during registration, and what are they used for?**
A: During online registration, you are strictly required to declare the following information. This data is kept strictly confidential and is used solely to verify claims and prevent fraud:
- **Next of Kin & Beneficiaries:** To ensure that in the unfortunate event of your demise, the welfare benefits are disbursed exactly to the individual you authorized, preventing family disputes.
- **Dependents (Max 4 Children):** So the welfare knows exactly which children are officially covered in case of bereavement.
- **Guardians / Parents (Max 2):** To register your official parents or guardians who are covered under the Kshs. 200 contribution tier.
- **Spouse (Max 1):** To officially register the spouse covered under the Kshs. 500 contribution tier.
*(Note: Once submitted, Guardians and Dependents can only be updated by the Secretary upon formal request).*

**Q: What are the financial requirements to join?**"""
content = content.replace(target_md_details, replace_md_details)

codecs.open(r'C:\Users\shadrack bett\.gemini\antigravity\brain\731000a7-a51d-4e8c-9b1f-af6a312bdf3a\majustwe_handbook.md', 'w', 'utf-8').write(content)
print("Updated Markdown Handbook with author and registration details")
