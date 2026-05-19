import { Link } from "wouter";
import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Download, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import ImpactStats from "@/components/features/ImpactStats";
import CoralMap from "@/components/features/CoralMap";

const fundAllocation = [
  { category: "Patroli Laut", percentage: 35, amount: "Rp 840 Juta" },
  { category: "Restorasi Karang", percentage: 25, amount: "Rp 600 Juta" },
  { category: "Riset & Monitoring", percentage: 20, amount: "Rp 480 Juta" },
  { category: "Edukasi Masyarakat", percentage: 15, amount: "Rp 360 Juta" },
  { category: "Operasional", percentage: 5, amount: "Rp 120 Juta" },
];

const researchHighlights = [
  {
    id: "research-1",
    title: "Populasi Pari Manta Raja Ampat",
    summary: "Peningkatan 12% populasi pari manta dalam 2 tahun terakhir berkat pembatasan wisatawan.",
    stat: "+12%",
    statLabel: "Populasi",
  },
  {
    id: "research-2",
    title: "Kesehatan Terumbu Karang Banda",
    summary: "78% terumbu karang dalam kondisi sehat, meningkat dari 65% di tahun 2022.",
    stat: "78%",
    statLabel: "Sehat",
  },
  {
    id: "research-3",
    title: "Migrasi Cetacea Laut Sawu",
    summary: "23 spesies cetacea teridentifikasi, termasuk 5 spesies langka.",
    stat: "23",
    statLabel: "Spesies",
  },
];

export default function DampakPage() {
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    
    try {
      const currentDate = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Sheet 1: Ringkasan
      const summaryData = [
        ["LAPORAN ALOKASI DANA PNBP 2024"],
        ["SeaPark.id - Platform Konservasi Laut Indonesia"],
        [""],
        ["Tanggal Unduh:", currentDate],
        [""],
        ["RINGKASAN"],
        ["Total PNBP 2024", "Rp 2.400.000.000"],
        ["Kawasan Dilindungi", "8 Lokasi"],
        [""],
      ];
      const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
      
      // Set column widths
      ws1["!cols"] = [{ wch: 30 }, { wch: 25 }];
      
      XLSX.utils.book_append_sheet(wb, ws1, "Ringkasan");

      // Sheet 2: Alokasi Dana
      const allocationData = [
        ["ALOKASI DANA PNBP 2024"],
        [""],
        ["Kategori", "Jumlah", "Persentase"],
        ...fundAllocation.map(item => [
          item.category,
          item.amount,
          `${item.percentage}%`
        ]),
        [""],
        ["Total", "Rp 2.4 Miliar", "100%"],
      ];
      const ws2 = XLSX.utils.aoa_to_sheet(allocationData);
      ws2["!cols"] = [{ wch: 25 }, { wch: 20 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws2, "Alokasi Dana");

      // Sheet 3: Riset
      const researchData = [
        ["HIGHLIGHT RISET 2024"],
        [""],
        ["Judul Riset", "Statistik", "Label", "Ringkasan"],
        ...researchHighlights.map(research => [
          research.title,
          research.stat,
          research.statLabel,
          research.summary
        ]),
      ];
      const ws3 = XLSX.utils.aoa_to_sheet(researchData);
      ws3["!cols"] = [{ wch: 35 }, { wch: 12 }, { wch: 12 }, { wch: 60 }];
      XLSX.utils.book_append_sheet(wb, ws3, "Riset");

      // Sheet 4: Kawasan Konservasi
      const locationsData = [
        ["KAWASAN KONSERVASI PERAIRAN"],
        [""],
        ["No", "Nama Kawasan", "Lokasi"],
        ["1", "Raja Ampat", "Papua Barat"],
        ["2", "Banda", "Maluku"],
        ["3", "Sawu", "Nusa Tenggara Timur"],
        ["4", "Gili Matra", "Lombok, NTB"],
        ["5", "Wakatobi", "Sulawesi Tenggara"],
        ["6", "Komodo", "Nusa Tenggara Timur"],
        ["7", "Bunaken", "Sulawesi Utara"],
        ["8", "Derawan", "Kalimantan Timur"],
      ];
      const ws4 = XLSX.utils.aoa_to_sheet(locationsData);
      ws4["!cols"] = [{ wch: 5 }, { wch: 25 }, { wch: 30 }];
      XLSX.utils.book_append_sheet(wb, ws4, "Kawasan");

      // Generate and download
      XLSX.writeFile(wb, `laporan-pnbp-2024-seapark.xlsx`);

      toast({
        title: "Laporan Berhasil Diunduh",
        description: "File Excel telah tersimpan di perangkat Anda.",
      });
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Gagal Mengunduh",
        description: "Terjadi kesalahan saat mengunduh laporan.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20 md:pb-8" data-testid="dampak-page">
      <div className="px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="font-display font-bold text-3xl md:text-5xl text-foreground mb-4">
            Dampak Nyata
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Lihat bagaimana setiap tiket Anda berkontribusi pada pelestarian laut Indonesia
          </p>
        </div>

        <ImpactStats />

        <section className="mt-12 md:mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-2xl text-foreground">
              Alokasi Dana PNBP 2024
            </h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadReport}
              disabled={isDownloading}
              data-testid="button-download-report"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isDownloading ? "Mengunduh..." : "Unduh Laporan"}
            </Button>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              {fundAllocation.map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{item.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm">{item.amount}</span>
                      <Badge variant="secondary">{item.percentage}%</Badge>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground text-sm">Total PNBP 2024</span>
                  <div className="font-display font-bold text-2xl text-foreground">
                    Rp 2.4 Miliar
                  </div>
                </div>
                <Button data-testid="button-view-details">
                  Lihat Detail
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-12 md:mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-2xl text-foreground">
              Peta Adopsi Karang
            </h2>
            <Button variant="outline" data-testid="button-adopt-coral">
              Adopsi Karang
            </Button>
          </div>

          <CoralMap />

          <p className="text-center text-muted-foreground text-sm mt-4">
            Klik titik pada peta untuk melihat detail karang yang sudah diadopsi
          </p>
        </section>

        <section className="mt-12 md:mt-16">
          <h2 className="font-display font-semibold text-2xl text-foreground mb-6">
            Laporan Riset Terkini
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {researchHighlights.map((research) => (
              <Card key={research.id} className="p-6" data-testid={`research-card-${research.id}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <span className="text-2xl font-display font-bold text-primary">
                      {research.stat}
                    </span>
                    <div className="text-xs text-muted-foreground">{research.statLabel}</div>
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {research.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {research.summary}
                </p>
                <Link href={`/riset/${research.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto text-primary"
                    data-testid={`button-read-${research.id}`}
                  >
                    Baca Selengkapnya
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
