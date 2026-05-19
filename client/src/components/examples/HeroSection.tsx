import HeroSection from "../features/HeroSection";

export default function HeroSectionExample() {
  return (
    <HeroSection
      onDestinationSelect={(dest) => console.log("Selected destination:", dest)}
    />
  );
}
