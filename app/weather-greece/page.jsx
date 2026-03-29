import WeatherClient from './WeatherClient';

export const metadata = {
  title: 'Greek Sailing Weather Guide | Wind & Season Guide | George Yachts',
  description: 'When is the best time to charter in Greece? Meltemi wind guide, sea temperatures, crowd levels, and pricing by month. Expert seasonal advice.',
};

export default function WeatherPage() {
  return <WeatherClient />;
}
