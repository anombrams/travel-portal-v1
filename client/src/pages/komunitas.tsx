import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Loader2, MapPin, Calendar, Users, Wallet, Compass } from "lucide-react";
import TripBuddyCard from "@/components/features/TripBuddyCard";
import SeaLogPost from "@/components/features/SeaLogPost";
import EventCard from "@/components/features/EventCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { TripBuddy, SeaLogPost as SeaLogPostType, Event } from "@shared/schema";
import rajaAmpatImage from "@assets/generated_images/raja_ampat_coral_reef.png";
import bandaImage from "@assets/generated_images/banda_islands_aerial_view.png";
import sawuImage from "@assets/generated_images/sawu_sea_whales.png";
import giliImage from "@assets/generated_images/gili_matra_beach_paradise.png";

const imageMap: Record<string, string> = {
  "/raja-ampat.png": rajaAmpatImage,
  "/banda.png": bandaImage,
  "/sawu.png": sawuImage,
  "/gili.png": giliImage,
};

function getImage(path: string): string {
  return imageMap[path] || path;
}

const destinations = [
  { value: "Raja Ampat", label: "Raja Ampat, Papua Barat" },
  { value: "Banda Neira", label: "Banda Neira, Maluku" },
  { value: "Laut Sawu", label: "Laut Sawu, NTT" },
  { value: "Gili Matra", label: "Gili Matra, NTB" },
];

const budgetOptions = [
  { value: "Rp 2-3 Juta", label: "Rp 2-3 Juta" },
  { value: "Rp 3-5 Juta", label: "Rp 3-5 Juta" },
  { value: "Rp 5-7 Juta", label: "Rp 5-7 Juta" },
  { value: "Rp 8-10 Juta", label: "Rp 8-10 Juta" },
  { value: "Rp 10+ Juta", label: "Rp 10+ Juta" },
];

