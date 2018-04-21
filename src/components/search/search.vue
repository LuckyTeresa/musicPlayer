<template>
  <div class="search">
    <div class="search-box-wrapper">
      <searchbox ref='searchbox' @query='onQueryChange'></searchbox>
    </div>
    <div ref='shortcutWrapper' class="shortcut-wrapper" v-show='!query'>
      <scroll :refreshDelay='refreshDelay' class="shortcut" ref='shortcut' :data='shortcut'>
      <div>
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
              <li class='item' @click='addQuery(item.k)' v-for='item in hotkey'>
                <span>{{item.k}}</span>
              </li>
          </ul>
        </div>
        <div class="search-history" v-show='searchHistory.length'>
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click='showConfirm'>
              <i class="icon-clear"></i>
            </span>
          </h1>
          <searchlist :searches='searchHistory' @select='addQuery' @delete='deleteSearchHistory'></searchlist>
        </div>
      </div>
      </scroll>
    </div>
      <div ref='searchResult' class="search-result" v-show='query'>
        <suggest ref='suggest' :query='query' @listScroll='blurInput' @select='saveSearch' ></suggest>
      </div>
      <confirm ref='comfirm' text='清空所有搜索历史吗?' confirmBtnText='清空' @confirm='clearSearchHistory'></confirm>
      <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import searchbox from 'base/searchbox/searchbox'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import suggest from 'components/suggest/suggest'
import {mapActions} from 'vuex'
import searchlist from 'base/searchlist/searchlist'
import confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import {playListMixin,searchMixin} from 'common/js/mixin'
  export default {
  'name':'search',
  components:{searchbox,suggest,searchlist,confirm,Scroll},
  mixins:[playListMixin,searchMixin],
  data(){
    return {
      hotkey:[],
    }
  },
  created(){
    this._getHotKey()
  },
  computed:{

    shortcut(){

      return this.hotkey.concat(this.searchHistory)
    }
  },
  methods:{
    ...mapActions(['clearSearchHistory']),
    _getHotKey(){
      getHotKey().then((res)=>{
        if(res.code==ERR_OK){
          this.hotkey=res.data.hotkey.splice(0,10)
        }
      })
    },

    showConfirm(){
      this.$refs.comfirm.show()
    },
    handlePlayList(playlist){
      const bottom=playlist.length>0?'60px':''
      this.$refs.shortcutWrapper.style.bottom=bottom
      this.$refs.shortcut.refresh()
      this.$refs.searchResult.style.bottom=bottom
      this.$refs.suggest.refresh()
    }

  },
  watch:{
    query(newQuery){
      if(!newQuery){
        setTimeout(()=>{
          this.$refs.shortcut.refresh()
        },20)
      }
    }

  }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>