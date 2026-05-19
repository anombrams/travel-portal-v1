import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Waves, Clock, Ticket, Users, Fish, Compass, Anchor, Shell, Sailboat } from "lucide-react";
import indonesiaMapImage from "@assets/generated_images/indonesia_topographic_satellite_map.png";
import bandaImage from "@assets/generated_images/banda_islands_aerial_view.png";
import sawuImage from "@assets/generated_images/sawu_sea_whales.png";
import rajaAmpatImage from "@assets/generated_images/raja_ampat_coral_reef.png";
import giliImage from "@assets/generated_images/gili_matra_beach_paradise.png";

interface Location {
  id: string;
  name: string;
  shortName: string;
  region: string;
  image: string;
  description: string;
  uniqueFeature: string;
  x: number;
  y: number;
  price: string;
  species: number;
  iconType: "coral" | "turtle" | "whale" | "fish" | "manta" | "dragon" | "dolphin" | "palm";
}

const locations: Location[] = [
  // Papua & Maluku Region (East)
  {
    id: "raja-ampat",
    name: "TWP Raja Ampat",
    shortName: "Raja Ampat",
    region: "Papua Barat",
    image: rajaAmpatImage,
    description: "Pusat keanekaragaman hayati laut dunia dengan lebih dari 1.500 spesies ikan.",
    uniqueFeature: "Scarcity Barometer: Kuota Harian",
    x: 88,
    y: 38,
    price: "Rp 500.000",
    species: 1500,
    iconType: "coral",
  },
  {
    id: "waigeo",
    name: "TWP Waigeo Barat",
    shortName: "Waigeo",
    region: "Papua Barat Daya",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    description: "Rumah pianemo dengan laguna-laguna ikonik dan hutan mangrove yang lebat.",
    uniqueFeature: "Pianemo Viewpoint",
    x: 92,
    y: 32,
    price: "Rp 450.000",
    species: 1200,
    iconType: "coral",
  },
  {
    id: "cenderawasih",
    name: "TN Teluk Cenderawasih",
    shortName: "Cenderawasih",
    region: "Papua",
    image: "https://images.unsplash.com/photo-1560275619-4cc5fa59d3ae?w=800",
    description: "Taman laut terbesar Indonesia dengan whale shark yang jinak.",
    uniqueFeature: "Whale Shark Encounter",
    x: 85,
    y: 28,
    price: "Rp 500.000",
    species: 950,
    iconType: "whale",
  },
  {
    id: "padaido",
    name: "TWP Kepulauan Padaido",
    shortName: "Padaido",
    region: "Papua",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
    description: "Surga diving dengan visibility hingga 40 meter dan terumbu perawan.",
    uniqueFeature: "Visibility 40 Meter",
    x: 82,
    y: 42,
    price: "Rp 400.000",
    species: 800,
    iconType: "fish",
  },
  {
    id: "biak",
    name: "TWP Pulau Biak",
    shortName: "Biak",
    region: "Papua",
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800",
    description: "Destinasi diving dengan gua bawah laut dan bangkai kapal PD II.",
    uniqueFeature: "Gua Bawah Laut",
    x: 80,
    y: 35,
    price: "Rp 375.000",
    species: 650,
    iconType: "manta",
  },
  {
    id: "banda",
    name: "TWP Laut Banda",
    shortName: "Banda",
    region: "Maluku",
    image: bandaImage,
    description: "Kepulauan rempah bersejarah dengan terumbu karang yang masih perawan.",
    uniqueFeature: "Time Travel Slider: Sejarah vs Alam",
    x: 75,
    y: 48,
    price: "Rp 150.000",
    species: 800,
    iconType: "turtle",
  },
  {
    id: "morotai",
    name: "TWP Pulau Morotai",
    shortName: "Morotai",
    region: "Maluku Utara",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800",
    description: "Pulau bersejarah PD II dengan bangkai pesawat dan kapal selam.",
    uniqueFeature: "Wreck Diving PD II",
    x: 73,
    y: 22,
    price: "Rp 325.000",
    species: 500,
    iconType: "manta",
  },
  // Sulawesi Region
  {
    id: "bunaken",
    name: "TNP Bunaken",
    shortName: "Bunaken",
    region: "Sulawesi Utara",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
    description: "Wall diving spektakuler dengan dinding karang vertikal hingga 1.300 meter.",
    uniqueFeature: "Wall Diving Experience",
    x: 68,
    y: 28,
    price: "Rp 200.000",
    species: 390,
    iconType: "coral",
  },
  {
    id: "togian",
    name: "TN Kepulauan Togian",
    shortName: "Togian",
    region: "Sulawesi Tengah",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    description: "Surga tersembunyi dengan 3 jenis terumbu: fringing, barrier, dan atol.",
    uniqueFeature: "Ubur-ubur Tak Menyengat",
    x: 65,
    y: 40,
    price: "Rp 275.000",
    species: 596,
    iconType: "fish",
  },
  {
    id: "wakatobi",
    name: "TNP Wakatobi",
    shortName: "Wakatobi",
    region: "Sulawesi Tenggara",
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800",
    description: "Taman nasional dengan 750 spesies karang tertinggi di dunia.",
    uniqueFeature: "Coral Triangle Center",
    x: 66,
    y: 52,
    price: "Rp 250.000",
    species: 942,
    iconType: "coral",
  },
  {
    id: "takabonerate",
    name: "TN Taka Bonerate",
    shortName: "Taka Bonerate",
    region: "Sulawesi Selatan",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800",
    description: "Atol terbesar ketiga di dunia dengan keanekaragaman hayati luar biasa.",
    uniqueFeature: "Atol Raksasa 220.000 Ha",
    x: 58,
    y: 56,
    price: "Rp 300.000",
    species: 750,
    iconType: "fish",
  },
  // Kalimantan Region
  {
    id: "derawan",
    name: "TWP Derawan",
    shortName: "Derawan",
    region: "Kalimantan Timur",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800",
    description: "Surga penyu hijau dan danau ubur-ubur tak menyengat di Kakaban.",
    uniqueFeature: "Jellyfish Lake: Danau Ubur-ubur",
    x: 60,
    y: 32,
    price: "Rp 275.000",
    species: 460,
    iconType: "turtle",
  },
  // Nusa Tenggara Region
  {
    id: "komodo",
    name: "TNP Komodo",
    shortName: "Komodo",
    region: "Nusa Tenggara Timur",
    image: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800",
    description: "Rumah komodo dan surga diving dengan manta ray dan arus kuat.",
    uniqueFeature: "Manta Point: Titik Manta",
    x: 50,
    y: 60,
    price: "Rp 350.000",
    species: 1000,
    iconType: "dragon",
  },
  {
    id: "sawu",
    name: "TNP Laut Sawu",
    shortName: "Sawu",
    region: "Nusa Tenggara Timur",
    image: sawuImage,
    description: "Koridor migrasi paus dan lumba-lumba terbesar di Indonesia.",
    uniqueFeature: "Cetacean Symphony: Suara Paus",
    x: 55,
    y: 70,
    price: "Rp 175.000",
    species: 500,
    iconType: "dolphin",
  },
  {
    id: "gili-matra",
    name: "TWP Gili Matra",
    shortName: "Gili Matra",
    region: "Nusa Tenggara Barat",
    image: giliImage,
    description: "Tiga pulau surga dengan pantai pasir putih dan habitat penyu.",
    uniqueFeature: "Live Cam Penyu",
    x: 44,
    y: 56,
    price: "Rp 100.000",
    species: 350,
    iconType: "turtle",
  },
  // Jawa Region
  {
    id: "karimunjawa",
    name: "TN Karimunjawa",
    shortName: "Karimunjawa",
    region: "Jawa Tengah",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    description: "Kepulauan tropis dengan 27 pulau dan terumbu karang cantik.",
    uniqueFeature: "Shark Pool: Kolam Hiu Alami",
    x: 35,
    y: 48,
    price: "Rp 200.000",
    species: 400,
    iconType: "fish",
  },
  {
    id: "seribu",
    name: "TN Kepulauan Seribu",
    shortName: "Kep. Seribu",
    region: "DKI Jakarta",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    description: "Gugusan 110 pulau dekat Jakarta untuk liburan singkat.",
    uniqueFeature: "Pulau Harapan & Pramuka",
    x: 28,
    y: 52,
    price: "Rp 150.000",
    species: 250,
    iconType: "palm",
  },
  {
    id: "tanjung-lesung",
    name: "TWP Tanjung Lesung",
    shortName: "Tanjung Lesung",
    region: "Banten",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800",
    description: "Pantai berpasir putih dengan view Anak Krakatau.",
    uniqueFeature: "View Anak Krakatau",
    x: 24,
    y: 56,
    price: "Rp 175.000",
    species: 200,
    iconType: "palm",
  },
  // Sumatera Region
  {
    id: "weh",
    name: "TWP Pulau Weh",
    shortName: "Pulau Weh",
    region: "Aceh",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
    description: "Titik paling barat Indonesia dengan diving spot kelas dunia.",
    uniqueFeature: "Km 0 Indonesia",
    x: 8,
    y: 22,
    price: "Rp 250.000",
    species: 500,
    iconType: "coral",
  },
  {
    id: "anambas",
    name: "TWP Kepulauan Anambas",
    shortName: "Anambas",
    region: "Kepulauan Riau",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    description: "Kepulauan tersembunyi dengan laguna biru kristal.",
    uniqueFeature: "Laguna Biru Alami",
    x: 22,
    y: 32,
    price: "Rp 350.000",
    species: 450,
    iconType: "fish",
  },
];

