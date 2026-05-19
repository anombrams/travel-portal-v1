import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SpotlightCardProps {
  image: string;
  title: string;
  subtitle: string;
  badge?: string;
  onClick?: () => void;
}

export default function SpotlightCard({
  image,
  title,
  subtitle,
  badge,
  onClick,
}: SpotlightCardProps) {
  return (
    <Card
      className="relative aspect-[4/5] overflow-hidden cursor-pointer group"
      onClick={onClick}
      data-testid={`spotlight-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {badge && (
        <Badge
          className="absolute top-4 left-4 bg-primary/90 text-primary-foreground"
          data-testid={`badge-${badge.toLowerCase().replace(/\s+/g, "-")}`}
        >
          {badge}
        </Badge>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-display font-semibold text-xl text-white mb-1">
          {title}
        </h3>
        <p className="text-white/70 text-sm line-clamp-2">{subtitle}</p>
      </div>
    </Card>
  );
}
