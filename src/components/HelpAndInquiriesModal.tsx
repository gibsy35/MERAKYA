import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Truck, CreditCard, RefreshCw, FileText, Shield, Globe, HelpCircle } from 'lucide-react';
import { Language } from '../translations';

interface FAQItem {
  id: number;
  question: { FR: string; EN: string };
  answer: { FR: string; EN: string };
}

const FAQS: FAQItem[] = [
  {
    id: 1,
    question: {
      FR: "Comment utiliser et entretenir vos bougies d'intention ?",
      EN: "How do I use and maintain your intention candles?"
    },
    answer: {
      FR: "Pour une combustion optimale, coupez la mèche à 5 mm avant chaque allumage. Laissez la cire fondre uniformément sur toute la surface lors du premier brûlage (environ 2-3 heures) pour éviter l'effet 'tunnel'. Vous pouvez choisir de retirer les cristaux infusés ou de les laisser infuser leur énergie tout au long du rituel.",
      EN: "For optimal burning, trim the wick to 5 mm before each lighting. Let the wax melt evenly across the entire surface during the first burn (about 2-3 hours) to avoid tunneling. You can choose to remove the infused crystals or let them release their energy throughout the ritual."
    }
  },
  {
    id: 2,
    question: {
      FR: "Vos créations cosmétiques sont-elles adaptées aux peaux sensibles ?",
      EN: "Are your cosmetic creations suitable for sensitive skin?"
    },
    answer: {
      FR: "Oui, absolument. Tous nos savons sculptés à froid et élixirs botaniques sont formulés à base d'huiles biologiques précieuses, de micas minéraux et d'actifs naturels. Ils sont entièrement exempts de sulfates, silicones, parabènes et huiles minérales. Si vous avez une peau extrêmement réactive, nous préconisons toujours de réaliser un test cutané préliminaire au pli du coude.",
      EN: "Yes, absolutely. All our cold-process sculpted soaps and botanical elixirs are formulated with premium organic oils, mineral micas, and natural active ingredients. They are completely free of sulfates, silicones, parabens, and mineral oils. If you have extremely sensitive skin, we always suggest performing a patch test on your inner elbow first."
    }
  },
  {
    id: 3,
    question: {
      FR: "Quelle est l'origine de vos matières premières botaniques ?",
      EN: "What is the origin of your botanical raw materials?"
    },
    answer: {
      FR: "Nous sourçons avec passion et éthique la majorité de nos ingrédients au cœur du Maroc. Nos huiles précieuses d'argan, de pépin de figue de barbarie et nos argiles minérales proviennent de coopératives de femmes locales et de producteurs éco-responsables engagés dans le respect de la biodiversité.",
      EN: "We passionately and ethically source most of our ingredients from the heart of Morocco. Our precious argan oil, prickly pear seed oil, and mineral clays come from local women's cooperatives and eco-friendly producers committed to biodiversity."
    }
  },
  {
    id: 4,
    question: {
      FR: "Puis-je personnaliser des coffrets rituels pour un événement ?",
      EN: "Can I customize ritual gift boxes for an event?"
    },
    answer: {
      FR: "Certainement. Nous créons des expériences sensorielles sur-mesure pour vos mariages, baptêmes, rituels ou événements d'entreprise (choix des parfums sacrés, personnalisation des étiquettes et coffrets). N'hésitez pas à solliciter notre service conciergerie à l'adresse contact@merakyalab.com pour concevoir votre univers.",
      EN: "Certainly. We design tailor-made sensory experiences for your weddings, baptisms, private rituals, or corporate events (custom sacred fragrances, personalized labels, and gift boxes). Feel free to reach out to our concierge service at contact@merakyalab.com to develop your bespoke universe."
    }
  },
  {
    id: 5,
    question: {
      FR: "Vos produits sont-ils véganes et non testés sur les animaux ?",
      EN: "Are your products vegan and cruelty-free?"
    },
    answer: {
      FR: "Conformément à nos valeurs holistiques et éthiques de soin du vivant, aucune de nos créations n'est testée sur les animaux. De plus, 100% de nos savons et huiles sont de composition purement végétale (végane). Seules certaines bougies spécifiques peuvent parfois utiliser de la cire d'abeille bio et locale de l'Atlas, mentionnée explicitement dans leur composition.",
      EN: "In alignment with our holistic values and respect for all living beings, none of our creations are tested on animals. Furthermore, 100% of our soaps and oils are purely plant-based (vegan). Only a few specific candles may sometimes contain local organic Atlas beeswax, which is explicitly noted in their ingredients list."
    }
  }
];

