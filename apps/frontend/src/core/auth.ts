import { connectAuthEmulator, getAuth } from "@react-native-firebase/auth";
import expoConstants from "expo-constants";

const auth = getAuth();

if (__DEV__) {
  const debuggerHost = expoConstants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0] ?? "localhost";
  console.log(`Connecting to Firebase Auth Emulator at ${localhost}:9099`);

  try {
    connectAuthEmulator(auth, `http://${localhost}:9099`);
  } catch (e) {
    console.error("Error connecting to emulator:", e);
  }
}

export default auth;
