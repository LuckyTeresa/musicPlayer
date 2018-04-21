import Vue from 'vue'
import Router from 'vue-router'

import rank from 'components/rank/rank'
import recommend from 'components/recommend/recommend'
import singer from 'components/singer/singer'
import search from 'components/search/search'
import singerdetail from 'components/singer-detail/singer-detail'
import disc from 'components/disc/disc'
import toplist from 'components/top-list/toplist'
import usercenter from 'components/usercenter/usercenter'

Vue.use(Router);

/*const Recommend = (resolve) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}*/

export default new Router({
    mode:'history',
    routes:[
    {path:'/',redirect:'/recommend'},
    {path:'/recommend',component:recommend,children:[{path:':id',component:disc}]},
    {path:'/rank',component:rank,children:[{path:':id',component:toplist}]},
    {path:'/singer',component:singer,children:[{path:':id',component:singerdetail}]},
    {path:'/search',component:search,children:[{path:':id',component:singerdetail}]},
    {path:'/user',component:usercenter}
    ],
})

