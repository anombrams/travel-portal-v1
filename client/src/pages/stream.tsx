import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Heart, MessageCircle, Share2, Eye, ExternalLink } from "lucide-react";
import { SiTiktok, SiInstagram, SiYoutube } from "react-icons/si";
import rajaAmpatImage from "@assets/generated_images/raja_ampat_coral_reef.png";
import bandaImage from "@assets/generated_images/banda_islands_aerial_view.png";
import sawuImage from "@assets/generated_images/sawu_sea_whales.png";
import giliImage from "@assets/generated_images/gili_matra_beach_paradise.png";

interface StreamContent {
  id: string;
  platform: "tiktok" | "instagram" | "youtube";
  title: string;
  description: string;
  thumbnail: string;
  views: string;
  likes: string;
  comments: string;
  duration?: string;
  url: string;
  date: string;
}

const streamContent: StreamContent[] = [
  {
    id: "yt-1",
    platform: "youtube",
    title: "Menjelajah Keindahan Raja Ampat - Surga Bawah Laut Indonesia",
    description: "Dokumentasi perjalanan konservasi kami di Raja Ampat, melihat langsung keanekaragaman hayati laut terkaya di dunia.",
    thumbnail: rajaAmpatImage,
    views: "125K",
    likes: "8.2K",
    comments: "342",
    duration: "12:45",
    url: "https://youtube.com/@seaparkid",
    date: "2 hari lalu",
  },
  {
    id: "tt-1",
    platform: "tiktok",
    title: "POV: Berenang dengan Pari Manta",
    description: "Pengalaman yang tak terlupakan di Raja Ampat! #RajaAmpat #Manta #Diving",
    thumbnail: rajaAmpatImage,
    views: "1.2M",
    likes: "89K",
    comments: "1.2K",
    duration: "0:45",
    url: "https://tiktok.com/@seaparkid",
    date: "5 jam lalu",
  },
  {
    id: "ig-1",
    platform: "instagram",
    title: "Sunset di Banda Neira",
    description: "Golden hour di kepulauan rempah bersejarah. Banda selalu punya cerita.",
    thumbnail: bandaImage,
    views: "45K",
    likes: "12K",
    comments: "234",
    url: "https://instagram.com/seaparkid",
    date: "1 hari lalu",
  },
  {
    id: "yt-2",
    platform: "youtube",
    title: "Adopsi Karang: Cara Kamu Bisa Bantu Konservasi Laut",
    description: "Tutorial lengkap bagaimana program adopsi karang bekerja dan dampaknya untuk ekosistem laut.",
    thumbnail: giliImage,
    views: "67K",
    likes: "4.5K",
    comments: "189",
    duration: "8:32",
    url: "https://youtube.com/@seaparkid",
    date: "1 minggu lalu",
  },
  {
    id: "tt-2",
    platform: "tiktok",
    title: "Lumba-lumba di Laut Sawu!",
    description: "Koridor migrasi cetacea terbesar di Indonesia #LautSawu #Dolphin #NTT",
    thumbnail: sawuImage,
    views: "890K",
    likes: "67K",
    comments: "892",
    duration: "0:30",
    url: "https://tiktok.com/@seaparkid",
    date: "3 hari lalu",
  },
  {
    id: "ig-2",
    platform: "instagram",
    title: "Penyu Hijau di Gili Matra",
    description: "Habitat penyu yang dilindungi. Mari jaga bersama!",
    thumbnail: giliImage,
    views: "38K",
    likes: "9.8K",
    comments: "156",
    url: "https://instagram.com/seaparkid",
    date: "4 hari lalu",
  },
  {
    id: "yt-3",
    platform: "youtube",
    title: "Live: Mendengar Suara Paus di Laut Sawu",
    description: "Rekaman hydrophone langsung dari laut dalam Sawu - pengalaman cetacean symphony.",
    thumbnail: sawuImage,
    views: "234K",
    likes: "18K",
    comments: "567",
    duration: "45:00",
    url: "https://youtube.com/@seaparkid",
    date: "2 minggu lalu",
  },
  {
    id: "ig-3",
    platform: "instagram",
    title: "Behind the Scenes: Tim Patrol Laut",
    description: "Sehari bersama pahlawan konservasi kita di lapangan.",
    thumbnail: bandaImage,
    views: "28K",
    likes: "7.2K",
    comments: "98",
    url: "https://instagram.com/seaparkid",
    date: "6 hari lalu",
  },
  {
    id: "tt-3",
    platform: "tiktok",
    title: "Fakta Unik Terumbu Karang",
    description: "Tahukah kamu? 1 hektar karang = rumah 1 juta spesies! #Konservasi #Karang",
    thumbnail: giliImage,
    views: "2.1M",
    likes: "156K",
    comments: "2.3K",
    duration: "0:58",
    url: "https://tiktok.com/@seaparkid",
    date: "1 minggu lalu",
  },
];

