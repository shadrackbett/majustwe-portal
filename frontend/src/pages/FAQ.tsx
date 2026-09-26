import React, { useState } from 'react';

const FAQItem: React.FC<{ question: string, answer: React.ReactNode }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-200 bg-white rounded-xl mb-4 overflow-hidden shadow-sm transition-all duration-200">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-majustwe-lightBlue/10 transition-colors text-left focus:outline-none"
      >
        <h3 className="font-bold text-gray-800 text-lg pr-8">{question}</h3>
        <svg 
          className={`w-6 h-6 text-majustwe-blue transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div 
        className={`px-6 text-gray-600 transition-all duration-300 ease-in-out ${isOpen ? 'py-4 max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
      >
        {answer}
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  return (
    <div className="bg-white/40 backdrop-blur-xl shadow-2xl border border-white/60 rounded-3xl p-6 md:p-10 max-w-4xl mx-auto my-8">
      <div className="text-center mb-10 border-b border-gray-300 pb-6">
        <h1 className="text-3xl font-extrabold text-majustwe-blue mb-2">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600">Common questions about the MAJUSTWE Constitution and Operations</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <FAQItem 
          question="Who is eligible to join MAJUSTWE?" 
          answer="Membership is open to all willing teachers teaching in junior schools (under PnP, Interns, B.O.M terms) within Matuga subcounty." 
        />
        
        <FAQItem 
          question="How much does it cost to join?" 
          answer={
            <>
              <p className="mb-2">There are two initial fees upon joining:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Registration Fee:</strong> A non-refundable fee of Kshs. 100.</li>
                <li><strong>Emergency Kitty:</strong> A refundable deposit of Kshs. 500.</li>
              </ul>
            </>
          } 
        />
        
        <FAQItem 
          question="What is the Emergency Kitty used for?" 
          answer="The emergency kitty funds are used to caution a member in case of delay in contributions for bereavement, severe accidents, or natural calamities. Once the members' contributions are collected, the funds are refunded back to the emergency kitty." 
        />

        <FAQItem 
          question="When do I become eligible for benefits?" 
          answer="A registered member must be part of the welfare for not less than three (3) months to receive and enjoy benefits." 
        />

        <FAQItem 
          question="How much financial support is given for a bereavement case?" 
          answer={
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Principal Member:</strong> Kshs. 500</li>
              <li><strong>Spouse (1):</strong> Kshs. 500</li>
              <li><strong>Children:</strong> Kshs. 300</li>
              <li><strong>Parents / Guardian:</strong> Kshs. 200</li>
            </ul>
          } 
        />

        <FAQItem 
          question="Are severe accidents or chronic diseases covered?" 
          answer="Yes. Severe accidents, injuries, natural calamities (such as fire and floods), and prolonged chronic diseases (upon evaluation and approval by leadership) are covered at Kshs. 400 for the principal member." 
        />

        <FAQItem 
          question="What if I don't have biological children or parents?" 
          answer="If you do not have biological offspring, you may provide an unalterable list of up to four (4) persons below 18 years as beneficiaries. If you do not have biological parents, you may nominate two (2) irreplaceable persons as your guardians at the point of application." 
        />

        <FAQItem 
          question="What happens if I get transferred outside of Matuga sub-county?" 
          answer="You will transition to an 'Associate Membership'. You may also choose to willfully withdraw your membership in writing, in which case the funds in your emergency kitty will be refunded to you." 
        />

        <FAQItem 
          question="How much time do members have to make a contribution when a case happens?" 
          answer="The duration for making a contribution is not more than seven (7) days from the time a case is reported to the members by the welfare leadership." 
        />

        <FAQItem 
          question="When are General Meetings held?" 
          answer="The Annual General Meeting (AGM) is conducted on a date within the third term of the academic year. Members will receive communication at least two weeks prior to the meeting." 
        />
      </div>
    </div>
  );
};

export default FAQ;
