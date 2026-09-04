import { Activity, MapPinned, Route, Star } from 'lucide-react-native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useThemeColor } from 'heroui-native';
import { useUniwind } from 'uniwind';

export default function TabLayout() {
  const { theme } = useUniwind();
  const [background, foreground, border, accent, muted] = useThemeColor([
    'background',
    'foreground',
    'border',
    'accent',
    'muted',
  ]);

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: background },
          headerTintColor: foreground,
          headerTitleStyle: { color: foreground },
          headerShadowVisible: false,
          sceneStyle: { backgroundColor: background },
          tabBarStyle: {
            backgroundColor: background,
            borderTopColor: border,
          },
          tabBarActiveTintColor: accent,
          tabBarInactiveTintColor: muted,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'MatuTrack',
            tabBarLabel: 'Cities',
            tabBarIcon: ({ color, size }) => <MapPinned color={color} size={size ?? 24} />,
          }}
        />
        <Tabs.Screen
          name="routes"
          options={{
            title: 'Find a route',
            tabBarLabel: 'Routes',
            tabBarIcon: ({ color, size }) => <Route color={color} size={size ?? 24} />,
          }}
        />
        <Tabs.Screen
          name="live"
          options={{
            title: 'Live board',
            tabBarLabel: 'Live',
            tabBarIcon: ({ color, size }) => <Activity color={color} size={size ?? 24} />,
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: 'Saved routes',
            tabBarLabel: 'Saved',
            tabBarIcon: ({ color, size }) => <Star color={color} size={size ?? 24} />,
          }}
        />
      </Tabs>
    </>
  );
}
