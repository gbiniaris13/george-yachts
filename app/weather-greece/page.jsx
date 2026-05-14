import WeatherClient from './WeatherClient';
import { pageMeta } from '@/lib/pageMeta';

export const metadata = pageMeta({
  title: 'Greek Sailing Weather Guide | George Yachts',
  description:
    'When is the best time to charter in Greece? Meltemi wind guide, sea temperatures, crowd levels, and pricing by month. Expert seasonal advice.',
  path: '/weather-greece',
});

export default function WeatherPage() {
  return <WeatherClient />;
}
