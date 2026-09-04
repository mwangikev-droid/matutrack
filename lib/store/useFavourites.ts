import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface FavouritesState {
  routeIds: string[];
  hasHydrated: boolean;
  toggle: (routeId: string) => void;
  remove: (routeId: string) => void;
  clear: () => void;
}

export const useFavouritesStore = create<FavouritesState>()(
  persist(
    (set) => ({
      routeIds: [],
      hasHydrated: false,
      toggle: (routeId) =>
        set((state) => ({
          routeIds: state.routeIds.includes(routeId)
            ? state.routeIds.filter((id) => id !== routeId)
            : [routeId, ...state.routeIds],
        })),
      remove: (routeId) =>
        set((state) => ({ routeIds: state.routeIds.filter((id) => id !== routeId) })),
      clear: () => set({ routeIds: [] }),
    }),
    {
      name: 'matatu-favourites',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ routeIds: state.routeIds }),
    },
  ),
);

function markHydrated() {
  useFavouritesStore.setState({ hasHydrated: true });
}

useFavouritesStore.persist.onFinishHydration(markHydrated);
if (useFavouritesStore.persist.hasHydrated()) markHydrated();

export function useIsFavourite(routeId: string) {
  return useFavouritesStore((state) => state.routeIds.includes(routeId));
}

export function useFavouriteCount() {
  return useFavouritesStore((state) => state.routeIds.length);
}
