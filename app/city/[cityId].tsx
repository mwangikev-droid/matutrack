import { useMemo } from 'react';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Bus, MapPin, Route as RouteIcon, Users } from 'lucide-react-native';
import { Button, Typography, useThemeColor } from 'heroui-native';
import { FlatList, View } from 'react-native';

import { CityMap } from '@/components/matatu/CityMap';
import { EmptyState } from '@/components/matatu/EmptyState';
import { InfoTile } from '@/components/matatu/InfoTile';
import { RouteCard } from '@/components/matatu/RouteCard';
import { getCity, getRoutesByCity } from '@/lib/matatu/data';
import { useLiveClock } from '@/lib/matatu/liveStatus';

export default function CityScreen() {
  const { cityId } = useLocalSearchParams<{ cityId: string }>();
  const city = getCity(cityId);
  const { now } = useLiveClock(60000);
  const accent = useThemeColor('accent');

  const routes = useMemo(() => (city ? getRoutesByCity(city.id) : []), [city]);
  const saccos = useMemo(() => new Set(routes.flatMap((route) => route.saccos)).size, [routes]);
  const stages = useMemo(
    () => routes.reduce((total, route) => total + route.stages.length, 0),
    [routes],
  );

  if (!city) {
    return (
      <View className="bg-background flex-1 items-center justify-center px-4">
        <Stack.Screen options={{ title: 'City not found' }} />
        <EmptyState
          icon={<MapPin size={24} color={accent} />}
          title="City not found"
          message="This city is not in the offline dataset yet."
        />
        <Button variant="secondary" onPress={() => router.replace('/')}>
          <Button.Label>Back to cities</Button.Label>
        </Button>
      </View>
    );
  }

  return (
    <View className="bg-background flex-1">
      <Stack.Screen options={{ title: city.name }} />
      <FlatList
        data={routes}
        keyExtractor={(route) => route.id}
        contentContainerStyle={{ gap: 12, padding: 16, paddingBottom: 32 }}
        renderItem={({ item }) => <RouteCard route={item} now={now} />}
        ListHeaderComponent={
          <View className="gap-4 pb-2">
            <View className="gap-1">
              <Typography type="h4">{city.name}</Typography>
              <Typography type="body-sm" color="muted">
                {city.county} · main terminus {city.mainTerminus}
              </Typography>
            </View>

            <Typography type="body-sm" color="muted">
              {city.description}
            </Typography>

            <CityMap city={city} routes={routes} />

            <View className="flex-row gap-2">
              <InfoTile
                label="Routes"
                value={String(routes.length)}
                icon={<RouteIcon size={13} color={accent} />}
              />
              <InfoTile
                label="Stages"
                value={String(stages)}
                icon={<MapPin size={13} color={accent} />}
              />
              <InfoTile
                label="Saccos"
                value={String(saccos)}
                icon={<Users size={13} color={accent} />}
              />
            </View>

            <View className="flex-row items-center gap-2 pt-1">
              <Bus size={16} color={accent} />
              <Typography type="h6">Routes in {city.name}</Typography>
            </View>
          </View>
        }
      />
    </View>
  );
}
