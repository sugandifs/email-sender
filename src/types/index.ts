export interface Template {
  title: string;
  mainHeading: string;
  introText: string;
  eventDetails: string;
  bulletPoints: string[];
  closingText: string;
  signature: string;
  team: string;
  contactEmail: string;
  instagram: string;
}

export interface Colors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

export interface Callout {
  enabled: boolean;
  heading: string;
  content: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
}

export interface SendConfig {
  year: number;
  cycle: string;
  status: string;
  customEmails: string;
  csvFile: File | null;
  testEmail: string;
  recipientSource: "database" | "custom";
  subject: string;
}

export interface ColorPreset {
  name: string;
  colors: Colors;
}
