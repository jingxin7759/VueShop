<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="img_box"> <img src="../assets/img/logo.png" alt="头像"></div>

            <!-- 登录验证区域 -->
           <el-form :model="loginFrom" :rules="loginFromrules" label-width="0px" class="login_from" ref="loginFromRef">
               <!-- 用户登录 -->
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginFrom.username" ></el-input>
                </el-form-item>
                <!-- 用户密码 -->
                 <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-3702mima" v-model="loginFrom.password" type="password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                 <el-form-item class="btns">
                     <el-button type="primary" @click="loginAdmin">登录</el-button>
                     <el-button type="info" @click="resultLoginFrom">重置</el-button>
                </el-form-item>
           </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            //登录数据
            loginFrom:{
                username:'admin',
                password:'123456'
            },
             loginFromrules: {
                username: [
                    { required: true, message: '请输入名字', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ]
             }
        }
       
    },
    methods:{
        resultLoginFrom(){
            this.$refs.loginFromRef.resetFields();
        },
        loginAdmin(){
            this.$refs.loginFromRef.validate(async va=>{
                if(!va) return
             const {data:res}=await this.$http.post('login',this.loginFrom)
             console.log(res)
             if(res.meta.status!==200)  return this.$message.error('账号或密码错误')
             this.$message.success('用户登录成功')

            //保存token值
             window.sessionStorage.setItem('token',res.data.token)
            //跳转地址home
            this.$router.push('/home')
            })
        }
    }
}
</script>

<style lang='less' scoped>
    .login_container{
        position: relative;
        height: 100%;
        background: #2b4b6b;
    }
    .login_box{
        position: absolute;
        width: 450px;
        height: 300px;
        background: #fff;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        border-radius: 5px;
        .img_box{
            width: 130px;
            height: 130px;
            position: absolute;
            border: 1px solid #eee;
            box-shadow: 0 0 10px #ddd;
            padding: 10px;
            border-radius: 50%;
            background: #fff;
            left: 50%;
            transform: translate(-50%,-50%);
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: grey;
               
            }
        }
     }
     .login_from{
         position: absolute;
         width: 100%;
         bottom: 0;
         padding: 0 20px;
        .btns{
            display: flex;
            justify-content: center;
        }
     }
</style>