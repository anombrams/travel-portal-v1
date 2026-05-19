import StampCard from "../features/StampCard";
import rajaAmpatImage from "@assets/generated_images/raja_ampat_coral_reef.png";

export default function StampCardExample() {
  return (
    <div className="w-48">
      <StampCard
        id="stamp-raja-ampat"
        locationName="Raja Ampat"
        region="Papua Barat"
        visitDate="20 Nov 2024"
        isVisited={true}
        image={rajaAmpatImage}
      />
    </div>
  );
}
