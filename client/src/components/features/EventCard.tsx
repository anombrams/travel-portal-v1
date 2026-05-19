import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "webinar" | "dive" | "cleanup" | "workshop";
  participants: number;
  maxParticipants?: number;
  image?: string;
  onRegister?: (id: string) => void;
}

const eventTypeLabels = {
  webinar: "Webinar",
  dive: "Dive Trip",
  cleanup: "Beach Cleanup",
  workshop: "Workshop",
};

export default function EventCard({
  id,
  title,
  date,
  time,
  location,
  type,
  participants,
  maxParticipants,
  image,
  onRegister,
}: EventCardProps) {
  const spotsAvailable = maxParticipants ? maxParticipants - participants : null;

  return (
    <Card
      className="flex flex-col md:flex-row overflow-hidden"
      data-testid={`event-card-${id}`}
    >
      {image && (
        <div className="w-full md:w-48 h-32 md:h-auto flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex-1 p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Badge variant="secondary" className="mb-2">
              {eventTypeLabels[type]}
            </Badge>
            <h4 className="font-semibold text-lg text-foreground">{title}</h4>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              {participants}
              {maxParticipants && ` / ${maxParticipants}`} peserta
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-auto pt-2">
          <Button
            onClick={() => onRegister?.(id)}
            disabled={spotsAvailable !== null && spotsAvailable <= 0}
            data-testid={`button-register-${id}`}
          >
            {spotsAvailable !== null && spotsAvailable <= 0 ? "Penuh" : "Daftar"}
          </Button>
          {spotsAvailable !== null && spotsAvailable > 0 && (
            <span className="text-sm text-primary">
              {spotsAvailable} slot tersisa
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
