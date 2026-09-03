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

export const EVENT_CATEGORY_GROUPS = [
  "Logística y decoración",
  "Comida y bebidas",
  "Vestuario y accesorios",
  "Invitados",
  "Documentos y legal",
  "Otros",
] as const;

export type EventCategoryGroup = (typeof EVENT_CATEGORY_GROUPS)[number];

export const DEFAULT_CATEGORY_GROUP: EventCategoryGroup = "Otros";

export type EventCategory = {
  id: string;
  event_id: string;
  name: string;
  group_name: EventCategoryGroup;
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
  photo_path: string | null;
  photo_url: string | null;
  created_at: string;
};

export const DEFAULT_EVENT_CATEGORIES: { name: string; group: EventCategoryGroup }[] = [
  { name: "Mesas", group: "Logística y decoración" },
  { name: "Manteles", group: "Logística y decoración" },
  { name: "Comida", group: "Comida y bebidas" },
  { name: "Snacks", group: "Comida y bebidas" },
  { name: "Invitados", group: "Invitados" },
  { name: "Anillos", group: "Vestuario y accesorios" },
  { name: "Traje", group: "Vestuario y accesorios" },
];

export const GUEST_CATEGORY_NAME = "Invitados";
export const FOOD_CATEGORY_NAME = "Comida";

export type CategoryKind = "guest" | "food" | "generic";

export function getCategoryKind(categoryName: string): CategoryKind {
  if (categoryName === GUEST_CATEGORY_NAME) return "guest";
  if (categoryName === FOOD_CATEGORY_NAME) return "food";
  return "generic";
}

export const EVENT_PHOTOS_BUCKET = "event-photos";

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "heic", "heif", "avif"];

export function isImagePath(path: string | null): boolean {
  if (!path) return false;
  const ext = path.split(".").pop()?.toLowerCase();
  return !!ext && IMAGE_EXTENSIONS.includes(ext);
}
