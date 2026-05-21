import { Product } from './types';
import imgAbondance from './assets/images/merakya_abondance_1779241793445.png';
import imgRoseDamas from './assets/images/merakya_rose_damas_1779241813197.png';
import imgMauvaisOeil from './assets/images/merakya_mauvais_oeil_1779241832267.png';
import imgAlchimieArgile from './assets/images/merakya_alchimie_argile_1779241853230.png';
import imgRoseSculptee from './assets/images/merakya_rose_sculptee_1779241869509.png';
import imgSelsPurification from './assets/images/merakya_sels_purification_1779243565328.png';
import imgElixirEtoiles from './assets/images/merakya_elixir_etoiles_1779243585736.png';
import imgCoffretLune from './assets/images/merakya_coffret_lune_1779243605101.png';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'bougie-abondance',
    name: 'Bougie Rituelle "Abondance"',
    price: 180,
    category: 'BOUGIES RITUELLES',
    description: 'Une création sacrée coulée à la main pour attirer la prospérité, l\'harmonie et l\'abondance dans votre foyer. Ornée d\'éclats de quartz rose brut d\'une extrême finesse et d\'élégantes fleurs d\'orange modelées en cire de soja divine.',
    image: imgAbondance,
    ingredients: 'Cire de soja 100% naturelle, mèche en coton tressé de cire d\'abeille, huiles essentielles de cannelle sauvage, orange douce de Marrakech, et clous de girofle sacrés, véritables cristaux de quartz rose énergisés.'
  },
  {
    id: 'bougie-rose-damas',
    name: 'Bougie "Rose de Damas"',
    price: 195,
    category: 'BOUGIES RITUELLES',
    description: 'Ouvre le cœur à la tendresse, à la douceur infinie et à la reconnexion avec l\'amour de soi. Présentée dans son sublime pot de céramique artisanale marocaine, peint à la main de cœurs délicats.',
    image: imgRoseDamas,
    ingredients: 'Cire de soja bio, distillats purs de Rose de Damas, huile végétale de jojoba noble, et pétales séchés de boutons de rose sauvages du Haut-Atlas.'
  },
  {
    id: 'bougie-mauvais-oeil',
    name: 'Bougie "Carnation Mauvais Œil"',
    price: 220,
    category: 'BOUGIES RITUELLES',
    description: 'Bannit le regard d\'envie et neutralise les énergies lourdes. Elle libère l\'esprit en instaurant une bulle protectrice céleste. Contient de puissants disques d\'œil de cire sacrée de couleur bleu d\'Orient et des pierres sacrées de Lapis-Lazuli.',
    image: imgMauvaisOeil,
    ingredients: 'Cire végétale pure, pierres de Lapis-Lazuli gemme, huiles essentielles de sauge officinale purifiante, menthe poivrée des montagnes et myrrhe d\'Arabie.',
    inStock: false
  },
  {
    id: 'savon-alchimie-argile',
    name: 'Savon ancestral "Alchimie Verte & Ocre"',
    price: 75,
    category: 'SAVONS & SOINS NATURELS',
    description: 'Savon rustique saponifié à froid offrant une mousse onctueuse et hydratante d\'une douceur impériale. Conçu avec des strates d\'argiles naturelles rappelant les collines de l\'Atlas sous le brouillard matinal.',
    image: imgAlchimieArgile,
    ingredients: 'Huile d\'olive extra vierge extraite à froid, argile verte du Maroc (Ghassoul), argile ocre de l\'Ourika, huile de coco vierge, huiles essentielles de romarin vivifiant et d\'eucalyptus globulus.'
  },
  {
    id: 'savon-rose-sculptee',
    name: 'Savon Sculpté d\'Exception "Rose Divine"',
    price: 85,
    category: 'SAVONS & SOINS NATURELS',
    description: 'Un magnifique bijou de bain sculpté délicatement en forme de rose de jardin en pleine floraison. Ses reflets roses poudrés scintillants de micas dorés lavent la peau d\'une caresse satinée et parfumée.',
    image: imgRoseSculptee,
    ingredients: 'Beurre de karité brut pressé à la main, huile d\'amande douce, micas minéraux or et rose naturels, essence sacrée de rose sauvage.',
    inStock: false
  },
  {
    id: 'sels-purification',
    name: 'Sels de Bain Sacrés "Purification"',
    price: 135,
    category: 'SELS & BAINS ÉNERGÉTIQUES',
    description: 'Un bain détoxifiant et libérateur pour revitaliser le corps éthérique. Purifie l\'aura et dénoue les tensions musculaires après une longue journée.',
    image: imgSelsPurification,
    ingredients: 'Sels d\'Epsom purs, sels de l\'Himalaya rose, argile blanche apaisante, feuilles de sauge blanche séchées à l\'air libre, fleurs de lavande du Rif et huile essentielle pure d\'encens sacral.'
  },
  {
    id: 'huile-botanique-nuit',
    name: 'Huile de Nuit "Élixir d\'Étoiles"',
    price: 260,
    category: 'HUILES & ÉLIXIRS BOTANIQUES',
    description: 'L\'ultime nectar alchimique pour régénérer la barrière cutanée. Un concentré botanique ancestral de plantes de lumière qui révèle un éclat céleste au réveil.',
    image: imgElixirEtoiles,
    ingredients: 'Huile rare de pépins de figue de barbarie biologique récoltée à la main, macérat huileux de calendula sacré, huile de jojoba pressée à froid, vitamine E végétale sauvage et fleurs de camomille romaine.'
  },
  {
    id: 'coffret-rituel-lune',
    name: 'Coffret Rituel "Pleine Lune"',
    price: 490,
    category: 'COFFRETS RITUELS',
    description: 'Un luxueux coffret ésotérique contenant tout le nécessaire pour vos nuits de rituels. Idéal pour s\'accorder un espace sacré de purification et de manifestation profonde.',
    image: imgCoffretLune,
    ingredients: 'Comprend : 1 Bougie d\'abondance miniature, 1 savon Rose Divine, un pochon de sels sacrés Purification, un bâton de sauge sauvage à faire brûler et un authentique cristal de quartz blanc purifié sous la lune.'
  }
];

