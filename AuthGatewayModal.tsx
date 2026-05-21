import React, { useState, useEffect } from 'react';
import { X, User, Lock, Mail, Phone, MapPin, Sparkles, CheckCircle, LogOut } from 'lucide-react';
import { ClientAccount } from '../types';
import { Language, translations } from '../translations';

interface AuthGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminActivate: () => void;
  language?: Language;
}

export default function AuthGatewayModal({
  isOpen,
  onClose,
  onAdminActivate,
  language = 'FR'
}: AuthGatewayModalProps) {
  const [activeMode, setActiveMode] = useState<'signin' | 'signup' | 'dashboard'>('signin');
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [loggedInClient, setLoggedInClient] = useState<any>(null);

  const t = (key: string) => {
    return (translations[language] as any)[key] || key;
  };

  useEffect(() => {
    const saved = localStorage.getItem('merakya_logged_client');
    if (saved) {
      setLoggedInClient(JSON.parse(saved));
      setActiveMode('dashboard');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Retrieve client list helper
  const getClientsList = (): any[] => {
    const stored = localStorage.getItem('merakya_clients');
    return stored ? JSON.parse(stored) : [
      { id: 'cli-1', fullName: "Yasmine Alami", email: "yasmine@alami.ma", phone: "+212 661-234567", city: "Casablanca", registeredAt: "19/05/2026", password: "123" },
      { id: 'cli-2', fullName: "Anas Benjeloun", email: "anas.bj@gmail.com", phone: "+212 663-889900", city: "Marrakech", registeredAt: "18/05/2026", password: "123" }
    ];
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const clients = getClientsList();
    const found = clients.find(c => c.email.toLowerCase() === loginEmail.trim().toLowerCase() && c.password === loginPassword);
    
    if (found) {
      localStorage.setItem('merakya_logged_client', JSON.stringify(found));
      setLoggedInClient(found);
      setActiveMode('dashboard');
      setSuccessMsg(`✨ ${t('auth_success_signin')}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setErrorMsg(t('auth_error_credentials'));
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regName || !regEmail || !regPassword) {
      setErrorMsg(t('auth_validation_required'));
      return;
    }

    const clients = getClientsList();
    if (clients.some(c => c.email.toLowerCase() === regEmail.trim().toLowerCase())) {
      setErrorMsg(t('auth_email_exists'));
      return;
    }

    const newClientObj = {
      id: 'cli-' + Date.now(),
      fullName: regName,
      email: regEmail.trim().toLowerCase(),
      phone: regPhone || (language === 'EN' ? "+212 6..." : "+212 6..."),
      city: regCity || (language === 'EN' ? "Morocco" : "Maroc"),
      registeredAt: new Date().toLocaleDateString(language === 'EN' ? 'en-US' : 'fr-FR'),
      password: regPassword,
      totalOrders: 0
    };

    const updated = [...clients, newClientObj];
    localStorage.setItem('merakya_clients', JSON.stringify(updated));
    localStorage.setItem('merakya_logged_client', JSON.stringify(newClientObj));
    
    setLoggedInClient(newClientObj);
    setActiveMode('dashboard');
    setSuccessMsg(`✨ ${t('auth_success_signup')}`);
    setTimeout(() => setSuccessMsg(''), 4500);

    // Reset fields
    setRegName('');
    setRegEmail('');
    setRegPhone('');
    setRegCity('');
    setRegPassword('');
  };

  const handleLogout = () => {
    localStorage.removeItem('merakya_logged_client');
    setLoggedInClient(null);
    setActiveMode('signin');
  };

  return (
    <div id="auth-gateway-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        id="auth-backdrop"
        onClick={onClose} 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="relative bg-[#F7F2EB] max-w-md w-full rounded-sm overflow-hidden border border-[#E8DCC6] shadow-2xl z-10 p-6 md:p-8">
        {/* Close Button */}
        <button
          id="btn-close-auth"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#1E1A16] hover:text-[#A67C52] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto bg-[#E8DCC6]/40 p-2.5 rounded-full w-max h-max border border-[#E8DCC6] mb-3">
            <User className="h-6 w-6 text-[#A67C52]" />
          </div>
          <h2 className="font-serif text-2xl text-[#1E1A16] tracking-wide font-normal">
            {activeMode === 'dashboard' ? t('auth_title_sacred') : t('auth_title_member')}
          </h2>
          <p className="text-[10px] tracking-widest text-[#A67C52] uppercase mt-1">
            {t('auth_kicker')}
          </p>
        </div>

        {/* Modal Selection Tabs */}
        {activeMode !== 'dashboard' && (
          <div className="flex border-b border-[#E8DCC6] text-xs space-x-6 mb-6 justify-center">
            <button
              onClick={() => { setActiveMode('signin'); setErrorMsg(''); }}
              className={`pb-2 uppercase tracking-widest font-bold transition-all ${
                activeMode === 'signin' ? 'border-b-2 border-[#A67C52] text-[#A67C52]' : 'text-gray-400 hover:text-[#1E1A16]'
              }`}
            >
              {t('auth_tab_signin')}
            </button>
            <button
              onClick={() => { setActiveMode('signup'); setErrorMsg(''); }}
              className={`pb-2 uppercase tracking-widest font-bold transition-all ${
                activeMode === 'signup' ? 'border-b-2 border-[#A67C52] text-[#A67C52]' : 'text-gray-400 hover:text-[#1E1A16]'
              }`}
            >
              {t('auth_tab_signup')}
            </button>
          </div>
        )}

        {/* Feedback Messages */}
        {successMsg && (
          <div className="mb-4 bg-green-50 border border-green-200 text-xs text-green-800 p-3 rounded-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 text-xs text-red-700 p-3 rounded-sm">
            {errorMsg}
          </div>
        )}

        {/* SignIn UI */}
        {activeMode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#A67C52] mb-1">{t('auth_email_lbl')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#A67C52]/50" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full bg-white border border-[#E8DCC6] pl-10 pr-4 py-2.5 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#A67C52] mb-1">{t('auth_pword_lbl')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#A67C52]/50" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#E8DCC6] pl-10 pr-4 py-2.5 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1E1A16] hover:bg-[#A67C52] text-[#F7F2EB] py-3 text-xs uppercase font-bold tracking-widest transition-colors rounded-sm"
            >
              {t('auth_btn_signin')}
            </button>
          </form>
        )}

        {/* SignUp UI */}
        {activeMode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#A67C52] mb-1">{t('auth_name_lbl')}</label>
              <input
                type="text"
                required
                value={regName}
                onChange={e => setRegName(e.target.value)}
                placeholder={language === 'EN' ? "e.g. Selma Alami" : "Ex: Selma Alami"}
                className="w-full bg-white border border-[#E8DCC6] px-3 py-2 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#A67C52] mb-1">{t('auth_email_lbl')} *</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full bg-white border border-[#E8DCC6] px-3 py-2 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#A67C52] mb-1">{t('auth_phone_lbl')}</label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  placeholder="+212 ..."
                  className="w-full bg-white border border-[#E8DCC6] px-3 py-2 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#A67C52] mb-1">{t('auth_city_lbl')}</label>
                <input
                  type="text"
                  value={regCity}
                  onChange={e => setRegCity(e.target.value)}
                  placeholder={language === 'EN' ? "e.g. Marrakech" : "Ex: Marrakech"}
                  className="w-full bg-white border border-[#E8DCC6] px-3 py-2 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#A67C52] mb-1">{t('auth_pword_create_lbl')}</label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-[#E8DCC6] px-3 py-2 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1E1A16] hover:bg-[#A67C52] text-[#F7F2EB] py-3 text-xs uppercase font-bold tracking-widest transition-colors rounded-sm"
            >
              {t('auth_btn_signup')}
            </button>
          </form>
        )}

        {/* Dashboard Client UI */}
        {activeMode === 'dashboard' && loggedInClient && (
          <div className="space-y-4 pt-2">
            <div className="bg-[#E8DCC6]/30 p-4 border border-[#E8DCC6] rounded-sm space-y-2">
              <p className="text-xs text-[#A67C52] font-semibold tracking-wide flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> {t('auth_personal_initiated')}
              </p>
              <h3 className="font-serif text-[#1E1A16] text-lg font-bold">
                {loggedInClient.fullName}
              </h3>
              <div className="text-xs text-[#1E1A16]/85 space-y-1 pt-1 border-t border-[#E8DCC6]/60">
                <p className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-[#A67C52]" /> {loggedInClient.email}</p>
                <p className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-[#A67C52]" /> {loggedInClient.phone}</p>
                <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-[#A67C52]" /> {t('auth_city_prefix')} {loggedInClient.city}</p>
                <p className="font-sans text-[10px] text-gray-500 uppercase mt-2 pt-1">{t('auth_member_since')} {loggedInClient.registeredAt}</p>
              </div>
            </div>

            <div className="border border-[#E8DCC6] p-3 text-xs text-[#1E1A16]/80 bg-white">
              <span className="font-bold block mb-1">{t('auth_tracking_title')}</span>
              <p>{t('auth_tracking_desc')}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="w-1/2 bg-white border border-[#E8DCC6] text-gray-600 hover:text-red-700 py-2 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" /> {t('auth_btn_logout')}
              </button>
              <button
                onClick={onClose}
                className="w-1/2 bg-[#1E1A16] text-[#F7F2EB] py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#A67C52]"
              >
                {t('auth_btn_continue')}
              </button>
            </div>
          </div>
        )}

        {/* Bottom Switch to admin area link */}
        <div className="mt-6 border-t border-[#E8DCC6] pt-4 text-center">
          <p className="text-[10px] text-[#A67C52]">
            {t('auth_admin_lbl')}{' '}
            <button
              onClick={() => {
                onClose();
                onAdminActivate();
              }}
              className="underline font-bold text-[#1E1A16] hover:text-[#A67C52] uppercase tracking-wider"
            >
              {t('auth_btn_admin')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
