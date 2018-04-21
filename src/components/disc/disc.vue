<template>
  <transition name="slide">
    <musiclist :title='title' :bg-image='bgImage' :songs='songs'></musiclist>
  </transition>
</template>

<script type="text/ecmascript-6">
  import musiclist from 'components/musiclist/musiclist'
  import {mapGetters} from 'vuex'
  import {getDisc} from 'api/disc'
  import {ERR_OK} from 'api/config'
  import {createDescSong} from 'common/js/song'

  export default {
    'name':'disc',
    components:{musiclist},
    data(){
      return{
        songs:[],
      }
    },
    computed:{
      ...mapGetters(['disc']),
      title(){
        return this.disc.dissname
      },
      bgImage(){
        return this.disc.imgurl
      }
    },
    created(){
      this._getDiscDetail()
    },
    methods:{
      _getDiscDetail(){
        if(!this.disc.dissid){
          this.$router.push('/recommend')
          return
        }
        getDisc(this.disc.dissid).then((res)=>{
          if(res.code==ERR_OK){
            this.songs=this._normalizeSongs(res.cdlist[0].songlist)


          }
        })
      },
      _normalizeSongs(list){
        let ret=[]
        list.forEach((musicData)=>{
          if(musicData.id&&musicData.album.id){

            ret.push(createDescSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>