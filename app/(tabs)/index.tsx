import { useMemo } from 'react';
import { router } from 'expo-router';
import { Bus, Clock, MapPin, Search } from 'lucide-react-native';
import { PressableFeedback, Typography, useThemeColor } from 'heroui-native';
import { FlatList, View } from 'react-native';

import { CityCard } from '@/components/matatu/CityCard';
import { LinearGradient } from '@/components/ui/primitives/LinearGradient';
import { CITIES, ROUTES } from '@/lib/matatu/data';
import { isPeakTime, peakWindowLabel } from '@/lib/matatu/fares';
import { formatClock, useLiveClock } from '@/lib/matatu/liveStatus';

const CITY_ACCENTS = [
  '#16a34a',
  '#0ea5e9',
  '#f97316',
  '#7c3aed',
  '#dc2626',
  '#0891b2',
  '#db2777',
  '#ca8a04',
];

const HERO_TEXT = { color: '#ffffff' } as const;
const HERO_SUBTEXT = { color: 'rgba(255,255,255,0.85)' } as const;
const HERO_TILE = { backgroundColor: 'rgba(255,255,255,0.16)' } as const;

interface HeroStatProps {
  value: string;
  label: string;
}

function HeroStat({ value, label }: HeroStatProps) {
  return (
    <View className="flex-1 rounded-2xl p-3" style={HERO_TILE}>
      <Typography type="h5" style={HERO_TEXT}>
        {value}
      </Typography>
      <Typography type="body-xs" style={HERO_SUBTEXT}>
        {label}
      </Typography>
    </View>
  );
}

function HeroHeader({ now }: { now: Date }) {
  const peak = isPeakTime(now);
  const [muted, accent] = useThemeColor(['muted', 'accent']);
  const totalStages = useMemo(
    () => ROUTES.reduce((total, route) => total + route.stages.length, 0),
    [],
  );

  return (
    <View className="gap-4 pb-4">
      <LinearGradient
        colors={['#15803d', '#0f766e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="gap-4 rounded-3xl p-5"
      >
        <View className="flex-row items-center gap-2">
          <Bus size={20} color="#ffffff" />
          <Typography type="body-sm" weight="semibold" style={HERO_TEXT}>
            MatuTrack
          </Typography>
        </View>

        <View className="gap-1">
          <Typography type="h3" style={HERO_TEXT}>
            Matatu routes across Kenya
          </Typography>
          <Typography type="body-sm" style={HERO_SUBTEXT}>
            Stages, saccos, fares and crowd levels for every numbered route, stored offline on your
            phone.
          </Typography>
        </View>

        <View className="flex-row gap-2">
          <HeroStat value={String(CITIES.length)} label="Cities" />
          <HeroStat value={String(ROUTES.length)} label="Routes" />
          <HeroStat value={String(totalStages)} label="Stages" />
        </View>
      </LinearGradient>

      <PressableFeedback
        accessibilityRole="button"
        accessibilityLabel="Search routes, stages and saccos"
        onPress={() => router.push('/routes')}
        className="border-border bg-surface flex-row items-center gap-2 rounded-2xl border px-4 py-3.5"
      >
        <Search size={18} color={muted} />
        <Typography type="body-sm" color="muted">
          Search a route, stage or sacco
        </Typography>
      </PressableFeedback>

      <View className="border-border bg-surface flex-row items-center gap-3 rounded-2xl border p-4">
        <View className="bg-surface-secondary h-10 w-10 items-center justify-center rounded-full">
          <Clock size={18} color={peak ? '#b45309' : accent} />
        </View>
        <View className="flex-1">
          <Typography type="body-sm" weight="semibold">
            {formatClock(now)} · {peak ? 'Peak hours' : 'Off-peak hours'}
          </Typography>
          <Typography type="body-xs" color="muted">
            {peakWindowLabel(now)}
          </Typography>
        </View>
      </View>

      <View className="flex-row items-center gap-2 pt-1">
        <MapPin size={16} color={accent} />
        <Typography type="h6">Pick a city</Typography>
      </View>
    </View>
  );
}

export default function CitiesScreen() {
  const { now } = useLiveClock(60000);

  return (
    <View className="bg-background flex-1">
      <FlatList
        data={CITIES}
        keyExtractor={(city) => city.id}
        ListHeaderComponent={<HeroHeader now={now} />}
        contentContainerStyle={{ gap: 12, padding: 16, paddingBottom: 32 }}
        renderItem={({ item, index }) => (
          <CityCard
            city={item}
            accentColor={CITY_ACCENTS[index % CITY_ACCENTS.length] ?? '#16a34a'}
          />
        )}
      />
    </View>
  );
}
