import { Typography } from 'heroui-native';
import { View } from 'react-native';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, message, icon, className }: EmptyStateProps) {
  return (
    <View className={cn('items-center justify-center gap-2 px-8 py-14', className)}>
      {icon ? (
        <View className="bg-surface-secondary mb-1 h-14 w-14 items-center justify-center rounded-full">
          {icon}
        </View>
      ) : null}
      <Typography type="h5" align="center">
        {title}
      </Typography>
      <Typography type="body-sm" color="muted" align="center">
        {message}
      </Typography>
    </View>
  );
}
