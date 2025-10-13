import { searchLRCLib } from "../../tools/searchLRCLib";
import { LRCLIBResult } from "../../types/lrclib";
import getCombinations from "../../utils/getCombinations";

export default async function getLyricsFromLRCLIB(
  title: string,
  artists: string[],
  duration: number
) {
  let lrcLibResult: LRCLIBResult | null = null;
  for (let r = 1; r <= artists.length; r++) {
    const artistStringCandidates = getCombinations(artists, r);

    for (const artistString of artistStringCandidates) {
      const lrcLibResultCandidate = await searchLRCLib({
        title: title,
        artist: artistString.join(" "),
        duration: duration,
      });

      if (lrcLibResultCandidate) {
        lrcLibResult = lrcLibResultCandidate;
        break;
      }
    }
  }

  return lrcLibResult;
}
