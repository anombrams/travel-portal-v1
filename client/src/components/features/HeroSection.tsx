import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import rajaAmpatImage from "@assets/generated_images/raja_ampat_coral_reef.png";

const destinations = [
  { id: "banda", name: "TWP Laut Banda" },
  { id: "sawu", name: "TNP Laut Sawu" },
  { id: "raja-ampat", name: "TWP Raja Ampat" },
  { id: "gili-matra", name: "TWP Gili Matra" },
];

interface HeroSectionProps {
  onDestinationSelect?: (destination: string) => void;
}

export default function HeroSection({ onDestinationSelect }: HeroSectionProps) {
  const [selectedDestination, setSelectedDestination] = useState("");

  const handleSelect = (value: string) => {
    setSelectedDestination(value);
    onDestinationSelect?.(value);
  };

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="relative h-screen max-h-[800px] flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${rajaAmpatImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1
          className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight"
          data-testid="hero-headline"
        >
          Jelajahi Surga.
          <br />
          Jaga Masa Depan.
        </h1>

        <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Setiap tiket Anda mendanai konservasi laut Indonesia
        </p>

        <div
          className="flex flex-col sm:flex-row items-center gap-4 justify-center max-w-2xl mx-auto"
          data-testid="hero-search"
        >
          <div className="relative flex-1 w-full">
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 p-2">
              <Search className="w-5 h-5 text-white/70 ml-3" />
              <Select value={selectedDestination} onValueChange={handleSelect}>
                <SelectTrigger
                  className="flex-1 border-0 bg-transparent text-white placeholder:text-white/70 focus:ring-0"
                  data-testid="select-destination"
                >
                  <SelectValue placeholder="Mau ke mana bulan ini?" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem
                      key={dest.id}
                      value={dest.id}
                      data-testid={`option-${dest.id}`}
                    >
                      {dest.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            size="lg"
            className="rounded-full px-8 w-full sm:w-auto"
            data-testid="button-explore"
          >
            Jelajahi
          </Button>
        </div>
      </div>

      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer"
        data-testid="button-scroll-down"
        aria-label="Scroll ke bawah"
      >
        <ChevronDown className="w-8 h-8 text-white/60 hover:text-white transition-colors" />
      </button>
    </section>
  );
}
