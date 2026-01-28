import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  name: "Lymo",
  slug: "lymoapp",
  owner: "parkcool",
  scheme: "lymoapp",
  platforms: ["android"],
  icon: "./assets/icon.png",
  splash: {
    backgroundColor: "#161616",
    image: "./assets/splash-image.png",
    resizeMode: "contain",
  },
  android: {
    package: "com.parkcool.lymoapp",
    adaptiveIcon: {
      foregroundImage: "./assets/icon-foreground.png",
      monochromeImage: "./assets/icon-foreground.png",
      backgroundImage: "./assets/icon-background.png",
      backgroundColor: "#161616",
    },
    permissions: [
      "INTERNET",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
      "VIBRATE",
      "WAKE_LOCK",
      "POST_NOTIFICATIONS",
      "BIND_NOTIFICATION_LISTENER_SERVICE",
    ],
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
  },

  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  plugins: [
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
    "./modules/media-insight-service/app.plugin.js",
  ],
  extra: {
    eas: {
      projectId: "55ac0c16-e58f-4a88-9f6a-ea3d402061df",
    },
  },
});
