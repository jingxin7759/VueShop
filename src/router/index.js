import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../views/home/home.vue'
import welcome from '../views/welcome/welcome.vue'
import Users from '../views/users/users.vue'
import rights from '../views/power/power.vue'
import roles from '../views/roles/roles.vue'
import categories from '../views/categories/categories.vue'
import params from '../views/params/params.vue'
import goods from '../views/goods/goods.vue'
import addgoods from '../views/goods/addgoods.vue'
import orders from '../views/orders/orders.vue'
import reports from '../views/reports/reports.vue'


Vue.use(VueRouter)

  const routes = [
    {
      path:'/',
      redirect:'/Login'
    },
    //登录
    {
      path: '/Login',
      component: Login
    }
    ,
    //home
    {
      path: '/Home',
      component: Home,
      redirect:'/welcome',
      children:[
        {path: '/welcome',component: welcome},
        {path: '/users',component: Users},
        {path: '/rights',component: rights},
        {path: '/roles',component: roles},
        {path: '/categories',component: categories},
        {path: '/params',component: params},
        {path: '/goods',component: goods},
        {path: '/goods/addgoods',component: addgoods},
        {path: '/orders',component: orders},
        {path: '/reports',component: reports}
      ]
    }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  //to将要访问的路径
  //from 代表从哪个路径跳过来
  //next 是一个函数 表示放行 next() 直接放行 next('./login') 表示强制跳转

  //如果路径在login页面 直接放行 登录时获取token并保存
  if(to.path==='/login') return next()
  const tokenStr=window.sessionStorage.getItem('token')
  //如不在登录页 且没有token值时 强制跳转登录页
  if(!tokenStr) next('/login')
  next()
})

export default router
