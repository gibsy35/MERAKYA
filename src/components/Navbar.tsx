import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, Menu, X, Sparkles, Moon } from 'lucide-react';
import { CartItem, CurrencyCode, CURRENCIES } from '../types';
import SpiritualLogo from './SpiritualLogo';
import { Language, translations } from '../translations';

const getMoonPhase = (date: Date) => {
  const lp = 2551443; // synodic period in seconds (29.53059 days)
  const new_moon = new Date(1970, 0, 7, 20, 35, 0); // precise base reference new moon
  const phase = ((date.getTime() - new_moon.getTime()) / 1000) % lp;
  let fraction = phase / lp; // 0 to 1
  if (fraction < 0) fraction += 1.0;
  
  let labelFr = "";
  let labelEn = "";
  let icon = ""; 
  let ritualFr = "";
  let ritualEn = "";
  const illumination = Math.round(100 * (1 - Math.abs(fraction - 0.5) * 2));

  if (fraction < 0.06 || fraction >= 0.94) {
    labelFr = "Nouvelle Lune";
    labelEn = "New Moon";
    icon = "🌑";
    ritualFr = "Le ciel nocturne est plongé dans l'obscurité fertile. C'est le début d'un nouveau cycle céleste. Prenez un instant pour allumer votre Bougie de Purification, écrivez vos intentions sur un carnet et laissez la clarté guider vos pensées.";
    ritualEn = "The night sky is cast in fertile darkness. It is the beginning of a fresh celestial cycle. Take a moment to light your Purification Candle, write your intentions down, and let clear vision guide your path.";
  } else if (fraction >= 0.06 && fraction < 0.21) {
    labelFr = "Premier Croissant";
    labelEn = "Waxing Crescent";
    icon = "🌒";
    ritualFr = "La lumière renaît doucement au-dessus des montagnes de l'Atlas. C'est le moment idéal pour cultiver vos projets naissants. Allumez votre Bougie d'Abondance et visualisez vos aspirations fleurir pas à pas.";
    ritualEn = "Light is gently reborn over the Atlas ridges. This is the optimal time to nurture your nascent projects. Light your Abundance Candle and visualize your aspirations blooming step by step.";
  } else if (fraction >= 0.21 && fraction < 0.35) {
    labelFr = "Premier Quartier";
    labelEn = "First Quarter";
    icon = "🌓";
    ritualFr = "La lune se tient exactement à l'équilibre du jour et de la nuit. C'est une période de courage et d'alignement. Accompagnez ce passage d'un rituel de respiration pranayama pour surmonter les blocages intérieurs et calmer le stress.";
    ritualEn = "The moon stands in the precise balance of light and dark. A period of courage and alignment. Accompany this cosmic balance with a slow pranayama breathing ritual to dissolve internal obstacles and lower cortisol.";
  } else if (fraction >= 0.35 && fraction < 0.44) {
    labelFr = "Lune Gibbeuse Croissante";
    labelEn = "Waxing Gibbous";
    icon = "🌔";
    ritualFr = "La lune s'arrondit et l'énergie cosmique s'intensifie. Concentrez-vous sur la persévérance. Écoutez le chant des rituels de l'Atlas pour calmer le mental et focaliser votre énergie sacrée.";
    ritualEn = "The moon rounds out, compounding cosmic energy. Cultivate absolute focus and determination. Listen to the Atlas singing bells to pacify mental chatter and focus your sacred energy.";
  } else if (fraction >= 0.44 && fraction < 0.56) {
    labelFr = "Pleine Lune";
    labelEn = "Full Moon";
    icon = "🌕";
    ritualFr = "La lune brille de tout son éclat au zénith. Énergie créatrice à son apogée. Allumez votre Bougie de Régénération pour dissiper les énergies stagnantes, purifier vos cristaux et célébrer la complétude de votre être.";
    ritualEn = "The moon shines at its absolute peak in the zenith. Creative energy is vibrating at maximum. Ignite your Regeneration Candle to release heavy emotions, purify your gems, and celebrate your completeness.";
  } else if (fraction >= 0.56 && fraction < 0.69) {
    labelFr = "Lune Gibbeuse Décroissante";
    labelEn = "Waning Gibbous";
    icon = "🌖";
    ritualFr = "L'heure est à l'assimilation des apprentissages et au partage. Offrez-vous un soin corporel d'exception avec l'huile botanique Merakya, en massant doucement votre peau pour intégrer l'alchimie du jour.";
    ritualEn = "The cosmic tide is shifting to integration and generous sharing. Treat your temple to an exceptional botanical care routine with Merakya oils, massaging your skin gently to absorb today's alchemy.";
  } else if (fraction >= 0.69 && fraction < 0.81) {
    labelFr = "Dernier Quartier";
    labelEn = "Last Quarter";
    icon = "🌗";
    ritualFr = "Le temps des bilans et du détachement est venu. Libérez-vous de ce qui ne vous sert plus. Respirez en relâchant les tensions accumulées dans les épaules pour balayer l'inutile.";
    ritualEn = "The season for reflection and release is upon us. Untangle yourself from what no longer elevates you. Practice conscious breathing to shed accumulated stress from your physical body.";
  } else {
    labelFr = "Dernier Croissant";
    labelEn = "Waning Crescent";
    icon = "🌘";
    ritualFr = "La lune s'efface pour préparer le renouveau. Ce soir, la lune est descendante. Allumez votre bougie préférée sous un ciel étoilé et offrez-vous un silence sacré de 5 minutes pour reconnecter à l'essentiel.";
    ritualEn = "The moon fades gently, preparing for quiet renewal. Tonight, the moon is declining. Light your favorite candle under the starry sky and enjoy 5 minutes of sacred silence to realign with the source.";
  }

  return { labelFr, labelEn, icon, ritualFr, ritualEn, illumination };
};

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
  const [isMoonOpen, setIsMoonOpen] = React.useState(false);
  const moonData = getMoonPhase(new Date());
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
            onClick={() => onChangeCurrency('GBP')} 
            className={`transition-colors py-0.5 hover:text-white ${selectedCurrency === 'GBP' ? 'text-white border-b border-[#A67C52] font-extrabold' : 'opacity-60 font-medium'}`}
          >
            GBP
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
            {/* Elegant Genuine Lunar Indicator */}
            <button 
              id="btn-lunar-nav"
              onClick={() => setIsMoonOpen(true)}
              className="flex items-center gap-1.5 p-1 text-[#1E1A16] hover:text-[#A67C52] transition-colors relative group font-sans font-semibold text-xs leading-none"
              title={selectedLanguage === 'EN' ? "Lunar Calendar & Rituals" : "Calendrier Lunaire & Rituels"}
            >
              <span className="text-sm md:text-base animate-pulse">{moonData.icon}</span>
              <span className="hidden sm:inline-block text-[8px] md:text-[9px] tracking-widest uppercase text-[#A67C52]">
                {selectedLanguage === 'EN' ? moonData.labelEn : moonData.labelFr}
              </span>
            </button>

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

              {/* Mobile Moon Ritual Trigger */}
              <div className="border-t border-[#E8DCC6]/60 pt-3 px-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsMoonOpen(true);
                  }}
                  className="w-full bg-[#1E1A16] hover:bg-[#A67C52] text-[#F7F2EB] py-2.5 px-3 rounded-xs text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{moonData.icon}</span>
                  <span>{selectedLanguage === 'EN' ? "Lunar Cycles & Rituals" : "L'Astrologie & Rituels du Soir"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ✦ ELEGANT LUNAR RITUAL MODAL DIALOG ✦ */}
      {isMoonOpen && (
        <div id="lunar-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop screen */}
          <div 
            id="lunar-backdrop"
            onClick={() => setIsMoonOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity" 
          />
          
          <div className="relative bg-[#1E1A16] text-[#F7F2EB] max-w-md w-full rounded-sm overflow-hidden border border-[#A67C52]/40 shadow-2xl p-6 md:p-8 z-10 my-auto text-center animate-fade-in">
            {/* Closure button */}
            <button
              onClick={() => setIsMoonOpen(false)}
              className="absolute top-4 right-4 text-[#F7F2EB]/60 hover:text-white transition-colors p-1.5"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Glowing moon emblem */}
            <div className="relative w-20 h-20 bg-stone-900 border border-[#A67C52]/25 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
              <span className="text-4xl animate-pulse">{moonData.icon}</span>
              <span className="absolute -bottom-1 bg-[#A67C52] text-[7.5px] font-bold text-white tracking-widest px-2 py-0.5 rounded-full uppercase">
                {moonData.illumination}%
              </span>
            </div>

            <span className="text-[10px] tracking-[0.2em] uppercase text-[#A67C52] font-extrabold block mb-1">
              {selectedLanguage === 'EN' ? "✦ CHRONOLOGY OF THE NIGHT ✦" : "✦ SAGESSE DES ASTRES ✦"}
            </span>
            
            <h3 className="font-serif text-xl md:text-2xl text-[#E8DCC6] tracking-wide font-normal mb-3">
              {selectedLanguage === 'EN' ? moonData.labelEn : moonData.labelFr}
            </h3>

            <p className="text-[11px] text-gray-400 font-sans tracking-widest uppercase block mb-6">
              {selectedLanguage === 'EN' ? "Evening Ritual Recommendation" : "Rituel du Soir Conseillé"}
            </p>

            <div className="bg-white/[0.03] border border-[#A67C52]/20 p-5 rounded-xs font-serif italic text-sm text-[#F7F2EB]/95 leading-relaxed mb-6">
              "{selectedLanguage === 'EN' ? moonData.ritualEn : moonData.ritualFr}"
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsMoonOpen(false);
                  onNavigate('rituels');
                }}
                className="w-full bg-[#A67C52] hover:bg-amber-600 text-white py-3.5 text-xs uppercase font-extrabold tracking-widest rounded-xs flex items-center justify-center gap-2 transition-all outline-none"
              >
                <Sparkles className="h-4 w-4" />
                {selectedLanguage === 'EN' ? "Embark on Tonight's Ritual" : "Commencer mon Rituel Astral"}
              </button>

              <button
                onClick={() => setIsMoonOpen(false)}
                className="text-[10px] uppercase font-bold tracking-widest text-[#E8DCC6]/60 hover:text-white underline block mx-auto text-center font-sans mt-2"
              >
                {selectedLanguage === 'EN' ? "Close and ponder" : "Fermer et méditer ✦"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
