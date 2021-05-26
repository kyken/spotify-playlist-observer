import SpotifyWebApi from "spotify-web-api-node";
import { spotifyConfig } from "../config";

export const SpotifyApiClient = (): SpotifyWebApi => {
    if(!spotifyConfig.clientId || !spotifyConfig.clientSecret) {
        throw Error("[ERROR] please set spotify config")
    }
    return new SpotifyWebApi({
        clientId: spotifyConfig.clientId,
        clientSecret: spotifyConfig.clientSecret,
      });
}