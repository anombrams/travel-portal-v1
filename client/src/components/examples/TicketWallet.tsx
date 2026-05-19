import TicketWallet from "../features/TicketWallet";

const mockTickets = [
  {
    id: "ticket-1",
    location: "TWP Raja Ampat",
    region: "Papua Barat",
    date: "20 Des 2024",
    time: "08:00 WIT",
    ticketType: "Wisata Selam",
    participants: 2,
    status: "active" as const,
    qrCode: "SEAPARK-RA-2024-001",
  },
  {
    id: "ticket-2",
    location: "TWP Gili Matra",
    region: "Lombok, NTB",
    date: "15 Nov 2024",
    time: "09:00 WITA",
    ticketType: "Wisata Umum",
    participants: 1,
    status: "used" as const,
    qrCode: "SEAPARK-GM-2024-002",
  },
];

export default function TicketWalletExample() {
  return (
    <div className="max-w-md">
      <TicketWallet
        tickets={mockTickets}
        onDownload={(id) => console.log("Download ticket:", id)}
      />
    </div>
  );
}
