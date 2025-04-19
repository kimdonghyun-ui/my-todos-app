import { create } from 'zustand';

interface RedirectState {
  linkName: string;
  setLinkName: (linkName: string) => void;
}

export const useRedirectStore = create<RedirectState>((set) => ({
  linkName: '',
  setLinkName: (linkName) => set({ linkName }),
}));
