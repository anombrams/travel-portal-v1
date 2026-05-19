import { Card } from "@/components/ui/card";
import { MapPin, Calendar, Check, Anchor, Waves } from "lucide-react";

interface StampCardProps {
  id: string;
  locationName: string;
  region: string;
  visitDate?: string;
  isVisited: boolean;
  image: string;
}

export default function StampCard({
  id,
  locationName,
  region,
  visitDate,
  isVisited,
  image,
}: StampCardProps) {
  return (
    <div
      className={`relative min-w-[200px] md:min-w-[220px] ${
        isVisited ? "" : "grayscale opacity-50"
      }`}
      data-testid={`stamp-card-${id}`}
    >
      <Card className="relative overflow-hidden rounded-2xl shadow-xl border-0">
        <div className="relative aspect-[4/5]">
          <img
            src={image}
            alt={locationName}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {isVisited && (
            <div className="absolute top-3 right-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg ring-4 ring-white/30">
                  <Check className="w-6 h-6 text-white" strokeWidth={3} />
                </div>
                <div className="absolute -inset-1 rounded-full border-2 border-dashed border-emerald-400/50 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
            </div>
          )}

          {!isVisited && (
            <div className="absolute top-3 right-3">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-dashed border-white/30">
                <Anchor className="w-5 h-5 text-white/50" />
              </div>
            </div>
          )}

          <div className="absolute top-3 left-3">
            <div className="bg-white/10 backdrop-blur-md rounded-full px-3 py-1 border border-white/20">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-white/80" />
                <span className="text-[10px] font-medium text-white/90 uppercase tracking-wider">{region}</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Waves className="w-4 h-4 text-primary" />
              <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
            </div>
            
            <h4 className="font-display font-bold text-white text-xl leading-tight mb-2">
              {locationName}
            </h4>
            
            {visitDate && (
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-white">{visitDate}</span>
              </div>
            )}

            {!visitDate && !isVisited && (
              <div className="inline-flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5 border border-white/10">
                <span className="text-xs text-white/50 italic">Belum dikunjungi</span>
              </div>
            )}
          </div>

          <div className="absolute inset-2 border-2 border-white/10 rounded-xl pointer-events-none" />
          
          {isVisited && (
            <>
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-primary/50 rounded-tl-lg" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-primary/50 rounded-tr-lg" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-primary/50 rounded-bl-lg" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-primary/50 rounded-br-lg" />
            </>
          )}
        </div>
      </Card>

      {isVisited && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
          Verified
        </div>
      )}
    </div>
  );
}
