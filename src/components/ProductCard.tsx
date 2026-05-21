import React from 'react';
import { Product, CurrencyCode, formatPrice } from '../types';
import { Eye, Plus } from 'lucide-react';
import { Language, PRODUCT_TRANSLATIONS } from '../translations';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  selectedCurrency?: CurrencyCode;
  language?: Language;
  key?: any;
}

export default function ProductCard({ 
  product, 
  onViewDetails, 
  onAddToCart,
  selectedCurrency = 'MAD',
  language = 'FR'
}: ProductCardProps) {
  const trans = PRODUCT_TRANSLATIONS[product.id];
  const name = language === 'EN' && trans ? trans.nameEn : product.name;
  const desc = language === 'EN' && trans ? trans.descEn : product.description;
  
  const categoryTransMap: Record<string, string> = {
    'BOUGIES RITUELLES': 'RITUAL CANDLES',
    'SAVONS & SOINS NATURELS': 'SOAPS & NATURAL CARE',
    'SELS & BAINS ÉNERGÉTIQUES': 'ENERGY BATH & SALTS',
    'HUILES & ÉLIXIRS BOTANIQUES': 'BOTANICAL OILS & ELIXIRS',
    'COFFRETS RITUELS': 'RITUAL CHESTS'
  };
  const category = language === 'EN' ? (categoryTransMap[product.category] || product.category) : product.category;

  const buyButtonText = language === 'EN' ? 'Add to cart ✦' : 'Ajouter au panier ✦';
  const detailsTitle = language === 'EN' ? 'Ritual Details' : 'Détails du rituel';
  const quickTitle = language === 'EN' ? 'Add to Cart' : 'Ajouter au Panier';

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group bg-white p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl rounded-sm hover:-translate-y-1"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F2EB] rounded-xs mb-4">
        {/* Product image */}
        <img 
          src={product.image} 
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Hover action bar overlays */}
        <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-xs flex items-center justify-center gap-3 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            id={`btn-view-${product.id}`}
            onClick={() => onViewDetails(product)}
            className="p-2.5 bg-[#F7F2EB] hover:bg-[#A67C52] text-[#1E1A16] hover:text-white transition-all rounded-full"
            title={detailsTitle}
          >
            <Eye className="h-4 w-4" />
          </button>
          
          {product.inStock !== false && (
            <button
              id={`btn-quick-add-${product.id}`}
              onClick={() => onAddToCart(product)}
              className="p-2.5 bg-[#A67C52] hover:bg-[#1E1A16] text-white transition-all rounded-full flex items-center gap-1.5"
              title={quickTitle}
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Product Category Label Badge */}
        <div className="absolute top-2 left-2 bg-[#F7F2EB]/90 uppercase text-[8px] md:text-[9.5px] font-bold tracking-[0.15em] px-2.5 py-1 text-[#1E1A16]">
          {category}
        </div>

        {/* Out of Stock and Preorder Badge */}
        {product.status === 'OUT_OF_STOCK' || product.inStock === false || (product.inventory !== undefined && product.inventory <= 0) ? (
          <div className="absolute top-2 right-2 bg-red-800 text-white uppercase text-[8px] md:text-[9px] font-bold tracking-[0.1em] px-2 py-0.5 rounded-xs animate-pulse">
            {language === 'EN' ? 'SOLD OUT' : 'RUPTURE'}
          </div>
        ) : product.status === 'PREORDER' ? (
          <div className="absolute top-2 right-2 bg-indigo-800 text-white uppercase text-[8px] md:text-[9px] font-bold tracking-[0.1em] px-2 py-0.5 rounded-xs">
            {language === 'EN' ? 'PRE-ORDER' : 'PRÉCOMMANDE'}
          </div>
        ) : product.isLimitedEdition || (product.inventory !== undefined && product.inventory > 0 && product.inventory <= 5) ? (
          <div className="absolute top-2 right-2 bg-[#A67C52] text-white uppercase text-[8px] md:text-[9px] font-bold tracking-[0.1em] px-2 py-0.5 rounded-xs">
            {language === 'EN' ? 'LIMITED' : 'ÉDITION LIMITÉE'}
          </div>
        ) : null}
      </div>

      <div className="text-center px-1 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-[15px] md:text-base text-[#1E1A16] tracking-wide mb-1 font-semibold group-hover:text-[#A67C52] transition-colors line-clamp-2 min-h-[44px]">
            {name}
          </h3>
          <p className="text-xs text-[#1E1A16]/70 leading-relaxed line-clamp-2 italic px-1 mb-3">
            {desc}
          </p>
        </div>
        
        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            {product.compareAtPrice && product.compareAtPrice > product.price ? (
              <>
                <span className="text-xs text-gray-400 line-through tracking-wider font-light">
                  {formatPrice(product.compareAtPrice, selectedCurrency)}
                </span>
                <span className="text-sm font-semibold text-red-750 tracking-wider">
                  {formatPrice(product.price, selectedCurrency)}
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold text-[#A67C52] tracking-wider">
                {formatPrice(product.price, selectedCurrency)}
              </span>
            )}
          </div>
          
          {/* Subtle Stock Alarm */}
          {product.inventory !== undefined && product.inventory > 0 && product.inventory <= 5 && (
            <div className="text-[10px] text-red-700 font-medium mb-2 uppercase tracking-wider animate-pulse">
              {language === 'EN' ? `Only ${product.inventory} left in stock!` : `Plus que ${product.inventory} exemplaires !`}
            </div>
          )}
          
          <button
            id={`btn-add-to-cart-card-${product.id}`}
            onClick={() => {
              const works = product.status !== 'OUT_OF_STOCK' && product.inStock !== false && (product.inventory === undefined || product.inventory > 0);
              if (works) onAddToCart(product);
            }}
            disabled={product.status === 'OUT_OF_STOCK' || product.inStock === false || (product.inventory !== undefined && product.inventory <= 0)}
            className={`w-full border py-2 px-3 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 rounded-sm ${
              product.status === 'OUT_OF_STOCK' || product.inStock === false || (product.inventory !== undefined && product.inventory <= 0)
                ? 'border-red-200 text-red-700 bg-red-50/50 cursor-not-allowed'
                : product.status === 'PREORDER'
                  ? 'border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                  : 'border-[#A67C52] text-[#A67C52] hover:bg-[#A67C52] hover:text-[#F7F2EB]'
            }`}
          >
            {product.status === 'OUT_OF_STOCK' || product.inStock === false || (product.inventory !== undefined && product.inventory <= 0)
              ? (language === 'EN' ? 'Sold Out ✦' : 'Rupture ✦')
              : product.status === 'PREORDER'
                ? (language === 'EN' ? 'Pre-order ✦' : 'Précommander ✦')
                : buyButtonText
            }
          </button>
        </div>
      </div>
    </div>
  );
}