interface InteractiveMapProps {
  onLocationSelect?: (location: Location) => void;
}

const iconColors: Record<string, { bg: string; text: string }> = {
  coral: { bg: "bg-rose-500", text: "text-rose-500" },
  turtle: { bg: "bg-emerald-500", text: "text-emerald-500" },
  whale: { bg: "bg-sky-500", text: "text-sky-500" },
  fish: { bg: "bg-cyan-500", text: "text-cyan-500" },
  manta: { bg: "bg-violet-500", text: "text-violet-500" },
  dragon: { bg: "bg-amber-500", text: "text-amber-500" },
  dolphin: { bg: "bg-indigo-500", text: "text-indigo-500" },
  palm: { bg: "bg-teal-500", text: "text-teal-500" },
};

const iconLabels: Record<string, string> = {
  coral: "Terumbu Karang",
  turtle: "Penyu",
  whale: "Paus",
  fish: "Ikan",
  manta: "Manta Ray",
  dragon: "Komodo",
  dolphin: "Lumba-lumba",
  palm: "Pulau Tropis",
};

export default function InteractiveMap({ onLocationSelect }: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    onLocationSelect?.(location);
  };

  const getIconStyle = (iconType: string) => iconColors[iconType] || iconColors.coral;

  return (
    <div className="relative w-full aspect-[4/3] md:aspect-video min-h-[300px] md:min-h-[420px] max-h-[720px] rounded-xl overflow-hidden shadow-xl border border-border/50" data-testid="interactive-map">
      <img 
        src={indonesiaMapImage} 
        alt="Peta Indonesia - Kawasan Konservasi Laut"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/40" />

      <div className="absolute top-3 left-3 md:top-5 md:left-5 z-10">
        <h2 className="font-display font-bold text-lg md:text-3xl lg:text-4xl text-white drop-shadow-lg tracking-tight">
          Jelajahi Indonesia
        </h2>
        <p className="text-white/80 text-xs md:text-base font-light mt-0.5 tracking-wide">
          Destinasi Konservasi Laut
        </p>
      </div>

      <div className="absolute bottom-3 right-2 md:bottom-5 md:right-5 z-10">
        <div className="bg-white/90 dark:bg-card/90 backdrop-blur-md rounded-md p-1.5 md:p-2.5 shadow-md border border-white/20">
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 md:grid md:grid-cols-2 md:gap-x-3 md:gap-y-1">
            {Object.entries(iconLabels).slice(0, 6).map(([key, label]) => (
              <div key={key} className="flex items-center gap-0.5 md:gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${iconColors[key].bg}`} />
                <span className="text-[6px] md:text-[8px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-3 md:bottom-20 md:left-4 z-10">
        <div className="bg-white/90 dark:bg-card/90 backdrop-blur-md rounded-full p-1 md:p-1.5 shadow-lg border border-white/30">
          <div className="relative w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5" />
            <Compass className="w-4 h-4 md:w-5 md:h-5 text-primary" strokeWidth={2} />
          </div>
        </div>
      </div>

      {locations.map((location) => {
        const style = getIconStyle(location.iconType);
        const isSelected = selectedLocation?.id === location.id;
        const isHovered = hoveredLocation === location.id;
        
        return (
          <button
            key={location.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
            style={{ left: `${location.x}%`, top: `${location.y}%` }}
            onClick={() => handleLocationClick(location)}
            onMouseEnter={() => setHoveredLocation(location.id)}
            onMouseLeave={() => setHoveredLocation(null)}
            data-testid={`map-pin-${location.id}`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`relative flex items-center justify-center w-5 h-5 md:w-8 md:h-8 rounded-full transition-all duration-300 shadow-lg border-2 border-white/90 ${style.bg} ${
                  isSelected
                    ? "scale-130 ring-4 ring-white/60"
                    : isHovered
                    ? "scale-115 ring-2 ring-white/50"
                    : ""
                }`}
              >
                <Anchor className="w-2.5 h-2.5 md:w-4 md:h-4 text-white" strokeWidth={2.5} />
                {!isSelected && (
                  <span className={`absolute w-full h-full rounded-full ${style.bg} opacity-30 animate-ping`} />
                )}
              </div>
              
              <div className={`mt-1 md:mt-1.5 bg-white/95 dark:bg-card/95 backdrop-blur-md rounded-md px-1.5 md:px-2 py-0.5 shadow-md border border-white/30 transition-all duration-200 text-center ${
                isSelected || isHovered ? "scale-105" : ""
              }`}>
                <span className="font-semibold text-[6px] md:text-[9px] text-foreground whitespace-nowrap tracking-tight block text-center">
                  {location.shortName}
                </span>
              </div>
            </div>
          </button>
        );
      })}

      {selectedLocation && (
        <>
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm z-20"
            onClick={() => setSelectedLocation(null)}
          />
          <Card
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md overflow-hidden z-30 shadow-2xl border border-primary/20"
            data-testid={`location-panel-${selectedLocation.id}`}
          >
            <div className="relative h-36 md:h-44">
              <img
                src={selectedLocation.image}
                alt={selectedLocation.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 text-white hover:bg-white/20"
                onClick={() => setSelectedLocation(null)}
                data-testid="button-close-panel"
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="font-display font-bold text-lg md:text-xl text-white leading-tight">
                  {selectedLocation.name}
                </h3>
                <p className="text-white/80 text-xs mt-0.5">{selectedLocation.region}</p>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {selectedLocation.description}
              </p>

              <div className="flex items-center gap-2 p-2.5 bg-primary/5 rounded-lg border border-primary/10">
                <Waves className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-xs font-medium text-foreground">{selectedLocation.uniqueFeature}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                  <Fish className="w-4 h-4 text-cyan-500" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Spesies</p>
                    <p className="text-sm font-bold">{selectedLocation.species}+</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                  <Ticket className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Mulai</p>
                    <p className="text-sm font-bold">{selectedLocation.price}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Buka setiap hari
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Kuota terbatas
                </span>
              </div>

              <Button className="w-full" data-testid={`button-book-${selectedLocation.id}`}>
                <Sailboat className="w-4 h-4 mr-2" />
                Pesan Tiket Sekarang
              </Button>
            </div>
          </Card>
        </>
      )}

    </div>
  );
}
