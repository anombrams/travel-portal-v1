import { Link, useParams } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Waves, Calendar, User, MapPin, Camera, TrendingUp } from "lucide-react";

interface CoralData {
  id: string;
  species: string;
  adoptedBy: string;
  adoptedDate: string;
  status: "healthy" | "recovering" | "growing";
  imageUrl: string;
  location: string;
  description: string;
  updates: {
    date: string;
    title: string;
    description: string;
    imageUrl: string;
  }[];
  stats: {
    growth: string;
    health: number;
    biodiversity: number;
  };
}

const coralDatabase: Record<string, CoralData> = {
  c1: {
    id: "c1",
    species: "Acropora",
    adoptedBy: "Andi S.",
    adoptedDate: "15 Nov 2024",
    status: "healthy",
    imageUrl: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&h=500&fit=crop",
    location: "Raja Ampat",
    description: "Karang Acropora adalah salah satu genus karang yang paling beragam dan penting dalam ekosistem terumbu karang. Dikenal sebagai 'karang tanduk rusa', spesies ini menyediakan habitat penting bagi ribuan spesies laut.",
    updates: [
      { date: "10 Dec 2024", title: "Pertumbuhan Optimal", description: "Karang menunjukkan pertumbuhan 2.5cm dalam sebulan terakhir. Kondisi air optimal.", imageUrl: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&h=250&fit=crop" },
      { date: "25 Nov 2024", title: "Monitoring Rutin", description: "Tim riset melakukan pengecekan bulanan. Tidak ditemukan tanda-tanda bleaching.", imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=250&fit=crop" },
    ],
    stats: { growth: "+2.5cm", health: 95, biodiversity: 87 },
  },
  c2: {
    id: "c2",
    species: "Pocillopora",
    adoptedBy: "Maya R.",
    adoptedDate: "20 Nov 2024",
    status: "growing",
    imageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=500&fit=crop",
    location: "Banda",
    description: "Pocillopora atau 'karang kembang kol' adalah karang yang tangguh dan cepat tumbuh. Spesies ini sangat adaptif terhadap berbagai kondisi lingkungan.",
    updates: [
      { date: "12 Dec 2024", title: "Koloni Baru Terbentuk", description: "Terdeteksi pembentukan koloni baru di sekitar area transplantasi.", imageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=250&fit=crop" },
    ],
    stats: { growth: "+3.2cm", health: 88, biodiversity: 72 },
  },
  c3: {
    id: "c3",
    species: "Porites",
    adoptedBy: "Budi W.",
    adoptedDate: "1 Dec 2024",
    status: "healthy",
    imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=500&fit=crop",
    location: "Wakatobi",
    description: "Porites adalah genus karang masif yang dikenal karena ketahanannya. Beberapa koloni Porites berusia ratusan hingga ribuan tahun.",
    updates: [
      { date: "15 Dec 2024", title: "Kondisi Stabil", description: "Karang dalam kondisi sehat dengan tingkat pertumbuhan normal.", imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=250&fit=crop" },
    ],
    stats: { growth: "+1.8cm", health: 92, biodiversity: 85 },
  },
  c4: {
    id: "c4",
    species: "Montipora",
    adoptedBy: "Sari K.",
    adoptedDate: "5 Dec 2024",
    status: "recovering",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop",
    location: "Bunaken",
    description: "Montipora adalah karang bercabang yang membentuk struktur kompleks. Saat ini dalam fase pemulihan setelah gangguan cuaca ekstrem.",
    updates: [
      { date: "14 Dec 2024", title: "Proses Pemulihan", description: "Karang menunjukkan tanda-tanda pemulihan positif. Jaringan baru mulai terbentuk.", imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop" },
    ],
    stats: { growth: "+0.8cm", health: 68, biodiversity: 65 },
  },
  c5: {
    id: "c5",
    species: "Stylophora",
    adoptedBy: "Dian P.",
    adoptedDate: "8 Dec 2024",
    status: "growing",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=500&fit=crop",
    location: "Komodo",
    description: "Stylophora adalah karang yang tumbuh cepat dengan bentuk bercabang yang indah. Menjadi rumah bagi banyak ikan kecil dan invertebrata.",
    updates: [
      { date: "16 Dec 2024", title: "Pertumbuhan Aktif", description: "Cabang baru terlihat berkembang dengan baik. Ekosistem mikro mulai terbentuk.", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop" },
    ],
    stats: { growth: "+2.1cm", health: 85, biodiversity: 78 },
  },
  c6: {
    id: "c6",
    species: "Acropora",
    adoptedBy: "Rani M.",
    adoptedDate: "10 Dec 2024",
    status: "healthy",
    imageUrl: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&h=500&fit=crop",
    location: "Derawan",
    description: "Karang Acropora di Derawan terkenal dengan warna cerahnya. Area ini menjadi habitat penting bagi penyu hijau dan berbagai spesies ikan.",
    updates: [
      { date: "17 Dec 2024", title: "Kondisi Prima", description: "Karang dalam kondisi sangat baik. Tercatat kunjungan penyu hijau di sekitar area.", imageUrl: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=400&h=250&fit=crop" },
    ],
    stats: { growth: "+1.5cm", health: 94, biodiversity: 91 },
  },
  c7: {
    id: "c7",
    species: "Seriatopora",
    adoptedBy: "Toni H.",
    adoptedDate: "12 Dec 2024",
    status: "growing",
    imageUrl: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&h=500&fit=crop",
    location: "Gili Matra",
    description: "Seriatopora atau 'karang jarum' memiliki cabang yang sangat halus dan rapuh. Karang ini sensitif terhadap perubahan lingkungan namun tumbuh dengan cepat dalam kondisi optimal.",
    updates: [
      { date: "18 Dec 2024", title: "Pertumbuhan Cabang Baru", description: "Terlihat pertumbuhan cabang-cabang baru yang sehat. Ikan-ikan kecil mulai menjadikannya tempat berlindung.", imageUrl: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&h=250&fit=crop" },
      { date: "14 Dec 2024", title: "Pemasangan Tag Monitoring", description: "Tim peneliti memasang tag untuk memantau pertumbuhan secara berkala.", imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=250&fit=crop" },
    ],
    stats: { growth: "+2.8cm", health: 82, biodiversity: 76 },
  },
  c8: {
    id: "c8",
    species: "Fungia",
    adoptedBy: "Lisa A.",
    adoptedDate: "14 Dec 2024",
    status: "healthy",
    imageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=500&fit=crop",
    location: "Sawu",
    description: "Fungia atau 'karang jamur' adalah karang soliter yang unik. Berbeda dengan karang lainnya, Fungia dapat bergerak perlahan di dasar laut dan tidak melekat permanen pada substrat.",
    updates: [
      { date: "19 Dec 2024", title: "Aktivitas Normal", description: "Karang menunjukkan pola makan aktif di malam hari. Warna tetap cerah dan sehat.", imageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=250&fit=crop" },
    ],
    stats: { growth: "+0.5cm", health: 90, biodiversity: 68 },
  },
};

const statusColors = {
  healthy: "bg-green-500",
  recovering: "bg-amber-500",
  growing: "bg-blue-500",
};

const statusLabels = {
  healthy: "Sehat",
  recovering: "Pemulihan",
  growing: "Bertumbuh",
};

export default function KarangDetailPage() {
  const params = useParams();
  const coralId = params.id as string;
  const coral = coralDatabase[coralId];

  if (!coral) {
    return (
      <div className="min-h-screen pt-20 pb-20 md:pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center py-16">
          <Waves className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Karang Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-6">Data karang yang Anda cari tidak tersedia.</p>
          <Link href="/dampak">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dampak
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20 md:pb-8" data-testid="karang-detail-page">
      <div className="px-4 md:px-6 max-w-4xl mx-auto">
        <Link href="/dampak">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>

        <div className="relative rounded-xl overflow-hidden mb-6">
          <img
            src={coral.imageUrl}
            alt={coral.species}
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge className={`${statusColors[coral.status]} text-white mb-2`}>
              {statusLabels[coral.status]}
            </Badge>
            <h1 className="text-3xl font-bold text-white mb-1">{coral.species}</h1>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{coral.location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{coral.stats.growth}</div>
            <div className="text-xs text-muted-foreground">Pertumbuhan</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="w-6 h-6 rounded-full bg-green-500 mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold">
              {coral.stats.health}
            </div>
            <div className="text-2xl font-bold text-foreground">{coral.stats.health}%</div>
            <div className="text-xs text-muted-foreground">Kesehatan</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="w-6 h-6 rounded-full bg-blue-500 mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold">
              {coral.stats.biodiversity}
            </div>
            <div className="text-2xl font-bold text-foreground">{coral.stats.biodiversity}%</div>
            <div className="text-xs text-muted-foreground">Biodiversitas</div>
          </Card>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="font-semibold text-lg text-foreground mb-3">Informasi Adopsi</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Diadopsi oleh <strong className="text-foreground">{coral.adoptedBy}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{coral.adoptedDate}</span>
            </div>
          </div>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            {coral.description}
          </p>
        </Card>

        <section>
          <h2 className="font-semibold text-xl text-foreground mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Update Terbaru
          </h2>
          <div className="space-y-4">
            {coral.updates.map((update, index) => (
              <Card key={index} className="overflow-hidden" data-testid={`update-card-${index}`}>
                <div className="flex flex-col md:flex-row">
                  <img
                    src={update.imageUrl}
                    alt={update.title}
                    className="w-full md:w-48 h-40 md:h-auto object-cover"
                  />
                  <div className="p-4 flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Calendar className="w-3 h-3" />
                      {update.date}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{update.title}</h3>
                    <p className="text-sm text-muted-foreground">{update.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
