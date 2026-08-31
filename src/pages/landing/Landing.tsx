import { LandingNavbar } from "./LandingNavbar";
import { LandingHero } from "./LandingHero";
import { LandingStats } from "./LandingStats";
import { LandingAudience } from "./LandingAudience";
import { LandingProblem } from "./LandingProblem";
import { LandingSteps } from "./LandingSteps";
import { LandingCalculator } from "./LandingCalculator";
import { LandingTrust } from "./LandingTrust";
import { LandingFAQ } from "./LandingFAQ";
import { LandingCTA } from "./LandingCTA";
import { LandingFooter } from "./LandingFooter";
import { ScrollProgressBar } from "../../components/ui/ScrollProgressBar";

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface-dark">
      <ScrollProgressBar />
      <LandingNavbar />
      <LandingHero />
      <LandingStats />
      <LandingAudience />
      <LandingProblem />
      <LandingSteps />
      <LandingCalculator />
      <LandingTrust />
      <LandingFAQ />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}