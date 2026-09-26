import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import api from '../api';
import { AuthContext } from './AuthContext';

interface DatabaseContextType {
  members: any[]; setMembers: (m: any[]) => void;
  cases: any[]; setCases: (c: any[]) => void;
  contributions: any[]; setContributions: (c: any[]) => void;
  minutes: any[]; setMinutes: (m: any[]) => void;
  refreshData: () => void;
}

export const DatabaseContext = createContext<DatabaseContextType>({} as any);

export const DatabaseProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [minutes, setMinutes] = useState<any[]>([]);
  const { user } = useContext(AuthContext);

  const refreshData = async () => {
    if (!user) return;
    try {
      const [membersRes, casesRes, contribRes, minutesRes] = await Promise.all([
        api.get('/welfare/profiles/'),
        api.get('/welfare/cases/'),
        api.get('/welfare/contributions/'),
        api.get('/welfare/minutes/')
      ]);
      setMembers(membersRes.data);
      setCases(casesRes.data);
      setContributions(contribRes.data);
      setMinutes(minutesRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  return (
    <DatabaseContext.Provider value={{ members, setMembers, cases, setCases, contributions, setContributions, minutes, setMinutes, refreshData }}>
      {children}
    </DatabaseContext.Provider>
  );
};
