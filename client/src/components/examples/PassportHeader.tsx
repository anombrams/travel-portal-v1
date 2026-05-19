import PassportHeader from "../features/PassportHeader";

export default function PassportHeaderExample() {
  return (
    <div className="max-w-md">
      <PassportHeader
        name="Andi Wijaya"
        initials="AW"
        level={3}
        levelTitle="Coral Guardian"
        totalDonation="Rp 500.000"
        coralsAdopted={2}
        locationsVisited={3}
        onSettings={() => console.log("Settings clicked")}
        onShare={() => console.log("Share clicked")}
      />
    </div>
  );
}
