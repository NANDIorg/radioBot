import { ICommand } from "wokcommands"
import Discord from "discord.js"
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice"
import fs from "fs"
import path from "path"
const axios = require('axios').default;
import radioURL from "../radioType/index"
const radioFile = JSON.parse(fs.readFileSync(path.join(__dirname,"radio.json"),"utf-8"))
const radioArray = new Array

for (const el in radioFile) {
    let radio = radioFile[el]
    if (!radio.ready) continue
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
    description : "Тестовая Команда",
    aliases : ['rp'],
    slash : true,
    testOnly : true,
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
            if (interval!) {                
                clearInterval(interval)
            }
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
            var urlRadio = ""
            if (!radioFile[radio!].radioType) {
                urlRadio = radioFile[radio!].url
            } else {
                urlRadio = await radioURL.radioType(radioFile[radio!].radioType,radioFile[radio!].url,radioFile[radio!].nowPlay)
                // var recource = createAudioResource(radioFile[radio!].url)
            }
            var recource = createAudioResource(urlRadio)
            player.play(recource)

            embed.description = `Включена радио станция : ${radioFile[radio!].nameRadio}`

            interaction.editReply({
                embeds : [embed]
            })

            if (radioFile[radio!].nowPlay) {
                var interval = setInterval(()=>{
                    axios.get(radioFile[radio!].nowPlay)
                        .then((res: any) => {
                            if (res.data.data.song.title && res.data.data.song.title != null) {
                                embed.description = `Сейчас играет : ${res.data.data.song.title}`
                                interaction.editReply({
                                    embeds : [embed]
                                })
                                console.log(res.data.data.song.title)
                            }
                        })
                },10000)
            }

            player.on(AudioPlayerStatus.Idle, ()=>{
                clearInterval(interval)
                interaction.deleteReply()
            })

            player.on("error",(error) => {
                console.log(`Бот остановился, потому что ${error}`);
                connection.destroy()
                interaction.deleteReply()
            })
            
            connection.on('stateChange',(e)=>{
                console.log(e.status)
                if (e.status == "ready") {
                    interaction.deleteReply()
                    clearInterval(interval)
                    connection.destroy()
                }
            })
            
        }
    }
} as ICommand

