import { ICommand } from "wokcommands"
import Discord from "discord.js"
import { AudioPlayerStatus, VoiceConnectionStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice"
import fs from "fs"
import path from "path"
const axios = require('axios').default;
import radioURL from "../radioType/index"
import { ChannelTypes } from "discord.js/typings/enums"
const radioFile = JSON.parse(fs.readFileSync(path.join(__dirname,"radio.json"),"utf-8"))

function radioArrayFunc () {
    const radioArray = new Array
    for (const el in radioFile) {
        let radio = radioFile[el]
        if (!radio.ready) continue
        radioArray.push({
            name : radio.nameRadio,
            value : radio.name
        })
    }
    return radioArray
}


let embed = {
    color : 0x0099ff,
    title : "Сейчас играет | Play now",
    description: '',
    thumbnail : {}
}

let embed2 = {
    color : 0x0099ff,
    title : "Сейчас играет | Play now",
    description: '',
    thumbnail : {}
}

export default {
    category : "Exemple",
    description : "Включить радио",
    slash : true,
    options : [
        {
            name : "voicechannle",
            description : "Войс канал для подключения",
            required : true,
            type : "CHANNEL",
            channel_types : [ChannelTypes.GUILD_VOICE]
        },
        {
            name : "radioname",
            description : "Выбор радио (можно посмотреть через /radiolist)",
            type : "STRING",
            required : true,
            choices : radioArrayFunc()
        }
    ],

    callback : async ({ message, interaction, channel }) => {
        if (interaction) {
            interaction.reply({
                content : "Включил",
                ephemeral : true
            })
            if (interval!) {                
                clearInterval(interval)
            }
            // console.log(interaction.options.getChannel('voicechannle'));
            const radio = interaction.options.getString("radioname")
            const channel = interaction.options.getChannel('voicechannle')
            if(channel?.type !== "GUILD_VOICE") {
                interaction.channel?.send({
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

            interaction.channel?.send({
                embeds : [embed]
            })

            if (radioFile[radio!].nowPlay) {
                var interval = setTimeout(async function tick() {
                    const res = await axios.get(radioFile[radio!].nowPlay)
                    try {
                        if (radioURL.radioCheckUpdate(radioFile[radio!].radioType,res)) throw "Название песни обнавляется"
                        embed2.description = radioURL.radioName(radioFile[radio!].radioType,res)
                        if (embed2.description !== embed.description) {
                            embed2.thumbnail = radioURL.radioPicture(radioFile[radio!].radioType,res,radioFile[radio!].picture)
                            console.log("Поменял");
                            Object.assign(embed,embed2)
                        } else {
                            throw "Ничего не изменилось"
                        }
                        try {
                            const messagesBot = await interaction.channel?.messages.fetch({limit : 10})
                            messagesBot?.map(el => {
                                if (el.author.id == "906518952908324934") {
                                    el.delete()
                                }
                                if (el.author.id == "657128271472754718") {
                                    el.delete()
                                }
                            })
                            console.log(messagesBot);
                            
                            await interaction.channel?.send({
                                embeds : [embed]
                            })  
                        } catch (e) {
                            console.log(e);
                        }
                    } catch (e) {
                        console.log(e)
                    }
                    interval = setTimeout(tick,10000)
                },10000)
            }

            // player.on(AudioPlayerStatus.Idle, ()=>{
            //     clearTimeout(interval)
            //     interaction.channel?.lastMessage?.delete()
            //     connection.destroy()
            // })

            // player.on("error",(error) => {
            //     console.log(`Бот остановился, потому что ${error}`);
            //     connection.destroy()
            //     interaction.channel?.lastMessage?.delete()
            //     clearTimeout(interval)
            // })
            
            // connection.on(VoiceConnectionStatus.Disconnected,(e)=>{
            //     console.log(e.status)
            //     interaction.channel?.lastMessage?.delete()
            //     clearInterval(interval)
            //     connection.destroy()
            // })
        }
    }
} as ICommand

