// 先在state中定义数据,在mutation_types中定义修改相关的操作,然后在mutation中修改数据,在getters中获取数据


// 管理所有状态
import {playMode} from 'common/js/config'
import {loadSearch,loadPlay,loadFavorite} from 'common/js/cache'

const state={
    singer:{},
    playing:false,//是否正在播放
    fullScreen:false,//是否全屏
    playList:[],//播放列表顺序
    sequenceList:[],//不同播放模式下的列表顺序
    mode:playMode.sequence,//播放模式
    currentIndex:-1,//当前索引
    disc:{},
    topList:{},
    searchHistory:loadSearch(),
    playHistory:loadPlay(),
    favoriteList:loadFavorite()

}

export default state