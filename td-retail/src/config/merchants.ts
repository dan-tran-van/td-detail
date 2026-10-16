import { MerchantConfig, MerchantId, Product } from "@/types";

export const MERCHANT_A_CONFIG: MerchantConfig = {
  id: "merchant_a",
  slug: "merchant-a",
  name: "Aura Soundworks",
  shortName: "Aura",
  tagline: "Pure Acoustic Precision for Discerning Audiophiles",
  description:
    "Engineering reference-grade headphones, planar magnetic monitors, and bespoke analog amplification for musicians, sound engineers, and true acoustic purists.",
  currency: "INR",
  currencySymbol: "₹",
  supportEmail:
    process.env.MERCHANT_A_SUPPORT_EMAIL || "support@aurasoundworks.tdretail.demo",
  supportPhone: "+91 80 4912 8800",
  supportHours: "Mon-Sat: 9:00 AM - 9:00 PM IST",
  supportPolicy: {
    returnWindowDays: 30,
    warranty: "2-Year Precision Acoustic Limited Warranty",
    highlights: [
      "30-day audiophile sound satisfaction guarantee",
      "Complimentary white-glove replacement for driver defects",
      "Dedicated acoustic tuning calibration support",
      "Direct TD Retail AI & priority engineer escalation",
    ],
    details:
      "All Aura Soundworks products are backed by our 30-Day Critical Listening Guarantee. If the acoustic signature does not meet your studio standards, return it in original packaging for a full refund. All electronics include our 2-Year Precision Acoustic Warranty covering drivers, DAC chips, and structural components.",
  },
  theme: {
    primary: "#D4AF37", // Champagne Gold
    primaryHover: "#B89628",
    primaryLight: "#FDF8E8",
    accent: "#F59E0B", // Amber
    bgDark: "#0B0F19", // Deep obsidian navy
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    cardBg: "#111827",
    cardBorder: "#1F2937",
    badgeBg: "rgba(212, 175, 55, 0.15)",
    badgeText: "#FBBF24",
    navBg: "rgba(11, 15, 25, 0.92)",
    heroGradient:
      "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212, 175, 55, 0.18), transparent 70%)",
  },
  products: [
    {
      id: "aura-anc-pro",
      name: "Aura Horizon ANC Wireless Headphones",
      subtitle: "Flagship Active Noise Cancellation with Beryllium Drivers",
      description:
        "Engineered with custom 45mm pure beryllium drivers, hybrid quad-mic adaptive noise cancellation, and lossless LDAC transmission for an intimate, uncompressed concert-hall soundstage.",
      price: 24999,
      merchantId: "merchant_a",
      category: "Over-Ear Wireless",
      status: "IN_STOCK",
      badge: "Audiophile Choice",
      features: [
        "45mm Custom Beryllium Diaphragm Drivers",
        "-42dB Active Hybrid Noise Cancellation",
        "40-Hour Battery Life with Fast Charge",
        "Lossless LDAC & aptX HD Bluetooth 5.3",
      ],
      imageUrl: "/products/aura-anc-pro.svg",
      rating: 4.9,
      reviewsCount: 142,
    },
    {
      id: "aura-studio-mon",
      name: "Aura Reference Studio Monitor Pair",
      subtitle: "Bi-Amplified Active Nearfield Acoustic Monitors",
      description:
        "Hand-tuned Class-D bi-amplified studio monitors featuring woven Kevlar woofers and silk dome tweeters. Delivers laser-flat frequency response from 38Hz to 24kHz for mastering perfection.",
      price: 42500,
      merchantId: "merchant_a",
      category: "Studio Monitors",
      status: "IN_STOCK",
      badge: "Mastering Grade",
      features: [
        "150W Class-D Bi-Amplified Acoustic Output",
        "6.5-inch Woven Kevlar Mid-Bass Woofers",
        "Acoustic Space & Boundary EQ Control",
        "Balanced XLR & 1/4-inch TRS Inputs",
      ],
      imageUrl: "/products/aura-studio-mon.svg",
      rating: 5.0,
      reviewsCount: 88,
    },
    {
      id: "aura-earbuds-air",
      name: "Aura Pulse Spatial True Wireless Earbuds",
      subtitle: "Dual-Driver Planar Magnetic In-Ear Monitors",
      description:
        "Sub-miniature planar magnetic drivers deliver ultra-fast transient response and deep sub-bass. Features head-tracking spatial audio, six beamforming microphones, and IPX7 weather protection.",
      price: 12499,
      merchantId: "merchant_a",
      category: "Wireless In-Ear",
      status: "IN_STOCK",
      badge: "Bestseller",
      features: [
        "Dual Planar Magnetic & Dynamic Drivers",
        "Real-Time 3D Spatial Audio Tracking",
        "IPX7 Sweat & Water Resistance",
        "32-Hour Total Battery with Wireless Qi Case",
      ],
      imageUrl: "/products/aura-earbuds-air.svg",
      rating: 4.8,
      reviewsCount: 310,
    },
    {
      id: "aura-dac-amp",
      name: "Aura Resonator Desktop DAC & Tube Amp",
      subtitle: "Discrete Class-A Headphone Amplifier with Dual ESS SABRE",
      description:
        "Harmonic warmth meets digital perfection. Combines matched vintage 12AU7 vacuum tubes with dual ESS ES9038PRO 32-bit DACs for unmatched resolution and silky-smooth analog timbre.",
      price: 18990,
      merchantId: "merchant_a",
      category: "Amplification & DAC",
      status: "IN_STOCK",
      badge: "Limited Edition",
      features: [
        "Matched Dual 12AU7 Electro-Harmonix Tubes",
        "Dual ESS SABRE 32-bit/768kHz DAC Architecture",
        "Native DSD512 and MQA Full Decoding",
        "Balanced 4.4mm & 4-Pin XLR Headphone Outs",
      ],
      imageUrl: "/products/aura-dac-amp.svg",
      rating: 4.9,
      reviewsCount: 64,
    },
    {
      id: "aura-soundbar-sub",
      name: "Aura Atmosfera Spatial Soundbar & Sub",
      subtitle: "9.1.4 Channel Wireless Dolby Atmos Cinematic System",
      description:
        "True cinematic envelopment in a minimalist aluminum enclosure. 14 discrete neodymium transducers with up-firing height channels and an 8-inch wireless isobaric subwoofer.",
      price: 36999,
      merchantId: "merchant_a",
      category: "Home Cinema",
      status: "IN_STOCK",
      badge: "New Release",
      features: [
        "9.1.4 Channel Dolby Atmos & DTS:X Decoding",
        "Isobaric 8-inch Wireless Active Subwoofer",
        "HDMI eARC with 4K 120Hz Passthrough",
        "Automated Room Acoustic Calibration Mic",
      ],
      imageUrl: "/products/aura-soundbar-sub.svg",
      rating: 4.7,
      reviewsCount: 95,
    },
  ],
};

