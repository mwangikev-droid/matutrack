import { router } from 'expo-router';
import { Clock, Users } from 'lucide-react-native';
import { PressableFeedback, Typography, useThemeColor } from 'heroui-native';
import { View } from 'react-native';

import { RouteBadge } from '@/components/matatu/RouteBadge';
import { StatusPill } from '@/components/matatu/StatusPill';
import { getCity } from '@/lib/matatu/data';
import type { RouteStatus } from '@/lib/matatu/liveStatus';
import type { MatatuRoute } from '@/lib/matatu/types';
import { routeHref } from '@/lib/navigation';

const BAR_COLORS = {
  clear: '#16a34a',
  busy: '#f59e0b',
  packed: '#dc2626',
} as const;

interface LiveStatusCardProps {
  route: MatatuRoute;
  status: RouteStatus;
  showCity?: boolean;
}

export function LiveStatusCard({ route, status, showCity = true }: LiveStatusCardProps) {
  const muted = useThemeColor('muted');
  const city = getCity(route.cityId);

  return (
    <PressableFeedback
      accessibilityRole="button"
      accessibilityLabel={`${route.number} ${route.from} to ${route.to}, ${status.crowdLabel}`}
      onPress={() => router.push(routeHref(route.id))}
      className="border-border bg-surface rounded-2xl border p-3.5"
    >
      <View className="flex-row items-center gap-3">
        <RouteBadge number={route.number} color={route.color} size="sm" />
        <View className="flex-1">
          <Typography type="body-sm" weight="semibold" numberOfLines={1}>
            {route.from} → {route.to}
          </Typography>
          <Typography type="body-xs" color="muted" numberOfLines={1}>
            {showCity && city ? `${city.name} · ` : ''}
            {route.corridor}
          </Typography>
        </View>
        <StatusPill crowd={status.crowd} label={status.crowdLabel} />
      </View>

      <View className="bg-surface-secondary mt-3 h-2 overflow-hidden rounded-full">
        <View
          style={{
            backgroundColor: BAR_COLORS[status.crowd],
            height: '100%',
            width: `${status.occupancy}%`,
          }}
        />
      </View>

      <View className="mt-2.5 flex-row items-center gap-4">
        <View className="flex-row items-center gap-1.5">
          <Users size={13} color={muted} />
          <Typography type="body-xs" color="muted">
            {status.occupancy}% full
          </Typography>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Clock size={13} color={muted} />
          <Typography type="body-xs" color="muted">
            {status.waitMin} min wait
          </Typography>
        </View>
        <Typography type="body-xs" color="muted">
          {status.delayMin > 0 ? `+${status.delayMin} min delay` : 'On time'}
        </Typography>
      </View>
    </PressableFeedback>
  );
}
