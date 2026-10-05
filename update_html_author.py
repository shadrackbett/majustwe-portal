import codecs

content = codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'r', 'utf-8').read()

# 1. Add "Prepared by Shadrack Bett" to cover page
target_cover = """        <div class="date">
            Prepared for the Executive Committee and Members<br/>"""
replace_cover = """        <div class="date">
            Prepared by <strong>Shadrack Bett</strong><br/>
            For the Executive Committee and Members<br/>"""
content = content.replace(target_cover, replace_cover)

# 2. Add details required and their use to Section 2 (Membership & Joining)
target_details = """    <div class="faq-q">Q: What are the financial requirements to join?</div>"""
replace_details = """    <div class="faq-q">Q: What details do I need to provide during registration, and what are they used for?</div>
    <div class="faq-a">A: During your online registration, you are strictly required to declare the following information:
        <ul>
            <li><strong>Next of Kin & Beneficiaries:</strong> To ensure that in the unfortunate event of your demise, the welfare benefits are disbursed to the exact individual you authorized, preventing family disputes.</li>
            <li><strong>Dependents (Max 4 Children):</strong> So the welfare knows exactly which children are officially covered in case of bereavement.</li>
            <li><strong>Guardians / Parents (Max 2):</strong> To register your official parents or guardians who are covered under the Kshs. 200 contribution tier.</li>
            <li><strong>Spouse (Max 1):</strong> To officially register the spouse covered under the Kshs. 500 contribution tier.</li>
        </ul>
        <em>Note: This information is kept strictly confidential and is used solely by the Executive Committee to verify claims and prevent fraud. Once submitted, Guardians and Dependents can only be updated by the Secretary upon formal request.</em>
    </div>

    <div class="faq-q">Q: What are the financial requirements to join?</div>"""

content = content.replace(target_details, replace_details)
codecs.open(r'C:\majustwe_portal\MAJUSTWE_Handbook.html', 'w', 'utf-8').write(content)
print("Updated HTML Handbook with author and registration details")
