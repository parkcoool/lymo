import type MockAdapter from "axios-mock-adapter";

import type { GetLyricalSongsResponse } from "~/apis/getLyricalSongs";
import type { GetPopularSongsResponse } from "~/apis/getPopularSongs";
import type { GetSongResponse } from "~/apis/getSong";
import type { GetSongOverviewResponse } from "~/apis/getSongOverview";
import lyricsPreviews from "~/mocks/lyricsPreviews";
import overviews from "~/mocks/overviews";
import songs from "~/mocks/songs";

const successHandlers = (mock: MockAdapter) => {
  // getPopularSongs
  mock
    .onGet("/song/popular")
    .withDelayInMs(Math.random() * 2000)
    .reply<GetPopularSongsResponse>(200, {
      songs: songs.map((song) => ({
        id: song.id,
        title: song.title,
        coverUrl: song.coverUrl,
      })),
    });

  // getLyricalSongs
  mock
    .onGet("/song/lyrical")
    .withDelayInMs(Math.random() * 2000)
    .reply<GetLyricalSongsResponse>(200, {
      songs: songs.map((song) => ({
        id: song.id,
        title: song.title,
        artist: song.artist,
        coverUrl: song.coverUrl,
        lyricsPreview: lyricsPreviews[song.id] ?? "",
      })),
    });

  // getSong
  mock
    .onGet("/song")
    .withDelayInMs(Math.random() * 2000 + 2000)
    .reply<GetSongResponse>((config) => {
      const songId = config.params?.songId;
      const song = songs.find((s) => s.id === songId);
      if (song) {
        return [200, { song }];
      }
      return [404];
    });

  // getSongOverview
  mock
    .onGet("/song/overview")
    .withDelayInMs(Math.random() * 2000 + 4000)
    .reply<GetSongOverviewResponse>((config) => {
      const songId = config.params?.songId;
      const overview = overviews[songId];
      if (overview) {
        return [200, { overview }];
      }
      return [404];
    });
};

export default successHandlers;
