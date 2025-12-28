
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
import { Client, Transaction, UserProfile, AppSettings, ViewState, PaymentMethod, Language, Theme } from './types';

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
const LoginView = ({ isDark, t, settings, user, handleLogin, setView }: any) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    password: user.password || ''
  });

  const onSubmit = (e: React.FormEvent) => {
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

const ForgotPasswordView = ({ isDark, t, setView }: any) => {
  const [step, setStep] = useState(1);
  const [recoveryPhone, setRecoveryPhone] = useState('');
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen px-8 ${isDark ? 'bg-transparent text-white' : 'bg-transparent text-gray-900'}`}>
      <button onClick={() => setView('login')} className="absolute top-12 left-6 text-blue-500 flex items-center gap-1 font-bold">
        <ChevronLeft /> {t.tx_cancel}
      </button>
      <div className="w-20 h-20 bg-blue-900/10 glass rounded-3xl flex items-center justify-center mb-8">
        <Mail className="text-blue-500 w-10 h-10" />
      </div>
      <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-900'} mb-2`}>{t.login_recover_title}</h1>
      <p className="text-gray-400 mb-8 text-center">{t.login_recover_desc}</p>
      {step === 1 ? (
        <div className="w-full space-y-4">
          <input type="tel" placeholder={t.login_phone} className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-900 glass ${isDark ? 'bg-slate-800/60 text-white' : 'bg-white/80 text-gray-900'}`} value={recoveryPhone} onChange={(e) => setRecoveryPhone(e.target.value)} />
          <button onClick={() => { if(recoveryPhone.length > 5) setStep(2); }} className="w-full p-4 bg-blue-900 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">{t.login_recover_verify}</button>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <input type="password" placeholder={t.login_pass} className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-900 glass ${isDark ? 'bg-slate-800/60 text-white' : 'bg-white/80 text-gray-900'}`} />
          <button onClick={() => { alert("Password reset successful!"); setView('login'); }} className="w-full p-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">{t.login_recover_set}</button>
        </div>
      )}
    </div>
  );
};

