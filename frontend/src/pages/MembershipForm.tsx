import React, { useEffect } from 'react';

const MembershipForm: React.FC = () => {
  useEffect(() => {
    // Optionally trigger print dialog automatically when the page loads
    // setTimeout(() => window.print(), 500);
  }, []);

  return (
    <>
      <style>
        {`
          @media print {
            @page {
              margin: 0;
            }
            body {
              margin: 1cm;
            }
          }
        `}
      </style>
      <div className="bg-white text-black p-4 md:p-8 print:p-0 font-sans" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="text-center mb-2 border-b-2 border-black pb-1">
        <h1 className="text-xl font-extrabold uppercase mb-1">Matuga Junior Schools Teachers' Welfare</h1>
        <h2 className="text-base font-bold uppercase tracking-widest">(MAJUSTWE)</h2>
        <p className="mt-1 text-xs font-semibold">"Empowering Teachers, Building a Stronger Community"</p>
      </div>

      <h3 className="text-lg font-bold text-center underline mb-2">OFFICIAL MEMBERSHIP REGISTRATION FORM</h3>

      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="border-b border-black pb-1">
            <span className="font-bold mr-2">Full Name:</span>
            <span className="text-transparent">______________________________________</span>
          </div>
          <div className="border-b border-black pb-1">
            <span className="font-bold mr-2">ID No.:</span>
            <span className="text-transparent">_________________________</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border-b border-black pb-1">
            <span className="font-bold mr-2">Phone Number:</span>
            <span className="text-transparent">_________________________</span>
          </div>
          <div className="border-b border-black pb-1">
            <span className="font-bold mr-2">Email Address:</span>
            <span className="text-transparent">_________________________</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border-b border-black pb-1">
            <span className="font-bold mr-2">School Zone:</span>
            <span className="text-transparent">_________________________</span>
          </div>
          <div className="border-b border-black pb-1">
            <span className="font-bold mr-2">Member Type (PnP/Intern/BOM):</span>
            <span className="text-transparent">______________</span>
          </div>
        </div>

        <div className="mt-3">
          <h4 className="font-bold mb-1">A. DECLARATION OF DEPENDENTS (Maximum 4)</h4>
          <table className="w-full border-collapse border border-black text-left text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-1 w-10 text-center">No.</th>
                <th className="border border-black p-1">Full Name</th>
                <th className="border border-black p-1 w-1/3">Relationship</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map(num => (
                <tr key={num} className="h-6">
                  <td className="border border-black p-1 text-center">{num}</td>
                  <td className="border border-black p-1"></td>
                  <td className="border border-black p-1"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3">
          <h4 className="font-bold mb-1">B. NOMINATION OF GUARDIANS/BENEFICIARIES (Maximum 2)</h4>
          <p className="text-[10px] italic mb-1">To be filled if the member has no biological dependents, or to declare primary beneficiaries.</p>
          <table className="w-full border-collapse border border-black text-left text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-1 w-10 text-center">No.</th>
                <th className="border border-black p-1">Full Name</th>
                <th className="border border-black p-1 w-1/4">Relationship</th>
                <th className="border border-black p-1 w-1/4">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2].map(num => (
                <tr key={num} className="h-6">
                  <td className="border border-black p-1 text-center">{num}</td>
                  <td className="border border-black p-1"></td>
                  <td className="border border-black p-1"></td>
                  <td className="border border-black p-1"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-2 border-2 border-black bg-gray-50 text-xs">
          <h4 className="font-bold text-sm mb-1">C. MEMBER DECLARATION & CONSENT</h4>
          <p className="text-justify leading-snug mb-2">
            I, the undersigned, hereby declare that the information provided above is true and accurate to the best of my knowledge. I agree to abide by the Constitution, rules, and regulations of the Matuga Junior Schools Teachers' Welfare (MAJUSTWE). I commit to making all required financial contributions as stipulated.
          </p>
          <p className="text-justify leading-snug font-bold border-l-2 border-black pl-2 py-1 mb-4">
            Furthermore, I hereby grant permission and allow the usage of my personal data (including my name, phone number, and dependent details) exclusively for welfare-related activities, communication, and official MAJUSTWE records in accordance with data protection guidelines.
          </p>
          
          <div className="flex justify-between items-end mt-4">
            <div className="border-t border-black pt-1 w-1/4 text-center">
              <span className="font-bold">Applicant's Signature</span>
            </div>
            <div className="border-t border-black pt-1 w-1/4 text-center">
              <span className="font-bold">Date</span>
            </div>
            <div className="border-t border-black pt-1 w-1/4 text-center">
              <span className="font-bold">Secretary's Sign & Stamp</span>
            </div>
          </div>
        </div>
        
                <div className="mt-4 text-center">
          <button onClick={() => window.print()} className="print:hidden bg-majustwe-blue text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-blue-900 transition-colors">
            🖨️ Print Form
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default MembershipForm;
