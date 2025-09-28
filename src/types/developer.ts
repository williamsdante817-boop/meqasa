export interface Developer {
  developerid: number;
  address: string;
  city: string;
  region: string;
  hero: string;
  logo: string;
  featured: number;
  website: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  test: number;
  tourvideo: string;
  description: string | null;
  status: string;
  instagram: string;
  lat: number;
  lng: number;
  formatted_address: string;
  pageviews: number;
  subdomain: string | null;
  updated_at: string;
  devstatus: string;
  brokerid: string;
  servicearea: string | null;
  name: string;
  smartphone: string | null;
  dateregistered: string;
  brokerwanted: string | null;
  companyname: string;
  initialprops: number;
  locality: string;
  refereename: string | null;
  refereephone: string | null;
  accounttype: string;
  refereemail: string | null;
  visitcharge: number;
  seekersalefee: number;
  seekerrentfee: number;
  ownersalecomm: number;
  ownerrentcomm: number;
  isdeveloper: number;
  about: string;
  experience: number;
  imbroker: number;
  ownerrentcomm2: string | null;
  seekerrentfee2: string | null;
  lastprompt: string | null;
  hasgroup: string | null;
  columnconverted: string | null;
  first: number;
  lastactive: string;
  stph: string;
  imbroker2: number;
  verstat: string;
  stph2: string;
  datexten: string;
  disstat: string | null;
  stph3: string;
  twurl: string | null;
  fburl: string | null;
  liurl: string | null;
  weburl: string | null;
  yturl: string | null;
  inurl: string | null;
  png: string | null;
  jsid: string | null;
  plim: string | null;
  urate: string | null;
  featdevid: string;
  start: string;
  end: string;
  contactclicks: number;
  remaining_days: number;
  url: string;
}

interface BaseProject {
  projectid: number;
  projectname: string;
  address: string;
  city: string;
  region: string;
  aboutproject: string;
  photo: string;
  projectstatus: string;
  propertymanagement: string;
  associationdues: string;
  unitcount: number;
  tourvideo: string;
  imcount: number | null;
  developerid: number;
  dateadded: string;
  featured: number;
  test: number;
  numparkingspace: number;
  publish: number;
  oldproject: number;
  formatted_address: string;
  lat: number;
  lng: number;
  pageviews: number;
  landonly: number;
  updated_at: string;
  top: string | null;
  bottom: string | null;
  sidebar: string | null;
  title: string | null;
  description: string | null;
  weburl: string;
  photostorage: string;
}

export interface Project extends BaseProject {
  contactclicks: number;
}

export interface ProjectDetails extends BaseProject {
  name: string;
  companyname: string;
  png: string | null;
  logo: string;
  date: string;
  url: string;
  brochure?: string | null;
  siteplan?: string | null;
  photos: Photo[];
}

export interface FeaturedProject {
  projectname: string;
  projectid: string;
  photo: string;
  logo: string;
  name: string;
  city: string;
  feat: string;
  text: string;
  status?: "ongoing" | "completed";
  unittypes: string;
  unitsizes: string;
}

import type { FloorPlan, Unit } from "./property";

export interface DeveloperDetails {
  units: Unit[];
  lands: unknown[];
  developer: Developer;
  projects: Project[];
  workinghours: WorkingHours;
}

export interface DeveloperProject {
  units: Unit[];
  lands: unknown[];
  establishments: Establishment[];
  features: Feature[];
  photos: Photo[];
  projecttypes: ProjectType[];
  unittypes: UnitType[];
  parkingtypes: ParkingType[];
  project: ProjectDetails;
  minmax: { minprice: number; maxprice: number }[];
  saleunits: unknown[];
  rentunits: unknown[];
  presaleunits: unknown[];
  floorplans?: FloorPlan[];
}

export interface WorkingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
}

export interface DayHours {
  day: string;
  open: string;
  close: string;
}

export interface Establishment {
  id: number;
  name: string;
  type: string;
  distance: number;
  fa: string;
  projectid: number;
}

export interface Feature {
  projectid: number;
  feature: string;
  pfid: number;
}

export interface Photo {
  projectid: number;
  photo: string;
  storage: string;
}

export interface ProjectType {
  project_type_id: number;
  type: string;
  projectid: number;
}

export interface UnitType {
  project_unit_type_id: number;
  type: string;
  projectid: number;
}

export interface ParkingType {
  project_parking_type_id: number;
  type: string;
  projectid: number;
}
