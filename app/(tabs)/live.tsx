import { useMemo, useState } from 'react';
import { Info, RefreshCw } from 'lucide-react-native';
import { Button, Chip, Typography, useThemeColor } from 'heroui-native';
import { FlatList, ScrollView, View } from 'react-native';

import { LiveStatusCard } from '@/components/matatu/LiveStatusCard';
import { CITIES, ROUTES, getRoutesByCity } from '@/lib/matatu/data';
import { isPeakTime } from '@/lib/matatu/fares';
import { formatClock, routeStatus, useLiveClock, type CrowdLevel } from '@/lib/matatu/liveStatus';

const SEVERITY: Record<CrowdLevel, number> = { packed: 0, busy: 1, clear: 2 };

export default function LiveScreen() {
  const { now, refresh } = useLiveClock(30000);
  const [cityId, setCityId] = useState<string | undefined>(undefined);
  const muted = useThemeColor('muted');
  const peak = isPeakTime(now);

  const board = useMemo(() => {
    const routes = cityId ? getRoutesByCity(cityId) : ROUTES;
    const withStatus = routes.map((route) => ({ route, status: routeStatus(route, now) }));
    return withStatus.sort((left, right) => {
      const bySeverity = SEVERITY[left.status.crowd] - SEVERITY[right.status.crowd];
      if (bySeverity !== 0) return bySeverity;
      return right.status.occupancy - left.status.occupancy;
    });
  }, [cityId, now]);

  const packed = board.filter((entry) => entry.status.crowd === 'packed').length;
  const busy = board.filter((entry) => entry.status.crowd === 'busy').length;
  const clear = board.length - packed - busy;

  return (
    <View className="bg-background flex-1">
      <FlatList
        data={board}
        keyExtractor={(entry) => entry.route.id}
        contentContainerStyle={{ gap: 12, padding: 16, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <LiveStatusCard route={item.route} status={item.status} showCity={!cityId} />
        )}
        ListHeaderComponent={
          <View className="gap-4 pb-2">
            <View className="border-border bg-surface flex-row items-center gap-3 rounded-2xl border p-4">
              <View className="flex-1">
                <Typography type="body-sm" weight="semibold">
                  {formatClock(now)} · {peak ? 'Peak load' : 'Off-peak load'}
                </Typography>
                <Typography type="body-xs" color="muted">
                  {packed} packed · {busy} filling up · {clear} moving well
                </Typography>
              </View>
              <Button size="sm" variant="secondary" onPress={refresh}>
                <RefreshCw size={14} color={muted} />
                <Button.Label>Refresh</Button.Label>
              </Button>
            </View>

            <View className="bg-surface-secondary flex-row items-start gap-2 rounded-2xl p-3.5">
              <Info size={16} color={muted} />
              <Typography type="body-xs" color="muted" className="flex-1">
                Crowd levels are modelled from each route&apos;s profile and the time of day. The
                app runs fully offline, so this board is an estimate rather than a live vehicle
                feed.
              </Typography>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingRight: 8 }}
            >
              <Chip
                size="sm"
                variant={cityId === undefined ? 'primary' : 'secondary'}
                onPress={() => setCityId(undefined)}
              >
                <Chip.Label>All cities</Chip.Label>
              </Chip>
              {CITIES.map((city) => (
                <Chip
                  key={city.id}
                  size="sm"
                  variant={cityId === city.id ? 'primary' : 'secondary'}
                  onPress={() => setCityId(city.id)}
                >
                  <Chip.Label>{city.name}</Chip.Label>
                </Chip>
              ))}
            </ScrollView>
          </View>
        }
      />
    </View>
  );
}
