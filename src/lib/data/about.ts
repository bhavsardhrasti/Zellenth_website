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
export interface AboutMilestone {
  year: string;
  title: string;
  description: string;
}
export const aboutMilestones: AboutMilestone[] = [
  {
    year: '2013',
    title: 'A single carpentry shed',
    description:
      'Zellenth starts in Vatva GIDC with two craftsmen, hand finishing main doors for local homes.',
  },
  {
    year: '2017',
    title: 'In-house laminate line',
    description:
      'We bring pressing and edge banding in house, so finishes stop depending on outside vendors.',
  },
  {
    year: '2021',
    title: '80+ finishes catalogued',
    description:
      'The laminate library grows into a documented range, each swatch graded and coded for repeatability.',
  },
  {
    year: '2023',
    title: 'The visualizer ships',
    description:
      'Customers can now apply any laminate to any door on screen, long before a single panel is cut.',
  },
  {
    year: 'Today',
    title: '500+ doors installed',
    description:
      'Across 15+ cities in Gujarat, every door still leaves the same Ahmedabad floor it started on.',
  },
];
export interface FacilityFact {
  value: string;
  label: string;
}
export const facilityFacts: FacilityFact[] = [
  { value: 'Vatva GIDC', label: 'Workshop' },
  { value: 'Ahmedabad', label: 'Gujarat, India' },
  { value: 'In-house', label: 'Making & finishing' },
  { value: 'Since 2013', label: 'Family run' },
];
