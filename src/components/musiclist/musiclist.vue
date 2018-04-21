<template>
  <div class="music-list">
    <div class="back" @click='back'>
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html='title'></h1>
    <div class="bg-image" :style='bgStyle' ref='bgImage'>
    <div class="play-wrapper">
      <div class="play" v-show='songs.length' ref='playBtn'>
        <div  @click='random'>
        <i class='icon-play'></i>
          <span class='text'>随机播放全部歌曲</span>
        </div>
      </div>
    </div>
    <!-- 图像上的蒙层 -->
      <div class="filter" ref='filter' ></div>
    </div>
    <!-- 下面的列表滚动时有一个跟随的效果 -->
    <div class="bg-layer" ref='layer'></div>
     <scroll :data='songs' :probe-type='probeType' :listen-scroll='listenScroll' @scroll='scroll' class='list' ref='list'>
    <div class="song-list-wrapper">
      <songlist @select='selectItem' :rank='rank' :songs='songs'></songlist>
    </div>
    <div v-show="!songs.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
  </div>

</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import songlist from 'base/songlist/songlist'
import {prefixStyle} from 'common/js/dom'
import loading from 'base/loading/loading'
import {mapActions} from 'vuex'
import {playListMixin} from 'common/js/mixin'

const RESERVE_HEIGHT=40
const transform=prefixStyle('transform')
const backdrop=prefixStyle('backdrop-filter')
export default {
  'name':'musiclist',
  components:{Scroll,songlist,loading},
  mixins:[playListMixin],
  data(){
    return {
      scrollY:0,
    }
  },
  props:{
    bgImage:{type:String,default:''},
    songs:{type:Array,default:function(){ return [] }},
    title:{type:String,default:''},
    rank:{type:Boolean,default:false}
  },
  computed:{
    bgStyle(){
      return `background-image:url(${this.bgImage})`
    }
  },
  created(){
    this.probeType=3
    this.listenScroll=true



  },
  mounted(){
    this.imageHeight=this.$refs.bgImage.clientHeight
    this.minTranslateY=-this.imageHeight+RESERVE_HEIGHT
    this.$refs.list.$el.style.top=`${this.imageHeight}px`//list是一个vue中的component对象,如果要拿到其dom对象,就要使用$el
    // 这个滚动组件在不同浏览器中距离顶部的高度是不一样的
  },
  watch:{
    scrollY(newY){
      // console.log(newY);
      // 相对于原始位置向上滚动,newY为负,向下newY为正
      let translateY=Math.max(this.minTranslateY,newY)//bg-layer滚动到标题的下面就停止
      let zIndex=0
      let scale=1
      let blur=0
      this.$refs.layer.style[transform]=`translate3d(0,${translateY}px,0)`
      const percent=Math.abs(newY/this.imageHeight)
      if(newY>0){//向下拉时图片放大
        scale=1+percent
        zIndex=10
      }else{
        blur=Math.min(20*percent,20);//向上划时图片模糊效果
      }
      this.$refs.filter.style['backdrop-filter']=`blur(${blur}px)`;//IOS上的高斯模糊效果
      if(newY<this.minTranslateY){//当滚动的高度绝对值比minTranslateY要大时,设置图片的层级和背景图片的高度,以及播放按钮的显隐
        zIndex=10
        this.$refs.bgImage.style.paddingTop=0;
        this.$refs.bgImage.style.height=`${RESERVE_HEIGHT}px`;
        this.$refs.playBtn.style.display='none'
      }else{
        this.$refs.bgImage.style.paddingTop='70%';
        this.$refs.bgImage.style.height=0;
        this.$refs.playBtn.style.display=''
      }
      this.$refs.bgImage.style.zIndex=zIndex;
      this.$refs.bgImage.style[transform]=`scale(${scale})`;
    }
  },
  methods:{
    scroll(pos){
      this.scrollY=pos.y
    },
    back(){
      this.$router.back();
    },
    random(){//通过actions操作
      this.randomPlay({list:this.songs})
    },
    selectItem(item,index){//item为点击的哪一首歌,list为传递过去的歌列表,songlist组件的义务是将所获取到的参数都传递出来
      this.selectPlay({list:this.songs,index:index})
    },
    handlePlayList(playlist){//在组件中实现mixin中定义的方法
      const bottom=playlist.length>0?'60px':''
      this.$refs.list.$el.style.bottom=bottom//获取一个组件的DOM元素要使用$el来获取
      this.$refs.list.refresh()
    },
    ...mapActions(['selectPlay','randomPlay'])
  }
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%//达到宽高比10:7的效果
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0//在代码中根据图片高度做了更改
      bottom: 0
      width: 100%
      background: $color-background

      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>