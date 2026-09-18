import { ShieldCheck } from "lucide-react";
import type { ModuleData } from "./types";

export const securityModule: ModuleData = {
  slug: "security",
  title: "Security",
  eyebrow: "Access & scope",
  outcome: "People see exactly the entity they run.",
  intro:
    "Security decides who can act, on what, and inside which entity. In a business that runs a warehouse, its own stores and partner outlets on one system, that boundary is the thing that makes the shared system safe to share.",
  icon: ShieldCheck,
  theme: {
    accent: "#64748b",
    accentDark: "#405065",
    accentSoft: "rgba(100, 116, 139, 0.12)",
  },

  hero: {
    eyebrow: "Security",
    headline: "One system. Every boundary held.",
    headlineAccent: "boundary held.",
    body: "Each role, outlet and entity sees exactly what it should, and no more.",
    primaryCta: { label: "Book a demo", href: "/contact" },
    secondaryCta: { label: "Explore all modules", href: "/modules" },
    visualVariant: "security",
    chain: [
      { id: "user", label: "User", detail: "A named person" },
      { id: "role", label: "Role", detail: "What they may do" },
      { id: "scope", label: "Entity scope", detail: "Where it applies" },
      { id: "trail", label: "Trail", detail: "What they did" },
    ],
    facts: [
      { label: "Granted by", value: "Role" },
      { label: "Bounded by", value: "Entity" },
      { label: "Recorded as", value: "An action on a document" },
    ],
  },

  problemSection: {
    presentation: "visual-stories",
    eyebrow: "Before Security",
    title: "Where access loses its boundaries.",
    intro:
      "Three failures that turn permission into a social arrangement instead of a property of the system.",
    problems: [
      {
        id: "admin-everyone",
        number: "01",
        title: "Everyone ends up an administrator",
        description:
          "Permissions widen until full access becomes the easiest option.",
        quote: "Four people can delete anything, and all of them need to.",
        visual: "permission-creep",
      },
      {
        id: "no-boundary",
        number: "02",
        title: "Sharing a system means sharing the business",
        description:
          "One login can expose stock, pricing and performance across entities.",
        quote: "A partner logs in and can read the outlet next door.",
        visual: "absent-boundary",
      },
      {
        id: "who-did",
        number: "03",
        title: "Nobody can say who did it",
        description:
          "A changed record cannot identify the person or context behind it.",
        quote: "The number moved and the explanation is a guess.",
        visual: "unattributed-change",
      },
    ],
    consequence: {
      title:
        "None of this looks like a breach. It looks like a system nobody can answer for.",
      items: [
        {
          id: "widen",
          label: "Rights that only widen",
          body: "Granting is faster than shaping, so the working set of permissions becomes everyone's.",
        },
        {
          id: "inside",
          label: "A partner inside the business",
          body: "With no entity boundary, joining the platform means seeing what was never theirs to see.",
        },
        {
          id: "author",
          label: "Changes without an author",
          body: "A price moves or a bill is cancelled, and the record holds the change but not the person.",
        },
      ],
    },
  },

  outcomesSection: {
    eyebrow: "After Security",
    title: "Three things change about",
    highlight: "how access works.",
    intro: "Clear responsibilities, defined boundaries and attributable actions.",
    outcomes: [
      {
        id: "role-shaped",
        number: "01",
        visualVariant: "user-role-entity",
        accent: "#64748b",
        title: "Roles shaped like real responsibilities",
        description: "Access is defined around what a job actually involves — billing, receiving, transferring, reporting — rather than around a small number of coarse tiers.",
      },
      {
        id: "entity-bounded",
        number: "02",
        visualVariant: "permission-scope",
        accent: "#64748b",
        title: "A boundary that holds by default",
        description: "Entity scope decides where a permission applies, so a user with a genuine right in their own outlet does not acquire it everywhere else.",
      },
      {
        id: "attributable",
        number: "03",
        visualVariant: "audit-trace",
        accent: "#64748b",
        title: "Actions that stay attributable",
        description: "Because operations are documents, an action is recorded against the document it changed and the person who took it — which is what makes a question answerable later.",
      },
    ],
  },

  capabilities: {
    groups: [
      {
        id: "identity",
        title: "Users",
        context: "Who is on the system, and what they belong to.",
        items: ["Users", "User status", "Entity assignment", "Outlet-scoped logins"],
      },
      {
        id: "permission",
        title: "Roles & permissions",
        context: "What a person is allowed to do, defined once and reused.",
        items: [
          "Roles",
          "Permissions per function",
          "Approval boundaries",
          "Role assignment",
        ],
      },
      {
        id: "scope",
        title: "Scope & accountability",
        context: "Where those rights apply, and what is kept about their use.",
        items: [
          "Entity scope",
          "Location-level visibility",
          "Audit trail",
          "Action attribution on documents",
        ],
      },
    ],
  },

  workflow: {
    title: "How access is decided",
    intro:
      "Four decisions, in order. Each one narrows the last, which is why the result is predictable.",
    steps: [
      {
        id: "user",
        index: "01",
        title: "A user is created",
        body: "A named person is added to the system and attached to the entity they actually work in.",
        record: "User · entity assigned",
      },
      {
        id: "role",
        index: "02",
        title: "A role is assigned",
        body: "The role carries the permissions for the functions that job performs — billing, receiving, transferring, reporting.",
        record: "Role · permissions attached",
      },
      {
        id: "scope",
        index: "03",
        title: "Scope is applied",
        body: "Entity scope decides where those permissions take effect, so a right held in one outlet does not extend to another.",
        record: "Permission × entity",
      },
      {
        id: "act",
        index: "04",
        title: "Work is done, and recorded",
        body: "Every action lands on a document, so what was changed stays attached to who changed it and where.",
        record: "Action · on a document",
      },
    ],
  },

  gallery: {
    variant: "stacked",
    title: "The screens this runs on",
    intro:
      "The access-management screens have not been captured for the website yet. They are listed here as the actual set rather than represented by a mock-up.",
    shots: [
      {
        id: "users",
        state: "pending",
        featured: true,
        order: 1,
        context: "Identity",
        title: "Users",
        description: "Everyone with access, and the entity each belongs to.",
      },
      {
        id: "roles",
        state: "pending",
        order: 2,
        context: "Permission",
        title: "Roles & permissions",
        description: "What each role may do, function by function.",
      },
      {
        id: "scope",
        state: "pending",
        order: 3,
        context: "Boundary",
        title: "Entity scope",
        description: "Where a role's permissions actually apply.",
      },
      {
        id: "audit",
        state: "pending",
        order: 4,
        context: "Accountability",
        title: "Audit trail",
        description: "Actions recorded against the documents they changed.",
      },
    ],
  },

  verticalRelevance: {
    apparel:
      "Store staff bill and receive; buying and pricing stay with the people who own them. The split is defined once and applies in every store.",
    jewellery:
      "High-value stock makes adjustment and cancellation rights worth restricting deliberately rather than by convention.",
    franchise:
      "This is what makes a shared platform acceptable to a partner: they operate fully inside their own entity and cannot read anyone else's.",
  },

  faq: [
    {
      id: "roles",
      question: "Can roles be defined for how we actually work?",
      answer:
        "Roles carry permissions per function, so access can follow a real job — a counter user, a warehouse user, an accounts user — rather than a single administrator-or-not switch.",
    },
    {
      id: "scope",
      question: "What exactly does entity scope control?",
      answer:
        "Where a permission applies. A user attached to one outlet exercises their rights inside that outlet, which is what keeps a shared platform from becoming shared visibility.",
    },
    {
      id: "partners",
      question: "Can franchise partners have their own logins?",
      answer:
        "Yes — partner users are scoped to their own entity, so they run their outlet in the same product without reading the rest of the network.",
    },
    {
      id: "audit",
      question: "What is kept about who did what?",
      answer:
        "Actions are recorded against the documents they affect, so a change stays attached to the person and the entity behind it. Retention and export specifics are worth confirming against your own policy during a demo.",
    },
    {
      id: "certifications",
      question: "What can you say about hosting and certifications?",
      answer:
        "Nothing is claimed here that has not been verified. Hosting arrangement, backup policy and any certification status should be confirmed directly during the demo rather than read off a marketing page.",
    },
  ],

  relatedModules: ["franchise", "accounting", "analytics"],

  seo: {
    title: "Security module",
    description:
      "Users, roles, permissions and entity scope shaped around real responsibilities, with actions recorded against the documents they change.",
    ogTitle: "Bizonix Security — access bounded by the entity it belongs to",
    ogDescription:
      "A role decides what a person may do; entity scope decides where it applies. One platform, separate businesses.",
  },
};
