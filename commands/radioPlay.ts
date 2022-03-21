import { ICommand } from "wokcommands"
import Discord from "discord.js"
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice"
import fs from "fs"
import path from "path"
const axios = require('axios').default;

const radioFile = JSON.parse(fs.readFileSync(path.join(__dirname,"radio.json"),"utf-8"))
const radioArray = new Array

for (const el in radioFile) {
    let radio = radioFile[el]
    radioArray.push({
        name : radio.nameRadio,
        value : radio.name
    })
}

const embed = {
    color : 0x0099ff,
    title : "Сейчас играет | Play now",
    description: '',
}

export default {
    category : "Exemple",
    description : "Включит радио",
    aliases : ['rp'],
    slash : true,
    // testOnly : true,
    options : [
        {
            name : "voicechannle",
            description : "Войс канал для подключения",
            required : true,
            type : "CHANNEL", 
        },
        {
            name : "radioname",
            description : "Выбор радио (можно посмотреть через /radiolist)",
            type : "STRING",
            required : true,
            choices : radioArray
        }
    ],


    callback : async ({ interaction, member, channel }) => {
        if (interaction) {
            await interaction.deferReply({
                // ephemeral : true
                
            })
            // console.log(interaction.options.getChannel('voicechannle'));
            const radio = interaction.options.getString("radioname")
            const channel = interaction.options.getChannel('voicechannle')
            if(channel?.type !== "GUILD_VOICE") {
                interaction.editReply({
                    content : `Выбери голосовой канал`
                })
                return
            }
            
            const voiceChannel = interaction.options.getChannel('voicechannle')?.id
            // console.log(radioFile[radio!]);
            
            if (!voiceChannel) return
            const connection = joinVoiceChannel({
                channelId: voiceChannel,
                guildId: interaction.guild!.id,
                adapterCreator: interaction.guild!.voiceAdapterCreator
            })

            const player = createAudioPlayer()
            connection?.subscribe(player)
            const recource = createAudioResource(radioFile[radio!].url)
            player.play(recource)

            embed.description = `Ты включил ${radioFile[radio!].nameRadio}`

            interaction.editReply({
                embeds : [embed]
            })

            if (radioFile[radio!].nowPlay) {
                var interval = setInterval(()=>{
                    axios.get(radioFile[radio!].nowPlay)
                        .then((res: any) => {
                            if (res.data.data.song.title) {
                                embed.description = `Сейчас играет : ${res.data.data.song.title}`
                                interaction.editReply({
                                    embeds : [embed]
                                })
                                console.log(res.data.data.song.title)
                            }
                        })
                },5000)
            }

            player.on(AudioPlayerStatus.Idle, ()=>{
                clearInterval(interval)
            })

            player.on("error",(error) => {
                console.log(`Бот остановился, потому что ${error}`);
                connection.destroy()
            })
            

            
        }
    }
} as ICommand

