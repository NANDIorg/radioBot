const axios = require('axios').default;

export default {
    async radioUrl(urlDefault:string, post:string) {
        const res = await axios.get(post)
        let urlReturn = urlDefault + res.data.data.uid
        console.log(urlReturn)
        return urlReturn
    },

    radioPicture (post:any,urlPicture:string) {
        let url = ""
        const res = post
        try{
            if (res.data.data.song.song == null) throw "Нет параметрова песни"
            url = urlPicture + res.data.data.song.song.picture.bigPath
        } catch (e) {
            console.log("------Ошибка в получении картинки------")
            console.log(e)
            url = "https://www.loveradio.ru/backend/uploads/media/loveradio/0019/28/08b9505066130cef1b393ff9aa6fa6fbc24f274c.png"
        }
        return url
    },

    radioTitle (post:any) {
        var title = `Сейчас играет : ${post.data.data.song.title}`
        return title
    },

    radioCheckUpdate(nowPlay:any) {
        if (nowPlay.data.data.song == null) return true
        return false   
    }
}