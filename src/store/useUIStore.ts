import { create } from "zustand";
import type{ Customer } from "../types/customer";


interface UIState {
modalOpen: boolean;
editingCustomer: Customer | null;
selectedRows: Customer[];
openModal: () => void;
closeModal: () => void;
setEditing: (c: Customer | null) => void;
setSelectedRows: (rows: Customer[]) => void;
}


export const useUIStore = create<UIState>((set) => ({
modalOpen: false,
editingCustomer: null,
selectedRows: [],


openModal: () => set({ modalOpen: true }),
closeModal: () => set({ modalOpen: false, editingCustomer: null }),
setEditing: (c) => set({ editingCustomer: c }),
setSelectedRows: (rows) => set({ selectedRows: rows }),
}));