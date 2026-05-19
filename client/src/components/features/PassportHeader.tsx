import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Share2, Waves, MapPin, Heart } from "lucide-react";
import rajaAmpatImage from "@assets/generated_images/raja_ampat_coral_reef.png";

interface PassportHeaderProps {
  name: string;
  initials: string;
  level: number;
  levelTitle: string;
  totalDonation: string;
  coralsAdopted: number;
  locationsVisited: number;
  onSettings?: () => void;
  onShare?: () => void;
}

export default function PassportHeader({
  name,
  initials,
  level,
  levelTitle,
  totalDonation,
  coralsAdopted,
  locationsVisited,
  onSettings,
  onShare,
}: PassportHeaderProps) {
  return (
    <div className="relative" data-testid="passport-header">
      <div className="h-48 relative overflow-hidden rounded-t-xl">
        <img
          src={rajaAmpatImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="text-white bg-white/10 backdrop-blur-sm"
            onClick={onShare}
            data-testid="button-share-profile"
          >
            <Share2 className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-white bg-white/10 backdrop-blur-sm"
            onClick={onSettings}
            data-testid="button-settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        <Badge
          className="absolute top-4 left-4 bg-primary text-primary-foreground"
          data-testid="badge-level"
        >
          Level {level}: {levelTitle}
        </Badge>
      </div>

      <div className="relative px-4 pb-4 bg-card rounded-b-xl">
        <div className="flex items-end gap-4 -mt-10 mb-4">
          <Avatar className="w-20 h-20 border-4 border-card">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="pb-2">
            <h2 className="font-display font-bold text-xl text-foreground">
              {name}
            </h2>
            <p className="text-sm text-muted-foreground">Sea Guardian</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-muted rounded-lg" data-testid="stat-donation">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Heart className="w-4 h-4" />
            </div>
            <div className="font-semibold text-foreground text-sm">{totalDonation}</div>
            <div className="text-xs text-muted-foreground">Donasi Tiket</div>
          </div>
          <div className="p-3 bg-muted rounded-lg" data-testid="stat-corals">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Waves className="w-4 h-4" />
            </div>
            <div className="font-semibold text-foreground text-sm">{coralsAdopted}</div>
            <div className="text-xs text-muted-foreground">Karang Adopsi</div>
          </div>
          <div className="p-3 bg-muted rounded-lg" data-testid="stat-locations">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="font-semibold text-foreground text-sm">{locationsVisited}</div>
            <div className="text-xs text-muted-foreground">Lokasi</div>
          </div>
        </div>
      </div>
    </div>
  );
}