export default function KomunitasPage() {
  const [activeTab, setActiveTab] = useState("trip-buddy");
  const [searchQuery, setSearchQuery] = useState("");
  const [tripTypeFilter, setTripTypeFilter] = useState("all");
  const [createTripOpen, setCreateTripOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const [tripForm, setTripForm] = useState({
    destination: "",
    dateRange: "",
    budget: "",
    tripType: "open-trip",
    maxParticipants: "6",
    description: "",
  });

  const { data: tripBuddies = [], isLoading: loadingTrips } = useQuery<TripBuddy[]>({
    queryKey: ["/api/trip-buddies"],
  });

  const { data: seaLogPosts = [], isLoading: loadingPosts } = useQuery<SeaLogPostType[]>({
    queryKey: ["/api/sea-log"],
  });

  const { data: events = [], isLoading: loadingEvents } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const joinTripMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/trip-buddies/${id}/join`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trip-buddies"] });
      toast({
        title: "Berhasil Bergabung!",
        description: "Kamu telah bergabung dengan trip ini. Cek profilmu untuk detail.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal Bergabung",
        description: "Trip ini sudah penuh atau tidak tersedia.",
        variant: "destructive",
      });
    },
  });

  const createTripMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      initials: string;
      destination: string;
      dateRange: string;
      budget: string;
      tripType: string;
      maxParticipants: number;
    }) => {
      const res = await apiRequest("POST", "/api/trip-buddies", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trip-buddies"] });
      setCreateTripOpen(false);
      setTripForm({
        destination: "",
        dateRange: "",
        budget: "",
        tripType: "open-trip",
        maxParticipants: "6",
        description: "",
      });
      toast({
        title: "Trip Berhasil Dibuat!",
        description: "Trip kamu sudah dipublikasikan. Tunggu teman perjalanan bergabung.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal Membuat Trip",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  const likePostMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/sea-log/${id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sea-log"] });
    },
  });

  const registerEventMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/events/${id}/register`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Berhasil Terdaftar!",
        description: "Kamu telah terdaftar di event ini. Detail akan dikirim via email.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal Mendaftar",
        description: "Event ini sudah penuh.",
        variant: "destructive",
      });
    },
  });

  const handleCreateTrip = () => {
    if (!user) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk membuat trip.",
        variant: "destructive",
      });
      return;
    }
    setCreateTripOpen(true);
  };

  const handleSubmitTrip = () => {
    if (!tripForm.destination || !tripForm.dateRange || !tripForm.budget) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon lengkapi destinasi, tanggal, dan budget.",
        variant: "destructive",
      });
      return;
    }

    const maxParticipants = parseInt(tripForm.maxParticipants);
    if (isNaN(maxParticipants) || maxParticipants < 2 || maxParticipants > 10) {
      toast({
        title: "Data Tidak Valid",
        description: "Jumlah peserta harus antara 2-10 orang.",
        variant: "destructive",
      });
      return;
    }

    const userName = user?.firstName && user?.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || user?.email?.split("@")[0] || "Pengguna";
    
    const initials = user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : (user?.firstName?.[0] || user?.email?.[0] || "U").toUpperCase();

    createTripMutation.mutate({
      name: userName,
      initials: initials,
      destination: tripForm.destination,
      dateRange: tripForm.dateRange,
      budget: tripForm.budget,
      tripType: tripForm.tripType || "open-trip",
      maxParticipants: maxParticipants,
    });
  };

  const handleUploadPhoto = () => {
    toast({
      title: "Upload Foto",
      description: "Fitur upload akan segera tersedia!",
    });
  };

  const handleComment = (id: string) => {
    toast({
      title: "Komentar",
      description: "Fitur komentar akan segera tersedia!",
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-20 md:pb-8" data-testid="komunitas-page">
      <div className="px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="font-display font-bold text-3xl md:text-5xl text-foreground mb-4">
            Komunitas
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Temukan teman perjalanan, bagikan pengalaman, dan ikuti event konservasi
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="trip-buddy" data-testid="tab-trip-buddy">
                Trip Buddy
              </TabsTrigger>
              <TabsTrigger value="sea-log" data-testid="tab-sea-log">
                Sea-Log
              </TabsTrigger>
              <TabsTrigger value="academy" data-testid="tab-academy">
                Academy & Event
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              {activeTab === "trip-buddy" && (
                <Select value={tripTypeFilter} onValueChange={setTripTypeFilter}>
                  <SelectTrigger className="w-32" data-testid="select-filter">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="open-trip">Open Trip</SelectItem>
                    <SelectItem value="share-cost">Share Cost</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <TabsContent value="trip-buddy">
            {loadingTrips ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tripBuddies
                  .filter((trip) => {
                    const matchesSearch = searchQuery.trim() === "" || 
                      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      trip.dateRange.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesType = tripTypeFilter === "all" || trip.tripType === tripTypeFilter;
                    return matchesSearch && matchesType;
                  })
                  .map((trip) => (
                  <TripBuddyCard
                    key={trip.id}
                    id={trip.id}
                    name={trip.name}
                    initials={trip.initials}
                    destination={trip.destination}
                    dateRange={trip.dateRange}
                    budget={trip.budget}
                    tripType={trip.tripType as "open-trip" | "share-cost"}
                    participants={trip.participants ?? 1}
                    maxParticipants={trip.maxParticipants ?? 6}
                    onJoin={(id) => joinTripMutation.mutate(id)}
                  />
                ))}
              </div>
            )}
            <div className="mt-8 text-center">
              <Button onClick={handleCreateTrip} data-testid="button-create-trip">
                <Plus className="w-4 h-4 mr-2" />
                Buat Trip Baru
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sea-log">
            {loadingPosts ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seaLogPosts
                  .filter((post) => {
                    if (searchQuery.trim() === "") return true;
                    const query = searchQuery.toLowerCase();
                    return post.username.toLowerCase().includes(query) ||
                      post.location.toLowerCase().includes(query) ||
                      post.caption.toLowerCase().includes(query);
                  })
                  .map((post) => (
                  <SeaLogPost
                    key={post.id}
                    id={post.id}
                    username={post.username}
                    initials={post.initials}
                    location={post.location}
                    image={getImage(post.image)}
                    caption={post.caption}
                    likes={post.likes ?? 0}
                    comments={post.comments ?? 0}
                    timeAgo={post.timeAgo ?? "Baru saja"}
                    onLike={(id) => likePostMutation.mutate(id)}
                    onComment={handleComment}
                  />
                ))}
              </div>
            )}
            <Button
              className="fixed bottom-24 md:bottom-8 right-4 md:right-8 rounded-full w-14 h-14 shadow-lg"
              onClick={handleUploadPhoto}
              data-testid="button-upload-photo"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </TabsContent>

          <TabsContent value="academy">
            {loadingEvents ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-6">
                {events
                  .filter((event) => {
                    if (searchQuery.trim() === "") return true;
                    const query = searchQuery.toLowerCase();
                    return event.title.toLowerCase().includes(query) ||
                      event.location.toLowerCase().includes(query) ||
                      event.type.toLowerCase().includes(query);
                  })
                  .map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    date={event.date}
                    time={event.time}
                    location={event.location}
                    type={event.type as "webinar" | "cleanup" | "dive"}
                    participants={event.participants ?? 0}
                    maxParticipants={event.maxParticipants ?? undefined}
                    image={event.image ? getImage(event.image) : undefined}
                    onRegister={(id) => registerEventMutation.mutate(id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={createTripOpen} onOpenChange={setCreateTripOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Compass className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">Buat Trip Baru</DialogTitle>
                <DialogDescription>
                  Ajak teman-teman menjelajahi laut Indonesia bersama
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="destination" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Destinasi
              </Label>
              <Select
                value={tripForm.destination}
                onValueChange={(value) => setTripForm({ ...tripForm, destination: value })}
              >
                <SelectTrigger data-testid="select-destination">
                  <SelectValue placeholder="Pilih destinasi konservasi" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem key={dest.value} value={dest.value}>
                      {dest.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateRange" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Tanggal Perjalanan
              </Label>
              <Input
                id="dateRange"
                placeholder="Contoh: 20-25 Des 2024"
                value={tripForm.dateRange}
                onChange={(e) => setTripForm({ ...tripForm, dateRange: e.target.value })}
                data-testid="input-date-range"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget" className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  Estimasi Budget
                </Label>
                <Select
                  value={tripForm.budget}
                  onValueChange={(value) => setTripForm({ ...tripForm, budget: value })}
                >
                  <SelectTrigger data-testid="select-budget">
                    <SelectValue placeholder="Pilih range" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants" className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Maks. Peserta
                </Label>
                <Select
                  value={tripForm.maxParticipants}
                  onValueChange={(value) => setTripForm({ ...tripForm, maxParticipants: value })}
                >
                  <SelectTrigger data-testid="select-max-participants">
                    <SelectValue placeholder="Jumlah" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} orang
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">Tipe Trip</Label>
              <div className="grid grid-cols-2 gap-3">
                <Card
                  className={`p-4 cursor-pointer transition-all hover-elevate ${
                    tripForm.tripType === "open-trip"
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => setTripForm({ ...tripForm, tripType: "open-trip" })}
                  data-testid="card-open-trip"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-medium text-sm">Open Trip</span>
                    {tripForm.tripType === "open-trip" && (
                      <Badge variant="default" className="text-xs">Dipilih</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Kamu yang mengatur jadwal dan rencana perjalanan
                  </p>
                </Card>
                <Card
                  className={`p-4 cursor-pointer transition-all hover-elevate ${
                    tripForm.tripType === "share-cost"
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => setTripForm({ ...tripForm, tripType: "share-cost" })}
                  data-testid="card-share-cost"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-medium text-sm">Share Cost</span>
                    {tripForm.tripType === "share-cost" && (
                      <Badge variant="default" className="text-xs">Dipilih</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Berbagi biaya perjalanan dengan peserta lain
                  </p>
                </Card>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setCreateTripOpen(false)}
              data-testid="button-cancel-trip"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmitTrip}
              disabled={createTripMutation.isPending}
              data-testid="button-submit-trip"
            >
              {createTripMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Buat Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
