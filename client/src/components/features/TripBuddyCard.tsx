import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Calendar, Wallet, Users } from "lucide-react";

interface TripBuddyCardProps {
  id: string;
  name: string;
  initials: string;
  destination: string;
  dateRange: string;
  budget: string;
  tripType: "open-trip" | "share-cost";
  participants: number;
  maxParticipants: number;
  onJoin?: (id: string) => void;
}

export default function TripBuddyCard({
  id,
  name,
  initials,
  destination,
  dateRange,
  budget,
  tripType,
  participants,
  maxParticipants,
  onJoin,
}: TripBuddyCardProps) {
  const spotsLeft = maxParticipants - participants;

  return (
    <Card className="p-4" data-testid={`trip-buddy-card-${id}`}>
      <div className="flex items-start gap-3 mb-4">
        <Avatar className="w-12 h-12">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate">{name}</h4>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{destination}</span>
          </div>
        </div>
        <Badge
          variant={tripType === "open-trip" ? "default" : "secondary"}
          className="flex-shrink-0"
        >
          {tripType === "open-trip" ? "Open Trip" : "Share Cost"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">{dateRange}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Wallet className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">{budget}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>
            {participants}/{maxParticipants} peserta
            {spotsLeft > 0 && (
              <span className="text-primary ml-1">({spotsLeft} slot)</span>
            )}
          </span>
        </div>
        <Button
          size="sm"
          variant={spotsLeft > 0 ? "default" : "secondary"}
          disabled={spotsLeft === 0}
          onClick={() => onJoin?.(id)}
          data-testid={`button-join-${id}`}
        >
          {spotsLeft > 0 ? "Gabung" : "Penuh"}
        </Button>
      </div>
    </Card>
  );
}
