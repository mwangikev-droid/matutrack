import { useMemo } from 'react';
import { View } from 'react-native';

import MapView from '@/components/MapView';
import type { MapMarker, MapPolyline, MapRegion } from '@/components/MapView.types';
import type { City, MatatuRoute } from '@/lib/matatu/types';

interface CityMapProps {
  city: City;
  routes: MatatuRoute[];
  height?: number;
}

function regionForRoutes(city: City, routes: MatatuRoute[]): MapRegion {
  const stages = routes.flatMap((route) => route.stages);
  if (stages.length === 0) {
    return {
      latitude: city.latitude,
      longitude: city.longitude,
      latitudeDelta: 0.12,
      longitudeDelta: 0.12,
    };
  }

  const latitudes = stages.map((stage) => stage.latitude);
  const longitudes = stages.map((stage) => stage.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(0.05, (maxLat - minLat) * 1.4),
    longitudeDelta: Math.max(0.05, (maxLng - minLng) * 1.4),
  };
}

/** Every route in a city drawn together so the network shape is visible. */
export function CityMap({ city, routes, height = 220 }: CityMapProps) {
  const region = useMemo(() => regionForRoutes(city, routes), [city, routes]);

  const polylines = useMemo<MapPolyline[]>(
    () =>
      routes.map((route) => ({
        id: route.id,
        coordinates: route.stages.map((stage) => ({
          latitude: stage.latitude,
          longitude: stage.longitude,
        })),
        strokeColor: route.color,
        strokeWidth: 3,
      })),
    [routes],
  );

  const markers = useMemo<MapMarker[]>(
    () =>
      routes.flatMap((route) => {
        const terminus = route.stages.at(-1);
        if (!terminus) return [];
        return [
          {
            id: `${route.id}-terminus`,
            coordinate: { latitude: terminus.latitude, longitude: terminus.longitude },
            title: `${route.number} · ${terminus.name}`,
            description: route.corridor,
            color: route.color,
          },
        ];
      }),
    [routes],
  );

  return (
    <View className="border-border overflow-hidden rounded-2xl border" style={{ height }}>
      <MapView
        initialRegion={region}
        markers={markers}
        polylines={polylines}
        showsCompass={false}
        showsScale={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        style={{ flex: 1 }}
      />
    </View>
  );
}
