
export type PaymentMethod = 'Cash' | 'M-pesa' | 'E-mola';

export interface Transaction {
  id: string;
  type: 'Inflow' | 'Outflow';
  amount: number;
  method: PaymentMethod;
  date: string;
  dueDate: string;
  description: string;
  settled: boolean;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  activeAccount: Transaction[];
  archive: { dateClosed: string; transactions: Transaction[] }[];
}

export interface UserProfile {
  name: string;
  phone: string;
  password?: string;
  isFirstTime: boolean;
}

export type Language = 'pt' | 'en';
export type Theme = 'light' | 'dark';

export interface AppSettings {
  appName: string;
  currency: string;
  language: Language;
  theme: Theme;
  accounts: {
    superAgent: boolean;
    mPesa: boolean;
    eMola: boolean;
    cash: boolean;
  };
  smsTemplates: {
    confirmation: string;
    debtReminder: string;
  };
}

export type ViewState = 'login' | 'forgot-password' | 'dashboard' | 'clients' | 'client-detail' | 'client-archive' | 'settings';
