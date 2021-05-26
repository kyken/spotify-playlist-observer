import Discord from "discord.js"
import { discordConfig } from "../config"
export {EmbedField, EmbedFieldData, User} from "discord.js"


export const DiscordWebhookClient = () => {
    if(!discordConfig.webhookId || !discordConfig.webhookToken) {
        throw Error("[ERROR] please set discord config")
    }
    return new Discord.WebhookClient(discordConfig.webhookId, discordConfig.webhookToken)
}