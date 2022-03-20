import { ICommand } from "wokcommands"
import Discord from "discord.js"
import voiceDiscord, { createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice"
import fs from "fs"
import path from "path"
const radioFile = JSON.parse(fs.readFileSync(path.join(__dirname,"radio.json"),"utf-8"))


export default {
    category : "Exemple",
    description : "test",
    slash : true,
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
            required : true,
            type : "STRING", 
        }
    ],

    callback : async ({ interaction, member, channel }) => {
        if (interaction) {
            // console.log(interaction.options.getChannel('voicechannle'));
            const radio = interaction.options.getString("radioname")
            const voiceChannel = interaction.options.getChannel('voicechannle')?.id
            console.log(radio);
            
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
            

            // player.on(voiceDiscord.AudioPlayerStatus.Idle, ()=>{
            //     connection?.destroy()
            // })

            await interaction.deferReply({
                ephemeral : true
            })
            
            interaction.editReply({
                content : `ыыы я тупой`
            })

            // if (voiceChannel) {
            //     interaction.editReply({
            //         content : `${voiceChannel}`
            //     })
            // } else {
            //     interaction.editReply({
            //         content : `ыыы я тупой`
            //     })
            // }
            

            // if (voiceChannel) {
            //     const connection = getVoiceConnection(voiceChannel);
            //     await new Promise((resolve)=>{setTimeout(resolve,5000)})
            //     if (connection) {
            //         connection.destroy()
            //         console.log('Дисконект');
                    
            //     }
            // }
            
        }
    }
} as ICommand