<template>
  <div class="progress-bar" ref="progressBar"  @click='progressClick'>
    <div class="bar-inner">
      <div class="progress" ref="progress" ></div>
      <!-- 添加prevent修饰符,阻止浏览器被拖动 -->
      <div class="progress-btn-wrapper" ref="progressBtn"  @touchstart.prevent='progressTouchStart' @touchmove.prevent='progressTouchMove' @touchend='progressTouchEnd'>
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {prefixStyle} from 'common/js/dom'

const transform=prefixStyle('transform')
const progressBtnWidth=16
  export default {
    'name':'progressbar',
    props:{
      percent:{type:Number,default:0}
    },
    created(){
      this.touch={}
    },
    methods:{
      progressTouchStart(e){
        this.touch.initiated=true//已经初始化的标志位
        this.touch.startX=e.touches[0].pageX//手指刚开始点击时的位置
        this.touch.left=this.$refs.progress.clientWidth//开始拖动前btn偏移的距离
      },
      progressTouchMove(e){
        if(!this.touch.initiated){
          return
        }
        const deltaX=e.touches[0].pageX-this.touch.startX//手指移动的偏移值
        // 偏移值位于0和barWidth之间
        const offsetWidth=Math.min(Math.max(0,this.touch.left+deltaX),this.$refs.progressBar.clientWidth-progressBtnWidth)
          this._offset(offsetWidth)

      },
      progressTouchEnd(){
        this._triggerPercent()
        this.touch.initiated=false//一次滑动结束

      },
      _triggerPercent(){
          const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
          const percent=this.$refs.progress.clientWidth/barWidth
          this.$emit('percentChange',percent)

      },
      _offset(offsetWidth){
          this.$refs.progress.style.width=`${offsetWidth}px`
          this.$refs.progressBtn.style[transform]=`translate3d(${offsetWidth}px,0,0)`
      },
      progressClick(e){
        // 进度条相对于进度条的最左边缘的距离
        const offsetWidth=e.pageX-this.$refs.progressBar.getBoundingClientRect().left
        this._offset(offsetWidth)
        this._triggerPercent()
      }
    },
    watch:{
      percent(newPercent){
        if(newPercent>=0 && !this.touch.initiated){//不是在拖动过程中
          const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
          const offsetWidth=newPercent*barWidth
          this._offset(offsetWidth)
        }
      }
    }

}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>