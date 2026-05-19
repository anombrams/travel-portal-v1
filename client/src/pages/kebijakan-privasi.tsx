import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Waves, Anchor, Fish, Shell } from "lucide-react";

export default function KebijakanPrivasiPage() {
  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-display font-bold">Kebijakan Privasi</h1>
      </div>

      <Card className="p-6">
        <ScrollArea className="h-[70vh]">
          <div className="space-y-6 pr-4">
            <div className="bg-primary/10 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Waves className="w-5 h-5 text-primary" />
                <span className="font-semibold text-primary">Komitmen Kami</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Seperti menjaga kelestarian laut Indonesia, kami berkomitmen menjaga privasi dan keamanan 
                data pribadi Anda dengan standar perlindungan tertinggi.
              </p>
            </div>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Anchor className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold">1. Data Pelayaran Digital Anda</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Saat Anda berlayar bersama seapark.id, kami mengumpulkan informasi untuk memastikan 
                perjalanan konservasi Anda berjalan lancar:
              </p>
              <ul className="text-muted-foreground text-sm leading-relaxed space-y-2 list-disc pl-5">
                <li>Identitas navigator: nama lengkap dan alamat email</li>
                <li>Jejak eksplorasi: riwayat tiket dan kunjungan ke kawasan konservasi</li>
                <li>Stamp lokasi saat check-in di 20 destinasi laut Indonesia</li>
                <li>Catatan Sea-Log dan interaksi di komunitas Trip Buddy</li>
                <li>Data adopsi karang dan kontribusi konservasi</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Fish className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold">2. Untuk Apa Data Digunakan</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Data Anda membantu kami memberikan pengalaman konservasi terbaik:
              </p>
              <ul className="text-muted-foreground text-sm leading-relaxed space-y-2 list-disc pl-5">
                <li>Memproses tiket dan pembayaran PNBP secara transparan</li>
                <li>Mengelola Sea-Passport dan sistem gamifikasi level</li>
                <li>Mengirim update kondisi karang yang Anda adopsi</li>
                <li>Menghubungkan Anda dengan Trip Buddy yang sesuai</li>
                <li>Menganalisis dampak kolektif program konservasi laut</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Shell className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold">3. Perlindungan Berlapis</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Seperti terumbu karang yang melindungi ekosistem laut, kami menerapkan perlindungan berlapis 
                untuk data Anda. Enkripsi end-to-end memastikan informasi pribadi dan transaksi Anda aman 
                dari akses tidak sah. Kata sandi tersimpan dalam format hash yang tidak dapat dibaca.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Waves className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold">4. Berbagi dengan Mitra Konservasi</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Data Anda hanya dibagikan kepada pengelola 20 kawasan konservasi laut (Raja Ampat, Bunaken, 
                Komodo, dll) untuk verifikasi tiket dan pencatatan pengunjung. Kami tidak menjual data 
                kepada pihak ketiga untuk kepentingan komersial.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Anchor className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold">5. Hak Navigator</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Sebagai penjelajah laut digital, Anda berhak untuk:
              </p>
              <ul className="text-muted-foreground text-sm leading-relaxed space-y-2 list-disc pl-5">
                <li>Mengakses dan mengedit profil Sea-Passport kapan saja</li>
                <li>Mengunduh riwayat kunjungan dan sertifikat adopsi karang</li>
                <li>Menghapus akun beserta seluruh data terkait</li>
                <li>Menonaktifkan notifikasi dan email promosi</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Fish className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold">6. Penyimpanan & Retensi</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Data Sea-Passport aktif selama akun Anda berlayar bersama kami. Riwayat tiket dan PNBP 
                disimpan sesuai regulasi perpajakan nasional. Data adopsi karang tersimpan permanen 
                sebagai bagian dari dokumentasi program konservasi.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Shell className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-semibold">7. Hubungi Kami</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Punya pertanyaan tentang privasi? Hubungi kami di info@seapark.id atau gunakan fitur 
                FAQ di halaman Profil. Tim kami siap membantu melindungi perjalanan konservasi digital Anda.
              </p>
            </section>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
