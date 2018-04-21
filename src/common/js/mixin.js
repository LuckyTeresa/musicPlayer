import {mapGetters,mapMutations,mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

// mixin作为一个可复用的组件,当有歌曲在播放时,后台就会设置playlist为当前那一个列表,这时在页面下方就会出现一个迷你播放器,在各个组件的页面中如果不考虑底部播放器的高度就会导致滚动不到底的现象.因此在各个组件中实现handlePlaylist方法,通过判断当前列表长度是否大于0来确定底部是否有迷你播放器,从而设置底部高度

export const playListMixin={
    computed:{
        ...mapGetters(['playList'])
    },
    mounted(){
        this.handlePlayList(this.playList)
    },
    activated(){//当keep-alive切换的时候会触发activated钩子
        this.handlePlayList(this.playList)
    },
    watch:{
        playList(newVal){
        this.handlePlayList(newVal)
        }
    },
    methods:{
        handlePlayList(){//在组件中需要实现handlePlayList,这样组件中的handlePlayList就会覆盖这个handlePlayList,否则就会报错
            throw new Error('components must implement handlePlayList method')
        }
    }
}


export const playerMixin={
    computed:{
         ...mapGetters(['sequenceList','currentSong','playList','mode','favoriteList']),
        iconMode(){
        return this.mode === playMode.sequence ?'icon-sequence' : this.mode === playMode.loop? 'icon-loop':'icon-random'
        }
    },
    methods:{
        ...mapMutations({
            setPlayingState:'SET_PLAYING_STATE',
            setCurrentIndex:'SET_CURRENT_INDEX',
            setPlayMode:'SET_PLAY_MODE',
            setPlayList:'SET_PLAYLIST'
        }),
        ...mapActions(['deleteFavoriteList','saveFavoriteList']),
        changeMode(){
            const mode=(this.mode+1) % 3
            this.setPlayMode(mode)
            let list=null
            if(mode==playMode.random){
                list=shuffle(this.sequenceList)
            }else{
                list=this.sequenceList
            }
            this.resetCurrentIndex(list)//让当前播放的歌曲保持不变
            this.setPlayList(list)//修改playlist为当前模式下计算出的list
        },
        resetCurrentIndex(list){
            let index=list.findIndex((item)=>{
                return item.id===this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        getFavoriteIcon(song){
            if(this.isFavorite(song)){
                return 'icon-favorite'
            }
            return 'icon-not-favorite'
        },
        toggleFavorite(song){
            if(this.isFavorite(song)){
                this.deleteFavoriteList(song)
            }else{
                this.saveFavoriteList(song)
            }
        },
        isFavorite(song){
            const index=this.favoriteList.findIndex((item)=>{
                return item.id==song.id
            })
            return index>-1
        }
    }
}

export const searchMixin={
    data(){
        return{
            query:'',
            refreshDelay:100
        }
    },
    computed:{
        ...mapGetters(['searchHistory']),
    },
    methods:{
        ...mapActions(['saveSearchHistory','deleteSearchHistory']),
        blurInput(){
          this.$refs.searchBox.blur()
        },
        saveSearch(){
          this.saveSearchHistory(this.query)
        },
        onQueryChange(query){
            this.query=query
        },
        addQuery(query){
            this.$refs.searchbox.setQuery(query)
        },
    }
}