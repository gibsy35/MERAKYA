import React, { useState } from 'react';
import { Product, Order, CartItem, Campaign, ClientAccount, CurrencyCode, formatPrice } from '../types';
import { 
  Plus, Edit3, Trash2, Package, ShoppingCart, 
  BarChart2, RefreshCw, Sparkles, Check, Info, FileText, Megaphone, Users,
  CreditCard, Key, AlertCircle, CheckCircle, Shield, ShoppingBag, Eye, Percent
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateProduct: (product: Product) => void;
  onResetCatalog: () => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  campaigns?: Campaign[];
  onUpdateCampaigns?: (campaigns: Campaign[]) => void;
  articles?: any[];
  onUpdateArticles?: (articles: any[]) => void;
  language?: string;
  selectedCurrency?: CurrencyCode;
}

// Preset matching the user's photos so they can easily re-add identical looking items
const PHOTO_PRESETS = [
  {
    name: "Bouquet Roses Roses (Savon)",
    url: "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Couleur Argile 3 Strates (Savon)",
    url: "https://images.unsplash.com/photo-1607006342411-9c315e717552?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Bougie Abondance Orange",
    url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Bougie Bleue Mauvais Œil",
    url: "https://images.unsplash.com/photo-1572726710708-2079fa5730ea?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Bougie Rose de Damas Pot Céramique",
    url: "https://images.unsplash.com/photo-1602872030219-cbf948a91478?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Huile Botanique & Elixirs",
    url: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Sels et Cristaux Sacrés",
    url: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=600"
  }
];