function getPlatformIcon(platform: string) {
  switch (platform) {
    case "tiktok":
      return <SiTiktok className="w-4 h-4" />;
    case "instagram":
      return <SiInstagram className="w-4 h-4" />;
    case "youtube":
      return <SiYoutube className="w-4 h-4" />;
    default:
      return null;
  }
}

function getPlatformColor(platform: string) {
  switch (platform) {
    case "tiktok":
      return "bg-black text-white dark:bg-white dark:text-black";
    case "instagram":
      return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
    case "youtube":
      return "bg-red-600 text-white";
    default:
      return "bg-primary text-primary-foreground";
  }
}

function StreamCard({ content }: { content: StreamContent }) {
  const handleClick = () => {
    window.open(content.url, "_blank");
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover-elevate active-elevate-2 transition-all"
      onClick={handleClick}
      data-testid={`stream-card-${content.id}`}
    >
      <div className="relative">
        <img
          src={content.thumbnail}
          alt={content.title}
          className="w-full aspect-video object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
            <Play className="w-6 h-6 text-foreground fill-current ml-1" />
          </div>
        </div>
        {content.duration && (
          <Badge className="absolute bottom-2 right-2 bg-black/80 text-white text-xs">
            {content.duration}
          </Badge>
        )}
        <Badge className={`absolute top-2 left-2 ${getPlatformColor(content.platform)} flex items-center gap-1`}>
          {getPlatformIcon(content.platform)}
          <span className="capitalize">{content.platform}</span>
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2 mb-2" data-testid={`stream-title-${content.id}`}>
          {content.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {content.description}
        </p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {content.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {content.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {content.comments}
            </span>
          </div>
          <span>{content.date}</span>
        </div>
      </div>
    </Card>
  );
}

function SocialStats() {
  const stats = [
    { platform: "YouTube", handle: "@seaparkid", followers: "45.2K", icon: <SiYoutube className="w-6 h-6" />, color: "text-red-600", url: "https://youtube.com/@seaparkid" },
    { platform: "TikTok", handle: "@seaparkid", followers: "128K", icon: <SiTiktok className="w-6 h-6" />, color: "text-foreground", url: "https://tiktok.com/@seaparkid" },
    { platform: "Instagram", handle: "@seaparkid", followers: "67.8K", icon: <SiInstagram className="w-6 h-6" />, color: "text-pink-600", url: "https://instagram.com/seaparkid" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => (
        <Card 
          key={stat.platform} 
          className="p-4 cursor-pointer hover-elevate active-elevate-2 transition-all"
          onClick={() => window.open(stat.url, "_blank")}
          data-testid={`social-stat-${stat.platform.toLowerCase()}`}
        >
          <div className="flex items-center gap-4">
            <div className={`${stat.color}`}>
              {stat.icon}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{stat.platform}</p>
              <p className="text-sm text-muted-foreground">{stat.handle}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">{stat.followers}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function StreamPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredContent = activeTab === "all" 
    ? streamContent 
    : streamContent.filter(c => c.platform === activeTab);

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="stream-page-title">Stream</h1>
          <p className="text-muted-foreground">
            Konten terbaru dari channel resmi seapark.id
          </p>
        </div>

        <SocialStats />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="all" data-testid="tab-all">Semua</TabsTrigger>
            <TabsTrigger value="youtube" data-testid="tab-youtube" className="flex items-center gap-1">
              <SiYoutube className="w-4 h-4" />
              <span className="hidden sm:inline">YouTube</span>
            </TabsTrigger>
            <TabsTrigger value="tiktok" data-testid="tab-tiktok" className="flex items-center gap-1">
              <SiTiktok className="w-4 h-4" />
              <span className="hidden sm:inline">TikTok</span>
            </TabsTrigger>
            <TabsTrigger value="instagram" data-testid="tab-instagram" className="flex items-center gap-1">
              <SiInstagram className="w-4 h-4" />
              <span className="hidden sm:inline">Instagram</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((content) => (
            <StreamCard key={content.id} content={content} />
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Belum ada konten di platform ini</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => window.open("https://linktr.ee/seaparkid", "_blank")}
            data-testid="button-more-content"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Lihat Semua Channel
          </Button>
        </div>
      </div>
    </div>
  );
}
