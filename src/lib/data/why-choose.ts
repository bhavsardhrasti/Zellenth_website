import { Eye, Factory, MapPinned, Tag, type LucideIcon } from 'lucide-react';

export interface Stat {
  value: string;
  label: string;
}

export const stats: Stat[] = [
  { value: '12+', label: 'Years in Business' },
  { value: '500+', label: 'Doors Installed' },
  { value: '80+', label: 'Laminate Finishes' },
  { value: '15+', label: 'Cities Served in Gujarat' },
];

export interface Pillar {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const pillars: Pillar[] = [
  {
    icon: Factory,
    title: 'In-House Manufacturing',
    body: 'Our own factory in Ahmedabad gives us full control over quality, from raw timber to final finish.',
  },
  {
    icon: Eye,
    title: 'Real-Time Visualization',
    body: 'Our own visualizer lets you preview any laminate on any door before you commit to an order.',
  },
  {
    icon: MapPinned,
    title: "Built for Gujarat's Climate",
    body: 'Moisture and termite-resistant construction engineered specifically for local conditions.',
  },
  {
    icon: Tag,
    title: 'Direct-From-Factory Pricing',
    body: 'No middlemen. Work directly with the manufacturer for better pricing and faster turnaround.',
  },
];
