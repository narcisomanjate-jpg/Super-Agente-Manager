import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings as SettingsIcon, 
  Plus, 
  Search, 
  Phone, 
  MessageSquare, 
  History, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownLeft,
  LogOut,
  ChevronLeft,
  Moon,
  Sun,
  Globe,
  Mail,
  User as UserIcon,
  ChevronDown,
  ChevronUp,
  Send,
  Edit2,
  Printer
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Importações de types.ts são removidas pois o TypeScript não é usado
// Pode precisar ajustar './types' para './types.js' se converter esse arquivo
// import { Client, Transaction, UserProfile, AppSettings, ViewState, PaymentMethod, Language, Theme } from './types.js';

// Translation Dictionary
const translations = {
  pt: {
    login_subtitle: "Gestão Financeira para Agentes em Moçambique",
    login_name: "Nome Completo",
    login_phone: "Telefone",
    login_pass: "Senha",
    login_btn_create: "Criar Conta",
    login_btn_signin: "Entrar",
    login_forgot: "Esqueceu a Senha?",
    login_recover_title: "Recuperar Conta",
    login_recover_desc: "Confirme o número para definir nova senha",
    login_recover_verify: "Verificar Número",
    login_recover_set: "Definir Nova Senha",
    nav_home: "Início",
    nav_clients: "Clientes",
    nav_settings: "Ajustes",
    dash_greeting: "Bom dia",
    dash_chart_title: "Agregado Total (Últimos 7 Dias)",
    dash_recent: "Atividade Recente",
    client_search: "Pesquisar clientes...",
    client_new: "Novo Cliente",
    client_balance_label: "Saldo Atual",
    client_close: "Fechar Conta",
    client_active_ledger: "Extrato Activo",
    client_archive_title: "Arquivo de Contas",
    client_debt: "Saldo Devido",
    client_liquidated: "Liquidado",
    client_pending: "Pendente",
    tx_inflow: "Entrada (Crédito)",
    tx_outflow: "Saída (Débito)",
    tx_amount: "Valor",
    tx_method: "Método",
    tx_date: "Data",
    tx_desc: "Descrição",
    tx_cancel: "Cancelar",
    tx_confirm: "Confirmar",
    settings_title: "Ajustes",
    settings_appearance: "Aparência",
    settings_darkmode: "Modo Escuro",
    settings_language: "Idioma",
    settings_user_profile: "Usuário",
    settings_accounts: "Contas Ativas",
    settings_localization: "Localização",
    settings_currency: "Moeda Padrão",
    settings_sms: "Configuração de SMS",
    settings_logout: "Sair da Conta",
    settings_edit: "Editar Dados",
    settings_pass: "Alterar Senha",
    settings_acc_balance: "Saldo",
    modal_save: "Salvar",
    archive_empty: "Sem contas arquivadas",
    archive_date: "Encerrada em",
    app_name_label: "Nome do Aplicativo",
    sms_confirm_prompt: "Deseja enviar mensagem de confirmação?",
    sms_confirm_btn: "Enviar SMS",
    client_edit: "Editar Cliente"
  },
  en: {
    login_subtitle: "Financial Management for Mozambique Agents",
    login_name: "Full Name",
    login_phone: "Phone Number",
    login_pass: "Password",
    login_btn_create: "Create Account",
    login_btn_signin: "Sign In",
    login_forgot: "Forgot Password?",
    login_recover_title: "Recover Account",
    login_recover_desc: "Verify number to set new password",
    login_recover_verify: "Verify Number",
    login_recover_set: "Set New Password",
    nav_home: "Home",
    nav_clients: "Clients",
    nav_settings: "Settings",
    dash_greeting: "Good Morning",
    dash_chart_title: "Total Aggregate (Last 7 Days)",
    dash_recent: "Recent Activity",
    client_search: "Search clients...",
    client_new: "New Client",
    client_balance_label: "Current Balance",
    client_close: "Close Account",
    client_active_ledger: "Active Ledger",
    client_archive_title: "Account Archive",
    client_debt: "Balance Due",
    client_liquidated: "Settled",
    client_pending: "Pending",
    tx_inflow: "Inflow (Credit)",
    tx_outflow: "Outflow (Debit)",
    tx_amount: "Amount",
    tx_method: "Method",
    tx_date: "Date",
    tx_desc: "Description",
    tx_cancel: "Cancel",
    tx_confirm: "Confirm",
    settings_title: "Settings",
    settings_appearance: "Appearance",
    settings_darkmode: "Dark Mode",
    settings_language: "Language",
    settings_user_profile: "User",
    settings_accounts: "Active Accounts",
    settings_localization: "Localization",
    settings_currency: "Default Currency",
    settings_sms: "SMS Settings",
    settings_logout: "Logout",
    settings_edit: "Edit Info",
    settings_pass: "Change Password",
    settings_acc_balance: "Balance",
    modal_save: "Save",
    archive_empty: "No archived accounts",
    archive_date: "Closed on",
    app_name_label: "App Name",
    sms_confirm_prompt: "Send confirmation message?",
    sms_confirm_btn: "Send SMS",
    client_edit: "Edit Client"
  }
};

