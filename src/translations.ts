export type Language = 'FR' | 'EN';

export const translations = {
  FR: {
    // navbar
    nav_home: "ACCUEIL",
    nav_shop: "BOUTIQUE",
    nav_rituels: "RITUELS",
    nav_journal: "JOURNAL",
    nav_story: "NOTRE HISTOIRE",
    nav_contact: "CONTACT",
    nav_pro: "Espace Pro",
    nav_admin: "Admin",
    nav_search: "Rechercher des produits",
    nav_cart: "Panier",
    nav_currency: "DEVISE:",
    nav_lang: "LANGUE:",

    // header ticker
    ticker: "✦ LIVRAISON OFFERTE DÈS 400 DH AU MAROC ✦ INSPIRÉ DES RITUELS ANCESTRAUX ET SACRÉS ✦ SAVONS, BOUGIES ET ÉLIXIRS 100% NATURELS ✦ ARTISANAT MAROCAIN ÉTHIQUE ET FAIT MAIN",

    // motto or subtext
    subtext: "HAUTE ALCHIMIE BOTANIQUE",
    signature: "Quand l'âme inspire la matière",

    // home hero
    hero_title: "L'Alchimie de la Nature et des Intentions Sacrées",
    hero_subtitle: "Des créations rituelles uniques d’apothicaire façonnées à la main pour le corps, l'esprit et l'âme.",
    hero_explore: "DÉCOUVRIR LE CATALOGUE ✦",
    hero_story: "NOTRE PHILOSOPHIE ✦",

    // home values
    value_nature_title: "100% ORGANIQUE",
    value_nature_desc: "Plantes sauvages & argiles pures du Maroc",
    value_altruism_title: "ARTISANAL ÉTHIQUE",
    value_altruism_desc: "Fait main avec amour et conscience",
    value_energy_title: "VIBRATIONS SACRÉES",
    value_energy_desc: "Pierres fines & intentions positives",
    value_coop_title: "COOPÉRATIVE DIRECTE",
    value_coop_desc: "Soutien direct aux femmes du Haut-Atlas",

    // collections title
    collections_title: "Nos Collections Sacrées",
    collections_subtitle: "✦ L’ART DE L’APOTHICAIRE ✦",

    // home philosophy
    phil_kicker: "✦ NOTRE ENGAGEMENT RITUEL",
    phil_title: "Une union vertueuse entre cosmétique d'exception et spiritualité",
    phil_desc1: "Merakya est née d'une amitié profonde entre deux âmes passionnées de rituels et de sagesse herboriste traditionnelle du Maroc. Pensé comme un laboratoire d'éveil sensoriel, chaque formule est un pont suspendu entre l'or doux de l'Atlas (argile rouge, figue de barbarie sauvage, huile d'argan noble) et les vibrations pures de l'ésotérisme (cristaux de roche, phases lunaires bénéfiques, méditation d'intentions).",
    phil_desc2: "Nous croyons au pouvoir du geste lent. Nos bougies rituelles coulées dans des pots peints à la main par des potières de Safi et nos pains de savon sculptés en roses de Damas ne sont pas de simples produits : ce sont des invitations à sanctuariser votre quotidien.",
    phil_more: "Explorer notre manifeste ✦",

    // boutique
    boutique_title: "La Boutique Sacrée",
    boutique_subtitle: "Chaque produit est infusé de pensées pures et formulé à partir de matières premières récoltées dans le respect de la Terre mère.",
    boutique_search_placeholder: "Filtrez ou recherchez un ingrédient, une pierre fine...",
    boutique_all: "TOUS",
    boutique_add_to_cart: "Ajouter au panier",
    boutique_no_products: "Aucun rituel ne correspond à votre recherche.",
    boutique_ingredients: "Ingrédients sacrés ",
    boutique_details: "Détails du produit",
    boutique_back_to_shop: "Retour à la boutique",
    filter_price: "Filtre par Prix",
    filter_price_max: "Prix Max :",
    filter_availability: "Disponibilité",
    filter_all: "Tous les produits",
    filter_in_stock: "En Stock uniquement",
    filter_out_of_stock: "Rupture de stock uniquement",
    badge_out_of_stock: "Rupture",
    badge_in_stock: "En Stock",

    // rituels
    rituels_title: "Sanctuaire de l'Esprit",
    rituels_subtitle: "Infusez votre quotidien de gestes sacrés. L'art de ritualiser le bain, la flamme et l'intention.",
    rituels_desc: "Le soin de la peau n’est que la surface d’un voyage bien plus profond. Lorsque vous allumez une cire de soja Merakya ou massez votre visage avec notre élixir de nuit, vous scellez un rituel de reconnexion intime.",
    rituels_ritual1_title: "Le Rituel de Purification et de Protection (Nouveau Départ)",
    rituels_ritual1_step1: "Libérer l'Espace : Allumez votre sauge ou l'encens de vos Sels de Bain Purification. Laissez la fumée légère chasser les ondes stationnaires lourdes de la pièce.",
    rituels_ritual1_step2: "Le Bain d'Aura : Versez trois poignées de Sels sacrés Purification dans l'eau tiède. Plongez-vous-y pendant 20 minutes en fermant les yeux. Visualisez toute fatigue glisser dans l'onde.",
    rituels_ritual1_step3: "La Protection Céleste : Après vous être enveloppé de lin, massez doucement votre corps. Allumez la bougie Mauvais Œil pour parfaire votre bulle de sérénité.",
    rituels_ritual2_title: "Le Rituel d'Abondance et d'Amour de soi (Reconnexion)",
    rituels_ritual2_step1: "L'Intention Lumineuse : Prenez la bougie Rituelle Abondance. Tenez-la contre votre plexus solaire, fermez les yeux et murmurez vos souhaits de joie et d'harmonie pour votre foyer, puis allumez-la.",
    rituels_ritual2_step2: "La Caresse Divine : Utilisez le Savon Sculpté Rose Divine sous la douche pour nettoyer votre peau et votre mental des pensées limitantes de la journée.",
    rituels_ritual2_step3: "L'Onction Étoilée : Déposez trois gouttes d'Élixir d'Étoiles sur vos paumes, frottez-les énergiquement pour libérer les molécules aromatiques de camomille divine et massez votre visage.",

    // journal
    journal_title: "Les Chroniques & Presse",
    journal_subtitle: "Sagesse ésotérique traditionnelle, secrets d'herboristerie sacrée du Maroc, calendriers lunaires et revues de presse d'exception.",
    journal_all: "Tous les écrits",
    journal_chroniques: "Sagesse & Rituels l’Atelier",
    journal_presse: "La Presse en Parle (Revues)",
    journal_read_more: "Lire l'article complet ✦",
    journal_back: "← Retour aux Chroniques & Presse",
    journal_reading_time: "de lecture",
    journal_by: "Par",
    journal_related: "Vous aimerez aussi",
    journal_discover_shop: "Découvrir la Boutique",
    journal_back_main: "Retour au Journal",
    journal_empty: "Aucune publication dans cette rubrique pour le moment.",
    journal_writing: "L'écriture de nos secrets est en cours...",

    // notre histoire
    story_title: "L’Origine de Merakya",
    story_subtitle: "L’histoire d’une rencontre entre deux mondes, deux cultures et une même passion.",
    story_kicker: "✦ DE LA TERRE AU CŒUR",
    story_p1: "Merakya est avant tout l’histoire de deux amis de longue date, liés par des valeurs communes et par une même envie : créer quelque chose qui ait du sens. Une envie née du désir de réunir deux univers, deux cultures et deux regards différents sur le monde afin d’en faire une seule et même identité.",
    story_p2: "De cette rencontre est née une vision : créer une ligne de produits 100 % naturels où l’authenticité des traditions artisanales marocaines dialogue avec les inspirations et les richesses venues d’ailleurs. Une fusion pensée comme un pont entre héritage et ouverture, entre savoir-faire ancestral et influences du monde.",
    story_p3: "Au cœur de Merakya vivent les trésors que la nature offre depuis des générations : huiles précieuses, plantes aux vertus reconnues, matières nobles et ingrédients soigneusement sélectionnés. Chaque création est réalisée avec exigence et passion, dans le respect des méthodes artisanales qui font la richesse de la culture marocaine.",
    story_p4: "Nos bougies sont coulées à la main en petites séries, tandis que nos savons premium sont élaborés selon un procédé traditionnel de saponification à froid permettant de préserver toute la qualité et les bienfaits naturels des ingrédients utilisés.",
    story_p5: "Pour nous, Merakya est bien plus qu’une marque. C’est une histoire d’amitié, de transmission et de partage. Une invitation à découvrir des créations où chaque détail porte une intention : celle de rapprocher les cultures, valoriser l’artisanat et célébrer la beauté du naturel.",
    story_p6: "Parce que lorsque deux mondes se rencontrent avec passion et authenticité, ils créent quelque chose d’unique.",

    // contact
    contact_title: "Prendre Contact",
    contact_subtitle: "Pour toute question, commande personnalisée, partenariat, ou simplement pour partager une pensée lumineuse.",
    contact_info: "Informations de l'Atelier",
    contact_address: "Atelier Merakya, Quartier Historique, Casablanca, Maroc",
    contact_email_lbl: "Email officiel : ",
    contact_tel_lbl: "Téléphone : ",
    contact_form_title: "Écrire une intention ou demande",
    contact_name: "Nom complet / Identité",
    contact_email_field: "Adresse E-mail",
    contact_msg: "Votre message ou question rituelle",
    contact_send: "ENVOYER LA PENSEE AUX ETOILES ✦",
    contact_success_msg: "✨ Votre message a été envoyé avec succès de manière pure et lumineuse ! Notre équipe vous répondra sous 24h.",

    // cart
    cart_title: "Votre Panier Sacré",
    cart_empty: "Votre panier est actuellement vide d'intentions.",
    cart_price: "Prix unitaire",
    cart_total_p: "Total partiel",
    cart_delivery_alert: "🚚 Plus que {diff} pour obtenir la livraison gratuite au Maroc !",
    cart_delivery_free: "🎉 Félicitations ! Vous bénéficiez de la LIVRAISON GRATUITE.",
    cart_delivery_fixed: "Livraison fixe Maroc : 35 DH",
    cart_checkout: "Valider ma commande",
    cart_back: "Continuer les achats",

    // help links footer
    help_delivery: "Livraison et Tarifs (Maroc & International)",
    help_payment: "Paiement et Livraison",
    help_returns: "Retours & Échanges sous 14 jours",
    help_cgv: "Conditions de Vente Générales",
    help_privacy: "Politique de Confidentialité",

    // footer
    footer_rights: "Tous droits réservés. Infusé d'intentions.",
    footer_motto: "L’art d’unir la nature, les traditions ancestrales et l’alchimie du cœur pour des rituels qui éveillent le corps, l’âme et l’esprit.",

    // auth modal
    auth_title_sacred: "Votre Espace Sacré",
    auth_title_member: "Espace Membre Merakya",
    auth_kicker: "Rejoignez l'univers de l'Alchimie Bien-être",
    auth_tab_signin: "Se Connecter",
    auth_tab_signup: "Créer un Compte",
    auth_email_lbl: "Adresse Email",
    auth_pword_lbl: "Mot de Passe",
    auth_btn_signin: "Se Connecter au Temple ✦",
    auth_name_lbl: "Nom Complet *",
    auth_phone_lbl: "Téléphone",
    auth_city_lbl: "Ville",
    auth_pword_create_lbl: "Créez votre Mot de Passe *",
    auth_btn_signup: "Initier mon Compte Sacré ✦",
    auth_personal_initiated: "Rituel personnel initié :",
    auth_city_prefix: "Ville :",
    auth_member_since: "Membre depuis le :",
    auth_tracking_title: "📦 Suivi de Commande en cours",
    auth_tracking_desc: "Aucune transaction externe en cours de préparation logistique. Vos rituels s'organisent au laboratoire.",
    auth_btn_logout: "Quitter",
    auth_btn_continue: "Continuer",
    auth_admin_lbl: "Administrateur de la marque ?",
    auth_btn_admin: "Accéder à l'Espace Pro ✦",
    auth_validation_required: "Veuillez remplir les champs obligatoires.",
    auth_email_exists: "Un compte existe déjà avec cette adresse email.",
    auth_success_signup: "✨ Votre compte sacré Merakya a été créé avec succès !",
    auth_success_signin: "✨ Connexion divine établie.",
    auth_error_credentials: "Identifiants incorrects. Veuillez réessayer.",

    // newsletter
    news_kicker: "REJOIGNEZ L'UNIVERS MERAKYA",
    news_title: "Recevez nos rituels et inspirations",
    news_desc: "Conseils bien-être, rituels lunaires de pleine lune, nouveautés et offres exclusives de l'atelier.",
    news_success: "✦ Bienvenue parmi les initiés de l'univers Merakya ! Votre adresse a été enregistrée.",
    news_placeholder: "Votre adresse email",
    news_btn: "S'inscrire",

    // testimonials
    test_kicker: "✦ ILS NOUS FONT CONFIANCE",
    test_title: "Témoignages de notre communauté"
  },
  EN: {
    // navbar
    nav_home: "HOME",
    nav_shop: "BOUTIQUE",
    nav_rituels: "RITUALS",
    nav_journal: "JOURNAL",
    nav_story: "OUR STORY",
    nav_contact: "CONTACT",
    nav_pro: "Pro Space",
    nav_admin: "Admin",
    nav_search: "Search for products",
    nav_cart: "Cart",
    nav_currency: "CURRENCY:",
    nav_lang: "LANGUAGE:",

    // header ticker
    ticker: "✦ FREE SHIPPING ABOVE 400 DH IN MOROCCO ✦ INSPIRED BY ANCESTRAL AND SACRED RITUALS ✦ 100% NATURAL SOAPS, CANDLES AND ELIXIRS ✦ ETHICAL AND HANDMADE MOROCCAN CRAFTSMANSHIP",

    // motto or subtext
    subtext: "HAUTE BOTANICAL ALCHEMY",
    signature: "When soul inspires matter",

    // home hero
    hero_title: "The Alchemy of Nature and Sacred Intentions",
    hero_subtitle: "Unique handmade apothecary ritual creations carefully crafted for body, mind, and soul.",
    hero_explore: "DISCOVER THE CATALOGUE ✦",
    hero_story: "OUR PHILOSOPHY ✦",

    // home values
    value_nature_title: "100% ORGANIC",
    value_nature_desc: "Wild plants & pure clays from Morocco",
    value_altruism_title: "ETHICAL CRAFT",
    value_altruism_desc: "Handcrafted with love and mindfulness",
    value_energy_title: "SACRED VIBRATIONS",
    value_energy_desc: "Fine gems & matching positive intentions",
    value_coop_title: "DIRECT COOPERATIVE",
    value_coop_desc: "Direct support for Atlas mountain craftswomen",

    // collections title
    collections_title: "Our Sacred Collections",
    collections_subtitle: "✦ THE APOTHECARY’S ART ✦",

    // home philosophy
    phil_kicker: "✦ OUR SACRED VOW",
    phil_title: "A virtuous union of exceptional cosmetics and spiritual wellness",
    phil_desc1: "Merakya was born from a deep friendship between two souls passionate about ancient Moroccan herbalism and energy healing. Conceived as a laboratory for sensory awakening, each formula bridges the golden bounty of the Atlas mountains (red clay, wild prickly pear oil, noble argan oil) and the pure vibrations of esotericism (clear quartz crystals, supportive lunar phases, mindfulness intentions).",
    phil_desc2: "We believe in the power of slow living. Our ritual candles poured in Safi ceramic vessels painted by hand, and our sculpted Damask Rose soaps are not merely products—they are invitations to make your daily routine a sacred sanctuary.",
    phil_more: "Explore our manifesto ✦",

    // boutique
    boutique_title: "The Sacred Shop",
    boutique_subtitle: "Each creation is infused with pure thoughts and formulated with raw botanical treasures harvested in harmony with Mother Earth.",
    boutique_search_placeholder: "Filter or search by ingredient, crystal name...",
    boutique_all: "ALL",
    boutique_add_to_cart: "Add to cart",
    boutique_no_products: "No rituals matched your search parameters.",
    boutique_ingredients: "Sacred ingredients ",
    boutique_details: "Product Details",
    boutique_back_to_shop: "Back to boutique",
    filter_price: "Price Filter",
    filter_price_max: "Max Price:",
    filter_availability: "Availability",
    filter_all: "All Products",
    filter_in_stock: "In Stock only",
    filter_out_of_stock: "Out of Stock only",
    badge_out_of_stock: "sold out",
    badge_in_stock: "In Stock",

    // rituels
    rituels_title: "Sanctuary of the Spirit",
    rituels_subtitle: "Infuse your daily life with sacred touch. The high art of bath, flame, and deep intention.",
    rituels_desc: "Skincare is merely the skin-deep surface of a much deeper, mystical journey. When you ignite a Merakya soy candle or massage your face with our botanic night elixir, you seal a deeply personal ritual of reconnection.",
    rituels_ritual1_title: "The Protection & Purification Ritual (New Beginnings)",
    rituels_ritual1_step1: "Cleansing the space: Burn sacred sage or let the incense from your Purification Salts diffuse. Let the light woodsmoke clear away any negative stagnant energy from the room.",
    rituels_ritual1_step2: "The Aura Bath: Scatter three generous handfuls of natural Purification Bath Salts into warm bath water. Immerse yourself for 20 mindful minutes with eyes closed, visualizing fatigue melting away.",
    rituels_ritual1_step3: "Celestial Protection: After wrapping yourself in clean linen, gently massage your skin. Light the mystical Evil Eye candle to seal your sanctuary of protection.",
    rituels_ritual2_title: "The Abundance & Self-Love Ritual (Realignment)",
    rituels_ritual2_step1: "Pure Intentions: Hold the Abundance Ritual Candle against your solar plexus. Close your eyes and whisper your dreams of joy, prosperity, and peace into the wax, then light the wick.",
    rituels_ritual2_step2: "Divine Touch: Cleanse your body and mind with the sculpted Rose Divine Soap in the shower to wash away any heavy cognitive limits from the day.",
    rituels_ritual2_step3: "Star Anointment: Warm three drops of Élixir d’Étoiles between your hands, activating the divine chamomile aromatherapy molecules, and massage gently onto your clean face.",

    // journal
    journal_title: "The Chronicles & Press",
    journal_subtitle: "Ancestral herbalism secrets, esoteric wisdom, lunar phase alignments, and editorial press features.",
    journal_all: "All Writings",
    journal_chroniques: "Sagesse & Rituels l’Atelier",
    journal_presse: "In the Press (Journal Reviews)",
    journal_read_more: "Read full article ✦",
    journal_back: "← Back to Chronicles & Press",
    journal_reading_time: "read",
    journal_by: "By",
    journal_related: "You might also like",
    journal_discover_shop: "Discover the Boutique",
    journal_back_main: "Back to Journal",
    journal_empty: "No publications found in this section yet.",
    journal_writing: "The ink is flowing, future secrets are being composed...",

    // notre histoire
    story_title: "The Origin of Merakya",
    story_subtitle: "The story of a meeting between two worlds, two cultures, and one shared passion.",
    story_kicker: "✦ FROM THE SOIL TO THE SOUL",
    story_p1: "Merakya is first and foremost the story of two longtime friends, bound by shared values and a single desire: to create something that holds true meaning. A desire born from the ambition to unite two universes, two cultures, and two distinct perspectives on the world, blending them into a single, cohesive identity.",
    story_p2: "From this encounter arose a vision: to design a 100% natural product line where the authenticity of Moroccan artisanal traditions speaks with inspirations and riches from afar. A fusion conceived as a bridge between heritage and openness, ancestral know-how, and worldly influences.",
    story_p3: "At the heart of Merakya rest the natural treasures that nature has gifted for generations: rare oils, plants with recognized virtues, noble raw materials, and components gathered with absolute care. Every creation is crafted with excellence and passion, honoring artisanal methods that define the richness of Moroccan culture.",
    story_p4: "Our candles are hand-poured in small batches, while our premium botanical soaps are made using traditional cold saponification methods, preserving the natural qualities and wholesome benefits of every ingredient used.",
    story_p5: "To us, Merakya is far more than a brand. It is a story of warm friendship, passing on traditions, and sharing. An invitation to experience custom creations where every detail carries an intention: to bring cultures closer, highlight heritage craftsmanship, and celebrate natural beauty.",
    story_p6: "Because when two worlds meet with genuine passion and authenticity, they compose something truly unique.",

    // contact
    contact_title: "Get in Touch",
    contact_subtitle: "For any questions, custom orders, media requests, or simply to share a beautiful glowing thought.",
    contact_info: "Workshop Coordinates",
    contact_address: "Merakya Workshop, Historic District, Casablanca, Morocco",
    contact_email_lbl: "Official Email: ",
    contact_tel_lbl: "Telephone: ",
    contact_form_title: "Send a Message or Inquiry",
    contact_name: "Full Name / Identity",
    contact_email_field: "Email Address",
    contact_msg: "Your message or ritual inquiry",
    contact_send: "SEND THOUGHT TO THE STARS ✦",
    contact_success_msg: "✨ Your message has been cast to the heavens and received! Our team will get back to you within 24 hours.",

    // cart
    cart_title: "Your Sacred Basket",
    cart_empty: "Your basket is currently empty of intentions.",
    cart_price: "Unit Price",
    cart_total_p: "Subtotal",
    cart_delivery_alert: "🚚 Just {diff} more to enjoy direct free shipping in Morocco!",
    cart_delivery_free: "🎉 Congratulations! You have unlocked FREE shipping.",
    cart_delivery_fixed: "Morocco flat rate delivery: 35 DH",
    cart_checkout: "Secure Checkout",
    cart_back: "Continue Browsing",

    // help links footer
    help_delivery: "Delivery & Rates (Morocco & World)",
    help_payment: "Payment & Security Details",
    help_returns: "14-Day Free Returns & Exchanges",
    help_cgv: "Terms of Sale & Authenticity",
    help_privacy: "Privacy & Data Pledge",

    // footer
    footer_rights: "All rights reserved. Infused with pure intentions.",
    footer_motto: "Uniting botanical science, ancient rituals, and spiritual alchemy to soothe the body, enlighten the mind, and elevate the soul.",

    // auth modal
    auth_title_sacred: "Your Sacred Space",
    auth_title_member: "Merakya Member Space",
    auth_kicker: "Join the universe of Well-being Alchemy",
    auth_tab_signin: "Sign In",
    auth_tab_signup: "Create Account",
    auth_email_lbl: "Email Address",
    auth_pword_lbl: "Password",
    auth_btn_signin: "Sign In to the Temple ✦",
    auth_name_lbl: "Full Name *",
    auth_phone_lbl: "Phone",
    auth_city_lbl: "City",
    auth_pword_create_lbl: "Create your Password *",
    auth_btn_signup: "Initiate my Sacred Account ✦",
    auth_personal_initiated: "Personal ritual initiated:",
    auth_city_prefix: "City:",
    auth_member_since: "Member since:",
    auth_tracking_title: "📦 Active Order Tracking",
    auth_tracking_desc: "No active external transactions under logistic preparation. Your rituals are being prepared in our laboratory.",
    auth_btn_logout: "Log Out",
    auth_btn_continue: "Continue",
    auth_admin_lbl: "Brand Administrator?",
    auth_btn_admin: "Access Pro Space ✦",
    auth_validation_required: "Please fill in all required fields.",
    auth_email_exists: "An account already exists with this email address.",
    auth_success_signup: "An account has been created for you.",
    auth_success_signin: "✨ Divine connection established.",
    auth_error_credentials: "Incorrect credentials. Please try again.",

    // newsletter
    news_kicker: "JOIN THE MERAKYA UNIVERSE",
    news_title: "Receive our rituals and inspirations",
    news_desc: "Wellness insights, full moon rituals, new arrivals, and handcraft secrets from our workshop.",
    news_success: "✦ Welcome to the circle of Merakya initiatory members! Your email has been saved.",
    news_placeholder: "Your email address",
    news_btn: "Subscribe",

    // testimonials
    test_kicker: "✦ THE COMMUNITY SPEAKS",
    test_title: "Testimonials from our Community"
  }
};

