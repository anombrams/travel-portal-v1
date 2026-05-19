import { useQuery } from "@tanstack/react-query";
import InteractiveMap from "@/components/features/InteractiveMap";
import LocationCard from "@/components/features/LocationCard";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Location } from "@shared/schema";
import bandaImage from "@assets/generated_images/banda_islands_aerial_view.png";
import sawuImage from "@assets/generated_images/sawu_sea_whales.png";
import rajaAmpatImage from "@assets/generated_images/raja_ampat_coral_reef.png";
import giliImage from "@assets/generated_images/gili_matra_beach_paradise.png";
import wakatobiImage from "@assets/generated_images/wakatobi_aerial_coral_paradise.png";
import komodoImage from "@assets/generated_images/komodo_underwater_manta_rays.png";
import bunakenImage from "@assets/generated_images/bunaken_wall_diving_scene.png";
import derawanImage from "@assets/generated_images/derawan_jellyfish_lake_paradise.png";
import karimunjawaImage from "@assets/generated_images/karimunjawa_islands_aerial_view.png";
import togianImage from "@assets/generated_images/togian_islands_jellyfish_lake.png";
import takabonerateImage from "@assets/generated_images/taka_bonerate_atoll_aerial.png";
import morotaiImage from "@assets/generated_images/morotai_wwii_wreck_diving.png";
import wehImage from "@assets/generated_images/pulau_weh_diving_paradise.png";
import cenderawasihImage from "@assets/generated_images/cenderawasih_whale_shark_encounter.png";
import seribuImage from "@assets/generated_images/kepulauan_seribu_islands_aerial.png";
import anambasImage from "@assets/generated_images/anambas_blue_lagoon_paradise.png";
import padaidoImage from "@assets/generated_images/padaido_pristine_diving_waters.png";
import biakImage from "@assets/generated_images/biak_underwater_cave_diving.png";
import tanjungLesungImage from "@assets/generated_images/tanjung_lesung_krakatau_view.png";
import waigeoImage from "@assets/generated_images/waigeo_pianemo_iconic_view.png";

const locationImages: Record<string, string> = {
  "banda": bandaImage,
  "sawu": sawuImage,
  "raja-ampat": rajaAmpatImage,
  "gili-matra": giliImage,
  "wakatobi": wakatobiImage,
  "komodo": komodoImage,
  "bunaken": bunakenImage,
  "derawan": derawanImage,
  "karimunjawa": karimunjawaImage,
  "togian": togianImage,
  "takabonerate": takabonerateImage,
  "morotai": morotaiImage,
  "weh": wehImage,
  "cenderawasih": cenderawasihImage,
  "seribu": seribuImage,
  "anambas": anambasImage,
  "padaido": padaidoImage,
  "biak": biakImage,
  "tanjung-lesung": tanjungLesungImage,
  "waigeo": waigeoImage,
};

export default function JelajahPage() {
  const { toast } = useToast();

  const { data: locations = [], isLoading } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  const handleLocationSelect = (id: string) => {
    const location = locations.find(l => l.id === id);
    toast({
      title: `Beli Tiket - ${location?.name || id}`,
      description: "Fitur pembelian tiket akan segera tersedia!",
    });
  };

  const handleMapSelect = (location: any) => {
    toast({
      title: `${location.name}`,
      description: location.description,
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-20 md:pb-8" data-testid="jelajah-page">
      <div className="px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="font-display font-bold text-3xl md:text-5xl text-foreground mb-4">
            Jelajahi Indonesia
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pilih destinasi konservasi laut dan mulai petualanganmu
          </p>
        </div>

        <div className="mb-12">
          <InteractiveMap onLocationSelect={handleMapSelect} />
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground">
                Semua Destinasi
              </h2>
              <p className="text-muted-foreground text-sm">Pilih kawasan konservasi favoritmu</p>
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {locations.map((location) => (
                <LocationCard
                  key={location.id}
                  id={location.id}
                  name={location.name}
                  region={location.region}
                  image={locationImages[location.id] || location.image}
                  description={location.description}
                  availableSlots={location.availableSlots ?? 100}
                  features={location.features ?? []}
                  onSelect={handleLocationSelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
