import { Typography } from 'heroui-native';
import { View } from 'react-native';

import { cn } from '@/lib/utils';

interface InfoTileProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
}

export function InfoTile({ label, value, icon, className }: InfoTileProps) {
  return (
    <View className={cn('bg-surface-secondary flex-1 rounded-xl p-3', className)}>
      <View className="flex-row items-center gap-1.5">
        {icon}
        <Typography type="body-xs" color="muted">
          {label}
        </Typography>
      </View>
      <Typography type="body-sm" weight="semibold" className="mt-1">
        {value}
      </Typography>
    </View>
  );
}
