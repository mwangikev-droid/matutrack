import { Star } from 'lucide-react-native';
import { PressableFeedback, useThemeColor } from 'heroui-native';

import { useFavouritesStore, useIsFavourite } from '@/lib/store/useFavourites';
import { cn } from '@/lib/utils';

interface FavouriteButtonProps {
  routeId: string;
  size?: number;
  className?: string;
}

export function FavouriteButton({ routeId, size = 20, className }: FavouriteButtonProps) {
  const isFavourite = useIsFavourite(routeId);
  const toggle = useFavouritesStore((state) => state.toggle);
  const [accent, muted] = useThemeColor(['accent', 'muted']);

  return (
    <PressableFeedback
      accessibilityRole="button"
      accessibilityLabel={isFavourite ? 'Remove from saved routes' : 'Save this route'}
      hitSlop={10}
      onPress={() => toggle(routeId)}
      className={cn('h-9 w-9 items-center justify-center rounded-full bg-surface', className)}
    >
      <Star
        size={size}
        color={isFavourite ? accent : muted}
        fill={isFavourite ? accent : 'transparent'}
      />
    </PressableFeedback>
  );
}
