import SpotlightCard from "../features/SpotlightCard";
import rajaAmpatImage from "@assets/generated_images/raja_ampat_coral_reef.png";

export default function SpotlightCardExample() {
  return (
    <div className="max-w-sm">
      <SpotlightCard
        image={rajaAmpatImage}
        title="Guardian of the Month"
        subtitle="Ibu Siti, penjaga terumbu karang Raja Ampat selama 15 tahun"
        badge="Featured"
        onClick={() => console.log("Spotlight card clicked")}
      />
    </div>
  );
}
