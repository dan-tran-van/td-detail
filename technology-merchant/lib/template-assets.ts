export interface EditorialBanner {
  id: string;
  tagline: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  image: string;
  accentColor?: string;
}

export const TEMPLATE_EDITORIAL_ASSETS = {
  // Hero flagship showcase image (Smartwatch / tech gadget with metallic bezel & vibrant screen)
  flagshipHero: {
    title: 'VoltPulse Alpha Pro',
    subtitle: 'Redefine Your Quest',
    badge: 'Flagship Edition • 1.96" AMOLED • Bluetooth 5.4',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1000&auto=format&fit=crop&q=85',
    ctaPrimary: 'Shop Alpha Pro',
    ctaSecondary: 'Explore Ecosystem',
  },

  // Category navigation icons matching template circular pills
  categoryPills: [
    {
      id: 'all',
      name: 'All Tech',
      icon: 'sparkles',
      count: '5 Items',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'wearable',
      name: 'Smart Watches',
      icon: 'watch',
      count: 'VN-2004',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'audio',
      name: 'Wireless Audio',
      icon: 'headphones',
      count: 'VN-2002',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'charging',
      name: 'GaN Chargers',
      icon: 'zap',
      count: 'VN-2001',
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'display',
      name: '4K Displays',
      icon: 'monitor',
      count: 'VN-2003',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&auto=format&fit=crop&q=80',
    },
    {
      id: 'hub',
      name: 'TB4 Hubs',
      icon: 'cpu',
      count: 'VN-2005',
      image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=200&auto=format&fit=crop&q=80',
    },
  ],

  // Bento grids matching "Find Your Match" and "Watch for Innovation"
  bentoShowcases: [
    {
      id: 'bento-1',
      title: 'Active Tech Living',
      tagline: 'Engineered for Performance',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
      description: 'Titanium durability with all-day biometrics and instant notifications.',
    },
    {
      id: 'bento-2',
      title: 'Precision Craftsmanship',
      tagline: 'Watch for Innovation',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
      description: 'Modern executive styling with zero compromises in technical capability.',
    },
  ],

  // Big editorial lifestyle audio banner matching template "Discover Audio for Life"
  editorialAudio: {
    headline: 'Discover Audio for Life',
    subtext: 'Deep acoustics, intelligent ANC, and ergonomic design built to immerse your day.',
    lifestyleModelImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1000&auto=format&fit=crop&q=85',
    ctaText: 'Explore Audio Gear',
  },

  // Social proof & brand validation section matching template "Celebrating the best of..."
  brandMilestones: {
    title: 'Celebrating Next-Gen Tech Standards',
    subtitle: '#VoltStandard • Built with Zero Compromise',
    ambassadorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    metrics: [
      { rank: 'NO. 1', title: 'GaN Power Density', desc: '100W in pocket-sized GaN III architecture' },
      { rank: '10-DAY', title: 'Rapid Replacement', desc: 'Instant replacement policy for verified defects' },
      { rank: '1-YEAR', title: 'Hardware Warranty', desc: 'Full manufacturer warranty backed by TD Retail AI' },
    ],
  },
};
