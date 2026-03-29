import IslandQuizClient from './IslandQuizClient';

export const metadata = {
  title: 'Which Greek Island Are You? | George Yachts',
  description: 'Take our fun personality quiz and discover which Greek island matches your travel style. Are you Mykonos, Hydra, Santorini, or Paxos?',
  openGraph: {
    title: 'Which Greek Island Are You? | George Yachts',
    description: 'Discover your perfect Greek island match — take the quiz!',
  },
};

export default function IslandQuizPage() {
  return <IslandQuizClient />;
}
