import * as uuid from "uuid";
import {
  DiscordWebhookClient,
  EmbedFieldData,
  sleep,
  SpotifyApiClient,
} from "./lib";

import { discordConfig, spotifyConfig } from "./config";
import jsonData, { TrackModel } from "./data";
import fs from "fs";

let isShuttingDown = false;
let isProcessing = false;
const PROCESS_ID = uuid.v4();
console.log(`[${PROCESS_ID}] Batch Process ID is ${PROCESS_ID}`);
const MODE = process.env.MODE || "NO-INIT"

const main = async () => {
  const spotifyApiClient = SpotifyApiClient();
  const discordWebhookClient = DiscordWebhookClient();
  const credentialData = await spotifyApiClient.clientCredentialsGrant();
  spotifyApiClient.setAccessToken(credentialData.body["access_token"]);

  while (!isShuttingDown) {
    isProcessing = true;
    try {
      let offset = 0;
      const playlist = await spotifyApiClient.getPlaylist(
        spotifyConfig.playlistId
      );
      let playlistData = await spotifyApiClient.getPlaylistTracks(
        spotifyConfig.playlistId,
        { limit: 100, offset: 100 * offset }
      );
      let fullTrackData = [];
      let trackDataList: TrackModel[] = [];
      const beforeTracks = jsonData;
      while (true && playlistData.body.items) {
        const users = Array.from(
          new Set(playlistData.body.items.map((item) => item.added_by.id))
        );
        let userMap: { [key: string]: any } = {};
        for (const userId of users) {
          userMap[userId] = (await spotifyApiClient.getUser(userId)).body;
        }
        for (const track of playlistData.body.items) {
          const trackData: TrackModel = {
            id: track.track.id,
            name: track.track.name,
            external_url: track.track.external_urls.spotify,
            add_info: {
              added_at: track.added_at,
              add_user_id: track.added_by.id,
              add_user_name: userMap[track.added_by.id].display_name || "--",
              add_user_external_url:
                userMap[track.added_by.id].external_urls.spotify || "--",
            },
            artists: track.track.artists.map((artist) => artist.name),
          };

          trackDataList.push(trackData);
          fullTrackData.push(track);
        }
        if (playlistData.body.items.length !== 100) {
          break;
        }
        offset = offset + 1;
        playlistData = await spotifyApiClient.getPlaylistTracks(
          spotifyConfig.playlistId,
          { limit: 100, offset: 100 * offset }
        );
      }
      const newTracks = trackDataList.filter(
        (newTrack) =>
          !beforeTracks.map((oldTrack) => oldTrack.id).includes(newTrack.id)
      );
      if (newTracks.length !== 0 && MODE !== "INIT") {
        const field: EmbedFieldData[] = newTracks
          .map((track) => {
            return [
              {
                name: "投稿者",
                value: `[${track.add_info.add_user_name}](${track.add_info.add_user_external_url})`,
              },
              {
                name: "曲名",
                value: `[${track.name}](${track.external_url})`,
                inline: true,
              },
              {
                name: "アーティスト",
                value: track.artists,
                inline: true,
              },
            ];
          })
          .flat();

        const embed = {
          color: 0x0099ff,
          title: discordConfig.message.title.replace("{playlistName}", playlist.body.name),
          url: playlist.body.external_urls.spotify,
          fields: field,
        };
        await discordWebhookClient.send("", {
          username: discordConfig.message.botName,
          embeds: [embed],
        });
        fs.writeFileSync(
          "./data/data.json",
          JSON.stringify(trackDataList, null, 2)
        );
      }
      fs.writeFileSync(
        "./data/fullData.json",
        JSON.stringify(fullTrackData, null, 2)
      );
    } catch (error) {
      console.log(`[${PROCESS_ID}] ${error.name}`);
      console.log(JSON.stringify(error));
    } finally {
      isProcessing = false;
      await sleep(30000);
    }
  }
};

const shutdownGracefully = async () => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`[${PROCESS_ID}] Shutting down...`);

  while (isProcessing) {
    await sleep(10);
  }

  process.exit(0);
};

process.on("SIGINT", shutdownGracefully);
process.on("SIGTERM", shutdownGracefully);

main();
