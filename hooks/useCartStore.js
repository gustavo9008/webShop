import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { axiosFetch } from "@/utils/axiosFetch.js";


const useCartStore = create((set) => ({
    cartId: null,
    cartURL: null,
    estimatedCost: {
        subtotalAmount: {
            amount: 0.00
        },
        totalAmount: {
            amount: 0.00
        },
        totalTaxAmount: {
            amount: 0.00
        },
    },
    cartQuantity: null,
    cartItems: null,
    animateCart: false,
    addCart: async (newCart) => {
        let updateCartItems = newCart?.cartItems;
        set((state) => ({
            cartId: newCart.cartId ? newCart.cartId : state.cartId, cartURL: newCart.cartUrl ? newCart.cartUrl : state.cartURL, estimatedCost: newCart?.estimatedCost ? newCart.estimatedCost : state.estimatedCost, cartItems: newCart?.cartItems ? updateCartItems : state.cartItems, cartQuantity: newCart.cartQuantity ? newCart.cartQuantity : state.cartQuantity,
        }))
    },
    addCardId: (newId) => set((state) => ({
        cartId: newId,
    })),
    addCartURL: (newUrl) => set((state) => ({
        cartURL: newUrl
    })),
    removeItems: () => set({ cartQuantity: 0 }),
    setAnimateCart: async (bool) => {
        set((state) => ({ animateCart: bool }))
    },
}));
const useItemState = create((set) => ({
    item: null,
    variantItem: {
        color: null,
        size: null,
    },
    addItem: (item) => set((state) => ({ item: item })),
    setVariantItem: (variant) => set((state) => ({
        variantItem: {
            ...state.variantItem,
            ...variant

        }
    })),
    removeItem: () => set({ item: {} }),
}));
const useSelectVariant = create

const states = {
    useCartStore,
    useItemState,
}

export { useCartStore, useItemState };