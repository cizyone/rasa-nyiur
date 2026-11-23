'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const DEFAULT_ADDRESS = 'Tikala, Manado - Jl. Sam Ratulangi No. 42';

interface AddressStore {
  address: string;
  setAddress: (address: string) => void;
  resetAddress: () => void;
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set) => ({
      address: DEFAULT_ADDRESS,
      setAddress: (address) => set({ address: address.trim() || DEFAULT_ADDRESS }),
      resetAddress: () => set({ address: DEFAULT_ADDRESS }),
    }),
    { name: 'rasa-nyiur-address' }
  )
);
