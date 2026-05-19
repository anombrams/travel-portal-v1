import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format, startOfDay, differenceInSeconds } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { QRCodeSVG } from "qrcode.react";
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Calendar as CalendarIcon, 
  Clock, 
  Ticket, 
  CreditCard,
  CheckCircle,
  Loader2,
  Smartphone,
  Building2,
  Copy,
  Timer
} from "lucide-react";
import type { Location, Ticket as TicketType } from "@shared/schema";

import bandaImage from "@assets/generated_images/banda_islands_aerial_view.png";
import sawuImage from "@assets/generated_images/sawu_sea_whales.png";
import rajaAmpatImage from "@assets/generated_images/raja_ampat_coral_reef.png";
import giliImage from "@assets/generated_images/gili_matra_beach_paradise.png";
import wakatobiImage from "@assets/generated_images/wakatobi_aerial_coral_paradise.png";
import komodoImage from "@assets/generated_images/komodo_underwater_manta_rays.png";
import bunakenImage from "@assets/generated_images/bunaken_wall_diving_scene.png";
import derawanImage from "@assets/generated_images/derawan_jellyfish_lake_paradise.png";
import karimunjawaImage from "@assets/generated_images/karimunjawa_islands_aerial_view.png";
import togianImage from "@assets/generated_images/togian_islands_jellyfish_lake.png";
import takabonerateImage from "@assets/generated_images/taka_bonerate_atoll_aerial.png";
import morotaiImage from "@assets/generated_images/morotai_wwii_wreck_diving.png";
import wehImage from "@assets/generated_images/pulau_weh_diving_paradise.png";
import cenderawasihImage from "@assets/generated_images/cenderawasih_whale_shark_encounter.png";
import seribuImage from "@assets/generated_images/kepulauan_seribu_islands_aerial.png";
import anambasImage from "@assets/generated_images/anambas_blue_lagoon_paradise.png";
import padaidoImage from "@assets/generated_images/padaido_pristine_diving_waters.png";
import biakImage from "@assets/generated_images/biak_underwater_cave_diving.png";
import tanjungLesungImage from "@assets/generated_images/tanjung_lesung_krakatau_view.png";
import waigeoImage from "@assets/generated_images/waigeo_pianemo_iconic_view.png";

const imageMap: Record<string, string> = {
  "/banda.png": bandaImage,
  "/sawu.png": sawuImage,
  "/raja-ampat.png": rajaAmpatImage,
  "/gili.png": giliImage,
  "/wakatobi.png": wakatobiImage,
  "/komodo.png": komodoImage,
  "/bunaken.png": bunakenImage,
  "/derawan.png": derawanImage,
  "banda": bandaImage,
  "sawu": sawuImage,
  "raja-ampat": rajaAmpatImage,
  "gili-matra": giliImage,
  "wakatobi": wakatobiImage,
  "komodo": komodoImage,
  "bunaken": bunakenImage,
  "derawan": derawanImage,
  "karimunjawa": karimunjawaImage,
  "togian": togianImage,
  "takabonerate": takabonerateImage,
  "morotai": morotaiImage,
  "weh": wehImage,
  "cenderawasih": cenderawasihImage,
  "seribu": seribuImage,
  "anambas": anambasImage,
  "padaido": padaidoImage,
  "biak": biakImage,
  "tanjung-lesung": tanjungLesungImage,
  "waigeo": waigeoImage,
};

const timeSlots = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "13:00 - 15:00",
  "15:00 - 17:00",
];

const ticketTypes = [
  { id: "wisatawan-domestik", name: "Wisatawan Domestik", price: 1 },
  { id: "wisatawan-asing", name: "Wisatawan Asing", price: 2 },
  { id: "pelajar", name: "Pelajar/Mahasiswa", price: 0.5 },
];

const bankAccounts = [
  { bank: "BCA", accountNumber: "1234567890", accountName: "SEAPARK INDONESIA" },
  { bank: "Mandiri", accountNumber: "0987654321", accountName: "SEAPARK INDONESIA" },
  { bank: "BNI", accountNumber: "5678901234", accountName: "SEAPARK INDONESIA" },
];

