import React, { useState } from 'react';
import { CartItem, Product, Order, CurrencyCode, formatPrice } from '../types';
import { X, Trash2, ShieldCheck, ShoppingBag, Landmark, ArrowRight } from 'lucide-react';
import { Language, translations, PRODUCT_TRANSLATIONS } from '../translations';

interface ShoppingCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onSubmitOrder: (orderDetails: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
  }) => void;
  selectedCurrency?: CurrencyCode;
  language?: Language;
}

export default function ShoppingCartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onSubmitOrder,
  selectedCurrency = 'MAD',
  language = 'FR'
}: ShoppingCartDrawerProps) {
  const t = (key: keyof typeof translations['FR']) => {
    return translations[language][key] || translations['FR'][key] || '';
  };
  const [showCheckout, setShowCheckout] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Casablanca');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  // New operational payment & customer states
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'transfer'>('cod');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  
  const [createAccount, setCreateAccount] = useState(false);
  const [accountPassword, setAccountPassword] = useState('');
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginView, setIsLoginView] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 400;
  const remainingForFreeShipping = freeShippingThreshold - totalAmount;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address) {
      alert("Veuillez remplir toutes les informations pour la livraison au Maroc.");
      return;
    }

    setIsSubmitting(true);

    if (paymentMethod === 'card') {
      // Store checkout info temporarily so we can recover it when redirected back from Stripe
      const pendingCheckout = {
        details: {
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          customerAddress: `${address}, ${city}, Maroc`
        },
        cart: cart
      };
      localStorage.setItem('merakya_pending_checkout', JSON.stringify(pendingCheckout));

      try {
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cart: cart,
            customerEmail: email,
            customerName: name,
            customerPhone: phone,
            customerAddress: `${address}, ${city}, Maroc`,
            currency: selectedCurrency
          })
        });

        const data = await response.json();

        if (response.ok && data.url) {
          // Success: redirect user to Stripe
          window.location.href = data.url;
          return;
        } else {
          // If the key is missing or invalid, explain clearly matching the language!
          if (data.error === "STRIPE_SECRET_KEY_MISSING") {
            alert(language === 'EN' 
              ? "📡 SECRETS NOT YET SET!\n\nTo accept real payments, please configure the STRIPE_SECRET_KEY and VITE_STRIPE_PUBLIC_KEY environment variables in AI Studio's Settings > Secrets panel.\n\nCompleting the request as offline simulation mode for testing." 
              : "📡 SECRETS STRIPE NON CONFIGURÉS !\n\nPour accepter de vrais paiements, veuillez configurer les variables d'environnement STRIPE_SECRET_KEY et VITE_STRIPE_PUBLIC_KEY dans le panneau Settings > Secrets de votre espace.\n\nFinalisation de la commande en mode simulation hors-ligne pour la démonstration.");
          } else {
            alert(`Stripe Gateway Warning: ${data.message || data.error || "Génération échouée"}. Simulating offline checkout.`);
          }
        }
      } catch (err: any) {
        console.error("Failed to connect to Stripe server endpoint:", err);
        alert("⚠️ Connexion impossible à la passerelle Stripe. Finalisation en mode simulation hors-ligne.");
      }
    }

    // Default flow / COD fallback / simulated flow
    setTimeout(() => {
      const trackingCode = "MK-" + Math.floor(100000 + Math.random() * 900000);
      
      // Save order to store
      onSubmitOrder({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        customerAddress: `${address}, ${city}, Maroc`
      });

      // Save clients account details if specified
      if (createAccount && email) {
        const storedClients = localStorage.getItem('merakya_clients');
        const clientsList = storedClients ? JSON.parse(storedClients) : [];
        const exists = clientsList.some((c: any) => c.email.toLowerCase() === email.toLowerCase());
        
        if (!exists) {
          const newClient = {
            id: 'client-' + Date.now(),
            fullName: name,
            email: email,
            phone: phone,
            address: address,
            city: city,
            totalOrders: 1,
            registeredAt: new Date().toLocaleDateString('fr-FR'),
            password: accountPassword
          };
          clientsList.push(newClient);
          localStorage.setItem('merakya_clients', JSON.stringify(clientsList));
        }
      }

      setIsSubmitting(false);
      setSuccessCode(trackingCode);
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setShowCheckout(false);
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setCardName('');
    }, 1500);
  };

  const handleClientLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedClients = localStorage.getItem('merakya_clients');
    const clientsList = storedClients ? JSON.parse(storedClients) : [];
    
    const matched = clientsList.find((c: any) => c.email.toLowerCase() === loginEmail.toLowerCase());
    if (matched) {
      setIsClientLoggedIn(true);
      setName(matched.fullName);
      setEmail(matched.email);
      setPhone(matched.phone);
      setAddress(matched.address);
      setCity(matched.city);
      setIsLoginView(false);
      alert(`✦ Heureux de vous revoir, l'âme sacrée ${matched.fullName} ! Vos coordonnées ont été chargées.`);
    } else {
      // Simulate/register dummy user
      const defaultClient = {
        fullName: "Yasmine Alami",
        email: loginEmail,
        phone: "+212 661 234567",
        address: "Angle Boulevard d'Anfa et Boulevard Moulay Youssef",
        city: "Casablanca"
      };
      setIsClientLoggedIn(true);
      setName(defaultClient.fullName);
      setEmail(defaultClient.email);
      setPhone(defaultClient.phone);
      setAddress(defaultClient.address);
      setCity(defaultClient.city);
      setIsLoginView(false);
      alert(`✦ Bienvenue ! Nous avons créé votre compte client d'exception pour ${loginEmail}.`);
    }
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden">
      {/* Background overlay */}
      <div 
        id="cart-drawer-backdrop"
        onClick={onClose} 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F7F2EB] shadow-2xl border-l border-[#E8DCC6] flex flex-col justify-between p-6">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E8DCC6] pb-4">
            <h2 className="font-serif text-xl text-[#1E1A16] tracking-wide flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#A67C52]" />
              Votre Coffret d'achats
            </h2>
            <button 
              id="btn-close-cart"
              onClick={onClose} 
              className="text-[#1E1A16] hover:text-[#A67C52] transition-colors p-1"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Success Screen after place order */}
          {successCode ? (
            <div className="flex-1 py-12 px-4 flex flex-col justify-center items-center text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h3 className="font-serif text-2xl text-[#1E1A16] font-semibold">Commande validée d'exception !</h3>
              <p className="text-xs text-[#1E1A16]/80 leading-relaxed max-w-xs">
                Merci d'avoir choisi l'alchimie Merakya. Votre commande a été transmise à notre atelier de Marrakech.
              </p>
              <div className="bg-[#1E1A16] text-[#F7F2EB] p-4 rounded-sm border border-[#A67C52]/20 w-full select-all font-mono text-xs">
                Code de suivi : <strong className="text-[#E8DCC6]">{successCode}</strong>
              </div>
              <p className="text-[10px] text-[#A67C52]">Paiement à la livraison partout au Maroc (Cash on Delivery)</p>
              
              <button
                id="btn-confirm-success"
                onClick={() => {
                  setSuccessCode(null);
                  onClose();
                }}
                className="w-full bg-[#A67C52] hover:bg-[#1E1A16] text-white py-3 text-xs uppercase font-bold tracking-widest transition-colors rounded-sm"
              >
                Continuer mes rituels
              </button>
            </div>
          ) : showCheckout ? (
            
            /* Checkout Form Screen with Accounts and Multiple Payment Choices */
            <div className="flex-1 py-4 space-y-4 overflow-y-auto pr-1">
              
              {/* Account State Bar */}
              {!isClientLoggedIn ? (
                <div className="bg-[#1E1A16] text-[#F7F2EB] p-3 rounded-sm border border-[#A67C52]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-widest font-bold text-[#A67C52] uppercase">
                      ESPACE CLIENT SACRÉ
                    </span>
                    <button 
                      type="button"
                      onClick={() => setIsLoginView(!isLoginView)}
                      className="text-[10px] underline text-[#E8DCC6] uppercase tracking-wider font-semibold"
                    >
                      {isLoginView ? "Créer un compte" : "Se Connecter"}
                    </button>
                  </div>
                  
                  {isLoginView ? (
                    <div className="space-y-2 pt-1">
                      <input 
                        type="email" 
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Votre adresse email"
                        className="w-full bg-[#27231E] text-white border border-[#A67C52]/30 p-2 text-xs focus:outline-none focus:border-[#A67C52]"
                      />
                      <input 
                        type="password" 
                        required
                        placeholder="Votre mot de passe"
                        className="w-full bg-[#27231E] text-white border border-[#A67C52]/30 p-2 text-xs focus:outline-none focus:border-[#A67C52]"
                      />
                      <button 
                        type="button"
                        onClick={handleClientLoginSubmit}
                        className="w-full py-1.5 bg-[#A67C52] text-[10px] font-bold uppercase tracking-widest transition-all text-white"
                      >
                        S'Infiltrer et Charger mes Coordonnées
                      </button>
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#F7F2EB]/80 leading-relaxed">
                      Connectez-vous pour pré-remplir instantanément vos coordonnées et suivre vos colis.
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-green-100/90 text-green-950 p-3 rounded-sm border border-green-200 text-xs flex items-center justify-between font-sans">
                  <span>✦ Profil connecté: <strong className="font-bold">{name}</strong></span>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsClientLoggedIn(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setAddress('');
                    }}
                    className="underline text-[10px] font-bold uppercase text-green-800"
                  >
                    Déconnexion
                  </button>
                </div>
              )}

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <h3 className="font-serif text-lg text-[#1E1A16] border-b border-[#E8DCC6] pb-2 font-medium">
                  Détails de facturation & livraison
                </h3>
                
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#1E1A16] mb-1">
                    Nom Complet *
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Yasmine Alami" 
                    className="w-full bg-white border border-[#E8DCC6] p-2.5 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#1E1A16] mb-1">
                    Adresse Email *
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@exemple.com" 
                    className="w-full bg-white border border-[#E8DCC6] p-2.5 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#1E1A16] mb-1">
                    Téléphone Portable * (Livraison au Maroc)
                  </label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: +212 600 000000" 
                    className="w-full bg-white border border-[#E8DCC6] p-2.5 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#1E1A16] mb-1">
                    Adresse de livraison complète *
                  </label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rue, Quartier, Résidence" 
                    className="w-full bg-white border border-[#E8DCC6] p-2.5 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#1E1A16] mb-1">
                    Ville de Livraison
                  </label>
                  <select 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-[#E8DCC6] p-2.5 text-xs text-[#1E1A16] focus:outline-none focus:border-[#A67C52]"
                  >
                    <option value="Casablanca">Casablanca</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Rabat">Rabat</option>
                    <option value="Tanger">Tanger</option>
                    <option value="Fès">Fès</option>
                    <option value="Agadir">Agadir</option>
                    <option value="Oujda">Oujda</option>
                  </select>
                </div>

                {/* Account Register Checkbox */}
                {!isClientLoggedIn && (
                  <div className="bg-[#E8DCC6]/20 p-3 rounded-xs border border-[#E8DCC6]/40 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={createAccount}
                        onChange={(e) => setCreateAccount(e.target.checked)}
                        className="rounded-xs border-[#E8DCC6] text-[#A67C52] focus:ring-[#A67C52]"
                      />
                      <span className="text-[11px] font-medium text-[#1E1A16]/90">
                        Créer un compte client et sauvegarder mes données pour mes prochains rituels
                      </span>
                    </label>
                    {createAccount && (
                      <div className="space-y-1">
                        <label className="block text-[8px] uppercase tracking-widest font-bold text-[#A67C52]">Définir un Mot de Passe *</label>
                        <input 
                          type="password"
                          value={accountPassword}
                          onChange={(e) => setAccountPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white border border-[#E8DCC6] p-2 text-xs focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Highly structured, operational payment selection */}
                <div className="space-y-2 pt-2">
                  <span className="block text-[10px] font-bold tracking-widest uppercase text-[#1E1A16]">
                    Choisissez votre méthode de paiement *
                  </span>
                  
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`py-2 text-[9px] font-bold uppercase tracking-wider text-center border transition-all ${
                        paymentMethod === 'cod' 
                          ? 'border-[#A67C52] bg-[#A67C52]/10 text-[#A67C52]' 
                          : 'border-[#E8DCC6] bg-white text-[#1E1A16]/70 hover:border-[#1E1A16]'
                      }`}
                    >
                      À la Livraison
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 text-[9px] font-bold uppercase tracking-wider text-center border transition-all ${
                        paymentMethod === 'card' 
                          ? 'border-[#A67C52] bg-[#A67C52]/10 text-[#A67C52]' 
                          : 'border-[#E8DCC6] bg-white text-[#1E1A16]/70 hover:border-[#1E1A16]'
                      }`}
                    >
                      Carte Bancaire
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transfer')}
                      className={`py-2 text-[9px] font-bold uppercase tracking-wider text-center border transition-all ${
                        paymentMethod === 'transfer' 
                          ? 'border-[#A67C52] bg-[#A67C52]/10 text-[#A67C52]' 
                          : 'border-[#E8DCC6] bg-white text-[#1E1A16]/70 hover:border-[#1E1A16]'
                      }`}
                    >
                      RIB / Virement
                    </button>
                  </div>

                  {/* Payment sub-panels depending on status */}
                  {paymentMethod === 'cod' && (
                    <div className="bg-[#E8DCC6]/20 p-3 rounded-xs text-[10.5px] text-[#A67C52] leading-normal border border-[#E8DCC6]/40">
                      <p><strong>✦ Espèces à la livraison (COD) :</strong> Payez en Dirhams lors de la réception de votre colis par notre transporteur partenaire AMANA / Catoni partout au Maroc.</p>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="bg-[#1E1A16] text-white p-3 rounded-xs border border-[#A67C52]/30 space-y-2.5">
                      <p className="text-[10px] text-[#A67C52] font-bold uppercase tracking-wider">Passerelle de paiement sécurisée Merakya</p>
                      
                      <div className="space-y-2">
                        <div>
                          <input 
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/gi, '').slice(0, 16))}
                            placeholder="Numéro de carte (16 chiffres)"
                            className="w-full bg-[#27231E] text-xs font-mono border border-[#A67C52]/20 p-2 text-white placeholder-gray-500 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/AA"
                            className="w-full bg-[#27231E] text-xs font-mono border border-[#A67C52]/20 p-2 text-white placeholder-gray-500 focus:outline-none"
                          />
                          <input 
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/gi, '').slice(0,3))}
                            placeholder="CVV (3 chiffres)"
                            className="w-full bg-[#27231E] text-xs font-mono border border-[#A67C52]/20 p-2 text-white placeholder-gray-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'transfer' && (
                    <div className="bg-[#E8DCC6]/20 p-3 rounded-xs text-[10.5px] border border-[#E8DCC6]/50 space-y-1.5 text-[#1E1A16]/95">
                      <p className="font-bold text-[#A67C52]">✦ Coordonnées bancaires pour le virement :</p>
                      <p className="font-mono text-[10px] bg-white p-2 border border-[#E8DCC6] rounded-xs select-all">
                        Banque: <strong>CIH Bank Marrakech</strong><br />
                        Bénéficiaire: <strong>Merakya S.A.R.L.</strong><br />
                        RIB: <strong>230 450 0981245678 0012 90</strong>
                      </p>
                      <p className="text-[9.5px] text-[#6B4E2E]">Veuillez envoyer votre preuve de virement par WhatsApp au +212 661-000000 avec votre numéro de commande.</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t border-[#E8DCC6]">
                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="w-1/3 border border-[#1E1A16] text-[#1E1A16] py-3 text-[10px] uppercase font-bold tracking-widest rounded-sm"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 bg-[#1E1A16] text-[#F7F2EB] hover:bg-[#A67C52] py-3 text-[10px] uppercase font-bold tracking-widest rounded-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? "Transaction divine..." : `Payer ${formatPrice(totalAmount, selectedCurrency)} ✦`}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            
            /* Core Cart View */
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              
              {/* Items List */}
              {cart.length === 0 ? (
                <div id="empty-cart-view" className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag className="h-10 w-10 text-[#A67C52]/50" />
                  <div>
                    <h3 className="font-serif text-lg text-[#1E1A16] font-medium">Votre panier est vide</h3>
                    <p className="text-xs text-[#1E1A16]/75 mt-1">Explorez nos merveilleuses huiles et bougies rituelles.</p>
                  </div>
                </div>
              ) : (
                <div id="cart-items-scroller" className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
                  
                  {/* Delivery meter info */}
                  <div className="bg-[#E8DCC6]/40 p-3 rounded-xs text-[11px] text-[#6B4E2E] leading-relaxed border border-[#E8DCC6]">
                    {remainingForFreeShipping > 0 ? (
                      <p>
                        {language === 'EN' ? (
                          <>Add <strong className="font-sans font-bold">{formatPrice(remainingForFreeShipping, selectedCurrency)}</strong> more to get <strong>free delivery</strong> anywhere in Morocco!</>
                        ) : (
                          <>Ajoutez encore <strong className="font-sans font-bold">{formatPrice(remainingForFreeShipping, selectedCurrency)}</strong> pour obtenir la <strong>livraison gratuite</strong> partout au Maroc !</>
                        )}
                      </p>
                    ) : (
                      <p className="text-green-800 font-bold flex items-center gap-1">
                        {language === 'EN' ? "✦ Congratulations! Your order qualifies for free delivery!" : "✦ Félicitations ! Votre commande bénéficie de la livraison gratuite !"}
                      </p>
                    )}
                    <div className="w-full bg-[#F7F2EB] h-1.5 mt-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#A67C52] h-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (totalAmount / freeShippingThreshold) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="divide-y divide-[#E8DCC6]">
                    {cart.map((item) => {
                      const trans = PRODUCT_TRANSLATIONS[item.product.id];
                      const name = language === 'EN' && trans ? trans.nameEn : item.product.name;
                      const categoryTransMap: Record<string, string> = {
                        'BOUGIES RITUELLES': 'RITUAL CANDLES',
                        'SAVONS & SOINS NATURELS': 'SOAPS & NATURAL CARE',
                        'SELS & BAINS ÉNERGÉTIQUES': 'ENERGY BATH & SALTS',
                        'HUILES & ÉLIXIRS BOTANIQUES': 'BOTANICAL OILS & ELIXIRS',
                        'COFFRETS RITUELS': 'RITUAL CHESTS'
                      };
                      const category = language === 'EN' ? (categoryTransMap[item.product.category] || item.product.category) : item.product.category;

                      return (
                        <div key={item.product.id} className="py-4 flex items-center justify-between gap-3">
                          <img 
                            src={item.product.image} 
                            alt={name} 
                            className="w-16 h-16 rounded-xs object-cover border border-[#E8DCC6]"
                            referrerPolicy="no-referrer"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-[14px] text-[#1E1A16] font-semibold truncate">
                              {name}
                            </h4>
                            <span className="text-[10px] text-[#A67C52] tracking-widest block uppercase mt-0.5">
                              {category}
                            </span>
                          <span className="text-xs font-semibold text-[#1E1A16] block mt-1">
                            {formatPrice(item.product.price, selectedCurrency)}
                          </span>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center border border-[#E8DCC6] bg-white rounded-xs">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              className="px-2 py-1 text-xs text-[#1E1A16] hover:text-[#A67C52]"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-semibold text-[#1E1A16]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-1 text-xs text-[#1E1A16] hover:text-[#A67C52]"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                            title="Retirer l'article"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
              )}

              {/* Bottom Totals and Action Checkouts */}
              {cart.length > 0 && (
                <div className="pt-4 border-t border-[#E8DCC6] space-y-4">
                  <div className="flex justify-between text-xs font-bold text-[#1E1A16] uppercase tracking-wider">
                    <span>Frais de port estimation</span>
                    <span>{totalAmount >= freeShippingThreshold ? 'Gratuit' : formatPrice(45, selectedCurrency)}</span>
                  </div>
                  
                  <div className="flex justify-between font-serif text-lg font-bold text-[#1E1A16] border-b border-[#E8DCC6] pb-3">
                    <span>Sous-total</span>
                    <span>{formatPrice(totalAmount, selectedCurrency)}</span>
                  </div>

                  <button
                    id="btn-trigger-checkout"
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-[#1E1A16] text-[#F7F2EB] hover:bg-[#A67C52] py-4 rounded-sm text-xs font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
                  >
                    Passer la commande ➔
                  </button>

                  <p className="text-[10px] text-center text-[#1E1A16]/60 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-green-700" />
                    Paiement cash à la réception garanti par Merakya Maroc.
                  </p>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
