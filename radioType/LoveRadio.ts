const axios = require('axios').default;

export default {
    async radioUrl(urlDefault:string, post:string) {
        const res = await axios.get(post)
        let urlReturn = urlDefault + res.data.data.uid
        console.log(urlReturn)
        return urlReturn
    }
}