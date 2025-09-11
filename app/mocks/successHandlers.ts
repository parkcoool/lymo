import type MockAdapter from "axios-mock-adapter";

import type { GetPopularSongsResponse } from "~/apis/getPopularSongs";

const successHandlers = (mock: MockAdapter) => {
  // getPopularSongs
  mock
    .onGet("/song/popular")
    .withDelayInMs(Math.random() * 2000)
    .reply<GetPopularSongsResponse>(200, {
      songs: [
        {
          id: "1",
          title: "Hey Jude",
          coverUrl: "https://placehold.co/200",
        },
        {
          id: "2",
          title: "Let It Be",
          coverUrl: "https://placehold.co/200",
        },
        {
          id: "3",
          title: "Yesterday",
          coverUrl: "https://placehold.co/200",
        },
        {
          id: "4",
          title: "The Scientist",
          coverUrl: "https://placehold.co/200",
        },
      ],
    });
};

export default successHandlers;