export default function BeliTiket() {
  const [, params] = useRoute("/beli-tiket/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [ticketType, setTicketType] = useState<string>("");
  const [participants, setParticipants] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "bank_transfer">("qris");
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [createdTicket, setCreatedTicket] = useState<TicketType | null>(null);
  const [countdown, setCountdown] = useState<string>("");

  const { data: location, isLoading } = useQuery<Location>({
    queryKey: ["/api/locations", params?.id],
    enabled: !!params?.id,
  });

  useEffect(() => {
    if (!createdTicket?.paymentDeadline) return;
    
    const timer = setInterval(() => {
      const deadline = new Date(createdTicket.paymentDeadline!);
      const now = new Date();
      const diff = differenceInSeconds(deadline, now);
      
      if (diff <= 0) {
        setCountdown("00:00:00");
        clearInterval(timer);
        return;
      }
      
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      setCountdown(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [createdTicket?.paymentDeadline]);

  const createTicketMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/tickets", data);
      return response.json();
    },
    onSuccess: (ticket: TicketType) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      setCreatedTicket(ticket);
      setStep(3);
    },
    onError: (error: any) => {
      toast({
        title: "Gagal membuat pesanan",
        description: error?.message || "Slot tidak mencukupi atau terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  const confirmPaymentMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      const response = await apiRequest("PATCH", `/api/tickets/${ticketId}/confirm-payment`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
      setStep(4);
      toast({
        title: "Pembayaran Dikonfirmasi!",
        description: "Tiket sudah tersimpan di Sea-Passport kamu",
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

  const handleSubmit = () => {
    if (!location || !date || !time || !ticketType) return;

    const selectedType = ticketTypes.find(t => t.id === ticketType);
    const totalPrice = Math.round((location.ticketPrice || 0) * selectedType!.price * participants);

    createTicketMutation.mutate({
      locationId: location.id,
      locationName: location.name,
      region: location.region,
      date: format(date, "dd MMM yyyy", { locale: localeId }),
      time: time,
      ticketType: selectedType?.name,
      participants: participants,
      paymentMethod: paymentMethod,
      totalPrice: totalPrice,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Disalin!",
      description: "Nomor rekening berhasil disalin",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Lokasi tidak ditemukan</p>
        <Button onClick={() => setLocation("/jelajah")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
      </div>
    );
  }

  const selectedType = ticketTypes.find(t => t.id === ticketType);
  const totalPrice = selectedType 
    ? (location.ticketPrice || 0) * selectedType.price * participants
    : 0;

  const imageUrl = imageMap[location.id] || imageMap[location.image] || location.image;

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-64 md:h-80">
        <img
          src={imageUrl}
          alt={location.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm text-white hover:bg-black/50"
          onClick={() => setLocation("/jelajah")}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
              <MapPin className="w-3 h-3 mr-1" />
              {location.region}
            </Badge>
            <Badge variant="secondary" className="bg-emerald-500/90 text-white">
              <Users className="w-3 h-3 mr-1" />
              {location.availableSlots} slot tersedia
            </Badge>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
            {location.name}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              <span className={`text-xs hidden sm:block ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                {s === 1 ? "Pilih Jadwal" : s === 2 ? "Konfirmasi" : s === 3 ? "Pembayaran" : "Selesai"}
              </span>
              {s < 4 && <div className="flex-1 h-0.5 bg-muted" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  Pilih Tanggal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < startOfDay(new Date())}
                  className="rounded-md border"
                  data-testid="calendar-date"
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Pilih Waktu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={time === slot ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setTime(slot)}
                        data-testid={`time-slot-${slot.replace(/[:\s-]/g, "")}`}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-primary" />
                    Jenis Tiket
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={ticketType} onValueChange={setTicketType}>
                    <SelectTrigger data-testid="select-ticket-type">
                      <SelectValue placeholder="Pilih jenis tiket" />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="space-y-2">
                    <Label>Jumlah Peserta</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setParticipants(Math.max(1, participants - 1))}
                        disabled={participants <= 1}
                        data-testid="button-minus"
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={participants}
                        onChange={(e) => setParticipants(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center"
                        min={1}
                        max={10}
                        data-testid="input-participants"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setParticipants(Math.min(10, participants + 1))}
                        disabled={participants >= 10}
                        data-testid="button-plus"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Konfirmasi Pembelian</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Destinasi</p>
                    <p className="font-medium">{location.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tanggal</p>
                    <p className="font-medium">{date ? format(date, "dd MMMM yyyy", { locale: localeId }) : "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Waktu</p>
                    <p className="font-medium">{time}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Jenis Tiket</p>
                    <p className="font-medium">{selectedType?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Jumlah Peserta</p>
                    <p className="font-medium">{participants} orang</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Harga per Tiket</p>
                    <p className="font-medium">Rp {((location.ticketPrice || 0) * (selectedType?.price || 1)).toLocaleString("id-ID")}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-lg font-medium">Total Pembayaran</span>
                    <span className="text-2xl font-bold text-primary">
                      Rp {totalPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Pilih Metode Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={`p-4 border rounded-md flex flex-col items-center gap-3 transition-colors hover-elevate ${
                      paymentMethod === "qris" 
                        ? "border-primary bg-primary/5" 
                        : "border-border"
                    }`}
                    onClick={() => setPaymentMethod("qris")}
                    data-testid="button-payment-qris"
                  >
                    <Smartphone className="w-8 h-8 text-primary" />
                    <div className="text-center">
                      <p className="font-medium">QRIS</p>
                      <p className="text-sm text-muted-foreground">Scan QR dengan e-wallet</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`p-4 border rounded-md flex flex-col items-center gap-3 transition-colors hover-elevate ${
                      paymentMethod === "bank_transfer" 
                        ? "border-primary bg-primary/5" 
                        : "border-border"
                    }`}
                    onClick={() => setPaymentMethod("bank_transfer")}
                    data-testid="button-payment-bank"
                  >
                    <Building2 className="w-8 h-8 text-primary" />
                    <div className="text-center">
                      <p className="font-medium">Transfer Bank</p>
                      <p className="text-sm text-muted-foreground">BCA, Mandiri, BNI</p>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 3 && createdTicket && (
          <div className="space-y-6">
            <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <Timer className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-200">Batas Waktu Pembayaran</p>
                      <p className="text-sm text-amber-600 dark:text-amber-400">Selesaikan pembayaran dalam 7 jam</p>
                    </div>
                  </div>
                  <div className="text-2xl font-mono font-bold text-amber-600 dark:text-amber-400" data-testid="text-countdown">
                    {countdown}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instruksi Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center gap-4 p-4 bg-muted rounded-md flex-wrap">
                  <span className="text-muted-foreground">Total Pembayaran</span>
                  <span className="text-2xl font-bold text-primary">
                    Rp {(createdTicket.totalPrice || 0).toLocaleString("id-ID")}
                  </span>
                </div>

                {paymentMethod === "qris" ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-white rounded-lg">
                      <QRCodeSVG
                        value={`SEAPARK-PAYMENT-${createdTicket.id}-${createdTicket.totalPrice}`}
                        size={200}
                        level="H"
                        data-testid="qr-payment"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Scan QR code di atas menggunakan aplikasi e-wallet (GoPay, OVO, DANA, ShopeePay, LinkAja)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Transfer ke salah satu rekening berikut:
                    </p>
                    {bankAccounts.map((account) => (
                      <div key={account.bank} className="flex items-center justify-between p-4 border rounded-md gap-4">
                        <div>
                          <p className="font-medium">{account.bank}</p>
                          <p className="text-lg font-mono">{account.accountNumber}</p>
                          <p className="text-sm text-muted-foreground">{account.accountName}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(account.accountNumber)}
                          data-testid={`button-copy-${account.bank.toLowerCase()}`}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setLocation("/profil")}
                className="flex-1"
                data-testid="button-pay-later"
              >
                Bayar Nanti
              </Button>
              <Button
                onClick={() => confirmPaymentMutation.mutate(createdTicket.id)}
                disabled={confirmPaymentMutation.isPending}
                className="flex-1 gap-2"
                data-testid="button-confirm-payment"
              >
                {confirmPaymentMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Saya Sudah Bayar
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <Card className="text-center py-8">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Pembayaran Berhasil!</h2>
                <p className="text-muted-foreground">
                  Tiket kamu sudah tersimpan di Sea-Passport dan siap digunakan
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setLocation("/profil")} data-testid="button-view-tickets">
                  <Ticket className="w-4 h-4 mr-2" />
                  Lihat Tiket Saya
                </Button>
                <Button variant="outline" onClick={() => setLocation("/jelajah")} data-testid="button-explore-more">
                  Jelajahi Lagi
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step < 3 && (
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep((step - 1) as 1 | 2)}
                className="flex-1 sm:flex-none"
                data-testid="button-prev"
              >
                Kembali
              </Button>
            )}
            <Button
              onClick={() => step === 1 ? setStep(2) : handleSubmit()}
              disabled={step === 1 ? !date || !time || !ticketType : createTicketMutation.isPending}
              className="flex-1 gap-2"
              data-testid="button-next"
            >
              {createTicketMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : step === 1 ? (
                "Lanjutkan"
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Lanjut ke Pembayaran
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
