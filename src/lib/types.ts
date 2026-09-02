export type Store = "D1" | "Mercar" | "Otro";

export type EventItemStatus = "pendiente" | "confirmado" | "pagado";

export type Profile = {
  id: string;
  full_name: string | null;
  couple_id: string | null;
};

export type Couple = {
  id: string;
  invite_code: string;
  created_at: string;
};

export type MarketItem = {
  id: string;
  couple_id: string;
  store: Store;
  store_other: string | null;
  product_name: string;
  price: number;
  quantity: number;
  purchased_at: string;
  created_by: string;
  created_at: string;
};

export type ImportantDate = {
  id: string;
  couple_id: string;
  title: string;
  date: string;
  is_recurring: boolean;
  notes: string | null;
  created_at: string;
};

export type EventRow = {
  id: string;
  couple_id: string;
  title: string;
  event_date: string | null;
  description: string | null;
  created_at: string;
};

export type EventCategory = {
  id: string;
  event_id: string;
  name: string;
  created_at: string;
};

export type EventItem = {
  id: string;
  category_id: string;
  name: string;
  estimated_cost: number | null;
  actual_cost: number | null;
  status: EventItemStatus;
  notes: string | null;
  family: string | null;
  table_number: string | null;
  ingredients: string | null;
  created_at: string;
};

export const DEFAULT_EVENT_CATEGORIES = [
  "Comida",
  "Mesas",
  "Manteles",
  "Invitados",
  "Snacks",
  "Anillos",
  "Traje",
];

export const GUEST_CATEGORY_NAME = "Invitados";
export const FOOD_CATEGORY_NAME = "Comida";

export type CategoryKind = "guest" | "food" | "generic";

export function getCategoryKind(categoryName: string): CategoryKind {
  if (categoryName === GUEST_CATEGORY_NAME) return "guest";
  if (categoryName === FOOD_CATEGORY_NAME) return "food";
  return "generic";
}
