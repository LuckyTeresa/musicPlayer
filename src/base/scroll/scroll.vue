<template>
  <div ref="wrapper">
  <!-- 抽象scroll组件,支持插入任何DOM -->
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {

  props:{
    probeType:{
        type:Number,
        default:1
    },
    click:{
        type:Boolean,
        default:true,//阻止浏览器的原生click事件,但是派发了一个scroll组件的click事件
    },
    data:{
        typr:Array,
        default:null
    },
    listenScroll:{
      type:Boolean,
      default:false
    },
    pullup:{
      type:Boolean,
      default:false
    },
    beforeScorll:{
      type:Boolean,
      default:false
    },
    refreshDelay:{
      type:Number,
      default:20
    }
  },
  mounted(){
    setTimeout(()=>{
        this._initScroll();
    },50);
  },
  methods:{
    _initScroll(){
        if(!this.$refs.wrapper){
            return
        }
        this.scroll=new BScroll(this.$refs.wrapper,{
            probeType:this.probeType,
            click:this.click
        })
        if(this.listenScroll){
          let me=this
          this.scroll.on('scroll',(pos)=>{
            me.$emit('scroll',pos)
          })
        }
        if(this.pullup){
          this.scroll.on('scrollEnd',()=>{
            if(this.scroll.y <=(this.scroll.maxScrollY+50)){
              this.$emit('scrollToEnd')
            }
          })
        }
        if(this.beforeScorll){
          this.scroll.on('beforeScrollStart',()=>{
            this.$emit('beforeScorll')
          })
        }
    },
    enable(){
        this.scroll&&this.scroll.enable();
    },
    disable(){
        this.scroll&&this.scroll.disable();
    },
    refresh(){
        this.scroll&&this.scroll.refresh();
    },
    scrollTo(){
      this.scroll&&this.scroll.scrollTo.apply(this.scroll,arguments)
    },
    scrollToElement(){
      this.scroll&&this.scroll.scrollToElement.apply(this.scroll,arguments)
    },

  },
  watch:{//监听data,如果发生变化时scroll组件就自动调用refresh方法
    data(){
        setTimeout(()=>{
            this.refresh()
        },this.refreshDelay)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
