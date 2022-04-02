import DiscordJS ,{ Intents } from "discord.js"
import WOKCommands from "wokcommands"
import path from "path"
import dotenv from "dotenv"
dotenv.config()

const client = new DiscordJS.Client({
    intents : [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
    ]
})

client.on('ready', async () => {
    
    console.log(`BOT ${client.user?.tag} Has now been launched!! 🚀 Coded by 365 ɢᴀᴍɪɴɢ ɴ ᴍᴏʀᴇ_2.0#0002`)
    const wok = new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        featuresDir : path.join(__dirname, 'features'),
        typeScript : true,
        testServers : ['955012890451144714'],
        botOwners : "307491614358634496"
    })

    // const { slashCommands } = wok
    // const commands = await slashCommands.get()
    // commands.map((i:any)=>{
    //     console.log(i.options[1]);
    // })

})

client.login(process.env.TOKEN)