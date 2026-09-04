import { useMemo } from 'react';
import { View } from 'react-native';

import MapView from '@/components/MapView';
import type { MapMarker, MapPolyline, MapRegion } from '@/components/MapView.types';
import type { MatatuRoute } from '@/lib/matatu/types';

interface RouteMapProps {
  route: MatatuRoute;
  height?: number;
}

function regionForRoute(route: MatatuRoute): MapRegion {
  const latitudes = route.stages.map((stage) => stage.latitude);
  const longitudes = route.stages.map((stage) => stage.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(0.03, (maxLat - minLat) * 1.6),
    longitudeDelta: Math.max(0.03, (maxLng - minLng) * 1.6),
  };
}

/** Route corridor drawn as a polyline with a marker at every stage. */
export function RouteMap({ route, height = 240 }: RouteMapProps) {
  const region = useMemo(() => regionForRoute(route), [route]);

  const markers = useMemo<MapMarker[]>(
    () =>
      route.stages.map((stage, index) => ({
        id: `${route.id}-${index}`,
        coordinate: { latitude: stage.latitude, longitude: stage.longitude },
        title: stage.name,
        description: stage.landmark ?? `Stage ${index + 1} of ${route.stages.length}`,
        color: route.color,
      })),
    [route],
  );

  const polylines = useMemo<MapPolyline[]>(
    () => [
      {
        id: route.id,
        coordinates: route.stages.map((stage) => ({
          latitude: stage.latitude,
          longitude: stage.longitude,
        })),
        strokeColor: route.color,
        strokeWidth: 4,
      },
    ],
    [route],
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
