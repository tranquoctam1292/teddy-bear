// Quản lý trạng thái giỏ hàng toàn cục
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, UpsellServices } from '@/types';

interface CartStore {
  items: CartItem[];
  upsellServices: UpsellServices;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  updateUpsellServices: (services: Partial<UpsellServices>) => void;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  getUpsellTotal: () => number;
  getItemCount: () => number;
  getTotalItems: () => number;
  getShippingFee: () => number;
}

const GIFT_WRAPPING_PRICE = 30000;
const EXPRESS_SHIPPING_PRICE = 50000;
const STANDARD_SHIPPING_PRICE = 30000;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      upsellServices: {
        vacuumSealing: false,
        giftWrapping: false,
        expressShipping: false,
      },
      
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          
          return { items: [...state.items, item] };
        }),
      
      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        })),
      
      updateQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        })),
      
      clearCart: () =>
        set({
          items: [],
          upsellServices: {
            vacuumSealing: false,
            giftWrapping: false,
            expressShipping: false,
          },
        }),
      
      updateUpsellServices: (services) =>
        set((state) => ({
          upsellServices: { ...state.upsellServices, ...services },
        })),
      
      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getUpsellTotal: () => {
        const { upsellServices } = get();
        let total = 0;
        if (upsellServices.giftWrapping) {
          total += GIFT_WRAPPING_PRICE;
        }
        // Express shipping is included in shipping fee, not upsell
        return total;
      },
      
      getShippingFee: () => {
        const { upsellServices } = get();
        if (upsellServices.expressShipping) {
          return EXPRESS_SHIPPING_PRICE;
        }
        return STANDARD_SHIPPING_PRICE;
      },
      
      getItemCount: () => {
        const { items } = get();
        return items.length;
      },
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().getSubtotal() + get().getUpsellTotal() + get().getShippingFee();
      },
    }),
    {
      name: 'teddy-shop-cart',
    }
  )
);

