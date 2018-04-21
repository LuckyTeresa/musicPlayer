import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song{
    constructor ({id,mid,singer,name,album,duration,image,url}){
        this.id=id;
        this.mid=mid;
        this.singer=singer;
        this.name=name;
        this.album=album;
        this.duration=duration;
        this.image=image;
        this.url=url

    }
    getLyric(){
        // 如果已经获取到歌词,那么就不要在重复获取了
        if(this.lyric){
            return Promise.resolve(this.lyric)
        }
        // 如果没有歌词,需要返回一个Promise对象
        return new Promise((resolve,reject)=>{
            getLyric(this.mid).then((res)=>{
            if(res.retcode ==ERR_OK){
                this.lyric=Base64.decode(res.lyric)
                resolve(this.lyric)
            }else{
                reject('no lyric')
            }
            })
        })

    }
}

export function createSong(musicData){//返回一个工厂方法,只需要传入一个参数就可以创建一首歌
    return new Song({
        id:musicData.songid,
        mid:musicData.songmid,
        singer:filterSinger(musicData.singer),//singer可能有多个人,用/分开
        name:musicData.songname,
        album:musicData.album,
        duration:musicData.interval,
        image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        // url:`https://thirdparty.gtimg.com/${musicData.songid}.m4a?fromtag=38`
        url:`http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`
    })
}

export function createDescSong(musicData){
    return new Song({
        id:musicData.id,
        mid:musicData.mid,
        singer:filterSinger(musicData.singer),
        name:musicData.name,
        album:musicData.album,
        duration:musicData.interval,
        image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`,
        // url:`https://thirdparty.gtimg.com/${musicData.songid}.m4a?fromtag=38`
        // url:`http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`
        url:musicData.url

    })
}


export function filterSinger(singer){
    let ret=[]
    if (!singer){
        return ''
    }
    singer.forEach((s)=>{
        ret.push(s.name)
    })
    return ret.join('/')//用/将数组中每一项连起来
}

