import { Client } from "discord.js"
import fs from "fs"
import path from "path"

const radioFile = JSON.parse(fs.readFileSync(path.join(__dirname,"../commands/radio.json"),"utf-8"))
const radioArray = new Array

for (const el in radioFile) {
    let radio = radioFile[el]
    if (!radio.ready) continue
    radioArray.push(radio.nameRadio)
}

export default (client : Client) => {

    let counter = 0
    
    const updateStatus = () => {
        client.user?.setActivity(radioArray[counter], { type: 'LISTENING' });

        if (++counter >= radioArray.length) {
            counter = 0
        }

        setTimeout(updateStatus,1000 * 30)
    }
    updateStatus()
}

// export const config = {
    
// }
