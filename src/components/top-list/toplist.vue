<template>
  <transition name="slide">
    <musiclist :title='title' :rank='rank' :bg-image='bgImage' :songs='songs'></musiclist>
  </transition>
</template>

<script type="text/ecmascript-6">
  import musiclist from 'components/musiclist/musiclist'
  import {mapGetters} from 'vuex'
  import {ERR_OK} from 'api/config'
  import {getRankDetail} from 'api/rank'
  import {createSong} from 'common/js/song'
  export default {
    components: {musiclist},
    'name':'toplist',
    data() {
      return {

      }
    },
    data(){
      return{
        songs:[],
        rank:true
      }
    },
    computed:{
      ...mapGetters(['topList']),
      title(){
        return this.topList.topTitle
      },
      bgImage(){
        if(this.songs.length){
          return this.songs[0].image
        }
        return ''
      },
    },
    created(){
      this._getRankDetail()
    },
    methods: {
      _getRankDetail(){
        if(!this.topList.id){
          this.$router.push('/rank')
          return
        }
        getRankDetail(this.topList.id).then((res)=>{
          if(res.code==ERR_OK){
            this.songs=this._normalizeSongs(res.songlist)
          }
        })
      },
      _normalizeSongs(list){
        let ret=[]
        list.forEach((item)=>{
          const musicData=item.data
          if(musicData.songid&&musicData.albumid){
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>