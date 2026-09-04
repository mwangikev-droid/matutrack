import { Stack, router, useLocalSearchParams } from 'expo-router';
import {
  Banknote,
  Bus,
  Clock,
  Gauge,
  MapPin,
  Repeat,
  Route as RouteIcon,
  Users,
} from 'lucide-react-native';
import { Button, Chip, Typography, useThemeColor } from 'heroui-native';
import { ScrollView, View } from 'react-native';

import { EmptyState } from '@/components/matatu/EmptyState';
import { FareEstimator } from '@/components/matatu/FareEstimator';
import { FavouriteButton } from '@/components/matatu/FavouriteButton';
import { InfoTile } from '@/components/matatu/InfoTile';
import { RouteBadge } from '@/components/matatu/RouteBadge';
import { RouteMap } from '@/components/matatu/RouteMap';
import { StageTimeline } from '@/components/matatu/StageTimeline';
import { StatusPill } from '@/components/matatu/StatusPill';
import { getCity, getRoute } from '@/lib/matatu/data';
import { isPeakTime } from '@/lib/matatu/fares';
import { routeStatus, useLiveClock } from '@/lib/matatu/liveStatus';
import { fareText } from '@/lib/matatu/types';
import { cityHref } from '@/lib/navigation';
import { cn } from '@/lib/utils';

const BAR_COLORS = {
  clear: '#16a34a',
  busy: '#f59e0b',
  packed: '#dc2626',
} as const;

export default function RouteScreen() {
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const route = getRoute(routeId);
  const { now } = useLiveClock(30000);
  const [accent, muted] = useThemeColor(['accent', 'muted']);

  if (!route) {
    return (
      <View className="bg-background flex-1 items-center justify-center px-4">
        <Stack.Screen options={{ title: 'Route not found' }} />
        <EmptyState
          icon={<RouteIcon size={24} color={accent} />}
          title="Route not found"
          message="This route is not in the offline dataset yet."
        />
        <Button variant="secondary" onPress={() => router.replace('/routes')}>
          <Button.Label>Browse routes</Button.Label>
        </Button>
      </View>
    );
  }

  const city = getCity(route.cityId);
  const status = routeStatus(route, now);
  const peak = isPeakTime(now);

  return (
    <View className="bg-background flex-1">
      <Stack.Screen options={{ title: `Route ${route.number}` }} />
      <ScrollView contentContainerStyle={{ gap: 16, padding: 16, paddingBottom: 40 }}>
        <View className="border-border bg-surface gap-3 rounded-2xl border p-4">
          <View className="flex-row items-center gap-3">
            <RouteBadge number={route.number} color={route.color} size="lg" />
            <View className="flex-1">
              <Typography type="h5">
                {route.from} → {route.to}
              </Typography>
              <Typography type="body-xs" color="muted">
                {route.corridor}
              </Typography>
            </View>
            <FavouriteButton routeId={route.id} size={22} />
          </View>

          {city ? (
            <View className="flex-row">
              <Chip size="sm" variant="secondary" onPress={() => router.push(cityHref(city.id))}>
                <MapPin size={12} color={muted} />
                <Chip.Label>{city.name}</Chip.Label>
              </Chip>
            </View>
          ) : null}
        </View>

        <RouteMap route={route} />

        <View className="border-border bg-surface gap-3 rounded-2xl border p-4">
          <View className="flex-row items-center gap-2">
            <Typography type="h6" className="flex-1">
              Right now
            </Typography>
            <StatusPill crowd={status.crowd} label={status.crowdLabel} />
          </View>

          <View className="bg-surface-secondary h-2 overflow-hidden rounded-full">
            <View
              style={{
                backgroundColor: BAR_COLORS[status.crowd],
                height: '100%',
                width: `${status.occupancy}%`,
              }}
            />
          </View>

          <Typography type="body-sm" color="muted">
            {status.headline}
          </Typography>

          <View className="flex-row gap-2">
            <InfoTile
              label="Seats taken"
              value={`${status.occupancy}%`}
              icon={<Users size={13} color={muted} />}
            />
            <InfoTile
              label="Next vehicle"
              value={`${status.waitMin} min`}
              icon={<Clock size={13} color={muted} />}
            />
            <InfoTile
              label="Vehicles out"
              value={String(status.vehiclesActive)}
              icon={<Bus size={13} color={muted} />}
            />
          </View>

          <Typography type="body-xs" color="muted">
            Estimated offline from the route profile and time of day, not a live vehicle feed.
          </Typography>
        </View>

        <View className="border-border bg-surface gap-3 rounded-2xl border p-4">
          <View className="flex-row items-center gap-2">
            <Banknote size={16} color={accent} />
            <Typography type="h6">Full-route fare</Typography>
          </View>

          <View className="flex-row gap-2">
            <View
              className={cn(
                'flex-1 rounded-xl p-3',
                peak ? 'bg-surface-secondary' : 'bg-matatu-green-soft',
              )}
            >
              <Typography type="body-xs" color="muted">
                Off-peak {peak ? '' : '· now'}
              </Typography>
              <Typography type="h6" className="mt-0.5">
                {fareText(route.offPeakFare)}
              </Typography>
            </View>
            <View
              className={cn(
                'flex-1 rounded-xl p-3',
                peak ? 'bg-matatu-amber-soft' : 'bg-surface-secondary',
              )}
            >
              <Typography type="body-xs" color="muted">
                Peak {peak ? '· now' : ''}
              </Typography>
              <Typography type="h6" className="mt-0.5">
                {fareText(route.peakFare)}
              </Typography>
            </View>
          </View>

          <View className="flex-row gap-2">
            <InfoTile
              label="Distance"
              value={`${route.distanceKm} km`}
              icon={<RouteIcon size={13} color={muted} />}
            />
            <InfoTile
              label="Journey"
              value={`${route.durationMin} min`}
              icon={<Gauge size={13} color={muted} />}
            />
            <InfoTile
              label="Every"
              value={`${route.frequencyMin} min`}
              icon={<Repeat size={13} color={muted} />}
            />
          </View>

          <View className="flex-row gap-2">
            <InfoTile
              label="Operating hours"
              value={route.operatingHours}
              icon={<Clock size={13} color={muted} />}
            />
            <InfoTile
              label="Vehicle"
              value={route.vehicle}
              icon={<Bus size={13} color={muted} />}
            />
          </View>
        </View>

        <FareEstimator route={route} now={now} />

        <View className="border-border bg-surface gap-3 rounded-2xl border p-4">
          <View className="flex-row items-center gap-2">
            <Users size={16} color={accent} />
            <Typography type="h6">Saccos on this route</Typography>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {route.saccos.map((sacco) => (
              <Chip key={sacco} size="sm" variant="secondary">
                <Chip.Label>{sacco}</Chip.Label>
              </Chip>
            ))}
          </View>
          <Typography type="body-sm" color="muted">
            {route.notes}
          </Typography>
        </View>

        <View className="border-border bg-surface gap-3 rounded-2xl border p-4">
          <View className="flex-row items-center gap-2">
            <MapPin size={16} color={accent} />
            <Typography type="h6">Stages ({route.stages.length})</Typography>
          </View>
          <StageTimeline route={route} />
        </View>
      </ScrollView>
    </View>
  );
}
