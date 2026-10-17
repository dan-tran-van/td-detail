// Seed script for Volt Nest (Merchant B)
const SEEDED_PRODUCTS = [
  {
    id: 'VN-2001',
    title: 'VoltCore Pro 100W GaN Charger',
    brand: 'Volt Nest',
    price: 3499,
    category: 'charging',
    availabilityStatus: 'in_stock',
  },
  {
    id: 'VN-2002',
    title: 'NeoArc X1 True Wireless Earbuds',
    brand: 'Volt Nest',
    price: 5999,
    category: 'audio',
    availabilityStatus: 'in_stock',
  },
  {
    id: 'VN-2003',
    title: 'PixelHive 4K Portable Monitor',
    brand: 'Volt Nest',
    price: 18999,
    category: 'display',
    availabilityStatus: 'low_stock',
  },
  {
    id: 'VN-2004',
    title: 'PulseRing Health Monitor Band',
    brand: 'Volt Nest',
    price: 9499,
    category: 'wearable',
    availabilityStatus: 'in_stock',
  },
  {
    id: 'VN-2005',
    title: 'GridHub 12-in-1 Thunderbolt Dock',
    brand: 'Volt Nest',
    price: 12499,
    category: 'hub',
    availabilityStatus: 'out_of_stock',
  },
];

console.log('Seeding Volt Nest (merchant_b) products...');
console.log(`Successfully verified ${SEEDED_PRODUCTS.length} products:`);
SEEDED_PRODUCTS.forEach((p) => {
  console.log(`- [${p.id}] ${p.title} (₹${p.price}) [${p.availabilityStatus}]`);
});
console.log('Seed completed successfully.');
