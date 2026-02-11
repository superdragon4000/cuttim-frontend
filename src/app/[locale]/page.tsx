import {LandingHero} from '@/widgets/landing-hero/ui/landing-hero';
import {HowItWorks} from '@/widgets/how-it-works/ui/how-it-works';

export default function LandingPage() {
  return (
    <div className="space-y-10">
      <LandingHero />
      <HowItWorks />
    </div>
  );
}
