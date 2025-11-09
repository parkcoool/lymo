import { NativeModules } from "react-native";

import { MediaModule as MediaModuleType } from "@/types/mediaModule";

export const MediaModule = NativeModules.MediaModule as MediaModuleType;
