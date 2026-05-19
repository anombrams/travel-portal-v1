import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { QRCodeSVG } from "qrcode.react";
import { Calendar, MapPin, Users, Clock, Download, Timer, AlertCircle, CreditCard, Waves } from "lucide-react";
import { differenceInSeconds, format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useLocation } from "wouter";
import html2canvas from "html2canvas";

interface Ticket {
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

interface TicketWalletProps {
  tickets: Ticket[];
  onDownload?: (ticketId: string) => void;
  onConfirmPayment?: (ticketId: string) => void;
}

const statusLabels = {
  active: "Aktif",
  used: "Terpakai",
  expired: "Kadaluarsa",
};

const statusColors = {
  active: "bg-chart-4 text-white",
  used: "bg-muted text-muted-foreground",
  expired: "bg-destructive/20 text-destructive",
};

const paymentStatusLabels: Record<string, string> = {
  pending: "Menunggu Pembayaran",
  paid: "Lunas",
  expired: "Kadaluarsa",
};

const paymentStatusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  expired: "bg-destructive/20 text-destructive",
};

function CountdownTimer({ deadline }: { deadline: string | Date }) {
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const diff = differenceInSeconds(deadlineDate, now);

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
  }, [deadline]);

  return <span className="font-mono font-medium">{countdown}</span>;
}

function DownloadableTicket({ ticket }: { ticket: Ticket }) {
  return (
    <div
      style={{
        width: "400px",
        padding: "24px",
        backgroundColor: "#ffffff",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <Waves style={{ width: "24px", height: "24px", color: "#0d9488" }} />
        <span
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#0d9488",
          }}
        >
          seapark.id
        </span>
      </div>

      <div
        style={{
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#1f2937",
            margin: "0 0 4px 0",
          }}
        >
          {ticket.location}
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            margin: 0,
          }}
        >
          E-Ticket Konservasi Laut
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "24px",
          backgroundColor: "#f3f4f6",
          borderRadius: "12px",
          marginBottom: "16px",
        }}
      >
        <QRCodeSVG value={ticket.qrCode} size={180} level="H" />
      </div>

      <p
        style={{
          fontSize: "12px",
          color: "#6b7280",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Tunjukkan QR code ini kepada petugas di lokasi
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "12px 16px",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <MapPin style={{ width: "16px", height: "16px", color: "#6b7280" }} />
          <span style={{ fontSize: "14px", color: "#374151" }}>{ticket.region}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Clock style={{ width: "16px", height: "16px", color: "#6b7280" }} />
          <span style={{ fontSize: "14px", color: "#374151" }}>{ticket.time}</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "12px 16px",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Calendar style={{ width: "16px", height: "16px", color: "#6b7280" }} />
          <span style={{ fontSize: "14px", color: "#374151" }}>{ticket.date}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Users style={{ width: "16px", height: "16px", color: "#6b7280" }} />
          <span style={{ fontSize: "14px", color: "#374151" }}>{ticket.participants} orang</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "12px 16px",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          marginBottom: "12px",
        }}
      >
        <span style={{ fontSize: "14px", color: "#6b7280" }}>Tipe Tiket</span>
        <span style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>
          {ticket.ticketType}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "12px 16px",
          backgroundColor: "#ecfdf5",
          border: "1px solid #a7f3d0",
          borderRadius: "8px",
          marginBottom: "16px",
        }}
      >
        <span style={{ fontSize: "14px", color: "#047857" }}>Total Dibayar</span>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#047857" }}>
          Rp {(ticket.totalPrice || 0).toLocaleString("id-ID")}
        </span>
      </div>

      <div
        style={{
          textAlign: "center",
          paddingTop: "12px",
          borderTop: "1px dashed #e5e7eb",
        }}
      >
        <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>
          ID Tiket: {ticket.id}
        </p>
      </div>
    </div>
  );
}