export default function AdminPanel({
  products,
  orders,
  onAddProduct,
  onDeleteProduct,
  onUpdateProduct,
  onResetCatalog,
  onUpdateOrderStatus,
  campaigns = [],
  onUpdateCampaigns = () => {},
  articles = [],
  onUpdateArticles = () => {},
  language = 'FR',
  selectedCurrency = 'MAD'
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'catalog' | 'orders' | 'stats' | 'campaigns' | 'clients' | 'articles' | 'stripe'>('create');
  
  // Catalog Search & Filters States
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('ALL');
  const [catalogStockFilter, setCatalogStockFilter] = useState<'ALL' | 'LOW' | 'OUT'>('ALL');

  // Quick adjust stock function
  const adjustStock = (product: Product, amount: number) => {
    const currentInv = product.inventory !== undefined ? product.inventory : (product.inStock === false ? 0 : 25);
    const nextInv = Math.max(0, currentInv + amount);
    const nextStatus = nextInv === 0 
      ? 'OUT_OF_STOCK' 
      : (product.status === 'OUT_OF_STOCK' ? 'IN_STOCK' : (product.status || 'IN_STOCK'));
    
    onUpdateProduct({
      ...product,
      inventory: nextInv,
      status: nextStatus,
      inStock: nextInv > 0 && nextStatus !== 'OUT_OF_STOCK'
    });
    displayNotification(`📦 Stock ajusté pour "${product.name}" (${nextInv} restants)`);
  };
  
  // Guard Credentials State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('merakya_admin_logged') === 'true';
  });
  const [authError, setAuthError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = adminEmail.trim().toLowerCase();
    const cleanPass = adminPassword.trim();

    if (cleanEmail === 'joys.kenza@gmail.com' && cleanPass === 'merakya2026') {
      localStorage.setItem('merakya_admin_logged', 'true');
      setIsAdminAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError(language === 'EN'
        ? 'Invalid administrator email address or password. Please try again.'
        : 'Mot de passe ou adresse email administrateur non valide. Veuillez réessayer.');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('merakya_admin_logged');
    setIsAdminAuthenticated(false);
    setAdminPassword('');
  };
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('150');
  const [category, setCategory] = useState('BOUGIES RITUELLES');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [imageUrl, setImageUrl] = useState(PHOTO_PRESETS[0].url);
  const [isGenerating, setIsGenerating] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Communication campaigns form state
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampContent, setNewCampContent] = useState('');
  const [newCampType, setNewCampType] = useState<'banner' | 'popup' | 'discount'>('banner');

  // Articles form states
  const [artTitle, setArtTitle] = useState('');
  const [artCategory, setArtCategory] = useState('HERBORISTERIE SACRÉE');
  const [artSource, setArtSource] = useState('');
  const [artSummary, setArtSummary] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artImage, setArtImage] = useState('https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&q=80&w=600');
  const [artReadTime, setArtReadTime] = useState('4 min');

  // AI Visual Generator States
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [visualPrompt, setVisualPrompt] = useState('');
  const [visualStyle, setVisualStyle] = useState('STUDIO_PREMIUM'); // 'STUDIO_PREMIUM', 'COSMIC', 'OASIS', 'MINIMALIST_ZEN', etc.
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  // Edit Price State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState('');

  // Extended eCommerce Product State Controls
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [inventoryForm, setInventoryForm] = useState('25');
  const [statusForm, setStatusForm] = useState<'IN_STOCK' | 'OUT_OF_STOCK' | 'PREORDER'>('IN_STOCK');
  const [comparePriceForm, setComparePriceForm] = useState('');
  const [isLimitedForm, setIsLimitedForm] = useState(false);

  // Inline confirmation states to bypass iframe window.confirm blocks
  const [isResetConfirming, setIsResetConfirming] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [deletingArticleId, setDeletingArticleId] = useState<string | null>(null);

  // Stripe Gateway Admin Dashboard States
  const [stripeConfig, setStripeConfig] = useState<{publicKey: string | null; hasStripeSetup: boolean}>({
    publicKey: null,
    hasStripeSetup: false
  });
  const [stripeLoading, setStripeLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [currencyTest, setCurrencyTest] = useState('MAD');

  // Trigger loading config status when admin flips to stripe tab
  React.useEffect(() => {
    if (activeTab === 'stripe') {
      setStripeLoading(true);
      fetch('/api/stripe-config')
        .then(res => res.json())
        .then(data => {
          setStripeConfig(data);
          setStripeLoading(false);
        })
        .catch(err => {
          console.error("Stripe config reading failed:", err);
          setStripeLoading(false);
        });
    }
  }, [activeTab]);

  const runStripeTest = async () => {
    try {
      setTestResult({ status: 'running', message: language === 'EN' ? 'Contacting Stripe gateway endpoint...' : 'Connexion à la passerelle de validation Stripe...' });
      
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 150,
          currency: currencyTest,
          email: 'test-admin@merakya.com',
          customerName: 'Merakya Admin Testing Core'
        })
      });

      const data = await response.json();
      if (response.ok && data.clientSecret) {
        setTestResult({
          status: 'success',
          message: language === 'EN'
            ? '✦ API certified functional! Stripe successfully authenticated client token and initialized payment intent.'
            : '✦ API certifiée fonctionnelle ! Stripe a authentifié le jeton client et initialisé le Payment Intent.',
          clientSecret: data.clientSecret,
          id: data.id
        });
      } else {
        setTestResult({
          status: 'error',
          message: data.message || data.error || (language === 'EN' ? 'Stripe service rejected connection. Verify your keys.' : 'La passerelle Stripe a refusé le jeton. Vérifiez vos clés.'),
          raw: data
        });
      }
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: `${language === 'EN' ? "Offline simulation active. Server couldn't contact Stripe" : "Simulation hors-ligne active. Erreur de communication"} : ${err.message}`
      });
    }
  };

  const displayNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Automated intelligent high-definition visual generator with custom mappings
  const handleVisualGenerate = async () => {
    const defaultName = editingProduct ? editingProduct.name : name;
    const defaultCategory = editingProduct ? editingProduct.category : category;
    const textQuery = (visualPrompt || defaultName || "sacré").trim();
    if (!textQuery) {
      displayNotification("⚠️ " + (language === 'EN' 
        ? "Please enter a visual prompt, name or product details to generate."
        : "Veuillez entrer une ambiance, un nom ou une description de produit."));
      return;
    }
    
    setIsGeneratingImage(true);
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: textQuery,
          style: visualStyle,
          category: defaultCategory
        })
      });

      const data = await response.json();

      if (response.ok && data.imageUrl) {
        if (editingProduct) {
          setEditingProduct({
            ...editingProduct,
            image: data.imageUrl
          });
        } else {
          setImageUrl(data.imageUrl);
        }
        setGeneratedImages(prev => Array.from(new Set([data.imageUrl, ...prev])));
        
        const styleNameMap: Record<string, { en: string; fr: string }> = {
          STUDIO_PREMIUM: { en: "Studio Premium", fr: "Studio Premium ✦" },
          COSMIC: { en: "Mystical Light", fr: "Inspiration Alchimique ✦" },
          OASIS: { en: "Desert Oasis", fr: "Oasis du Sud ✦" },
          MINIMALIST_ZEN: { en: "Minimalist Zen", fr: "Épuré & Zen (Wabi-Sabi) ✦" },
          VINTAGE_HERBALIST: { en: "Ancestral Apothecary", fr: "Apothicaire Ancestrale (Vintage) ✦" },
          ROYAL_HAMMAM: { en: "Royal Hammam", fr: "Bain Impérial & Hammam Royal ✦" },
          SACRED_LUNAR: { en: "Sacred Lunar", fr: "Nuit Céleste & Astrologie ✦" },
          ATLAS_SUNSET: { en: "Atlas Sunset", fr: "Crépuscule d'Ambre & Terre Rouge ✦" }
        };
        const currentLabel = styleNameMap[visualStyle] || { en: visualStyle, fr: visualStyle };
        
        if (data.isFallback) {
          displayNotification(`✨ ` + (language === 'EN'
            ? `Demonstration mode: beautifully mapped organic visual applied!`
            : `Mode démonstration : superbe visuel organique et inspiré appliqué !`));
        } else {
          displayNotification(`🎨 ` + (language === 'EN'
            ? `Alchemical visual crafted by Gemini in style "${currentLabel.en} ✦" !`
            : `Visuel sacré incarné via Gemini en style "${currentLabel.fr}" !`));
        }
      } else {
        throw new Error(data.error || "Génération échouée");
      }
    } catch (err: any) {
      console.warn("Real image generation failed, falling back to alchemical preset mapping:", err);
      
      // Fallback curated world-class cosmetic photography targets sorted by keywords so offline/demo mode still behaves beautifully!
      const fallbackQuery = textQuery.toLowerCase();
      let matchedUrl = "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800"; // Lit amber candle
      
      if (fallbackQuery.includes("sauge") || fallbackQuery.includes("sauve") || fallbackQuery.includes("clean") || fallbackQuery.includes("herbe") || fallbackQuery.includes("blanc") || fallbackQuery.includes("pure") || fallbackQuery.includes("sable")) {
        matchedUrl = "https://images.unsplash.com/photo-1602872030219-cbf948a91478?auto=format&fit=crop&q=80&w=800"; // Sage candle jar
      } else if (fallbackQuery.includes("rose") || fallbackQuery.includes("fleur") || fallbackQuery.includes("damas") || fallbackQuery.includes("parfum") || fallbackQuery.includes("love") || fallbackQuery.includes("amour")) {
        matchedUrl = "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&q=80&w=800"; // Rose bouquet soap
      } else if (fallbackQuery.includes("bain") || fallbackQuery.includes("sel") || fallbackQuery.includes("cristal") || fallbackQuery.includes("marine") || fallbackQuery.includes("mer") || fallbackQuery.includes("sel de bain")) {
        matchedUrl = "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800"; // Natural mineral salts
      } else if (fallbackQuery.includes("huile") || fallbackQuery.includes("elixir") || fallbackQuery.includes("extrait") || fallbackQuery.includes("botanique") || fallbackQuery.includes("visage") || fallbackQuery.includes(" serum") || fallbackQuery.includes("sérum") || fallbackQuery.includes("cheveux")) {
        matchedUrl = "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800"; // Pipette skin oil
      } else if (fallbackQuery.includes("savon") || fallbackQuery.includes("soin") || fallbackQuery.includes("argile") || fallbackQuery.includes("lavande") || fallbackQuery.includes("fleurie")) {
        matchedUrl = "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=800"; // Lavender natural bar
      } else if (fallbackQuery.includes("hannan") || fallbackQuery.includes("hammam") || fallbackQuery.includes("noir") || fallbackQuery.includes("eucalyptus") || fallbackQuery.includes("gommage")) {
        matchedUrl = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800"; // Eucalyptus leaf / dark design
      } else if (fallbackQuery.includes("orange") || fallbackQuery.includes("fleur d'oranger") || fallbackQuery.includes("agrume") || fallbackQuery.includes("citron") || fallbackQuery.includes("oranger")) {
        matchedUrl = "https://images.unsplash.com/photo-1611081496685-afe4a34b2230?auto=format&fit=crop&q=80&w=800"; // Orange visual
      } else if (fallbackQuery.includes("encens") || fallbackQuery.includes("oud") || fallbackQuery.includes("fumée") || fallbackQuery.includes("fumer") || fallbackQuery.includes("resine")) {
        matchedUrl = "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800"; // Burning incenses
      } else if (fallbackQuery.includes("jasmin") || fallbackQuery.includes("fleur blanche") || fallbackQuery.includes("lys")) {
        matchedUrl = "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=800"; // Jasmine cosmetics style
      } else if (fallbackQuery.includes("bleu") || fallbackQuery.includes("mauvais eye") || fallbackQuery.includes("oeil") || fallbackQuery.includes("nuit") || fallbackQuery.includes("celeste")) {
        matchedUrl = "https://images.unsplash.com/photo-1572726710708-2079fa5730ea?auto=format&fit=crop&q=80&w=800"; // Mystical blue
      } else if (fallbackQuery.includes("ambre") || fallbackQuery.includes("or") || fallbackQuery.includes("epice") || fallbackQuery.includes("maroc") || fallbackQuery.includes("atlas")) {
        matchedUrl = "https://images.unsplash.com/photo-1596435764243-61b1f0d409b8?auto=format&fit=crop&q=80&w=800"; // Golden amber / spices
      } else {
        if (defaultCategory.includes("BOUGIE")) {
          matchedUrl = "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800";
        } else if (defaultCategory.includes("SAVON") || defaultCategory.includes("SOIN")) {
          matchedUrl = "https://images.unsplash.com/photo-1607006342411-9c315e717552?auto=format&fit=crop&q=80&w=800";
        } else if (defaultCategory.includes("SEL") || defaultCategory.includes("BAIN")) {
          matchedUrl = "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800";
        } else if (defaultCategory.includes("HUILE") || defaultCategory.includes("ÉLIXIR") || defaultCategory.includes("ELIXIR") || defaultCategory.includes("CHEVEUX")) {
          matchedUrl = "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800";
        } else {
          matchedUrl = "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800";
        }
      }
      
      if (editingProduct) {
        setEditingProduct({
          ...editingProduct,
          image: matchedUrl
        });
      } else {
        setImageUrl(matchedUrl);
      }
      setGeneratedImages(prev => Array.from(new Set([matchedUrl, ...prev])));
      
      const isApiKeyError = err.message && (err.message.includes("GEMINI_API_KEY") || err.message.includes("missing") || err.message.includes("key"));
      if (isApiKeyError) {
        displayNotification("📡 " + (language === 'EN'
          ? "Configure GEMINI_API_KEY in Settings > Secrets. Loaded demo preset."
          : "Clé GEMINI_API_KEY manquante dans Settings > Secrets. Préréglage de démo chargé."));
      } else {
        displayNotification("⚡ " + (language === 'EN'
          ? "AI model error. Loaded demo preset."
          : "Erreur modèle IA. Préréglage de démonstration chargé."));
      }
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Simulated Alchemical AI Magic for instant pristine descriptions matching screenshot style
  const handleAIGenerate = async () => {
    if (!name && !promptInput) {
      displayNotification("⚠️ Veuillez spécifier un nom de produit ou quelques mots clés d'ingrédients.");
      return;
    }
    setIsGenerating(true);
    
    // Simulate premium AI generation delay
    setTimeout(() => {
      const pName = name || promptInput;
      const keyWords = promptInput ? ` aux notes de ${promptInput}` : '';
      
      const descriptionsPool = [
        `Une alchimie magique infusée d'amour et d'intentions ésotériques. Ce produit de soin "${pName}"${keyWords} purifie votre espace énergétique, éveille les sens de votre corps et enveloppe votre aura d'une douceur protectrice éternelle. Idéal comme rituel d'ancrage le soir au coucher.`,
        `Directement inspiré des secrets botaniques ancestraux de l'Atlas. "${pName}"${keyWords} unit la sagesse des plantes sacrées marocaine pour un soin d'une pureté majestueuse. Offrez à votre corps une expérience vibratoire exceptionnelle sous de douces effluves célestes.`,
        `Une création d'exception enveloppée de mystère céleste et de spiritualité pure. "${pName}"${keyWords} agit en profondeur de l'esprit à la peau. S'utilise dans un cadre de recueillement sacré ou lors d'un bain revitalisant pour relâcher les énergies stagnantes.`
      ];

      const ingredientsPool = [
        "Cire de soja biologique, huiles pressées à froid au Maroc, fragrances naturelles et micas scintillants, cristaux rechargés d'intention bienfaisante.",
        "Miel sauvage pur de l'Ourika de culture écoresponsable, distillat précieux de fleurs, argiles de Marrakech de première pression, vitamines de jeunesse saines.",
        "Sels d'Epsom de haute clarté, huiles essentielles pures séchées au soleil, extrait d'herbe divine sauvage et d'or de protection."
      ];

      const chosenDesc = descriptionsPool[Math.floor(Math.random() * descriptionsPool.length)];
      const chosenIng = ingredientsPool[Math.floor(Math.random() * ingredientsPool.length)];

      setDescription(chosenDesc);
      setIngredients(chosenIng);
      setIsGenerating(false);
      displayNotification("✨ Les descriptions inspirées de l'alchimie sacrée ont été générées !");
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      displayNotification("⚠️ Veuillez remplir le nom et le prix.");
      return;
    }

    const priceNum = parseFloat(price) || 120;
    const comparePriceNum = comparePriceForm ? parseFloat(comparePriceForm) : undefined;
    const inventoryVal = parseInt(inventoryForm) >= 0 ? parseInt(inventoryForm) : 25;

    onAddProduct({
      name,
      price: priceNum,
      category,
      description: description || `Merveilleux produit "${name}" pour élever vos rituels quotidiens d'amour et de bien-être.`,
      image: imageUrl,
      ingredients: ingredients || "Ingrédients 100% naturels extraits de petites récoltes locales.",
      isCustom: true,
      inventory: inventoryVal,
      status: statusForm,
      compareAtPrice: comparePriceNum,
      isLimitedEdition: isLimitedForm,
      inStock: statusForm !== 'OUT_OF_STOCK' && inventoryVal > 0
    });

    displayNotification(`🎉 Produit "${name}" ajouté avec succès au catalogue !`);
    
    // Reset Form
    setName('');
    setPrice('150');
    setDescription('');
    setIngredients('');
    setPromptInput('');
    setInventoryForm('25');
    setStatusForm('IN_STOCK');
    setComparePriceForm('');
    setIsLimitedForm(false);
  };

  const handlePriceSave = (product: Product) => {
    onUpdateProduct({
      ...product,
      price: parseFloat(editPriceValue) || product.price
    });
    setEditingId(null);
    displayNotification(`💸 Prix mis à jour pour "${product.name}" !`);
  };

  // Calculate stats
  const totalSales = orders
    .filter(o => o.status !== 'En attente')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalOrders = orders.length;

  if (!isAdminAuthenticated) {
    return (
      <div className="bg-[#1E1A16] min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-[#F7F2EB] p-8 rounded-sm border border-[#A67C52] shadow-2xl relative">
          <div className="absolute top-4 right-4 text-[10px] tracking-widest text-[#A67C52] font-semibold flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> {language === 'EN' ? "SECURE ACCESS" : "ACCÈS SÉCURISÉ"}
          </div>

          <div className="text-center">
            <h2 className="mt-4 text-center text-2xl md:text-3xl font-serif text-[#1E1A16]">
              {language === 'EN' ? "Sacred Administrator Portal" : "Portail Sacré Administrateur"}
            </h2>
            <p className="mt-2 text-center text-xs tracking-widest text-[#A67C52] uppercase">
              {language === 'EN' ? "Merakya • Sacred Rituals from Morocco" : "Merakya • Rituels Sacrés du Maroc"}
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#A67C52] mb-1">
                  {language === 'EN' ? "Admin Email Address *" : "Identifiant Email Admin *"}
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@merakya.com"
                  className="w-full bg-white border border-[#E8DCC6] p-3 text-xs text-[#1E1A16] placeholder-gray-400 focus:outline-none focus:border-[#A67C52]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#A67C52] mb-1">
                  {language === 'EN' ? "Secret Password *" : "Mot de Passe Secret *"}
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#E8DCC6] p-3 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                />
              </div>
            </div>

            {authError && (
              <div className="text-xs text-red-600 bg-red-50 p-3 border border-red-200 rounded-sm">
                {authError}
              </div>
            )}

            <button
               type="submit"
               className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-xs font-bold uppercase tracking-widest text-[#F7F2EB] bg-[#1E1A16] hover:bg-[#A67C52] transition-all rounded-sm focus:outline-none"
            >
              {language === 'EN' ? "Unlock the temple ✦" : "Déverrouiller le temple ✦"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-panel-main" className="bg-[#F7F2EB] py-8 px-4 md:px-12 max-w-7xl mx-auto min-h-screen animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#E8DCC6] pb-6 mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#1E1A16] tracking-wide">
            {language === 'EN' ? "Merakya Administration Space" : "Espace d'Administration Merakya"}
          </h1>
          <p className="text-xs text-[#A67C52] tracking-widest uppercase mt-2">
            {language === 'EN' ? "Catalog Management, Customer Orders & Digital Alchemy" : "Gestion du Catalogue, Commandes Clients & Alchimie Digitale"}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleAdminLogout}
            className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-all text-xs font-bold uppercase tracking-widest rounded-sm"
          >
            {language === 'EN' ? "Log Out" : "Déconnexion"}
          </button>
          
          {isResetConfirming ? (
            <div className="flex items-center gap-1.5 animate-pulse">
              <button 
                id="btn-retablir-catalogue-confirm"
                onClick={() => {
                  onResetCatalog();
                  setIsResetConfirming(false);
                  displayNotification(language === 'EN' ? "🔄 Initial catalog restored!" : "🔄 Catalogue initial rétabli !");
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 text-white hover:bg-amber-700 transition-all text-xs font-bold uppercase tracking-widest rounded-sm shadow-sm"
              >
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                {language === 'EN' ? "Confirm Reset ?" : "Confirmer Rétablir ?"}
              </button>
              <button 
                onClick={() => setIsResetConfirming(false)}
                className="px-2.5 py-2 border border-gray-300 text-gray-500 hover:bg-gray-50 text-xs font-medium uppercase tracking-widest rounded-sm"
              >
                {language === 'EN' ? "Cancel" : "Annuler"}
              </button>
            </div>
          ) : (
            <button 
              id="btn-retablir-catalogue"
              onClick={() => {
                setIsResetConfirming(true);
                // Auto reset status back to false after 5 seconds of inactivity
                setTimeout(() => setIsResetConfirming(false), 5000);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-[#A67C52] text-[#A67C52] hover:bg-[#A67C52] hover:text-[#F7F2EB] transition-all text-xs font-medium uppercase tracking-widest rounded-sm"
            >
              <RefreshCw className="h-4 w-4" />
              {language === 'EN' ? "Reset" : "Rétablir"}
            </button>
          )}
        </div>
      </div>

      {notification && (
        <div className="bg-[#1E1A16] text-[#F7F2EB] py-3 px-6 rounded-md mb-6 flex items-center gap-3 text-sm shadow-md border-l-4 border-[#CB8892]">
          <Sparkles className="h-5 w-5 text-[#E8DCC6]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin tabs */}
      <div className="flex border-b border-[#E8DCC6] mb-8 overflow-x-auto space-x-2 md:space-x-4 font-sans">
        {[
          { id: 'create', name: language === 'EN' ? 'Create a Product' : 'Créer un Produit', icon: Plus },
          { id: 'catalog', name: language === 'EN' ? 'Manage Catalog' : 'Gérer le Catalogue', icon: Package },
          { id: 'orders', name: language === 'EN' ? 'Track Orders' : 'Suivre les Commandes', icon: ShoppingCart },
          { id: 'campaigns', name: language === 'EN' ? 'Promo Campaigns ✦' : 'Campagnes Com ✦', icon: Megaphone },
          { id: 'articles', name: language === 'EN' ? 'Journal & Press' : 'Le Journal & Presse', icon: FileText },
          { id: 'clients', name: language === 'EN' ? 'Client Accounts ✦' : 'Comptes Clients ✦', icon: Users },
          { id: 'stripe', name: language === 'EN' ? 'Stripe Gateway' : 'Configuration Stripe', icon: CreditCard },
          { id: 'stats', name: language === 'EN' ? 'Stats & Sales' : 'Statistiques & Ventes', icon: BarChart2 }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 md:px-5 font-sans text-xs uppercase tracking-widest font-semibold border-b-2 transition-all shrink-0 ${
                activeTab === tab.id 
                  ? 'border-[#A67C52] text-[#A67C52]' 
                  : 'border-transparent text-[#1E1A16]/50 hover:text-[#1E1A16]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.name}
              {tab.id === 'orders' && orders.filter(o => o.status === 'En attente').length > 0 && (
                <span className="bg-[#CB8892] text-white text-[9px] px-1.5 py-0.5 rounded-full">
                  {orders.filter(o => o.status === 'En attente').length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Display dynamic sheets */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Create Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 bg-[#F7F2EB] border border-[#E8DCC6] p-6 md:p-8 rounded-sm space-y-6">
            <h2 className="font-serif text-xl md:text-2xl text-[#1E1A16] border-b border-[#E8DCC6] pb-3 mb-4">
              Nouvelle Création Sacrée
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-[11px] font-bold tracking-widest uppercase text-[#1E1A16] mb-2">
                  Nom du Produit *
                </label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Ex: Bougie 'Amour Eternel'"
                  className="w-full bg-white border border-[#E8DCC6] p-3 text-sm focus:outline-none focus:border-[#A67C52] text-[#1E1A16]" 
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-[#1E1A16] mb-2">
                  Prix de Vente (DH) *
                </label>
                <input 
                  type="number" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  placeholder="Ex: 180" 
                  min="0"
                  className="w-full bg-white border border-[#E8DCC6] p-3 text-sm focus:outline-none focus:border-[#A67C52] text-[#1E1A16]" 
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-[#1E1A16] mb-2">
                  Prix barré de Réf (Promo)
                </label>
                <input 
                  type="number" 
                  value={comparePriceForm} 
                  onChange={(e) => setComparePriceForm(e.target.value)} 
                  placeholder="Ex: 240 (sans promo, laisser vide)" 
                  min="0"
                  className="w-full bg-white border border-[#E8DCC6] p-3 text-sm focus:outline-none focus:border-[#A67C52] text-[#1E1A16]" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-[#1E1A16] mb-2">
                  Catégorie Boutique
                </label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-[#E8DCC6] p-3 text-sm focus:outline-none focus:border-[#A67C52] text-[#1E1A16]"
                >
                  <option value="BOUGIES RITUELLES">BOUGIES RITUELLES</option>
                  <option value="SAVONS & SOINS NATURELS">SAVONS & SOINS NATURELS</option>
                  <option value="SELS & BAINS ÉNERGÉTIQUES">SELS & BAINS ÉNERGÉTIQUES</option>
                  <option value="HUILES & ÉLIXIRS BOTANIQUES">HUILES & ÉLIXIRS BOTANIQUES</option>
                  <option value="COFFRETS RITUELS">COFFRETS RITUELS</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-[#1E1A16] mb-2">
                  Visuel du Produit (Sélection de Photos Phares)
                </label>
                <select 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-white border border-[#E8DCC6] p-3 text-sm focus:outline-none focus:border-[#A67C52] text-[#1E1A16]"
                >
                  {PHOTO_PRESETS.map((preset, index) => (
                    <option key={index} value={preset.url}>{preset.name}</option>
                  ))}
                  <option value="https://images.unsplash.com/photo-1596435764243-61b1f0d409b8?auto=format&fit=crop&q=80&w=600">Autre Flacon Envoûtant</option>
                  {/* Generated Images dynamically kept in dropdown */}
                  {generatedImages.map((genUrl, index) => (
                    <option key={`gen-opt-${index}`} value={genUrl}>
                      🔮 Visuel IA Généré #{generatedImages.length - index}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Extended e-Commerce Options Core */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-[#F7F2EB] border border-[#E8DCC6]/60 rounded-xs">
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-[#A67C52] mb-2">
                  Stock initial (Inventaire) *
                </label>
                <input 
                  type="number" 
                  value={inventoryForm} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setInventoryForm(val);
                    if (parseInt(val) === 0) {
                      setStatusForm('OUT_OF_STOCK');
                    } else if (statusForm === 'OUT_OF_STOCK' && parseInt(val) > 0) {
                      setStatusForm('IN_STOCK');
                    }
                  }} 
                  min="0"
                  className="w-full bg-white border border-[#E8DCC6] p-2.5 text-xs text-[#1E1A16] font-mono focus:outline-none focus:border-[#A67C52]" 
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-[#A67C52] mb-2">
                  Statut de Disponibilité *
                </label>
                <select 
                  value={statusForm} 
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setStatusForm(val);
                    if (val === 'OUT_OF_STOCK') {
                      setInventoryForm('0');
                    } else if (inventoryForm === '0') {
                      setInventoryForm('25');
                    }
                  }}
                  className="w-full bg-white border border-[#E8DCC6] p-2.5 text-xs text-[#1E1A16] font-bold focus:outline-none focus:border-[#A67C52]"
                >
                  <option value="IN_STOCK">En stock (Actif)</option>
                  <option value="OUT_OF_STOCK">Rupture de stock</option>
                  <option value="PREORDER">Précommande</option>
                </select>
              </div>

              <div className="flex flex-col justify-center">
                <span className="block text-[11px] font-bold tracking-widest uppercase text-[#A67C52] mb-2">Options Produit</span>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#1E1A16] cursor-pointer mt-1">
                  <input 
                    type="checkbox" 
                    checked={isLimitedForm} 
                    onChange={(e) => setIsLimitedForm(e.target.checked)}
                    className="h-4 w-4 accent-[#A67C52] cursor-pointer rounded-xs"
                  />
                  <span>Édition / Récolte Limitée ⭐</span>
                </label>
              </div>
            </div>

            {/* AI Generator Integration */}
            <div className="bg-[#E8DCC6]/30 p-4 border border-[#E8DCC6] rounded-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold font-sans tracking-widest uppercase text-[#A67C52]">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Générateur Poétique IA
                </span>
                <span className="text-[10px] text-[#1E1A16]/60 bg-[#E8DCC6] px-2 py-0.5 rounded-full font-medium">Gemini Alchimie</span>
              </div>
              <p className="text-xs text-[#1E1A16]/70 leading-relaxed">
                Rédigez quelques mots-clés d'ingrédients (Ex : sauge, menthe, miel de l'Atlas) et l'intelligence de Merakya forgera une fiche spirituelle et une formule d'ingrédients complète.
              </p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={promptInput} 
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Miel de sapin, ambre noir, rose sauvage..." 
                  className="flex-1 bg-white border border-[#E8DCC6] px-3 py-2 text-xs focus:outline-none text-[#1E1A16]"
                />
                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-[#A67C52] text-white hover:bg-[#6B4E2E] transition-all text-xs uppercase font-bold tracking-wider rounded-sm shrink-0 flex items-center gap-1"
                >
                  {isGenerating ? "Inspiration en cours..." : "Générer Fiche"}
                </button>
              </div>
            </div>

            {/* AI Image Generator Integration */}
            <div className="bg-[#1E1A16] text-[#F7F2EB] p-4 border border-[#A67C52]/30 rounded-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold font-sans tracking-widest uppercase text-[#A67C52]">
                  <Sparkles className="h-4 w-4 text-[#A67C52] animate-pulse" />
                  Générateur de Visuels IA (Produits)
                </span>
                <span className="text-[9px] text-[#1E1A16] bg-[#A67C52] px-2 py-0.5 rounded-full font-bold">Imagerie Sacrée v2</span>
              </div>
              <p className="text-[11px] text-[#F7F2EB]/80 leading-relaxed">
                Saisissez l'ambiance désirée (Ex: "Fleur d'oranger sur grès chaud") pour incarner un visuel haute fidélité pour votre produit à l'aide de l'IA Merakya.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] uppercase tracking-widest font-bold text-[#A67C52] mb-1">Ambiance visuelle</label>
                  <input 
                    type="text" 
                    value={visualPrompt}
                    onChange={(e) => setVisualPrompt(e.target.value)}
                    placeholder="Ex: eucalyptus, argile, bougie allumée..."
                    className="w-full bg-[#27231E] text-white text-xs border border-[#A67C52]/20 p-2 focus:outline-none focus:border-[#A67C52]"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-widest font-bold text-[#A67C52] mb-1">Style de Rendu</label>
                  <select
                    value={visualStyle}
                    onChange={(e) => setVisualStyle(e.target.value)}
                    className="w-full bg-[#27231E] text-white text-xs border border-[#A67C52]/20 p-2 focus:outline-none focus:border-[#A67C52]"
                  >
                    <option value="STUDIO_PREMIUM">Studio Premium (Aesthetic) ✦</option>
                    <option value="COSMIC">Lumière Cosmique & Mystique (Alchimie) ✦</option>
                    <option value="OASIS">Dunes de Sable & Oasis du Sud ✦</option>
                    <option value="MINIMALIST_ZEN">Épuré & Zen (Wabi-Sabi) ✦</option>
                    <option value="VINTAGE_HERBALIST">Apothicaire Ancestrale (Vintage) ✦</option>
                    <option value="ROYAL_HAMMAM">Bain Impérial & Hammam Royal ✦</option>
                    <option value="SACRED_LUNAR">Nuit Céleste & Astrologie Sacrée ✦</option>
                    <option value="ATLAS_SUNSET">Crépuscule d'Ambre & Terre Rouge ✦</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleVisualGenerate}
                disabled={isGeneratingImage}
                className="w-full py-2.5 bg-[#A67C52] hover:bg-[#A67C52]/80 disabled:bg-gray-700 text-white font-bold text-xs uppercase tracking-widest transition-all rounded-xs flex items-center justify-center gap-2"
              >
                {isGeneratingImage ? (
                  <>
                    <span className="animate-ping h-2 w-2 rounded-full bg-white"></span>
                    <span>Incarnation du visuel sous la lune...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3" />
                    <span>Invoquer le Visuel IA</span>
                  </>
                )}
              </button>

              {/* History Gallery of generated images for this session */}
              {generatedImages.length > 0 && (
                <div className="p-3.5 bg-[#171411] rounded-xs border border-[#A67C52]/20 space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#A67C52] flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
                      Historique des Essais IA ({generatedImages.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setGeneratedImages([]);
                        setImageUrl(PHOTO_PRESETS[0].url);
                      }}
                      className="text-[9px] text-[#E8DCC6]/60 hover:text-white underline font-mono cursor-pointer"
                    >
                      Effacer les essais
                    </button>
                  </div>
                  <p className="text-[10px] text-[#F7F2EB]/70 leading-relaxed font-sans mt-0.5">
                    Cliquez sur un visuel de l'historique ci-dessous pour le restaurer instantanément sur votre fiche produit active :
                  </p>
                  
                  <div className="flex gap-2.5 overflow-x-auto pb-1.5 pt-1 scrollbar-thin scrollbar-thumb-[#A67C52]/40">
                    {generatedImages.map((imgUrl, i) => {
                      const isActive = imageUrl === imgUrl;
                      return (
                        <div
                          key={i}
                          onClick={() => setImageUrl(imgUrl)}
                          className={`relative w-23 h-16 flex-shrink-0 cursor-pointer rounded-xs overflow-hidden border transition-all ${
                            isActive 
                              ? 'border-[#A67C52] scale-105 ring-1 ring-[#A67C52]' 
                              : 'border-white/10 hover:border-[#A67C52]/60 filter grayscale-[20%] hover:grayscale-0'
                          }`}
                          title={`Essai IA #${generatedImages.length - i}`}
                        >
                          <img 
                            src={imgUrl} 
                            alt={`Photo IA ${i}`} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                          {isActive && (
                            <div className="absolute inset-0 bg-black/25 flex items-center justify-center backdrop-blur-[0.5px]">
                              <span className="bg-[#A67C52] text-white rounded-full h-4 w-4 flex items-center justify-center text-[9px] font-bold font-sans">✓</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-[#1E1A16] mb-2">
                  Description Poétique & Esprit du Rituel
                </label>
                <textarea 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez l'alchimie du produit, son effet sur l'âme, et comment l'incorporer dans un moment sacré de vie..."
                  className="w-full bg-white border border-[#E8DCC6] p-3 text-sm focus:outline-none focus:border-[#A67C52] text-[#1E1A16]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest uppercase text-[#1E1A16] mb-2">
                  Ingrédients & Alchimie Ancestrale (Facultatif)
                </label>
                <textarea 
                  rows={2}
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="Cire de soja bio, argile verte pure de l'Ourika, huiles d'olive pressées à froid..."
                  className="w-full bg-white border border-[#E8DCC6] p-3 text-sm focus:outline-none focus:border-[#A67C52] text-[#1E1A16]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1E1A16] text-[#F7F2EB] py-4 hover:bg-[#A67C52] transition-colors text-xs uppercase font-bold tracking-[0.2em] rounded-sm"
            >
              Ajouter au Catalogue Boutique
            </button>
          </form>

          {/* Visual card preview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#F7F2EB] border border-[#E8DCC6] p-5 rounded-sm sticky top-28">
              <span className="text-[10px] tracking-widest font-extrabold uppercase text-[#A67C52] block mb-4">
                ✦ Aperçu Fiche Boutique ✦
              </span>
              
              <div className="group overflow-hidden bg-white border border-[#E8DCC6] p-3 rounded-xs shadow-sm">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 mb-4 rounded-xs">
                  <img 
                    src={imageUrl || "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600"} 
                    alt="Aperçu du produit"
                    className="h-full w-full object-cover transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-[#F7F2EB]/90 uppercase text-[9px] font-bold tracking-widest px-2.5 py-1 text-[#1E1A16]">
                    {category}
                  </div>
                </div>

                <div className="text-center px-2 py-3">
                  <h3 className="font-serif text-lg text-[#1E1A16] tracking-wide mb-1 font-medium">
                    {name || "Nom de votre création"}
                  </h3>
                  <p className="text-sm font-semibold text-[#A67C52] tracking-wider mb-2">
                    {price || "0"} DH
                  </p>
                  <p className="text-xs text-[#1E1A16]/75 line-clamp-2 px-1 mb-4 italic leading-relaxed">
                    {description || "Aucune description écrite."}
                  </p>
                  <div className="w-full border-t border-[#E8DCC6] pt-3">
                    <span className="text-[9px] uppercase tracking-widest text-[#1E1A16]/50 block">Récolte Limitée</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-[#E8DCC6]/40 border border-[#A67C52]/20 rounded-xs flex items-start gap-2.5">
                <Info className="h-4 w-4 text-[#A67C52] mt-0.5 shrink-0" />
                <p className="text-[11px] text-[#6B4E2E] leading-relaxed">
                  <strong>Gestion des stocks :</strong> Tout produit créé via ce formulaire est instantanément disponible à l'achat pour vos clients sur la page "Boutique du Site".
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'catalog' && (() => {
        const filteredProducts = products.filter(product => {
          const matchesSearch = product.name.toLowerCase().includes(catalogSearch.toLowerCase()) || 
                                product.category.toLowerCase().includes(catalogSearch.toLowerCase());
          
          const matchesCategory = catalogCategoryFilter === 'ALL' || product.category === catalogCategoryFilter;
          
          const prodInv = product.inventory !== undefined ? product.inventory : (product.inStock === false ? 0 : 25);
          const prodStatus = product.status || (product.inStock === false ? 'OUT_OF_STOCK' : 'IN_STOCK');
          
          let matchesStock = true;
          if (catalogStockFilter === 'LOW') {
            matchesStock = prodInv > 0 && prodInv <= 5;
          } else if (catalogStockFilter === 'OUT') {
            matchesStock = prodInv === 0 || prodStatus === 'OUT_OF_STOCK';
          }
          
          return matchesSearch && matchesCategory && matchesStock;
        });

        return (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-[#F7F2EB] border border-[#E8DCC6] p-4 rounded-sm grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 relative">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A67C52] mb-1">
                  Rechercher un produit
                </label>
                <input 
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Ex: eucalyptus, rose, bougie..."
                  className="w-full bg-white border border-[#E8DCC6] px-3 py-2 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A67C52] mb-1">
                  Par Catégorie
                </label>
                <select 
                  value={catalogCategoryFilter}
                  onChange={(e) => setCatalogCategoryFilter(e.target.value)}
                  className="w-full bg-white border border-[#E8DCC6] px-2 py-2 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                >
                  <option value="ALL">Toutes les catégories</option>
                  <option value="BOUGIES RITUELLES">BOUGIES RITUELLES</option>
                  <option value="SAVONS & SOINS NATURELS">SAVONS & SOINS NATURELS</option>
                  <option value="SELS & BAINS ÉNERGÉTIQUES">SELS & BAINS ÉNERGÉTIQUES</option>
                  <option value="HUILES & ÉLIXIRS BOTANIQUES">HUILES & ÉLIXIRS BOTANIQUES</option>
                  <option value="COFFRETS RITUELS">COFFRETS RITUELS</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A67C52] mb-1">
                  Niveau de Stock
                </label>
                <select 
                  value={catalogStockFilter}
                  onChange={(e) => setCatalogStockFilter(e.target.value as any)}
                  className="w-full bg-white border border-[#E8DCC6] px-2 py-2 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                >
                  <option value="ALL">Tous les niveaux</option>
                  <option value="LOW">⚠️ Alarme Stock Bas (≤ 5)</option>
                  <option value="OUT">🛑 Ruptures de Stock</option>
                </select>
              </div>
            </div>

            {/* Catalog list container */}
            <div className="bg-white border border-[#E8DCC6] rounded-sm overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[#E8DCC6] flex flex-col sm:flex-row justify-between items-center bg-[#F7F2EB] gap-2">
                <h2 className="font-serif text-lg text-[#1E1A16] font-medium">
                  Catalogue Produits Direct ({filteredProducts.length} sur {products.length})
                </h2>
                <div className="flex items-center gap-2 bg-[#1E1A16] text-[#F7F2EB] px-3 py-1 rounded-sm text-xs tracking-wider">
                  <span className="font-sans text-[10px] opacity-75">DEV-CONVERTER ACTIVE :</span>
                  <strong className="font-bold text-[#E8DCC6]">{selectedCurrency}</strong>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table id="admin-catalog-table" className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1E1A16] text-[#F7F2EB] text-[10px] tracking-widest uppercase border-b border-[#E8DCC6]">
                      <th className="py-4 px-5 text-left">Visuel</th>
                      <th className="py-4 px-5">Nom & Catégorie</th>
                      <th className="py-4 px-5 text-center">Statut (État)</th>
                      <th className="py-4 px-5 text-center">Quantité Stock</th>
                      <th className="py-4 px-5 text-right">Prix (Actif)</th>
                      <th className="py-4 px-5 text-center">Opérations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DCC6]">
                    {filteredProducts.map((product) => {
                      const prodInv = product.inventory !== undefined ? product.inventory : (product.inStock === false ? 0 : 25);
                      const prodStatus = product.status || (product.inStock === false ? 'OUT_OF_STOCK' : 'IN_STOCK');
                      const isLowStock = prodInv > 0 && prodInv <= 5;
                      const isOutOfStock = prodInv === 0 || prodStatus === 'OUT_OF_STOCK';

                      return (
                        <tr key={product.id} className="hover:bg-[#F7F2EB]/40 transition-colors">
                          <td className="py-3 px-5">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-12 h-12 rounded-sm object-cover border border-[#E8DCC6]/60"
                              referrerPolicy="no-referrer"
                            />
                          </td>
                          <td className="py-3 px-5">
                            <div className="font-semibold text-sm text-[#1E1A16] font-serif flex items-center gap-1.5">
                              {product.name}
                              {product.isLimitedEdition && (
                                <span className="bg-[#A67C52] text-[#F7F2EB] text-[7px] font-bold px-1.5 py-0.5 tracking-wider uppercase rounded-xs">
                                  LIMITÉE ⭐
                                </span>
                              )}
                            </div>
                            <div className="text-[9px] text-[#A67C52] tracking-wider uppercase mt-1">{product.category}</div>
                          </td>
                          <td className="py-3 px-5 text-center">
                            {prodStatus === 'OUT_OF_STOCK' ? (
                              <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider">
                                RUPTURE DE STOCK
                              </span>
                            ) : prodStatus === 'PREORDER' ? (
                              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider">
                                PRÉCOMMANDE ✦
                              </span>
                            ) : (
                              <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider">
                                EN STOCK
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-5">
                            <div className="flex items-center justify-center gap-2">
                              {/* Dec Stock Button */}
                              <button
                                onClick={() => adjustStock(product, -1)}
                                className="w-5 h-5 bg-white border border-[#E8DCC6] text-[#1E1A16] flex items-center justify-center text-xs font-bold hover:bg-[#E8DCC6]/30 rounded-xs transition-colors"
                                title="Enlever 1 du stock"
                              >
                                -
                              </button>
                              
                              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-sm ${
                                isOutOfStock 
                                  ? 'bg-red-100 text-red-800' 
                                  : isLowStock 
                                    ? 'bg-amber-100 text-amber-800 animate-pulse' 
                                    : 'bg-[#E8DCC6]/30 text-[#1E1A16]'
                              }`}>
                                {prodInv}
                              </span>

                              {/* Inc Stock Button */}
                              <button
                                onClick={() => adjustStock(product, 1)}
                                className="w-5 h-5 bg-white border border-[#E8DCC6] text-[#1E1A16] flex items-center justify-center text-xs font-bold hover:bg-[#E8DCC6]/30 rounded-xs transition-colors"
                                title="Ajouter 1 au stock"
                              >
                                +
                              </button>

                              <button
                                onClick={() => adjustStock(product, 10)}
                                className="text-[9px] text-[#A67C52] hover:text-[#1E1A16] font-bold tracking-tighter uppercase px-1 rounded-xs hover:bg-[#E8DCC6]/35 transition-colors ml-1"
                                title="Ajouter +10"
                              >
                                +10
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-5 text-right">
                            <div className="space-y-0.5">
                              {/* Display active currency conversion */}
                              <div className="text-xs font-bold text-[#1E1A16]">
                                {formatPrice(product.price, selectedCurrency)}
                              </div>
                              
                              {/* Price in raw DH for administrative record check */}
                              <div className="text-[9px] text-[#1E1A16]/50">
                                ({product.price} DH)
                              </div>

                              {product.compareAtPrice && product.compareAtPrice > product.price && (
                                <div className="text-[10px] text-gray-400 line-through">
                                  {formatPrice(product.compareAtPrice, selectedCurrency)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-5 text-center">
                            <div className="flex items-center justify-center gap-2.5">
                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  setOriginalImageUrl(product.image || '');
                                }}
                                className="p-1 px-2.5 bg-[#A67C52]/10 text-[#A67C52] hover:bg-[#A67C52] hover:text-[#F7F2EB] text-[10px] font-bold tracking-wider rounded-xs uppercase transition-all flex items-center gap-1"
                                title="Modification avancée de la fiche"
                              >
                                <Edit3 className="h-3 w-3" />
                                Modifier
                              </button>

                              {deletingProductId === product.id ? (
                                <div className="flex items-center justify-center gap-1 animate-fadeIn">
                                  <button
                                    id={`btn-delete-prod-ok-${product.id}`}
                                    onClick={() => {
                                      onDeleteProduct(product.id);
                                      setDeletingProductId(null);
                                      displayNotification(language === 'EN' ? "🗑️ Product permanently deleted." : "🗑️ Produit supprimé définitivement.");
                                    }}
                                    className="p-1 text-[#CB8892] hover:text-[#bf616e] font-extrabold text-[10px] uppercase transition-colors"
                                    title={language === 'EN' ? "Confirm deletion" : "Confirmer la suppression"}
                                  >
                                    [OUI]
                                  </button>
                                  <button
                                    onClick={() => setDeletingProductId(null)}
                                    className="p-1 text-gray-500 hover:text-gray-800 text-[10px] transition-colors"
                                  >
                                    [NON]
                                  </button>
                                </div>
                              ) : (
                                <button
                                  id={`btn-delete-prod-${product.id}`}
                                  onClick={() => setDeletingProductId(product.id)}
                                  className="p-1 text-red-600 hover:text-red-800 rounded transition-colors"
                                  title={language === 'EN' ? "Delete product" : "Détruire la fiche"}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Editing Product Lightbox Modal Dialog */}
            {editingProduct && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
                <div className="relative bg-[#F7F2EB] border-2 border-[#E8DCC6] outline outline-[#1E1A16]/5 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-xs flex flex-col p-6 animate-fade-in text-[#1E1A16]">
                  {/* Close button */}
                  <button 
                    onClick={() => setEditingProduct(null)}
                    className="absolute top-4 right-4 text-[#1E1A16]/55 hover:text-[#1E1A16] font-bold text-lg"
                  >
                    ✕
                  </button>

                  <h3 className="font-serif text-xl border-b border-[#E8DCC6] pb-3 mb-5 text-[#1E1A16] font-medium uppercase tracking-wide">
                    Alchimie de la Fiche : {editingProduct.name}
                  </h3>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      onUpdateProduct({
                        ...editingProduct,
                        inStock: editingProduct.status !== 'OUT_OF_STOCK' && (editingProduct.inventory === undefined || editingProduct.inventory > 0)
                      });
                      setEditingProduct(null);
                      displayNotification(`✨ "${editingProduct.name}" a été mis à jour avec toutes les spécifications e-commerce.`);
                    }} 
                    className="space-y-4 text-xs font-sans"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#A67C52] mb-1">Nom du Produit</label>
                        <input 
                          type="text" 
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                          className="w-full bg-white border border-[#E8DCC6] p-2.5 focus:outline-none focus:border-[#A67C52] text-[#1E1A16] font-medium"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#A67C52] mb-1">Catégorie</label>
                        <select 
                          value={editingProduct.category}
                          onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                          className="w-full bg-white border border-[#E8DCC6] p-2.5 focus:outline-none focus:border-[#A67C52] text-[#1E1A16]"
                        >
                          <option value="BOUGIES RITUELLES">BOUGIES RITUELLES</option>
                          <option value="SAVONS & SOINS NATURELS">SAVONS & SOINS NATURELS</option>
                          <option value="SELS & BAINS ÉNERGÉTIQUES">SELS & BAINS ÉNERGÉTIQUES</option>
                          <option value="HUILES & ÉLIXIRS BOTANIQUES">HUILES & ÉLIXIRS BOTANIQUES</option>
                          <option value="COFFRETS RITUELS">COFFRETS RITUELS</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#A67C52] mb-1">Prix de Vente (DH)</label>
                        <input 
                          type="number" 
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                          className="w-full bg-white border border-[#E8DCC6] p-2.5 focus:outline-none focus:border-[#A67C52] text-[#1E1A16] font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#A67C52] mb-1">Prix d'Origine (DH) [CompareAt]</label>
                        <input 
                          type="number" 
                          value={editingProduct.compareAtPrice || ''}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct, 
                            compareAtPrice: e.target.value ? parseFloat(e.target.value) : undefined
                          })}
                          className="w-full bg-white border border-[#E8DCC6] p-2.5 focus:outline-none focus:border-[#A67C52] text-[#1E1A16] font-mono"
                          placeholder="Ex: 250 (laisser vide si pas barré)"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#A67C52] mb-1">Réseau Image URL</label>
                        <input 
                          type="text" 
                          value={editingProduct.image}
                          onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                          className="w-full bg-white border border-[#E8DCC6] p-2.5 focus:outline-none focus:border-[#A67C52] text-[#1E1A16]"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-white/45 border border-[#E8DCC6]/60 rounded-xs">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#A67C52] mb-1">Stock Quantité (Inventaire)</label>
                        <input 
                          type="number" 
                          value={editingProduct.inventory !== undefined ? editingProduct.inventory : (editingProduct.inStock === false ? 0 : 25)}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setEditingProduct({
                              ...editingProduct, 
                              inventory: val,
                              status: val === 0 ? 'OUT_OF_STOCK' : (editingProduct.status === 'OUT_OF_STOCK' ? 'IN_STOCK' : (editingProduct.status || 'IN_STOCK'))
                            });
                          }}
                          className="w-full bg-white border border-[#E8DCC6] p-2.5 focus:outline-none focus:border-[#A67C52] text-[#1E1A16] font-mono"
                          min="0"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#A67C52] mb-1">Statut d'approvisionnement</label>
                        <select 
                          value={editingProduct.status || (editingProduct.inStock === false ? 'OUT_OF_STOCK' : 'IN_STOCK')}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            const inv = editingProduct.inventory !== undefined ? editingProduct.inventory : 25;
                            setEditingProduct({
                              ...editingProduct, 
                              status: val,
                              inventory: val === 'OUT_OF_STOCK' ? 0 : (inv === 0 ? 25 : inv)
                            });
                          }}
                          className="w-full bg-white border border-[#E8DCC6] p-2.5 focus:outline-none focus:border-[#A67C52] text-[11px] text-[#1E1A16] font-semibold"
                        >
                          <option value="IN_STOCK">En stock (Actif)</option>
                          <option value="OUT_OF_STOCK">Rupture de Stock</option>
                          <option value="PREORDER">Précommande</option>
                        </select>
                      </div>

                      <div className="flex flex-col justify-center">
                        <span className="block text-[10px] uppercase font-bold text-[#A67C52] mb-1">Édition Spécifique</span>
                        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer mt-1 text-[#1E1A16]">
                          <input 
                            type="checkbox" 
                            checked={!!editingProduct.isLimitedEdition}
                            onChange={(e) => setEditingProduct({...editingProduct, isLimitedEdition: e.target.checked})}
                            className="h-4 w-4 accent-[#A67C52] cursor-pointer"
                          />
                          <span>Édition / Récolte Limitée ⭐</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#A67C52] mb-1">Description Poétique & Rituelle</label>
                      <textarea 
                        rows={3} 
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                        className="w-full bg-white border border-[#E8DCC6] p-2.5 focus:outline-none focus:border-[#A67C52] text-[#1E1A16]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#A67C52] mb-1">Ingrédients & Synergie Botanique</label>
                      <input 
                        type="text" 
                        value={editingProduct.ingredients || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, ingredients: e.target.value})}
                        className="w-full bg-white border border-[#E8DCC6] p-2.5 focus:outline-none focus:border-[#A67C52] text-[#1E1A16]"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[#E8DCC6] mt-4">
                      <button 
                        type="button" 
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 border border-[#E8DCC6] hover:bg-white text-gray-500 font-bold uppercase tracking-widest text-[10px] rounded-xs"
                      >
                        {language === 'EN' ? "Cancel" : "Annuler"}
                      </button>
                      <button 
                        type="submit" 
                        className="px-6 py-2 bg-[#1E1A16] hover:bg-[#A67C52] text-white font-bold uppercase tracking-widest text-[10px] rounded-xs transition-colors"
                      >
                        {language === 'EN' ? "Save modifications" : "Enregistrer les modifications"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E8DCC6] p-5 rounded-sm flex items-center justify-between shadow-sm">
            <div>
              <h2 className="font-serif text-xl text-[#1E1A16] font-semibold">Toutes les commandes en ligne</h2>
              <p className="text-xs text-[#1E1A16]/60 mt-1">Simulées en temps réel par les actions d'achat du site.</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#A67C52] tracking-widest block uppercase">Revenus Confirmés</span>
              <span className="text-xl font-serif font-extrabold text-[#1E1A16]">{formatPrice(totalSales, selectedCurrency)}</span>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="bg-[#E8DCC6]/20 border border-[#E8DCC6] p-12 text-center rounded-sm space-y-3">
              <ShoppingCart className="h-10 w-10 text-[#A67C52] mx-auto opacity-55" />
              <h3 className="font-serif text-lg text-[#1E1A16] font-medium">Aucune commande enregistrée</h3>
              <p className="text-xs text-[#1E1A16]/70 max-w-md mx-auto">
                Ajoutez des produits au panier, renseignez vos détails et validez votre panier ! Les commandes s'afficheront instantanément dans cet onglet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-[#E8DCC6] p-5 rounded-sm shadow-xs space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#E8DCC6] pb-3 gap-2">
                    <div>
                      <span className="font-mono text-xs text-[#A67C52] font-semibold tracking-wider">Commandé le {order.date}</span>
                      <h4 className="text-sm font-semibold text-[#1E1A16] uppercase mt-1">ID: {order.id}</h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#A67C52]">Statut :</span>
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border focus:outline-none ${
                          order.status === 'En attente' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                          order.status === 'Confirmé' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                          order.status === 'Expédié' ? 'bg-[#A67C52]/20 text-[#6B4E2E] border-[#A67C52]' :
                          'bg-green-50 text-green-700 border-green-300'
                        }`}
                      >
                        <option value="En attente">En attente</option>
                        <option value="Confirmé">Confirmé</option>
                        <option value="Expédié">Expédié</option>
                        <option value="Livré">Livré</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
                    <div>
                      <h5 className="font-bold text-[#A67C52] tracking-widest uppercase mb-2">Informations de Livraison</h5>
                      <div className="space-y-1 text-[#1E1A16]/80 bg-[#F7F2EB] p-3 rounded-xs leading-relaxed">
                        <p><strong>Destinataire:</strong> {order.customerName}</p>
                        <p><strong>Email:</strong> {order.customerEmail}</p>
                        <p><strong>Tél:</strong> {order.customerPhone}</p>
                        <p><strong>Adresse Maroc:</strong> {order.customerAddress}</p>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <h5 className="font-bold text-[#A67C52] tracking-widest uppercase mb-2">Pochette d'achat ({order.items.length} créations)</h5>
                      <div className="border border-[#E8DCC6] rounded-xs divide-y divide-[#E8DCC6]">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2.5 hover:bg-[#F7F2EB]/40">
                            <div className="flex items-center gap-3">
                              <img 
                                src={item.product.image} 
                                alt={item.product.name} 
                                className="w-8 h-8 rounded-xs object-cover"
                              />
                              <div>
                                <span className="font-medium text-[#1E1A16] block">{item.product.name}</span>
                                <span className="text-[10px] text-[#A67C52]">{item.product.category}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[#1E1A16] font-semibold">{item.product.price} DH </span>
                              <span className="text-[#1E1A16]/60">x {item.quantity}</span>
                            </div>
                          </div>
                        ))}
                        <div className="p-3 bg-[#F7F2EB] flex justify-between font-bold text-sm text-[#1E1A16]">
                          <span>TOTAL DE LA COMMANDE</span>
                          <span className="text-[#E11F40] text-[#1E1A16]">{order.totalAmount} DH</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-8 animate-fade-in">
          {/* Key Indicators Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E8DCC6] p-6 rounded-sm shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#A67C52]">Total des Chiffres</span>
                <h4 className="font-serif text-3xl font-extrabold text-[#1E1A16] mt-2">{formatPrice(totalSales, selectedCurrency)}</h4>
                <p className="text-[10px] text-green-700 mt-1">✦ Commandes validées et en cours</p>
              </div>
              <BarChart2 className="h-10 w-10 text-[#CB8892]/40" />
            </div>

            <div className="bg-white border border-[#E8DCC6] p-6 rounded-sm shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#A67C52]">Nombre de Commandes</span>
                <h4 className="font-serif text-3xl font-extrabold text-[#1E1A16] mt-2">{totalOrders}</h4>
                <p className="text-[10px] text-[#1E1A16]/60 mt-1">Suivi moyen du taux de conversion</p>
              </div>
              <ShoppingCart className="h-10 w-10 text-[#A67C52]/40" />
            </div>

            <div className="bg-white border border-[#E8DCC6] p-6 rounded-sm shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#A67C52]">Catalogue Actif</span>
                <h4 className="font-serif text-3xl font-extrabold text-[#1E1A16] mt-2">{products.length} rituels</h4>
                <p className="text-[10px] text-[#1E1A16]/60 mt-1">Cosmétiques et artisanat coulés</p>
              </div>
              <Package className="h-10 w-10 text-[#6B4E2E]/40" />
            </div>
          </div>

          {/* Quick analysis section */}
          <div className="bg-white border border-[#E8DCC6] p-6 rounded-sm shadow-xs">
            <h3 className="font-serif text-lg text-[#1E1A16] font-medium border-b border-[#E8DCC6] pb-3 mb-4">
              Répartition des ventes par catégorie
            </h3>
            <div className="space-y-4">
              {[
                { name: 'BOUGIES RITUELLES', icon: '🕯️' },
                { name: 'SAVONS & SOINS NATURELS', icon: '🧼' },
                { name: 'SELS & BAINS ÉNERGÉTIQUES', icon: '🧴' },
                { name: 'HUILES & ÉLIXIRS BOTANIQUES', icon: '💧' },
                { name: 'COFFRETS RITUELS', icon: '🎁' }
              ].map((cat, i) => {
                const count = products.filter(p => p.category === cat.name).length;
                const percentage = products.length > 0 ? (count / products.length) * 100 : 0;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#1E1A16]">{cat.icon} {cat.name}</span>
                      <span className="text-[#A67C52]">{count} références ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="w-full bg-[#F7F2EB] h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#A67C52] h-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E8DCC6] p-6 rounded-sm">
            <h2 className="font-serif text-xl font-bold text-[#1E1A16] border-b border-[#E8DCC6] pb-3">Créer une Campagne de Communication</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              if(!newCampTitle || !newCampContent) return;
              const newCamp: Campaign = {
                id: 'camp-' + Date.now(),
                title: newCampTitle,
                content: newCampContent,
                type: newCampType,
                isActive: true
              };
              onUpdateCampaigns([...campaigns, newCamp]);
              setNewCampTitle('');
              setNewCampContent('');
              displayNotification("✨ Nouvelle campagne activée divine !");
            }} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#A67C52] mb-1">Titre de la Campagne</label>
                  <input 
                    type="text" 
                    value={newCampTitle} 
                    onChange={e => setNewCampTitle(e.target.value)} 
                    placeholder="Ex: Solde d'Été Céleste" 
                    className="w-full bg-white border border-[#E8DCC6] p-2.5 text-xs focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#A67C52] mb-1">Type de Message</label>
                  <select 
                    value={newCampType} 
                    onChange={e => setNewCampType(e.target.value as any)} 
                    className="w-full bg-white border border-[#E8DCC6] p-2.5 text-xs focus:outline-none"
                  >
                    <option value="banner">Défilant en haut (Top Bar)</option>
                    <option value="discount">Bannière de promotion (Offres)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[#A67C52] mb-1">Texte / Contenu de l'Offre</label>
                <textarea 
                  value={newCampContent} 
                  onChange={e => setNewCampContent(e.target.value)} 
                  placeholder="Ex: ✦ PROFITEZ DE 15% DE RÉDUCTION EN ENTRANT LE CODE: SACRE15 ✦" 
                  className="w-full bg-white border border-[#E8DCC6] p-2.5 text-xs focus:outline-none h-20"
                />
              </div>
              <button type="submit" className="bg-[#1E1A16] text-[#F7F2EB] hover:bg-[#A67C52] py-2 px-6 text-xs uppercase font-bold tracking-widest rounded-sm transition-colors">
                Lancer la Campagne ✦
              </button>
            </form>
          </div>

          <div className="bg-white border border-[#E8DCC6] p-6 rounded-sm">
            <h3 className="font-serif text-lg font-bold text-[#1E1A16] mb-4">Campagnes de Communication Actives</h3>
            <div className="space-y-4">
              {campaigns.length === 0 ? (
                <p className="text-xs text-gray-500">Aucune campagne spéciale active. Créez-en une ci-dessus !</p>
              ) : (
                campaigns.map((camp) => (
                  <div key={camp.id} className="border border-[#E8DCC6] p-4 flex items-center justify-between rounded-xs">
                    <div>
                      <span className="text-[10px] tracking-widest uppercase font-bold text-[#A67C52]">{camp.type}</span>
                      <h4 className="font-semibold text-sm text-[#1E1A16]">{camp.title}</h4>
                      <p className="text-xs text-[#1E1A16]/85 font-serif mt-1 italic">"{camp.content}"</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          const updated = campaigns.map(c => c.id === camp.id ? { ...c, isActive: !c.isActive } : c);
                          onUpdateCampaigns(updated);
                          displayNotification("✨ État de la campagne mis à jour !");
                        }}
                        className={`text-[10px] uppercase tracking-widest px-3 py-1 font-bold ${camp.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {camp.isActive ? 'Active' : 'Désactivée'}
                      </button>
                      <button 
                        onClick={() => {
                          onUpdateCampaigns(campaigns.filter(c => c.id !== camp.id));
                          displayNotification("🗑️ Campagne supprimée.");
                        }}
                        className="text-red-600 p-1.5 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'clients' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E8DCC6] p-6 rounded-sm">
            <h2 className="font-serif text-xl font-bold text-[#1E1A16] border-b border-[#E8DCC6] pb-3 mb-4">Fichier Clients Spirituels</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-[#1E1A16]">
                <thead>
                  <tr className="bg-[#F7F2EB] text-[#A67C52] tracking-widest uppercase text-[10px] border-b border-[#E8DCC6]">
                    <th className="p-3">Client</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Téléphone</th>
                    <th className="p-3">Ville</th>
                    <th className="p-3">Enregistré le</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCC6]">
                  {(() => {
                    const stored = localStorage.getItem('merakya_clients');
                    const list: any[] = stored ? JSON.parse(stored) : [
                      { id: 1, fullName: "Yasmine Alami", email: "yasmine@alami.ma", phone: "+212 661-234567", city: "Casablanca", registeredAt: "19/05/2026" },
                      { id: 2, fullName: "Anas Benjeloun", email: "anas.bj@gmail.com", phone: "+212 663-889900", city: "Marrakech", registeredAt: "18/05/2026" }
                    ];
                    return list.map((client) => (
                      <tr key={client.id} className="hover:bg-[#F7F2EB]/30">
                        <td className="p-3 font-semibold">{client.fullName}</td>
                        <td className="p-3 font-mono">{client.email}</td>
                        <td className="p-3">{client.phone}</td>
                        <td className="p-3">{client.city}</td>
                        <td className="p-3 text-gray-500">{client.registeredAt}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'articles' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col - Add New Article Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!artTitle || !artContent) {
                  displayNotification("⚠️ Veuillez remplir le titre et le contenu de l'article.");
                  return;
                }
                const isPress = artCategory === 'REVUES DE PRESSE';
                const newArticle = {
                  id: `art-${Date.now()}`,
                  title: artTitle,
                  category: artCategory,
                  summary: artSummary || artContent.substring(0, 150) + "...",
                  content: artContent,
                  image: artImage || 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&q=80&w=600',
                  date: new Date().toISOString().split('T')[0],
                  author: isPress ? (artSource || "Vogue Arabie") : "L'Atelier Merakya",
                  readTime: artReadTime,
                  isPressArticle: isPress,
                  publicationSource: isPress ? (artSource || "Presse") : undefined
                };
                onUpdateArticles([newArticle, ...articles]);
                displayNotification("📝 Nouvel article de presse/chronique publié avec succès !");
                setArtTitle('');
                setArtSummary('');
                setArtContent('');
                setArtSource('');
              }}
              className="lg:col-span-7 bg-[#F7F2EB] border border-[#E8DCC6] p-6 rounded-sm space-y-5 shadow-xs"
            >
              <h2 className="font-serif text-xl text-[#1E1A16] border-b border-[#E8DCC6] pb-3">
                Publier une Chronique ou Article de Presse
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#A67C52] mb-1">Titre de l'Article / Presse *</label>
                  <input
                    type="text"
                    required
                    value={artTitle}
                    onChange={(e) => setArtTitle(e.target.value)}
                    placeholder="Ex: Merakya dans Vogue Magazine..."
                    className="w-full bg-white border border-[#E8DCC6] p-3 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#A67C52] mb-1">Catégorie</label>
                    <select
                      value={artCategory}
                      onChange={(e) => setArtCategory(e.target.value)}
                      className="w-full bg-white border border-[#E8DCC6] p-3 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                    >
                      <option value="HERBORISTERIE SACRÉE">HERBORISTERIE SACRÉE</option>
                      <option value="CALENDRIER LUNAIRE">CALENDRIER LUNAIRE</option>
                      <option value="RITUELS EXCEPTIONNELS">RITUELS EXCEPTIONNELS</option>
                      <option value="REVUES DE PRESSE">REVUES DE PRESSE (Presse)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#A67C52] mb-1">Durée de Lecture / Source</label>
                    <input
                      type="text"
                      value={artReadTime}
                      onChange={(e) => setArtReadTime(e.target.value)}
                      placeholder="Ex: 4 min ou Vogue Arabie"
                      className="w-full bg-white border border-[#E8DCC6] p-3 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                    />
                  </div>
                </div>

                {artCategory === 'REVUES DE PRESSE' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#A67C52] mb-1">Source de Publication Presse *</label>
                    <input
                      type="text"
                      required
                      value={artSource}
                      onChange={(e) => setArtSource(e.target.value)}
                      placeholder="Ex: Vogue Arabie, Harper's Bazaar, Marie Claire"
                      className="w-full bg-white border border-[#E8DCC6] p-3 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#A67C52] mb-1">Image de Couverture (URL)</label>
                  <select
                    value={artImage}
                    onChange={(e) => setArtImage(e.target.value)}
                    className="w-full bg-white border border-[#E8DCC6] p-3 text-xs text-[#1E1A16] mb-2 focus:outline-none focus:border-[#A67C52]"
                  >
                    <option value="https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&q=80&w=600">Preset : Roses de Damas</option>
                    <option value="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600">Preset : Bougie d'abondance</option>
                    <option value="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=600">Preset : Sels de Bain Minéraux</option>
                    <option value="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600">Preset : Huile de Nuit d'Étoile</option>
                    <option value="https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=600">Preset : Céramiques artisanales</option>
                  </select>
                  <input
                    type="text"
                    value={artImage}
                    onChange={(e) => setArtImage(e.target.value)}
                    placeholder="Ou collez une adresse d'image personnalisée"
                    className="w-full bg-white border border-[#E8DCC6] p-3 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#A67C52] mb-1">Résumé court *</label>
                  <textarea
                    rows={2}
                    value={artSummary}
                    onChange={(e) => setArtSummary(e.target.value)}
                    placeholder="Une courte phrase d'introduction accrocheuse..."
                    className="w-full bg-white border border-[#E8DCC6] p-3 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#A67C52] mb-1">Contenu de la Chronique / Arcticle (supporte paragraphes) *</label>
                  <textarea
                    rows={8}
                    required
                    value={artContent}
                    onChange={(e) => setArtContent(e.target.value)}
                    placeholder="Rédigez ici votre magnifique sagesse ésotérique ou citation de presse..."
                    className="w-full bg-white border border-[#E8DCC6] p-3 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52] font-sans h-48"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1E1A16] text-white hover:bg-[#A67C52] text-xs font-bold uppercase tracking-widest transition-all rounded-sm shadow-sm"
              >
                Intégrer et diffonducher ✦
              </button>
            </form>

            {/* Right Col - Current Articles List */}
            <div className="lg:col-span-5 bg-white border border-[#E8DCC6] p-6 rounded-sm space-y-4 shadow-xs">
              <h2 className="font-serif text-xl text-[#1E1A16] border-b border-[#E8DCC6] pb-3">
                Articles en ligne ({articles.length})
              </h2>

              <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1 scrollbar-thin">
                {articles.length === 0 ? (
                  <p className="text-xs text-center py-8 text-gray-500 font-serif italic">Aucun article publié pour le moment.</p>
                ) : (
                  articles.map((art) => (
                    <div key={art.id} className="p-3.5 bg-[#F7F2EB]/50 border border-[#E8DCC6]/60 rounded-sm flex gap-3 items-start justify-between">
                      <div className="flex gap-2.5 items-start">
                        <img 
                          src={art.image} 
                          alt="" 
                          className="w-12 h-12 object-cover shrink-0 rounded-sm border border-[#E8DCC6]/80"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&q=80&w=600'; }}
                        />
                        <div className="text-left">
                          <span className={`text-[8.5px] px-1.5 py-0.5 rounded-sm font-bold tracking-wider ${
                            art.isPressArticle ? 'bg-[#A67C52]/10 text-[#A67C52]' : 'bg-[#1E1A16]/5 text-[#1E1A16]/75'
                          }`}>
                            {art.category}
                          </span>
                          <h4 className="font-serif text-[12px] font-semibold text-[#1E1A16] leading-tight mt-1 lines-clamp-2">
                            {art.title}
                          </h4>
                          <p className="text-[10px] text-gray-500 mt-1">
                            {art.date} {art.publicationSource && `• ${art.publicationSource}`}
                          </p>
                        </div>
                      </div>

                      {deletingArticleId === art.id ? (
                        <div className="flex items-center gap-1 shrink-0 animate-fadeIn">
                          <button
                            onClick={() => {
                              onUpdateArticles(articles.filter(a => a.id !== art.id));
                              setDeletingArticleId(null);
                              displayNotification(language === 'EN' ? "🗑️ Chronicle removed." : "🗑️ Chronique supprimée.");
                            }}
                            className="p-1 px-1.5 bg-red-600 text-white hover:bg-red-700 rounded text-[9px] font-bold uppercase transition-colors"
                            title={language === 'EN' ? "Confirm deletion" : "Confirmer la suppression"}
                          >
                            {language === 'EN' ? "Yes" : "Oui"}
                          </button>
                          <button
                            onClick={() => setDeletingArticleId(null)}
                            className="p-1 px-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-[9px] font-bold uppercase transition-colors"
                          >
                            {language === 'EN' ? "Cancel" : "Non"}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingArticleId(art.id)}
                          className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 transition-all rounded-full shrink-0"
                          title={language === 'EN' ? "Delete permanently" : "Supprimer définitivement"}
                        >
                          <Trash2 className="h-3.8 w-3.8" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stripe' && (
        <div className="space-y-6 animate-fade-in text-left">
          
          {/* Header Card */}
          <div className="bg-white border border-[#E8DCC6] p-6 rounded-sm shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DCC6] pb-4 mb-5">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1E1A16] flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-[#A67C52]" />
                  Passerelle de Paiements Stripe
                </h2>
                <p className="text-xs text-[#1E1A16]/70 mt-1">
                  Configurez et testez votre passerelle de paiement bancaire pour les rituels sacrés Merakya.
                </p>
              </div>
              
              <div className="shrink-0">
                {stripeLoading ? (
                  <span className="inline-flex items-center gap-2 text-xs text-gray-500 font-mono">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Chargement...
                  </span>
                ) : stripeConfig.hasStripeSetup ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-sm font-semibold text-xs border border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-700" />
                    Stripe Actif & Sécurisé
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-105 text-yellow-800 rounded-sm font-semibold text-xs border border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-700" />
                    Mode Simulation Actif
                  </span>
                )}
              </div>
            </div>

            {/* Keys Status Table / Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-[#F7F2EB] border border-[#E8DCC6] rounded-xs space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#A67C52] block">
                  État des Variables d'Environnement
                </span>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-[#E8DCC6]/60">
                    <span className="font-mono font-semibold text-[#1E1A16]/80">STRIPE_SECRET_KEY</span>
                    {stripeConfig.hasStripeSetup ? (
                      <span className="text-green-800 font-bold flex items-center gap-1 text-[11px]">
                        <Check className="h-3.5 w-3.5 text-green-700" /> Configurée (sk_test_•••••)
                      </span>
                    ) : (
                      <span className="text-red-750 font-bold flex items-center gap-1 text-[11px]">
                        Non détectée ⚠️
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center py-1 border-b border-[#E8DCC6]/60">
                    <span className="font-mono font-semibold text-[#1E1A16]/80">VITE_STRIPE_PUBLIC_KEY</span>
                    {stripeConfig.publicKey ? (
                      <span className="text-green-800 font-mono text-[10px] font-bold truncate max-w-[180px]" title={stripeConfig.publicKey}>
                        {stripeConfig.publicKey.substring(0, 12)}••••••
                      </span>
                    ) : (
                      <span className="text-red-750 font-bold flex items-center gap-1 text-[11px]">
                        Non détectée ⚠️
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[9.5px] text-[#A67C52] leading-relaxed mt-3">
                  * Ces clés d'API restent stockées de manière strictement confidentielle côté serveur. Elles ne sont jamais partagées publiquement ou révélées dans la console web des utilisateurs.
                </p>
              </div>

              {/* Quick Config instructions */}
              <div className="space-y-3 border-l border-[#E8DCC6] pl-0 md:pl-6 text-xs text-[#1E1A16]/80">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#1E1A16] flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-[#A67C52]" />
                  Comment activer Stripe en Production ?
                </h3>
                
                <ol className="text-[11px] text-[#1E1A16]/80 space-y-2 list-decimal list-inside leading-relaxed text-left">
                  <li>Inscrivez-vous ou connectez-vous sur <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="underline font-bold text-[#A67C52] hover:text-[#1E1A16]">dashboard.stripe.com</a>.</li>
                  <li>Allez dans l'onglet <strong className="text-[#1E1A16]">Développeurs &gt; Clés API</strong>.</li>
                  <li>Copiez la <strong className="text-[#1E1A16]">Clé secrète (Secret Key)</strong> commençant par <code className="bg-[#F7F2EB] px-1 text-red-650 font-mono text-[10px]">sk_...</code> et la <strong className="text-[#1E1A16]">Clé publique (Publishable Key)</strong> commençant par <code className="bg-[#F7F2EB] px-1 text-blue-650 font-mono text-[10px]">pk_...</code>.</li>
                  <li>Pour les activer survotre Cloud Run container, rendez-vous dans l'onglet <strong className="text-[#1E1A16]">Settings &gt; Secrets</strong> de votre console AI Studio.</li>
                  <li>Renseignez <code className="font-mono bg-[#F7F2EB] py-0.5 px-1 rounded border text-[10px]">STRIPE_SECRET_KEY</code> et <code className="font-mono bg-[#F7F2EB] py-0.5 px-1 rounded border text-[10px]">VITE_STRIPE_PUBLIC_KEY</code> pour activer !</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Test Sandbox & Gateway Validation Interface */}
          <div className="bg-white border border-[#E8DCC6] p-6 rounded-sm shadow-xs">
            <h3 className="font-serif text-lg font-bold text-[#1E1A16] border-b border-[#E8DCC6] pb-2 mb-4">
              Console de Validation Directe de la Passerelle Stripe
            </h3>
            
            <p className="text-xs text-[#1E1A16]/80 mb-4 leading-relaxed">
              Utilisez ce panneau pour exécuter un appel simulé hautement sécurisé de génération d'intention ou de session de paiement vers Stripe. Cela garantit que votre build et vos clés d'environnement API sont fonctionnelles à 100%.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4 font-sans">
              <div>
                <label className="block text-[9px] font-bold tracking-widest uppercase text-[#A67C52] mb-1">Montant Test de démonstration</label>
                <div className="bg-[#F7F2EB] p-2.5 rounded-xs border border-[#E8DCC6] font-mono text-xs text-center font-bold text-[#1E1A16]">
                  150,00 MAD
                </div>
              </div>
              
              <div>
                <label className="block text-[9px] font-bold tracking-widest uppercase text-[#A67C52] mb-1">Devise de Facturation</label>
                <select
                  value={currencyTest}
                  onChange={(e) => setCurrencyTest(e.target.value)}
                  className="w-full bg-[#F7F2EB] p-2 text-xs border border-[#E8DCC6] rounded-xs font-mono text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                >
                  <option value="MAD">MAD (Dirhams Marocains)</option>
                  <option value="EUR">EUR (Euros)</option>
                  <option value="USD">USD (Dollars)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold tracking-widest uppercase text-[#A67C52] mb-1">E-mail Client Test</label>
                <div className="bg-white p-2.5 rounded-xs border border-[#E8DCC6] text-xs truncate text-[#1E1A16]">
                  test-admin@merakya.com
                </div>
              </div>

              <button
                type="button"
                onClick={runStripeTest}
                className="w-full bg-[#1E1A16] hover:bg-[#A67C52] text-[#F7F2EB] py-3 text-xs uppercase font-bold tracking-widest transition-colors rounded-sm"
              >
                Lancer le Test d'Intention ⚡️
              </button>
            </div>

            {/* Test output block */}
            {testResult && (
              <div className={`p-4 border rounded-sm font-sans text-xs space-y-2 mt-4 transition-all ${
                testResult.status === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-950 text-left' 
                  : testResult.status === 'running' 
                    ? 'bg-blue-50 border-blue-200 text-blue-950 animate-pulse text-left' 
                    : 'bg-red-50 border-red-200 text-red-950 text-left'
              }`}>
                <div className="flex items-center gap-2 font-bold font-serif text-sm">
                  {testResult.status === 'success' && <span>✦ Succès !</span>}
                  {testResult.status === 'running' && <span>⚙️ Test en cours...</span>}
                  {testResult.status === 'error' && <span>⚠️ Échec de Connexion API</span>}
                </div>
                
                <p className="leading-relaxed">{testResult.message}</p>
                
                {testResult.clientSecret && (
                  <div className="space-y-1 mt-2">
                    <div className="font-mono text-[10px] bg-white border p-2 rounded-xs select-all">
                      <strong>Client Secret :</strong> {testResult.clientSecret.substring(0, 40)}••••••••••••••••••••
                    </div>
                    <div className="font-mono text-[10px] bg-white border p-2 rounded-xs">
                      <strong>PaymentIntent ID :</strong> {testResult.id}
                    </div>
                  </div>
                )}

                {testResult.raw && (
                  <pre className="font-mono text-[9px] bg-red-100/30 p-2 mt-2 max-h-32 overflow-y-auto w-full border border-red-250 rounded-xs text-left">
                    {JSON.stringify(testResult.raw, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
