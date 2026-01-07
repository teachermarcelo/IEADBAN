
export enum MemberRole {
  MEMBRO = 'Membro',
  COOPERADOR = 'Cooperador',
  DIACONO = 'Diácono',
  PRESBITERO = 'Presbítero',
  EVANGELISTA = 'Evangelista',
  PASTOR = 'Pastor'
}

export enum MaritalStatus {
  SOLTEIRO = 'Solteiro(a)',
  CASADO = 'Casado(a)',
  DIVORCIADO = 'Divorciado(a)',
  VIUVO = 'Viúvo(a)'
}

export interface Congregation {
  id: string;
  name: string;
  address: string;
  responsible?: string;
}

export interface Member {
  id: string;
  name: string;
  whatsapp: string;
  role: MemberRole;
  congregationId: string;
  email?: string;
  birthDate?: string;
  cpf?: string;
  rg?: string;
  address?: string;
  maritalStatus?: MaritalStatus;
  spouseName?: string;
  fatherName?: string;
  motherName?: string;
  baptismDate?: string;
  membershipDate?: string;
  occupation?: string;
}

export interface NewConvert {
  id: string;
  name: string;
  whatsapp: string;
  decisionDate: string;
  discipler?: string;
  observations?: string;
}

export interface Baptism {
  id: string;
  name: string;
  whatsapp: string;
  birthDate?: string;
  baptismDate: string; // YYYY-MM-DD
  status: 'confirmado' | 'pendente';
  congregationId: string;
}

export interface CarouselItem {
  id: string;
  imageUrl: string;
  title?: string;
  link?: string;
}

export interface DepartmentLink {
  id: string;
  label: string;
  url: string;
}

export interface Department {
  id: string;
  name: string;
  coordinatorName: string;
  coordinatorWhatsapp: string;
  description: string;
  links?: DepartmentLink[];
}

export interface Course {
  id: string;
  type: 'curso' | 'inscricao' | 'seminario';
  name: string;
  responsible: string;
  contact: string;
  externalLink?: string;
  imageUrl?: string;
  description?: string;
}

export interface WeeklyCult {
  id: string;
  day: string;
  name: string;
  time: string;
}

export interface ChurchNotice {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface Event {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  type: 'special' | 'weekly';
  externalLink?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'video';
  date: string;
  eventContext?: string;
}

export type TabType = 'home' | 'congregations' | 'members' | 'departments' | 'events' | 'devotional' | 'reading-plan' | 'media' | 'bible' | 'discipleship' | 'baptisms' | 'courses';
