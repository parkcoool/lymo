import type { ProviderDoc } from "@lymo/schemas/doc";
import { collection, doc, type FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

import db from "@/core/firestore";

interface GetProviderProps {
  trackId: string;
}

export default async function getProviders({ trackId }: GetProviderProps) {
  const tracksCollection = collection(db, "tracks");
  const trackDoc = doc(tracksCollection, trackId);
  const ProvidersCollection = collection(
    trackDoc,
    "providers"
  ) as FirebaseFirestoreTypes.CollectionReference<ProviderDoc>;

  const providerData = (await ProvidersCollection.get()).docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return providerData;
}
