import type { Property } from "./api";

// Local storage key for customer wishlist
const KEY = "stayease_wishlist";

export type SavedProperty = Pick<
  Property,
  "_id" | "name" | "city" | "country" | "price" | "images" | "defaultRoomImages" | "amenities"
> & { savedAt: string };

const read = (): SavedProperty[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as SavedProperty[];
    return [];
  } catch {
    return [];
  }
};

const write = (items: SavedProperty[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

export const Wishlist = {
  list(): SavedProperty[] {
    return read();
  },
  isSaved(id: string): boolean {
    return read().some((i) => i._id === id);
  },
  add(p: Property): void {
    const items = read();
    if (items.find((i) => i._id === p._id)) return;
    const saved: SavedProperty = {
      _id: p._id,
      name: p.name,
      city: p.city,
      country: p.country,
      price: p.price,
      images: p.images || [],
      defaultRoomImages: p.defaultRoomImages || [],
      amenities: p.amenities || [],
      savedAt: new Date().toISOString(),
    };
    items.unshift(saved);
    write(items);
  },
  remove(id: string): void {
    const items = read().filter((i) => i._id !== id);
    write(items);
  },
  toggle(p: Property): boolean {
    if (this.isSaved(p._id)) {
      this.remove(p._id);
      return false;
    }
    this.add(p);
    return true;
  },
  clear(): void {
    write([]);
  },
};

export default Wishlist;
