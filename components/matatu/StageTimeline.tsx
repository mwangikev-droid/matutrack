import { Typography } from 'heroui-native';
import { View } from 'react-native';

import { withAlpha } from '@/lib/matatu/color';
import type { MatatuRoute } from '@/lib/matatu/types';

interface StageTimelineProps {
  route: MatatuRoute;
}

/** Vertical stage-by-stage view of a route, terminus to terminus. */
export function StageTimeline({ route }: StageTimelineProps) {
  const lastIndex = route.stages.length - 1;

  return (
    <View>
      {route.stages.map((stage, index) => {
        const isTerminus = index === 0 || index === lastIndex;

        return (
          <View key={`${stage.name}-${stage.latitude}-${stage.longitude}`} className="flex-row">
            <View className="w-8 items-center">
              <View
                className="rounded-full"
                style={{
                  backgroundColor: isTerminus ? route.color : withAlpha(route.color, 0.35),
                  height: isTerminus ? 14 : 10,
                  width: isTerminus ? 14 : 10,
                  marginTop: 5,
                }}
              />
              {index < lastIndex ? (
                <View
                  className="flex-1"
                  style={{ backgroundColor: withAlpha(route.color, 0.3), width: 2, minHeight: 26 }}
                />
              ) : null}
            </View>

            <View className="flex-1 pb-5">
              <View className="flex-row items-center gap-2">
                <Typography type="body-sm" weight="semibold">
                  {stage.name}
                </Typography>
                {isTerminus ? (
                  <View className="bg-surface-secondary rounded-full px-2 py-0.5">
                    <Typography type="body-xs" color="muted">
                      {index === 0 ? 'Start' : 'Terminus'}
                    </Typography>
                  </View>
                ) : null}
              </View>
              {stage.landmark ? (
                <Typography type="body-xs" color="muted">
                  {stage.landmark}
                </Typography>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
