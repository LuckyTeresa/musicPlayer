<template>
  <transition name='slide'>
    <musiclist :songs='songs' :title="title" :bg-image='bgImage'></musiclist>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import musiclist from 'components/musiclist/musiclist'


export default {
  'name': 'singerdetail',
  data () {
    return {
        songs:[]
    }
  },
  components:{
    musiclist,
  },

  computed:{
    title(){

        return this.singer.name
    },
    bgImage(){
        return this.singer.avatar
    },
    ...mapGetters([
        'singer'
        ])
  },
  created(){
    this._getDetail()
  },
  methods:{
    _getDetail(){
        if(!this.singer.id){
            this.$router.push('/singer')//在singerdetail页面直接刷新时由于没有获取到歌手id,所以在这种情况下让其返回到singer页面
            return
        }
        getSingerDetail(this.singer.id).then((res)=>{
            if(res.code==ERR_OK){
                this.songs=this._normalizeSongs(res.data.list)
            }
        })
    },
    _normalizeSongs(list){
        let ret=[]
        list.forEach((item)=>{
            let {musicData}=item
            if(musicData.songid && musicData.albummid){
                ret.push(createSong(musicData))
            }
        })
        return ret
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='stylus' rel='stylesheet/stylus'>
@import  "~common/stylus/variable.styl"

.slide-enter-active, .slide-leave-active
    transition:all 0.3s

.slide-enter, .slide-leave-to
    transform:translate3d(100%,0,0)

</style>
