import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Waves, Anchor, Fish, Shell, Compass, Ship } from "lucide-react";

export default function SyaratKetentuanPage() {
  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-display font-bold">Syarat dan Ketentuan</h1>
      </div>

      <Card className="p-6">
        <ScrollArea className="h-[70vh]">
          <div className="space-y-6 pr-4">
            <div className="bg-primary/10 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Compass className="w-5 h-5 text-primary" />
                <span className="font-semibold text-primary">Selamat Datang, Navigator!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Dengan bergabung di seapark.id, kamu menjadi bagian dari komunitas penjaga laut Indonesia. 
                Yuk, pahami aturan main kita supaya perjalanan konservasi makin seru!
              </p>
            </div>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Anchor className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold">1. Siap Berlayar?</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Platform seapark.id adalah gerbang digital menuju 20 kawasan konservasi laut Indonesia. 
                Dengan menggunakan layanan kami, kamu setuju untuk menjaga kelestarian laut dan mengikuti 
                aturan yang berlaku di setiap destinasi. Semua transaksi tiket merupakan bagian dari 
                Penerimaan Negara Bukan Pajak (PNBP) yang 100% transparan.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Ship className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold">2. Daftar Sea-Passport</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Untuk jadi navigator resmi, kamu perlu bikin akun Sea-Passport dengan:
              </p>
              <ul className="text-muted-foreground text-sm leading-relaxed space-y-2 list-disc pl-5">
                <li>Email aktif yang valid untuk notifikasi perjalanan</li>
                <li>Password yang kuat (minimal 6 karakter)</li>
                <li>Nama yang akan muncul di tiket dan sertifikat adopsi karang</li>
              </ul>
              <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                Jaga baik-baik kredensial akunmu ya! Kamu bertanggung jawab atas semua aktivitas di akunmu.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Waves className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold">3. Beli Tiket Eksplorasi</h2>
              </div>
              <ul className="text-muted-foreground text-sm leading-relaxed space-y-2 list-disc pl-5">
                <li>Pilih destinasi dari Raja Ampat sampai Derawan - 20 surga laut menunggumu!</li>
                <li>Bayar via QRIS atau Transfer Bank dalam waktu 7 jam setelah booking</li>
                <li>Tiket berlaku untuk tanggal & lokasi yang dipilih - no reschedule ya!</li>
                <li>Tunjukkan QR Code ke petugas untuk scan & dapetin stamp lokasi</li>
                <li>Tiket non-refundable kecuali force majeure (bencana alam, dll)</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Shell className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold">4. Adopsi Karang</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Jadi orang tua asuh karang itu keren banget! Ini yang perlu kamu tau:
              </p>
              <ul className="text-muted-foreground text-sm leading-relaxed space-y-2 list-disc pl-5">
                <li>Pilih lokasi karang dari 20 kawasan konservasi</li>
                <li>Setelah bayar, sertifikat digital langsung masuk ke Sea-Passport</li>
                <li>Update kondisi karang dikirim berkala via platform</li>
                <li>Kontribusimu masuk ke program rehabilitasi terumbu karang nasional</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Fish className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold">5. Aturan Komunitas</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Sea-Log dan Trip Buddy adalah ruang berbagi yang positif. Keep it clean:
              </p>
              <ul className="text-muted-foreground text-sm leading-relaxed space-y-2 list-disc pl-5">
                <li>Share pengalaman diving, snorkeling, dan eksplorasi laut yang seru</li>
                <li>Hormati sesama navigator - no SARA, no bullying</li>
                <li>Foto/video harus original dan tidak melanggar hak cipta</li>
                <li>Konten yang melanggar bisa dihapus tanpa pemberitahuan</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Compass className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold">6. Transparansi PNBP</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Setiap rupiah dari tiketmu adalah investasi untuk laut Indonesia! Lihat alokasi dana 
                real-time di halaman Dampak: berapa yang masuk ke konservasi, riset, pemberdayaan 
                masyarakat lokal, dan infrastruktur. Kita percaya transparansi = kepercayaan.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Anchor className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold">7. Level Up & Rewards</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Kumpulkan stamp dari setiap kunjungan untuk naik level! Dari Pemula sampai Legenda Laut, 
                setiap pencapaian tercatat di Sea-Passport. XP didapat dari kunjungan, adopsi karang, 
                dan aktivitas komunitas. Keep exploring!
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Ship className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold">8. Update & Kontak</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ketentuan ini bisa berubah sesuai perkembangan platform. Update akan diumumkan via 
                email dan notifikasi. Ada pertanyaan? Chat kami di info@seapark.id atau cek FAQ 
                di halaman Profil. Happy exploring, Navigator!
              </p>
            </section>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
