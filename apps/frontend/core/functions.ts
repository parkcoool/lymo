import { getFunctions } from "@react-native-firebase/functions";
import expoConstants from "expo-constants";

const functions = getFunctions();

if (__DEV__) {
  const debuggerHost = expoConstants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0] ?? "localhost";
  console.log(`Connecting to Firebase Functions at ${localhost}:5001`);

  try {
    functions.useEmulator(localhost, 5001);
  } catch (e) {
    console.error("Error connecting to emulator:", e);
  }
}

export default functions;
