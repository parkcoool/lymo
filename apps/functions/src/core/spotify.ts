import SpotifyWebApi from "spotify-web-api-node";

const spotify = new SpotifyWebApi();

export const initSpotify = async (clientId: string, clientSecret: string) => {
  spotify.setClientId(clientId);
  spotify.setClientSecret(clientSecret);
};

export default spotify;
