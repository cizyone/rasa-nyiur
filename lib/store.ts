'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem, OptionItem } from './data';
import { PROMO_CODES } from './utils';

export interface CartItemCustomization {
  groupId: string;
  groupName: string;
  selectedOptions: OptionItem[];
}

export interface CartItem {
  id: string; // unique cart item id (slug + customization hash)
  menuItemId: string;
  slug: string;
  name: string;
  imagePath: string;
  basePrice: number;
  customizations: CartItemCustomization[];
  customizationPrice: number;
  unitPrice: number; // basePrice + customizationPrice
  quantity: number;
  notes: string;
}

interface CartStore {
  items: CartItem[];
  promoCode: string;
  promoApplied: boolean;
  promoType: 'free_delivery' | 'discount' | null;
  promoValue: number;
  promoDescription: string;
  ecoFriendlyCutlery: boolean;
  deliveryFee: number;
  serviceFee: number;

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  setEcoFriendlyCutlery: (value: boolean) => void;

  // Computed
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getDiscount: () => number;
  getTotal: () => number;
}

function generateCartItemId(slug: string, customizations: CartItemCustomization[]): string {
  const customKey = customizations
    .map((c) => `${c.groupId}:${c.selectedOptions.map((o) => o.id).join(',')}`)
    .join('|');
  return `${slug}-${customKey}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: '',
      promoApplied: false,
      promoType: null,
      promoValue: 0,
      promoDescription: '',
      ecoFriendlyCutlery: false,
      deliveryFee: 8000,
      serviceFee: 2000,

      addItem: (newItem) => {
        const id = generateCartItemId(newItem.slug, newItem.customizations);
        const existing = get().items.find((i) => i.id === id);
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + newItem.quantity } : i
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...newItem, id }],
          }));
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => {
        set({
          items: [],
          promoCode: '',
          promoApplied: false,
          promoType: null,
          promoValue: 0,
          promoDescription: '',
        });
      },

      applyPromoCode: (code) => {
        const promo = PROMO_CODES[code.toUpperCase()];
        if (!promo) {
          return { success: false, message: 'Kode promo tidak valid atau sudah kadaluarsa.' };
        }
        set({
          promoCode: code.toUpperCase(),
          promoApplied: true,
          promoType: promo.type,
          promoValue: promo.value,
          promoDescription: promo.description,
        });
        return { success: true, message: promo.description };
      },

      removePromoCode: () => {
        set({
          promoCode: '',
          promoApplied: false,
          promoType: null,
          promoValue: 0,
          promoDescription: '',
        });
      },

      setEcoFriendlyCutlery: (value) => {
        set({ ecoFriendlyCutlery: value });
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },

      getDeliveryFee: () => {
        const { promoApplied, promoType, deliveryFee } = get();
        if (promoApplied && promoType === 'free_delivery') return 0;
        return deliveryFee;
      },

      getDiscount: () => {
        const { promoApplied, promoType, promoValue } = get();
        if (!promoApplied) return 0;
        if (promoType === 'discount') return promoValue;
        return 0;
      },

      getTotal: () => {
        const { serviceFee } = get();
        const subtotal = get().getSubtotal();
        const delivery = get().getDeliveryFee();
        const discount = get().getDiscount();
        return Math.max(0, subtotal + delivery + serviceFee - discount);
      },
    }),
    {
      name: 'rasa-nyiur-cart',
    }
  )
);
