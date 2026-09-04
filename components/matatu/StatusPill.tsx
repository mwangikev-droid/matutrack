import { Typography } from 'heroui-native';
import { View } from 'react-native';

import type { CrowdLevel } from '@/lib/matatu/liveStatus';
import { cn } from '@/lib/utils';

const STYLES: Record<CrowdLevel, { wrap: string; dot: string; text: string }> = {
  clear: {
    wrap: 'bg-matatu-green-soft',
    dot: 'bg-matatu-green',
    text: 'text-matatu-green',
  },
  busy: {
    wrap: 'bg-matatu-amber-soft',
    dot: 'bg-matatu-amber',
    text: 'text-matatu-ink',
  },
  packed: {
    wrap: 'bg-matatu-red-soft',
    dot: 'bg-matatu-red',
    text: 'text-matatu-red',
  },
};

interface StatusPillProps {
  crowd: CrowdLevel;
  label: string;
  className?: string;
}

export function StatusPill({ crowd, label, className }: StatusPillProps) {
  const style = STYLES[crowd];

  return (
    <View
      className={cn('flex-row items-center gap-1.5 rounded-full px-2.5 py-1', style.wrap, className)}
    >
      <View className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
      <Typography type="body-xs" weight="semibold" className={style.text}>
        {label}
      </Typography>
    </View>
  );
}
