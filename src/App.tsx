import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, Campaign, CurrencyCode, formatPrice } from './types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_ARTICLES } from './data';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import ShoppingCartDrawer from './components/ShoppingCartDrawer';
import AdminPanel from './components/AdminPanel';
import AuthGatewayModal from './components/AuthGatewayModal';
import HelpAndInquiriesModal from './components/HelpAndInquiriesModal';
import SpiritualLogo from './components/SpiritualLogo';
import moroccanHeroBg from '../merakya_brand_hero_oriental_1779243623302.png';
import imgAbondance from '../merakya_abondance_1779241793445.png';
import imgRoseDamas from '../merakya_rose_damas_1779241813197.png';
import imgMauvaisOeil from '../merakya_mauvais_oeil_1779241832267.png';
import imgAlchimieArgile from '../merakya_alchimie_argile_1779241853230.png';
import imgRoseSculptee from '../merakya_rose_sculptee_1779241869509.png';
import imgSelsPurification from '../merakya_sels_purification_1779243565328.png';
import imgElixirEtoiles from '../merakya_elixir_etoiles_1779243585736.png';
import imgCoffretLune from '../merakya_coffret_lune_1779243605101.png';

import { Language, translations, PRODUCT_TRANSLATIONS, ARTICLE_TRANSLATIONS, REVIEW_TRANSLATIONS } from './translations';

import { 
  Sparkles, Compass, Leaf, Heart, Sun, ArrowRight, 
  MapPin, CheckCircle, CreditCard, Box, Gift, Headphones,
  Mail, Calendar, Lock, Instagram, Facebook, Share2, Twitter, Link, Check
} from 'lucide-react';

