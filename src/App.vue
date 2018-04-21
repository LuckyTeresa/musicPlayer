<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>


<script>
import MHeader from'components/m-header/m-header'
import tab from 'components/tab/tab'
import player from 'components/player/player'

export default {
  name: 'App',
  components:{
    MHeader,tab,player
  }
}
</script>


<style scoped lang='stylus' rel='stylesheet/stylus'>
@import "./common/stylus/variable"


#app
  color:$color-theme

</style>
