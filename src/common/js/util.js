function getRandomInt(min,max){
    return Math.floor(Math.random()*(max-min+1)+min)
}

export function shuffle(arr){
    let _arr=arr.slice()
for(let i=0;i<_arr.length;i++){
    let j=getRandomInt(0,i)
    let t=_arr[i]
    _arr[i]=_arr[j]
    _arr[j]=t
}
return _arr
}

// func再一次被调用时如果前一次的定时器还没有完,那么就会清空前一次的定时器,在重新开一个定时器,时间到了之后才会执行func,也就是短时间内如果func被多次调用,那么func实际上只会执行一次
export function debounce(func,delay){
    let timer
    return function(...args){
        if(timer){
            clearTimeout(timer)
        }
        timer=setTimeout(()=>{
            func.apply(this,args)
        },delay)
    }
}