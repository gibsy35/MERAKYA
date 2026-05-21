import React, { useState } from 'react';
import { Product, CurrencyCode, formatPrice } from '../types';
import { X, Check, Sparkles } from 'lucide-react';
import { Language, PRODUCT_TRANSLATIONS } from '../translations';

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

      <div className="relative bg-[#F7F2EB] max-w-3xl w-full rounded-sm overflow-hidden border border-[#E8DCC6] shadow-2xl flex flex-col md:flex-row z-10 max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible">
        
        {/* Close Button banner */}
        <button
          id="btn-close-modal"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 text-[#1E1A16] hover:text-[#A67C52] bg-[#F7F2EB]/95 rounded-full border border-[#E8DCC6] hover:scale-105 transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Product image side */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-[460px] relative bg-gray-100 overflow-hidden">
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
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] tracking-widest font-extrabold text-[#A67C52] uppercase block mb-1">
                {tagline}
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-[#1E1A16] tracking-wide font-normal">
                {name}
              </h2>
            </div>

            <p className="text-lg font-serif font-semibold text-[#A67C52]">
              {formatPrice(product.price, selectedCurrency)}
            </p>

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
                <div className="space-y-2 bg-[#E8DCC6]/30 p-3.5 border border-[#E8DCC6] rounded-xs font-serif italic">
                  <span className="flex items-center gap-1.5 font-sans font-bold uppercase tracking-wider text-[10px] text-[#A67C52] not-italic">
                    <Sparkles className="h-3.5 w-3.5" />
                    {conseilTitle}
                  </span>
                  <p className="text-[#6B4E2E]">
                    {defaultRitualText}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#E8DCC6]">
            <button
              id="btn-add-to-cart-modal"
              onClick={handleAdd}
              disabled={product.inStock === false}
              className={`w-full py-4 text-xs uppercase font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-sm ${
                product.inStock === false
                  ? 'bg-red-50 text-red-700 border border-red-200 cursor-not-allowed'
                  : success 
                    ? 'bg-green-700 text-white' 
                    : 'bg-[#1E1A16] text-[#F7F2EB] hover:bg-[#A67C52]'
              }`}
            >
              {product.inStock === false ? (
                language === 'EN' ? 'OUT OF STOCK' : 'RUPTURE DE STOCK'
              ) : success ? (
                <>
                  <Check className="h-4 w-4" />
                  {successText}
                </>
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
