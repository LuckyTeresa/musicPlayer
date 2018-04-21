// 一些异步操作  和 对mutation的封装

import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch,deleteSearch,clearSearch,savePlay,saveFavorite,deleteFavorite} from 'common/js/cache'

function findIndex(list,song){
    return list.findIndex((item)=>{
        return item.id==song.id
    })
}

export const selectPlay=function({commit,state},{list,index}){
    commit(types.SET_SEQUENCE_LIST,list)
    if(state.mode==playMode.random){
        let randomList=shuffle(list)
        commit(types.SET_PLAYLIST,randomList)
        index=findIndex(randomList,list[index])
    }else{
        commit(types.SET_PLAYLIST,list)
    }
    commit(types.SET_CURRENT_INDEX,index)
    commit(types.SET_FULLSCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}

export const randomPlay=function({commit},{list}){
    commit(types.SET_PLAY_MODE,playMode.random)
    commit(types.SET_SEQUENCE_LIST,list)
    let randomList=shuffle(list)
    commit(types.SET_PLAYLIST,randomList)
    commit(types.SET_CURRENT_INDEX,0)
    commit(types.SET_FULLSCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}


export const insertSong=function({commit,state},song){
    // 在mutations之外的地方对state进行修改,此处应对其副本进行操作,将state.currentIndex的值赋给currentIndex,这里是对currentIndex进行修改,所以currentIndex不受影响
    let playList=state.playList.slice()
    let sequenceList=state.sequenceList.slice()
    let currentIndex=state.currentIndex
    let currentSong=playList[currentIndex]
    // 查找当前列表中是否 有这首歌
    let fpIndex=findIndex(playList,song)
    // 点击搜索到的歌曲中的一首,在当前播放的歌曲后面插入这首歌,并播放,将当前索引+1
    currentIndex++
    playList.splice(currentIndex,0,song)
    // 如果在列表中已经存在那首歌
    if(fpIndex>-1){
        if(currentIndex>fpIndex){
            // 插入的位置在那首歌后面,就删掉之前那一首歌,并且将索引减一
            playList.splice(fpIndex,1)
            currentIndex--
        }else{
            // 插入的位置在那首歌前面. 注意这里因为是插入歌曲之后再删除,所以要将FPIndex+1
            playList.splice(fpIndex+1,1)
        }
    }

// 对应的播放模式中插入这首歌
    let currentSIndex=findIndex(sequenceList,currentSong)+1
    let fsIndex=findIndex(sequenceList,song)
    sequenceList.splice(currentSIndex,0,song)
    if(fsIndex>-1){
        if(currentSIndex>fsIndex){
            sequenceList.splice(fsIndex,1)
        }else{
            sequenceList.splice(fsIndex+1,1)
        }
    }
    commit(types.SET_PLAYLIST,playList)
    commit(types.SET_SEQUENCE_LIST,sequenceList)
    commit(types.SET_CURRENT_INDEX,currentIndex)
    commit(types.SET_FULLSCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}

export const saveSearchHistory=function({commit},query){
commit(types.SET_SEARCH_HISTORY,saveSearch(query))

}

export const deleteSearchHistory=function({commit},query){
    commit(types.SET_SEARCH_HISTORY,deleteSearch(query))
}
export const clearSearchHistory=function({commit}){
    commit(types.SET_SEARCH_HISTORY,clearSearch())
}

export const deleteSong=function({commit,state},song){
    let playList=state.playList.slice()
    let sequenceList=state.sequenceList.slice()
    let currentIndex=state.currentIndex
    let pIndex=findIndex(playList,song)
    playList.splice(pIndex,1)
    let sIndex=findIndex(sequenceList,song)
    sequenceList.splice(sIndex,1)
    // 如果当前放的那首歌的索引比要删除的那首歌在playlist中的索引大,那么就要把当前的currentIndex减1,当前播放的是最后一首歌时同样
    if(currentIndex>pIndex ||currentIndex==playList.length){
        currentIndex--
    }
    commit(types.SET_PLAYLIST,playList)
    commit(types.SET_SEQUENCE_LIST,sequenceList)
    commit(types.SET_CURRENT_INDEX,currentIndex)

    const playingState=playList.length>0
    commit(types.SET_PLAYING_STATE,playingState)
  }

export const deleteSongList=function({commit}){
    commit(types.SET_PLAYLIST,[])
    commit(types.SET_SEQUENCE_LIST,[])
    commit(types.SET_CURRENT_INDEX,-1)
    commit(types.SET_PLAYING_STATE,false)

}

export const savePlayHistory=function({commit},song){
    commit(types.SET_PLAY_HISTORY,savePlay(song))
}

export const saveFavoriteList=function({commit},song){
    commit(types.SET_FAVORITE_LIST,saveFavorite(song))
}

export const deleteFavoriteList=function({commit},song){
    commit(types.SET_FAVORITE_LIST,deleteFavorite(song))

}