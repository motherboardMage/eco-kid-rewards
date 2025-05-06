
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4d24526caa1a4608b198a0e7b17c415e',
  appName: 'eco-kid-rewards',
  webDir: 'dist',
  server: {
    url: "https://4d24526c-aa1a-4608-b198-a0e7b17c415e.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  android: {
    backgroundColor: "#FFFFFF"
  }
};

export default config;