const DashboardView = ({ isDark, t, user, settings, dashboardStats, clients, getClientBalance, setView, setSelectedClientId }: any) => (
  <div className="p-6 pb-24">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>{t.dash_greeting}, {user.name || 'Agente'}</h2>
        <p className="text-gray-500 text-sm">{new Date().toLocaleDateString(settings.language === 'pt' ? 'pt-MZ' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => setView('login')} className={`p-2 rounded-xl border border-red-500/30 text-red-500 glass ${isDark ? 'bg-red-500/10' : 'bg-red-50/50'}`}>
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 mb-8">
      {settings.accounts.superAgent && (
        <div className="bg-blue-900 p-4 rounded-3xl text-white shadow-lg glass">
          <p className="text-xs opacity-70 mb-1">Super Agente</p>
          <p className="text-lg font-bold">{dashboardStats.balances.superAgent.toLocaleString()} {settings.currency}</p>
        </div>
      )}
      {settings.accounts.mPesa && (
        <div className="bg-red-500/80 p-4 rounded-3xl text-white shadow-lg glass">
          <p className="text-xs opacity-70 mb-1">M-pesa</p>
          <p className="text-lg font-bold">{dashboardStats.balances.mPesa.toLocaleString()} {settings.currency}</p>
        </div>
      )}
      {settings.accounts.eMola && (
        <div className="bg-orange-500/80 p-4 rounded-3xl text-white shadow-lg glass">
          <p className="text-xs opacity-70 mb-1">E-mola</p>
          <p className="text-lg font-bold">{dashboardStats.balances.eMola.toLocaleString()} {settings.currency}</p>
        </div>
      )}
      {settings.accounts.cash && (
        <div className="bg-emerald-600/80 p-4 rounded-3xl text-white shadow-lg glass">
          <p className="text-xs opacity-70 mb-1">Cash</p>
          <p className="text-lg font-bold">{dashboardStats.balances.cash.toLocaleString()} {settings.currency}</p>
        </div>
      )}
    </div>
    <div className={`${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white/60 border-gray-100/50'} p-6 rounded-3xl shadow-sm mb-8 border glass`}>
      <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-blue-900'} mb-4`}>{t.dash_chart_title}</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dashboardStats.chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#f1f5f9"} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
            <Tooltip contentStyle={{backgroundColor: isDark ? '#1e293b' : '#fff', borderRadius: '16px', border: 'none'}} itemStyle={{color: '#3b82f6', fontWeight: 'bold'}} />
            <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} activeDot={{r: 6}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="space-y-4">
      <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-blue-900'}`}>{t.dash_recent}</h3>
      <div className={`${isDark ? 'bg-slate-800/40 border-slate-700/50 divide-slate-700/50' : 'bg-white/60 border-gray-100/50 divide-gray-100'} rounded-3xl p-4 shadow-sm border glass divide-y`}>
        {clients.slice(0, 3).map((client: Client) => (
          <div key={client.id} className="py-3 flex justify-between items-center cursor-pointer" onClick={() => { setSelectedClientId(client.id); setView('client-detail'); }}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center glass ${isDark ? 'bg-slate-700/50' : 'bg-blue-50/50'}`}>
                <Users className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-900'}`} />
              </div>
              <div>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{client.name}</p>
                <p className="text-xs text-gray-500">{t.settings_acc_balance}: {getClientBalance(client)} {settings.currency}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ClientsView = ({ isDark, t, clients, getClientBalance, searchQuery, setSearchQuery, setSelectedClientId, setView, setShowAddClient, settings }: any) => {
  const filteredClients = clients.filter((c: Client) => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
  );
  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>{t.nav_clients}</h2>
        <div className="relative flex-1 ml-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder={t.client_search} className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-900/20 glass ${isDark ? 'bg-slate-800/40 border-slate-700/50 text-white placeholder-slate-500' : 'bg-white/60 border-gray-200 text-gray-900 placeholder-gray-400'}`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>
      <div className="space-y-3">
        {filteredClients.map((client: Client) => {
          const balance = getClientBalance(client);
          return (
            <div key={client.id} className={`p-4 rounded-2xl shadow-sm border flex justify-between items-center active:bg-blue-900/10 cursor-pointer glass ${isDark ? 'bg-slate-800/40 border-slate-700/50 active:bg-slate-700/50' : 'bg-white/60 border-gray-100/50'}`} onClick={() => { setSelectedClientId(client.id); setView('client-detail'); }}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold glass ${isDark ? 'bg-slate-700/50 text-blue-400' : 'bg-blue-100/50 text-blue-900'}`}>{client.name.split(' ').map(n => n[0]).join('')}</div>
                <div><h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{client.name}</h4><p className="text-xs text-gray-500">{client.phone}</p></div>
              </div>
              <div className="text-right"><p className={`font-bold ${balance > 0 ? 'text-red-500' : 'text-green-500'}`}>{balance > 0 ? '-' : ''}{Math.abs(balance).toLocaleString()} {settings.currency}</p><p className="text-[10px] text-gray-400">{t.client_balance_label}</p></div>
            </div>
          );
        })}
      </div>
      <button onClick={() => setShowAddClient(true)} className="fixed bottom-24 right-6 w-14 h-14 bg-blue-900 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-10"><Plus className="w-6 h-6" /></button>
    </div>
  );
};

const ClientDetailView = ({ isDark, t, selectedClient, balance, settings, setClients, clients, setView, callClient, openSMSDebt, setShowTransactionModal, setShowSMSConfirmModal, setShowEditClientModal }: any) => {
  if (!selectedClient) return null;
  return (
    <div className={`flex flex-col h-screen ${isDark ? 'bg-transparent' : 'bg-transparent'}`}>
      <div className="bg-blue-900 p-6 pt-12 pb-10 rounded-b-[40px] text-white relative shadow-2xl glass">
        <button onClick={() => setView('clients')} className="absolute left-6 top-12 p-2 bg-white/10 rounded-xl hover:bg-white/20"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => {
          if (balance !== 0) { alert(settings.language === 'pt' ? "A conta só pode ser fechada com saldo zero." : "Account can only be closed with zero balance."); return; }
          const updatedClients = clients.map((c: Client) => c.id === selectedClient.id ? { ...c, archive: [{ dateClosed: new Date().toISOString(), transactions: c.activeAccount }, ...c.archive], activeAccount: [] } : c);
          setClients(updatedClients);
          alert(settings.language === 'pt' ? "Conta encerrada e movida para o arquivo." : "Account closed and moved to archive.");
        }} className="absolute right-6 top-12 px-4 py-2 bg-white/10 rounded-xl text-xs font-bold hover:bg-white/20 border border-white/20">{t.client_close}</button>
        <div className="flex flex-col items-center mt-6">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-3xl font-bold mb-4 backdrop-blur-sm">{selectedClient.name.split(' ').map((n: string) => n[0]).join('')}</div>
          <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
          <p className="opacity-70 text-sm mb-6">{selectedClient.phone}</p>
          <div className="grid grid-cols-4 gap-4 w-full px-4">
            <button onClick={() => callClient(selectedClient.phone)} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-900 shadow-lg"><Phone className="w-5 h-5" /></div>
              <span className="text-[10px] font-semibold">Ligar</span>
            </button>
            <button onClick={() => openSMSDebt(selectedClient)} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-900 shadow-lg"><MessageSquare className="w-5 h-5" /></div>
              <span className="text-[10px] font-semibold">Cobrar</span>
            </button>
            <button onClick={() => setShowEditClientModal(true)} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-900 shadow-lg"><Edit2 className="w-5 h-5" /></div>
              <span className="text-[10px] font-semibold">Editar</span>
            </button>
            <button onClick={() => setView('client-archive')} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-900 shadow-lg"><History className="w-5 h-5" /></div>
              <span className="text-[10px] font-semibold">Arquivo</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-24 space-y-4">
        <div className="flex justify-between items-end mb-2">
          <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>{t.client_active_ledger}</h3>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.client_debt}</p>
            <p className={`text-xl font-black ${balance > 0 ? 'text-red-500' : 'text-green-500'}`}>{balance.toLocaleString()} {settings.currency}</p>
          </div>
        </div>
        {selectedClient.activeAccount.length === 0 ? (
          <div className={`p-12 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center glass ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white/60 border-gray-100/50'}`}>
            <LayoutDashboard className="text-gray-400 w-8 h-8 mb-4" />
            <p className="text-gray-400 font-medium">{settings.language === 'pt' ? 'Nenhum movimento nesta conta.' : 'No movements in this account.'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedClient.activeAccount.map((tx: Transaction) => (
              <div key={tx.id} onClick={() => { if(tx.type === 'Outflow') setShowSMSConfirmModal({ show: true, tx }); }} className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between active:bg-opacity-50 transition-colors cursor-pointer glass ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white/60 border-gray-100/50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center glass ${tx.type === 'Inflow' ? 'bg-green-100/10 text-green-500' : 'bg-red-100/10 text-red-500'}`}>
                    {tx.type === 'Inflow' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>{tx.description || tx.type}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase">{tx.method} • {new Date(tx.date).toLocaleDateString(settings.language === 'pt' ? 'pt-MZ' : 'en-US')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${tx.type === 'Inflow' ? 'text-green-500' : 'text-red-500'}`}>{tx.type === 'Inflow' ? '+' : '-'}{tx.amount.toLocaleString()}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    {tx.settled ? <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">{t.client_liquidated}</span> : <span className="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">{t.client_pending}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="fixed bottom-6 left-6 right-6 grid grid-cols-2 gap-4">
        <button onClick={() => setShowTransactionModal({ show: true, type: 'Outflow' })} className="bg-red-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-red-600/20 active:scale-95 transition-transform flex items-center justify-center gap-2 glass"><Plus className="w-5 h-5" /> {t.tx_outflow.split(' ')[0]}</button>
        <button onClick={() => setShowTransactionModal({ show: true, type: 'Inflow' })} className="bg-green-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-green-600/20 active:scale-95 transition-transform flex items-center justify-center gap-2 glass"><Plus className="w-5 h-5" /> {t.tx_inflow.split(' ')[0]}</button>
      </div>
    </div>
  );
};

const SettingsView = ({ isDark, t, user, setUser, settings, setSettings, toggleTheme, toggleLanguage, isUserBoxOpen, setIsUserBoxOpen }: any) => (
  <div className="p-6 pb-24 h-screen overflow-y-auto">
    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-900'} mb-8`}>{t.settings_title}</h2>
    <div className="space-y-6">
      <section>
        <button onClick={() => setIsUserBoxOpen(!isUserBoxOpen)} className={`w-full flex items-center justify-between p-5 rounded-3xl border shadow-sm transition-all glass ${isDark ? 'bg-slate-800/40 border-slate-700/50 text-white' : 'bg-white/60 border-gray-100 text-gray-900'}`}>
          <div className="flex items-center gap-3"><UserIcon className="w-5 h-5 text-blue-500" /><span className="font-bold">{t.settings_user_profile}</span></div>
          {isUserBoxOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {isUserBoxOpen && (
          <div className={`mt-3 p-6 rounded-3xl border shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-200 glass ${isDark ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white/80 border-gray-100'}`}>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">{t.login_name}</label>
              <input type="text" className={`w-full p-3 rounded-xl mt-1 text-sm glass ${isDark ? 'bg-slate-700/40 text-white' : 'bg-gray-50 text-gray-800'} border-none`} value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">{t.login_phone}</label>
              <input type="tel" className={`w-full p-3 rounded-xl mt-1 text-sm glass ${isDark ? 'bg-slate-700/40 text-white' : 'bg-gray-50 text-gray-800'} border-none`} value={user.phone} onChange={(e) => setUser({...user, phone: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">{t.login_pass}</label>
              <input type="password" placeholder="••••••••" className={`w-full p-3 rounded-xl mt-1 text-sm glass ${isDark ? 'bg-slate-700/40 text-white' : 'bg-gray-50 text-gray-800'} border-none`} value={user.password || ''} onChange={(e) => setUser({...user, password: e.target.value})} />
            </div>
          </div>
        )}
      </section>
      <section>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{t.settings_appearance}</h3>
        <div className={`${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white/60 border-gray-100/50'} rounded-3xl p-5 border shadow-sm glass space-y-4`}>
          <div><label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">{t.app_name_label}</label><input type="text" className={`w-full p-3 rounded-xl text-sm glass ${isDark ? 'bg-slate-700/40 text-white' : 'bg-gray-50 text-gray-800'} border-none`} value={settings.appName} onChange={(e) => setSettings({...settings, appName: e.target.value})} /></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">{isDark ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-orange-400" />}<span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{t.settings_darkmode}</span></div>
            <button onClick={toggleTheme} className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-blue-600' : 'bg-gray-200'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDark ? 'left-7' : 'left-1'}`} /></button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><Globe className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-900'}`} /><span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{t.settings_language}</span></div>
            <button onClick={toggleLanguage} className={`px-3 py-1 rounded-xl text-xs font-bold glass ${isDark ? 'bg-slate-700/50 text-blue-400' : 'bg-blue-100/50 text-blue-900'}`}>{settings.language === 'pt' ? 'Português' : 'English'}</button>
          </div>
        </div>
      </section>
      <section>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{t.settings_sms}</h3>
        <div className={`${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white/60 border-gray-100/50'} rounded-3xl p-5 border shadow-sm glass space-y-4`}>
          <div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase">Cobrança/Debt Reminder</label><textarea className={`w-full p-3 rounded-xl text-xs glass ${isDark ? 'bg-slate-700/40 text-white' : 'bg-gray-50 text-gray-800'} border-none focus:ring-1 focus:ring-blue-900`} rows={3} value={settings.smsTemplates.debtReminder} onChange={(e) => setSettings({...settings, smsTemplates: {...settings.smsTemplates, debtReminder: e.target.value}})} /></div>
          <div className="space-y-2"><label className="text-[10px] font-bold text-gray-400 uppercase">Confirmação/Confirmation</label><textarea className={`w-full p-3 rounded-xl text-xs glass ${isDark ? 'bg-slate-700/40 text-white' : 'bg-gray-50 text-gray-800'} border-none focus:ring-1 focus:ring-blue-900`} rows={3} value={settings.smsTemplates.confirmation} onChange={(e) => setSettings({...settings, smsTemplates: {...settings.smsTemplates, confirmation: e.target.value}})} /></div>
        </div>
      </section>
    </div>
  </div>
);

// Main Application
const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('login');
  const [user, setUser] = useState<UserProfile>({ name: '', phone: '', password: '', isFirstTime: true });
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const [showEditClient, setShowEditClient] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState<{ show: boolean, type: 'Inflow' | 'Outflow' | null }>({ show: false, type: null });
  const [showSMSConfirmModal, setShowSMSConfirmModal] = useState<{ show: boolean, tx: Transaction | null }>({ show: false, tx: null });
  const [isUserBoxOpen, setIsUserBoxOpen] = useState(false);

  const t = translations[settings.language];
  const isDark = settings.theme === 'dark';

  const dashboardStats = useMemo(() => {
    const data = [
      { day: 'Mon', total: 45000 }, { day: 'Tue', total: 52000 }, { day: 'Wed', total: 48000 }, { day: 'Thu', total: 61000 }, { day: 'Fri', total: 55000 }, { day: 'Sat', total: 67000 }, { day: 'Sun', total: 72000 },
    ];
    return { chartData: data, balances: { superAgent: 125000, mPesa: 45000, eMola: 32000, cash: 12500 } };
  }, []);

  const selectedClient = clients.find(c => c.id === selectedClientId);

  const handleLogin = (data: any) => {
    setUser({ ...user, ...data, isFirstTime: false });
    setView('dashboard');
  };

  const getClientBalance = (client: Client) => {
    return client.activeAccount.reduce((acc, curr) => curr.type === 'Inflow' ? acc - curr.amount : acc + curr.amount, 0);
  };

  const sendConfirmationSMS = (client: Client, tx: Transaction) => {
    const text = settings.smsTemplates.confirmation.replace('{amount}', tx.amount.toString()).replace('{currency}', settings.currency).replace('{desc}', tx.description || tx.type);
    window.location.href = `sms:${client.phone}?body=${encodeURIComponent(text)}`;
  };

  const openSMSDebt = (client: Client) => {
    const balance = getClientBalance(client);
    const text = settings.smsTemplates.debtReminder.replace('{amount}', balance.toString()).replace('{currency}', settings.currency);
    window.location.href = `sms:${client.phone}?body=${encodeURIComponent(text)}`;
  };

  const callClient = (phone: string) => { window.location.href = `tel:${phone}`; };
  const toggleTheme = () => setSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  const toggleLanguage = () => setSettings(prev => ({ ...prev, language: prev.language === 'pt' ? 'en' : 'pt' }));

  return (
    <div className={`max-w-md mx-auto min-h-screen relative overflow-hidden flex flex-col transition-colors duration-300 ${isDark ? 'bg-slate-900/40' : 'bg-gray-50/40'}`}>
      <main className="flex-1 overflow-y-auto">
        {view === 'login' && <LoginView isDark={isDark} t={t} settings={settings} user={user} handleLogin={handleLogin} setView={setView} />}
        {view === 'forgot-password' && <ForgotPasswordView isDark={isDark} t={t} setView={setView} />}
        {view === 'dashboard' && <DashboardView isDark={isDark} t={t} user={user} settings={settings} dashboardStats={dashboardStats} clients={clients} getClientBalance={getClientBalance} setView={setView} setSelectedClientId={setSelectedClientId} />}
        {view === 'clients' && <ClientsView isDark={isDark} t={t} clients={clients} getClientBalance={getClientBalance} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setSelectedClientId={setSelectedClientId} setView={setView} setShowAddClient={setShowAddClient} settings={settings} />}
        {view === 'client-detail' && <ClientDetailView isDark={isDark} t={t} selectedClient={selectedClient} balance={selectedClient ? getClientBalance(selectedClient) : 0} settings={settings} setClients={setClients} clients={clients} setView={setView} callClient={callClient} openSMSDebt={openSMSDebt} setShowTransactionModal={setShowTransactionModal} setShowSMSConfirmModal={setShowSMSConfirmModal} setShowEditClientModal={setShowEditClient} />}
        {view === 'client-archive' && <ClientArchiveView isDark={isDark} t={t} selectedClient={selectedClient} setView={setView} />}
        {view === 'settings' && <SettingsView isDark={isDark} t={t} user={user} setUser={setUser} settings={settings} setSettings={setSettings} toggleTheme={toggleTheme} toggleLanguage={toggleLanguage} isUserBoxOpen={isUserBoxOpen} setIsUserBoxOpen={setIsUserBoxOpen} />}
      </main>
      {view !== 'login' && view !== 'forgot-password' && view !== 'client-detail' && view !== 'client-archive' && (
        <div className={`fixed bottom-0 left-0 right-0 border-t h-20 safe-bottom flex items-center justify-around px-4 z-40 glass ${isDark ? 'bg-slate-900/80 border-slate-800/50' : 'bg-white/80 border-gray-100/50'}`}>
          <button onClick={() => setView('dashboard')} className={`flex flex-col items-center gap-1 transition-colors ${view === 'dashboard' ? 'text-blue-500' : 'text-gray-400'}`}><LayoutDashboard className={`w-6 h-6 ${view === 'dashboard' ? 'fill-current' : ''}`} /><span className="text-[10px] font-bold">{t.nav_home}</span></button>
          <button onClick={() => setView('clients')} className={`flex flex-col items-center gap-1 transition-colors ${view === 'clients' || view === 'client-detail' || view === 'client-archive' ? 'text-blue-500' : 'text-gray-400'}`}><Users className={`w-6 h-6 ${view === 'clients' ? 'fill-current' : ''}`} /><span className="text-[10px] font-bold">{t.nav_clients}</span></button>
          <button onClick={() => setView('settings')} className={`flex flex-col items-center gap-1 transition-colors ${view === 'settings' ? 'text-blue-500' : 'text-gray-400'}`}><SettingsIcon className={`w-6 h-6 ${view === 'settings' ? 'fill-current' : ''}`} /><span className="text-[10px] font-bold">{t.nav_settings}</span></button>
        </div>
      )}
      {showAddClient && <AddClientModal isDark={isDark} t={t} setShowAddClient={setShowAddClient} initialSearch={searchQuery} handleSaveNewClient={(n:string, p:string) => { const nc: Client = { id: Math.random().toString(36).substr(2, 9), name: n, phone: p, activeAccount: [], archive: [] }; setClients([...clients, nc]); setShowAddClient(false); }} />}
      {showEditClient && selectedClient && <EditClientModal isDark={isDark} t={t} client={selectedClient} setShowEditClient={setShowEditClient} handleUpdateClient={(n:string, p:string) => { setClients(clients.map(c => c.id === selectedClient.id ? {...c, name: n, phone: p} : c)); setShowEditClient(false); }} />}
      {showTransactionModal.show && <TransactionModal isDark={isDark} t={t} settings={settings} showTransactionModal={showTransactionModal} selectedClient={selectedClient} clients={clients} setClients={setClients} setShowTransactionModal={setShowTransactionModal} setShowSMSConfirmModal={setShowSMSConfirmModal} />}
      {showSMSConfirmModal.show && <SMSConfirmModal isDark={isDark} t={t} settings={settings} showSMSConfirmModal={showSMSConfirmModal} setShowSMSConfirmModal={setShowSMSConfirmModal} selectedClient={selectedClient} sendConfirmationSMS={sendConfirmationSMS} />}
    </div>
  );
};

const AddClientModal = ({ isDark, t, setShowAddClient, handleSaveNewClient, initialSearch }: any) => {
  const isPhone = initialSearch && /^[0-9+]+$/.test(initialSearch);
  const [newName, setNewName] = useState(!isPhone ? initialSearch : '');
  const [newPhone, setNewPhone] = useState(isPhone ? initialSearch : '');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-200 glass`}>
        <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-blue-900'}`}>{t.client_new}</h3>
        <div className="space-y-4 mb-8">
          <input type="text" placeholder={t.login_name} className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-900 glass ${isDark ? 'bg-slate-700/50 text-white' : 'bg-gray-50/50 text-gray-900'}`} value={newName} onChange={(e) => setNewName(e.target.value)} />
          <input type="tel" placeholder={t.login_phone + " (+258)"} className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-900 glass ${isDark ? 'bg-slate-700/50 text-white' : 'bg-gray-50/50 text-gray-900'}`} value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowAddClient(false)} className={`flex-1 p-4 rounded-2xl font-bold active:scale-95 transition-transform glass ${isDark ? 'bg-slate-700/50 text-slate-400' : 'bg-gray-100/50 text-gray-500'}`}>{t.tx_cancel}</button>
          <button onClick={() => handleSaveNewClient(newName, newPhone)} className="flex-1 p-4 bg-blue-900 text-white rounded-2xl font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-transform">{t.modal_save}</button>
        </div>
      </div>
    </div>
  );
};

const EditClientModal = ({ isDark, t, client, setShowEditClient, handleUpdateClient }: any) => {
  const [name, setName] = useState(client.name);
  const [phone, setPhone] = useState(client.phone);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-200 glass`}>
        <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-blue-900'}`}>{t.client_edit}</h3>
        <div className="space-y-4 mb-8">
          <input type="text" placeholder={t.login_name} className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-900 glass ${isDark ? 'bg-slate-700/50 text-white' : 'bg-gray-50/50 text-gray-900'}`} value={name} onChange={(e) => setName(e.target.value)} />
          <input type="tel" placeholder={t.login_phone} className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-900 glass ${isDark ? 'bg-slate-700/50 text-white' : 'bg-gray-50/50 text-gray-900'}`} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowEditClient(false)} className={`flex-1 p-4 rounded-2xl font-bold active:scale-95 transition-transform glass ${isDark ? 'bg-slate-700/50 text-slate-400' : 'bg-gray-100/50 text-gray-500'}`}>{t.tx_cancel}</button>
          <button onClick={() => handleUpdateClient(name, phone)} className="flex-1 p-4 bg-blue-900 text-white rounded-2xl font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-transform">{t.modal_save}</button>
        </div>
      </div>
    </div>
  );
};

const SMSConfirmModal = ({ isDark, t, settings, showSMSConfirmModal, setShowSMSConfirmModal, selectedClient, sendConfirmationSMS }: any) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-sm">
    <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-200 glass`}>
      <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-900"><Send className="w-5 h-5" /></div><h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>{t.sms_confirm_prompt}</h3></div>
      <p className="text-sm text-gray-500 mb-8">{settings.smsTemplates.confirmation.replace('{amount}', showSMSConfirmModal.tx?.amount.toString() || '0').replace('{currency}', settings.currency).replace('{desc}', showSMSConfirmModal.tx?.description || '')}</p>
      <div className="flex gap-4">
        <button onClick={() => setShowSMSConfirmModal({ show: false, tx: null })} className={`flex-1 p-4 rounded-2xl font-bold glass ${isDark ? 'bg-slate-700/50 text-slate-400' : 'bg-gray-100/50 text-gray-500'}`}>{t.tx_cancel}</button>
        <button onClick={() => { if(selectedClient && showSMSConfirmModal.tx) sendConfirmationSMS(selectedClient, showSMSConfirmModal.tx); setShowSMSConfirmModal({ show: false, tx: null }); }} className="flex-1 p-4 bg-blue-900 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">{t.sms_confirm_btn}</button>
      </div>
    </div>
  </div>
);

const TransactionModal = ({ isDark, t, settings, showTransactionModal, selectedClient, clients, setClients, setShowTransactionModal, setShowSMSConfirmModal }: any) => {
  const [formData, setFormData] = useState({ amount: '', method: 'Cash' as PaymentMethod, date: new Date().toISOString().split('T')[0], desc: '' });
  const handleSubmit = () => {
    if (!selectedClient || !showTransactionModal.type) return;
    const amt = parseFloat(formData.amount);
    if (isNaN(amt) || amt <= 0) return;
    const newTx: Transaction = { id: Math.random().toString(36).substr(2, 9), type: showTransactionModal.type, amount: amt, method: formData.method, date: formData.date, dueDate: formData.date, description: formData.desc, settled: showTransactionModal.type === 'Inflow' };
    const updatedClients = clients.map((c: Client) => c.id === selectedClient.id ? { ...c, activeAccount: [newTx, ...c.activeAccount] } : c);
    setClients(updatedClients);
    setShowTransactionModal({ show: false, type: null });
    if (newTx.type === 'Outflow') setShowSMSConfirmModal({ show: true, tx: newTx });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-300 glass`}>
        <div className="flex justify-between items-center mb-6"><h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-blue-900'}`}>{showTransactionModal.type === 'Inflow' ? t.tx_inflow : t.tx_outflow}</h3><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${showTransactionModal.type === 'Inflow' ? 'bg-green-100/50 text-green-500' : 'bg-red-100/50 text-red-500'}`}>{showTransactionModal.type === 'Inflow' ? <ArrowDownLeft /> : <ArrowUpRight />}</div></div>
        <div className="space-y-4 mb-8">
          <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">{t.tx_amount} ({settings.currency})</label><input type="number" placeholder="0.00" className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-900 text-lg font-bold glass ${isDark ? 'bg-slate-700/50 text-white' : 'bg-gray-50/50 text-gray-900'}`} value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} /></div>
          <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">{t.tx_method}</label><div className="grid grid-cols-3 gap-2">{['Cash', 'M-pesa', 'E-mola'].map(m => (<button key={m} onClick={() => setFormData({ ...formData, method: m as PaymentMethod })} className={`p-2 rounded-xl text-xs font-bold transition-all glass ${formData.method === m ? 'bg-blue-900 text-white shadow-md' : (isDark ? 'bg-slate-700/50 text-slate-400' : 'bg-gray-100/50 text-gray-500')}`}>{m}</button>))}</div></div>
          <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">{t.tx_date}</label><input type="date" className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-900 text-sm glass ${isDark ? 'bg-slate-700/50 text-white' : 'bg-gray-50/50 text-gray-900'}`} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} /></div>
          <div><label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">{t.tx_desc}</label><input type="text" placeholder="Ex: Pagamento" className={`w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-900 text-sm glass ${isDark ? 'bg-slate-700/50 text-white' : 'bg-gray-50/50 text-gray-900'}`} value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} /></div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowTransactionModal({ show: false, type: null })} className={`flex-1 p-4 rounded-2xl font-bold active:scale-95 transition-transform glass ${isDark ? 'bg-slate-700/50 text-slate-400' : 'bg-gray-100/50 text-gray-500'}`}>{t.tx_cancel}</button>
          <button onClick={handleSubmit} className={`flex-1 p-4 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-transform ${showTransactionModal.type === 'Inflow' ? 'bg-green-600 shadow-green-600/20' : 'bg-red-600 shadow-red-600/20'}`}>{t.tx_confirm}</button>
        </div>
      </div>
    </div>
  );
};

const ClientArchiveView = ({ isDark, t, selectedClient, setView }: any) => {
  if (!selectedClient) return null;
  return (
    <div className={`flex flex-col h-screen ${isDark ? 'bg-transparent' : 'bg-transparent'}`}>
      <div className="bg-blue-900 p-6 pt-12 pb-6 rounded-b-[40px] text-white flex items-center justify-between glass">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('client-detail')} className="p-2 bg-white/10 rounded-xl hover:bg-white/20">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">{t.client_archive_title}</h2>
        </div>
        <button onClick={() => window.print()} className="p-2 bg-white/10 rounded-xl hover:bg-white/20">
          <Printer className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {selectedClient.archive.length === 0 ? <div className="text-center p-12 text-gray-500"><History className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>{t.archive_empty}</p></div> : selectedClient.archive.map((arch: any, idx: number) => (
          <div key={idx} className={`${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white/60 border-gray-100/50'} p-5 rounded-3xl border shadow-sm glass`}>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-50/50"><span className="text-xs font-bold text-gray-400">{t.archive_date}: {new Date(arch.dateClosed).toLocaleDateString()}</span><span className="text-xs bg-gray-100/20 text-gray-400 px-2 py-1 rounded-lg font-bold">Encerrada</span></div>
            <div className="space-y-3">{arch.transactions.map((tx: Transaction) => (
              <div key={tx.id} className="flex justify-between text-sm"><span className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{tx.description || tx.type}</span><span className={`font-bold ${tx.type === 'Inflow' ? 'text-green-500' : 'text-red-500'}`}>{tx.type === 'Inflow' ? '+' : '-'}{tx.amount.toLocaleString()}</span></div>
            ))}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const INITIAL_CLIENTS: Client[] = [
  { id: '1', name: 'Bernardo Matola', phone: '+258 84 123 4567', activeAccount: [ { id: 't1', type: 'Outflow', amount: 5000, method: 'M-pesa', date: '2023-10-01', dueDate: '2023-10-15', description: 'Loan for stock', settled: false }, { id: 't2', type: 'Inflow', amount: 2000, method: 'Cash', date: '2023-10-05', dueDate: '2023-10-05', description: 'Partial payment', settled: true } ], archive: [] },
  { id: '2', name: 'Helena Sitoe', phone: '+258 82 987 6543', activeAccount: [], archive: [] }
];

const INITIAL_SETTINGS: AppSettings = {
  appName: 'Super Agente MNG NICE', currency: 'Mts', language: 'pt', theme: 'dark',
  accounts: { superAgent: true, mPesa: true, eMola: true, cash: true },
  smsTemplates: { confirmation: "Super Agente MNG NICE: Confirmamos a saída de {amount} {currency} em sua conta. Referência: {desc}", debtReminder: "Lembrete: Tens um saldo em dívida de {amount} {currency}. Favor regularizar." }
};

export default App;
