import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { DatabaseContext } from '../context/DatabaseContext';

const MembershipForm: React.FC = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { members } = useContext(DatabaseContext);
  
  const isBlank = location.search.includes('blank=true');
    const profile = !isBlank && user ? (members.find(m => Number(m.user?.id) === Number(user.id) || Number(m.id) === Number(user.id)) || null) : null;

  if (!isBlank && user && members.length > 0 && !profile) {
    return (
      <div className="p-8 text-red-500 font-bold">
        DEBUG MODE: Could not find profile!<br/>
        User Context ID: {user.id}<br/>
        Members loaded: {members.length}<br/>
        First 3 members user IDs: {members.slice(0, 3).map(m => m.user?.id || 'null').join(', ')}<br/>
        Please copy this text and send it to the developer.
      </div>
    );
  }


  if (!isBlank && user && members.length === 0) {
    return <div className="flex items-center justify-center min-h-screen text-xl font-bold text-gray-500">Loading Form Data...</div>;
  }

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
      <div className="flex justify-between items-center mb-2 border-b-2 border-black pb-2">
        <div className="w-24">
          <img src="/logo.png" alt="MAJUSTWE Logo" className="w-full h-auto object-contain rounded-full" />
        </div>
        <div className="text-center flex-1 px-4">
          <h1 className="text-xl font-extrabold uppercase mb-1 text-black">Matuga Junior Schools Teachers' Welfare</h1>
          <h2 className="text-base font-bold uppercase tracking-widest text-black">(MAJUSTWE)</h2>
          <p className="mt-1 text-xs font-semibold text-black">"Empowering Teachers, Building a Stronger Community"</p>
        </div>
        <div className="w-24 flex flex-col items-center">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://majustwe-portal-mu.vercel.app/" alt="QR Code" className="w-16 h-16" />
          <span className="text-[8px] font-bold mt-1 text-black whitespace-nowrap">Visit Our Portal</span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-center underline mb-2">OFFICIAL MEMBERSHIP REGISTRATION FORM</h3>

      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="border-b border-black pb-1">
            <span className="font-bold mr-2">Full Name:</span>
            {profile ? <span className="text-black inline-block min-w-[200px] border-b border-black font-medium">{profile.user?.first_name} {profile.user?.last_name}</span> : <span className="text-transparent">______________________________________</span>}
          </div>
          <div className="border-b border-black pb-1">
            <span className="font-bold mr-2">ID No.:</span>
            {profile ? <span className="text-black inline-block min-w-[150px] border-b border-black font-medium">{profile.user?.username || profile.id_number}</span> : {profile ? <span className="text-black inline-block min-w-[150px] border-b border-black font-medium">{profile.phone}</span> : {profile ? <span className="text-black inline-block min-w-[150px] border-b border-black font-medium">{profile.user?.email || ""}</span> : {profile ? <span className="text-black inline-block min-w-[150px] border-b border-black font-medium">{profile.zone || ""}</span> : <span className="text-transparent">_________________________</span>}}}}
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
            {profile ? <span className="text-black inline-block min-w-[100px] border-b border-black font-medium">{profile.member_type || ""}</span> : <span className="text-transparent">______________</span>}
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
              {[0, 1, 2, 3].map(index => {
                const dep = profile?.dependents && profile.dependents[index];
                return (
                  <tr key={index} className="h-6">
                    <td className="border border-black p-1 text-center">{index + 1}</td>
                    <td className="border border-black p-1 font-medium">{dep ? dep.name : ''}</td>
                    <td className="border border-black p-1 font-medium">{dep ? dep.relationship : ''}</td>
                  </tr>
                );
              })}
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
              {[0, 1].map(index => {
                const gd = profile?.guardians && profile.guardians[index];
                return (
                  <tr key={index} className="h-6">
                    <td className="border border-black p-1 text-center">{index + 1}</td>
                    <td className="border border-black p-1 font-medium">{gd ? gd.name : ''}</td>
                    <td className="border border-black p-1 font-medium">{gd ? gd.relationship : ''}</td>
                    <td className="border border-black p-1 font-medium">{gd ? gd.phone : ''}</td>
                  </tr>
                );
              })}
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
