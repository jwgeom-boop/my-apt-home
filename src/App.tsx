import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "./pages/HomePage";
import PaymentPage from "./pages/PaymentPage";
import QRPage from "./pages/QRPage";
import ReservationPage from "./pages/ReservationPage";
import NoticePage from "./pages/NoticePage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import DefectReportPage from "./pages/DefectReportPage";
import ConsentPage from "./pages/ConsentPage";
import CertificatePage from "./pages/CertificatePage";
import MyPage from "./pages/MyPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/qr" element={<QRPage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/defect" element={<DefectReportPage />} />
          <Route path="/consent" element={<ConsentPage />} />
          <Route path="/certificate" element={<CertificatePage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
