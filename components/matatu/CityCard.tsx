import { router } from 'expo-router';
import { ChevronRight, MapPin, Route as RouteIcon } from 'lucide-react-native';
import { PressableFeedback, Typography, useThemeColor } from 'heroui-native';
import { View } from 'react-native';

import { countRoutes, countStages } from '@/lib/matatu/data';
import type { City } from '@/lib/matatu/types';
import { cityHref } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface CityCardProps {
  city: City;
  accentColor: string;
  className?: string;
}

export function CityCard({ city, accentColor, className }: CityCardProps) {
  const muted = useThemeColor('muted');
  const routes = countRoutes(city.id);
  const stages = countStages(city.id);

  return (
    <PressableFeedback
      accessibilityRole="button"
      accessibilityLabel={`${city.name} matatu routes`}
      onPress={() => router.push(cityHref(city.id))}
      className={cn('flex-row overflow-hidden rounded-2xl border border-border bg-surface', className)}
    >
      <View className="w-2" style={{ backgroundColor: accentColor }} />
      <View className="flex-1 p-4">
        <View className="flex-row items-center gap-2">
          <Typography type="h5" className="flex-1">
            {city.name}
          </Typography>
          <ChevronRight size={18} color={muted} />
        </View>
        <Typography type="body-xs" color="muted">
          {city.county} · {city.tagline}
        </Typography>

        <View className="mt-3 flex-row items-center gap-4">
          <View className="flex-row items-center gap-1.5">
            <RouteIcon size={14} color={accentColor} />
            <Typography type="body-xs" weight="medium">
              {routes} routes
            </Typography>
          </View>
          <View className="flex-row items-center gap-1.5">
            <MapPin size={14} color={accentColor} />
            <Typography type="body-xs" weight="medium">
              {stages} stages
            </Typography>
          </View>
        </View>
      </View>
    </PressableFeedback>
  );
}
