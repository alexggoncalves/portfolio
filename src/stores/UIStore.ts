import { create } from "zustand";

type UIStoreState = {
    interfaceHidden: boolean;
    toggleInterface: () => void;
    setInterfaceHidden: (hidden: boolean) => void;
};

const useUIStore = create<UIStoreState>((set) => ({
    interfaceHidden: false,
    toggleInterface: () => set((s) => ({ interfaceHidden: !s.interfaceHidden })),
    setInterfaceHidden: (hidden) => set({ interfaceHidden: hidden }),
}));

export default useUIStore;
