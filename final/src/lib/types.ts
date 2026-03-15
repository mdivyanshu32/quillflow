// ─── Enums ─────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "in_review"
  | "in_progress"
  | "revision"
  | "completed"
  | "cancelled";

export type ContentType =
  | "blog_post"
  | "website_copy"
  | "product_description"
  | "social_media"
  | "email_sequence"
  | "whitepaper"
  | "case_study"
  | "other";

export type ContentTone =
  | "professional"
  | "conversational"
  | "persuasive"
  | "informative"
  | "humorous"
  | "inspirational";

// ─── Database models ───────────────────────────────────────────────────────────
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  company: string | null;
  phone: string | null;
  timezone: string;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  word_count: number;
  content_type: ContentType;
  tone: ContentTone;
  target_audience: string | null;
  special_instructions: string | null;
  status: OrderStatus;
  total_price: number;
  deadline: string | null;
  delivered_file_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderNote {
  id: string;
  order_id: string;
  author_id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
  author?: Pick<Profile, "id" | "full_name" | "avatar_url">;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  changed_by: string;
  from_status: OrderStatus | null;
  to_status: OrderStatus;
  note: string | null;
  changed_at: string;
}

// ─── API / RPC response shapes ─────────────────────────────────────────────────
export interface ClientStats {
  total_orders: number;
  active_orders: number;
  completed_orders: number;
  total_spent: number;
  pending_orders: number;
}

export interface OrdersChartData {
  month: string;
  order_count: number;
}

// ─── Generic helpers ───────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Form shapes ───────────────────────────────────────────────────────────────
export interface CreateOrderInput {
  title: string;
  description: string;
  word_count: number;
  content_type: ContentType;
  tone: ContentTone;
  target_audience: string;
  special_instructions: string;
  deadline: string;
}

export interface UpdateProfileInput {
  full_name: string;
  company: string;
  phone: string;
  timezone: string;
  email_notifications: boolean;
}

// ─── Component prop helpers ────────────────────────────────────────────────────
export interface SelectOption {
  value: string;
  label: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
}

// ─── Next.js page props ────────────────────────────────────────────────────────
export interface PageProps {
  params: Record<string, string>;
  searchParams: Record<string, string | string[] | undefined>;
}
