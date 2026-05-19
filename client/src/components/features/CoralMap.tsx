import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Waves, Calendar, User, Shell, Compass } from "lucide-react";
import indonesiaMapImage from "@assets/generated_images/indonesia_topographic_satellite_map.png";

interface CoralNode {
  id: string;
  x: number;
  y: number;
  species: string;
  adoptedBy: string;
  adoptedDate: string;
  status: "healthy" | "recovering" | "growing";
  imageUrl: string;
  location: string;
}

const coralNodes: CoralNode[] = [
  // Papua & Maluku Region
  { id: "c1", x: 88, y: 38, species: "Acropora digitifera", adoptedBy: "Andi S.", adoptedDate: "15 Nov 2024", status: "healthy", imageUrl: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400", location: "Raja Ampat" },
  { id: "c2", x: 92, y: 32, species: "Montipora foliosa", adoptedBy: "Dewi L.", adoptedDate: "18 Nov 2024", status: "growing", imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400", location: "Waigeo" },
  { id: "c3", x: 85, y: 28, species: "Porites lobata", adoptedBy: "Rizki A.", adoptedDate: "22 Nov 2024", status: "healthy", imageUrl: "https://images.unsplash.com/photo-1560275619-4cc5fa59d3ae?w=400", location: "Cenderawasih" },
  { id: "c4", x: 82, y: 42, species: "Stylophora pistillata", adoptedBy: "Sinta W.", adoptedDate: "25 Nov 2024", status: "recovering", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400", location: "Padaido" },
  { id: "c5", x: 80, y: 35, species: "Pocillopora damicornis", adoptedBy: "Bayu K.", adoptedDate: "28 Nov 2024", status: "growing", imageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400", location: "Biak" },
  { id: "c6", x: 75, y: 48, species: "Goniastrea retiformis", adoptedBy: "Maya R.", adoptedDate: "1 Dec 2024", status: "healthy", imageUrl: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=400", location: "Banda" },
  { id: "c7", x: 73, y: 22, species: "Acropora hyacinthus", adoptedBy: "Putri N.", adoptedDate: "3 Dec 2024", status: "recovering", imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400", location: "Morotai" },
  // Sulawesi Region
  { id: "c8", x: 68, y: 28, species: "Montipora digitata", adoptedBy: "Sari K.", adoptedDate: "5 Dec 2024", status: "healthy", imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400", location: "Bunaken" },
  { id: "c9", x: 65, y: 40, species: "Seriatopora hystrix", adoptedBy: "Agung P.", adoptedDate: "7 Dec 2024", status: "growing", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400", location: "Togian" },
  { id: "c10", x: 66, y: 52, species: "Porites cylindrica", adoptedBy: "Budi W.", adoptedDate: "9 Dec 2024", status: "healthy", imageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400", location: "Wakatobi" },
  { id: "c11", x: 58, y: 56, species: "Acropora tenuis", adoptedBy: "Fitri M.", adoptedDate: "11 Dec 2024", status: "recovering", imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400", location: "Taka Bonerate" },
  // Kalimantan Region
  { id: "c12", x: 60, y: 32, species: "Fungia fungites", adoptedBy: "Rani M.", adoptedDate: "13 Dec 2024", status: "healthy", imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400", location: "Derawan" },
  // Nusa Tenggara Region
  { id: "c13", x: 50, y: 60, species: "Turbinaria reniformis", adoptedBy: "Dian P.", adoptedDate: "15 Dec 2024", status: "growing", imageUrl: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=400", location: "Komodo" },
  { id: "c14", x: 55, y: 70, species: "Galaxea fascicularis", adoptedBy: "Lisa A.", adoptedDate: "17 Dec 2024", status: "healthy", imageUrl: "https://images.unsplash.com/photo-1560275619-4cc5fa59d3ae?w=400", location: "Sawu" },
  { id: "c15", x: 44, y: 56, species: "Pavona clavus", adoptedBy: "Toni H.", adoptedDate: "19 Dec 2024", status: "growing", imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400", location: "Gili Matra" },
  // Jawa Region
  { id: "c16", x: 35, y: 48, species: "Acropora nasuta", adoptedBy: "Hendra S.", adoptedDate: "21 Dec 2024", status: "healthy", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400", location: "Karimunjawa" },
  { id: "c17", x: 28, y: 52, species: "Pocillopora verrucosa", adoptedBy: "Yuni T.", adoptedDate: "23 Dec 2024", status: "recovering", imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400", location: "Kep. Seribu" },
  { id: "c18", x: 24, y: 56, species: "Montipora aequituberculata", adoptedBy: "Reza F.", adoptedDate: "25 Dec 2024", status: "growing", imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400", location: "Tanjung Lesung" },
  // Sumatera Region
  { id: "c19", x: 8, y: 22, species: "Porites lutea", adoptedBy: "Indah K.", adoptedDate: "27 Dec 2024", status: "healthy", imageUrl: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400", location: "Pulau Weh" },
  { id: "c20", x: 22, y: 32, species: "Acropora millepora", adoptedBy: "Fajar B.", adoptedDate: "29 Dec 2024", status: "growing", imageUrl: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=400", location: "Anambas" },
];

const statusColors = {
  healthy: "bg-emerald-500",
  recovering: "bg-amber-500",
  growing: "bg-cyan-500",
};

const statusLabels = {
  healthy: "Sehat",
  recovering: "Pemulihan",
  growing: "Bertumbuh",
};

export default function CoralMap() {
  const [selectedCoral, setSelectedCoral] = useState<CoralNode | null>(null);
  const [hoveredCoral, setHoveredCoral] = useState<string | null>(null);

  return (
    <div className="relative" data-testid="coral-map">
      <div className="relative w-full aspect-video min-h-[350px] max-h-[500px] rounded-xl overflow-hidden shadow-xl border border-border/50">
        <img 
          src={indonesiaMapImage} 
          alt="Peta Indonesia - Adopsi Karang"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20" />

        <div className="absolute top-4 left-4 z-10">
          <h3 className="font-display font-bold text-xl md:text-2xl text-white drop-shadow-lg">
            Peta Adopsi Karang
          </h3>
          <p className="text-white/80 text-xs md:text-sm font-light mt-0.5">
            {coralNodes.length} karang teradopsi
          </p>
        </div>

        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-white/95 dark:bg-card/95 backdrop-blur-md rounded-lg p-2.5 shadow-lg border border-white/20">
            <div className="relative w-8 h-8">
              <Compass className="w-full h-full text-primary/80" strokeWidth={1.5} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[7px] font-bold text-primary -mt-0.5">N</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-10">
          <div className="bg-white/90 dark:bg-card/90 backdrop-blur-md rounded-md p-1.5 md:p-2 shadow-md border border-white/20">
            <div className="flex gap-2 md:gap-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[7px] md:text-[9px] text-muted-foreground">Sehat</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-[7px] md:text-[9px] text-muted-foreground">Pemulihan</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span className="text-[7px] md:text-[9px] text-muted-foreground">Bertumbuh</span>
              </div>
            </div>
          </div>
        </div>

        {coralNodes.map((coral) => {
          const isSelected = selectedCoral?.id === coral.id;
          const isHovered = hoveredCoral === coral.id;
          
          return (
            <button
              key={coral.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
              style={{ left: `${coral.x}%`, top: `${coral.y}%` }}
              onClick={() => setSelectedCoral(coral)}
              onMouseEnter={() => setHoveredCoral(coral.id)}
              onMouseLeave={() => setHoveredCoral(null)}
              data-testid={`coral-node-${coral.id}`}
            >
              <div className="relative">
                <div
                  className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${statusColors[coral.status]} border-2 border-white shadow-lg transition-all duration-300 ${
                    isSelected
                      ? "scale-150 ring-4 ring-white/50"
                      : isHovered
                      ? "scale-125 ring-2 ring-white/40"
                      : ""
                  }`}
                />
                {!isSelected && (
                  <span className={`absolute inset-0 rounded-full ${statusColors[coral.status]} opacity-40 animate-ping`} />
                )}
              </div>
              
              <div className={`invisible group-hover:visible absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-white/95 dark:bg-card/95 backdrop-blur-md border border-white/30 rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap z-20 transition-all duration-200`}>
                <p className="text-[10px] font-semibold text-foreground">{coral.species}</p>
                <p className="text-[9px] text-muted-foreground">{coral.location}</p>
              </div>
            </button>
          );
        })}

        {selectedCoral && (
          <>
            <div 
              className="absolute inset-0 bg-black/30 backdrop-blur-sm z-20"
              onClick={() => setSelectedCoral(null)}
            />
            <Card
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm overflow-hidden shadow-2xl z-30 border border-primary/20"
              data-testid={`coral-detail-${selectedCoral.id}`}
            >
              <div className="relative h-36 md:h-40">
                <img 
                  src={selectedCoral.imageUrl} 
                  alt={selectedCoral.species}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 text-white hover:bg-white/20"
                  onClick={() => setSelectedCoral(null)}
                  data-testid="button-close-coral-detail"
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-2 left-3 right-3">
                  <h4 className="font-display font-bold text-lg text-white">{selectedCoral.species}</h4>
                  <p className="text-white/80 text-xs mb-1.5">{selectedCoral.location}</p>
                  <Badge
                    className={`${statusColors[selectedCoral.status]} text-white border-0 text-[10px]`}
                  >
                    {statusLabels[selectedCoral.status]}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <User className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Diadopsi oleh</p>
                      <p className="text-base font-semibold">{selectedCoral.adoptedBy}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Tanggal Adopsi</p>
                      <p className="text-base font-semibold">{selectedCoral.adoptedDate}</p>
                    </div>
                  </div>
                </div>

                <Link href={`/karang/${selectedCoral.id}`}>
                  <Button className="w-full" data-testid="button-view-coral-updates">
                    <Shell className="w-4 h-4 mr-2" />
                    Lihat Update Karang
                  </Button>
                </Link>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
