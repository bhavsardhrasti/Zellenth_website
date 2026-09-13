import { Eye, Factory, Handshake, type LucideIcon } from 'lucide-react';

export interface AboutValue {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const aboutValues: AboutValue[] = [
  {
    icon: Factory,
    title: 'Manufactured in Ahmedabad',
    description:
      'Every door is built in our own Vatva GIDC facility, so we control quality from raw timber to the final finish.',
  },
  {
    icon: Eye,
    title: 'See it before you order',
    description:
      'Our visualizer renders your exact door and laminate combination in real time, so there are no surprises at delivery.',
  },
  {
    icon: Handshake,
    title: 'No middlemen',
    description:
      'You order directly from the people who make the door, which means better pricing and a single point of accountability.',
  },
];
