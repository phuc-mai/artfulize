import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      setCart: (newCart) =>
        set({
          cart: newCart,
        }),
      addToCart: (cartItem) =>
        set((state) => ({
          cart: [...state.cart, cartItem],
        })),
      removeFromCart: (itemId) => 
        set((state) => ({
          cart: state.cart.filter((cartItem) => cartItem.workId !== itemId)
        }))
    }),
    {
      name: "cart-storage",
    }
  )
);

// Syntax to create Zustand Store
//  = create(
//   persist(
//     (set) => ({
//       // Variables to store
//       user: {},
//       setUser: (newInfo) => set({user: newInfo})
//     }),
//     {
//       name: "user-storage",
//     }
//   )
// );
