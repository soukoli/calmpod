export type Lang = "en" | "cz";

export interface NavTranslations {
  personas: string;
  spaces: string;
  contribute: string;
  join: string;
}

export interface HeroTranslations {
  tag: string;
  headline: string;
  sub: string;
  cta: string;
  ctaSub: string;
}

export interface ProblemItem {
  title: string;
  text: string;
}

export interface ProblemTranslations {
  tag: string;
  headline: string;
  items: ProblemItem[];
}

export interface SolutionTranslations {
  tag: string;
  headline: string;
  text: string;
  badge: string;
  badgeSub: string;
}

export interface GalleryTranslations {
  tag: string;
  headline: string;
  sub: string;
}

export interface PersonaCard {
  title: string;
  description: string;
  icon: string;
}

export interface PersonasTranslations {
  tag: string;
  headline: string;
  sub: string;
  personas: PersonaCard[];
}

export interface HostsTranslations {
  tag: string;
  headline: string;
  text: string;
  perks: string[];
  cta: string;
}

export interface DiscordTranslations {
  headline: string;
  text: string;
  cta: string;
}

export interface WaitlistTranslations {
  tag: string;
  headline: string;
  sub: string;
  placeholder: string;
  cta: string;
  success: string;
  namePlaceholder: string;
  messagePlaceholder: string;
  formTitle: string;
  discordTitle: string;
  discordText: string;
}

export interface FooterTranslations {
  copy: string;
  tagline: string;
  contact: string;
  links: string[];
}

export interface FutureNetworkTranslations {
  tag: string;
  headline: string;
  text: string;
  counter: string;
  counterSub: string;
}

export interface ContributeCard {
  title: string;
  description: string;
  cta: string;
}

export interface ContributeTranslations {
  tag: string;
  headline: string;
  cards: ContributeCard[];
  mapPickerTitle: string;
  mapPickerConfirm: string;
  mapPickerHint: string;
}

export interface Translations {
  nav: NavTranslations;
  hero: HeroTranslations;
  problem: ProblemTranslations;
  solution: SolutionTranslations;
  personas: PersonasTranslations;
  gallery: GalleryTranslations;
  hosts: HostsTranslations;
  futureNetwork: FutureNetworkTranslations;
  contribute: ContributeTranslations;
  discord: DiscordTranslations;
  waitlist: WaitlistTranslations;
  footer: FooterTranslations;
  langToggle: string;
}
