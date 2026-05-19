import LocationCard from "../features/LocationCard";
import rajaAmpatImage from "@assets/generated_images/raja_ampat_coral_reef.png";

export default function LocationCardExample() {
  return (
    <div className="max-w-sm">
      <LocationCard
        id="raja-ampat"
        name="TWP Raja Ampat"
        region="Papua Barat"
        image={rajaAmpatImage}
        description="Pusat keanekaragaman hayati laut dunia dengan lebih dari 1.500 spesies ikan."
        availableSlots={24}
        features={["Diving", "Snorkeling", "Karang"]}
        onSelect={(id) => console.log("Selected location:", id)}
      />
    </div>
  );
}
