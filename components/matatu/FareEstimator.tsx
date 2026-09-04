import { useState } from 'react';
import { Chip, Typography } from 'heroui-native';
import { ScrollView, View } from 'react-native';

import { estimateFare, isPeakTime, peakWindowLabel } from '@/lib/matatu/fares';
import { fareText, type MatatuRoute } from '@/lib/matatu/types';
import { cn } from '@/lib/utils';

interface FareEstimatorProps {
  route: MatatuRoute;
  now: Date;
}

interface StageRowProps {
  label: string;
  route: MatatuRoute;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

function StageRow({ label, route, selectedIndex, onSelect }: StageRowProps) {
  return (
    <View className="gap-2">
      <Typography type="body-xs" color="muted" weight="medium">
        {label}
      </Typography>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 4 }}
      >
        {route.stages.map((stage, index) => (
          <Chip
            key={`${label}-${stage.name}-${index}`}
            size="sm"
            variant={index === selectedIndex ? 'primary' : 'secondary'}
            onPress={() => onSelect(index)}
          >
            <Chip.Label>{stage.name}</Chip.Label>
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
}

export function FareEstimator({ route, now }: FareEstimatorProps) {
  const [boardingIndex, setBoardingIndex] = useState(0);
  const [alightingIndex, setAlightingIndex] = useState(route.stages.length - 1);
  const peak = isPeakTime(now);
  const estimate = estimateFare(route, boardingIndex, alightingIndex);

  return (
    <View className="gap-4 rounded-2xl border border-border bg-surface p-4">
      <View>
        <Typography type="h6">Fare estimator</Typography>
        <Typography type="body-xs" color="muted">
          {peakWindowLabel(now)}
        </Typography>
      </View>

      <StageRow
        label="Boarding at"
        route={route}
        selectedIndex={boardingIndex}
        onSelect={setBoardingIndex}
      />
      <StageRow
        label="Alighting at"
        route={route}
        selectedIndex={alightingIndex}
        onSelect={setAlightingIndex}
      />

      {estimate ? (
        <View className="gap-3">
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
                {fareText(estimate.offPeak)}
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
                {fareText(estimate.peak)}
              </Typography>
            </View>
          </View>

          <Typography type="body-xs" color="muted">
            {estimate.boardingStage} → {estimate.alightingStage} · {estimate.stops}{' '}
            {estimate.stops === 1 ? 'stage' : 'stages'} · about {estimate.distanceKm} km ·{' '}
            {estimate.durationMin} min
            {estimate.isFullRoute ? ' · full route' : ''}
          </Typography>
        </View>
      ) : (
        <View className="rounded-xl bg-surface-secondary p-3">
          <Typography type="body-sm" color="muted">
            Pick two different stages to see the fare.
          </Typography>
        </View>
      )}

      <Typography type="body-xs" color="muted">
        Conductors negotiate, so treat these as typical ranges rather than fixed prices.
      </Typography>
    </View>
  );
}
