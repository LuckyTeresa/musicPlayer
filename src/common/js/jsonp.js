import originJSONP from 'jsonp'

export default function jsonp(url,data,option){
    // 这个库中的url后面不带参数,需要手动拼接
    // 在请求的字符串后面拼接?符号
    url+=(url.indexOf('?')<0 ? '?':'&')+param(data);
    return new Promise((resolve,reject)=>{
    // 调用原始的JSONP对象,传入的url由之前的url和data拼接好
        originJSONP(url,option,(err,data)=>{
            if(!err){
                resolve(data);
            }else{
                reject(data);
            }
        })
    })

}

// 拼接data
function param(data){
    let url=''
    for(var k in data){
        let value=data[k] !== undefined ?data[k]:'';
        url+=`&${k}=${encodeURIComponent(value)}`
    }
    // 去掉第一个&符号
    return url ? url.substring(1):''
}