import DiscordJS, { Intents } from "discord.js"
import WOKCommands from "wokcommands"
import path from "path"
import dotenv from "dotenv"
dotenv.config()

const client = new DiscordJS.Client({
    intents : [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
})

client.on('ready', async () => {
    console.log(`BOT ${client.user?.tag} Has now been launched!! 🚀 Coded by 365 ɢᴀᴍɪɴɢ ɴ ᴍᴏʀᴇ_2.0#0002`)
    new WOKCommands(client, {
        commandDir: path.join(__dirname, 'commands'),
        typeScript : true,
        testServers : ['955012890451144714']
    })
    
})

client.login(process.env.TOKEN)