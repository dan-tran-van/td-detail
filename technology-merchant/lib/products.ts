import { Product } from './types';

export const SEEDED_PRODUCTS: Product[] = [
  {
    id: 'VN-2001',
    title: 'VoltCore Pro 100W GaN Charger',
    brand: 'Volt Nest',
    description:
      'Ultra-compact 3-port GaN charger delivering 100W total output. Charges a MacBook Pro at full speed while simultaneously powering your phone and earbuds. Engineered for travellers who refuse to compromise.',
    price: 3499,
    category: 'charging',
    specs: 'GaN III • 100W Total • USB-C PD × 2 + USB-A • 56 × 56 × 31mm',
    warranty: '1-Year Manufacturer Warranty + 10-Day Replacement (Defective)',
    coverImage: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80',
    badge: 'Best Seller',
    availabilityStatus: 'in_stock',
  },
  {
    id: 'VN-2002',
    title: 'NeoArc X1 True Wireless Earbuds',
    brand: 'Volt Nest',
    description:
      'Precision-tuned 10mm dynamic drivers with Hybrid Active Noise Cancellation. Up to 32 hours total playtime, IPX5 water resistance, and multipoint Bluetooth 5.3 for seamless device switching.',
    price: 5999,
    category: 'audio',
    specs: 'ANC • BT 5.3 Multipoint • 32h Total • IPX5 • 10mm Dynamic Driver',
    warranty: '1-Year Manufacturer Warranty',
    coverImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    badge: 'New Launch',
    availabilityStatus: 'in_stock',
  },
  {
    id: 'VN-2003',
    title: 'PixelHive 4K Portable Monitor',
    brand: 'Volt Nest',
    description:
      'Professional-grade 15.6" 4K IPS portable display with 100% sRGB coverage and HDR400. One USB-C cable handles video, power, and data. Folds to 6mm slim with magnetised leather smart cover.',
    price: 18999,
    category: 'display',
    specs: '15.6" 4K IPS • HDR400 • 100% sRGB • 60Hz • USB-C Single Cable',
    warranty: '1-Year Manufacturer Warranty',
    coverImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    badge: 'Premium',
    availabilityStatus: 'low_stock',
  },
  {
    id: 'VN-2004',
    title: 'PulseRing Health Monitor Band',
    brand: 'Volt Nest',
    description:
      'Smart health ring tracking continuous HRV, SpO2, skin temperature, and sleep cycles. Titanium case, 7-day battery, companion app with AI-driven wellness insights. No subscription required.',
    price: 9499,
    category: 'wearable',
    specs: 'Titanium • SpO2 + HRV + Temp • 7-Day Battery • IP68 • Size 6–13',
    warranty: '1-Year Manufacturer Warranty',
    coverImage: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80',
    badge: 'Trending',
    availabilityStatus: 'in_stock',
  },
  {
    id: 'VN-2005',
    title: 'GridHub 12-in-1 Thunderbolt Dock',
    brand: 'Volt Nest',
    description:
      'The last hub you will ever need. Dual 4K@60Hz displays, 96W laptop charging, 10Gbps USB-A/C ports, SD and microSD slots, 2.5GbE Ethernet, and 3.5mm audio — all from a single Thunderbolt 4 connection.',
    price: 12499,
    category: 'hub',
    specs: 'TB4 • Dual 4K@60Hz • 10Gbps USB • 2.5GbE • 96W PD • 12 Ports',
    warranty: '1-Year Manufacturer Warranty',
    coverImage: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&auto=format&fit=crop&q=80',
    availabilityStatus: 'out_of_stock',
  },
];

export function getProductById(id: string): Product | undefined {
  return SEEDED_PRODUCTS.find((p) => p.id === id);
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
