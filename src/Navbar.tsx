import React from 'react';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { CartItem, CurrencyCode, CURRENCIES } from '../types';
import SpiritualLogo from './SpiritualLogo';
import { Language, translations } from '../translations';

interface NavbarProps {
  cart: CartItem[];
  onCartToggle: () => void;
  onAdminToggle: () => void;
  isAdminActive: boolean;
  onNavigate: (section: string) => void;
  activeTab: string;
  campaigns?: any[];
  selectedCurrency: CurrencyCode;
  onChangeCurrency: (code: CurrencyCode) => void;
  selectedLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Navbar({
  cart,
  onCartToggle,
  onAdminToggle,
  isAdminActive,
  onNavigate,
  activeTab,
  campaigns = [],
  selectedCurrency,
  onChangeCurrency,
  selectedLanguage,
  onLanguageChange
}: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Translation helper
  const t = (key: keyof typeof translations['FR']) => {
    return translations[selectedLanguage][key] || translations['FR'][key] || '';
  };

  // Retrieve active campaign ticker or fallback
  const activeCampaign = campaigns.find(c => c.isActive && (c.type === 'banner' || c.type === 'discount'));
  const tickerTextMessage = activeCampaign ? activeCampaign.content : t('ticker');

  return (
    <header className="w-full z-40 sticky top-0 transition-all duration-300">
      {/* Promotion top bar with smooth scrolling ticker and static currency & language selector */}
      <div className="bg-[#1E1A16] text-[#F7F2EB] text-[9px] md:text-[11px] tracking-[0.2em] py-2.5 font-medium font-sans border-b border-[#A67C52]/20 relative select-none w-full flex justify-between items-center px-4 md:px-12">
        <div className="overflow-hidden relative flex-1">
          <div className="flex w-max-content animate-ticker-slow whitespace-nowrap">
            <span className="inline-flex gap-8 px-4 items-center">
              <span>{tickerTextMessage}</span>
            </span>
            <span className="inline-flex gap-8 px-4 items-center" aria-hidden="true">
              <span>{tickerTextMessage}</span>
            </span>
            <span className="inline-flex gap-8 px-4 items-center" aria-hidden="true">
              <span>{tickerTextMessage}</span>
            </span>
          </div>
        </div>
        
        {/* Static compact elegant high-fashion currency & language chooser */}
        <div className="hidden md:flex items-center gap-3 pl-6 border-l border-[#A67C52]/30 text-[9px] md:text-[10px] font-bold tracking-widest text-[#E8DCC6] shrink-0">
          <span className="opacity-50 text-[8.5px]">{t('nav_currency')}</span>
          <button 
            onClick={() => onChangeCurrency('MAD')} 
            className={`transition-colors py-0.5 hover:text-white ${selectedCurrency === 'MAD' ? 'text-white border-b border-[#A67C52] font-extrabold' : 'opacity-60 font-medium'}`}
          >
            MAD
          </button>
          <button 
            onClick={() => onChangeCurrency('EUR')} 
            className={`transition-colors py-0.5 hover:text-white ${selectedCurrency === 'EUR' ? 'text-white border-b border-[#A67C52] font-extrabold' : 'opacity-60 font-medium'}`}
          >
            EUR
          </button>
          <button 
            onClick={() => onChangeCurrency('USD')} 
            className={`transition-colors py-0.5 hover:text-white ${selectedCurrency === 'USD' ? 'text-white border-b border-[#A67C52] font-extrabold' : 'opacity-60 font-medium'}`}
          >
            USD
          </button>

          <span className="opacity-25 mx-1">|</span>

          <span className="opacity-50 text-[8.5px]">{t('nav_lang')}</span>
          <button 
            onClick={() => onLanguageChange('FR')} 
            className={`transition-colors py-0.5 hover:text-white ${selectedLanguage === 'FR' ? 'text-white border-b border-[#A67C52] font-extrabold' : 'opacity-60 font-medium'}`}
          >
            FR
          </button>
          <button 
            onClick={() => onLanguageChange('EN')} 
            className={`transition-colors py-0.5 hover:text-white ${selectedLanguage === 'EN' ? 'text-white border-b border-[#A67C52] font-extrabold' : 'opacity-60 font-medium'}`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <nav className="bg-[#F7F2EB]/95 backdrop-blur-md border-b border-[#E8DCC6] px-4 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <button 
              id="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)} 
              className="text-[#1E1A16] hover:text-[#A67C52] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Elegant Logo with subtext */}
          <div className="flex items-center gap-3 cursor-pointer select-none group" onClick={() => { onNavigate('accueil'); if(isAdminActive) onAdminToggle(); }}>
            <SpiritualLogo size={36} className="text-[#A67C52] group-hover:text-[#CB8892] group-hover:rotate-[15deg] group-hover:scale-105 transition-all duration-700 ease-in-out" />
            <div className="flex flex-col">
              <span className="font-serif text-xl md:text-2.5xl tracking-[0.18em] text-[#1E1A16] font-normal leading-tight group-hover:text-[#A67C52] transition-colors duration-500">
                MERAKYA
              </span>
              <span className="text-[7.5px] md:text-[8px] tracking-[0.2em] uppercase text-[#A67C52] font-bold font-sans group-hover:text-[#CB8892] transition-colors duration-500">
                {t('subtext')}
              </span>
            </div>
          </div>

          {/* Desktop Links with translations */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
            {[
              { id: 'accueil', key: 'nav_home' as const },
              { id: 'boutique', key: 'nav_shop' as const },
              { id: 'rituels', key: 'nav_rituels' as const },
              { id: 'journal', key: 'nav_journal' as const },
              { id: 'histoire', key: 'nav_story' as const },
              { id: 'contact', key: 'nav_contact' as const }
            ].map((link) => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => {
                  if (isAdminActive) onAdminToggle();
                  onNavigate(link.id);
                }}
                className={`text-xs tracking-[0.2em] font-medium transition-all duration-300 relative py-1 hover:text-[#A67C52] ${
                  activeTab === link.id && !isAdminActive
                    ? 'text-[#A67C52] font-semibold'
                    : 'text-[#1E1A16]/80'
                }`}
              >
                {t(link.key)}
                {activeTab === link.id && !isAdminActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#A67C52]" />
                )}
              </button>
            ))}
          </div>

          {/* Interactive Icons */}
          <div className="flex items-center space-x-3 md:space-x-5">
            <button 
              id="btn-search-nav"
              onClick={() => { if(isAdminActive) onAdminToggle(); onNavigate('boutique'); }}
              className="p-1 text-[#1E1A16] hover:text-[#A67C52] transition-colors relative group"
              title={t('nav_search')}
            >
              <Search className="h-5 w-5 stroke-[1.5]" />
            </button>
            
            {/* Admin toggle user profile */}
            <button 
              id="btn-admin-nav"
              onClick={onAdminToggle}
              className={`p-1 transition-all duration-300 rounded-full flex items-center gap-1 ${
                isAdminActive 
                  ? 'text-[#F7F2EB] bg-[#A67C52] px-3 py-1 ring-1 ring-[#6B4E2E]/20' 
                  : 'text-[#1E1A16] hover:text-[#A67C52]'
              }`}
              title={t('nav_admin')}
            >
              <User className="h-5 w-5 stroke-[1.5]" />
              {isAdminActive ? (
                <span className="text-[10px] tracking-wider uppercase font-semibold">{t('nav_admin')}</span>
              ) : (
                <span className="hidden lg:inline text-[9px] tracking-widest uppercase text-[#A67C52]">{t('nav_pro')}</span>
              )}
            </button>

            {/* Shopping Bag Icon with dynamic badge */}
            <button 
              id="btn-cart-nav"
              onClick={onCartToggle}
              className="p-1 text-[#1E1A16] hover:text-[#A67C52] transition-colors relative"
              title={t('nav_cart')}
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span id="cart-badge-nav" className="absolute -top-1 -right-1 bg-[#CB8892] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#F7F2EB] animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu expanded state */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-[#E8DCC6] bg-[#F7F2EB] animate-fade-in">
            <div className="flex flex-col space-y-4 pb-4">
              {[
                { id: 'accueil', key: 'nav_home' as const },
                { id: 'boutique', key: 'nav_shop' as const },
                { id: 'rituels', key: 'nav_rituels' as const },
                { id: 'journal', key: 'nav_journal' as const },
                { id: 'histoire', key: 'nav_story' as const },
                { id: 'contact', key: 'nav_contact' as const }
              ].map((link) => (
                <button
                  key={link.id}
                  id={`nav-link-mobile-${link.id}`}
                  onClick={() => {
                    setIsOpen(false);
                    if (isAdminActive) onAdminToggle();
                    onNavigate(link.id);
                  }}
                  className={`text-sm tracking-widest uppercase font-medium text-left px-2 py-1 ${
                    activeTab === link.id && !isAdminActive ? 'text-[#A67C52] border-l-2 border-[#A67C52] pl-3' : 'text-[#1E1A16]/80'
                  }`}
                >
                  {t(link.key)}
                </button>
              ))}

              {/* Mobile Currency Selection Helper */}
              <div className="border-t border-[#E8DCC6]/60 pt-3 px-2 flex justify-between items-center">
                <span className="text-xs uppercase tracking-wider text-[#A67C52] font-semibold">Devise / Currency</span>
                <select
                  value={selectedCurrency}
                  onChange={(e) => {
                    onChangeCurrency(e.target.value as CurrencyCode);
                    setIsOpen(false);
                  }}
                  className="bg-white border border-[#E8DCC6] p-1.5 text-xs text-[#1E1A16] font-bold tracking-wider"
                >
                  {CURRENCIES.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Language Selection Helper */}
              <div className="border-t border-[#E8DCC6]/60 pt-3 px-2 flex justify-between items-center">
                <span className="text-xs uppercase tracking-wider text-[#A67C52] font-semibold">Langue / Language</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    onLanguageChange(e.target.value as Language);
                    setIsOpen(false);
                  }}
                  className="bg-white border border-[#E8DCC6] p-1.5 text-xs text-[#1E1A16] font-bold tracking-wider"
                >
                  <option value="FR">FR (Français)</option>
                  <option value="EN">EN (English)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
