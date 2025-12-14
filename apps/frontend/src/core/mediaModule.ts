import { NativeModules } from "react-native";

import { MediaModule as MediaModuleType } from "@/shared/types/MediaModule";

export const MediaModule = NativeModules.MediaModule as MediaModuleType;
