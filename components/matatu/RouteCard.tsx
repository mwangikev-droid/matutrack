import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { PressableFeedback, Typography, useThemeColor } from 'heroui-native';
import { View } from 'react-native';

import { FavouriteButton } from '@/components/matatu/FavouriteButton';
import { RouteBadge } from '@/components/matatu/RouteBadge';
import { StatusPill } from '@/components/matatu/StatusPill';
import { getCity } from '@/lib/matatu/data';
import { currentFare, isPeakTime } from '@/lib/matatu/fares';
import { routeStatus } from '@/lib/matatu/liveStatus';
import { fareText, type MatatuRoute } from '@/lib/matatu/types';
import { routeHref } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface RouteCardProps {
  route: MatatuRoute;
  now: Date;
  showCity?: boolean;
  className?: string;
}

export function RouteCard({ route, now, showCity = false, className }: RouteCardProps) {
  const status = routeStatus(route, now);
  const fare = currentFare(route, now);
  const peak = isPeakTime(now);
  const city = getCity(route.cityId);
  const muted = useThemeColor('muted');

  return (
    <PressableFeedback
      accessibilityRole="button"
      accessibilityLabel={`${route.number} ${route.from} to ${route.to}`}
      onPress={() => router.push(routeHref(route.id))}
      className={cn('rounded-2xl border border-border bg-surface p-3.5', className)}
    >
      <View className="flex-row items-center gap-3">
        <RouteBadge number={route.number} color={route.color} />
        <View className="flex-1">
          <Typography type="body" weight="semibold" numberOfLines={1}>
            {route.from} → {route.to}
          </Typography>
          <Typography type="body-xs" color="muted" numberOfLines={1}>
            {showCity && city ? `${city.name} · ` : ''}
            {route.corridor}
          </Typography>
        </View>
        <FavouriteButton routeId={route.id} />
      </View>

      <View className="mt-3 flex-row items-center gap-2">
        <StatusPill crowd={status.crowd} label={status.crowdLabel} />
        <View className="rounded-full bg-surface-secondary px-2.5 py-1">
          <Typography type="body-xs" weight="semibold">
            {fareText(fare)}
            <Typography type="body-xs" color="muted">
              {peak ? ' peak' : ' off-peak'}
            </Typography>
          </Typography>
        </View>
        <View className="flex-1" />
        <Typography type="body-xs" color="muted">
          {status.waitMin} min wait
        </Typography>
        <ChevronRight size={16} color={muted} />
      </View>
    </PressableFeedback>
  );
}