// Standalone View Components
const LoginView = ({ isDark, t, settings, user, handleLogin, setView }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    password: user.password || ''
  });

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(formData);
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen px-8 ${isDark ? 'bg-transparent text-white' : 'bg-transparent text-gray-900'}`}>
      <div className="w-20 h-20 bg-blue-900 rounded-3xl flex items-center justify-center mb-8 shadow-xl">
        <LayoutDashboard className="text-white w-10 h-10" />
      </div>
      <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-blue-900'} mb-2`}>{settings.appName}</h1>
      <p className="text-gray-400 mb-10 text-center">{t.login_subtitle}</p>
      <form onSubmit={onSubmit} className="w-full space-y-4">
        {user.isFirstTime && (
          <>
            <input 
              type="text" 
              placeholder={t.login_name} 
              className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-900 glass ${isDark ? 'bg-slate-800/60 text-white placeholder-slate-500' : 'bg-white/80 text-gray-900 placeholder-gray-400'}`} 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input 
              type="tel" 
              placeholder={t.login_phone} 
              className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-900 glass ${isDark ? 'bg-slate-800/60 text-white placeholder-slate-500' : 'bg-white/80 text-gray-900 placeholder-gray-400'}`} 
              required 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </>
        )}
        <input 
          type="password" 
          placeholder={t.login_pass} 
          className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-900 glass ${isDark ? 'bg-slate-800/60 text-white placeholder-slate-500' : 'bg-white/80 text-gray-900 placeholder-gray-400'}`} 
          required 
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button type="submit" className="w-full p-4 bg-blue-900 text-white rounded-2xl font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-transform">
          {user.isFirstTime ? t.login_btn_create : t.login_btn_signin}
        </button>
      </form>
      {!user.isFirstTime && <button onClick={() => setView('forgot-password')} className="mt-6 text-blue-500 font-semibold">{t.login_forgot}</button>}
    </div>
  );
};

const ForgotPasswordView = ({ isDark, t, setView }) => {
  const [step, setStep] = useState(1);
  const [recoveryPhone, setRecoveryPhone] = useState('');
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen px-8 ${isDark ? 'bg-transparent text-white' : 'bg-transparent text-gray-900'}`}>
      <button onClick={() => setView('login')} className="absolute top-12 left-6 text-blue-500 flex items-center gap-1 font-bold">
        <ChevronLeft /> {t.tx_cancel}
      </button>
      <div className="w-20 h-20 bg-blue-900/10 glass rounded-3xl flex items-center justify-center mb-8">
        <Mail className="text-blue-500 w-10 h-10" />
      </div
