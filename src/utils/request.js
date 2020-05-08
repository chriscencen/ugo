export default function(config) {
    const {baseURL} = config;
    // 这才是真正的插件
    return function(Vue) {
        // 全局上添加http,发送请求
        Vue.prototype.http = async function(params) {
            // console.log(params)
            const { url, method, data} = params
            // 显示加载提示
            uni.showLoading({title:'加载中...',mask: true});
            const res = await uni.request({
                url: baseURL + url,
                method,
                data
            })
            // 请求成功后关闭加载提示
            uni.hideLoading()
            // console.log(res)
            return res[1].data
        }
    }
}
