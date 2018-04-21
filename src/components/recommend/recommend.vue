<template>
  <div class="recommend" ref='recommend'>
  <scroll ref='scroll' class="recommend-content" v-bind:data='discList'>
    <div>
    <!-- recommends.length 确保在获取到数据之后在渲染 -->
      <div v-if='recommends.length' class="slider-wrapper">
      <!-- 这里引入了slider组件,被slider标签包裹的内容会插入slider.vue中的slot标签,并替换掉slot标签 -->
      <!-- slider中获取轮播的数据,在slider.vue中执行对应的逻辑操作 -->

         <slider>
           <div v-for="item in recommends">
             <a v-bind:href="item.linkUrl">
             <!-- fastclick会监听img上的点击事件,如果发现该元素有needsclick这个属性,就不会拦截这个点击事件,从而不与scroll中的click:true冲突-->
               <img class='needsclick' v-on:load='loadImage' v-bind:src="item.picUrl">
             </a>
           </div>
         </slider>
      </div>
      <div class="recommend-list">
         <h1 class='list-title'>热门歌单推荐</h1>
         <ul>
           <li v-for="item in discList" @click='selectItem(item)' class='item'>
             <div class='icon'>
               <img height='60' width='60' v-lazy="item.imgurl" />
             </div>
             <div class='text'>
               <h2 class='name' v-html='item.creator.name'></h2>
               <p class='desc' v-html='item.dissname'></p>
             </div>
           </li>
         </ul>
      </div>
    </div>
    <div class='loading-container' v-show='!discList.length'>
      <loading></loading>
    </div>
  </scroll>
  <router-view></router-view>
  </div>

</template>

<script type="text/ecmascript-6">
import {getRecommend,getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import slider from 'base/slider/slider'
import scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import {playListMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
  export default {
    'name':'recommend',
    data(){
      return {
        recommends:[],
        discList:[]
      }
    },
    mixins:[playListMixin],
    components:{
      slider,scroll,loading
    },
    created(){
      this._getRecommend();
      this._getDiscList();
    },
    methods:{
      _getRecommend(){
        getRecommend().then((res)=>{
          if (res.code===ERR_OK){
            this.recommends=res.data.slider;
          }
        })
      },
      _getDiscList(){
        getDiscList().then((res)=>{
          if(res.code===ERR_OK){
            this.discList=res.data.list;
          }
        })
      },
      loadImage(){
        if(!this.checkLoaded){//在第一张图片在入后重新计算滑动高度
          this.$refs.scroll.refresh()
          this.checkLoaded=true
        }
      },
      selectItem(item){
        this.$router.push({
          path:`/recommend/${item.dissid}`
        })

        this.setDisc(item)

      },
      handlePlayList(playlist){
        const bottom=playlist.length>0?'60px':''
        this.$refs.recommend.style.bottom=bottom
        this.$refs.scroll.refresh()
      },
      ...mapMutations({setDisc:'SET_DISC'})
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>