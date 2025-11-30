import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions";

admin.initializeApp({
  credential: applicationDefault(),
  databaseURL: "https://lymo-65c4d-default-rtdb.firebaseio.com",
});

setGlobalOptions({ maxInstances: 10, region: "asia-northeast3" });