function FAQSection({ language }: { language: Language }) {
  const [openId, setOpenId] = React.useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4 font-sans max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
      {FAQS.map((faq) => {
        const isOpen = openId === faq.id;
        const questionText = language === 'EN' ? faq.question.EN : faq.question.FR;
        const answerText = language === 'EN' ? faq.answer.EN : faq.answer.FR;

        return (
          <div 
            key={faq.id} 
            className="border border-[#E8DCC6]/60 rounded-xs overflow-hidden bg-white/40 transition-all duration-300 hover:border-[#A67C52]/50"
          >
            <button
              id={`faq-toggle-${faq.id}`}
              onClick={() => toggleFaq(faq.id)}
              className="w-full text-left p-4 flex justify-between items-center gap-4 hover:bg-white/20 transition-all"
            >
              <span className="font-serif text-xs md:text-[13px] font-medium text-[#1E1A16] leading-snug">
                {questionText}
              </span>
              <span className={`text-[#A67C52] text-[10px] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                ✦
              </span>
            </button>
            
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="p-4 pt-0 text-xs md:text-[12.5px] leading-relaxed text-[#1E1A16]/75 font-light border-t border-[#E8DCC6]/30 bg-white/10">
                    {answerText}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

interface HelpAndInquiriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
  language?: Language;
}

export default function HelpAndInquiriesModal({
  isOpen,
  onClose,
  initialTab = 'livraison',
  language = 'FR'
}: HelpAndInquiriesModalProps) {
  const [activeTab, setActiveTab] = React.useState(initialTab);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const tabsFr = [
    {
      id: 'livraison',
      name: 'Livraison & Tarifs',
      icon: Truck,
      title: 'Livraison & Tarifs (Maroc & International)',
      content: (
        <div className="space-y-6 font-sans text-xs md:text-[13px] text-[#1E1A16]/80 leading-relaxed font-light">
          <div>
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">✦ EXPÉDITIONS AU MAROC</h4>
            <p className="mb-2">
              Nous livrons vos rituels sacrés à domicile dans toutes les villes du Royaume (Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir, etc.) sous un délai de <strong className="font-semibold">48h à 72h ouvrés</strong>.
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Tarif fixe de livraison express : <strong className="font-bold">35 DH</strong> pour tout colis.</li>
              <li><strong className="font-extrabold text-[#A67C52]">LIVRAISON GRATUITE</strong> dès <strong className="font-bold">400 DH</strong> d'achat cumulé.</li>
            </ul>
          </div>

          <div className="border-t border-[#E8DCC6]/40 pt-4">
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">✦ EXPÉDITIONS À L'INTERNATIONAL (MONDE ENTIER)</h4>
            <div className="flex items-start gap-2 mb-2">
              <Globe className="h-4.5 w-4.5 text-[#A67C52] shrink-0 mt-0.5" />
              <p>
                Nous partageons fièrement l'alchimie de l'artisanat marocain à travers le monde ! Nous expédions en <strong className="font-semibold">Europe, Amérique du Nord, Afrique subsaharienne et Moyen-Orient</strong> via nos partenaires d’élite <strong className="font-semibold">DHL Express et FedEx</strong>.
              </p>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Délai moyen de livraison internationale : <strong className="font-semibold">5 à 10 jours ouvrés</strong> avec suivi en temps réel par SMS et Email.</li>
              <li>Frais d'envoi calculés au checkout selon le poids de votre commande (à partir de <strong className="font-bold">150 DH / 15 € / 16 $</strong>).</li>
              <li>Toutes nos créations en verre et en céramique sont emballées de manière ultra-sécurisée contre les chocs de transports internationaux.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'paiement',
      name: 'Paiement sécurisé',
      icon: CreditCard,
      title: 'Paiement & Sécurité des transactions',
      content: (
        <div className="space-y-6 font-sans text-xs md:text-[13px] text-[#1E1A16]/80 leading-relaxed font-light">
          <div>
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">1. PAIEMENT À LA LIVRAISON (CASH ON DELIVERY)</h4>
            <p>
              Disponible de manière exclusive pour l'ensemble de nos clients résidant au <strong className="font-semibold">Maroc</strong>. Ne payez absolument rien en ligne ! Réglez le montant exact de votre commande en espèces (en Dirhams) directement auprès de notre agent de livraison agréé lorsque vous tenez votre colis entre vos mains.
            </p>
          </div>

          <div className="border-t border-[#E8DCC6]/40 pt-4">
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">2. CARTE BANCAIRE EN LIGNE (100% SÉCURISÉ)</h4>
            <p>
              Pour vos commandes marocaines et internationales, notre site utilise un cryptage SSL de haute sécurité 256 bits via la passerelle de paiement certifiée. Vos coordonnées bancaires sensibles ne transitent jamais en clair sur notre serveur et ne sont jamais stockées chez nous. 
              <br className="mb-2" />
              Nous acceptons toutes les cartes nationales et internationales des réseaux <strong className="font-semibold">Visa, Mastercard, Maestro et CMI</strong>.
            </p>
          </div>

          <div className="border-t border-[#E8DCC6]/40 pt-4">
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">3. PAYPAL SECURE WALLET</h4>
            <p>
              Sélectionnez l'option de règlement rapide PayPal au moment de l'enregistrement de votre panier pour régler instantanément depuis votre compte personnel international.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'retours',
      name: 'Retours & Échanges',
      icon: RefreshCw,
      title: 'Politique de Retours et d’Échanges sous 14 jours',
      content: (
        <div className="space-y-6 font-sans text-xs md:text-[13px] text-[#1E1A16]/80 leading-relaxed font-light">
          <div>
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">✦ RETEXTURE DE NOTRE PROMESSE CLIENT</h4>
            <p className="mb-3">
              Chez Merakya, la satisfaction de votre âme et de vos sens est l'essence même de notre art. Si une création ne correspond pas pleinement à vos intentions énergétiques ou olfactives, vous disposez d'un délai légal de <strong className="font-semibold">14 jours francs</strong> à compter du lendemain du jour de la réception de votre colis pour demander un retour gratuit, un échange ou un remboursement complet.
            </p>
          </div>

          <div className="border-t border-[#E8DCC6]/40 pt-4">
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">✦ CONDITIONS STRICTES D'ACCEPTATION</h4>
            <p className="mb-2">
              Pour des raisons évidentes de préservation sanitaire, d'hygiène et de conservation biologique :
            </p>
            <ul className="list-disc list-inside space-y-2 pl-1">
              <li>Les articles retournés doivent être <strong className="font-medium">neufs, non utilisés</strong>, et conservés dans leur boite/pochon d'origine, munis de leur opercule protecteur intact.</li>
              <li>Les bougies d'intentions dont la mèche a été brûlée ou coupée, ainsi que les pains de savon ou élixirs ouverts ou entamés, <strong className="font-semibold">ne pourront faire l'objet d'un retour ou d'un remboursement</strong>.</li>
            </ul>
          </div>

          <div className="border-t border-[#E8DCC6]/40 pt-4">
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">✦ COMMENT EFFECTUER UN RETOUR ?</h4>
            <p>
              Il vous suffit d'envoyer un e-mail à l'adresse de notre conciergerie : <strong className="underline text-[#A67C52]">contact@merakyalab.com</strong>, en mentionnant votre nom et le numéro de votre commande. Notre équipe vous fera parvenir la procédure et l'adresse de réexpédition de nos ateliers sous 24h. Les frais de retour en cas de défaut ou d'erreur sur votre commande sont entièrement pris en charge par Merakya.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'faq',
      name: 'FAQ',
      icon: HelpCircle,
      title: 'FAQ – Questions Fréquentes',
      content: <FAQSection language={language} />
    },
    {
      id: 'conditions',
      name: 'Conditions de vente',
      icon: FileText,
      title: 'Conditions Générales de Vente (CGV) de Merakya',
      content: (
        <div className="space-y-4 font-sans text-xs md:text-[12px] text-[#1E1A16]/80 leading-relaxed font-light h-[280px] overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <h4 className="font-semibold text-[#A67C52] text-[11px] tracking-wider uppercase mb-1">ARTICLE 1 : APPLICATION DES CONDITIONS</h4>
            <p className="mb-2">
              Les présentes Conditions Générales de Vente régissent de plein droit les relations contractuelles de vente passées entre tout acheteur et la marque d'artisanat ésotérique et cosmétique naturelle Merakya.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#A67C52] text-[11px] tracking-wider uppercase mb-1">ARTICLE 2 : UNICITÉ DE CHAQUE ARTISANAT</h4>
            <p className="mb-2">
              Nos collections (savons, bougies d'intentions, élixirs) sont entièrement façonnées à la main de manière alchimique. Des variations mineures d'aspect de texture, de couleur micas, de position de fleurs séchées ou de cristaux sont naturelles, attestent de la noblesse du travail artisanal et n'altèrent en rien la qualité et l'énergie sacrée de la pièce.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#A67C52] text-[11px] tracking-wider uppercase mb-1">ARTICLE 3 : PRIX ET ENREGISTREMENT</h4>
            <p className="mb-2">
              Les prix affichés sur notre plateforme sont nets de taxes et garantis lors de l'achat. Toutes les transactions s'effectuent en Dirham Marocain (MAD), avec affichage de conversion en Euro ou USD à titre indicatif. Merakya se réserve le droit de modifier ses prix à tout moment mais s'engage à appliquer le tarif en vigueur lors de la validation.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#A67C52] text-[11px] tracking-wider uppercase mb-1">ARTICLE 4 : PROPRIÉTÉ INTELLECTUELLE</h4>
            <p>
              L’ensemble de la structure du site, de l'identité graphique de marque, du logo, des photos rituelles de produits et du brevet des créations de savons sculptés en forme de rose et bougies rituelles Merakya est la propriété exclusive de la marque. Toute contrefaçon entraînera des poursuites légales obligatoires.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'confidentialite',
      name: 'Confidentialité',
      icon: Shield,
      title: 'Politique de Confidentialité et Protection des données',
      content: (
        <div className="space-y-5 font-sans text-xs md:text-[13px] text-[#1E1A16]/80 leading-relaxed font-light">
          <div>
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">1. RESPECT INDÉFECTIBLE DE VOS ACCÈS</h4>
            <p className="mb-2">
              Chez Merakya, nous traitons vos données personnelles avec le même soin et le même respect que nous infusons dans nos créations de cire et de savon. Vos données (Nom, Adresse postale, Numéro de Téléphone, E-mail) sont collectées de manière loyale et transparente à l’unique fin de traitement de vos commandes.
            </p>
          </div>

          <div className="border-t border-[#E8DCC6]/40 pt-4">
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">2. ZERO VENTE OU PARTAGE COMMERCIAL</h4>
            <p className="mb-2">
              Nous nous engageons de manière bilatérale et formelle de ne <strong className="font-semibold">jamais vendre, louer, ou partager vos informations personnelles</strong> avec des entreprises marketing privées, des annonceurs ou des tiers publicitaires. Vos coordonnées ne servent exclusivement qu'à affréter les bordereaux d'envois postaux ou d'informer vos suivis colis.
            </p>
          </div>

          <div className="border-t border-[#E8DCC6]/40 pt-4">
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">3. VOS DROITS D'ACCÈS ET DE RETRAIT</h4>
            <p>
              Conformément à la protection internationale et marocaine des données personnelles, vous bénéficiez d'un droit permanent d'accès, d'interrogation, de rectification et d'effacement total de vos données personnelles. Vous pouvez exercer ce droit à tout instant par simple mail à <strong className="underline text-[#A67C52]">contact@merakyalab.com</strong>.
            </p>
          </div>
        </div>
      )
    }
  ];

  const tabsEn = [
    {
      id: 'livraison',
      name: 'Shipping & Delivery',
      icon: Truck,
      title: 'Delivery & Shipping Rates (Morocco & World)',
      content: (
        <div className="space-y-6 font-sans text-xs md:text-[13px] text-[#1E1A16]/80 leading-relaxed font-light">
          <div>
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">✦ DOMESTIC SHIPPING (MOROCCO)</h4>
            <p className="mb-2">
              We deliver your sacred rituals directly to your doorstep in all cities across the Kingdom (Casablanca, Rabat, Marrakech, Tangier, Fes, Agadir, etc.) within <strong className="font-semibold">48h to 72h business hours</strong>.
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Flat express shipping rate: <strong className="font-bold">35 DH</strong> for all parcels.</li>
              <li><strong className="font-extrabold text-[#A67C52]">FREE SHIPPING</strong> starting from <strong className="font-bold">400 DH</strong> of total purchases.</li>
            </ul>
          </div>

          <div className="border-t border-[#E8DCC6]/40 pt-4">
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">✦ INTERNATIONAL SHIPPING (WORLDWIDE)</h4>
            <div className="flex items-start gap-2 mb-2">
              <Globe className="h-4.5 w-4.5 text-[#A67C52] shrink-0 mt-0.5" />
              <p>
                We proudly share the alchemy of Moroccan premium craftsmanship across the globe! We shape and dispatch orders to <strong className="font-semibold">Europe, North America, Sub-Saharan Africa, and the Middle East</strong> through elite partners <strong className="font-semibold">DHL Express and FedEx</strong>.
              </p>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Average international delivery times: <strong className="font-semibold">5 to 10 working days</strong> with real-time tracking via SMS and Email.</li>
              <li>Shipping fees are computed dynamically at checkout depending on parcel weight (starting from <strong className="font-bold">150 DH / 15 € / 16 $</strong>).</li>
              <li>All ceramic and glass creations are packed in extra-layered security wrap to withstand any international carriage shocks.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'paiement',
      name: 'Secure Payment',
      icon: CreditCard,
      title: 'Payment Methods & Security Shield',
      content: (
        <div className="space-y-6 font-sans text-xs md:text-[13px] text-[#1E1A16]/80 leading-relaxed font-light">
          <div>
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">1. CASH ON DELIVERY (COD)</h4>
            <p>
              Available exclusively for customers residing within <strong className="font-semibold">Morocco</strong>. No need to pay online! Settle the exact amount of your invoice in cash (MAD) directly to our certified delivery agent when you hold the parcel in your hands.
            </p>
          </div>

          <div className="border-t border-[#E8DCC6]/40 pt-4">
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">2. SECURE BANK CARD ONLINE (100% PROTECTED)</h4>
            <p>
              For both Moroccan and global orders, our portal uses industry-grade 256-bit SSL encryption via certified checkout gateways. Your sensitive banking details are encrypted on transit and are never stored on our systems.
              <br className="mb-2" />
              We support all national and global networks including <strong className="font-semibold">Visa, Mastercard, Maestro, and CMI</strong>.
            </p>
          </div>

          <div className="border-t border-[#E8DCC6]/40 pt-4">
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">3. PAYPAL SECURE WALLET</h4>
            <p>
              Select the PayPal quick payment check during checkout to pay instantly from your international PayPal personal wallet.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'retours',
      name: 'Returns & Exchanges',
      icon: RefreshCw,
      title: '14-Day Free Returns & Exchange Policy',
      content: (
        <div className="space-y-6 font-sans text-xs md:text-[13px] text-[#1E1A16]/80 leading-relaxed font-light">
          <div>
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">✦ OUR CUSTOMER PLEDGE</h4>
            <p className="mb-3">
              At Merakya, satisfying your soul and sensory expectations is the essence of our craft. If a hand-formulated creation does not align fully with your energetic or olfactive intentions, you have a legal timeframe of <strong className="font-semibold">14 full days</strong> starting from the day of delivery to request a hassle-free return, exchange or complete refund.
            </p>
          </div>

          <div className="border-t border-[#E8DCC6]/40 pt-4">
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">✦ RETURN REQUIREMENTS</h4>
            <p className="mb-2">
              For obvious biological preservation, hygiene, and safe storage requirements:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-1">
              <li>Returned items must be <strong className="font-medium">brand new, unused</strong>, and retained within their original packaging box/pouch with protection shields intact.</li>
              <li>Intentional candles whose wicks have been burned or cropped, as well as opened cosmetic nectars, elixirs, or carved soaps, <strong className="font-semibold">cannot be returned or refunded</strong>.</li>
            </ul>
          </div>

          <div className="border-t border-[#E8DCC6]/40 pt-4">
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">✦ HOW TO INITIATE A RETURN?</h4>
            <p>
              Simply email our concierge service at: <strong className="underline text-[#A67C52]">contact@merakyalab.com</strong> mentioning your full name and order number. Our team will supply the return label and address coordinates of our laboratory within 24h. Return shipping expenses under error or defects are fully covered by Merakya.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'faq',
      name: 'FAQ',
      icon: HelpCircle,
      title: 'FAQ - Common Questions',
      content: <FAQSection language={language} />
    },
    {
      id: 'conditions',
      name: 'Terms of Sale',
      icon: FileText,
      title: 'General Terms & Conditions of Sale (CGV) - Merakya',
      content: (
        <div className="space-y-4 font-sans text-xs md:text-[12px] text-[#1E1A16]/80 leading-relaxed font-light h-[280px] overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <h4 className="font-semibold text-[#A67C52] text-[11px] tracking-wider uppercase mb-1">ARTICLE 1: SCOPE OF APPLICATION</h4>
            <p className="mb-2">
              The present Terms & Conditions of Sale govern all contractual transactions and sales completed on Merakya between any buyer and the Merakya raw botanical artisan brand.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#A67C52] text-[11px] tracking-wider uppercase mb-1">ARTICLE 2: THE UNIQUENESS OF HANDMADE CRAFT</h4>
            <p className="mb-2">
              Our botanical apothecary pieces (soaps, intention candles, luxury elixirs) are entirely handcrafted in deep alchemical ways. Subtle differences in raw texture, mineral micas, dry botanical positions, and gemstones are natural, showing true nobility of traditional human touch, and do not degrade the spiritual energy of the product.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#A67C52] text-[11px] tracking-wider uppercase mb-1">ARTICLE 3: PRICE STRUCTURE AND CURRENCIES</h4>
            <p className="mb-2">
              All prices shown on our website are inclusive of any local taxes and guaranteed at the moment of payment. All checkout payments are closed in Moroccan Dirham (MAD), with dynamic indicators in EUR or USD for clarity. Merakya reserves the right to modify prices but will honor prices active at validation.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#A67C52] text-[11px] tracking-wider uppercase mb-1">ARTICLE 4: PROPRIETARY PROPERTY RIGHTS</h4>
            <p>
              All graphic designs, layout, imagery, logos, descriptive botanical texts, and the patented shape design of our signature rose-sculpted soaps and lunar candles are the exclusive intellectual property of Merakya. Any counterfeiting will trigger formal legal action.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'confidentialite',
      name: 'Privacy Policy',
      icon: Shield,
      title: 'Privacy Pledge & Personal Data Shield',
      content: (
        <div className="space-y-5 font-sans text-xs md:text-[13px] text-[#1E1A16]/80 leading-relaxed font-light">
          <div>
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">1. ABSOLUTE DATA RESPECT</h4>
            <p className="mb-2">
              At Merakya, we treat your personal privacy with the same delicate care and positive intent that we infuse inside our waxes and botanical formulas. Your details (Name, Address, Phone, Email) are securely collected with sole relevance to shipping and processing your organic crafts.
            </p>
          </div>

          <div className="border-t border-[#E8DCC6]/40 pt-4">
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">2. ZERO COMMERCIAL COMMERCIALIZATION</h4>
            <p className="mb-2">
              We formally pledge to <strong className="font-semibold">never sell, rent, or distribute your email or personal information</strong> to private marketing brokers, advertising networks, or any commercial third parties. Your details are reserved purely for printing courier bills or mailing shipment alerts.
            </p>
          </div>

          <div className="border-t border-[#E8DCC6]/40 pt-4">
            <h4 className="font-semibold text-[#A67C52] text-[11px] md:text-xs tracking-wider uppercase mb-2">3. RIGHTS OF ACCESSIBILITY & REMOVAL</h4>
            <p>
              Under global data protective laws, you hold a permanent right to access, check, correct, or request the immediate removal of all your records. Feel free to claim or apply this right anytime by emailing <strong className="underline text-[#A67C52]">contact@merakyalab.com</strong>.
            </p>
          </div>
        </div>
      )
    }
  ];

  const tabs = language === 'EN' ? tabsEn : tabsFr;
  const activeData = tabs.find(t => t.id === activeTab) || tabs[0];
  const ActiveIcon = activeData.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1E1A16]/65 backdrop-blur-sm"
          />

          {/* Dialog Body Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="bg-[#F7F2EB] border border-[#E8DCC6] shadow-2xl rounded-sm w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative z-10"
          >
            {/* Close button absolute */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full text-[#1E1A16]/50 hover:text-[#1E1A16] hover:bg-[#1E1A16]/5 transition-all z-20"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left Column - Navigation List */}
            <div className="w-full md:w-1/3 bg-[#1E1A16] p-6 text-[#F7F2EB] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#A67C52]/30 shrink-0">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] tracking-[0.3em] font-extrabold text-[#A67C52] uppercase block">✦ MERAKYA</span>
                  <h3 className="font-serif text-lg md:text-xl tracking-wide text-white mt-1">
                    {language === 'EN' ? 'Help & Guidelines' : 'Aide & Informations'}
                  </h3>
                  <div className="w-8 h-[1px] bg-[#A67C52] mt-2.5" />
                </div>

                <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1.5 md:space-y-2 pb-2 md:pb-0 scrollbar-none">
                  {tabs.map((tab) => {
                    const TabIcon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2.5 px-3 py-2 text-[10.5px] md:text-xs tracking-wider font-medium text-left transition-all shrink-0 rounded-sm whitespace-nowrap ${
                          activeTab === tab.id 
                            ? 'bg-[#A67C52] text-white' 
                            : 'text-[#E8DCC6]/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <TabIcon className="h-4 w-4 shrink-0" />
                        <span>{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="hidden md:block pt-8 border-t border-[#A67C52]/10 text-[9px] text-[#E8DCC6]/50 space-y-1">
                <p>{language === 'EN' ? 'Need further assistance?' : "Besoin d'aide supplémentaire ?"}</p>
                <p className="text-white hover:underline cursor-pointer font-medium">contact@merakyalab.com</p>
              </div>
            </div>

            {/* Right Column - Active Content Viewer */}
            <div className="w-full md:w-2/3 p-6 md:p-10 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-full">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#A67C52]/10 text-[#A67C52] rounded-sm">
                    <ActiveIcon className="h-5 w-5" />
                  </div>
                  <h2 className="font-serif text-lg md:text-xl text-[#1E1A16] font-normal tracking-wide">
                    {activeData.title}
                  </h2>
                </div>
                <div className="w-full h-[1px] bg-[#E8DCC6]/60" />

                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeData.content}
                </motion.div>
              </div>

              <div className="pt-6 border-t border-[#E8DCC6]/40 mt-8 flex justify-between items-center text-[10px] text-[#1E1A16]/50 font-mono">
                <span>RITUEL • ESSENCE • BIEN-ÊTRE</span>
                <span>MERAKYA MAROC</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
