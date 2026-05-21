import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Play, Pause, Volume2, VolumeX, Heart, Share2, ShoppingBag, X, Instagram, ExternalLink, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface Reel {
  id: string;
  titleFr: string;
  titleEn: string;
  subtitleFr: string;
  subtitleEn: string;
  videoUrl: string;
  associatedProductId: string;
  likes: number;
}

interface RitualReelsProps {
  language: 'FR' | 'EN';
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function RitualReels({ language, products, onAddToCart }: RitualReelsProps) {
  const [activeReel, setActiveReel] = useState<Reel | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [likedReels, setLikedReels] = useState<string[]>([]);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const REELS: Reel[] = [
    {
      id: 'reel-1',
      titleFr: 'Coulage Sacré à l\'Atelier',
      titleEn: 'Sacred Pouring at the Atelier',
      subtitleFr: 'Nos bougies d\'intention sont coulées à la main une à une pendant la Lune Croissante.',
      subtitleEn: 'Our intention candles are hand-poured one by one during the Waxing Moon.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-melted-wax-into-glass-jars-43105-large.mp4',
      associatedProductId: 'bougie-abondance',
      likes: 312
    },
    {
      id: 'reel-2',
      titleFr: 'Distillation d\'Or Botanique',
      titleEn: 'Botanical Gold Distillation',
      subtitleFr: 'Concentré de plantes sacrales de l\'Atlas et de figue de barbarie rare aromatisé à la camomille.',
      subtitleEn: 'Rich concentrate of Atlas sacral botanicals and rare prickly pear flavored with chamomile.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-essential-oil-into-a-jar-43111-large.mp4',
      associatedProductId: 'huile-botanique-nuit',
      likes: 247
    },
    {
      id: 'reel-3',
      titleFr: 'Sagesse des Fleurs de l\'Atlas',
      titleEn: 'Atlas Flower Wisdom',
      subtitleFr: 'Sélection et séchage lent de nos boutons de rose de Kelâat M\'gouna hautement vibratoires.',
      subtitleEn: 'Selection and slow drying of our highly vibrational Kelâat M\'gouna rosebuds.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-herbalist-sorting-dried-lavender-flowers-43113-large.mp4',
      associatedProductId: 'bougie-rose-damas',
      likes: 418
    },
    {
      id: 'reel-4',
      titleFr: 'Alchimie des Bains d\'Aura',
      titleEn: 'Aura Bath Alchemy',
      subtitleFr: 'Synergie apaisante de fleurs sauvages biologiques infusant dans nos sels de l\'Himalaya.',
      subtitleEn: 'Soothing synergy of organic wild flowers infusing into our Himalayan pink salts.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-herbs-and-flowers-in-water-43110-large.mp4',
      associatedProductId: 'sels-purification',
      likes: 295
    }
  ];

  // Disable body scroll when modal is active, and reset states
  useEffect(() => {
    if (activeReel) {
      document.body.style.overflow = 'hidden';
      setVideoError(false);
      setIsPlaying(true);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeReel]);

  useEffect(() => {
    if (videoRef.current && !videoError) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, activeReel, videoError]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleLike = (reelId: string) => {
    if (likedReels.includes(reelId)) {
      setLikedReels(likedReels.filter(id => id !== reelId));
    } else {
      setLikedReels([...likedReels, reelId]);
    }
  };

  const handleShare = (reel: Reel) => {
    navigator.clipboard.writeText(`https://www.instagram.com/merakya_alchemy/`);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2500);
  };

  const currentProduct = activeReel 
    ? products.find(p => p.id === activeReel.associatedProductId) 
    : null;

  return (
    <div className="space-y-8" id="sensory-cinema-hub">
      {/* Mini Segment Header */}
      <div className="text-center space-y-2">
        <span className="text-[10px] tracking-[0.3em] font-extrabold text-[#A67C52] uppercase block">
          {language === 'EN' ? "✦ ATELIER SENSORY MOTION ✦" : "✦ LES RITUELS SENSORIELS EN MOUVEMENT ✦"}
        </span>
        <h2 className="font-serif text-2xl md:text-3.5xl text-[#1E1A16] font-normal tracking-wide">
          {language === 'EN' ? "Cinematic Ritual Reels" : "Le Cinéma Sacré Merakya"}
        </h2>
        <p className="text-xs text-[#1E1A16]/60 font-serif italic max-w-lg mx-auto">
          {language === 'EN' 
            ? "Witness the slow craft of our botanical creations directly from our Instagram @merakya_alchemy."
            : "Contemplez le geste lent de nos rituels et l'alchimie de nos formulations capturés à l'Atelier."}
        </p>
        <div className="flex items-center justify-center gap-2 pt-1">
          <div className="w-8 h-[1px] bg-[#A67C52]/35" />
          <span className="text-[#A67C52] text-[9px]">✦</span>
          <div className="w-8 h-[1px] bg-[#A67C52]/35" />
        </div>
      </div>

      {/* Reels Row Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-1">
        {REELS.map((reel) => {
          const isLiked = likedReels.includes(reel.id);
          const product = products.find(p => p.id === reel.associatedProductId);
          const posterImage = product ? product.image : undefined;

          return (
            <div 
              key={reel.id}
              onClick={() => {
                setActiveReel(reel);
                setIsPlaying(true);
              }}
              className="group relative aspect-[9/16] rounded-md overflow-hidden bg-[#1E1A16] cursor-pointer shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Fallback & Portrait Underlay: Beautiful high-definition product image */}
              {posterImage && (
                <img 
                  src={posterImage} 
                  alt={reel.titleFr}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-30 transition-all duration-700 z-0"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Sophisticated warm dark overlay to maximize text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/25 to-stone-950/40 z-10 transition-opacity duration-300 group-hover:from-stone-950/95" />

              {/* Background Video Preview (Starts playing instantly on hover or loads behind poster) */}
              <video 
                src={reel.videoUrl}
                muted
                loop
                playsInline
                preload="auto"
                poster={posterImage}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-85 transition-opacity duration-700 z-5"
                onMouseEnter={(e) => {
                  const playPromise = (e.target as HTMLVideoElement).play();
                  if (playPromise !== undefined) {
                    playPromise.catch(() => {});
                  }
                }}
                onMouseLeave={(e) => {
                  const v = e.target as HTMLVideoElement;
                  v.pause();
                  v.currentTime = 0;
                }}
              />

              {/* Animated Floating play indicator in the center to invite attention */}
              <div className="absolute inset-0 flex items-center justify-center z-15 opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="p-3.5 rounded-full bg-black/40 backdrop-blur-md border border-[#E8DCC6]/20 group-hover:scale-110 group-hover:bg-[#A67C52] group-hover:text-white group-hover:border-transparent transition-all duration-500 shadow-md">
                  <Play className="h-4.5 w-4.5 text-[#E8DCC6] fill-current" />
                </div>
              </div>

              {/* Instagram Emblem Tag */}
              <div className="absolute top-4 left-4 bg-black/65 backdrop-blur-md py-1 px-2.5 rounded-full text-[9px] text-[#E8DCC6] font-mono flex items-center gap-1.5 z-20 border border-[#E8DCC6]/10">
                <Instagram className="h-3 w-3 text-[#A67C52]" />
                @merakya_alchemy
              </div>

              {/* Video Bottom Overlay Text */}
              <div className="absolute inset-x-0 bottom-0 p-4.5 flex flex-col justify-end text-left pt-16 space-y-1.5 z-20">
                <span className="text-[9px] text-[#A67C52] tracking-widest font-extrabold uppercase">
                  {language === 'EN' ? 'MRAKYA LAB •' : 'MERAKYA LAB ✦'}
                </span>
                <h4 className="font-serif text-sm text-[#F7F2EB] font-normal leading-snug group-hover:text-[#E8DCC6] duration-300">
                  {language === 'EN' ? reel.titleEn : reel.titleFr}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-[#E8DCC6]/85 pt-2.5 border-t border-[#E8DCC6]/10">
                  <span className="flex items-center gap-1 font-mono hover:text-[#A67C52] transition-colors">
                    <Play className="h-2.5 w-2.5 fill-current text-[#A67C52]" />
                    {language === 'EN' ? 'Watch ritual' : 'Regarder'}
                  </span>
                  <span className="flex items-center gap-1 font-mono hover:text-red-400 transition-colors" onClick={(e) => { e.stopPropagation(); handleLike(reel.id); }}>
                    <Heart className={`h-3 w-3 transition-transform duration-300 active:scale-130 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    {reel.likes + (isLiked ? 1 : 0)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cinematic Modal Player rendered via createPortal */}
      {activeReel && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in antialiased">
          {/* Main Modal Box: Perfectly constrained to avoiding any scrolling */}
          <div className="relative flex flex-col md:flex-row w-full max-w-4xl bg-[#1E1A16] border border-[#A67C52]/40 rounded-sm overflow-hidden shadow-2xl max-h-[92vh] md:h-[580px]">
            
            {/* Close Trigger Button */}
            <button 
              onClick={() => { setActiveReel(null); setIsPlaying(false); }}
              className="absolute top-4 right-4 z-50 p-2 text-[#E8DCC6] hover:text-[#A67C52] transition-colors bg-black/75 backdrop-blur-md rounded-full border border-white/10 hover:scale-105 active:scale-95 duration-200 cursor-pointer"
              title={language === 'EN' ? 'Close' : 'Fermer'}
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Left Box: Fully Featured Video Player or Elegant Live Instagram Fallback */}
            <div className="relative flex-1 bg-[#151210] flex items-center justify-center overflow-hidden h-[35vh] md:h-full group/player">
              
              {/* Beautiful ambient ambient background underlay inside the player */}
              {currentProduct && (
                <img 
                  src={currentProduct.image} 
                  alt={activeReel.titleFr}
                  className="absolute inset-0 w-full h-full object-cover opacity-35 filter blur-lg scale-110 pointer-events-none transition-opacity duration-700"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Sophisticated dark radial vignette overlay */}
              <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none z-10" />

              {!videoError ? (
                <video 
                  ref={videoRef}
                  src={activeReel.videoUrl}
                  loop
                  playsInline
                  autoPlay
                  muted={isMuted}
                  poster={currentProduct?.image}
                  className="relative w-full h-full object-contain z-10 mx-auto"
                  onClick={togglePlay}
                  onError={() => {
                    console.log("Iframe/Browser blocked external video loop. Launching interactive gorgeous fallback.");
                    setVideoError(true);
                  }}
                />
              ) : (
                /* High-fidelity visual fallback designed specifically for secure sandboxed environments */
                <div 
                  onClick={() => window.open('https://www.instagram.com/merakya_alchemy/', '_blank')}
                  className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center z-20 cursor-pointer select-none bg-stone-950/70 backdrop-blur-xs group/fallback hover:bg-stone-950/80 transition-colors duration-500"
                >
                  <div className="absolute inset-4 border border-[#A67C52]/20 rounded-xs pointer-events-none group-hover/fallback:border-[#A67C52]/45 transition-colors duration-500" />
                  
                  {/* Glowing Animated Instagram Alchemy Ring */}
                  <div className="relative mb-5 transition-transform duration-500 group-hover/fallback:scale-105">
                    <div className="absolute inset-0 rounded-full bg-[#A67C52]/20 blur-xl animate-pulse" />
                    <div className="relative p-5 rounded-full bg-[#1E1A16] border border-[#A67C52]/50 shadow-xl flex items-center justify-center">
                      <Instagram className="h-8 w-8 text-[#A67C52] animate-spin-slow" />
                      <Play className="h-4 w-4 text-[#E8DCC6] fill-current absolute top-4 right-4 animate-bounce" />
                    </div>
                  </div>

                  <span className="text-[10px] tracking-[0.2em] font-extrabold text-[#A67C52] uppercase block mb-2">
                    {language === 'EN' ? "✦ WATCH RITUAL LIVE ✦" : "✦ VOIR LE RITUEL EN DIRECT ✦"}
                  </span>
                  
                  <h4 className="font-serif text-lg text-[#F7F2EB] font-normal leading-tight max-w-sm mb-3">
                    {language === 'EN' ? "Discover the high-fidelity video on Instagram" : "Découvrez la vidéo originelle sur Instagram"}
                  </h4>
                  
                  <p className="text-[11px] text-[#E8DCC6]/60 font-serif italic max-w-xs leading-relaxed mb-6">
                    {language === 'EN' 
                      ? "Your browser's security blocks inline clips. Watch the authentic slow-craft video on our official reels page."
                      : "La sécurité de votre navigateur restreint les flux externes. Assistez au geste authentique directement sur nos réels."}
                  </p>

                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A67C52] text-white hover:bg-[#C9A37C] text-xs uppercase tracking-widest font-bold rounded-xs transition-all duration-300 shadow-md transform group-hover/fallback:translate-y-[-2px]">
                    <Instagram className="h-4 w-4" />
                    <span>{language === 'EN' ? "Regarder sur Instagram" : "Prêts à contempler"}</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                  </div>
                </div>
              )}

              {/* Shadow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none z-10" />

              {/* Floating Aesthetic Video Controls (Hidden if video error active) */}
              {!videoError && (
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between z-20">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={togglePlay}
                      className="p-2.5 bg-[#A67C52] text-white rounded-full hover:bg-[#E8DCC6] hover:text-[#1E1A16] duration-300 transition-all shadow-lg shadow-[#A67C52]/20 cursor-pointer"
                    >
                      {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                    </button>
                    <button 
                      onClick={toggleMute}
                      className="p-2 bg-black/60 text-[#E8DCC6] rounded-full hover:bg-black/80 hover:text-white duration-300 backdrop-blur-xs cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  <a 
                    href="https://www.instagram.com/merakya_alchemy/"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-black/65 hover:bg-black/80 duration-300 border border-[#A67C52]/30 backdrop-blur-md py-1.5 px-3.5 rounded-full text-[9px] text-[#A67C52] tracking-wider font-mono flex items-center gap-2 cursor-pointer"
                  >
                    <Instagram className="h-3 w-3 animate-pulse" />
                    <span>{language === 'EN' ? "Watch original details" : "Regarder l'original ✦"}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Right Box: Alchemical description & Connected item purchase */}
            <div className="w-full md:w-[340px] shrink-0 bg-[#1E1A16] text-[#F7F2EB] p-6 flex flex-col justify-between overflow-y-auto border-t md:border-t-0 md:border-l border-[#A67C52]/10 space-y-6 h-[55vh] md:h-full font-sans">
              
              <div className="space-y-5 text-left">
                {/* Brand / Instagram watermark */}
                <div className="flex items-center justify-between pb-3 border-b border-[#A67C52]/10">
                  <a 
                    href="https://www.instagram.com/merakya_alchemy/"
                    target="_blank"
                    rel="noreferrer" 
                    className="flex items-center gap-2.5 group/brand cursor-pointer"
                  >
                    <div className="p-1.5 bg-[#A67C52]/15 rounded-full text-[#A67C52] border border-[#A67C52]/20 group-hover/brand:bg-[#A67C52]/20 group-hover/brand:text-white transition-all duration-300">
                      <Instagram className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="font-mono text-xs font-bold tracking-wider text-[#A67C52] group-hover/brand:text-[#E8DCC6] transition-colors">@merakya_alchemy</h5>
                      <span className="text-[9px] text-[#E8DCC6]/40 flex items-center gap-1">
                        Atelier Haute Alchimie <Sparkles className="h-2 w-2 text-[#A67C52]/60" />
                      </span>
                    </div>
                  </a>

                  {/* External Redirection link */}
                  <a 
                    href="https://www.instagram.com/merakya_alchemy/"
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-[#E8DCC6]/60 hover:text-[#A67C52] hover:bg-white/5 rounded-full transition-colors duration-200"
                    title={language === 'EN' ? "Open Instagram profile" : "Ouvrir le profil Instagram"}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <div className="space-y-2.5">
                  <h3 className="font-serif text-lg sm:text-xl text-[#E8DCC6] font-normal leading-tight">
                    {language === 'EN' ? activeReel.titleEn : activeReel.titleFr}
                  </h3>
                  <p className="text-xs text-[#E8DCC6]/80 leading-relaxed font-light font-serif italic">
                    {language === 'EN' ? activeReel.subtitleEn : activeReel.subtitleFr}
                  </p>
                </div>

                {/* Micro interactivity options */}
                <div className="flex gap-2.5 pt-1">
                  <button 
                    onClick={() => handleLike(activeReel.id)}
                    className="flex-1 border border-[#A67C52]/25 hover:border-[#A67C52]/50 hover:bg-[#A67C52]/10 duration-300 py-2 rounded-xs flex items-center justify-center gap-2 text-[11px] font-semibold text-[#E8DCC6] cursor-pointer"
                  >
                    <Heart className={`h-3.5 w-3.5 text-[#A67C52] transition-colors ${likedReels.includes(activeReel.id) ? 'fill-[#A67C52]' : ''}`} />
                    <span>{likesCount(activeReel.id)} {language === 'EN' ? 'Likes' : 'J\'aime'}</span>
                  </button>
                  <button 
                    onClick={() => handleShare(activeReel)}
                    className="flex-1 border border-[#A67C52]/25 hover:border-[#A67C52]/50 hover:bg-[#A67C52]/10 duration-300 py-2 rounded-xs flex items-center justify-center gap-2 text-[11px] font-semibold text-[#E8DCC6] cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5 text-[#A67C52]" />
                    <span>{shareSuccess ? (language === 'EN' ? 'Copied!' : 'Copié !') : (language === 'EN' ? 'Share' : 'Partager')}</span>
                  </button>
                </div>
              </div>

              {/* Connected product quick shoppable container */}
              <div className="space-y-3.5 text-left pt-5 border-t border-[#A67C52]/10">
                <span className="text-[9px] tracking-widest font-extrabold text-[#A67C52] uppercase block">
                  {language === 'EN' ? "✦ SHOP RITUAL INGREDIENTS" : "✦ LES ACCESSOIRES DU RITUEL"}
                </span>

                {currentProduct ? (
                  <div className="bg-[#FAF6F0]/5 border border-[#A67C52]/20 rounded-xs p-3.5 flex gap-3 items-center hover:bg-[#FAF6F0]/10 transition-colors duration-300">
                    <img 
                      src={currentProduct.image} 
                      alt={currentProduct.name} 
                      className="w-12 h-12 object-cover rounded-xs border border-[#E8DCC6]/10 shrink-0 bg-white/5"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-serif text-[11px] font-bold text-white tracking-wide truncate">
                        {currentProduct.name}
                      </h4>
                      <p className="text-[10px] text-[#A67C52] font-semibold">
                        {currentProduct.compareAtPrice && (
                          <span className="line-through text-stone-500 mr-2">
                            {currentProduct.compareAtPrice} DH
                          </span>
                        )}
                        {currentProduct.price} DH
                      </p>

                      <button 
                        onClick={() => {
                          onAddToCart(currentProduct);
                        }}
                        className="text-[9px] uppercase tracking-wider font-extrabold text-[#A67C52] hover:text-[#E8DCC6] transition-colors flex items-center gap-1 mt-0.5 font-sans cursor-pointer"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        {language === 'EN' ? "Collect Ritual" : "Ajouter au Panier ✦"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-[#E8DCC6]/40 italic">
                    {language === 'EN' ? "Apothecary oils matching in production." : "Préparations botaniques complémentaires..."}
                  </p>
                )}

                <div className="text-[8.5px] text-[#E8DCC6]/45 leading-relaxed">
                  {language === 'EN' 
                    ? "Orders packages verified, blessed, and dispatched from Marrakech within 24 hours. Complies with premium ecological norms."
                    : "Colis préparés avec dévotion, livrés au Maroc sous 24h à 48h. Emballages de soie sacrale biodégradables."}
                </div>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );

  function likesCount(id: string) {
    const r = REELS.find(x => x.id === id);
    if (!r) return 0;
    return r.likes + (likedReels.includes(id) ? 1 : 0);
  }
}
