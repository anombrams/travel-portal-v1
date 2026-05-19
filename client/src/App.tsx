import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";
import HomePage from "@/pages/home";
import JelajahPage from "@/pages/jelajah";
import KomunitasPage from "@/pages/komunitas";
import DampakPage from "@/pages/dampak";
import ProfilPage from "@/pages/profil";
import StreamPage from "@/pages/stream";
import BeliTiketPage from "@/pages/beli-tiket";
import LoginPage from "@/pages/login";
import ResetPasswordPage from "@/pages/reset-password";
import RisetDetailPage from "@/pages/riset-detail";
import KarangDetailPage from "@/pages/karang-detail";
import SyaratKetentuanPage from "@/pages/syarat-ketentuan";
import KebijakanPrivasiPage from "@/pages/kebijakan-privasi";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route path="/jelajah" component={JelajahPage} />
      <Route path="/komunitas" component={KomunitasPage} />
      <Route path="/dampak" component={DampakPage} />
      <Route path="/stream" component={StreamPage} />
      <Route path="/profil" component={ProfilPage} />
      <Route path="/beli-tiket/:id" component={BeliTiketPage} />
      <Route path="/riset/:id" component={RisetDetailPage} />
      <Route path="/karang/:id" component={KarangDetailPage} />
      <Route path="/syarat-ketentuan" component={SyaratKetentuanPage} />
      <Route path="/kebijakan-privasi" component={KebijakanPrivasiPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
            <MobileNav />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