export const MERCHANT_B_CONFIG: MerchantConfig = {
  id: "merchant_b",
  slug: "merchant-b",
  name: "Terra Botanica",
  shortName: "Terra",
  tagline: "Sustainably Cultivated Living for Conscious Homes",
  description:
    "Handcrafted artisanal botanical aromatics, cold-pressed certified organic skincare, and natural living essentials sourced directly from regenerative organic growers.",
  currency: "INR",
  currencySymbol: "₹",
  supportEmail:
    process.env.MERCHANT_B_SUPPORT_EMAIL || "care@terrabotanica.tdretail.demo",
  supportPhone: "+91 80 6720 4422",
  supportHours: "Mon-Sun: 8:00 AM - 8:00 PM IST",
  supportPolicy: {
    returnWindowDays: 14,
    warranty: "100% Botanical Purity & Freshness Guarantee",
    highlights: [
      "14-day freshness return & exchange guarantee",
      "100% compostable and plastic-free carbon-neutral shipping",
      "Return empty containers for a 15% discount on refills",
      "Direct TD Retail AI & green-living concierge support",
    ],
    details:
      "Terra Botanica guarantees 100% pure certified organic ingredients with zero synthetic phthalates, parabens, or artificial dyes. If your botanicals arrive compromised or do not elevate your sanctuary, notify us within 14 days for a replacement or store credit. We recycle and compost all returns responsibly.",
  },
  theme: {
    primary: "#059669", // Botanical Emerald
    primaryHover: "#047857",
    primaryLight: "#ECFDF5",
    accent: "#10B981", // Sage / Mint
    bgDark: "#06281E", // Deep forest evergreen
    textPrimary: "#0F172A", // Rich charcoal for light mode
    textSecondary: "#475569",
    cardBg: "#FFFFFF",
    cardBorder: "#E2E8F0",
    badgeBg: "rgba(5, 150, 105, 0.12)",
    badgeText: "#065F46",
    navBg: "rgba(255, 255, 255, 0.95)",
    heroGradient:
      "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(5, 150, 105, 0.12), transparent 70%)",
  },
  products: [
    {
      id: "terra-candle-trio",
      name: "Terra Botanical Forest Aromatics Trio",
      subtitle: "Hand-Poured Wild Soy & Cedarwood Beeswax Candles",
      description:
        "Infused with wild cedarwood, black spruce, and Himalayan lavender. Poured into reusable apothecary amber glass with organic FSC-certified crackling wooden wicks. 55-hour burn time per candle.",
      price: 2499,
      merchantId: "merchant_b",
      category: "Aromatherapy",
      status: "IN_STOCK",
      badge: "Artisanal",
      features: [
        "100% Non-GMO Wild Soy & Local Beeswax",
        "Crackling Natural Wood Wicks",
        "Pure Steam-Distilled Essential Oils",
        "Zero Petroleum, Phthalates, or Paraffin",
      ],
      imageUrl: "/products/terra-candle-trio.svg",
      rating: 4.9,
      reviewsCount: 220,
    },
    {
      id: "terra-diffuser-stone",
      name: "Terra Nebulizing Stone Ultrasonic Diffuser",
      subtitle: "Hand-Carved Sandstone Waterless Aroma Nebulizer",
      description:
        "Crafted from porous Himalayan sandstone and solid walnut wood. Uses cold-air micro-nebulization to vaporize pure essential oils without water or heat, preserving every therapeutic compound.",
      price: 4850,
      merchantId: "merchant_b",
      category: "Home Sanctuary",
      status: "IN_STOCK",
      badge: "Zero Water Needed",
      features: [
        "Hand-Carved Porous Sandstone & Walnut",
        "Cold-Air Waterless Micro-Vapor Technology",
        "Covers Up to 800 sq.ft with Whisper-Quiet Operation",
        "Warm Amber Breathing LED Ambient Glow",
      ],
      imageUrl: "/products/terra-diffuser-stone.svg",
      rating: 5.0,
      reviewsCount: 115,
    },
    {
      id: "terra-linen-throw",
      name: "Terra Organic Raw Cotton Loom Throw",
      subtitle: "GOTS-Certified Hand-Loomed Waffle Blanket",
      description:
        "Woven by master artisans on traditional wooden shuttle looms from 100% unbleached GOTS-certified organic cotton. Dyed using fermented botanical indigo and marigold petals.",
      price: 3600,
      merchantId: "merchant_b",
      category: "Textiles",
      status: "IN_STOCK",
      badge: "Hand-Loomed",
      features: [
        "100% GOTS-Certified Organic Rain-Fed Cotton",
        "Traditional Breathable Honeycomb Waffle Weave",
        "Naturally Plant-Dyed Without Synthetic Fixatives",
        "Pre-Washed for Irresistible Cloud-Soft Drape",
      ],
      imageUrl: "/products/terra-linen-throw.svg",
      rating: 4.8,
      reviewsCount: 84,
    },
    {
      id: "terra-skincare-kit",
      name: "Terra Bio-Flora Restorative Skincare Set",
      subtitle: "Cold-Pressed Botanical Serum, Hydrosol, and Flora Balm",
      description:
        "A 3-step restorative ritual featuring wild rosehip cold-pressed seed oil, steam-distilled damask rose hydrosol toner, and whipped Amazonian cupuacu lipid barrier balm.",
      price: 5200,
      merchantId: "merchant_b",
      category: "Organic Skincare",
      status: "IN_STOCK",
      badge: "Organic Certified",
      features: [
        "100% Active Ingredients with Zero Water Fillers",
        "Cold-Pressed Unrefined Botanical Nutrients",
        "Ecocert & Cruelty-Free Leaping Bunny Certified",
        "UV-Blocking Violet Glass Apothecary Bottles",
      ],
      imageUrl: "/products/terra-skincare-kit.svg",
      rating: 4.9,
      reviewsCount: 178,
    },
    {
      id: "terra-ceramics-set",
      name: "Terra Artisanal Clay Pour-Over & Mug Set",
      subtitle: "Hand-Thrown Speckled Stoneware Brewing Ritual",
      description:
        "Individually hand-thrown by village ceramicists from iron-rich local river clay. Includes a spiral-ribbed pour-over cone dripper, a 600ml decanter carafe, and two tactile speckled cups.",
      price: 3150,
      merchantId: "merchant_b",
      category: "Artisanal Kitchen",
      status: "IN_STOCK",
      badge: "Studio Handcrafted",
      features: [
        "High-Fired 1280°C Durable Stoneware",
        "Non-Toxic Food-Safe Matte Chalk Glaze",
        "Spiral Interior Ribs for Optimal Coffee Extraction",
        "Dishwasher, Microwave & Oven Safe",
      ],
      imageUrl: "/products/terra-ceramics-set.svg",
      rating: 4.8,
      reviewsCount: 132,
    },
  ],
};

export const MERCHANTS: Record<MerchantId, MerchantConfig> = {
  merchant_a: MERCHANT_A_CONFIG,
  merchant_b: MERCHANT_B_CONFIG,
};

export const MERCHANT_SLUGS: Record<string, MerchantId> = {
  "merchant-a": "merchant_a",
  "merchant-b": "merchant_b",
  merchant_a: "merchant_a",
  merchant_b: "merchant_b",
};

export function getMerchantById(id: string): MerchantConfig | undefined {
  if (id === "merchant_a" || id === "merchant-a") return MERCHANT_A_CONFIG;
  if (id === "merchant_b" || id === "merchant-b") return MERCHANT_B_CONFIG;
  return undefined;
}

export function getProductById(productId: string): Product | undefined {
  for (const merchant of Object.values(MERCHANTS)) {
    const product = merchant.products.find((p) => p.id === productId);
    if (product) return product;
  }
  return undefined;
}
