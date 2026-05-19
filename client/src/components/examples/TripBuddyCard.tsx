import TripBuddyCard from "../features/TripBuddyCard";

export default function TripBuddyCardExample() {
  return (
    <div className="max-w-sm">
      <TripBuddyCard
        id="trip-1"
        name="Andi Saputra"
        initials="AS"
        destination="Raja Ampat"
        dateRange="20-25 Des 2024"
        budget="Rp 8-10 Juta"
        tripType="open-trip"
        participants={3}
        maxParticipants={6}
        onJoin={(id) => console.log("Join trip:", id)}
      />
    </div>
  );
}
