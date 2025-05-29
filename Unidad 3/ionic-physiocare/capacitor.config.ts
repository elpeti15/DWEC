import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ionic-physiocare',
  webDir: 'www/browser',
  android: {
    allowMixedContent: true
  },
};

export default config;
