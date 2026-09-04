import { useMemo, useState } from 'react';
import { SearchX } from 'lucide-react-native';
import { Chip, SearchField, Typography, useThemeColor } from 'heroui-native';
import { FlatList, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { EmptyState } from '@/components/matatu/EmptyState';
import { RouteCard } from '@/components/matatu/RouteCard';
import { CITIES, searchRoutes } from '@/lib/matatu/data';
import { useLiveClock } from '@/lib/matatu/liveStatus';

export default function RoutesScreen() {
  const [query, setQuery] = useState('');
  const [cityId, setCityId] = useState<string | undefined>(undefined);
  const { now } = useLiveClock(60000);
  const muted = useThemeColor('muted');

  const results = useMemo(() => searchRoutes(query, cityId), [query, cityId]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="bg-background flex-1"
    >
      <View className="gap-3 px-4 pt-3">
        <SearchField value={query} onChange={setQuery}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Route number, stage, sacco or corridor" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingRight: 8 }}
        >
          <Chip
            size="sm"
            variant={cityId === undefined ? 'primary' : 'secondary'}
            onPress={() => setCityId(undefined)}
          >
            <Chip.Label>All cities</Chip.Label>
          </Chip>
          {CITIES.map((city) => (
            <Chip
              key={city.id}
              size="sm"
              variant={cityId === city.id ? 'primary' : 'secondary'}
              onPress={() => setCityId(city.id)}
            >
              <Chip.Label>{city.name}</Chip.Label>
            </Chip>
          ))}
        </ScrollView>

        <Typography type="body-xs" color="muted">
          {results.length} {results.length === 1 ? 'route' : 'routes'}
          {cityId ? ' in this city' : ' across Kenya'}
        </Typography>
      </View>

      <FlatList
        data={results}
        keyExtractor={(route) => route.id}
        contentContainerStyle={{ gap: 12, padding: 16, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => <RouteCard route={item} now={now} showCity />}
        ListEmptyComponent={
          <EmptyState
            icon={<SearchX size={24} color={muted} />}
            title="No routes found"
            message="Try a stage name like Kondele, a sacco like Umoinner, or a route number like 46."
          />
        }
      />
    </KeyboardAvoidingView>
  );
}
