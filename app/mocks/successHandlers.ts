import type MockAdapter from "axios-mock-adapter";

import type { GetLyricalSongsResponse } from "~/apis/getLyricalSongs";
import type { GetLyricsResponse } from "~/apis/getLyrics";
import type { SongDocument } from "~/apis/getPopularSongs";
import type { GetSongResponse } from "~/apis/getSong";
import type { GetSongOverviewResponse } from "~/apis/getSongOverview";
import lyricsPreviews from "~/mocks/lyricsPreviews";
import overviews from "~/mocks/overviews";
import songs from "~/mocks/songs";

import processLyrics from "./processLyrics";

const successHandlers = (mock: MockAdapter) => {
  // getPopularSongs
  mock.onGet("/song/popular").reply<SongDocument>(200, {
    songs: songs.map((song) => ({
      id: song.id,
      title: song.title,
      coverUrl: song.coverUrl,
    })),
  });

  // getLyricalSongs
  mock.onGet("/song/lyrical").reply<GetLyricalSongsResponse>(200, {
    songs: songs.map((song) => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      coverUrl: song.coverUrl,
      lyricsPreview: lyricsPreviews[song.id] ?? "",
    })),
  });

  // getSong
  mock.onGet("/song").reply<GetSongResponse>((config) => {
    const songId = config.params?.songId;
    const song = songs.find((s) => s.id === songId);
    if (song) {
      return [200, { song }];
    }
    return [404];
  });

  // getSongOverview
  mock.onGet("/song/overview").reply<GetSongOverviewResponse>((config) => {
    const songId = config.params?.songId;
    const overview = overviews[songId];
    if (overview) {
      return [200, { overview }];
    }
    return [404];
  });

  // getLyrics
  mock.onGet("/lyrics").reply<GetLyricsResponse>(async (config) => {
    const { lyricsProvider, lyricsId } = config.params ?? {};
    if (lyricsProvider === "LRCLib" && lyricsId) {
      const data = await fetch(`https://lrclib.net/api/get/${lyricsId}`).then(
        (res) => res.json()
      );
      const result = processLyrics(data.plainLyrics, data.syncedLyrics);
      return [200, { lyrics: result }];
    }
    return [404];
  });
};

export default successHandlers;
