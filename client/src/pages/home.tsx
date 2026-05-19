import { useLocation } from "wouter";
import HeroSection from "@/components/features/HeroSection";
import LiveTicker from "@/components/features/LiveTicker";
import SpotlightCard from "@/components/features/SpotlightCard";
import { useToast } from "@/hooks/use-toast";
import rajaAmpatImage from "@assets/generated_images/raja_ampat_coral_reef.png";
import bandaImage from "@assets/generated_images/banda_islands_aerial_view.png";
import giliImage from "@assets/generated_images/gili_matra_beach_paradise.png";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const spotlightItems = [
    {
      image: rajaAmpatImage,
      title: "Guardian of the Month",
      subtitle: "Ibu Siti, penjaga terumbu karang Raja Ampat selama 15 tahun",
      badge: "Featured",
      action: () => {
        setLocation("/dampak");
        toast({
          title: "Guardian of the Month",
          description: "Lihat kisah inspiratif para penjaga laut di halaman Dampak",
        });
      },
    },
    {
      image: bandaImage,
      title: "Best Shot by User",
      subtitle: "Foto oleh @diver_andi: Sunrise di Gunung Api Banda",
      badge: "Community",
      action: () => {
        setLocation("/komunitas");
        toast({
          title: "Community Highlight",
          description: "Lihat lebih banyak foto dari komunitas di Sea-Log",
        });
      },
    },
    {
      image: giliImage,
      title: "Event Terdekat",
      subtitle: "Beach Cleanup Gili Matra - 20 Des 2024",
      badge: "Upcoming",
      action: () => {
        setLocation("/komunitas");
        toast({
          title: "Event & Academy",
          description: "Daftar event konservasi di tab Academy & Event",
        });
      },
    },
  ];

  const handleDestinationSelect = (dest: string) => {
    setLocation("/jelajah");
    toast({
      title: `Destinasi: ${dest}`,
      description: "Lihat detail dan pesan tiket di halaman Jelajah",
    });
  };

  const handleExploreClick = () => {
    setLocation("/jelajah");
  };

  return (
    <div className="min-h-screen" data-testid="home-page">
      <HeroSection onDestinationSelect={handleDestinationSelect} />

      <LiveTicker />

      <section className="py-12 md:py-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
            Spotlight
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cerita terbaru dari komunitas pelestari laut Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {spotlightItems.map((item, index) => (
            <SpotlightCard
              key={index}
              image={item.image}
              title={item.title}
              subtitle={item.subtitle}
              badge={item.badge}
              onClick={item.action}
            />
          ))}
        </div>
      </section>

      <section className="py-12 md:py-20 bg-muted">
        <div className="px-4 md:px-6 max-w-7xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
            Mengapa seapark.id?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
            Setiap pembelian tiket langsung mendanai konservasi laut
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              className="p-6 cursor-pointer hover-elevate rounded-lg transition-all"
              onClick={() => setLocation("/jelajah")}
              data-testid="step-buy-ticket"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-primary font-display font-bold">1</span>
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-2">Beli Tiket</h3>
              <p className="text-muted-foreground">
                Pilih destinasi dan beli tiket digital dengan mudah
              </p>
            </div>
            <div 
              className="p-6 cursor-pointer hover-elevate rounded-lg transition-all"
              onClick={() => setLocation("/jelajah")}
              data-testid="step-explore"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-primary font-display font-bold">2</span>
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-2">Jelajahi</h3>
              <p className="text-muted-foreground">
                Nikmati keindahan bawah laut Indonesia yang luar biasa
              </p>
            </div>
            <div 
              className="p-6 cursor-pointer hover-elevate rounded-lg transition-all"
              onClick={() => setLocation("/dampak")}
              data-testid="step-impact"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-primary font-display font-bold">3</span>
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-2">Berdampak</h3>
              <p className="text-muted-foreground">
                Dana tiket Anda mendanai patroli dan restorasi karang
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-6">
            Siap Menjadi Penjaga Laut?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Bergabunglah dengan ribuan wisatawan yang memilih wisata berkelanjutan
          </p>
          <button
            className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-8 py-4 text-lg font-semibold hover-elevate active-elevate-2 transition-all"
            onClick={handleExploreClick}
            data-testid="button-cta-explore"
          >
            Mulai Jelajahi
          </button>
        </div>
      </section>
    </div>
  );
}
