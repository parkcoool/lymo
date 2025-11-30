import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions";

admin.initializeApp({
  credential: applicationDefault(),
});

setGlobalOptions({ maxInstances: 10, region: "asia-northeast3" });
