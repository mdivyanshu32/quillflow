import type { ContentType, ContentTone, OrderStatus, SelectOption } from "./types";

// ─── Navigation ────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/orders",    label: "My Orders",  icon: "FileText"        },
  { href: "/settings",  label: "Settings",   icon: "Settings"        },
] as const;

// ─── Order status config ───────────────────────────────────────────────────────
export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string; dotColor: string }
> = {
  pending:     { label: "Pending",     color: "text-gray-600",   bgColor: "bg-gray-100",   dotColor: "bg-gray-400"   },
  in_review:   { label: "In review",   color: "text-amber-700",  bgColor: "bg-amber-50",   dotColor: "bg-amber-400"  },
  in_progress: { label: "In progress", color: "text-blue-700",   bgColor: "bg-blue-50",    dotColor: "bg-blue-400"   },
  revision:    { label: "Revision",    color: "text-pink-700",   bgColor: "bg-pink-50",    dotColor: "bg-pink-400"   },
  completed:   { label: "Completed",   color: "text-green-700",  bgColor: "bg-green-50",   dotColor: "bg-green-400"  },
  cancelled:   { label: "Cancelled",   color: "text-red-600",    bgColor: "bg-red-50",     dotColor: "bg-red-400"    },
};

export const ORDER_STATUSES = Object.keys(ORDER_STATUS_CONFIG) as OrderStatus[];

// ─── Select options ────────────────────────────────────────────────────────────
export const CONTENT_TYPE_OPTIONS: SelectOption[] = [
  { value: "blog_post",            label: "Blog post"            },
  { value: "website_copy",         label: "Website copy"         },
  { value: "product_description",  label: "Product description"  },
  { value: "social_media",         label: "Social media"         },
  { value: "email_sequence",       label: "Email sequence"       },
  { value: "whitepaper",           label: "Whitepaper"           },
  { value: "case_study",           label: "Case study"           },
  { value: "other",                label: "Other"                },
];

export const CONTENT_TONE_OPTIONS: SelectOption[] = [
  { value: "professional",   label: "Professional"   },
  { value: "conversational", label: "Conversational" },
  { value: "persuasive",     label: "Persuasive"     },
  { value: "informative",    label: "Informative"    },
  { value: "humorous",       label: "Humorous"       },
  { value: "inspirational",  label: "Inspirational"  },
];

export const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: "",            label: "All statuses" },
  { value: "pending",     label: "Pending"      },
  { value: "in_review",   label: "In review"    },
  { value: "in_progress", label: "In progress"  },
  { value: "revision",    label: "Revision"     },
  { value: "completed",   label: "Completed"    },
  { value: "cancelled",   label: "Cancelled"    },
];

export const SORT_OPTIONS: SelectOption[] = [
  { value: "created_at:desc", label: "Newest first"  },
  { value: "created_at:asc",  label: "Oldest first"  },
  { value: "deadline:asc",    label: "Deadline soon" },
  { value: "total_price:desc",label: "Highest price" },
];

export const TIMEZONE_OPTIONS: SelectOption[] = [
  { value: "UTC",             label: "UTC"                  },
  { value: "America/New_York",label: "UTC−5 (New York)"     },
  { value: "America/Chicago", label: "UTC−6 (Chicago)"      },
  { value: "America/Denver",  label: "UTC−7 (Denver)"       },
  { value: "America/Los_Angeles", label: "UTC−8 (LA)"       },
  { value: "Europe/London",   label: "UTC+0 (London)"       },
  { value: "Europe/Berlin",   label: "UTC+1 (Berlin)"       },
  { value: "Asia/Dubai",      label: "UTC+4 (Dubai)"        },
  { value: "Asia/Kolkata",    label: "UTC+5:30 (Mumbai)"    },
  { value: "Asia/Singapore",  label: "UTC+8 (Singapore)"    },
  { value: "Asia/Tokyo",      label: "UTC+9 (Tokyo)"        },
];

// ─── Pricing ───────────────────────────────────────────────────────────────────
export const PRICE_PER_WORD: Record<ContentType, number> = {
  blog_post:           0.03,
  website_copy:        0.06,
  product_description: 0.05,
  social_media:        0.08,
  email_sequence:      0.05,
  whitepaper:          0.04,
  case_study:          0.04,
  other:               0.03,
};

// ─── Pagination ────────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 10;
