import { useRoute, Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Share2, Calendar, MapPin, Users } from "lucide-react";

const researchData: Record<string, {
  id: string;
  title: string;
  summary: string;
  stat: string;
  statLabel: string;
  location: string;
  date: string;
  researcher: string;
  content: string[];
  methodology: string;
  findings: string[];
  recommendations: string[];
}> = {
  "research-1": {
    id: "research-1",
    title: "Populasi Pari Manta Raja Ampat",
    summary: "Peningkatan 12% populasi pari manta dalam 2 tahun terakhir berkat pembatasan wisatawan.",
    stat: "+12%",
    statLabel: "Populasi",
    location: "Raja Ampat, Papua Barat",
    date: "November 2024",
    researcher: "Tim Riset BKKPN Raja Ampat",
    content: [
      "Penelitian ini dilakukan selama periode 2022-2024 untuk memantau populasi pari manta (Mobula alfredi) di perairan Raja Ampat.",
      "Data dikumpulkan melalui survei visual bawah air dan pemasangan tag satelit pada individu tertentu untuk melacak pola migrasi.",
    ],
    methodology: "Survei dilakukan di 12 titik penyelaman utama dengan frekuensi 2 kali per bulan. Tim peneliti menggunakan metode photo-identification untuk mengidentifikasi individu unik berdasarkan pola bintik di bagian ventral.",
    findings: [
      "Populasi pari manta meningkat 12% dari 847 individu (2022) menjadi 948 individu (2024)",
      "Tingkat kelahiran meningkat 18% dibandingkan periode sebelumnya",
      "Area makan utama teridentifikasi di sekitar Pulau Mansuar dan Pulau Arborek",
      "Pembatasan jumlah wisatawan di cleaning station mengurangi stress pada populasi",
    ],
    recommendations: [
      "Mempertahankan kebijakan pembatasan wisatawan di area sensitif",
      "Memperluas zona perlindungan ke area makan yang baru teridentifikasi",
      "Meningkatkan edukasi kepada wisatawan tentang etika penyelaman",
    ],
  },
  "research-2": {
    id: "research-2",
    title: "Kesehatan Terumbu Karang Banda",
    summary: "78% terumbu karang dalam kondisi sehat, meningkat dari 65% di tahun 2022.",
    stat: "78%",
    statLabel: "Sehat",
    location: "Kepulauan Banda, Maluku",
    date: "Oktober 2024",
    researcher: "Tim Riset LIPI & Universitas Pattimura",
    content: [
      "Monitoring kesehatan terumbu karang di Kepulauan Banda dilakukan sebagai bagian dari program restorasi nasional.",
      "Penelitian ini menggunakan metode Line Intercept Transect (LIT) dan Reef Health Index (RHI) untuk mengukur kondisi terumbu.",
    ],
    methodology: "Survei dilakukan di 8 lokasi sampling dengan total panjang transek 2.400 meter. Parameter yang diukur meliputi tutupan karang hidup, alga, dan substrat lainnya.",
    findings: [
      "Tutupan karang hidup meningkat dari 65% (2022) menjadi 78% (2024)",
      "Spesies karang branching (Acropora) menunjukkan pemulihan signifikan",
      "Populasi ikan karang indikator meningkat 25%",
      "Kualitas air tetap optimal dengan visibility rata-rata 20-25 meter",
    ],
    recommendations: [
      "Melanjutkan program transplantasi karang di area yang rusak",
      "Meningkatkan pengawasan terhadap aktivitas penangkapan ikan ilegal",
      "Mengembangkan program citizen science untuk monitoring berkelanjutan",
    ],
  },
  "research-3": {
    id: "research-3",
    title: "Migrasi Cetacea Laut Sawu",
    summary: "23 spesies cetacea teridentifikasi, termasuk 5 spesies langka.",
    stat: "23",
    statLabel: "Spesies",
    location: "Laut Sawu, Nusa Tenggara Timur",
    date: "September 2024",
    researcher: "Tim Riset BKKPN Kupang & WWF Indonesia",
    content: [
      "Laut Sawu merupakan salah satu hotspot keanekaragaman cetacea tertinggi di dunia. Penelitian ini bertujuan untuk mendokumentasikan keragaman spesies dan pola migrasi.",
      "Survei dilakukan selama musim migrasi April-Oktober 2024 menggunakan kombinasi observasi visual dan akustik.",
    ],
    methodology: "Tim peneliti melakukan 48 trip survei dengan total jarak tempuh 3.200 km. Identifikasi spesies dilakukan berdasarkan karakteristik morfologi dan vokalisasi.",
    findings: [
      "23 spesies cetacea berhasil diidentifikasi selama periode survei",
      "5 spesies langka termasuk paus biru, paus sperma, dan lumba-lumba Risso",
      "Puncak migrasi terjadi pada bulan September dengan 156 sighting",
      "Koridor migrasi utama teridentifikasi di selat antara Pulau Rote dan Pulau Sawu",
    ],
    recommendations: [
      "Menetapkan koridor migrasi sebagai zona perlindungan khusus",
      "Mengatur jadwal pelayaran kapal besar untuk menghindari tabrakan",
      "Mengembangkan wisata whale watching berkelanjutan untuk ekonomi lokal",
    ],
  },
};

