'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const DEFAULT_ADDRESS = 'Tikala, Manado - Jl. Sam Ratulangi No. 42';

export interface AddressCoordinates {
  latitude: number;
  longitude: number;
}

interface AddressStore {
  address: string;
  latitude: number | null;
  longitude: number | null;
  hasCoordinates: () => boolean;
  setAddress: (address: string, coordinates?: AddressCoordinates | null) => void;
  resetAddress: () => void;
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      address: DEFAULT_ADDRESS,
      latitude: null,
      longitude: null,

      hasCoordinates: () => get().latitude !== null && get().longitude !== null,

      setAddress: (address, coordinates) =>
        set({
          address: address.trim() || DEFAULT_ADDRESS,
          latitude: coordinates?.latitude ?? null,
          longitude: coordinates?.longitude ?? null,
        }),

      resetAddress: () =>
        set({
          address: DEFAULT_ADDRESS,
          latitude: null,
          longitude: null,
        }),
    }),
    { name: 'rasa-nyiur-address' }
  )
);

/** Tautan Google Maps untuk koordinat tertentu. */
export function getGoogleMapsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

/** Tautan embed OpenStreetMap (tanpa API key) dengan marker. */
export function getOsmEmbedUrl(latitude: number, longitude: number): string {
  const delta = 0.004;
  const bbox = [longitude - delta, latitude - delta, longitude + delta, latitude + delta]
    .map((n) => n.toFixed(6))
    .join('%2C');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

/** Ambil alamat dari koordinat menggunakan Nominatim (OpenStreetMap). */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      format: 'jsonv2',
      lat: String(latitude),
      lon: String(longitude),
      zoom: '18',
      addressdetails: '1',
      'accept-language': 'id',
    });
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data: { display_name?: string } = await res.json();
    return data.display_name ?? null;
  } catch {
    return null;
  }
}

/** Format koordinat untuk disimpan pada alamat pesanan. */
export function formatCoordinatesText(latitude: number, longitude: number): string {
  return `Koordinat GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}
