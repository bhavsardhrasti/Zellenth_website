import { Clock, Droplets, Leaf, ShieldCheck, Sparkles, type LucideIcon } from 'lucide-react';

export interface TrustBadge {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const trustBadges: TrustBadge[] = [
  {
    icon: Clock,
    title: '72-Hour Seasoned Timber',
    description: 'Kiln-dried and seasoned for 72 hours before processing, for a warp-free finish.',
  },
  {
    icon: ShieldCheck,
    title: 'Termite & Borer Proof',
    description: 'Chemically treated core resists termites and wood-boring insects for life.',
  },
  {
    icon: Sparkles,
    title: 'Scratch Resistant',
    description: 'High-density laminate surface holds up to daily wear without dulling.',
  },
  {
    icon: Droplets,
    title: 'Moisture Resistant',
    description: "Engineered to resist warping and swelling in Gujarat's humid summers.",
  },
  {
    icon: Leaf,
    title: 'Eco Friendly',
    description: 'Sourced from certified sustainable timber and low-VOC adhesives.',
  },
];
