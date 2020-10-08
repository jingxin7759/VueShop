import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../src/assets/css/base.css'
import '../src/assets/fonts/iconfont.css'
import axios from 'axios'

import ZkTable from 'vue-table-with-tree-grid'

//导入富文本
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


//远程数据库 https://www.liulongbin.top:8888/api/private/v1/
//本地数据库 http://127.0.0.1:8888/api/private/v1/
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'

//axios拦截
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http=axios

Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.component('tree-table',ZkTable)

Vue.config.productionTip = false


//定义时间
Vue.filter('dateFormat',function(va){
  const dt=new Date(va)
  const y=dt.getFullYear()
  const m=(dt.getMonth()+1+'').padStart(2,'0')
  const d=(dt.getDate()+'').padStart(2,'0')

  const hh=(dt.getHours()+'').padStart(2,'0')
  const mm=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d}  ${hh}: ${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
