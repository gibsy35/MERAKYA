export interface Product {
  id: string;
  name: string;
  price: number; // in DH
  category: string;
  description: string;
  image: string;
  ingredients?: string;
  isCustom?: boolean;
  inStock?: boolean;
  
  // Extended e-commerce parameters
  inventory?: number;       // Stock level
  status?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'PREORDER'; // Stock status
  compareAtPrice?: number;  // For discounted comparisons (strikethroughs)
  isLimitedEdition?: boolean; // Limited edition/special harvest flag
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  totalAmount: number;
  date: string;
  status: 'En attente' | 'Confirmé' | 'Expédié' | 'Livré';
  paymentMethod?: string;
  paymentStatus?: 'Payé' | 'En attente' | 'Échoué';
}

export interface Campaign {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  type: 'banner' | 'popup' | 'discount';
  badgeText?: string;
  textColor?: string;
  bgColor?: string;
}

export interface ClientAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  totalOrders: number;
  registeredAt: string;
}

export type CurrencyCode = 'MAD' | 'EUR' | 'USD' | 'GBP';

export const CURRENCIES: { code: CurrencyCode; label: string; symbol: string; rate: number }[] = [
  { code: 'MAD', label: 'MAD (DH)', symbol: 'DH', rate: 1.0 },
  { code: 'EUR', label: 'EUR (€)', symbol: '€', rate: 0.092 },
  { code: 'USD', label: 'USD ($)', symbol: '$', rate: 0.099 },
  { code: 'GBP', label: 'GBP (£)', symbol: '£', rate: 0.078 }
];

export function formatPrice(priceInDh: number, currencyCode: CurrencyCode): string {
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const converted = (priceInDh * currency.rate).toFixed(currencyCode === 'MAD' ? 0 : 2);
  return `${converted} ${currency.symbol}`;
}

export interface JournalArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  summary: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
  isPressArticle?: boolean;
  publicationSource?: string; // e.g. "Vogue Arabie", "L'Officiel Voyage", "Harper's Bazaar"
}

