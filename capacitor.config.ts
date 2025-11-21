import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.troid.gravely',
  appName: 'Gravely',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
};

export default config;
