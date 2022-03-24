import radioTypeLovaRadio from "./LoveRadio"

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
    }
}