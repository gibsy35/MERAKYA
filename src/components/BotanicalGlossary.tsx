import React, { useState } from 'react';
import { Leaf, Info, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface Ingredient {
  id: string;
  nameFr: string;
  nameEn: string;
  scientificName: string;
  originFr: string;
  originEn: string;
  vibeFr: string;
  vibeEn: string;
  descFr: string;
  descEn: string;
  matchingProducts: string[]; // Product ids
  color: string;
}

interface BotanicalGlossaryProps {
  language: 'FR' | 'EN';
  products: Product[];
  onShowProduct: (product: Product) => void;
}

export default function BotanicalGlossary({ language, products, onShowProduct }: BotanicalGlossaryProps) {
  const [selectedIng, setSelectedIng] = useState<string | null>(null);

  const INGREDIENTS: Ingredient[] = [
    {
      id: 'figue-barbarie',
      nameFr: 'Figue de Barbarie Biologique',
      nameEn: 'Organic Prickly Pear Cactus',
      scientificName: 'Opuntia ficus-indica',
      originFr: 'Région aride de Boujdour & Haouz, Maroc',
      originEn: 'Arid zones of Boujdour & Haouz, Morocco',
      vibeFr: 'Énergie d’Éclat Céleste & Cicatrisation Absolue',
      vibeEn: 'Cellular Regeneration & Radiant Shield Aura',
      descFr: 'L’élixir cosmétique le plus rare et cher au monde. Nécessitant près d’une tonne de fruits pour extraire un unique litre d’huile de pépins pure, il gorge la peau de vitamine E et de stérols antioxydants pour repulper la barrière et illuminer le visage au réveil.',
      descEn: 'The rarest apothecary seeds oil on Earth. Taking nearly a ton of fruits to extract a single pure liter, it feeds cellular layers with heavy Vitamin E and natural sterols to elevate skin longevity and bring a gorgeous twilight glow.',
      matchingProducts: ['huile-botanique-nuit'],
      color: '#344E41'
    },
    {
      id: 'rose-damas',
      nameFr: 'Rose Sauvage de Kelâat M\'gouna',
      nameEn: 'Kelâat M\'gouna Damask Rose',
      scientificName: 'Rosa damascena',
      originFr: 'Vallée des Roses du Haut-Atlas, Maroc',
      originEn: 'Valley of Roses, Moroccan High-Atlas',
      vibeFr: 'Ouverture du Chakra du Cœur & Tendresse Infinie',
      vibeEn: 'Heart Chakra Gateway & Soothing Peace',
      descFr: 'Cueillis à la rosée matinale par les coopératives féminines berbères de Kelâat M’gouna, nos boutons séchés et distillats de Rose de Damas calment instantanément les irritations cutanées, estompent le stress émotionnel profond et vibrent à l’une des fréquences les plus élevées de la Terre.',
      descEn: 'Harvested directly in morning mist by native women berber collectives, our dried roses and distillates calm sensitive tissues, erase deep emotional fatigue, and vibrate at one of the highest cosmic frequencies on Earth.',
      matchingProducts: ['bougie-rose-damas', 'savon-rose-sculptee', 'coffret-rituel-lune'],
      color: '#A85764'
    },
    {
      id: 'ghassoul',
      nameFr: 'Ghassoul & Argile Ocre de l’Ourika',
      nameEn: 'Sacred Ghassoul & Ourika Ocre Clay',
      scientificName: 'Hectorite & Montmorillonite',
      originFr: 'Gisements géologiques de Tamdafelt, Maroc',
      originEn: ' Tamdafelt deep geological mines, Morocco',
      vibeFr: 'Protection Terrestre, Ancrage & Détoxication de l’Aria',
      vibeEn: 'Earthy Protection, Root Clays Grounding & Detox',
      descFr: 'L’argile saponifère exclusive du Maroc, utilisée dans les rituels de hammam impériaux depuis le XIIe siècle. Agissant comme un buvard naturel par échange ionique, elle absorbe les métaux lourds et purifie les pores en douceur sans altérer le film hydrolipidique de la peau.',
      descEn: 'Exclusive mineral soap-clay of Morocco, beloved inside imperial baths since the 12th century. Operating as natural absorber via mineral-ionic exchange, it neutralizes heavy impurities to purify pores without stripping protection.',
      matchingProducts: ['savon-alchimie-argile'],
      color: '#B07D62'
    },
    {
      id: 'sauge-blanche',
      nameFr: 'Sauge Officinale & Lavande du Rif',
      nameEn: 'White Sage & Rif Lavandula',
      scientificName: 'Salvia officinalis & Lavandula angustifolia',
      originFr: 'Plateaux sauvages du Rif & Atlas, Maroc',
      originEn: 'High peaks of the Rif mountains, Morocco',
      vibeFr: 'Bannissement des Énergies Lourdes & Calme Mental',
      vibeEn: 'Purifying Negative Fields & Astral Serenity',
      descFr: 'La synergie d’herbes sacrées par excellence. La sauge dissipe les ondes stagnantes et assainit l’air ambiant, pendant que la fleur de lavande bleue du Rif, récoltée à l’état sauvage, décrispe le système nerveux et invite au sommeil sacré lors du bain d\'aura.',
      descEn: 'The ultimate herbal ritual synergy. While organic sage smoke clears spatial heavy blocks from workspace/home, our wild Rif lavender calms nervous centers, allowing a deeply relaxing cosmic alignment during hot bath meditations.',
      matchingProducts: ['sels-purification', 'bougie-mauvais-oeil', 'coffret-rituel-lune'],
      color: '#7F7F9c'
    }
  ];

  return (
    <div className="space-y-8" id="botanical-glossary-section">
      {/* Glossaire Header */}
      <div className="text-center space-y-2">
        <span className="text-[10px] tracking-[0.3em] font-extrabold text-[#A67C52] uppercase block">
          {language === 'EN' ? "✦ SACRED INGREDIENTS DICTIONARY ✦" : "✦ HERBORISTERIE SACRÉE & APOTHICAIRE ✦"}
        </span>
        <h2 className="font-serif text-2xl md:text-3.5xl text-[#1E1A16] font-normal tracking-wide">
          {language === 'EN' ? "Alchemical Glossary" : "Carnet des Ingrédients Sacrés"}
        </h2>
        <p className="text-xs text-[#1E1A16]/60 font-serif italic max-w-lg mx-auto">
          {language === 'EN' 
            ? "Inspect our rare Moroccan botanicals, ancestral minerals, and holy frequencies used at the Merakya Lab."
            : "Explorez l'origine, les vertus mystiques et l'alchimie vibratoire de nos matières botaniques d'exception."}
        </p>
        <div className="flex items-center justify-center gap-2 pt-1">
          <div className="w-8 h-[1px] bg-[#A67C52]/35" />
          <span className="text-[#A67C52] text-[9px]">✦</span>
          <div className="w-8 h-[1px] bg-[#A67C52]/35" />
        </div>
      </div>

      {/* Grid of botanicals */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {INGREDIENTS.map((ing) => {
          const isSelected = selectedIng === ing.id;
          return (
            <div 
              key={ing.id}
              onClick={() => setSelectedIng(isSelected ? null : ing.id)}
              className={`p-6 border rounded-xs text-left cursor-pointer transition-all duration-300 relative overflow-hidden ${
                isSelected 
                  ? 'bg-[#1E1A16] border-[#A67C52] text-[#F7F2EB] shadow-md md:col-span-2' 
                  : 'bg-white border-[#E8DCC6] text-[#1E1A16] hover:border-[#A67C52] hover:bg-[#FAF6F0]'
              }`}
            >
              <div className="space-y-4">
                {/* Visual marker color block */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4.5 w-4.5" style={{ color: isSelected ? '#A67C52' : ing.color }} />
                    <span className="text-[8px] tracking-wider font-mono uppercase opacity-60">
                      {ing.scientificName}
                    </span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ing.color }} />
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif text-sm font-bold uppercase tracking-wider">
                    {language === 'EN' ? ing.nameEn : ing.nameFr}
                  </h4>
                  <p className="text-[9px] font-mono tracking-widest uppercase" style={{ color: '#A67C52' }}>
                    {language === 'EN' ? ing.originEn : ing.originFr}
                  </p>
                </div>

                {isSelected ? (
                  <div className="space-y-4 pt-4 border-t border-[#A67C52]/20 text-xs animate-fade-in">
                    <div className="p-2.5 bg-[#FAF6F0]/5 border border-[#A67C52]/30 rounded-xs text-[#A67C52] font-semibold text-[10px] tracking-wide uppercase">
                      ✦ {language === 'EN' ? ing.vibeEn : ing.vibeFr}
                    </div>
                    <p className="text-gray-300 leading-relaxed font-light font-sans">
                      {language === 'EN' ? ing.descEn : ing.descFr}
                    </p>

                    {/* Associated actions */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[9px] tracking-widest font-extrabold uppercase text-[#A67C52] block">
                        {language === 'EN' ? "FEATURED IN CREATIONS" : "INFUSÉ DANS NOS CRÉATIONS"}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {ing.matchingProducts.map((pId) => {
                          const product = products.find(prod => prod.id === pId);
                          if (!product) return null;
                          return (
                            <button
                              key={pId}
                              onClick={(e) => {
                                e.stopPropagation();
                                onShowProduct(product);
                              }}
                              className="bg-[#A67C52]/15 border border-[#A67C52]/30 text-[#E8DCC6] px-3 py-1.5 rounded-xs text-[10px] uppercase font-mono tracking-wide hover:bg-[#A67C52] hover:text-white transition-all flex items-center gap-1.5"
                            >
                              {product.name}
                              <ArrowRight className="h-2.5 w-2.5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2 border-t border-[#E8DCC6]/40 text-[9px] uppercase tracking-widest font-bold text-[#A67C52] group">
                    <span>{language === 'EN' ? "Read secrets" : "Lire les secrets"}</span>
                    <Info className="h-3.5 w-3.5 text-stone-400 group-hover:text-[#A67C52] transition-colors" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
