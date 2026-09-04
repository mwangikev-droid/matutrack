import { router, type Href } from 'expo-router';

export function goBackOrReplace(fallback: Href) {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}

export function cityHref(cityId: string) {
  return { pathname: '/city/[cityId]', params: { cityId } } as const;
}

export function routeHref(routeId: string) {
  return { pathname: '/route/[routeId]', params: { routeId } } as const;
}
