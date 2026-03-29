import CostCalculatorClient from './CostCalculatorClient';

export const metadata = {
  title: 'Charter Cost Calculator | George Yachts',
  description: 'Calculate the total cost of your Greek yacht charter. Transparent pricing with charter rate, APA, VAT, and transfer estimates. No hidden fees.',
  openGraph: {
    title: 'Charter Cost Calculator | George Yachts',
    description: 'See exactly what your yacht charter will cost — charter rate, APA, VAT, transfers. Complete transparency.',
  },
};

export default function CostCalculatorPage() {
  return <CostCalculatorClient />;
}
