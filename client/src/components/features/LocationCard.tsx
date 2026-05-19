import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Anchor, Ticket, Fish, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

interface LocationCardProps {
  id: string;
  name: string;
  region: string;
  image: string;
  description: string;
  availableSlots?: number;
  features: string[];
  price?: number;
  onSelect?: (id: string) => void;
}

const featureIcons: Record<string, string> = {
  "Paus": "whale",
  "Dolphin": "dolphin", 
  "Penelitian": "research",
  "Penyu": "turtle",
  "Pantai": "beach",
  "Snorkeling": "snorkel",
  "Sejarah": "history",
  "Diving": "dive",
  "Karang": "coral",
  "Biodiversitas": "bio",
};

const featureColors: Record<string, string> = {
  "Paus": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
  "Dolphin": "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
  "Penelitian": "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
  "Penyu": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  "Pantai": "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  "Snorkeling": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300",
  "Sejarah": "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
  "Diving": "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  "Karang": "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
  "Biodiversitas": "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
};

export default function LocationCard({
  id,
  name,
  region,
  image,
  description,
  availableSlots,
  features,
  price,
  onSelect,
}: LocationCardProps) {
  const [, setLocation] = useLocation();

  const handleBuyTicket = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocation(`/beli-tiket/${id}`);
  };

  const getFeatureColor = (feature: string) => {
    return featureColors[feature] || "bg-muted text-muted-foreground";
  };

  return (
    <Card
      className="overflow-hidden hover-elevate cursor-pointer group border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
      onClick={() => onSelect?.(id)}
      data-testid={`location-card-${id}`}
    >
      <div className="relative h-40 md:h-44 flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full border border-white/20">
            <MapPin className="w-3 h-3" />
            <span className="font-medium">{region}</span>
          </div>
          
          {availableSlots !== undefined && (
            <div 
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                availableSlots < 30 
                  ? "bg-red-500/90 text-white border-red-400/50" 
                  : availableSlots < 50
                  ? "bg-amber-500/90 text-white border-amber-400/50"
                  : "bg-emerald-500/90 text-white border-emerald-400/50"
              }`}
              data-testid={`slots-badge-${id}`}
            >
              <Users className="w-3 h-3" />
              <span>{availableSlots} slot</span>
            </div>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display font-bold text-lg md:text-xl text-white drop-shadow-lg leading-tight">
            {name}
          </h3>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1 bg-gradient-to-b from-card to-muted/20">
        <p className="text-muted-foreground text-xs line-clamp-2 min-h-[2rem] leading-relaxed mb-2">
          {description}
        </p>

        <div className="flex flex-wrap gap-1 mb-2">
          {features.slice(0, 3).map((feature) => (
            <span 
              key={feature} 
              className={`inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded-full ${getFeatureColor(feature)}`}
            >
              <Fish className="w-2 h-2" />
              {feature}
            </span>
          ))}
        </div>

        <div className="pt-2 border-t border-border/50 mt-auto">
          <Button 
            size="sm"
            className="w-full gap-1.5 bg-primary hover:bg-primary/90 shadow-md text-xs" 
            onClick={handleBuyTicket}
            data-testid={`button-book-${id}`}
          >
            <Anchor className="w-3.5 h-3.5" />
            Beli Tiket
          </Button>
        </div>
      </div>
    </Card>
  );
}