export const PRODUCT_TRANSLATIONS: Record<string, { nameEn: string; descEn: string; ingEn: string }> = {
  'bougie-abondance': {
    nameEn: 'Abondance Ritual Soy Candle',
    descEn: 'A sacred creation poured by hand to attract prosperity, harmony and abundance into your home. Adorned with fine energized raw rose quartz chips and elegant soy wax orange blossoms.',
    ingEn: '100% natural soy wax, beeswax-coated cotton wick, wild cinnamon, sweet Marrakech orange, and sacred clove essential oils, actual energized rose quartz crystals.'
  },
  'bougie-rose-damas': {
    nameEn: 'Rose de Damas Healing Candle',
    descEn: 'Gently opens the heart chakra to tenderness, infinite kindness, and reconnection with self-love. Presented in a sublime hand-painted Moroccan artisan ceramic pot.',
    ingEn: 'Organic soy wax, pure Damask Rose distillates, noble jojoba oil, and sun-dried wild rose buds from the High Atlas mountains.'
  },
  'bougie-mauvais-oeil': {
    nameEn: 'Evil Eye Protection Candle',
    descEn: 'Wards off malicious glares and dissolves heavy, stagnant energies. It instills an immediate sacred protective bubble. Features deep oriental blue wax eye shields and protective Lapis Lazuli gemstones.',
    ingEn: 'Pure vegetable soy wax, natural raw Lapis-Lazuli gemstones, purifying sage, Moroccan mountain peppermint and pure Arabian myrrh essential oils.'
  },
  'savon-alchimie-argile': {
    nameEn: 'Alchimie Verte & Ocre Ancestral Soap',
    descEn: 'Rustic cold-processed soap creating a velvety, deeply moisturizing lather of imperial creaminess. Styled in beautiful visible strata of natural clay, mirroring the Atlas hills in the morning mist.',
    ingEn: 'Cold-pressed extra virgin olive oil, green Moroccan clay (Ghassoul), Ourika valley red-ochre clay, organic virgin coconut oil, rosemary and eucalyptus globulus essential oils.'
  },
  'savon-rose-sculptee': {
    nameEn: 'Rose Divine Exquisite Carved Soap',
    descEn: 'A beautiful masterpiece of bath art sculptured like a rose flower in full blossom. Its dusty pink petals glimmer with pure gold micas, washing the skin in a satin, fragrant touch.',
    ingEn: 'Raw shea butter pressed by hand, sweet almond oil, natural gold and pink mineral micas, sacred wild rose essence.'
  },
  'sels-purification': {
    nameEn: 'Purification Sacred Bath Salts',
    descEn: 'A detoxifying and liberating bath to revitalize the etheric body, purify the aura, and dissolve physical and mental tension after a tiring day.',
    ingEn: 'Pure Epsom salts, pink Himalayan salts, soothing white kaolin clay, air-dried wild mountain sage leaves, Rif lavender buds and pure sacral frankincense essential oil.'
  },
  'huile-botanique-nuit': {
    nameEn: 'Élixir d\'Étoiles Illuminating Botanical Oil',
    descEn: 'The ultimate night nectar to regenerate and restore the skin barrier. A rare botanical concentrate of ancient light-giving plants that reveals a celestial glow upon waking.',
    ingEn: 'Rare organic prickly pear seed oil harvested by hand, sacred calendula macerate, cold-pressed jojoba oil, wild vegetable vitamin E and organic Roman chamomile.'
  },
  'coffret-rituel-lune': {
    nameEn: 'Pleine Lune Luxury Ritual Chest',
    descEn: 'An ultra-luxurious esoteric wooden chest containing everything you need for mystical nights of manifestation. Ideal for creating a sacred space of purification and alignment.',
    ingEn: 'Includes: 1 miniature Abundance soy candle, 1 carved Soap Rose Divine, 1 sachet of Purification bath salts, 1 wild white sage smudge stick and a genuine clear quartz crystal purified under direct moonlight.'
  }
};