export default function TicketWallet({ tickets, onDownload, onConfirmPayment }: TicketWalletProps) {
  const [, setLocation] = useLocation();
  const [downloadingTicketId, setDownloadingTicketId] = useState<string | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleDownloadTicket = async (ticket: Ticket) => {
    setDownloadingTicketId(ticket.id);
    
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    if (ticketRef.current) {
      try {
        const canvas = await html2canvas(ticketRef.current, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
          logging: false,
        });
        
        const link = document.createElement("a");
        link.download = `tiket-${ticket.location.toLowerCase().replace(/\s+/g, "-")}-${ticket.id.slice(0, 8)}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        onDownload?.(ticket.id);
      } catch (error) {
        console.error("Error downloading ticket:", error);
      }
    }
    
    setDownloadingTicketId(null);
  };

  const ticketToDownload = tickets.find((t) => t.id === downloadingTicketId);

  return (
    <div className="space-y-4" data-testid="ticket-wallet">
      {ticketToDownload && (
        <div
          ref={ticketRef}
          style={{
            position: "absolute",
            left: "-9999px",
            top: "-9999px",
          }}
        >
          <DownloadableTicket ticket={ticketToDownload} />
        </div>
      )}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display font-semibold text-lg text-foreground">
          Dompet Tiket
        </h3>
        <Badge variant="secondary">{tickets.length} tiket</Badge>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {tickets.map((ticket) => {
          const isPaid = ticket.paymentStatus === "paid";
          const isPending = ticket.paymentStatus === "pending";
          const isPaymentExpired = ticket.paymentStatus === "expired";
          const canDownload = isPaid && ticket.status === "active";

          return (
            <AccordionItem
              key={ticket.id}
              value={ticket.id}
              className="border-0"
              data-testid={`ticket-item-${ticket.id}`}
            >
              <Card className="overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-4 flex-1 text-left">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-foreground truncate">
                          {ticket.location}
                        </span>
                        {isPaid ? (
                          <Badge className={statusColors[ticket.status]}>
                            {statusLabels[ticket.status]}
                          </Badge>
                        ) : (
                          <Badge className={paymentStatusColors[ticket.paymentStatus || "pending"]}>
                            {paymentStatusLabels[ticket.paymentStatus || "pending"]}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {ticket.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {ticket.participants} orang
                        </span>
                        {isPending && ticket.paymentDeadline && (
                          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                            <Timer className="w-3 h-3" />
                            <CountdownTimer deadline={ticket.paymentDeadline} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="px-4 pb-4">
                    {isPending && (
                      <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg mb-4 border border-amber-200 dark:border-amber-800">
                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                            Menunggu Pembayaran
                          </p>
                          <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                            Total: Rp {(ticket.totalPrice || 0).toLocaleString("id-ID")} ({ticket.paymentMethod === "qris" ? "QRIS" : "Transfer Bank"})
                          </p>
                          <Button
                            size="sm"
                            className="mt-3"
                            onClick={() => onConfirmPayment?.(ticket.id)}
                            data-testid={`button-confirm-payment-${ticket.id}`}
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Konfirmasi Pembayaran
                          </Button>
                        </div>
                      </div>
                    )}

                    {isPaymentExpired && (
                      <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg mb-4 border border-destructive/20">
                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-destructive">
                            Pembayaran Kadaluarsa
                          </p>
                          <p className="text-sm text-destructive/80 mt-1">
                            Silakan buat pemesanan baru
                          </p>
                        </div>
                      </div>
                    )}

                    {isPaid && (
                      <div className="flex flex-col items-center p-6 bg-muted rounded-lg mb-4">
                        <QRCodeSVG
                          value={ticket.qrCode}
                          size={160}
                          level="H"
                          className="mb-4"
                          data-testid={`qr-code-${ticket.id}`}
                        />
                        <p className="text-xs text-muted-foreground text-center">
                          Tunjukkan QR code ini kepada petugas di lokasi
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{ticket.region}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{ticket.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg mb-4 gap-4">
                      <span className="text-sm text-muted-foreground">Tipe Tiket</span>
                      <span className="font-medium text-foreground">{ticket.ticketType}</span>
                    </div>

                    {isPaid && (
                      <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg mb-4 gap-4">
                        <span className="text-sm text-emerald-700 dark:text-emerald-300">Total Dibayar</span>
                        <span className="font-medium text-emerald-700 dark:text-emerald-300">
                          Rp {(ticket.totalPrice || 0).toLocaleString("id-ID")}
                        </span>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDownloadTicket(ticket)}
                      disabled={!canDownload || downloadingTicketId === ticket.id}
                      data-testid={`button-download-${ticket.id}`}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {downloadingTicketId === ticket.id
                        ? "Mengunduh..."
                        : canDownload
                        ? "Unduh Tiket"
                        : "Selesaikan Pembayaran"}
                    </Button>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          );
        })}
      </Accordion>

      {tickets.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Belum ada tiket aktif</p>
          <Button className="mt-4" onClick={() => setLocation("/jelajah")} data-testid="button-buy-first-ticket">
            Beli Tiket Pertamamu
          </Button>
        </Card>
      )}
    </div>
  );
}
