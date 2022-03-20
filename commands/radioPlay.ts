import { ICommand } from "wokcommands"
import Discord from "discord.js"
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice"
import fs from "fs"
import path from "path"
const radioFile = JSON.parse(fs.readFileSync(path.join(__dirname,"radio.json"),"utf-8"))
const radioArray = new Array

for (const el in radioFile) {
    let radio = radioFile[el]
    radioArray.push({
        name : radio.nameRadio,
        value : radio.name
    })
}

export default {
    category : "Exemple",
    description : "Включить радио",
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
            await interaction.deferReply({
                ephemeral : true
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
        
            player.on(AudioPlayerStatus.Idle, ()=>{
                connection?.destroy()
            })
            
            interaction.editReply({
                content : `Ты включил ${radioFile[radio!].nameRadio}`
            })
            
        }
    }
} as ICommand