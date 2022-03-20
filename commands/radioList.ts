import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
import fs from "fs"
import path from "path"

const radioFile = JSON.parse(fs.readFileSync(path.join(__dirname,"radio.json"),"utf-8"))
const radioArray = new Array

for (const el in radioFile) {
    radioArray.push(radioFile[el])
}

const embed = {
    color : 0x0099ff,
    title : "Список радио",
    description : "Список радио",
    fields : new Array
}
radioArray.forEach(el => {
    embed.fields.push({
        name : el.name,
        value : el.description
    })
});


export default {
    category : "Testing",
    description : "Что то",
    slash : true,

    callback : async ({ interaction , text}) => {
        const embedMessage = new MessageEmbed(embed)

        if (interaction) {
            await interaction.reply({
                embeds : [embedMessage],
                ephemeral : true
            })
        }
    }
} as ICommand