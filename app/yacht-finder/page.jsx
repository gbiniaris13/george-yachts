import YachtFinderQuiz from './YachtFinderQuiz';

export const metadata = {
  title: 'Find Your Perfect Yacht | George Yachts Brokerage House',
  description: 'Answer 5 simple questions and we\'ll match you with the ideal yacht for your Greek charter. Personalized recommendations from our curated fleet of 53+ vessels.',
  openGraph: {
    title: 'Find Your Perfect Yacht | George Yachts',
    description: 'Answer 5 questions. Get your perfect yacht match in Greek waters.',
  },
};

export default function YachtFinderPage() {
  return <YachtFinderQuiz />;
}
