import "@/core/init";
import "@/core/admin";

export { default as addTrack } from "@/flows/addTrack.handler";
export { default as generateDetail } from "@/flows/generateDetail.handler";
export { searchLastfm } from "@/tools/searchLastfm";
export { searchLRCLib } from "@/tools/searchLRCLib";
export { searchSpotify } from "@/tools/searchSpotify";
export { groupLyricsFlow } from "@/flows/groupLyrics.flow";
