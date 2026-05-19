import { Card } from "@/components/ui/card";
import { TrendingUp, Waves, Shield, Anchor } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative";
  icon: typeof TrendingUp;
}

const stats: StatItem[] = [
  {
    label: "Total PNBP 2024",
    value: "Rp 2.4 Miliar",
    change: "+18%",
    changeType: "positive",
    icon: TrendingUp,
  },
  {
    label: "Karang Diadopsi",
    value: "1,247",
    change: "+42 bulan ini",
    changeType: "positive",
    icon: Waves,
  },
  {
    label: "Patroli Didanai",
    value: "342",
    change: "+28 bulan ini",
    changeType: "positive",
    icon: Shield,
  },
  {
    label: "Wisatawan Sadar",
    value: "24,893",
    change: "+2,847 bulan ini",
    changeType: "positive",
    icon: Anchor,
  },
];

export default function ImpactStats() {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
      data-testid="impact-stats"
    >
      {stats.map((stat, index) => (
        <Card
          key={stat.label}
          className="p-4"
          data-testid={`stat-card-${index}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-display font-bold text-foreground">
            {stat.value}
          </div>
          <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
          {stat.change && (
            <div
              className={`text-xs mt-2 ${
                stat.changeType === "positive"
                  ? "text-chart-4"
                  : "text-destructive"
              }`}
            >
              {stat.change}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