export default function RisetDetailPage() {
  const [match, params] = useRoute("/riset/:id");
  const researchId = params?.id || "";
  const research = researchData[researchId];

  if (!research) {
    return (
      <div className="min-h-screen pt-20 pb-20 md:pb-8" data-testid="riset-not-found">
        <div className="px-4 md:px-6 max-w-4xl mx-auto text-center">
          <h1 className="font-display font-bold text-2xl text-foreground mb-4">
            Riset Tidak Ditemukan
          </h1>
          <p className="text-muted-foreground mb-6">
            Maaf, laporan riset yang Anda cari tidak tersedia.
          </p>
          <Link href="/dampak">
            <Button data-testid="button-back-to-dampak">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Halaman Dampak
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20 md:pb-8" data-testid="riset-detail-page">
      <div className="px-4 md:px-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/dampak">
            <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="p-4 bg-primary/10 rounded-lg">
            <span className="text-3xl font-display font-bold text-primary">
              {research.stat}
            </span>
            <div className="text-sm text-muted-foreground">{research.statLabel}</div>
          </div>
          <div className="flex-1">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
              {research.title}
            </h1>
            <p className="text-muted-foreground mt-2">{research.summary}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {research.location}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {research.date}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {research.researcher}
          </Badge>
        </div>

        <div className="flex gap-3 mb-8 flex-wrap">
          <Button variant="outline" data-testid="button-download-pdf">
            <Download className="w-4 h-4 mr-2" />
            Unduh PDF
          </Button>
          <Button variant="outline" data-testid="button-share">
            <Share2 className="w-4 h-4 mr-2" />
            Bagikan
          </Button>
        </div>

        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="font-display font-semibold text-xl text-foreground mb-4">
              Ringkasan
            </h2>
            <div className="space-y-4 text-muted-foreground">
              {research.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-display font-semibold text-xl text-foreground mb-4">
              Metodologi
            </h2>
            <p className="text-muted-foreground">{research.methodology}</p>
          </Card>

          <Card className="p-6">
            <h2 className="font-display font-semibold text-xl text-foreground mb-4">
              Temuan Utama
            </h2>
            <ul className="space-y-3">
              {research.findings.map((finding, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{finding}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="font-display font-semibold text-xl text-foreground mb-4">
              Rekomendasi
            </h2>
            <ul className="space-y-3">
              {research.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-sm font-semibold">{index + 1}</span>
                  </div>
                  <span className="text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Tertarik mendukung penelitian konservasi laut?
          </p>
          <Link href="/jelajah">
            <Button data-testid="button-explore">
              Jelajahi Destinasi Konservasi
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
