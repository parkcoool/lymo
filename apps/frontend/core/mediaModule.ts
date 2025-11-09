import { MediaModule as MediaModuleType } from "@/types/mediaModule";
import { NativeModules } from "react-native";

export const MediaModule = NativeModules.MediaModule as MediaModuleType;
