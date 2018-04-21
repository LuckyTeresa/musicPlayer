import {commonParams} from './config.js'
import axios from 'axios'

export function getDisc(dissid){
    const url='/api/discdetail'
    const data=Object.assign({},commonParams,{
        uin:0,
        format:'json',
        notice:0,
        platform:'h5',
        needNewCode:1,
        new_format:1,
        pic:500,
        disstid:dissid,
        type:1,
        onlysong:0,
        picmid:1,
        song_begin:0,
        song_num:20,
        utf8:1

    })
    return axios.get(url,{
        params:data
    }).then((res)=>{
        return Promise.resolve(res.data)
    })

}