import { router } from 'expo-router';
import { Star } from 'lucide-react-native';
import { Button, Spinner, Typography, useThemeColor } from 'heroui-native';
import { FlatList, View } from 'react-native';

import { EmptyState } from '@/components/matatu/EmptyState';
import { RouteCard } from '@/components/matatu/RouteCard';
import { getRoutes } from '@/lib/matatu/data';
import { useLiveClock } from '@/lib/matatu/liveStatus';
import { useFavouritesStore } from '@/lib/store/useFavourites';

export default function SavedScreen() {
  const routeIds = useFavouritesStore((state) => state.routeIds);
  const hasHydrated = useFavouritesStore((state) => state.hasHydrated);
  const clear = useFavouritesStore((state) => state.clear);
  const { now } = useLiveClock(60000);
  const muted = useThemeColor('muted');

  const routes = getRoutes(routeIds);

  if (!hasHydrated) {
    return (
      <View className="bg-background flex-1 items-center justify-center">
        <Spinner />
      </View>
    );
  }

  if (routes.length === 0) {
    return (
      <View className="bg-background flex-1 items-center justify-center px-4">
        <EmptyState
          icon={<Star size={24} color={muted} />}
          title="No saved routes yet"
          message="Tap the star on any route to keep it here for quick fare and crowd checks."
        />
        <Button variant="secondary" onPress={() => router.push('/routes')}>
          <Button.Label>Browse routes</Button.Label>
        </Button>
      </View>
    );
  }

  return (
    <View className="bg-background flex-1">
      <FlatList
        data={routes}
        keyExtractor={(route) => route.id}
        contentContainerStyle={{ gap: 12, padding: 16, paddingBottom: 32 }}
        ListHeaderComponent={
          <View className="flex-row items-center justify-between pb-1">
            <Typography type="body-xs" color="muted">
              {routes.length} saved {routes.length === 1 ? 'route' : 'routes'}
            </Typography>
            <Button size="sm" variant="tertiary" onPress={clear}>
              <Button.Label>Clear all</Button.Label>
            </Button>
          </View>
        }
        renderItem={({ item }) => <RouteCard route={item} now={now} showCity />}
      />
    </View>
  );
}
