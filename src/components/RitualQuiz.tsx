import React, { useState } from 'react';
import { Compass, Sparkles, Check, ArrowRight, RefreshCw, ShoppingCart, HelpCircle } from 'lucide-react';
import { Product } from '../types';

interface RitualQuizProps {
  language: 'FR' | 'EN';
  products: Product[];
  onAddMultipleToCart: (items: Product[]) => void;
}

export default function RitualQuiz({ language, products, onAddMultipleToCart }: RitualQuizProps) {
  const [step, setStep] = useState<number>(0); // 0 = Intro, 1 = Intention, 2 = Sensation/Peau, 3 = Ambiance, 4 = Result
  
  // Quiz selections
  const [intention, setIntention] = useState<string>('');
  const [sensoryConcern, setSensoryConcern] = useState<string>('');
  const [atmosphere, setAtmosphere] = useState<string>('');
  
  // Feedback states
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const QUESTIONS = {
    intention: {
      questionFr: "Quelle est votre intention spirituelle actuelle ?",
      questionEn: "What is your current spiritual intention?",
      choices: [
        { id: 'abundance', textFr: "Abondance & Harmonie du Foyer", textEn: "Abundance & Harmony of Home", icon: "✨" },
        { id: 'purification', textFr: "Purification de l'Aura & Protection", textEn: "Aura Purification & Protection", icon: "🛡️" },
        { id: 'selflove', textFr: "Amour de Soi & Douceur sensorielle", textEn: "Self-Love & Sensory Tenderness", icon: "🌸" }
      ]
    },
    sensory: {
      questionFr: "De quoi votre corps ou votre peau a-t-il le plus besoin ?",
      questionEn: "What does your body or skin need most?",
      choices: [
        { id: 'dryness', textFr: "Nourrir intensément (Tiraillements, sécheresse)", textEn: "Intense Nutrition (Tension, dryness)", icon: "🌿" },
        { id: 'oiliness', textFr: "Clarté de teint & Détox (Argile purifiante)", textEn: "Clarity & Detox (Purifying Moroccan clays)", icon: "🏺" },
        { id: 'regeneration', textFr: "Régénération de nuit & Anti-fatigue", textEn: "Nighttime Regeneration & Anti-fatigue", icon: "🌌" }
      ]
    },
    atmosphere: {
      questionFr: "Quelle ambiance sensorielle vous appelle à l'instant ?",
      questionEn: "Which sensory atmosphere is calling you right now?",
      choices: [
        { id: 'warm', textFr: "Épices chaudes, cannelle & orange douce", textEn: "Warm spices, cinnamon & sweet orange", icon: "🍊" },
        { id: 'herbal', textFr: "Sauge blanche fraîche, menthe & romarin", textEn: "Fresh white sage, mint & wild rosemary", icon: "🌱" },
        { id: 'floral', textFr: "Rose poudrée, notes florales veloutées", textEn: "Powdery rose, velvety floral notes", icon: "🌹" }
      ]
    }
  };

  // Determine ideal match based on selections
  const calculateResult = () => {
    let matchedProducts: Product[] = [];
    let badgeFr = "";
    let badgeEn = "";
    let descFr = "";
    let descEn = "";

    if (intention === 'purification') {
      matchedProducts = products.filter(p => p.id === 'sels-purification' || p.id === 'bougie-mauvais-oeil');
      badgeFr = "RITUEL DE PURIFICATION SOUFFLE D'atlas";
      badgeEn = "ATLAS BREATH PURIFICATION RITUAL";
      descFr = "Conçu pour nettoyer l'esprit, bannir le mauvais œil et éliminer les charges négatives quotidiennes grâce à l'association des sels d'Epsom et du Lapis-Lazuli.";
      descEn = "Designed to cleanse the spirit, ward off heavy energies, and eliminate daily stress via Epsom salts and raw Lapis-Lazuli gemstone integration.";
    } else if (intention === 'selflove' || atmosphere === 'floral') {
      matchedProducts = products.filter(p => p.id === 'bougie-rose-damas' || p.id === 'savon-rose-sculptee');
      if (matchedProducts.length === 0) matchedProducts = products.slice(1, 3);
      badgeFr = "RITUEL D'AMOUR DE SOI ROSE DIVINE";
      badgeEn = "DIVINE ROSE SELF-LOVE RITUAL";
      descFr = "Une onction veloutée de Rose de Damas et de beurre de karité sculpté pour restaurer la douceur absolue de votre cœurs et éveiller la tendresse.";
      descEn = "A velvety ritual of Damascus Rose and hand-sculpted shea butter to restore absolute self-care, opening your heart chakra.";
    } else {
      // Default Abundance
      matchedProducts = products.filter(p => p.id === 'bougie-abondance' || p.id === 'savon-alchimie-argile');
      if (matchedProducts.length === 0) matchedProducts = products.slice(0, 2);
      badgeFr = "RITUEL DE PROSPÉRITÉ ET D'ABONDANCE";
      badgeEn = "PROSPERITY & LUNAR ABUNDANCE RITUAL";
      descFr = "Infusé à l'orange douce de Marrakech, aux cristaux de quartz rose et cannelle sauvage pour consacrer l'énergie de succès et d'argiles pures dans votre vie.";
      descEn = "Infused with Marrakech warm sweet orange, rose quartz, and wild cinnamon to consecrate high prosperity levels and pure clay minerals in your space.";
    }

    // Include apothecary oil as booster for night regeneration selection
    if (sensoryConcern === 'regeneration') {
      const oil = products.find(p => p.id === 'huile-botanique-nuit');
      if (oil && !matchedProducts.includes(oil)) {
        matchedProducts.push(oil);
      }
    }

    return { matchedProducts, badgeFr, badgeEn, descFr, descEn };
  };

  const resetQuiz = () => {
    setIntention('');
    setSensoryConcern('');
    setAtmosphere('');
    setStep(1);
    setAddedSuccess(false);
  };

  const handleStart = () => {
    setStep(1);
  };

  const handleChoice = (type: 'intention' | 'sensory' | 'atmosphere', value: string) => {
    if (type === 'intention') {
      setIntention(value);
      setStep(2);
    } else if (type === 'sensory') {
      setSensoryConcern(value);
      setStep(3);
    } else if (type === 'atmosphere') {
      setAtmosphere(value);
      setStep(4);
    }
  };

  const { matchedProducts, badgeFr, badgeEn, descFr, descEn } = step === 4 ? calculateResult() : { matchedProducts: [], badgeFr: '', badgeEn: '', descFr: '', descEn: '' };

  // Calculate discounted total for the ritual package
  const originalTotal = matchedProducts.reduce((sum, item) => sum + item.price, 0);
  const discountedPrice = Math.round(originalTotal * 0.9); // 10% Off

  const handleAddBundleToCart = () => {
    // We add matching items to the parent cart
    // Since our product schema is fully standardized, we can pass matched products directly
    onAddMultipleToCart(matchedProducts);
    setAddedSuccess(true);
  };

  return (
    <div className="bg-white border border-[#E8DCC6] p-6 md:p-12 rounded-sm shadow-xs relative overflow-hidden" id="ritual-diagnostic-quiz-container">
      {/* Absolute gold design backgrounds */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#A67C52]/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-radial from-[#CB8892]/5 to-transparent pointer-events-none" />

      {/* QUIZ STEP HEADER */}
      {step > 0 && step < 4 && (
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DCC6]/40 mb-8">
          <div className="flex items-center gap-2">
            <Compass className="h-4.5 w-4.5 text-[#A67C52] animate-[spin_10s_linear_infinite]" />
            <span className="font-mono text-[10px] uppercase text-[#A67C52] tracking-wider font-bold">
              {language === 'EN' ? "Diagnostic Ritual matching" : "Diagnostic Alchimique Sacré"}
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <span 
                key={s} 
                className={`w-4 h-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-[#A67C52]' : 'bg-[#E8DCC6]/40'}`} 
              />
            ))}
          </div>
        </div>
      )}

      {/* STEP 0: INTRODUCTORY CARD */}
      {step === 0 && (
        <div className="text-center py-6 space-y-6 max-w-xl mx-auto">
          <div className="p-3 bg-[#F7F2EB] rounded-full inline-block text-[#A67C52] border border-[#E8DCC6]">
            <Sparkles className="h-8 w-8 stroke-[1.25]" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.3em] font-extrabold text-[#A67C52] uppercase block">
              {language === 'EN' ? "✦ CHOOSE WITH CONSCIENCE ✦" : "✦ S'ALIGNER AVEC CONSCIENCE ✦"}
            </span>
            <h3 className="font-serif text-2xl md:text-3.5xl text-[#1E1A16] font-normal tracking-wide">
              {language === 'EN' ? "Le Diagnostic Rituel" : "Trouvez Votre Rituel Sacré"}
            </h3>
            <p className="text-xs md:text-sm text-[#1E1A16]/80 leading-relaxed font-sans font-light">
              {language === 'EN'
                ? "Answer 3 gentle questions to allow our botanical laboratory to formulate the precise sequence of oils, candles, and soaps matching your energetic intentions."
                : "Répondez à 3 questions douces guidées pour permettre à nos ateliers de déceler la synergie idéale de cires, minéraux et plantes terrestres qui répondra à votre intention actuelle."}
            </p>
          </div>

          <button
            onClick={handleStart}
            id="start-diagnostic-quiz-btn"
            className="bg-[#1E1A16] text-[#F7F2EB] px-8 py-4 text-xs font-bold uppercase tracking-[0.25em] hover:bg-[#A67C52] hover:text-[#F7F2EB] transition-all rounded-sm shadow-md active:scale-98"
          >
            {language === 'EN' ? "Begin alchemistry matching ✦" : "Débuter le Diagnostic Alchimique ✦"}
          </button>
        </div>
      )}

      {/* STEP 1: INTENTION QUESTION */}
      {step === 1 && (
        <div className="space-y-6 text-left max-w-2xl mx-auto">
          <h4 className="font-serif text-lg md:text-xl text-[#1E1A16] font-medium leading-tight">
            {language === 'EN' ? QUESTIONS.intention.questionEn : QUESTIONS.intention.questionFr}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {QUESTIONS.intention.choices.map((choice) => (
              <div
                key={choice.id}
                onClick={() => handleChoice('intention', choice.id)}
                className="p-6 bg-[#F7F2EB]/50 border border-[#E8DCC6] rounded-xs cursor-pointer hover:bg-[#FAF6F0] hover:border-[#A67C52] transition-all hover:shadow-md flex flex-col items-center text-center space-y-4 duration-300"
              >
                <span className="text-3xl">{choice.icon}</span>
                <span className="font-serif text-xs font-bold text-[#1E1A16] uppercase tracking-wider leading-relaxed">
                  {language === 'EN' ? choice.textEn : choice.textFr}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: SENSORY/SKIN QUESTION */}
      {step === 2 && (
        <div className="space-y-6 text-left max-w-2xl mx-auto">
          <h4 className="font-serif text-lg md:text-xl text-[#1E1A16] font-medium leading-tight">
            {language === 'EN' ? QUESTIONS.sensory.questionEn : QUESTIONS.sensory.questionFr}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {QUESTIONS.sensory.choices.map((choice) => (
              <div
                key={choice.id}
                onClick={() => handleChoice('sensory', choice.id)}
                className="p-6 bg-[#F7F2EB]/50 border border-[#E8DCC6] rounded-xs cursor-pointer hover:bg-[#FAF6F0] hover:border-[#A67C52] transition-all hover:shadow-md flex flex-col items-center text-center space-y-4 duration-300"
              >
                <span className="text-3xl">{choice.icon}</span>
                <span className="font-serif text-xs font-bold text-[#1E1A16] uppercase tracking-wider leading-relaxed">
                  {language === 'EN' ? choice.textEn : choice.textFr}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: ATMOSPHERE SENSORY */}
      {step === 3 && (
        <div className="space-y-6 text-left max-w-2xl mx-auto">
          <h4 className="font-serif text-lg md:text-xl text-[#1E1A16] font-medium leading-tight">
            {language === 'EN' ? QUESTIONS.atmosphere.questionEn : QUESTIONS.atmosphere.questionFr}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {QUESTIONS.atmosphere.choices.map((choice) => (
              <div
                key={choice.id}
                onClick={() => handleChoice('atmosphere', choice.id)}
                className="p-6 bg-[#F7F2EB]/50 border border-[#E8DCC6] rounded-xs cursor-pointer hover:bg-[#FAF6F0] hover:border-[#A67C52] transition-all hover:shadow-md flex flex-col items-center text-center space-y-4 duration-300"
              >
                <span className="text-3xl">{choice.icon}</span>
                <span className="font-serif text-xs font-bold text-[#1E1A16] uppercase tracking-wider leading-relaxed">
                  {language === 'EN' ? choice.textEn : choice.textFr}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: DIAGNOSTIC RESULTS OVERVIEW */}
      {step === 4 && (
        <div className="space-y-8 text-left max-w-3xl mx-auto animate-fade-in">
          
          <div className="text-center space-y-3 pb-6 border-b border-[#E8DCC6]/60">
            <span className="text-[9px] tracking-[0.22em] font-extrabold text-[#A67C52] uppercase bg-[#A67C52]/10 py-1.5 px-3 rounded-full inline-block">
              {language === 'EN' ? badgeEn : badgeFr}
            </span>
            <h3 className="font-serif text-2xl md:text-3.5xl text-[#1E1A16] font-normal tracking-wide">
              {language === 'EN' ? "Your Personal Ritual match" : "Votre Synergie Sacrée IDÉALE"}
            </h3>
            <p className="text-xs md:text-sm text-[#1E1A16]/75 max-w-2xl mx-auto leading-relaxed">
              {language === 'EN' ? descEn : descFr}
            </p>
          </div>

          {/* Matched Items Details Row */}
          <div className="space-y-4">
            <h4 className="font-serif text-xs tracking-widest font-bold text-[#A67C52] uppercase">
              {language === 'EN' ? "✦ Formulated Sequence components" : "✦ Séquence composée du rituel (Inclus)"}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedProducts.map((p) => (
                <div key={p.id} className="p-4 bg-[#FAF6F0] border border-[#E8DCC6] rounded-xs flex gap-4 items-center">
                  <div className="w-16 h-16 shrink-0 rounded-xs overflow-hidden border border-[#E8DCC6]">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] tracking-wider text-[#A67C52] uppercase font-mono font-bold">{p.category}</span>
                    <h5 className="font-serif text-xs font-bold text-[#1E1A16] uppercase truncate mt-0.5">{p.name}</h5>
                    <p className="text-[11px] text-[#A67C52] font-semibold mt-1">{p.price} DH</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout ritual bundle panel with 10% Bundle Discount */}
          <div className="bg-[#1E1A16] text-[#F7F2EB] p-6 sm:p-8 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#A67C52]/30 shadow-lg">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[8px] tracking-[0.25em] font-bold text-[#A67C52] uppercase block">
                {language === 'EN' ? "✦ EXCLUSIVE ATHLETE & ALCHEMY ADVANTAGE" : "✦ ÉCO-RITUEL COMPLET AVEC 10% DE RÉDUCTION"}
              </span>
              <h4 className="font-serif text-lg leading-snug font-normal text-white">
                {language === 'EN' ? "Order your holistic bundle" : "Adopter le Rituel Holistique Complet"}
              </h4>
              <p className="text-[10px] text-[#E8DCC6]/60 leading-normal max-w-md">
                {language === 'EN'
                  ? "Receive all matching botanical formulas securely wrapped together. Save 10% on the individual components selection."
                  : "Recevez l'ensemble des créations formulées ci-dessus scellées sous papier de soie sacré à l'Atelier. Une remise immédiate de 10% s'applique."}
              </p>
            </div>

            <div className="text-center sm:text-right space-y-4 w-full sm:w-auto shrink-0">
              <div className="flex flex-col items-center sm:items-end justify-center">
                <span className="text-[11px] text-gray-400 line-through font-mono">
                  {originalTotal} DH
                </span>
                <span className="text-2xl font-serif text-[#E8DCC6] font-extrabold tracking-wide">
                  {discountedPrice} DH
                </span>
                <span className="text-[9px] text-green-400 italic font-mono mt-1">✦ Économisez {originalTotal - discountedPrice} DH</span>
              </div>

              {!addedSuccess ? (
                <button
                  onClick={handleAddBundleToCart}
                  className="w-full sm:w-auto bg-[#A67C52] text-white hover:bg-white hover:text-[#1E1A16] duration-300 transition-all font-bold tracking-widest text-xs uppercase py-3.5 px-6 rounded-sm shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {language === 'EN' ? "Adopt ritual kit" : "Ajouter le Rituel Complexe ✦"}
                </button>
              ) : (
                <div className="bg-green-800/20 border border-green-600/30 text-green-300 text-xs py-3 px-6 rounded-sm text-center flex items-center justify-center gap-2">
                  <Check className="h-4.5 w-4.5 text-green-400" />
                  {language === 'EN' ? "Kit added!" : "Rituel ajouté au Panier !"}
                </div>
              )}
            </div>
          </div>

          {/* Reset link */}
          <div className="text-center pt-2">
            <button 
              onClick={resetQuiz} 
              className="text-xs text-[#A67C52] hover:text-[#1E1A16] flex items-center gap-1.5 mx-auto hover:underline font-mono"
            >
              <RefreshCw className="h-3 w-3" />
              {language === 'EN' ? "Fermer ou recommencer le diagnostic" : "Recommencer ou modifier vos réponses"}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
