import type { Icons } from "@/components/icons";

export interface AdLink {
  src: string;
  href: string;
}
export interface NavItem {
  title: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items?: NavItemWithChildren[];
}

interface MainNav {
  title: string;
  description: string;
  href?: string;
  items: {
    title: string;
    href: string;
    description: string;
    items: [];
  }[];
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

export interface ListingDetails {
  listingid: string;
  detailreq: string;
  location: string;
  locationstring: string;
  streetaddress: string;
  type: string;
  contract: string;
  beds: string;
  baths: string;
  isfurnished: string;
  garages: string;
  floorarea: string;
  title: string;
  description: string;
  price: string;
  pdr: string;
  leaseunit: string;
  leaseoptions: string[];
  isnegotiable: string;
  datelisted: string;
  imagelist: string[];
  amenities: string[];
  categorylink: string;
  categorytext: string;
  parentlink: string;
  parenttext: string;
  similars: ListingDetails[]; // Array of similar listings
  image: string;
  owner: {
    haswan: boolean;
    name: string;
    page: string;
    type: string;
    accounttype: string;
    logo: string;
    profilepic: string;
    commission: string;
    registrationfee: string;
    listingscount: string;
    verification: string;
  };
}

export interface BrokerDetail {
  imbroker: string;
  first: string;
  name2: string;
  name: string;
  imageUrl: string; // Generated as https://dve7rykno93gs.cloudfront.net/fascimos/somics/[imbroker]
  profileUrl: string; // Generated as https://meqasa.com/properties-listed-by-[name2]?g=[first]
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = MainNav;

export type SidebarNavItem = NavItemWithChildren;

export interface DeveloperDetails {
  units: Unit[];
  lands: unknown[];
  developer: Developer;
  projects: Project[];
  workinghours: WorkingHours;
}

export interface Unit {
  unitid: number;
  terms: string;
  unittype: string;
  beds: number;
  baths: number;
  garages: number;
  hasbalcony: number;
  price: number;
  floorarea: number;
  description: string;
  imcount: number | null;
  projectid: number;
  coverphoto: string;
  dateadded: string;
  soldout: number;
  csign: string;
  unitname: string;
  fullyfurnished: number;
  availableunits: number;
  featured: number;
  test: number;
  developerid: number;
  rentduration: number;
  parkingspace: number;
  sellingpricecsign: string;
  rentpricecsignpermonth: string;
  rentpricecsignperweek: string;
  rentpricecsignperday: string;
  rentdurationindays: number;
  rentdurationinweeks: number;
  rentdurationinmonths: number;
  rentpricepermonth: number;
  rentpriceperweek: number;
  rentpriceperday: number;
  sellingprice: number;
  rentdurationtype: string;
  hasparkingspace: number;
  city: string;
  address: string;
  tourvideo: string;
  publish: number;
  lng: number;
  lat: number;
  formatted_address: string;
  pageviews: number;
  negotiable: number;
  landmesurement: string;
  landlength: number;
  landwidth: number;
  updated_at: string;
  title: string;
  persquaremeter: number;
  photostorage: string;
  unittypename: string;
  unittypeslug: string;
  contactclicks: number;
  topad: string | null;
}

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
  photos: Photo[];
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

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  email: string;
  links: {
    x: string;
    github: string;
    githubAccount: string;
    discord: string;
    calDotCom: string;
  };
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
  };
  mainNav: MainNavItem[];
  footerNav: FooterItem[];
  selectOptions: Record<string, Array<{ value: string; label: string }>>;
}

export interface FloorPlan {
  id: string;
  sqft: number;
  sqm: number;
  beds: number;
  baths: number;
  type: string;
  title: string;
  imageUrl?: string;
  unitNumbers?: string;
}
