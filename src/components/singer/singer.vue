<template>
    <div class='singer' ref='singer'>
    <listview v-bind:data='singers' ref='list' @select='selectSinger'></listview>
    <!-- 这里的二级路由,通过listview渲染一个列表,通过router-view和组件上的监听事件并传入参数(选择的歌手id)进行跳转-->
    <router-view></router-view>
    </div>
</template>

<script>
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import listview from 'base/listView/listView'
import {mapMutations} from 'vuex'
import {playListMixin} from 'common/js/mixin'

const HOT_NAME='热门'
const HOT_SINGER_LEN=10

export default{
    'name':'singer',
    data() {
        return{
            singers:[]
        }
    },
    components:{listview},
    mixins:[playListMixin],
    created(){
        this._getSingerList();
    },
    methods:{
        selectSinger(singer){
            this.$router.push({
                path:`/singer/${singer.id}`
            })
            this.setSinger(singer)
        },
        _getSingerList(){
            getSingerList().then((res)=>{
                if(res.code===ERR_OK){
                    this.singers=this._normalizeSinger(res.data.list);
                    // console.log(this._normalizeSinger(this.singers));
                }
            })
        },
        _normalizeSinger(list){
        let map={
            hot:{
                title:HOT_NAME,
                items:[]
            }
        }
        list.forEach((item,index)=>{
            // 获取热门歌手数据
            if(index<HOT_SINGER_LEN){
                map.hot.items.push(
                    new Singer({id:item.Fsinger_mid,name:item.Fsinger_name})
                )
            }
            // 获取按照字母序排列的歌手信息
            const key=item.Findex
            if(!map[key]){
                map[key]={
                    title:key,
                    items:[]
                }
            }
            map[key].items.push(
            new Singer({id:item.Fsinger_mid,name:item.Fsinger_name})
                )
        })
        // 将获取到的数组按字母排序,便于显示
        let hot=[];
        let ret=[]
        for (let key in map){
            let val=map[key]
            if(val.title.match(/[a-zA-Z]/)){
                ret.push(val)
            }else if(val.title==HOT_NAME){
                hot.push(val);
            }
        }
        ret.sort((a,b)=>{
            return a.title.charCodeAt(0)-b.title.charCodeAt(0)
        })
        return hot.concat(ret)
        },
        handlePlayList(playlist){

        const bottom=playlist.length>0?'60px':''
        this.$refs.singer.style.bottom=bottom
        this.$refs.list.refresh()//调用listview组件的refresh方法,listview也是依赖scroll组件实现的
        },
        ...mapMutations({
            setSinger:'SET_SINGER'
        })
    }


}

</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
.singer
    position:fixed
    top:88px
    bottom:0
    width:100%

</style>