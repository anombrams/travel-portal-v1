import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, HelpCircle, Loader2, Key, Ticket, MapPin, Users, Heart, Clock, Download, MessageCircle, Sparkles, Waves } from "lucide-react";

const faqItems = [
  {
    icon: Ticket,
    question: "Gimana sih cara beli tiket?",
    answer: "Gampang banget! Pilih destinasi di Jelajah, tentuin tanggal & jumlah orang, terus bayar via QRIS atau Transfer. Kamu punya waktu 7 jam buat bayar ya!",
    color: "text-blue-500"
  },
  {
    icon: MapPin,
    question: "Cara dapetin stamp lokasi gimana?",
    answer: "Stamp bakal otomatis masuk ke Sea-Passport kamu setelah kunjungan & tiket di-scan sama petugas di lokasi. Koleksi semua stamp-nya!",
    color: "text-green-500"
  },
  {
    icon: Users,
    question: "Trip Buddy itu apaan?",
    answer: "Fitur buat cari temen traveling ke destinasi yang sama! Bisa join trip orang lain atau bikin trip listing sendiri. Seru kan?",
    color: "text-purple-500"
  },
  {
    icon: Heart,
    question: "Cara adopsi karang gimana?",
    answer: "Ke halaman Dampak, pilih lokasi karang, terus bayar. Nanti dapet sertifikat digital + update berkala soal kondisi karang kamu!",
    color: "text-pink-500"
  },
  {
    icon: Clock,
    question: "Pembayaran belum dikonfirmasi, gimana dong?",
    answer: "Tenang! Tiket 'Menunggu Pembayaran' punya batas 7 jam. Kalau lewat, tiket expired & harus order ulang. So, buruan bayar!",
    color: "text-orange-500"
  },
  {
    icon: Download,
    question: "Tiket bisa di-download gak?",
    answer: "Bisa dong! Tapi setelah pembayaran confirmed ya. Tiket ada QR code yang bakal di-scan pas check-in di lokasi.",
    color: "text-cyan-500"
  },
  {
    icon: MessageCircle,
    question: "Butuh bantuan, hubungi kemana?",
    answer: "DM ke support@seapark.id atau WA ke +62 812-3456-7890 (jam 08:00-17:00 WIB). We got you!",
    color: "text-teal-500"
  }
];
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import PassportHeader from "@/components/features/PassportHeader";
import StampCard from "@/components/features/StampCard";
import TicketWallet from "@/components/features/TicketWallet";
import bandaImage from "@assets/generated_images/banda_islands_aerial_view.png";
import sawuImage from "@assets/generated_images/sawu_sea_whales.png";
import rajaAmpatImage from "@assets/generated_images/raja_ampat_coral_reef.png";
import giliImage from "@assets/generated_images/gili_matra_beach_paradise.png";

const stamps = [
  {
    id: "stamp-raja-ampat",
    locationName: "Raja Ampat",
    region: "Papua Barat",
    visitDate: "20 Nov 2024",
    isVisited: true,
    image: rajaAmpatImage,
  },
  {
    id: "stamp-gili",
    locationName: "Gili Matra",
    region: "NTB",
    visitDate: "5 Sep 2024",
    isVisited: true,
    image: giliImage,
  },
  {
    id: "stamp-banda",
    locationName: "Banda Neira",
    region: "Maluku",
    visitDate: "12 Jul 2024",
    isVisited: true,
    image: bandaImage,
  },
  {
    id: "stamp-sawu",
    locationName: "Laut Sawu",
    region: "NTT",
    isVisited: false,
    image: sawuImage,
  },
];

interface TicketData {
  id: string;
  location: string;
  region: string;
  date: string;
  time: string;
  ticketType: string;
  participants: number;
  status: "active" | "used" | "expired";
  qrCode: string;
  paymentStatus?: "pending" | "paid" | "expired" | string | null;
  paymentDeadline?: string | Date | null;
  totalPrice?: number | null;
  paymentMethod?: "qris" | "bank_transfer" | string | null;
}

interface UserProfile {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  level: number | null;
  levelTitle: string | null;
  totalDonation: number | null;
  coralsAdopted: number | null;
  locationsVisited: number | null;
  xp: number | null;
}

