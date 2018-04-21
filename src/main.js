// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import fastclick from 'fastclick'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import 'common/stylus/index.styl'
import store from './store'


fastclick.attach(document.body);//将fastclick与document.body联系起来,这样整个body下按钮的点击就不会产生300ms的延时
Vue.use(VueLazyLoad,{
    loading:require('common/image/default.png')
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
