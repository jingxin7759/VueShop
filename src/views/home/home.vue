<template>
    
        <el-container class="home_wrap">
            <!-- 头部 -->
            <el-header>
                <div>
                    <img src="../../assets/img/home_logon.png">
                    <span>后台管理系统</span> 
                </div>
                
                <el-button type="info" @click="exit">退出</el-button>
            </el-header>
           
            <el-container>
                 <!-- 左侧 菜单栏-->
                <el-aside width="200px">
                    <!-- unique-opened为true时只能加载一个一级菜单 为false可以加载多个一级菜单  active-text-color点击时颜色-->
                   <el-menu background-color="#181D4D" text-color="#fff" active-text-color="#0033FF" unique-opened router :default-active="highPath">
                       <!-- 一级菜单 -->
                                <!-- for循环拿到左侧数据 在el中index不能重复 需绑定id -->
                          <el-submenu :index="item.id+'' " v-for="item in menus" :key="item.id">
                            <template slot="title">
                                <!-- 定义数组 利用菜单id的不同值得到不同的class -->
                                <i :class=iconList[item.id]></i>
                                <span>{{item.authName}}</span>
                            </template>
                            <!-- 二级菜单 -->
                             <el-menu-item :index="'/'+ items.path "  v-for="items in item.children" :key="items.id"  @click="btnpath('/'+ items.path)">
                                <template slot="title">{{items.authName}}</template>
                            </el-menu-item>
                         </el-submenu >
                    </el-menu>

                     

                </el-aside>
                <!-- 右侧 -->
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
         
    
</template>
<script>
export default {
    data(){
        return{
            highPath:'',
            //菜单栏数据
            menus:[],
            iconList:{
                    "125":'iconfont icon-user',
                    "103":'iconfont icon-tijikongjian',
                    "101":'iconfont icon-shangpin',
                    "102":'iconfont icon-danju',
                    "145":'iconfont icon-baobiao',
            }
               
            
        }
    },
    created(){
        this.getMenuList()
       
    },
    methods:{
        exit(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        async getMenuList(){
            const {data:res}=await this.$http.get('menus')
            if(res.meta.status!==200)  return this.$message.error(res.meta.msg)
            this.menus=res.data
            //console.log(res)
        },
        btnpath(itempath){
          
            this.highPath=itempath
            
        }
    }
}
</script>
<style lang='less' scoped>
.home_wrap{
    height: 100vh;
}
 .el-header{
    display: flex;
    background-color: #0033FF;
    color: #000;
    font-weight: bold;
    text-align: center;
    line-height: 60px;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    font-size: 20px;
    div{
        line-height: 60px;
        display: flex;
        img{
            margin:  auto;
            width: 50px;
            height: 50px;
        }
        span{
            padding-left: 10px;
        }
    }
    
  }
  
  .el-aside {
    background-color: #181D4D;
    color: #333;
    text-align: center;
    height: 100vh;
    .el-menu{
        border: none;
    }
  }
  
  .el-main {
    background-color: #FFF;
    color: #333;
    text-align: center;
    
   height: 100vh;
  }
  
  body > .el-container {
    margin-bottom: 40px;
    height: 100px;
  }
  .iconfont{
      padding-right: 10px;
      font-size: 24px;
      color: white;
  }
 
</style>