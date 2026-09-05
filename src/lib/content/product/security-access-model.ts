// Marketing-only content + geometry for the "Security & Tenancy" access architecture.
//
// SAFETY: every role, record, branch and timestamp below is synthetic and invented
// for the public website. This file is strictly disconnected from product,
// customer, authentication, permission or API data. It makes no certification claim.
//
// This module is the single source of truth for the section: the same entity list
// drives the entity scenes, role markers, permission emphasis, the action event and
// the audit trail, so no content is duplicated across components.

export type SecurityEntityId = "warehouse" | "retail" | "franchise";

export type PermissionId = "view" | "create" | "approve" | "transfer" | "post";

export type Accent = "blue" | "teal";

/** The full permission scale, rendered once as a shared ribbon. */
export interface PermissionStop {
  id: PermissionId;
  label: string;
  /** x position on the shared permission path, in stage units. */
  x: number;
}

export const permissionScale: PermissionStop[] = [
  { id: "view", label: "View", x: 60 },
  { id: "create", label: "Create", x: 211 },
  { id: "approve", label: "Approve", x: 362 },
  { id: "transfer", label: "Transfer", x: 513 },
  { id: "post", label: "Post", x: 664 },
];

/** Image-surface rectangle inside the architecture stage, in stage units. */
export interface SceneFrame {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SecurityEntity {
  id: SecurityEntityId;
  /** Environment name, e.g. "Warehouse". */
  name: string;
  /** Local scope annotation drawn on the entity boundary. */
  scopeLabel: string;
  /** Where the entity physically sits in the tenant. */
  location: string;
  accent: Accent;
  /** Photograph displayed inside the scoped architecture frame. */
  image?: string;
  imageAlt: string;
  role: {
    name: string;
    /** Human summary of the scope granted to the role. */
    access: string;
  };
  /** Permissions emphasised on the shared ribbon while this entity is active. */
  permissions: PermissionId[];
  /** One real operational event this role can perform. */
  action: {
    /** Which permission on the ribbon this action consumes. */
    permission: PermissionId;
    title: string;
    recordId: string;
    time: string;
  };
  /** The evidence the action leaves behind, in who → what → where → record → when order. */
  audit: {
    who: string;
    what: string;
    where: string;
    record: string;
    when: string;
  };
  frame: SceneFrame;
}

export const securityEntities: SecurityEntity[] = [
  {
    id: "warehouse",
    name: "Warehouse",
    scopeLabel: "Warehouse scope",
    location: "Central Warehouse — Node 1",
    accent: "teal",
    image: "/images/product/security/security-warehouse-v2.png",
    imageAlt:
      "Central warehouse environment where stock is received and put away.",
    role: {
      name: "Warehouse Operator",
      access: "Limited access",
    },
    permissions: ["view", "create", "transfer"],
    action: {
      permission: "create",
      title: "Create goods receipt",
      recordId: "GRN #GRN-4471",
      time: "08:15 AM",
    },
    audit: {
      who: "Warehouse Operator",
      what: "Created goods receipt",
      where: "Central Warehouse — Node 1",
      record: "GRN #GRN-4471",
      when: "08:15 AM",
    },
    frame: { x: 33, y: 56, w: 236, h: 172 },
  },
  {
    id: "retail",
    name: "Retail outlet",
    scopeLabel: "Retail scope",
    location: "Retail Outlet — Branch West",
    accent: "blue",
    image: "/images/product/security/security-retail-v2.png",
    imageAlt:
      "Retail outlet counter environment where customer orders are raised.",
    role: {
      name: "Retail Manager",
      access: "Full access",
    },
    permissions: ["view", "create", "approve", "post"],
    action: {
      permission: "create",
      title: "Create purchase order",
      recordId: "PO #PO-24125",
      time: "10:32 AM",
    },
    audit: {
      who: "Retail Manager",
      what: "Created purchase order",
      where: "Retail Outlet — Branch West",
      record: "PO #PO-24125",
      when: "10:32 AM",
    },
    frame: { x: 303, y: 100, w: 188, h: 148 },
  },
  {
    id: "franchise",
    name: "Franchise store",
    scopeLabel: "Franchise scope",
    location: "Franchise Store — Partner 12",
    accent: "teal",
    image: "/images/product/security/security-franchise-v2.png",
    imageAlt:
      "Franchise store environment operated by an independent partner team.",
    role: {
      name: "Franchise Partner",
      access: "Scoped access",
    },
    permissions: ["view", "transfer"],
    action: {
      permission: "transfer",
      title: "Raise stock transfer request",
      recordId: "TRF #TRF-0917",
      time: "02:47 PM",
    },
    audit: {
      who: "Franchise Partner",
      what: "Raised stock transfer request",
      where: "Franchise Store — Partner 12",
      record: "TRF #TRF-0917",
      when: "02:47 PM",
    },
    frame: { x: 525, y: 74, w: 138, h: 116 },
  },
];

/** The story the section tells at rest, before any interaction. */
export const defaultEntityId: SecurityEntityId = "retail";

export function getEntity(id: SecurityEntityId): SecurityEntity {
  return securityEntities.find((e) => e.id === id) ?? securityEntities[1];
}

export function getPermissionStop(id: PermissionId): PermissionStop {
  return permissionScale.find((p) => p.id === id) ?? permissionScale[0];
}

/** The three SRS principles, rendered as an editorial sequence (never as cards). */
export interface SecurityPrinciple {
  index: string;
  title: string;
  body: string;
}

export const securityPrinciples: SecurityPrinciple[] = [
  {
    index: "01",
    title: "Roles & permissions",
    body: "Every user gets access aligned to their real job functions.",
  },
  {
    index: "02",
    title: "Tenant / brand scope",
    body: "Data and operations stay within the right branch, brand and partner boundaries.",
  },
  {
    index: "03",
    title: "Audit-minded operations",
    body: "Every action is traceable from who did what, where and against which record.",
  },
];

export type PermissionState = "acting" | "granted" | "withheld";

/** Single rule for permission emphasis, shared by the desktop and mobile flows. */
export function permissionState(
  entity: SecurityEntity,
  id: PermissionId,
): PermissionState {
  if (entity.action.permission === id) return "acting";
  return entity.permissions.includes(id) ? "granted" : "withheld";
}
