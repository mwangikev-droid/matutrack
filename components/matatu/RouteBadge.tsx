import { Text, View } from 'react-native';

import { onColorText } from '@/lib/matatu/color';
import { cn } from '@/lib/utils';

interface RouteBadgeProps {
  number: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: { box: 'h-8 w-10 rounded-lg', text: 13 },
  md: { box: 'h-11 w-14 rounded-xl', text: 16 },
  lg: { box: 'h-14 w-18 rounded-2xl', text: 20 },
} as const;

/** The route number as painted on the matatu, in the route's own colour. */
export function RouteBadge({ number, color, size = 'md', className }: RouteBadgeProps) {
  const preset = SIZES[size];

  return (
    <View
      className={cn('items-center justify-center', preset.box, className)}
      style={{ backgroundColor: color }}
    >
      <Text
        style={{
          color: onColorText(color),
          fontSize: preset.text,
          fontWeight: '700',
          letterSpacing: 0.4,
        }}
      >
        {number}
      </Text>
    </View>
  );
}
