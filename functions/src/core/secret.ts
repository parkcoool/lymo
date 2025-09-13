import { defineSecret } from "firebase-functions/params";

const googleAIapiKey = defineSecret("GEMINI_API_KEY");

export default googleAIapiKey;
