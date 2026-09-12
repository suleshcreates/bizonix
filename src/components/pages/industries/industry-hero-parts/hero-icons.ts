import {
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  Building2,
  Gem,
  Layers,
  Network,
  PackageCheck,
  Receipt,
  Ruler,
  ScanBarcode,
  Shirt,
  Store,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/**
 * The hero's icon registry.
 *
 * Content names an icon with a string; this file is the only place a string
 * becomes a component. That indirection is not decoration — the industry pages
 * render on the server and the hero is a client component, and a React
 * component is a function, which cannot cross that boundary. Putting icon
 * components straight into the content model throws "Functions cannot be
 * passed directly to Client Components" at request time, for every icon, on
 * every industry page.
 *
 * Keeping the content plain and serialisable also means it could come from a
 * CMS or an API later without any of this changing.
 *
 * Adding an icon is one import and one entry. `HeroIconName` is derived from
 * the map, so an unknown name is a type error where the content is written.
 */
export const heroIcons = {
  arrowUpRight: ArrowUpRight,
  badgeCheck: BadgeCheck,
  boxes: Boxes,
  building: Building2,
  gem: Gem,
  layers: Layers,
  network: Network,
  packageCheck: PackageCheck,
  receipt: Receipt,
  ruler: Ruler,
  scanBarcode: ScanBarcode,
  shirt: Shirt,
  store: Store,
  truck: Truck,
  wallet: Wallet,
} as const satisfies Record<string, LucideIcon>;

export type HeroIconName = keyof typeof heroIcons;