export const INITIAL_REVIEWS = [
  {
    id: '1',
    author: 'Sarah M.',
    rating: 5,
    text: 'La bougie Abondance sent divinement bon et les pierres de quartz à l\'intérieur sont magnifiques ! Une véritable merveille pour mes méditations.',
    date: '2026-05-18'
  },
  {
    id: '2',
    author: 'Inès B.',
    rating: 5,
    text: 'Le savon Alchimie Verte a sauvé ma peau sèche. On ressent tout de suite la qualité de la saponification à froid et des huiles bio. Je recommande à 100%.',
    date: '2026-05-15'
  },
  {
    id: '3',
    author: 'Yasmine L.',
    rating: 5,
    text: 'Le packaging d\'une élégance folle, des produits d\'une pureté rare. Mon rituel du soir s\'est transformé. Une marque extraordinaire !',
    date: '2026-05-10'
  }
];

export const INITIAL_ARTICLES: any[] = [
  {
    id: 'art-rose-damas',
    title: 'Les vertus ésotériques de la Rose de Damas',
    category: 'HERBORISTERIE SACRÉE',
    summary: 'Depuis la nuit des temps, la Reine des Roses guérit les cœurs brisés, réaligne la vibration amoureuse pure et libère les tensions de l’esprit.',
    content: `La Rose de Damas n’est pas qu’une simple fleur au parfum envoûtant. Dans la tradition ésotérique marocaine, elle incarne la vibration ultime de l’amour inconditionnel, de la guérison émotionnelle et de la paix divine. Surnommée la "Reine des Fleurs", son huile essentielle rare vibre à une fréquence énergétique particulièrement élevée.

Chaque bouton séché que nous intégrons dans nos bougies est récolté à l'aube dans la Vallée des Roses de Kelâat M'gouna, au moment précis où le parfum est le plus concentré et pur.

**Comment l’utiliser lors de vos méditations ?**
1. Allumez la Bougie "Rose de Damas" dans un espace calme.
2. Fermez les yeux et visualisez une douce lumière rose enveloppant votre chakra du cœur (Anahata).
3. Inspirez profondément les effluves distillés et répétez mentalement : *"Je m'ouvre à la bienveillance, à la tendresse et je célèbre l'être de lumière que je suis."*`,
    image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&q=80&w=600',
    date: '2026-05-18',
    author: 'L’Atelier Merakya',
    readTime: '4 min'
  },
  {
    id: 'art-rythme-lune',
    title: 'Prendre soin de son corps au rythme de la Lune',
    category: 'CALENDRIER LUNAIRE',
    summary: 'Comprendre l’influence mystique du satellite lunaire sur la saponification lente, l’infusion des argiles de l’Atlas et le soin de la barrière cutanée.',
    content: `La lune gouverne les marées, les cycles terrestres... et l'eau contenue dans nos propres cellules. Syncroniser ses rituels de soins cosmétiques avec le calendrier lunaire est un secret ancestral pour maximiser la régénération de l'épiderme.

Nos ateliers coulent et chargent énergétiquement l’intégralité de nos bougies d’intentions et de nos savons alchimiques pendant les phases clés :
- Nom de code **Pleine Lune** pour sceller les vertus d'abondance nutritive et d'éclat éternel de l'Élixir d'Étoile.
- Phase de **Nouvelle Lune** pour formuler nos herbes de détoxification et sels sacrés de purification de l’aura.

**Les rituels recommandés :**
- En Lune Croissante : Nourrissez intensément avec notre savon ancestral à l'argile et notre huile de nuit riche à la figue de barbarie. C'est le moment idéal pour la cicatrisation et la régénération.
- En Lune Décroissante : Purifiez et bannissez les énergies lourdes avec un bain chaud saturé de nos Sels d'Epsom sacrés et infusez votre foyer de la fumée protectrice d'une Bougie d'abondance.`,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600',
    date: '2026-05-15',
    author: 'L’Atelier Merakya',
    readTime: '5 min'
  },
  {
    id: 'press-vogue',
    title: 'Merakya insuffle un vent sacré et holistique sur la cosmétique au Maroc',
    category: 'REVUES DE PRESSE',
    summary: 'La célèbre revue de mode décrypte comment nos créations allient avec brio le raffinement de l\'identité marocaine et l\'alchimie des intentions.',
    content: `« Merakya redéfinit les codes du luxe naturel au Maroc. Loin des formules industrielles standardisées, cette maison confidentielle née d'une amitié fusionnelle réunit l'excellence de la saponification à froid marocaine et la puissance vibratoire des rituels ésotériques. Leurs flacons d'ambre et leurs céramiques peintes à la main sont déjà les nouveaux indispensables des spas les plus exclusifs de Marrakech à Paris. »

Une reconnaissance immense pour notre artisanat fait-main qui prouve que l'intention pure et le respect des matières nobles résonnent bien au-delà des frontières de l'Atlas.`,
    image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=600',
    date: '2026-05-10',
    author: 'Vogue Arabie',
    readTime: '3 min',
    isPressArticle: true,
    publicationSource: 'Vogue Arabie'
  },
  {
    id: 'press-officiel',
    title: 'L’alchimie holistique : quand la haute-cosmétique rencontre l’éther',
    category: 'REVUES DE PRESSE',
    summary: 'Quand L’Officiel Voyage explore d’exceptionnels havres de paix rituels en quête des plus beaux secrets de beauté de l’Atlas.',
    content: `« Trouver Merakya, c'est comme dénicher une oasis secrète au milieu des dunes de l'Ourika. Leurs savons sont de véritables œuvres d'art géologiques aux strates colorées par des argiles pures du sud marocain. Quant aux bougies d'intention serties de pierres semi-précieuses de Lapis-Lazuli ou de quartz rose, elles transforment l’atmosphère de n'importe quel bain en un sanctuaire sacré de paix et d’éveil sensoriel absolu. Un voyage mystique d'une délicatesse rare. »`,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600',
    date: '2026-05-02',
    author: 'L’Officiel Voyage',
    readTime: '4 min',
    isPressArticle: true,
    publicationSource: 'L’Officiel Voyage'
  }
];
