import { NativeModules } from "react-native";

import { MediaModule as MediaModuleType } from "@/shared/types/mediaModule";

export const MediaModule = NativeModules.MediaModule as MediaModuleType;
