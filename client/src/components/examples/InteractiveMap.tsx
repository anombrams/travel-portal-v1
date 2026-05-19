import InteractiveMap from "../features/InteractiveMap";

export default function InteractiveMapExample() {
  return (
    <InteractiveMap
      onLocationSelect={(loc) => console.log("Selected location:", loc)}
    />
  );
}