export default function App() {
  // State variables synchronized with user requirements
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('merakya_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('merakya_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('merakya_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [articles, setArticles] = useState<any[]>(() => {
    const saved = localStorage.getItem('merakya_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [activeArticle, setActiveArticle] = useState<any | null>(null);
  const [isLinkCopied, setIsLinkCopied] = useState<boolean>(false);

  // UI state managers
  const [currentView, setCurrentView] = useState<string>('accueil'); // 'accueil', 'boutique', 'rituels', 'journal', 'histoire', 'contact'
  const [isAdminActive, setIsAdminActive] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  
  // Custom states matching user's multi-currency & client register requests
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('MAD');
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('merakya_language');
    return (saved as Language) || 'FR';
  });

  useEffect(() => {
    localStorage.setItem('merakya_language', language);
  }, [language]);

  // Translation helper function
  const t = (key: keyof typeof translations['FR']) => {
    return translations[language][key] || translations['FR'][key] || '';
  };
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [journalTab, setJournalTab] = useState<'all' | 'chroniques' | 'presse'>('all');
  
  // Boutique filter options
  const [selectedCategory, setSelectedCategory] = useState<string>('TOUS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [availability, setAvailability] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  
  // Newsletter Form State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  
  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);
  const [activeInquirySection, setActiveInquirySection] = useState<string | null>(null);

  // Rituals Interactive States and helpers
  const [selectedRitualTab, setSelectedRitualTab] = useState<'purification' | 'abondance' | 'regeneration'>('purification');
  const [activeOracleCard, setActiveOracleCard] = useState<{titleFr: string; titleEn: string; descFr: string; descEn: string; gemFr: string; gemEn: string; color: string} | null>(null);
  
  // Breathing guide state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathingSec, setBreathingSec] = useState(4);

  useEffect(() => {
    if (!isBreathingActive) {
      setBreathingPhase('Inhale');
      setBreathingSec(4);
      return;
    }
    
    const interval = setInterval(() => {
      setBreathingSec((prev) => {
        if (prev <= 1) {
          if (breathingPhase === 'Inhale') {
            setBreathingPhase('Hold');
            return 7;
          } else if (breathingPhase === 'Hold') {
            setBreathingPhase('Exhale');
            return 8;
          } else {
            setBreathingPhase('Inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive, breathingPhase]);

  // Article translation helper
  const getArticleTrans = (art: any) => {
    if (!art) return { title: '', summary: '', content: '', category: '' };
    if (language === 'EN' && ARTICLE_TRANSLATIONS[art.id]) {
      return {
        title: ARTICLE_TRANSLATIONS[art.id].titleEn,
        summary: ARTICLE_TRANSLATIONS[art.id].summaryEn,
        content: ARTICLE_TRANSLATIONS[art.id].contentEn,
        category: ARTICLE_TRANSLATIONS[art.id].catEn
      };
    }
    return {
      title: art.title,
      summary: art.summary,
      content: art.content,
      category: art.category
    };
  };

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('merakya_campaigns');
    return saved ? JSON.parse(saved) : [
      {
        id: 'camp-1',
        title: 'Livraison Offerte et Rituels',
        content: '✦ LIVRAISON OFFERTE DÈS 400 DH AU MAROC ✦ INSPIRÉ DES RITUELS ANCESTRAUX ET SACRÉS ✦ SAVONS, BOUGIES ET ÉLIXIRS 100% NATURELS ✦ ARTISANAT MAROCAIN ÉTHIQUE ET FAIT MAIN',
        isActive: true,
        type: 'banner'
      }
    ];
  });

  // Automatic migration: sync existing product assets with new MERAKYA visuals if they use legacy placeholders
  useEffect(() => {
    const migrated = products.map((p) => {
      const original = INITIAL_PRODUCTS.find((init) => init.id === p.id);
      if (original && (p.image?.includes('unsplash') || p.image?.includes('picsum') || !p.image)) {
        if (original.image && !original.image.includes('unsplash') && !original.image.includes('picsum')) {
          return { ...p, image: original.image };
        }
      }
      return p;
    });
    const hasDiff = JSON.stringify(migrated.map(m => m.image)) !== JSON.stringify(products.map(m => m.image));
    if (hasDiff) {
      setProducts(migrated);
    }
  }, []);

  // Listen for Stripe checkout redirects and restore session details
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stripeStatus = params.get('stripe_status');
    const sessionId = params.get('session_id');

    if (stripeStatus === 'success' && sessionId) {
      const pendingStr = localStorage.getItem('merakya_pending_checkout');
      let customerDetails = {
        customerName: "Rituels de Lumière ✦",
        customerEmail: "contact@merakya.com",
        customerPhone: "+212 600-000000",
        customerAddress: "Livraison Nationale Spéciale"
      };
      
      let cartItems = cart;
      if (pendingStr) {
        try {
          const parsed = JSON.parse(pendingStr);
          if (parsed.details) {
            customerDetails = parsed.details;
          }
          if (parsed.cart && parsed.cart.length > 0) {
            cartItems = parsed.cart;
          }
        } catch (e) {
          console.error("Error reading temporary checkout storage:", e);
        }
      }

      const totalAmount = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      const uniqueSuffix = sessionId.slice(-6).toUpperCase();

      const newOrder: Order = {
        id: `ME-STRIPE-${uniqueSuffix}`,
        customerName: customerDetails.customerName,
        customerEmail: customerDetails.customerEmail,
        customerPhone: customerDetails.customerPhone,
        customerAddress: customerDetails.customerAddress,
        items: cartItems,
        totalAmount: totalAmount,
        date: new Date().toLocaleDateString('fr-FR'),
        status: 'Payé par Carte' as any
      };

      // Add to orders in state (de-duplicate just in case)
      setOrders((prev) => {
        if (prev.some(o => o.id === newOrder.id)) return prev;
        return [newOrder, ...prev];
      });

      // Reset local cart & details
      setCart([]);
      localStorage.removeItem('merakya_pending_checkout');
      
      // Clear query string to preserve URL aesthetics
      window.history.replaceState({}, document.title, window.location.pathname);
      
      setTimeout(() => {
        alert(language === 'EN' 
          ? "✦ Thank you! Your card payment was certified successful by Stripe. Your sacred rituels are being packaged at our Marrakech atelier."
          : "✦ Merci infiniment ! Votre paiement par carte bancaire a été certifié avec succès par Stripe. Vos rituels sacrés sont en cours de préparation dans notre atelier de Marrakech.");
      }, 350);
    } else if (stripeStatus === 'cancel') {
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => {
        alert(language === 'EN'
          ? "⚠️ The payment flow was cancelled."
          : "⚠️ Le processus de paiement en ligne a été interrompu.");
      }, 350);
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('merakya_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('merakya_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('merakya_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('merakya_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('merakya_articles', JSON.stringify(articles));
  }, [articles]);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    // Open cart automatically to guide smooth checkout funnel
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, qty: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  // Checkout submit order funnel
  const handleCheckoutSubmit = (details: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
  }) => {
    const totalAmount = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const newOrder: Order = {
      id: 'ME-ORDER-' + Math.floor(100000 + Math.random() * 900000),
      customerName: details.customerName,
      customerEmail: details.customerEmail,
      customerPhone: details.customerPhone,
      customerAddress: details.customerAddress,
      items: [...cart],
      totalAmount: totalAmount,
      date: new Date().toLocaleDateString('fr-FR'),
      status: 'En attente'
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Reset the cart
  };

  // Admin Actions
  const handleAddProduct = (newProd: Omit<Product, 'id'>) => {
    const id = 'prod-custom-' + Date.now();
    setProducts((prev) => [...prev, { id, ...newProd }]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleResetCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  // Filtered selections
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'TOUS' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = p.price <= maxPrice;
    const matchesAvailability = 
      availability === 'all' || 
      (availability === 'inStock' && p.inStock !== false) || 
      (availability === 'outOfStock' && p.inStock === false);
    return matchesCategory && matchesSearch && matchesPrice && matchesAvailability;
  });

  return (
    <div className="bg-[#F7F2EB] text-[#1E1A16] font-sans antialiased min-h-screen Selection:bg-[#A67C52]/20 select-text">
      
      {/* Dynamic Navigation bar */}
      <Navbar 
        cart={cart}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        onAdminToggle={() => {
          if (isAdminActive) {
            setIsAdminActive(false);
          } else {
            setIsAuthModalOpen(true);
          }
        }}
        isAdminActive={isAdminActive}
        onNavigate={(sect) => {
          setIsAdminActive(false);
          setCurrentView(sect);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeTab={currentView}
        campaigns={campaigns}
        selectedCurrency={selectedCurrency}
        onChangeCurrency={setSelectedCurrency}
        selectedLanguage={language}
        onLanguageChange={setLanguage}
      />

      {/* Main Container Switch */}
      {isAdminActive ? (
        <AdminPanel
          products={products}
          orders={orders}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateProduct={handleUpdateProduct}
          onResetCatalog={handleResetCatalog}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          campaigns={campaigns}
          onUpdateCampaigns={setCampaigns}
          articles={articles}
          onUpdateArticles={setArticles}
          language={language}
        />
      ) : (
        <main className="w-full">
          
          {/* ACCUEIL / HOME VIEW */}
          {currentView === 'accueil' && (
            <div className="animate-fade-in animate-duration-500">
              
              {/* HERO SECTION WITH IMMERSIVE FULL-WIDTH BACKGROUND */}
              <section className="relative px-6 md:px-16 lg:px-24 overflow-hidden min-h-[580px] md:min-h-[720px] lg:min-h-[780px] flex items-center border-b border-[#E8DCC6]">
                {/* Immersive background image matching the screenshot perfectly */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={moroccanHeroBg} 
                    alt="L'Alchimie du Bien-être par Merakya" 
                    className="w-full h-full object-cover filter brightness-[0.96] contrast-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle dark-amber gradient overlay from left to guarantee high contrast read of text */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1E1A16]/95 via-[#1E1A16]/65 to-transparent md:block hidden" />
                  <div className="absolute inset-0 bg-[#1E1A16]/85 md:hidden block" />
                  
                  {/* Fine grain overlay for luxury paper atmosphere */}
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay opacity-40 pointer-events-none" />
                </div>
 
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full relative z-10 py-12 md:py-24">
                       {/* Left Hero contents with premium typography and interactive seals */}
                  <div className="lg:col-span-7 space-y-7 md:space-y-9 text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] md:text-xs tracking-[0.35em] font-extrabold text-[#A67C52] uppercase">
                        {t('subtext')}
                      </span>
                      <span className="text-[#A67C52] text-xs animate-pulse">✦</span>
                    </div>
 
                    <div className="space-y-4">
                      <h1 className="font-serif text-4xl sm:text-5xl md:text-6.5xl text-[#F7F2EB] font-normal leading-[1.12] tracking-wide drop-shadow-sm select-none">
                        {language === 'EN' ? (
                          <>THE ALCHEMY <br /> <span className="italic font-normal text-[#E8DCC6]">OF WELL-BEING</span></>
                        ) : (
                          <>L’ALCHIMIE <br /> <span className="italic font-normal text-[#E8DCC6]">DU BIEN-ÊTRE</span></>
                        )}
                      </h1>
                      
                      {/* Subtly animated decorative divider */}
                      <div className="flex items-center gap-3 py-1">
                        <div className="w-16 h-[1px] bg-[#A67C52]" />
                        <span className="text-[#A67C52] text-xs">✦</span>
                        <div className="w-8 h-[1px] bg-[#A67C52]/50" />
                      </div>
                    </div>
 
                    <p className="text-sm md:text-base text-[#E8DCC6]/90 leading-relaxed max-w-lg font-sans font-light">
                      {t('hero_subtitle')}
                    </p>

                    <div className="font-serif italic text-base md:text-lg text-[#E8DCC6]/95 tracking-wide pt-1 border-l-2 border-[#A67C52] pl-4 max-w-md">
                      « {t('signature')} »
                    </div>
 
                    {/* Action trigger row with beautiful circular rotating golden stamp */}
                    <div className="flex flex-wrap items-center gap-6 pt-3">
                      <button
                        id="btn-discover-universe"
                        onClick={() => { setSelectedCategory('TOUS'); setCurrentView('boutique'); }}
                        className="bg-[#A67C52] text-[#F7F2EB] px-8 py-4 text-xs font-bold uppercase tracking-[0.22em] hover:bg-[#F7F2EB] hover:text-[#1E1A16] transition-all rounded-sm shadow-xl active:scale-98 duration-300 border border-[#A67C52]/30"
                      >
                        {language === 'EN' ? "Discover the universe" : "Découvrir l'univers"}
                      </button>
                      
                      {/* Scented Alchemistry Royal Stamp - matches screenshot #1 top right seal style, rotating beautifully */}
                      <div className="relative w-24 h-24 shrink-0 cursor-pointer hidden sm:flex items-center justify-center animate-[spin_40s_linear_infinite] group" title="Sceau de qualité sacrée Merakya">
                        <svg viewBox="0 0 100 100" className="w-full h-full text-[#A67C52] transition-colors group-hover:text-[#E8DCC6]">
                          <defs>
                            <path id="stampTextPath" d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" />
                          </defs>
                          {/* Inner gold lines */}
                          <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.75" strokeDasharray="1.5 1.5" className="opacity-70" />
                          <circle cx="50" cy="50" r="31" stroke="currentColor" strokeWidth="0.5" className="opacity-40" />
                          <text className="font-sans text-[6.5px] font-bold tracking-[0.16em] uppercase fill-[#E8DCC6] group-hover:fill-white">
                            <textPath href="#stampTextPath">ÉNERGIE PURE • INTENTION SACRÉE • </textPath>
                          </text>
                        </svg>
                        <div className="absolute flex items-center justify-center">
                          <span className="text-xs text-[#A67C52] group-hover:text-[#E8DCC6] font-bold duration-300">✦</span>
                        </div>
                      </div>
                    </div>
 
                    {/* Minimalist aesthetic indicators */}
                    <div className="flex space-x-2 pt-8 opacity-75">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#A67C52] ring-2 ring-[#A67C52]/30" />
                      <span className="w-2.5 h-2.5 rounded-full border border-[#E8DCC6]/40" />
                      <span className="w-2.5 h-2.5 rounded-full border border-[#E8DCC6]/40" />
                    </div>
                  </div>
 
                  {/* Right Column has no obstructing block cards, so the gorgeous products on the table are shown at 100% clarity */}
                  <div className="lg:col-span-5 h-20 lg:h-auto" />
 
                </div>
              </section>
 
              {/* VALUES ICON-BASED ROW */}
              <section className="bg-white border-b border-[#E8DCC6] py-8 px-4 md:px-12">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
                  {[
                    { title: language === 'EN' ? "NATURAL INGREDIENTS" : "INGRÉDIENTS NATURELS", desc: language === 'EN' ? "Consciously sourced" : "Sourcés avec conscience", icon: Leaf },
                    { title: language === 'EN' ? "ANCESTRAL ALCHEMY" : "ALCHIMIE ANCESTRALE", desc: language === 'EN' ? "Craftsman savoir-faire" : "Savoir-faire artisanal", icon: Compass },
                    { title: language === 'EN' ? "SACRED ENERGY" : "ÉNERGIE SACRÉE", desc: language === 'EN' ? "Infused with intentions" : "Infusé d'intentions", icon: Sun },
                    { title: language === 'EN' ? "CRAFTED WITH LOVE" : "FAIT AVEC AMOUR", desc: language === 'EN' ? "In micro batches" : "En petites quantités", icon: Heart },
                    { title: language === 'EN' ? "HOLISTIC RITUELS" : "RITUELS HOLISTIQUES", desc: language === 'EN' ? "Body, Soul, Mind" : "Corps, Âme, Esprit", icon: Sparkles }
                  ].map((val, idx) => {
                    const Icon = val.icon;
                    return (
                      <div key={idx} className="flex flex-col items-center p-3 space-y-2 group">
                        <div className="p-3 bg-[#F7F2EB] rounded-full text-[#A67C52] group-hover:bg-[#A67C52] group-hover:text-[#F7F2EB] transition-all duration-300">
                          <Icon className="h-5 w-5 stroke-[1.5]" />
                        </div>
                        <h4 className="font-serif text-[11px] font-bold tracking-widest text-[#1E1A16] uppercase mt-1">
                          {val.title}
                        </h4>
                        <p className="text-[10px] text-[#1E1A16]/70 italic">
                          {val.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 5 CATEGORIES BANNER GRID SECTION */}
              <section className="bg-[#F7F2EB] py-16 px-4 md:px-12 max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-3">
                  <span className="text-[10px] tracking-[0.35em] font-extrabold text-[#A67C52] uppercase block">
                    {language === 'EN' ? "✦ THE ART OF THE APOTHECARY ✦" : "✦ L’ART DE L’APOTHICAIRE ✦"}
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-[#1E1A16] font-normal tracking-wide">
                    {language === 'EN' ? "Our Sacred Collections" : "Nos Collections Sacrées"}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="w-12 h-[1px] bg-[#A67C52]" />
                    <span className="text-[#A67C52] text-xs">✦</span>
                    <div className="w-12 h-[1px] bg-[#A67C52]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                  {[
                    {
                      name: "BOUGIES RITUELLES",
                      desc: language === 'FR' ? "Bougies artisanales" : "Artisan candles",
                      img: imgAbondance
                    },
                    {
                      name: "SAVONS & SOINS NATURELS",
                      desc: language === 'FR' ? "Cosmétique biologique" : "Organic cosmetics",
                      img: imgRoseSculptee
                    },
                    {
                      name: "SELS & BAINS ÉNERGÉTIQUES",
                      desc: language === 'FR' ? "Bains ésotériques" : "Esoteric bath sets",
                      img: imgSelsPurification
                    },
                    {
                      name: "HUILES & ÉLIXIRS BOTANIQUES",
                      desc: language === 'FR' ? "Sérums botaniques" : "Botanical serums",
                      img: imgElixirEtoiles
                    },
                    {
                      name: "COFFRETS RITUELS",
                      desc: language === 'FR' ? "Cadeaux de lune" : "Lunar gift sets",
                      img: imgCoffretLune
                    }
                  ].map((cat, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setCurrentView('boutique');
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className="group relative aspect-[3/4] overflow-hidden rounded-xs cursor-pointer shadow-md border border-[#E8DCC6] transition-all duration-500 hover:border-[#A67C52] hover:shadow-[0_10px_30px_rgba(166,124,82,0.25)] hover:-translate-y-1"
                    >
                      <img 
                        src={cat.img} 
                        alt={cat.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Rich amber-dark filter layer overlay */}
                      <div className="absolute inset-0 bg-[#1E1A16]/50 group-hover:bg-[#1E1A16]/65 transition-all duration-500" />
                      
                      {/* Fine gold-accented frame border layout inside the card */}
                      <div className="absolute inset-3.5 border border-[#E8DCC6]/25 group-hover:border-[#A67C52]/50 transition-colors duration-500 flex flex-col justify-end p-4 text-center items-center">
                        <span className="text-[8px] text-[#E8DCC6]/80 tracking-[0.2em] uppercase block mb-1">{cat.desc}</span>
                        <h3 className="font-serif text-xs sm:text-sm text-white tracking-widest leading-snug font-medium uppercase group-hover:text-[#E8DCC6] transition-colors">
                          {cat.name}
                        </h3>
                        <span className="text-[9px] text-[#A67C52] tracking-widest font-bold mt-4 opacity-75 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 uppercase">
                          {language === 'EN' ? "Discover" : "Découvrir"} <ArrowRight className="h-2.5 w-2.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* RE-CREATE PHILOSOPHY PORT BLOCK */}
              <section className="bg-[#E8DCC6]/25 border-t border-[#E8DCC6] py-16 px-4 md:px-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left explanation text info */}
                  <div className="lg:col-span-5 space-y-6 text-left">
                    <span className="text-[10px] tracking-widest font-extrabold text-[#A67C52] uppercase block">
                      {language === 'EN' ? "✦ OUR ESSENCE" : "✦ NOTRE ESSENCE"}
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl text-[#1E1A16] font-normal leading-tight tracking-wide">
                      {language === 'EN' ? (
                        <>Merakya, more <br /> than a brand, <br /> <span className="italic font-normal">a philosophy.</span></>
                      ) : (
                        <>Merakya, plus <br /> qu'une marque, <br /> <span className="italic font-normal">une philosophie.</span></>
                      )}
                    </h2>
                    
                    <p className="text-sm text-[#1E1A16]/80 leading-relaxed font-sans max-w-md">
                      {language === 'EN' 
                        ? "Each creation is an invitation to return to what yields truth, connecting deeply with nature and yourself through sacred rituals and ingredients of absolute botanical purity."
                        : "Chaque création est une invitation à revenir à l'essentiel, à se reconnecter à la nature et à soi-même à travers des rituels sacrés et des ingrédients de pureté absolue."}
                    </p>

                    <button
                      id="btn-discover-our-history"
                      onClick={() => { setCurrentView('histoire'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="bg-[#A67C52] text-[#F7F2EB] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#1E1A16] transition-all rounded-sm shadow-sm"
                    >
                      {language === 'EN' ? "Discover our story" : "Découvrir notre histoire"}
                    </button>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#E8DCC6] text-center">
                      {[
                        { title: language === 'EN' ? "PLANT WISDOM" : "SAGESSE DES PLANTES" },
                        { title: language === 'EN' ? "SACRED RITUALS" : "RITUELS SACRÉS" },
                        { title: language === 'EN' ? "SCIENCE & NATURE" : "SCIENCE & INNOVATION" },
                        { title: language === 'EN' ? "ENERGY & THOUGHT" : "ÉNERGIE & PENSÉE" }
                      ].map((sub, sidx) => (
                        <div key={sidx} className="bg-white/50 p-3 border border-[#E8DCC6] rounded-xs">
                          <span className="text-[9px] tracking-widest font-bold uppercase text-[#1E1A16]">
                            {sub.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Arched doorway elements & decorative geometry layout */}
                  <div className="lg:col-span-7 relative">
                    <div className="relative aspect-video sm:aspect-square md:aspect-[16/10] lg:aspect-[4/3] w-full rounded-sm overflow-hidden shadow-2xl border border-[#A67C52]/30 bg-[#1E1A16] p-8 flex flex-col justify-center items-center text-center">
                      
                      {/* Subtly animated background glow */}
                      <div className="absolute inset-0 bg-radial from-[#3D2C1E] via-[#1E1A16] to-[#1E1A16] opacity-90" />
                      
                      {/* Fine geometric Zellij layout background patterns */}
                      <div className="absolute inset-5 border border-[#A67C52]/20 rounded-xs pointer-events-none" />
                      <div className="absolute inset-7 border border-[#A67C52]/10 rounded-xs pointer-events-none" />

                      {/* Giant Interactive Golden Star Mandala */}
                      <div className="relative w-44 h-44 sm:w-56 sm:h-56 opacity-85 select-none pointer-events-none mb-4 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#A67C52] animate-[spin_120s_linear_infinite]">
                          {/* Outer dotted orbit */}
                          <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 2" />
                          <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="0.75" />
                          
                          {/* Star quadrants indicators */}
                          <circle cx="20" cy="50" r="1.5" fill="currentColor" />
                          <circle cx="80" cy="50" r="1.5" fill="currentColor" />
                          <circle cx="50" cy="20" r="1.5" fill="currentColor" />
                          <circle cx="50" cy="80" r="1.5" fill="currentColor" />
                          
                          {/* Main 8-pointed star */}
                          <path d="M50 5 L64 36 L95 50 L64 64 L50 95 L36 64 L5 50 L36 36 Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
                          
                          {/* Inner square systems */}
                          <rect x="22" y="22" width="56" height="56" stroke="currentColor" strokeWidth="0.5" />
                          <rect x="22" y="22" width="56" height="56" stroke="currentColor" strokeWidth="0.5" transform="rotate(45 50 50)" />
                          
                          {/* Central sanctuary circle */}
                          <circle cx="50" cy="50" r="16" fill="#1E1A16" stroke="currentColor" strokeWidth="1" />
                        </svg>
                        
                        {/* Glowing "M" in the very center, positioned absolutely to remain upright */}
                        <div className="absolute flex items-center justify-center">
                          <span className="font-serif text-[#E8DCC6] text-3xl font-normal lowercase select-none tracking-normal pr-0.5 pb-0.5">
                            m
                          </span>
                        </div>
                      </div>

                      {/* Spiritual Quote on top of mandala */}
                      <div className="relative z-10 max-w-sm space-y-3">
                        <p className="font-serif italic text-base sm:text-lg leading-relaxed text-[#F7F2EB] pt-1">
                          "Chaque rituel est un dialogue secret entre l’âme de la nature et votre propre lumière intérieure."
                        </p>
                        <div className="w-12 h-px bg-[#A67C52] mx-auto opacity-60" />
                        <p className="text-[10px] tracking-[0.2em] uppercase text-[#A67C52] font-semibold">
                          ✧ l'essence spirituelle de merakya maroc ✧
                        </p>
                      </div>

                      {/* Scattering rose/lavender dried botanical elements floating around */}
                      <div className="absolute top-8 left-12 w-2 h-2 rounded-full bg-[#CB8892]/40 filter blur-xs animate-pulse pointer-events-none" />
                      <div className="absolute bottom-10 right-16 w-3 h-3 rounded-full bg-[#A67C52]/30 filter blur-xs animate-pulse pointer-events-none" />
                      <div className="absolute top-20 right-10 w-2 h-2 rounded-full bg-[#E8DCC6]/40 filter blur-xs animate-pulse pointer-events-none" />
                      
                    </div>
                  </div>
                </div>
              </section>

              {/* REVIEWS INSET */}
              <section className="bg-white py-16 px-4 md:px-12 text-center border-b border-[#E8DCC6]">
                <div className="max-w-4xl mx-auto space-y-12">
                  <div className="space-y-2">
                    <span className="text-[10px] tracking-widest font-extrabold text-[#A67C52] uppercase block">{t('test_kicker')}</span>
                    <h2 className="font-serif text-2xl md:text-3xl text-[#1E1A16] font-normal tracking-wide">
                      {t('test_title')}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {INITIAL_REVIEWS.map((review) => {
                      const textVal = language === 'EN' && REVIEW_TRANSLATIONS[review.id]
                        ? REVIEW_TRANSLATIONS[review.id].textEn
                        : review.text;
                      return (
                        <div key={review.id} className="p-6 bg-[#F7F2EB] border border-[#E8DCC6] rounded-xs flex flex-col justify-between text-left shadow-xs hover:shadow-md transition-shadow">
                          <div className="space-y-4">
                            <div className="text-amber-500 font-sans tracking-wide text-sm">★★★★★</div>
                            <p className="text-xs text-[#1E1A16]/80 leading-relaxed italic">
                              "{textVal}"
                            </p>
                          </div>
                          <span className="text-[10px] tracking-widest font-bold uppercase text-[#A67C52] mt-6 block border-t border-[#E8DCC6] pt-3">
                            — {review.author}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

            </div>
          )}

          {/* BOUTIQUE / SHOP VIEW */}
          {currentView === 'boutique' && (
            <div className="max-w-7xl mx-auto py-12 px-4 md:px-12 animate-fade-in space-y-12">
              
              {/* Header Title with search row - Centered and Unified */}
              <div className="text-center space-y-3 pb-8 border-b border-[#E8DCC6] max-w-4xl mx-auto">
                <span className="text-[10px] md:text-xs tracking-[0.3em] font-extrabold text-[#A67C52] uppercase block font-sans">
                  ✦ {language === 'EN' ? "THE SACRED BOUTIQUE" : "LA BOUTIQUE SACRÉE"} ✦
                </span>
                <h1 className="font-serif text-3.5xl md:text-5xl text-[#1E1A16] font-normal tracking-wide uppercase leading-tight select-none">
                  {t('boutique_title')}
                </h1>
                <p className="text-xs md:text-sm text-[#A67C52] font-serif italic max-w-2xl mx-auto leading-relaxed">
                  {t('boutique_subtitle')}
                </p>
                <div className="flex items-center justify-center gap-2 pt-1 pb-2">
                  <div className="w-12 h-[1px] bg-[#A67C52]/40" />
                  <span className="text-[#A67C52] text-[9px]">✦</span>
                  <div className="w-12 h-[1px] bg-[#A67C52]/40" />
                </div>

                {/* Centered Search bar inside the catalog */}
                <div className="max-w-md mx-auto pt-2">
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('boutique_search_placeholder')}
                    className="w-full bg-white border border-[#E8DCC6] px-4 py-2.5 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52] rounded-sm shadow-xs text-center"
                  />
                </div>
              </div>

              {/* Categorization tabs */}
              <div className="flex border-b border-[#E8DCC6] overflow-x-auto space-x-2 md:space-x-4 pb-1">
                {['TOUS', 'BOUGIES RITUELLES', 'SAVONS & SOINS NATURELS', 'SELS & BAINS ÉNERGÉTIQUES', 'HUILES & ÉLIXIRS BOTANIQUES', 'COFFRETS RITUELS'].map((cat) => {
                  const labelMap: Record<string, string> = {
                    'TOUS': language === 'EN' ? 'ALL' : 'TOUS',
                    'BOUGIES RITUELLES': language === 'EN' ? 'RITUAL CANDLES' : 'BOUGIES RITUELLES',
                    'SAVONS & SOINS NATURELS': language === 'EN' ? 'SOAPS & NATURAL CARE' : 'SAVONS & SOINS NATURELS',
                    'SELS & BAINS ÉNERGÉTIQUES': language === 'EN' ? 'ENERGY BATH & SALTS' : 'SELS & BAINS ÉNERGÉTIQUES',
                    'HUILES & ÉLIXIRS BOTANIQUES': language === 'EN' ? 'BOTANICAL OILS & ELIXIRS' : 'HUILES & ÉLIXIRS BOTANIQUES',
                    'COFFRETS RITUELS': language === 'EN' ? 'RITUAL CHESTS' : 'COFFRETS RITUELS'
                  };
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`py-3 px-4 font-sans text-[10px] font-bold tracking-widest uppercase border-b-2 whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? 'border-[#A67C52] text-[#A67C52]'
                          : 'border-transparent text-[#1E1A16]/50 hover:text-[#1E1A16]'
                      }`}
                    >
                      {labelMap[cat] || cat}
                    </button>
                  );
                })}
              </div>

              {/* Advanced Filter Panel: Price & Availability */}
              <div className="bg-[#F7F2EB] border border-[#E8DCC6]/60 p-5 font-sans text-xs text-[#1E1A16] grid grid-cols-1 md:grid-cols-2 gap-6 items-center rounded-sm">
                {/* Price range selector */}
                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center font-bold uppercase text-[10px] tracking-wider text-[#A67C52]">
                    <span>{t('filter_price')}</span>
                    <span className="bg-[#A67C52] text-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-sm">
                      {t('filter_price_max')} {formatPrice(maxPrice, selectedCurrency)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-[#1E1A16]/60 font-semibold">75 DH</span>
                    <input 
                      type="range"
                      min="75"
                      max="500"
                      step="5"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="flex-1 accent-[#A67C52] cursor-pointer bg-[#F7F2EB] border border-[#E8DCC6] h-1.5 rounded-lg appearance-none"
                    />
                    <span className="text-[10px] text-[#1E1A16]/60 font-semibold">500 DH</span>
                  </div>
                </div>

                {/* Availability filter switches */}
                <div className="space-y-3 text-left">
                  <div className="font-bold uppercase text-[10px] tracking-wider text-[#A67C52]">
                    {t('filter_availability')}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'all', label: t('filter_all') },
                      { value: 'inStock', label: t('filter_in_stock') },
                      { value: 'outOfStock', label: t('filter_out_of_stock') }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setAvailability(opt.value as any)}
                        className={`px-3 py-1.5 text-[8.5px] md:text-[9.5px] font-bold uppercase tracking-widest border transition-all rounded-xs ${
                          availability === opt.value
                            ? 'bg-[#1E1A16] text-[#F7F2EB] border-[#1E1A16]'
                            : 'bg-white text-[#1E1A16]/70 border-[#E8DCC6] hover:border-[#A67C52]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Grid display */}
              {filteredProducts.length === 0 ? (
                <div className="py-24 text-center space-y-3 bg-[#E8DCC6]/10 border border-dashed border-[#E8DCC6] rounded-sm">
                  <p className="font-serif text-lg text-[#1E1A16]/75">
                    {t('boutique_no_products')}
                  </p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('TOUS'); setMaxPrice(500); setAvailability('all'); }}
                    className="text-xs text-[#A67C52] underline uppercase tracking-widest font-bold"
                  >
                    {language === 'EN' ? "Reset all filters" : "Réinitialiser tous les filtres"}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      onViewDetails={(p) => setSelectedProduct(p)}
                      onAddToCart={handleAddToCart}
                      selectedCurrency={selectedCurrency}
                      language={language}
                    />
                  ))}
                </div>
              )}

            </div>
          )}

          {/* RITUELS / PRACTICES VIEW */}
          {currentView === 'rituels' && (
            <div className="max-w-5xl mx-auto py-12 px-4 md:py-16 md:px-12 animate-fade-in space-y-16 text-left">
              
              {/* Grand Header - Centered and Unified */}
              <div className="text-center space-y-3 pb-8 border-b border-[#E8DCC6] max-w-4xl mx-auto">
                <span className="text-[10px] md:text-xs tracking-[0.3em] font-extrabold text-[#A67C52] uppercase block font-sans">
                  ✦ {language === 'EN' ? "SACRED INITIATION & ALCHEMY" : "INITIATION SACRÉE & ALCHIMIE"} ✦
                </span>
                <h1 className="font-serif text-3.5xl md:text-5xl text-[#1E1A16] font-normal tracking-wide uppercase leading-tight select-none">
                  {language === 'EN' ? "Sacred Rituals" : "Nos Rituels Sacrés"}
                </h1>
                <p className="text-xs md:text-sm text-[#A67C52] font-serif italic max-w-2xl mx-auto leading-relaxed">
                  {language === 'EN' 
                    ? "Transcend simple cosmetic care into true spiritual alignments. Discover our step-by-step guidance to cleanse your energy and manifest divine light."
                    : "Transformez vos gestes quotidiens en véritables rituels d'élévation éthérique. Suivez nos guides pas-à-pas pour harmoniser vos énergies sacrées."}
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <div className="w-12 h-[1px] bg-[#A67C52]/40" />
                  <span className="text-[#A67C52] text-[9px]">✦</span>
                  <div className="w-12 h-[1px] bg-[#A67C52]/40" />
                </div>
              </div>

              {/* SECTION 1: INTERACTIVE PARCOURS SACRÉS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                
                {/* Left Side: Journeys tabs & Detail Panel */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="font-serif text-[#1E1A16] text-lg font-medium flex items-center gap-2">
                    <Compass className="h-5 w-5 text-[#A67C52]" />
                    {language === 'EN' ? "1. Select your Alchemical Pathway" : "1. Choisissez votre Parcours Alchimique"}
                  </h3>

                  {/* Tabs Selectors */}
                  <div className="flex flex-wrap gap-2 border-b border-[#E8DCC6] pb-3">
                    <button
                      onClick={() => setSelectedRitualTab('purification')}
                      className={`px-4 py-2 text-[10px] md:text-xs uppercase font-bold tracking-widest rounded-xs transition-all ${
                        selectedRitualTab === 'purification'
                          ? 'bg-[#1E1A16] text-[#F7F2EB]'
                          : 'bg-[#E8DCC6]/30 text-gray-500 hover:text-[#1E1A16] hover:bg-[#E8DCC6]/50'
                      }`}
                    >
                      {language === 'EN' ? "Aura Purification" : "Purification de l'Aura"}
                    </button>
                    <button
                      onClick={() => setSelectedRitualTab('abondance')}
                      className={`px-4 py-2 text-[10px] md:text-xs uppercase font-bold tracking-widest rounded-xs transition-all ${
                        selectedRitualTab === 'abondance'
                          ? 'bg-[#1E1A16] text-[#F7F2EB]'
                          : 'bg-[#E8DCC6]/30 text-gray-500 hover:text-[#1E1A16] hover:bg-[#E8DCC6]/50'
                      }`}
                    >
                      {language === 'EN' ? "Lunar Abundance" : "Abondance Lunaire"}
                    </button>
                    <button
                      onClick={() => setSelectedRitualTab('regeneration')}
                      className={`px-4 py-2 text-[10px] md:text-xs uppercase font-bold tracking-widest rounded-xs transition-all ${
                        selectedRitualTab === 'regeneration'
                          ? 'bg-[#1E1A16] text-[#F7F2EB]'
                          : 'bg-[#E8DCC6]/30 text-gray-500 hover:text-[#1E1A16] hover:bg-[#E8DCC6]/50'
                      }`}
                    >
                      {language === 'EN' ? "Night Restoration" : "Régénération Nocturne"}
                    </button>
                  </div>

                  {/* Tab Detail Inner Board */}
                  <div className="bg-[#E8DCC6]/20 border border-[#E8DCC6] p-6 md:p-8 rounded-sm space-y-6">
                    {selectedRitualTab === 'purification' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <span className="text-[10px] tracking-widest font-extrabold text-[#A67C52] uppercase block">✦ WATER & SALINE CLEANSE</span>
                          <h4 className="font-serif text-xl text-[#1E1A16] font-normal">
                            {language === 'EN' ? "Bain Sacré de Purification Aura" : "Bain Sacré & Protection éthérique"}
                          </h4>
                          <p className="text-xs text-gray-600 leading-relaxed font-light font-sans">
                            {language === 'EN'
                              ? "A specialized practice designed to dissolve daily fatigue, heavy mental projections, and dense negative vibrations accumulated in the urban centers."
                              : "Un rituel de libération sensorielle formulé pour dissoudre les charges mentales parasites, les tensions urbaines et purifier l'enveloppe éthérique."}
                          </p>
                        </div>

                        {/* Step Details list */}
                        <div className="space-y-4 pt-4 border-t border-[#E8DCC6]/50 font-sans text-xs text-[#1E1A16]/90">
                          <div className="flex gap-4 items-start">
                            <span className="font-bold text-[#A67C52] text-sm">I.</span>
                            <p>
                              <strong className="font-bold block mb-0.5">{language === 'EN' ? "Prepare the Sanctuary" : "Ouvrir l'Espace"}</strong>
                              {language === 'EN'
                                ? "Light our 'Evil Eye' Protection Candle with a single noble wood match. Let the scent of mountain peppermint and Arab Myrrh expand into the bathroom air."
                                : "Allumez la Bougie de protection 'Mauvais Œil'. Laissez ses arômes de menthe sauvage et de myrrhe pure saturer calmement l'atmosphère de votre salle d'eau."}
                            </p>
                          </div>
                          <div className="flex gap-4 items-start">
                            <span className="font-bold text-[#A67C52] text-sm">II.</span>
                            <p>
                              <strong className="font-bold block mb-0.5">{language === 'EN' ? "The Mineral Infusion" : "L'Infusion Cristalline"}</strong>
                              {language === 'EN'
                                ? "Under warm running bathwater, cascade three wooden spoons of our sacred Purification Epsom Salts. Let the salt crystals and dry mountain sage infuse deep."
                                : "Sous le jet d'eau chaude de votre baignoire, versez trois cuillères de nos Sels sacrés 'Purification'. Laissez les minéraux d'Epsom et la sauge sauvage se dissoudre."}
                            </p>
                          </div>
                          <div className="flex gap-4 items-start">
                            <span className="font-bold text-[#A67C52] text-sm">III.</span>
                            <p>
                              <strong className="font-bold block mb-0.5">{language === 'EN' ? "Affirmation of Shielding" : "Ancrage Éthérique"}</strong>
                              {language === 'EN'
                                ? "Settle in for a 20-minute silent soak. Close your eyes and whisper: 'My space is gold, my aura is light, I am protected.' Retain the raw Lapis Lazuli gemstone as your personal safe protector."
                                : "Immergez-vous pendant 20 minutes. Fermez les yeux et récitez : 'Mon espace est d'or, mon esprit se libère, je suis protégé'. Récupérez le cristal de Lapis-Lazuli brut et gardez-le sur vous."}
                            </p>
                          </div>
                        </div>

                        {/* Connected products thumbnail linking */}
                        <div className="pt-4 border-t border-[#E8DCC6]/60 space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#A67C52] block">{language === 'EN' ? "✦ REQUIRED ALCHEMICAL CREATIONS" : "✦ CRÉATIONS ALCHIMIQUES REQUISES"}</span>
                          <div className="flex gap-4">
                            {products.filter(p => ['sels-purification', 'bougie-mauvais-oeil'].includes(p.id)).map(prod => (
                              <button
                                key={prod.id}
                                onClick={() => setSelectedProduct(prod)}
                                className="flex items-center gap-3 bg-white/70 border border-[#E8DCC6] p-2 hover:bg-white hover:border-[#A67C52] rounded-xs text-left transition-all font-sans"
                              >
                                <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-xs border border-[#E8DCC6]" referrerPolicy="no-referrer" />
                                <div>
                                  <span className="font-serif text-[11px] font-bold block text-[#1E1A16]">{language === 'EN' ? PRODUCT_TRANSLATIONS[prod.id]?.nameEn || prod.name : prod.name}</span>
                                  <span className="text-[9px] text-[#A67C52] underline block">{language === 'EN' ? "Click to view ✦" : "Voir les secrets ✦"}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}

                    {selectedRitualTab === 'abondance' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <span className="text-[10px] tracking-widest font-extrabold text-[#A67C52] uppercase block">✦ GOLD & LUNAR MANIFESTATION</span>
                          <h4 className="font-serif text-xl text-[#1E1A16] font-normal">
                            {language === 'EN' ? "Ritual of Manifestation and Abundance" : "Manifestation & Multiplications de Flux"}
                          </h4>
                          <p className="text-xs text-gray-600 leading-relaxed font-light font-sans">
                            {language === 'EN'
                              ? "Best performed during the evenings of Nova Luna (New Moon) to initiate material expansion, business success, and creative flow."
                              : "Pratique idéale sous l'influence magique de la Nouvelle Lune afin de semer des graines de prospérité, d'abondance matérielle et d'expansion créative."}
                          </p>
                        </div>

                        {/* Step Details list */}
                        <div className="space-y-4 pt-4 border-t border-[#E8DCC6]/50 font-sans text-xs text-[#1E1A16]/90">
                          <div className="flex gap-4 items-start">
                            <span className="font-bold text-[#A67C52] text-sm">I.</span>
                            <p>
                              <strong className="font-bold block mb-0.5">{language === 'EN' ? "Prepare the Intent" : "Formuler le Souhait"}</strong>
                              {language === 'EN'
                                ? "Write your spiritual and financial growth objectives on parchment or clean paper. Retain these wishes inside a special place under your Abundance ritual station."
                                : "Inscrivez vos vœux d'évolution (matérielle ou créative) sur un petit papier kraft neutre. Pliez-le délicatement et disposez-le sous votre bougie rituelle."}
                            </p>
                          </div>
                          <div className="flex gap-4 items-start">
                            <span className="font-bold text-[#A67C52] text-sm">II.</span>
                            <p>
                              <strong className="font-bold block mb-0.5">{language === 'EN' ? "The Candle Initiation" : "Le Brasier Solaire"}</strong>
                              {language === 'EN'
                                ? "Light the 'Abundance' Soy Candle. As the natural soy wax melts, the energized raw rose quartz crystals embed their prosperous energy. Let the Marrakech orange blossom fragrance enlighten your room."
                                : "Allumez la Bougie Sacrée d'Abondance. En fondant, la cire de soja va doucement libérer l'énergie bienfaisante des éclats de quartz rose incorporés à la main."}
                            </p>
                          </div>
                          <div className="flex gap-4 items-start">
                            <span className="font-bold text-[#A67C52] text-sm">III.</span>
                            <p>
                              <strong className="font-bold block mb-0.5">{language === 'EN' ? "Rose Cleansing Sensation" : "Massage d'Onction d'Or"}</strong>
                              {language === 'EN'
                                ? "Wash your hands and face with our Rose Divine exquisite carved soap. Feel the satin gold micas wrapping your skin, illustrating the abundance already flowing into your path."
                                : "Lavez vos mains et votre visage à l'aide des pétales de mousse du Savon sculpté Rose Divine. Sentez la fine mousse satinée dorée envelopper votre peau, symbole d'abondance."}
                            </p>
                          </div>
                        </div>

                        {/* Connected products thumbnail linking */}
                        <div className="pt-4 border-t border-[#E8DCC6]/60 space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#A67C52] block">{language === 'EN' ? "✦ REQUIRED ALCHEMICAL CREATIONS" : "✦ CRÉATIONS ALCHIMIQUES REQUISES"}</span>
                          <div className="flex gap-4">
                            {products.filter(p => ['bougie-abondance', 'savon-rose-sculptee'].includes(p.id)).map(prod => (
                              <button
                                key={prod.id}
                                onClick={() => setSelectedProduct(prod)}
                                className="flex items-center gap-3 bg-white/70 border border-[#E8DCC6] p-2 hover:bg-white hover:border-[#A67C52] rounded-xs text-left transition-all font-sans"
                              >
                                <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-xs border border-[#E8DCC6]" referrerPolicy="no-referrer" />
                                <div>
                                  <span className="font-serif text-[11px] font-bold block text-[#1E1A16]">{language === 'EN' ? PRODUCT_TRANSLATIONS[prod.id]?.nameEn || prod.name : prod.name}</span>
                                  <span className="text-[9px] text-[#A67C52] underline block">{language === 'EN' ? "Click to view ✦" : "Voir les secrets ✦"}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}

                    {selectedRitualTab === 'regeneration' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <span className="text-[10px] tracking-widest font-extrabold text-[#A67C52] uppercase block">✦ HIGH ATLAS PLANTS REJUVENATION</span>
                          <h4 className="font-serif text-xl text-[#1E1A16] font-normal">
                            {language === 'EN' ? "Night Esoteric Botanical Regeneration" : "Régénération Sacrée de l'Éclipse"}
                          </h4>
                          <p className="text-xs text-gray-600 leading-relaxed font-light font-sans">
                            {language === 'EN'
                              ? "The ultimate evening skincare routine using raw clay active minerals and exceptional prickly pear seed oil to recreate cellular aura during deep sleep."
                              : "Une routine d'onction nocturne combinant les argiles ancestrales de l'Atlas et l'huile de pépins de figue de barbarie pour rebâtir la barrière cutanée."}
                          </p>
                        </div>

                        {/* Step Details list */}
                        <div className="space-y-4 pt-4 border-t border-[#E8DCC6]/50 font-sans text-xs text-[#1E1A16]/90">
                          <div className="flex gap-4 items-start">
                            <span className="font-bold text-[#A67C52] text-sm">I.</span>
                            <p>
                              <strong className="font-bold block mb-0.5">{language === 'EN' ? "Earthy Purifying Wash" : "Purification Tellurique"}</strong>
                              {language === 'EN'
                                ? "Lather the Alchimie Verte Ancestral Soap in your hands. Cleanse your neck and facial pores with this creamy red and green Atlas clay strata, absorbing toxic congestions."
                                : "Faites mousser le Savon Alchimie Verte & Ocre. Massez doucement le visage pour laisser agir les minéraux absorbants de l'argile verte du Ghassoul."}
                            </p>
                          </div>
                          <div className="flex gap-4 items-start">
                            <span className="font-bold text-[#A67C52] text-sm">II.</span>
                            <p>
                              <strong className="font-bold block mb-0.5">{language === 'EN' ? "Warm the Elixir" : "Activation Stellaire"}</strong>
                              {language === 'EN'
                                ? "Dispense three drops of our magnificent Élixir d'Étoiles nightly botanical serum on your palm. Rub both palms together to unlock the botanical energy of Roman Chamomile."
                                : "Déposez trois gouttes d'Élixir d'Étoiles dans votre paume. Frottez vigoureusement pour chauffer sa synergie précieuse de camomille et de figue de barbarie."}
                            </p>
                          </div>
                          <div className="flex gap-4 items-start">
                            <span className="font-bold text-[#A67C52] text-sm">III.</span>
                            <p>
                              <strong className="font-bold block mb-0.5">{language === 'EN' ? "The Sleep Alignment" : "Imprégnation Astrale"}</strong>
                              {language === 'EN'
                                ? "Press palms onto facial bones and cheeks, then sweep upward. Close your eyes, release all daytime narrative, and drift into a deep celestial sleep."
                                : "Appliquez par effleurements lents de bas en haut. Fermez les yeux, inspirez profondément et abandonnez-vous aux forces réparatrices de la nuit."}
                            </p>
                          </div>
                        </div>

                        {/* Connected products thumbnail linking */}
                        <div className="pt-4 border-t border-[#E8DCC6]/60 space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#A67C52] block">{language === 'EN' ? "✦ REQUIRED ALCHEMICAL CREATIONS" : "✦ CRÉATIONS ALCHIMIQUES REQUISES"}</span>
                          <div className="flex gap-4">
                            {products.filter(p => ['savon-alchimie-argile', 'huile-botanique-nuit'].includes(p.id)).map(prod => (
                              <button
                                key={prod.id}
                                onClick={() => setSelectedProduct(prod)}
                                className="flex items-center gap-3 bg-white/70 border border-[#E8DCC6] p-2 hover:bg-white hover:border-[#A67C52] rounded-xs text-left transition-all font-sans"
                              >
                                <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-xs border border-[#E8DCC6]" referrerPolicy="no-referrer" />
                                <div>
                                  <span className="font-serif text-[11px] font-bold block text-[#1E1A16]">{language === 'EN' ? PRODUCT_TRANSLATIONS[prod.id]?.nameEn || prod.name : prod.name}</span>
                                  <span className="text-[9px] text-[#A67C52] underline block">{language === 'EN' ? "Click to view ✦" : "Voir les secrets ✦"}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                </div>

                {/* Right Side: Quick Stateful Interactive Modules */}
                <div className="space-y-8">
                  
                  {/* MODULE A: INTERACTIVE BREATH PACING HARMONIZER */}
                  <div className="bg-[#1E1A16] text-[#F7F2EB] p-6 rounded-sm border border-[#A67C52]/30 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#A67C52] block font-mono">✦ MYSTICAL PACING</span>
                      <h4 className="font-serif text-base font-normal tracking-wide text-white">
                        {language === 'EN' ? "Sacred Breathing Harmonizer" : "Harmonisation Respiratoire"}
                      </h4>
                      <p className="text-[10px] text-[#E8DCC6]/70 font-sans leading-relaxed">
                        {language === 'EN'
                          ? "Align your cognitive cells and dissolve stress circles with our rhythmic 4-7-8 alchemical respirator box."
                          : "Alignez vos vibrations émotionnelles et évacuez les surcharges avec notre guide d'onction inspire 4-7-8."}
                      </p>
                    </div>

                    {/* Animated Visual Core Sphere */}
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="relative flex items-center justify-center h-28 w-44">
                        
                        {/* Animated Glowing Halos */}
                        <div 
                          className={`absolute rounded-full bg-[#A67C52]/10 border border-[#A67C52]/30 transition-all duration-1000 ${
                            !isBreathingActive ? 'w-20 h-20' : 
                            breathingPhase === 'Inhale' ? 'w-28 h-28 scale-110 opacity-100' :
                            breathingPhase === 'Hold' ? 'w-28 h-28 scale-110 opacity-75 bg-amber-500/5 border-amber-400' :
                            'w-16 h-16 scale-95 opacity-50'
                          }`}
                        />
                        
                        {/* Core circle */}
                        <div 
                          className={`w-14 h-14 rounded-full bg-[#A67C52] shadow-lg flex flex-col items-center justify-center z-10 transition-all duration-1000 ${
                            isBreathingActive && breathingPhase === 'Hold' ? 'bg-amber-600 scale-105' : ''
                          }`}
                        >
                          {isBreathingActive ? (
                            <span className="font-serif text-sm text-white font-bold">{breathingSec}s</span>
                          ) : (
                            <Sparkles className="h-4.5 w-4.5 text-white" />
                          )}
                        </div>
                      </div>

                      {/* Display Texts */}
                      <div className="mt-2 text-center space-y-1 z-10">
                        {isBreathingActive ? (
                          <>
                            <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#A67C52] block">
                              {breathingPhase === 'Inhale' ? (language === 'EN' ? "INSPIRE (IN) • 4s" : "INSPIRER (IN) • 4s") :
                               breathingPhase === 'Hold' ? (language === 'EN' ? "RETAIN (HOLD) • 7s" : "RETENIR (HOLD) • 7s") :
                               (language === 'EN' ? "EXHALE (OUT) • 8s" : "EXPIRER (OUT) • 8s")}
                            </span>
                            <span className="text-[9px] text-[#E8DCC6]/60 font-light block italic h-5">
                              {breathingPhase === 'Inhale' ? (language === 'EN' ? "Swell your chest with cosmic energy" : "Prenez l'air de manière fluide") :
                               breathingPhase === 'Hold' ? (language === 'EN' ? "Store the beneficial botanical ions" : "Retenez l'air pour infuser") :
                               (language === 'EN' ? "Let all residual stress dissolve" : "Expulsez toute charge lourde")}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-xs uppercase font-semibold text-white tracking-widest block">
                              {language === 'EN' ? "Pacing Box Idle" : "Pulsateur inactif"}
                            </span>
                            <span className="text-[9px] text-[#E8DCC6]/60 block font-light">
                              {language === 'EN' ? "Click initiates 4-7-8 loop" : "Cliquez pour initier la boucle 4-7-8"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Operational action button */}
                    <button
                      onClick={() => setIsBreathingActive(!isBreathingActive)}
                      className="w-full bg-[#A67C52] hover:bg-[#A67C52]/90 text-white text-[10px] uppercase font-bold tracking-widest py-2.5 rounded-xs transition-colors block text-center"
                    >
                      {isBreathingActive 
                        ? (language === 'EN' ? "✦ HALT PRACTICE" : "✦ ARRETER L'EXERCICE") 
                        : (language === 'EN' ? "✦ COMMENCE PRACTICE" : "✦ INITIER L'EXERCICE")}
                    </button>
                  </div>

                  {/* MODULE B: INTENTION ORACLE (TIRER UNE CARTE DAILY RITUAL) */}
                  <div className="bg-[#E8DCC6]/30 border border-[#E8DCC6] p-6 rounded-sm space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#A67C52] block">✦ CELestial tarot</span>
                      <h4 className="font-serif text-base text-[#1E1A16] font-normal leading-tight">
                        {language === 'EN' ? "The Thought Oracle" : "L'Oracle de la Pensée"}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-sans leading-relaxed">
                        {language === 'EN'
                          ? "Inquire the ether forces. Draw your positive celestial guidance and crystal pairings of the day."
                          : "Consultez les ondes célestes. Tirez une carte d'ancrage sacrée pour harmoniser votre journée."}
                      </p>
                    </div>

                    {/* Flipping oracle card container */}
                    <div className="flex justify-center py-2 h-44 select-none">
                      {activeOracleCard ? (
                        /* Drawn Card */
                        <div 
                          className={`w-full max-w-[200px] bg-white border border-[#A67C52]/50 p-3 rounded-md shadow-lg flex flex-col justify-between text-center transition-all ${activeOracleCard.color}`}
                        >
                          <span className="text-[8px] tracking-widest font-extrabold text-[#A67C52] uppercase block">✦ {language === 'EN' ? "THOUGHT" : "PENSÉE"} ✦</span>
                          
                          <div className="space-y-1 my-1">
                            <h5 className="font-serif font-bold text-[11px] text-[#1E1A16] uppercase tracking-wide">
                              {language === 'EN' ? activeOracleCard.titleEn : activeOracleCard.titleFr}
                            </h5>
                            <p className="text-[9.5px] text-gray-600 leading-normal italic font-light">
                              "{language === 'EN' ? activeOracleCard.descEn : activeOracleCard.descFr}"
                            </p>
                          </div>

                          <div className="border-t border-[#E8DCC6]/60 pt-1.5 text-[9px] font-mono text-[#A67C52] flex flex-col">
                            <span className="uppercase font-bold tracking-wider text-[8px]">{language === 'EN' ? "RECOMMENDED GEMSTONE:" : "CRISTAL D'ALIGNEMENT :"}</span>
                            <span className="text-[#1E1A16] font-sans font-semibold mt-0.5">{language === 'EN' ? activeOracleCard.gemEn : activeOracleCard.gemFr}</span>
                          </div>
                        </div>
                      ) : (
                        /* Un-drawn card mockup slot */
                        <button
                          onClick={() => {
                            const cards = [
                              {
                                id: '1',
                                titleFr: "Amour Inconditionnel",
                                titleEn: "Unconditional Love",
                                descFr: "Votre cœur s'ouvre à la bienveillance suprême. Lâchez les jugements et vibrez avec douceur.",
                                descEn: "Your heart expands to raw tenderness. Drop judgment and feel fully aligned with life.",
                                gemFr: "Quartz Rose Énergisé",
                                gemEn: "Energized Rose Quartz",
                                color: "border-pink-200 bg-pink-50/10"
                              },
                              {
                                id: '2',
                                titleFr: "Abondance Divine",
                                titleEn: "Celestial Prosperity",
                                descFr: "L'Univers multiplie vos opportunités. Chassez l'illusion du manque, vous méritez l'opulence.",
                                descEn: "The Universe multiplies cosmic flows. Eradicate scarcity thoughts; you desere sublime opulence.",
                                gemFr: "Citrine & Orange Fleur",
                                gemEn: "Citrine & Orange Blossom",
                                color: "border-amber-200 bg-amber-50/10"
                              },
                              {
                                id: '3',
                                titleFr: "Bouclier d'Aura",
                                titleEn: "Aura Protection Shield",
                                descFr: "Votre esprit est un temple royal souverain. Toutes les vibrations lourdes glissent sans vous toucher.",
                                descEn: "Your aura is an royal sovereign temple. Heavy vibes drift away harmlessly. You are sacred.",
                                gemFr: "Lapis Lazuli Purifié",
                                gemEn: "Purified Lapis Lazuli",
                                color: "border-blue-200 bg-blue-50/10"
                              },
                              {
                                id: '4',
                                titleFr: "Clarté Mystique",
                                titleEn: "Mystic Light Clarity",
                                descFr: "Les brouillards des doutes s'évaporent maintenant. Écoutez votre étincelle d'intuition profonde.",
                                descEn: "All doutes and fatigue evaporate into light. Trust the inner whisper of your sacred intuition.",
                                gemFr: "Cristal de Roche Pur",
                                gemEn: "Pure Clear Quartz",
                                color: "border-neutral-200 bg-[#F7F2EB]"
                              }
                            ];
                            const random = cards[Math.floor(Math.random() * cards.length)];
                            setActiveOracleCard(random);
                          }}
                          className="w-full max-w-[120px] bg-[#1E1A16] border border-[#A67C52] rounded-md shadow-md hover:border-[#F7F2EB] flex flex-col justify-between text-center p-3 text-[#F7F2EB] hover:scale-105 transition-all group cursor-pointer"
                        >
                          <div className="w-full h-full border border-[#A67C52]/40 rounded-sm p-1.5 flex flex-col justify-between items-center bg-[radial-gradient(ellipse_at_center,rgba(166,124,82,0.1)_0%,rgba(0,0,0,0)_80%)]">
                            <span className="text-[7px] tracking-widest text-[#A67C52] block uppercase">✦ MERAKYA ✦</span>
                            <Compass className="h-5 w-5 text-[#A67C52] group-hover:rotate-180 transition-transform duration-700" />
                            <span className="text-[8px] uppercase tracking-wider text-[#A67C52] block group-hover:text-white transition-colors">
                              {language === 'EN' ? "DRAW AN INTENTION" : "TIRER UNE CARTE"}
                            </span>
                          </div>
                        </button>
                      )}
                    </div>

                    {/* Reset draw buttons */}
                    {activeOracleCard && (
                      <button
                        onClick={() => setActiveOracleCard(null)}
                        className="text-[9px] uppercase font-bold tracking-widest text-[#A67C52] hover:text-[#1E1A16] underline block mx-auto text-center"
                      >
                        {language === 'EN' ? "Draw another thought ✦" : "Tirer une autre pensée ✦"}
                      </button>
                    )}

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* JOURNAL / CHRONICLES VIEW */}
          {currentView === 'journal' && (
            <div className="max-w-5xl mx-auto py-12 px-4 md:py-16 md:px-12 animate-fade-in space-y-12">
              
              {/* IMMERSIVE READER MODE */}
              {activeArticle ? (
                <div className="max-w-3xl mx-auto space-y-8 animate-fade-in text-left font-sans">
                  {/* Back button link */}
                  <button 
                    onClick={() => {
                      setActiveArticle(null);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A67C52] hover:text-[#1E1A16] transition-colors"
                  >
                    <span className="text-sm transition-transform group-hover:-translate-x-1">←</span> {language === 'EN' ? "Back to Chronicles & Press" : "Retour aux Chroniques & Presse"}
                  </button>

                  {/* Header Meta */}
                  <div className="space-y-4 pt-4 border-t border-[#E8DCC6]/60">
                    <span className="inline-block text-[9px] tracking-widest font-extrabold text-[#A67C52] bg-[#A67C52]/5 px-2.5 py-1 rounded-sm uppercase">
                      {getArticleTrans(activeArticle).category}
                    </span>
                    <h1 className="font-serif text-3xl md:text-4.5xl text-[#1E1A16] leading-tight font-normal">
                      {getArticleTrans(activeArticle).title}
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-3 pt-2 pb-4 border-b border-[#E8DCC6]/60 text-xs text-gray-500 font-sans">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span>{language === 'EN' ? 'By' : 'Par'} {activeArticle.author}</span>
                        <span>•</span>
                        <span>{activeArticle.date}</span>
                        <span>•</span>
                        <span className="font-mono">{language === 'EN' ? `${activeArticle.readTime.split(' ')[0]} min read` : `${activeArticle.readTime} de lecture`}</span>
                      </div>
                      
                      {/* Social sharing row */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-[#A67C52] font-semibold font-sans mr-1">
                          {language === 'EN' ? "Share:" : "Partager:"}
                        </span>
                        
                        <button
                          onClick={() => {
                            const url = encodeURIComponent(window.location.href);
                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer,width=600,height=400');
                          }}
                          className="p-1 px-1.5 rounded-sm hover:bg-[#A67C52]/10 text-gray-600 hover:text-[#3b5998] transition-all"
                          title="Facebook"
                        >
                          <Facebook className="h-3.5 w-3.5" />
                        </button>
                        
                        <button
                          onClick={() => {
                            const url = encodeURIComponent(window.location.href);
                            const text = encodeURIComponent(getArticleTrans(activeArticle).title);
                            window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer,width=600,height=400');
                          }}
                          className="p-1 px-1.5 rounded-sm hover:bg-[#A67C52]/10 text-gray-600 hover:text-[#1DA1F2] transition-all"
                          title="Twitter"
                        >
                          <Twitter className="h-3.5 w-3.5" />
                        </button>
                        
                        <button
                          onClick={() => {
                            const url = encodeURIComponent(window.location.href);
                            const media = encodeURIComponent(activeArticle.image || '');
                            const desc = encodeURIComponent(getArticleTrans(activeArticle).title);
                            window.open(`https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${desc}`, '_blank', 'noopener,noreferrer,width=600,height=400');
                          }}
                          className="p-1 px-1.5 rounded-sm hover:bg-[#A67C52]/10 text-gray-600 hover:text-[#bd081c] transition-all"
                          title="Pinterest"
                        >
                          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.24 0C5.7 0 0 4.7 0 11.1c0 4.2 2.6 7.8 6.4 9.2-.1-.8-.2-2-.1-2.9l1.2-5.1s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5 1 0 1.5.7 1.5 1.6 0 1-.6 2.4-.9 3.7-.3 1.2.6 2.1 1.8 2.1 2.2 0 3.8-2.2 3.8-5.5 0-2.9-2.1-4.9-5-4.9-3.4 0-5.4 2.6-5.4 5.2 0 1 .4 2.1.9 2.7.1.1.1.2.1.3-.1.4-.3 1.2-.3 1.4-.1.2-.2.3-.4.2-1.5-.7-2.4-2.8-2.4-4.5 0-3.7 2.7-7.1 7.8-7.1 4.1 0 7.3 2.9 7.3 6.8 0 4.1-2.6 7.4-6.2 7.4-1.2 0-2.4-.6-2.8-1.4l-.8 2.9c-.3 1.1-1.1 2.4-1.6 3.2 1.1.3 2.3.5 3.5.5 6.5 0 11.8-5.3 11.8-11.8C24 5.3 18.7 0 12.24 0z"/>
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setIsLinkCopied(true);
                            setTimeout(() => setIsLinkCopied(false), 2500);
                          }}
                          className={`p-1 px-1.5 rounded-sm transition-all flex items-center gap-1 ${isLinkCopied ? 'bg-green-50 text-green-600' : 'hover:bg-[#A67C52]/10 text-gray-600 hover:text-[#A67C52]'}`}
                          title={language === 'EN' ? "Copy link" : "Copier le lien"}
                        >
                          {isLinkCopied ? <Check className="h-3.5 w-3.5" /> : <Link className="h-3.5 w-3.5" />}
                          {isLinkCopied && <span className="text-[9px] font-bold">{language === 'EN' ? "Copied!" : "Copié!"}</span>}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* High Quality Article Cover image */}
                  <div className="aspect-video w-full overflow-hidden rounded-xs border border-[#E8DCC6]/80 bg-neutral-100 shadow-sm">
                    <img 
                      src={activeArticle.image} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&q=80&w=1200'; }}
                    />
                  </div>

                  {/* Article content block */}
                  <div className="prose prose-stone leading-relaxed font-sans text-[#1E1A16]/90 text-sm md:text-[15px] space-y-6 pt-2">
                    {/* Render summary first as a beautifully styled italic intro */}
                    <p className="font-serif text-md md:text-lg italic text-[#1E1A16]/80 border-l-2 border-[#A67C52] pl-4 leading-relaxed bg-[#F7F2EB]/40 py-2">
                      {getArticleTrans(activeArticle).summary}
                    </p>

                    {/* Split content by double new lines and render nicely */}
                    {getArticleTrans(activeArticle).content.split('\n\n').map((pText: string, pIdx: number) => {
                      if (!pText) return null;
                      return (
                        <p key={pIdx} className="whitespace-pre-line leading-relaxed">
                          {pText}
                        </p>
                      );
                    })}

                    {/* Press review special styling if isPressArticle */}
                    {activeArticle.isPressArticle && (
                      <div className="bg-[#E8DCC6]/20 border border-[#E8DCC6]/60 p-6 my-8 rounded-sm font-serif italic text-center text-[#1E1A16]/90 relative max-w-xl mx-auto block space-y-2">
                        <span className="text-[28px] leading-none text-[#A67C52] block font-serif h-4">“</span>
                        <p className="text-sm md:text-base leading-relaxed px-4">
                          {language === 'EN' 
                            ? "« Merakya's ritual and confidential universe redefines the soft gold of the Moroccan Atlas through holistic creations loaded with benevolent intentions for the body and mind. A true sensory revelation. »" 
                            : "« L'univers rituel et confidentiel de Merakya redéfinit l'or doux de l'Atlas marocain à travers des créations holistiques chargées d'intentions bienveillantes pour le corps et l'esprit. Une révélation sensorielle authentique. »"}
                        </p>
                        <span className="text-[10px] tracking-widest font-bold uppercase text-[#A67C52] block pt-3">— {language === 'EN' ? `Review from ${activeArticle.publicationSource}` : `Revue ${activeArticle.publicationSource || 'Revues de presse'}`}</span>
                      </div>
                    )}
                  </div>
 
                   {/* Share Article Callout (At bottom of article content) */}
                  <div className="bg-[#FAF7F2] border border-[#E8DCC6]/60 p-6 rounded-xs text-center space-y-4 max-w-xl mx-auto my-8">
                    <span className="text-[9px] tracking-[0.2em] font-bold uppercase text-[#A67C52] block font-sans">
                      {language === 'EN' ? "✦ SHARE THE INSPIRATION ✦" : "✦ PARTAGER L'INSPIRATION ✦"}
                    </span>
                    <p className="text-xs text-[#1E1A16]/85 font-serif italic max-w-sm mx-auto">
                      {language === 'EN'
                        ? "If this chronicle has nurtured your spirit, convey its wisdom to kindred souls."
                        : "Si cette chronique a nourri votre esprit, transmettez sa sagesse aux âmes sœurs."}
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-3">
                      <button
                        onClick={() => {
                          const url = encodeURIComponent(window.location.href);
                          window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer,width=600,height=400');
                        }}
                        className="flex items-center gap-2 px-3.5 py-2 border border-[#E8DCC6] bg-white text-xs font-medium text-gray-700 hover:text-[#3b5998] hover:border-[#3b5998]/45 hover:shadow-sm rounded-sm transition-all cursor-pointer"
                      >
                        <Facebook className="h-3.5 w-3.5 text-[#3b5998]" />
                        <span>Facebook</span>
                      </button>

                      <button
                        onClick={() => {
                          const url = encodeURIComponent(window.location.href);
                          const text = encodeURIComponent(getArticleTrans(activeArticle).title);
                          window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer,width=600,height=400');
                        }}
                        className="flex items-center gap-2 px-3.5 py-2 border border-[#E8DCC6] bg-white text-xs font-medium text-gray-700 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/45 hover:shadow-sm rounded-sm transition-all cursor-pointer"
                      >
                        <Twitter className="h-3.5 w-3.5 text-[#1DA1F2]" />
                        <span>Twitter</span>
                      </button>

                      <button
                        onClick={() => {
                          const url = encodeURIComponent(window.location.href);
                          const media = encodeURIComponent(activeArticle.image || '');
                          const desc = encodeURIComponent(getArticleTrans(activeArticle).title);
                          window.open(`https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${desc}`, '_blank', 'noopener,noreferrer,width=600,height=400');
                        }}
                        className="flex items-center gap-2 px-3.5 py-2 border border-[#E8DCC6] bg-white text-xs font-medium text-gray-700 hover:text-[#bd081c] hover:border-[#bd081c]/45 hover:shadow-sm rounded-sm transition-all cursor-pointer"
                      >
                        <svg className="h-3.5 w-3.5 fill-current text-[#bd081c]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.24 0C5.7 0 0 4.7 0 11.1c0 4.2 2.6 7.8 6.4 9.2-.1-.8-.2-2-.1-2.9l1.2-5.1s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5 1 0 1.5.7 1.5 1.6 0 1-.6 2.4-.9 3.7-.3 1.2.6 2.1 1.8 2.1 2.2 0 3.8-2.2 3.8-5.5 0-2.9-2.1-4.9-5-4.9-3.4 0-5.4 2.6-5.4 5.2 0 1 .4 2.1.9 2.7.1.1.1.2.1.3-.1.4-.3 1.2-.3 1.4-.1.2-.2.3-.4.2-1.5-.7-2.4-2.8-2.4-4.5 0-3.7 2.7-7.1 7.8-7.1 4.1 0 7.3 2.9 7.3 6.8 0 4.1-2.6 7.4-6.2 7.4-1.2 0-2.4-.6-2.8-1.4l-.8 2.9c-.3 1.1-1.1 2.4-1.6 3.2 1.1.3 2.3.5 3.5.5 6.5 0 11.8-5.3 11.8-11.8C24 5.3 18.7 0 12.24 0z"/>
                        </svg>
                        <span>Pinterest</span>
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          setIsLinkCopied(true);
                          setTimeout(() => setIsLinkCopied(false), 2500);
                        }}
                        className={`flex items-center gap-2 px-3.5 py-2 border text-xs font-medium rounded-sm transition-all cursor-pointer ${
                          isLinkCopied 
                            ? 'bg-green-50 border-green-500 text-green-600' 
                            : 'border-[#E8DCC6] bg-white text-gray-700 hover:text-[#A67C52] hover:border-[#A67C52]/45 hover:shadow-sm'
                        }`}
                      >
                        {isLinkCopied ? <Check className="h-3.5 w-3.5" /> : <Link className="h-3.5 w-3.5" />}
                        <span>{isLinkCopied ? (language === 'EN' ? "Copied!" : "Lien Copié !") : (language === 'EN' ? "Copy Link" : "Copier le lien")}</span>
                      </button>
                    </div>
                  </div>

                  {/* Recommendation footer block */}
                  <div className="pt-12 border-t border-[#E8DCC6] flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="text-center sm:text-left space-y-1">
                      <h4 className="font-serif text-base text-[#1E1A16]">{language === 'EN' ? "Inspired by this read?" : "Inspiré par cette lecture ?"}</h4>
                      <p className="text-xs text-gray-500">{language === 'EN' ? "Discover our sacred rituals formulated with the same beneficial intentions." : "Découvrez nos rituels sacrés formulés avec les mêmes intentions bienfaitrices."}</p>
                    </div>
                    <div className="flex gap-3 font-sans">
                      <button 
                        onClick={() => {
                          setCurrentView('boutique');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-5 py-2.5 bg-[#1E1A16] text-[#F7F2EB] hover:bg-[#A67C52] text-xs font-semibold uppercase tracking-widest rounded-sm transition-colors"
                      >
                        {language === 'EN' ? "Discover the Shop" : "Découvrir la Boutique"}
                      </button>
                      <button 
                        onClick={() => {
                          setActiveArticle(null);
                          window.scrollTo({ top: 300, behavior: 'smooth' });
                        }}
                        className="px-5 py-2.5 border border-[#1E1A16] hover:bg-[#1E1A16] hover:text-white text-xs font-semibold uppercase tracking-widest rounded-sm transition-all"
                      >
                        {language === 'EN' ? "Back to Journal" : "Retour au Journal"}
                      </button>
                    </div>
                  </div>

                  {/* Related articles carousel */}
                  <div className="pt-12 mt-12 border-t border-[#E8DCC6]/60">
                    <h3 className="font-serif text-lg text-[#1E1A16] mb-6 text-center">{language === 'EN' ? "You might also like" : "Vous aimerez aussi"}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {articles
                        .filter(art => art.id !== activeArticle.id)
                        .slice(0, 2)
                        .map((art) => (
                          <div 
                            key={art.id} 
                            onClick={() => {
                              setActiveArticle(art);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="group cursor-pointer bg-white border border-[#E8DCC6]/60 p-4 rounded-sm hover:border-[#A67C52]/70 transition-all flex gap-3 items-center"
                          >
                            <img src={art.image} alt="" className="w-16 h-16 object-cover rounded-xs border border-gray-100 animate-fade-in" />
                            <div className="text-left space-y-1">
                              <span className="text-[8px] uppercase tracking-widest font-bold text-[#A67C52]">{getArticleTrans(art).category}</span>
                              <h4 className="font-serif text-[13px] font-semibold text-[#1E1A16] group-hover:text-[#A67C52] transition-colors line-clamp-2 leading-snug">{getArticleTrans(art).title}</h4>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                </div>
              ) : (
                /* ARTICLES FEED LIST OVERVIEW */
                <div className="space-y-10 animate-fade-in text-center">
                  
                  {/* Journal Header Banner - Centered and Unified */}
                  <div className="text-center space-y-3 pb-8 border-b border-[#E8DCC6] max-w-4xl mx-auto">
                    <span className="text-[10px] md:text-xs tracking-[0.3em] font-extrabold text-[#A67C52] uppercase block font-sans">
                      ✦ {language === 'EN' ? "SACRED CHRONICLES" : "CHRONIQUES DE L'ATELIER"} ✦
                    </span>
                    <h1 className="font-serif text-3.5xl md:text-5xl text-[#1E1A16] font-normal tracking-wide uppercase leading-tight select-none">
                      {t('journal_title')}
                    </h1>
                    <p className="text-xs md:text-sm text-[#A67C52] font-serif italic max-w-2xl mx-auto leading-relaxed">
                      {t('journal_subtitle')}
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-1">
                      <div className="w-12 h-[1px] bg-[#A67C52]/40" />
                      <span className="text-[#A67C52] text-[9px]">✦</span>
                      <div className="w-12 h-[1px] bg-[#A67C52]/40" />
                    </div>
                  </div>

                  {/* Tab categories selections */}
                  <div className="flex justify-center border-b border-[#E8DCC6] pb-3 mb-10 overflow-x-auto gap-6 shrink-0 scrollbar-none font-sans">
                    {[
                      { id: 'all', name: t('journal_all') },
                      { id: 'chroniques', name: t('journal_chroniques') },
                      { id: 'presse', name: t('journal_presse') }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setJournalTab(tab.id as any)}
                        className={`text-[10.5px] uppercase tracking-widest font-bold pb-2.5 border-b-2 transition-all shrink-0 ${
                          journalTab === tab.id
                            ? 'border-[#A67C52] text-[#A67C52]'
                            : 'border-transparent text-[#1E1A16]/55 hover:text-[#1E1A16]'
                        }`}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </div>

                  {/* Core Feed Grid */}
                  {(() => {
                    const filtered = articles.filter((art) => {
                      if (journalTab === 'all') return true;
                      if (journalTab === 'chroniques') return !art.isPressArticle;
                      if (journalTab === 'presse') return art.isPressArticle;
                      return true;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="py-16 text-center space-y-3 font-sans">
                          <p className="text-sm text-gray-500 font-serif italic">{language === 'EN' ? "No publications in this section at the moment." : "Aucune publication dans cette rubrique pour le moment."}</p>
                          <p className="text-xs text-[#A67C52] tracking-widest uppercase">{language === 'EN' ? "The writing of our secrets is in progress..." : "L'écriture de nos secrets est en cours..."}</p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-12">
                        {/* Latest article presented as a beautiful featured spot (only if viewing all/correct-tab) */}
                        {filtered.length > 0 && (
                          <div 
                            onClick={() => {
                              setActiveArticle(filtered[0]);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="bg-white border border-[#E8DCC6] p-6 md:p-8 rounded-sm hover:shadow-lg hover:border-[#A67C52]/50 transition-all cursor-pointer text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                          >
                            <div className="lg:col-span-7 h-64 md:h-80 w-full overflow-hidden rounded-xs border border-gray-100">
                              <img 
                                src={filtered[0].image} 
                                alt="" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&q=80&w=600'; }}
                              />
                            </div>
                            <div className="lg:col-span-5 space-y-4 font-sans">
                              <span className="inline-block text-[9px] font-bold tracking-widest uppercase text-[#A67C52]">
                                ✦ {getArticleTrans(filtered[0]).category}
                              </span>
                              <h2 className="font-serif text-2xl md:text-3xl text-[#1E1A16] leading-tight font-normal">
                                {getArticleTrans(filtered[0]).title}
                              </h2>
                              <p className="text-xs text-[#1E1A16]/80 leading-relaxed font-sans line-clamp-3">
                                {getArticleTrans(filtered[0]).summary}
                              </p>
                              <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                <span>{filtered[0].date}</span>
                                <span>•</span>
                                <span>{language === 'EN' ? `${filtered[0].readTime.split(' ')[0]} min read` : `${filtered[0].readTime} de lecture`}</span>
                              </div>
                              <span className="inline-block text-[10px] tracking-widest font-extrabold uppercase text-[#A67C52] border-b border-[#A67C52] pb-0.5 pt-2 hover:text-[#1E1A16] hover:border-[#1E1A16] transition-colors">
                                {language === 'EN' ? "Read full article ✦" : "Lire l'article complet ✦"}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Standard grid for other filtered articles */}
                        {filtered.length > 1 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                            {filtered.slice(1).map((art) => (
                              <div 
                                key={art.id}
                                onClick={() => {
                                  setActiveArticle(art);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="bg-white border border-[#E8DCC6] overflow-hidden rounded-xs shadow-xs hover:shadow-lg hover:border-[#A67C52]/50 transition-all cursor-pointer flex flex-col h-full font-sans"
                              >
                                <div className="h-48 w-full overflow-hidden bg-neutral-100 border-b border-[#E8DCC6]/60">
                                  <img 
                                    src={art.image} 
                                    alt="" 
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 animate-fade-in" 
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&q=80&w=600'; }}
                                  />
                                </div>
                                <div className="p-6 flex flex-col justify-between flex-grow space-y-3">
                                  <div className="space-y-2">
                                    <span className="text-[9px] tracking-widest text-[#A67C52] font-bold block uppercase">
                                      {getArticleTrans(art).category}
                                    </span>
                                    <h3 className="font-serif text-[16px] text-[#1E1A16] font-semibold leading-tight line-clamp-2">
                                      {getArticleTrans(art).title}
                                    </h3>
                                    <p className="text-xs text-[#1E1A16]/85 leading-relaxed font-sans line-clamp-3">
                                      {getArticleTrans(art).summary}
                                    </p>
                                  </div>
                                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-sans border-t border-[#E8DCC6]/40 pt-3">
                                    <span>{art.date}</span>
                                    <span className="font-mono text-[#A67C52]">{language === 'EN' ? `${art.readTime.split(' ')[0]} min read` : `${art.readTime} de lecture`}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* HISTOIRE / STORY VIEW */}
          {currentView === 'histoire' && (
            <div className="max-w-4xl mx-auto py-16 px-6 md:px-12 animate-fade-in space-y-12 text-left">
              <div className="text-center space-y-3 pb-8 border-b border-[#E8DCC6] max-w-4xl mx-auto">
                <span className="text-[10px] md:text-xs tracking-[0.3em] font-extrabold text-[#A67C52] uppercase block font-sans">
                  ✦ {language === 'EN' ? "OUR SACRED HISTORY" : "NOTRE HISTOIRE SACRÉE"} ✦
                </span>
                <h1 className="font-serif text-3.5xl md:text-5xl text-[#1E1A16] font-normal tracking-wide uppercase leading-tight select-none">
                  {t('story_title')}
                </h1>
                <p className="text-xs md:text-sm text-[#A67C52] font-serif italic max-w-2xl mx-auto leading-relaxed">
                  {t('story_subtitle')}
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <div className="w-12 h-[1px] bg-[#A67C52]/40" />
                  <span className="text-[#A67C52] text-[9px]">✦</span>
                  <div className="w-12 h-[1px] bg-[#A67C52]/40" />
                </div>
                <p className="font-serif italic text-base md:text-xl text-[#A67C52] pt-4 tracking-widest text-center select-none font-normal">
                  « {t('signature')} »
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="space-y-6 text-[13.5px] md:text-sm text-[#1E1A16]/85 leading-relaxed font-sans font-light">
                  <p className="first-letter:text-4xl first-letter:font-serif first-letter:text-[#A67C52] first-letter:font-semibold first-letter:mr-2 first-letter:float-left">
                    {t('story_p1')}
                  </p>
                  <p>
                    {t('story_p2')}
                  </p>
                  <p>
                    {t('story_p3')}
                  </p>
                </div>
                
                {/* Beautiful luxury visual of our actual candle, perfectly matching screenshot #5 */}
                <div className="relative rounded-sm overflow-hidden aspect-[4/5] shadow-xl border border-[#E8DCC6] bg-stone-50">
                  <img 
                    src={imgAbondance} 
                    alt="Bougie d'abondance Merakya dans son écrin" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A16]/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <span className="text-[9px] tracking-[0.25em] font-extrabold text-[#E8DCC6] uppercase">{language === 'EN' ? "SACRED ABUNDANCE CANDLE" : "BOUGIE SACRÉE ABONDANCE"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 text-[13.5px] md:text-sm text-[#1E1A16]/85 leading-relaxed font-sans font-light border-t border-[#E8DCC6]/45 pt-10">
                <p>
                  {t('story_p4')}
                </p>
                <p>
                  {t('story_p5')}
                </p>
                <p className="font-serif italic text-base md:text-lg text-[#A67C52] text-center pt-4 tracking-wide">
                  « {t('story_p6')} »
                </p>
                <p className="text-right pt-4 font-serif italic text-sm text-[#A67C52] tracking-wider font-semibold">
                  {language === 'EN' ? "KENZA & JEAN-BAPTISTE" : "KENZA et JEAN-BAPTISTE"}
                </p>
              </div>
            </div>
          )}

          {/* CONTACT VIEW */}
          {currentView === 'contact' && (
            <div className="max-w-3xl mx-auto py-16 px-4 md:px-12 animate-fade-in space-y-12 text-left">
              <div className="text-center space-y-3 pb-8 border-b border-[#E8DCC6] max-w-4xl mx-auto">
                <span className="text-[10px] md:text-xs tracking-[0.3em] font-extrabold text-[#A67C52] uppercase block font-sans">
                  ✦ {language === 'EN' ? "COMMUNION" : "COMMUNION"} ✦
                </span>
                <h1 className="font-serif text-3.5xl md:text-5xl text-[#1E1A16] font-normal tracking-wide uppercase leading-tight select-none">
                  {t('contact_title')}
                </h1>
                <p className="text-xs md:text-sm text-[#A67C52] font-serif italic max-w-2xl mx-auto leading-relaxed">
                  {t('contact_subtitle')}
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <div className="w-12 h-[1px] bg-[#A67C52]/40" />
                  <span className="text-[#A67C52] text-[9px]">✦</span>
                  <div className="w-12 h-[1px] bg-[#A67C52]/40" />
                </div>
              </div>

              {contactSuccess ? (
                <div className="bg-[#E8DCC6]/40 p-8 text-center rounded-sm space-y-3 space-y-4 max-w-md mx-auto border border-[#A67C52]/30 animate-fade-in">
                  <CheckCircle className="h-12 w-12 text-green-700 mx-auto" />
                  <h3 className="font-serif text-xl text-[#1E1A16]">{language === 'EN' ? "Message Transmitted with Grace" : "Message Transmis avec Grâce"}</h3>
                  <p className="text-xs text-[#1E1A16]/75 leading-relaxed">
                    {t('contact_success_msg')}
                  </p>
                  <button 
                    onClick={() => setContactSuccess(false)}
                    className="text-xs font-bold text-[#A67C52] underline uppercase tracking-widest block mx-auto mt-4"
                  >
                    {language === 'EN' ? "Send another request" : "Envoyer une autre demande"}
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSuccess(true);
                  }}
                  className="space-y-6 bg-white border border-[#E8DCC6] p-6 md:p-8 rounded-sm shadow-xs"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-[#1E1A16] mb-1">
                        {t('contact_name')}
                      </label>
                      <input 
                        type="text" 
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder={language === 'EN' ? "e.g. Sarah Alami" : "Ex : Sarah Alami"}
                        className="w-full bg-[#F7F2EB]/50 border border-[#E8DCC6] p-3 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52] rounded-sm" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-[#1E1A16] mb-1">
                        {t('contact_email_field')}
                      </label>
                      <input 
                        type="email" 
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-[#F7F2EB]/50 border border-[#E8DCC6] p-3 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52] rounded-sm" 
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[#1E1A16] mb-1">
                      {t('contact_msg')}
                    </label>
                    <textarea 
                      rows={5}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder={language === 'EN' ? "How can we illuminate your path?" : "Comment pouvons-nous éclairer votre chemin ?"}
                      className="w-full bg-[#F7F2EB]/50 border border-[#E8DCC6] p-3 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52] rounded-sm" 
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#1E1A16] hover:bg-[#A67C52] text-[#F7F2EB] py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all rounded-sm shadow-sm"
                  >
                    {t('contact_send')}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* NEWSLETTER FORM COMPONENT AS IN SCREENSHOT #3 */}
          <section className="bg-[#E8DCC6]/40 border-t border-b border-[#E8DCC6] py-16 px-4 md:px-12 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <span className="text-[10px] tracking-widest font-extrabold text-[#A67C52] uppercase block font-sans">{t('news_kicker')}</span>
              <h2 className="font-serif text-2xl md:text-3xl text-[#1E1A16] font-normal tracking-wide">
                {t('news_title')}
              </h2>
              <p className="text-xs text-[#1E1A16]/75 max-w-md mx-auto leading-relaxed">
                {t('news_desc')}
              </p>

              {newsletterSuccess ? (
                <div className="text-green-800 text-xs font-bold pt-2">
                  {t('news_success')}
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if(newsletterEmail) {
                      setNewsletterSuccess(true);
                      setNewsletterEmail('');
                    }
                  }}
                  className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2 font-sans"
                >
                  <input 
                    type="email" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={t('news_placeholder')} 
                    className="flex-1 bg-white border border-[#E8DCC6] px-4 py-3 text-xs focus:outline-none focus:border-[#A67C52] rounded-sm text-[#1E1A16]"
                    required
                  />
                  <button 
                    type="submit"
                    className="bg-[#1E1A16] text-[#F7F2EB] hover:bg-[#A67C52] px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors rounded-sm"
                  >
                    {t('news_btn')}
                  </button>
                </form>
              )}
            </div>
          </section>

        </main>
      )}

      {/* CORE LUXURY FOOTER PRESENTATION IN DEEP DARK CHARCOAL */}
      <footer className="bg-[#1E1A16] text-[#F7F2EB] pt-16 pb-8 px-4 md:px-12 border-t border-[#A67C52]/30">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Five quick check indicators - Beautifully Translated */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 border-b border-[#A67C52]/20 pb-12 text-center md:text-left">
            {[
              { 
                icon: MapPin, 
                text: language === 'EN' ? "FAST COURIER" : "LIVRAISON RAPIDE", 
                sub: language === 'EN' ? "Across Morocco & World" : "Partout au Maroc" 
              },
              { 
                icon: CreditCard, 
                text: language === 'EN' ? "SECURE PAYMENT" : "PAIEMENT SÉCURISÉ", 
                sub: language === 'EN' ? "100% Safe / Cash on Delivery" : "100% sécurisé / Cash" 
              },
              { 
                icon: Box, 
                text: language === 'EN' ? "ECO-FRIENDLY PACKS" : "EMBALLAGES ÉCOLOGIQUES", 
                sub: language === 'EN' ? "Respectful of Mother Nature" : "Respectueux de la nature" 
              },
              { 
                icon: Gift, 
                text: language === 'EN' ? "FREE SAMPLES" : "ÉCHANTILLONS OFFERTS", 
                sub: language === 'EN' ? "With every celestial order" : "À chaque commande" 
              },
              { 
                icon: Headphones, 
                text: language === 'EN' ? "EXQUISITE SUPPORT" : "SERVICE CLIENT DÉDIÉ", 
                sub: language === 'EN' ? "Our Atelier at your listen" : "Atelier à votre écoute" 
              }
            ].map((ind, iidx) => {
              const Icon = ind.icon;
              return (
                <div key={iidx} className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start">
                  <Icon className="h-6 w-6 text-[#A67C52] stroke-[1.5] shrink-0" />
                  <div>
                    <span className="block text-[10px] font-bold tracking-widest uppercase text-[#F7F2EB]">{ind.text}</span>
                    <span className="block text-[9px] text-[#E8DCC6]/60 mt-0.5 font-sans">{ind.sub}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Links structure */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <SpiritualLogo size={32} className="text-[#A67C52]" />
                <div className="flex flex-col">
                  <span className="font-serif text-lg tracking-[0.18em] text-[#E8DCC6]">MERAKYA</span>
                  <span className="text-[7.5px] tracking-[0.2em] uppercase text-[#A67C52] font-semibold">{t('subtext')}</span>
                </div>
              </div>
              <p className="text-xs text-[#E8DCC6]/70 leading-relaxed max-w-xs font-light">
                {t('footer_motto')}
              </p>
              <div className="flex space-x-4 pt-2">
                <a href="https://www.instagram.com/merakya_alchemy/" target="_blank" rel="noopener noreferrer" className="text-[#A67C52] hover:text-[#F7F2EB] transition-colors"><Instagram className="h-4.5 w-4.5" /></a>
                <a href="https://www.facebook.com/merakya/" target="_blank" rel="noopener noreferrer" className="text-[#A67C52] hover:text-[#F7F2EB] transition-colors"><Facebook className="h-4.5 w-4.5" /></a>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#A67C52]">{language === 'EN' ? "NAVIGATION" : "NAVIGATION"}</h4>
              <ul className="space-y-2 text-xs text-[#E8DCC6]/75">
                <li><button onClick={() => { setIsAdminActive(false); setCurrentView('accueil'); }} className="hover:text-white hover:underline transition-all text-left block">{language === 'EN' ? "Home" : "Accueil"}</button></li>
                <li><button onClick={() => { setIsAdminActive(false); setCurrentView('boutique'); }} className="hover:text-white hover:underline transition-all text-left block">{t('nav_shop')}</button></li>
                <li><button onClick={() => { setIsAdminActive(false); setCurrentView('rituels'); }} className="hover:text-white hover:underline transition-all text-left block">{t('nav_rituels')}</button></li>
                <li><button onClick={() => { setIsAdminActive(false); setCurrentView('journal'); }} className="hover:text-white hover:underline transition-all text-left block">{t('nav_journal')}</button></li>
                <li><button onClick={() => { setIsAdminActive(false); setCurrentView('histoire'); }} className="hover:text-white hover:underline transition-all text-left block">{t('nav_story')}</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#A67C52]">{language === 'EN' ? "CUSTOMER SERVICE" : "ASSISTANCE CLIENTS"}</h4>
              <ul className="space-y-2 text-xs text-[#E8DCC6]/75 text-left">
                <li><button onClick={() => { setActiveInquirySection('livraison'); }} className="hover:text-white hover:underline text-left block transition-all">{language === 'EN' ? "Shipping & Rates (Morocco & World)" : "Livraison et Tarifs (Maroc & International)"}</button></li>
                <li><button onClick={() => { setActiveInquirySection('paiement'); }} className="hover:text-white hover:underline text-left block transition-all">{language === 'EN' ? "Secure Payment & Ordering" : "Paiement et Livraison"}</button></li>
                <li><button onClick={() => { setActiveInquirySection('retours'); }} className="hover:text-white hover:underline text-left block transition-all">{language === 'EN' ? "14-Day Returns & Exchanges" : "Retours & Échanges sous 14 jours"}</button></li>
                <li><button onClick={() => { setActiveInquirySection('conditions'); }} className="hover:text-white hover:underline text-left block transition-all">{language === 'EN' ? "General Terms of Sale" : "Conditions Générales de Vente"}</button></li>
                <li><button onClick={() => { setActiveInquirySection('confidentialite'); }} className="hover:text-white hover:underline text-left block transition-all">{language === 'EN' ? "Privacy Policy" : "Politique de Confidentialité"}</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#A67C52]">{language === 'EN' ? "FOLLOW US" : "SUIVEZ-NOUS"}</h4>
              <p className="text-xs text-[#E8DCC6]/60 leading-relaxed">
                {language === 'EN' 
                  ? "Join us on Instagram to follow our natural soy candle-drawing and traditional botanical rituals in real-time."
                  : "Rejoignez-nous sur Instagram pour suivre la fonte de nos cires de soja naturelle et nos rituels en temps réel."}
              </p>
              <button 
                onClick={() => { setIsAuthModalOpen(true); }}
                className="mt-3 block text-center w-full bg-[#A67C52] hover:bg-[#F7F2EB] hover:text-[#1E1A16] transition-colors text-white text-[10px] font-bold uppercase py-2 tracking-widest text-[#F7F2EB] rounded-sm"
              >
                {language === 'EN' ? "SHOP ADMIN ACCESS" : "ACCÈS ADMIN BOUTIQUE"}
              </button>
            </div>
          </div>

          <div className="text-center text-[10px] text-[#E8DCC6]/40 pt-12 border-t border-[#A67C52]/10 flex flex-col sm:flex-row justify-between gap-4">
            <p>© {new Date().getFullYear()} Merakya. {language === 'EN' ? "All rights reserved. Infused with intentions." : "Tous droits réservés. Infusé d'intentions."}</p>
            <div className="space-x-4">
              <button onClick={() => { setActiveInquirySection('confidentialite'); }} className="hover:text-white cursor-pointer hover:underline">{language === 'EN' ? "Privacy policy" : "Politique de confidentialité"}</button>
              <span>•</span>
              <button onClick={() => { setActiveInquirySection('conditions'); }} className="hover:text-white cursor-pointer hover:underline">{language === 'EN' ? "Terms of sale" : "Conditions de vente"}</button>
            </div>
          </div>

        </div>
      </footer>

      {/* CORE PRODUCT DETAILS POPUP MODAL */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        selectedCurrency={selectedCurrency}
        language={language}
      />

      {/* SHOPPING BAG DRAWER OVERLAY */}
      <ShoppingCartDrawer
         isOpen={isCartOpen}
         onClose={() => setIsCartOpen(false)}
         cart={cart}
         onUpdateQuantity={handleUpdateCartQuantity}
         onRemoveItem={handleRemoveCartItem}
         onSubmitOrder={handleCheckoutSubmit}
         selectedCurrency={selectedCurrency}
         language={language}
      />

      {/* AUTHENTICATION GATE & ACCOUNT MANAGEMENT MODAL */}
      <AuthGatewayModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAdminActivate={() => {
          setIsAdminActive(true);
        }}
        language={language}
      />

      {/* HELP AND INQUIRIES SECTIONS POPUP MODAL */}
      <HelpAndInquiriesModal
        isOpen={activeInquirySection !== null}
        onClose={() => setActiveInquirySection(null)}
        initialTab={activeInquirySection || 'livraison'}
        language={language}
      />

    </div>
  );
}
