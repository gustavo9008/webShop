import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const useCartStore = create((set) => ({
    cart: 3,
    addItems: () => set((state) => ({ cart: state.cart + 1 })),
    removeItems: () => set({ cart: 0 }),
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