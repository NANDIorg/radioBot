import radioTypeLovaRadio from "./LoveRadio"
import radioTypeRadioRemix from "./RadioRemix"

export default {
    async radioType (type:string, url:string, nowUrl:string) {
        var urlRadio = ""
        switch (type) {
            case "LoveRadio":
                urlRadio = await radioTypeLovaRadio.radioUrl(url, nowUrl)
                break
        }
        return urlRadio
    },
    radioPicture (type:string,nowUrl:string,urlPicture:string) {
        var urlRadio = {
            url : ""
        }
        switch (type) {
            case "LoveRadio":
                urlRadio.url = radioTypeLovaRadio.radioPicture(nowUrl,urlPicture)
                break
        }
        return urlRadio 
    },
    radioName (type: string,nowUrl:string) {
        var title = ""
        switch (type) {
            case "LoveRadio":
                title = radioTypeLovaRadio.radioTitle(nowUrl)
                break
            case "RemixRadio":
                title = radioTypeRadioRemix.radioTitle(nowUrl)
                break
        }
        return title 
    }
}