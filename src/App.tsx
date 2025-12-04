import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import BulkMarketplace from "./pages/BulkMarketplace";
import SmartLogistics from "./pages/SmartLogistics";
import DigitalPayments from "./pages/DigitalPayments";
import SoilAnalysis from "./pages/SoilAnalysis";
import ClimatePrediction from "./pages/ClimatePrediction";
import MarketInsights from "./pages/MarketInsights";
import CommunityHub from "./pages/CommunityHub";
import MobileVoice from "./pages/MobileVoice";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bulk-marketplace" element={<BulkMarketplace />} />
            <Route path="/smart-logistics" element={<SmartLogistics />} />
            <Route path="/digital-payments" element={<DigitalPayments />} />
            <Route path="/soil-analysis" element={<SoilAnalysis />} />
            <Route path="/climate-prediction" element={<ClimatePrediction />} />
            <Route path="/market-insights" element={<MarketInsights />} />
            <Route path="/community-hub" element={<CommunityHub />} />
            <Route path="/mobile-voice" element={<MobileVoice />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
