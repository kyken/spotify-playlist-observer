export const spotifyConfig = {
    clientId: process.env.clientId || "",
    clientSecret: process.env.clientSecret || "",
    userId: process.env.userId || "",
    playlistId: process.env.playlistId || "",
    }

export const discordConfig = {
    webhookId: process.env.webhookId || "",
    webhookToken: process.env.webhookToken || "",
    message: {
        botName: process.env.botName || "お知らせBOT",
        title: process.env.title || "${playlistName}に新曲が追加されました",
    }
}
