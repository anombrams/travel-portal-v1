import { useEffect, useState } from "react";
import { Waves, Shield, Anchor } from "lucide-react";

interface TickerItem {
  id: number;
  text: string;
  icon: typeof Waves;
}

const tickerItems: TickerItem[] = [
  { id: 1, text: "Total PNBP Hari Ini: Rp 15.400.000 (Mendanai 3 Patroli di Laut Sawu)", icon: Shield },
  { id: 2, text: "12 Karang Baru Diadopsi Minggu Ini", icon: Waves },
  { id: 3, text: "Raja Ampat: Sisa 24 Slot Selam Hari Ini", icon: Anchor },
  { id: 4, text: "Total Wisatawan Bulan Ini: 2,847 Pelancong Sadar Lingkungan", icon: Waves },
];

export default function LiveTicker() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => prev - 1);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const repeatedItems = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div
      className="w-full h-12 bg-gradient-to-r from-primary to-chart-2 overflow-hidden"
      data-testid="live-ticker"
    >
      <div
        className="flex items-center h-full whitespace-nowrap"
        style={{ transform: `translateX(${offset % (tickerItems.length * 400)}px)` }}
      >
        {repeatedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex items-center gap-3 px-8 text-primary-foreground"
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">{item.text}</span>
            <span className="text-primary-foreground/50 mx-4">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
