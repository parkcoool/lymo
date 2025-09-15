import "./core/admin";

export { default as processLyrics } from "./flows/processLyrics.handler";
export { default as addSong } from "./flows/addSong.handler";
export { default as inferSongMetadata } from "./flows/inferSongMetadata.handler";
export { searchLastfm } from "./tools/searchLastfm";
export { searchLRCLib } from "./tools/searchLRCLib";
export { searchYouTube } from "./tools/searchYouTube";
