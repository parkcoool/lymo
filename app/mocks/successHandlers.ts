import type MockAdapter from "axios-mock-adapter";

import type { GetLyricalSongsResponse } from "~/apis/getLyricalSongs";
import type { GetPopularSongsResponse } from "~/apis/getPopularSongs";
import lyricsPreviews from "~/mocks/lyricsPreviews";
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
};

export default successHandlers;
