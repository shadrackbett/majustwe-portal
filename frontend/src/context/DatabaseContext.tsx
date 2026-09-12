import React, { createContext, useState, ReactNode } from 'react';

// Initial Mock Data
const initialMembers = [
  { id: 1, memberNo: 'M001', name: 'Sarah Ochieng', zone: 'Tsimba-Tiwi', type: 'FULL', status: 'ACTIVE', role: 'SECRETARY', phone: '0700111222', email: 'sarah@example.com', spouse_name: 'John Ochieng', dependents: ['Alice Ochieng (Daughter)', 'Bob Ochieng (Son)'], guardians: ['Mark Ochieng (Brother) - 0711000111'] },
  { id: 2, memberNo: 'M002', name: 'David Mutisya', zone: 'Ngombeni-Waa', type: 'ASSOCIATE', status: 'INACTIVE', role: 'MEMBER', phone: '0711222333', email: 'david@example.com', spouse_name: 'Mary Mutisya', dependents: [], guardians: [] },
  { id: 3, memberNo: 'M003', name: 'Jane Kamau', zone: 'Tsimba-Tiwi', type: 'FULL', status: 'ACTIVE', role: 'TREASURER', phone: '0733444555', email: 'jane@example.com', spouse_name: 'Peter Kamau', dependents: ['Lucy Kamau (Daughter)'], guardians: ['James Kamau (Husband) - 0722000222'] },
  { id: 4, memberNo: null, name: 'Alice Waithera', zone: 'Ngombeni-Waa', type: 'FULL', status: 'ACTIVE_INCOMPLETE', role: 'MEMBER', phone: '0755666777', email: 'alice@example.com', spouse_name: 'Bob Waithera', dependents: [], guardians: [] },
  { id: 5, memberNo: null, name: 'Brian Kip', zone: 'Tsimba-Tiwi', type: 'FULL', status: 'PENDING_SECRETARY', role: 'MEMBER', phone: '0799888777', email: 'brian@example.com', spouse_name: 'Grace Kip', dependents: ['Tom Kip (Son)'], guardians: ['Mary Kip (Sister) - 0733000333'] }
];

const initialCases = [
  { id: 1, title: 'Bereavement: Mr. Smith', requiredAmount: 500, active: true, createdAt: '2026-09-01' },
  { id: 2, title: 'Medical: Mrs. Ochieng', requiredAmount: 1000, active: true, createdAt: '2026-09-10' }
];

const initialContributions = [
  { id: 1, memberId: 1, caseId: 1, paid: 500, status: 'CLEARED' },
  { id: 2, memberId: 1, caseId: 2, paid: 0, status: 'PENDING' },
  { id: 3, memberId: 2, caseId: 1, paid: 250, status: 'PENDING' },
];

const initialMinutes = [
  { id: 1, title: 'Annual General Meeting 2026', date: '2026-08-15', excerpt: 'Discussed the increment of the emergency kitty...' }
];

interface DatabaseContextType {
  members: any[]; setMembers: (m: any[]) => void;
  cases: any[]; setCases: (c: any[]) => void;
  contributions: any[]; setContributions: (c: any[]) => void;
  minutes: any[]; setMinutes: (m: any[]) => void;
}

export const DatabaseContext = createContext<DatabaseContextType>({} as any);

export const DatabaseProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [members, setMembers] = useState(initialMembers);
  const [cases, setCases] = useState(initialCases);
  const [contributions, setContributions] = useState(initialContributions);
  const [minutes, setMinutes] = useState(initialMinutes);

  return (
    <DatabaseContext.Provider value={{ members, setMembers, cases, setCases, contributions, setContributions, minutes, setMinutes }}>
      {children}
    </DatabaseContext.Provider>
  );
};
