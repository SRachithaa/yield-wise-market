import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d021f1b2b3fb4680b5903ceeeb7008d1',
  appName: 'CropTrade AgriLink',
  webDir: 'dist',
  server: {
    url: 'https://d021f1b2-b3fb-4680-b590-3ceeeb7008d1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#22c55e",
      showSpinner: false
    }
  }
};

export default config;