export default function ProfilPage() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const tabFromUrl = searchParams.get("tab");
  
  const [activeTab, setActiveTab] = useState(tabFromUrl === "tickets" ? "tickets" : "passport");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();
  const { user: authUser, logout, logoutPending } = useAuth();

  useEffect(() => {
    if (tabFromUrl === "tickets") {
      setActiveTab("tickets");
    }
  }, [tabFromUrl]);

  const { data: user, isLoading } = useQuery<UserProfile>({
    queryKey: ["/api/user/me"],
  });

  const { data: ticketsData } = useQuery<any[]>({
    queryKey: ["/api/tickets"],
  });

  const confirmPaymentMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      const response = await apiRequest("PATCH", `/api/tickets/${ticketId}/confirm-payment`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      toast({
        title: "Pembayaran Dikonfirmasi!",
        description: "Tiket kamu sudah aktif dan siap digunakan",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal mengkonfirmasi pembayaran",
        description: error?.message || "Silakan coba lagi",
        variant: "destructive",
      });
    },
  });

  const tickets: TicketData[] = (ticketsData || []).map((t) => ({
    id: t.id,
    location: t.locationName,
    region: t.region,
    date: t.date,
    time: t.time,
    ticketType: t.ticketType,
    participants: t.participants,
    status: t.status === "active" ? "active" : t.status === "used" ? "used" : "expired",
    qrCode: t.qrCode,
    paymentStatus: t.paymentStatus,
    paymentDeadline: t.paymentDeadline,
    totalPrice: t.totalPrice,
    paymentMethod: t.paymentMethod,
  }));

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { firstName?: string; lastName?: string }) => {
      const res = await apiRequest("PATCH", "/api/user/me", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setEditDialogOpen(false);
      toast({
        title: "Profil diperbarui",
        description: "Informasi profil Anda telah disimpan.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal memperbarui",
        description: "Terjadi kesalahan saat memperbarui profil.",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
      const res = await apiRequest("POST", "/api/user/change-password", data);
      return res.json();
    },
    onSuccess: () => {
      setPasswordDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Password diubah",
        description: "Password Anda berhasil diperbarui.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal mengubah password",
        description: error?.message || "Terjadi kesalahan saat mengubah password.",
        variant: "destructive",
      });
    },
  });

  const handleOpenEdit = () => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setEditDialogOpen(true);
  };

  const handleOpenPasswordDialog = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordDialogOpen(true);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Data tidak lengkap",
        description: "Semua field harus diisi.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password tidak cocok",
        description: "Password baru dan konfirmasi harus sama.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password terlalu pendek",
        description: "Password baru minimal 6 karakter.",
        variant: "destructive",
      });
      return;
    }

    changePasswordMutation.mutate({ currentPassword, newPassword, confirmPassword });
  };

  const handleSaveProfile = () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    
    if (!trimmedFirstName && !trimmedLastName) {
      toast({
        title: "Data tidak valid",
        description: "Minimal satu field harus diisi.",
        variant: "destructive",
      });
      return;
    }

    updateProfileMutation.mutate({ 
      firstName: trimmedFirstName || undefined, 
      lastName: trimmedLastName || undefined 
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/profil`;
    const shareData = {
      title: `Profil ${displayName} - seapark.id`,
      text: `Lihat profil Sea Guardian saya di seapark.id! Level ${user?.level}: ${user?.levelTitle}`,
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link disalin!",
          description: "Link profil telah disalin ke clipboard",
        });
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link disalin!",
          description: "Link profil telah disalin ke clipboard",
        });
      }
    }
  };

  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.firstName || user?.email?.split("@")[0] || "Pengguna";
  
  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : (user?.firstName?.[0] || user?.email?.[0] || "U").toUpperCase();

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-20 md:pb-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20 md:pb-8" data-testid="profil-page">
      <div className="px-4 md:px-6 max-w-2xl mx-auto">
        <PassportHeader
          name={displayName}
          initials={initials}
          level={user?.level || 1}
          levelTitle={user?.levelTitle || "Ocean Explorer"}
          totalDonation={formatCurrency(user?.totalDonation)}
          coralsAdopted={user?.coralsAdopted || 0}
          locationsVisited={user?.locationsVisited || 0}
          onSettings={handleOpenEdit}
          onShare={handleShare}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="w-full">
            <TabsTrigger value="passport" className="flex-1" data-testid="tab-passport">
              Paspor Digital
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex-1" data-testid="tab-tickets">
              Tiket Saya
            </TabsTrigger>
          </TabsList>

          <TabsContent value="passport" className="mt-6">
            <div className="mb-6">
              <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                Stempel Perjalanan
              </h3>
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-4 pb-4">
                  {stamps.map((stamp) => (
                    <StampCard key={stamp.id} {...stamp} />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            <Card className="p-4 mb-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-foreground">Karang Adopsi</h4>
                  <p className="text-sm text-muted-foreground">{user?.coralsAdopted || 0} karang di Raja Ampat</p>
                </div>
                <Button variant="outline" size="sm" data-testid="button-view-corals">
                  Lihat
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold text-foreground mb-3">Level Progress</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 text-sm mb-1 flex-wrap">
                    <span className="text-muted-foreground">Level {user?.level || 1}: {user?.levelTitle || "Ocean Explorer"}</span>
                    <span className="text-foreground">{user?.xp || 0}/1000 XP</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(((user?.xp || 0) / 1000) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Kunjungi 1 lokasi lagi untuk naik ke Level berikutnya
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="tickets" className="mt-6">
            <TicketWallet
              tickets={tickets}
              onDownload={(id) => console.log("Download:", id)}
              onConfirmPayment={(id) => confirmPaymentMutation.mutate(id)}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-8 space-y-3">
          {authUser && (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleOpenPasswordDialog}
              data-testid="button-change-password"
            >
              <Key className="w-4 h-4 mr-3" />
              Ganti Password
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setFaqDialogOpen(true)}
            data-testid="button-help"
          >
            <HelpCircle className="w-4 h-4 mr-3" />
            Bantuan & FAQ
          </Button>
          {authUser && (
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive"
              onClick={handleLogout}
              disabled={logoutPending}
              data-testid="button-logout-profile"
            >
              {logoutPending ? (
                <Loader2 className="w-4 h-4 mr-3 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 mr-3" />
              )}
              Keluar
            </Button>
          )}
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profil</DialogTitle>
            <DialogDescription>
              Perbarui informasi profil Anda di sini.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-firstName">Nama Depan</Label>
              <Input
                id="edit-firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Masukkan nama depan"
                data-testid="input-edit-firstName"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lastName">Nama Belakang</Label>
              <Input
                id="edit-lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Masukkan nama belakang"
                data-testid="input-edit-lastName"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              data-testid="button-cancel-edit"
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={updateProfileMutation.isPending}
              data-testid="button-save-profile"
            >
              {updateProfileMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ganti Password</DialogTitle>
            <DialogDescription>
              Masukkan password lama dan password baru Anda.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Password Saat Ini</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan password saat ini"
                data-testid="input-current-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Password Baru</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                data-testid="input-new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                data-testid="input-confirm-password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPasswordDialogOpen(false)}
              data-testid="button-cancel-password"
            >
              Batal
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={changePasswordMutation.isPending}
              data-testid="button-save-password"
            >
              {changePasswordMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Waves className="w-6 h-6 text-primary" />
              <DialogTitle className="text-xl">FAQ & Bantuan</DialogTitle>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </div>
            <DialogDescription className="text-center">
              Pertanyaan yang sering ditanyakan seputar seapark.id
            </DialogDescription>
          </DialogHeader>
          
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border rounded-lg px-3 data-[state=open]:bg-muted/50"
                >
                  <AccordionTrigger className="text-left py-3 hover:no-underline" data-testid={`faq-question-${index}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full bg-muted ${item.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm pb-4 pl-12" data-testid={`faq-answer-${index}`}>
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
          
          <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-cyan-500/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Masih butuh bantuan?</p>
                <p className="text-xs text-muted-foreground">
                  DM ke <span className="font-medium text-primary">support@seapark.id</span>
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