export const ARTICLE_TRANSLATIONS: Record<string, { titleEn: string; summaryEn: string; contentEn: string; catEn: string }> = {
  'art-rose-damas': {
    catEn: 'SACRED HERBALISM',
    titleEn: 'The Esoteric Secrets of Damask Rose',
    summaryEn: 'Since ancient times, the Queen of Roses has been known to soothe broken hearts, align pure loving vibrations, and ease cognitive strain.',
    contentEn: 'The Damask Rose is far more than a simple fragrant blossom. In traditional Moroccan esotericism, it embodies the ultimate vibration of unconditional love, emotional relief, and divine harmony. Surnommée la "Reine des Fleurs", son huile essentielle rare vibre à une fréquence énergétique particulièrement élevée.\n\nEvery sun-dried bud nested in our candles is harvested at dawn in the Rose Valley of Kelâat M\'gouna, at the precise segment of day when its botanical energy and fragrance is highest.\n\n**How to use it in your meditations:**\n1. Ignite your "Rose de Damas" candle in a peaceful sanctuary.\n2. Inhale the rose notes, close your eyes and visualize a warm rose-pink light comforting your heart chakra (Anahata).\n3. Whisper to yourself: *"I open myself to kindness, and I celebrate the divine starlight within."*'
  },
  'art-rythme-lune': {
    catEn: 'LUNAR ALIGNMENTS',
    titleEn: 'Lunar Rhythms and Sacred Skin Rejuvenation',
    summaryEn: 'Understanding how the moon phase governs slow cold saponification, Atlas clay infusions, and skincare wellness.',
    contentEn: 'The moon controls ocean tides, earthly cycles... and the moisture in our body\'s cells. Aligning cosmetic care with the lunar phases is an age-old secret to optimize cellular renewal.\n\nIn our workshop, we pour and energetically set our items during key lunar phases:\n- **Full Moon** is ideal for sealing prosperity and locking in the radiant illuminating compounds of our Night Elixir.\n- **New Moon** is used for blending detoxifying mountain herbs and aura-purifying bath salts.\n\n**Recommended guidelines:**\n- Waxing Moon: Nourish deeply with our green clay ancestral soap and prickly pear night oil. Perfect for cellular regeneration.\n- Waning Moon: Clear heavy residual energy with a warm bath saturated with our Epsom Purification Salts, and light an Abundance candle to cleanse your home.'
  },
  'press-vogue': {
    catEn: 'PRESS REVIEWS',
    titleEn: 'Merakya Infuses a Sacred and Holistic Breath into Moroccan Beauty',
    summaryEn: 'The world-famous luxury editorial explains how our hand-poured creations seamlessly fuse royal Moroccan identity and spiritual energy.',
    contentEn: '« Merakya is redefining the codes of raw luxury in Morocco. Far from standardized synthetic products, this confidential luxury house born from profound friendship unites cold-processed soap mastery with esoteric rituals. Their signature apothecary amber dropper bottles and hand-painted ceramics are already the new must-haves in exclusive spas from Marrakech to Paris. »\n\nA heartwarming milestone for our handmade crafts, proving that pure intention and raw botanical excellence cross any border.'
  },
  'press-officiel': {
    catEn: 'PRESS REVIEWS',
    titleEn: 'Holistic Alchemy: When Haute-Cosmetics Meet Ether',
    summaryEn: 'L’Officiel Voyage explores exceptional holistic havens in search of the High Atlas\'s finest beauty secrets.',
    contentEn: '« Discovering Merakya is like stumbling upon a hidden lush oasis in the dunes of Ourika. Their hand-poured soaps are geological masterpieces with strata beautifully pigmented by pure Moroccan clays. Meanwhile, the intention-infused candles encrusted with pure Lapis-Lazuli or raw Rose Quartz transform any hot bath into a solemn sanctuary of total sensory peace. A rare and delicate journey. »'
  }
};

export const REVIEW_TRANSLATIONS: Record<string, { textEn: string }> = {
  '1': {
    textEn: "The Abundantia candle smells divinely beautiful and the quartz gemstones inside are gorgeous! A real wonder for my daily meditations."
  },
  '2': {
    textEn: "The Alchimie Verte soap saved my dry skin. You immediately feel the premium quality of cold saponification and botanical organic oils. 100% recommended."
  },
  '3': {
    textEn: "Mind-blowing elegant packaging, products of rare purity. My evening routine has been completely transformed. An extraordinary brand!"
  }
};

