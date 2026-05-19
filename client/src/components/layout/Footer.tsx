import { Link } from "wouter";
import { Waves, Mail, Phone } from "lucide-react";
import { SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-card border-t pb-24 md:pb-0">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Waves className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-lg">seapark.id</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Platform konservasi laut Indonesia untuk generasi yang peduli lingkungan.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">INFO SEAPARK</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/jelajah" className="hover:text-primary transition-colors">
                  Jelajah Destinasi
                </Link>
              </li>
              <li>
                <Link href="/komunitas" className="hover:text-primary transition-colors">
                  Komunitas
                </Link>
              </li>
              <li>
                <Link href="/dampak" className="hover:text-primary transition-colors">
                  Dampak Konservasi
                </Link>
              </li>
              <li>
                <Link href="/stream" className="hover:text-primary transition-colors">
                  Stream
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">LAINNYA</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/syarat-ketentuan" className="hover:text-primary transition-colors">
                  Syarat dan Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/kebijakan-privasi" className="hover:text-primary transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/dampak" className="hover:text-primary transition-colors">
                  Tentang PNBP
                </Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">IKUTI KAMI</h4>
            <div className="flex items-center gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <SiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="TikTok">
                <SiTiktok className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube">
                <SiYoutube className="w-5 h-5" />
              </a>
            </div>

            <h4 className="font-semibold pt-2">HUBUNGI KAMI</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@seapark.id</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+62 21 1234 5678</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-muted-foreground">
            Copyright © 2025 | @LDA | Kementerian Kelautan dan Perikanan RI | All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
