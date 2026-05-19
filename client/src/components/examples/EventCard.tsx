import EventCard from "../features/EventCard";
import bandaImage from "@assets/generated_images/banda_islands_aerial_view.png";

export default function EventCardExample() {
  return (
    <div className="max-w-2xl">
      <EventCard
        id="event-1"
        title="Webinar: Mengenal Ekosistem Laut Banda"
        date="15 Des 2024"
        time="19:00 WIB"
        location="Online (Zoom)"
        type="webinar"
        participants={45}
        maxParticipants={100}
        image={bandaImage}
        onRegister={(id) => console.log("Register event:", id)}
      />
    </div>
  );
}
