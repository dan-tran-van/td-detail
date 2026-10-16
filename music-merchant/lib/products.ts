import { Product } from './types';

export const SEEDED_PRODUCTS: Product[] = [
  {
    id: 'prod_neon_echoes',
    title: 'Neon Echoes (Synthwave Vol. 2 - Deluxe Master)',
    artist: 'Kavinsky & The Midnight Echo',
    description: 'Bit-perfect 24-bit/96kHz high-resolution digital master. Includes all 12 multi-track studio stems, analogue synth patches, and verified digital ownership key.',
    price: 1999,
    category: 'album',
    format: 'FLAC 24-bit / 96kHz + 320kbps MP3 + WAV Stems',
    licenseType: 'Commercial Master Audio License',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    trackCount: 12,
    duration: '48 mins',
    badge: 'Deluxe Studio Master',
    isAvailable: true,
  },
  {
    id: 'prod_midnight_velocity',
    title: 'Midnight Velocity (Cyberpunk OST)',
    artist: 'SoundWave Cinematic Labs',
    description: 'Dynamic cyberpunk orchestral motion soundtrack with aggressive analog basslines and modular synth arpeggios. 16 uncompressed tracks ready for streaming and games.',
    price: 1499,
    category: 'album',
    format: 'FLAC 24-bit / 48kHz + Instrumental Stems',
    licenseType: 'Royalty-Free Synchronization License',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    trackCount: 16,
    duration: '62 mins',
    badge: 'Official OST',
    isAvailable: true,
  },
  {
    id: 'prod_acoustic_solitude',
    title: 'Acoustic Solitude EP (Direct Master Tape)',
    artist: 'Elena Rostova',
    description: 'Pure acoustic fingerstyle guitar captured via direct 1/2-inch stereo tape master. Bit-accurate transfer delivering breathtaking dynamic range and warmth.',
    price: 799,
    category: 'ep',
    format: 'DSD 64 & FLAC 24-bit / 192kHz Audiophile',
    licenseType: 'Personal Audiophile High-Res License',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    trackCount: 5,
    duration: '24 mins',
    badge: 'Direct Tape Master',
    isAvailable: true,
  },
  {
    id: 'prod_analog_modular',
    title: 'Analog Modular Drum & Bass Sample Vault',
    artist: 'NeuroPulse Records',
    description: '1.8 GB studio production vault. Over 450 bit-perfect drum hits, rolling reese basses, synth stabs, and loop kits processed through vintage SSL outboard gear.',
    price: 2499,
    category: 'sample_pack',
    format: '24-bit / 44.1kHz WAV • 1.8 GB ZIP Vault',
    licenseType: '100% Royalty-Free Commercial License',
    coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
    trackCount: 450,
    duration: '1.8 GB Content',
    badge: 'Pro Producer Pack',
    isAvailable: true,
  },
  {
    id: 'prod_ethereal_horizon',
    title: 'Ethereal Horizon (Extended Ambient Mix)',
    artist: 'Aether Resonance',
    description: 'Immersive 22-minute generative ambient soundscape crafted with granular tape synthesis. Includes binaural Dolby Atmos spatial render for deep headphones listening.',
    price: 299,
    category: 'single',
    format: 'Dolby Atmos Binaural FLAC + 24-bit Stereo',
    licenseType: 'Standard Digital Download License',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    trackCount: 1,
    duration: '22 mins',
    badge: 'Spatial Audio',
    isAvailable: true,
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
