import React, { useState, useEffect } from 'react';
import { Product, CurrencyCode, formatPrice } from '../types';
import { X, Check, Sparkles, Headphones, Volume2, Play, Square } from 'lucide-react';
import { Language, PRODUCT_TRANSLATIONS } from '../translations';
import { startRitualSoundscape, stopRitualSoundscape, getRitualSoundscapeState } from '../lib/ritualSound';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  selectedCurrency?: CurrencyCode;
  language?: Language;
}

export default function ProductDetailsModal({
  product,
  onClose,
  onAddToCart,
  selectedCurrency = 'MAD',
  language = 'FR'
}: ProductDetailsModalProps) {
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'ing' | 'rituel'>('desc');
  const [isPlayingSound, setIsPlayingSound] = useState(getRitualSoundscapeState());

  useEffect(() => {
    const checkState = setInterval(() => {
      setIsPlayingSound(getRitualSoundscapeState());
    }, 280);
    return () => {
      clearInterval(checkState);
    };
  }, []);

  useEffect(() => {
    return () => {
      stopRitualSoundscape();
    };
  }, []);

  if (!product) return null;

  const trans = PRODUCT_TRANSLATIONS[product.id];
  const name = language === 'EN' && trans ? trans.nameEn : product.name;
  const desc = language === 'EN' && trans ? trans.descEn : product.description;
  const ingredients = language === 'EN' && trans ? trans.ingEn : (product.ingredients || "Composé d'huiles végétales pures, cires biologiques récoltées de manière écoresponsable, et huiles essentielles précieuses de qualité d'apothicaire.");

  const categoryTransMap: Record<string, string> = {
    'BOUGIES RITUELLES': 'RITUAL CANDLES',
    'SAVONS & SOINS NATURELS': 'SOAPS & NATURAL CARE',
    'SELS & BAINS ÉNERGÉTIQUES': 'ENERGY BATH & SALTS',
    'HUILES & ÉLIXIRS BOTANIQUES': 'BOTANICAL OILS & ELIXIRS',
    'COFFRETS RITUELS': 'RITUAL CHESTS'
  };
  const category = language === 'EN' ? (categoryTransMap[product.category] || product.category) : product.category;

  const handleAdd = () => {
    onAddToCart(product);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const tabs = language === 'EN' ? [
    { id: 'desc', name: 'Alchemy' },
    { id: 'ing', name: 'Ingredients' },
    { id: 'rituel', name: 'Guided Ritual' }
  ] : [
    { id: 'desc', name: 'Alchimie' },
    { id: 'ing', name: 'Ingrédients' },
    { id: 'rituel', name: 'Rituel Conseillé' }
  ];

  const successText = language === 'EN' ? 'Added successfully!' : 'Ajouté avec succès !';
  const addToCartText = language === 'EN' ? 'Add to my sacred basket ✦' : "Rejoindre mon panier d'achats ✦";
  const craftNotes = language === 'EN' ? '✦ Individually saponified, poured or infused by hand in Morocco.' : '✦ Saponifié, coulé ou infusé individuellement à la main au Maroc.';
  const tagline = language === 'EN' ? '✦ Sacred Limited batch' : '✦ Création Sacrée Limitée';
  
  const synergieTitle = language === 'EN' ? 'Active Botanical Synergy :' : 'Synergie Botanique Active :';
  const conseilTitle = language === 'EN' ? 'Holistic Usage Advice' : "Conseil d'utilisation holistique";
  const defaultRitualText = language === 'EN' 
    ? '"Ignite or breathe this care while maintaining a deep intention of peace. Accompany this gesture with 3 slow deep breaths, releasing physical strain so that alchemy can blossom fully in your soul."'
    : '"Allumez ou respirez ce soin en initiant une intention de paix profonde. Accompagnez ce geste de 3 inspirations et expirations lentes, libérant les tensions corporelles afin que l\'alchimie opère pleinement dans votre âme."';

  return (
    <div id="product-details-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Dynamic backdrop */}
      <div 
        id="modal-backdrop"
        onClick={onClose} 
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity" 
      />

      <div className="relative bg-[#F7F2EB] max-w-3xl w-full rounded-sm overflow-hidden border border-[#E8DCC6] shadow-2xl flex flex-col md:flex-row z-10 my-auto max-h-none md:max-h-[90vh] overflow-y-visible md:overflow-y-auto">
        
        {/* Close Button banner */}
        <button
          id="btn-close-modal"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 text-[#1E1A16] hover:text-[#A67C52] bg-[#F7F2EB]/95 rounded-full border border-[#E8DCC6] hover:scale-105 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Product image side */}
        <div className="w-full md:w-1/2 h-56 sm:h-72 md:h-auto md:min-h-[460px] relative bg-gray-100 overflow-hidden flex-shrink-0">
          <img
            src={product.image}
            alt={name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <span className="absolute top-4 left-4 bg-[#F7F2EB]/95 text-[#1E1A16] px-3 py-1 text-[10px] tracking-widest uppercase font-bold border border-[#E8DCC6]">
            {category}
          </span>
        </div>

        {/* Description & Action details side */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6 flex-shrink-0 md:flex-shrink">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] tracking-widest font-extrabold text-[#A67C52] uppercase block mb-1">
                {tagline}
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-[#1E1A16] tracking-wide font-normal">
                {name}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {product.compareAtPrice && product.compareAtPrice > product.price ? (
                <>
                  <span className="text-sm text-gray-400 line-through tracking-wider font-light">
                    {formatPrice(product.compareAtPrice, selectedCurrency)}
                  </span>
                  <p className="text-xl font-serif font-semibold text-red-750">
                    {formatPrice(product.price, selectedCurrency)}
                  </p>
                  <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    REMISE
                  </span>
                </>
              ) : (
                <p className="text-xl font-serif font-semibold text-[#A67C52]">
                  {formatPrice(product.price, selectedCurrency)}
                </p>
              )}
            </div>

            {/* Inner Tabs for better screen presentation */}
            <div className="flex border-b border-[#E8DCC6] text-xs space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-2 uppercase tracking-wide font-bold border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-[#A67C52] text-[#A67C52]'
                      : 'border-transparent text-[#1E1A16]/50 hover:text-[#1E1A16]'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            <div className="space-y-3 min-h-[140px] text-xs text-[#1E1A16]/85 leading-relaxed">
              {activeTab === 'desc' && (
                <p className="italic font-serif text-[13px] md:text-sm text-[#1E1A16]/90">
                  "{desc}"
                </p>
              )}

              {activeTab === 'ing' && (
                <div className="space-y-2">
                  <p className="font-sans font-medium text-[#A67C52] uppercase tracking-wider text-[10px]">
                    {synergieTitle}
                  </p>
                  <p>
                    {ingredients}
                  </p>
                </div>
              )}

              {activeTab === 'rituel' && (
                <div className="space-y-3.5">
                  <div className="bg-[#E8DCC6]/30 p-3.5 border border-[#E8DCC6] rounded-xs font-serif italic">
                    <span className="flex items-center gap-1.5 font-sans font-bold uppercase tracking-wider text-[10px] text-[#A67C52] not-italic">
                      <Sparkles className="h-3.5 w-3.5" />
                      {conseilTitle}
                    </span>
                    <p className="text-[#6B4E2E]">
                      {defaultRitualText}
                    </p>
                  </div>

                  {/* L'Écho des Rituels Sensoriel audio element */}
                  <div className="bg-[#1E1A16] text-[#F7F2EB] p-4 border border-[#A67C52]/40 rounded-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-full ${isPlayingSound ? 'bg-[#A67C52]/20 text-[#A67C52] animate-pulse' : 'bg-white/5 text-gray-400'}`}>
                          <Headphones className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-serif text-xs tracking-wide font-medium">
                            {language === 'EN' ? "Echo of the Rituals • Immersive 5 min" : "L'Écho des Rituels • Immersion Solaire 5 min"}
                          </p>
                          <p className="text-[9.5px] text-gray-400 font-sans tracking-tight font-light mt-0.5">
                            {language === 'EN' 
                              ? "Tibetan bowls, Moroccan Atlas wind, wood fire" 
                              : "Bols chantants, brise de l'Atlas marocain, crépitement de feu de bois"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (isPlayingSound) {
                            stopRitualSoundscape();
                            setIsPlayingSound(false);
                          } else {
                            startRitualSoundscape((active) => {
                              setIsPlayingSound(active);
                            });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xs text-[9px] uppercase font-bold tracking-widest flex items-center gap-1.5 transition-all outline-none ${
                          isPlayingSound 
                            ? 'bg-red-900/40 text-red-100 border border-red-500/50 hover:bg-red-900/60' 
                            : 'bg-[#A67C52] text-white hover:bg-amber-600'
                        }`}
                      >
                        {isPlayingSound ? (
                          <>
                            <Square className="h-3 w-3 fill-current" />
                            {language === 'EN' ? "Silence" : "Silencer"}
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 fill-current" />
                            {language === 'EN' ? "Experience" : "Écouter"}
                          </>
                        )}
                      </button>
                    </div>

                    {/* Simple Waveform Audio indicator when playing */}
                    {isPlayingSound && (
                      <div className="flex items-center justify-center gap-1.5 mt-3 pt-2 border-t border-white/5">
                        <div className="text-[10px] text-[#A67C52] uppercase font-mono tracking-widest animate-pulse">✦ Harmony flow active ✦</div>
                        <div className="flex items-end gap-1 h-3 shrink-0">
                          <span className="w-[2px] bg-[#A67C52] rounded-full animate-bounce h-2" style={{ animationDelay: '0.1s' }} />
                          <span className="w-[2px] bg-[#A67C52] rounded-full animate-bounce h-3" style={{ animationDelay: '0.3s' }} />
                          <span className="w-[2px] bg-[#A67C52] rounded-full animate-bounce h-1" style={{ animationDelay: '0.5s' }} />
                          <span className="w-[2px] bg-[#A67C52] rounded-full animate-bounce h-2" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#E8DCC6]">
            {/* Subtle Stock Alarm */}
            {product.inventory !== undefined && product.inventory > 0 && product.inventory <= 5 && (
              <div className="text-xs text-red-750 font-bold uppercase tracking-wider text-center animate-pulse">
                {language === 'EN' ? `Only ${product.inventory} items left in stock!` : `Plus que ${product.inventory} unités disponibles !`}
              </div>
            )}

            <button
              id="btn-add-to-cart-modal"
              onClick={handleAdd}
              disabled={product.status === 'OUT_OF_STOCK' || product.inStock === false || (product.inventory !== undefined && product.inventory <= 0)}
              className={`w-full py-4 text-xs uppercase font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-sm ${
                product.status === 'OUT_OF_STOCK' || product.inStock === false || (product.inventory !== undefined && product.inventory <= 0)
                  ? 'bg-red-50 text-red-700 border border-red-200 cursor-not-allowed'
                  : success 
                    ? 'bg-green-700 text-white' 
                    : product.status === 'PREORDER'
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-[#1E1A16] text-[#F7F2EB] hover:bg-[#A67C52]'
              }`}
            >
              {product.status === 'OUT_OF_STOCK' || product.inStock === false || (product.inventory !== undefined && product.inventory <= 0) ? (
                language === 'EN' ? 'OUT OF STOCK' : 'RUPTURE DE STOCK'
              ) : success ? (
                <>
                  <Check className="h-4 w-4" />
                  {successText}
                </>
              ) : product.status === 'PREORDER' ? (
                language === 'EN' ? 'PRE-ORDER ✦' : 'RÉSERVER EN PRÉCOMMANDE ✦'
              ) : (
                addToCartText
              )}
            </button>
            
            <p className="text-[10px] text-center text-[#1E1A16]/60 font-sans tracking-wide">
              {craftNotes}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
