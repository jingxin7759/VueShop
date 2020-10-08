<template>

    <div>
     
        <!-- 面包屑导航区 -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
          
        <el-card>
           
            <el-row>
                <el-col :span="10">
                         <el-input placeholder="请输入内容" class="input-with-select"  v-model="userInfo.query" clearable @clear="getuserList">
                             <el-button slot="append" icon="el-icon-search" @click="getuserList"></el-button>
                         </el-input>
                </el-col>
                <el-col :span="4">
                        <el-button type="primary" @click="addUsers">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-table :data="userList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名"> </el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <!--slot-scope="scope"拿到当前信息  -->
                    <template slot-scope="scope">
                        <!-- 开关 -->
                        <el-switch v-model="scope.row.mg_state" @change="usersMgState(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300px">
                    <!-- 操作列 -->
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="修改" placement="top" >
                            <el-button type="primary" icon="el-icon-edit" circle @click="showdark(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                           <el-button type="warning" icon="el-icon-setting" circle @click="roleShow(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <el-button type="danger" icon="el-icon-delete" circle @click="deleteFrom(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
           <!-- 分页 -->
           <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="userInfo.pagenum" 
           :page-sizes="[1, 2, 3, 4]" :page-size="userInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
           </el-pagination>
        </el-card>

        <!-- 添加用户 -->
        <el-dialog    title="添加用户" :visible.sync="addFlag" width="50%" @close="closeDiaLog">
       <el-form ref="addFromRef" :model="addFrom" label-width="80px" :rules="addFromRules" >
            <el-form-item label="用户名称" prop="username">
                <el-input v-model="addFrom.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addFrom.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addFrom.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="addFrom.mobile"></el-input>
            </el-form-item>
       </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addFlag = false">取 消</el-button>
            <el-button type="primary" @click="btn_addfrom">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 修改用户 -->
        <el-dialog    title="修改用户" :visible.sync="editFlag" width="50%" >
       <el-form ref="editFromRef"  label-width="80px" :model="editFrom" :rules="editFromRules">
            <el-form-item label="用户名称" >
                <el-input v-model="editFrom.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱"  prop="email">
                <el-input v-model="editFrom.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="editFrom.mobile"></el-input>
            </el-form-item>
       </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="editFlag = false">取 消</el-button>
            <el-button type="primary" @click="btn_editFrom">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 分配角色 -->
        <el-dialog    title="分配角色" :visible.sync="usersRoleFlag" width="50%">
           <div>
               <p>当前角色：{{userinfos.username}}</p>
               <p>当前角色：{{userinfos.role_name}}</p>
               <p>分配角色：
                    <el-select v-model="selectId" placeholder="请选择">
                        <el-option v-for="item in selectListRoles" :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                        
                    </el-select>
               </p>
           </div>
           
        <span slot="footer" class="dialog-footer">
            <el-button @click="usersRoleFlag = false">取 消</el-button>
            <el-button type="primary" @click="rolesAdd">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){  
        //手机号自定规则
        var checkPhone = (rule, value, callback) => {
                const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
                if (!value) {
                return callback(new Error('电话号码不能为空'))
                }
                setTimeout(() => {
                // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
                // 所以在前面加了一个+实现隐式转换
            
                if (!Number.isInteger(+value)) {
                    callback(new Error('请输入数字值'))
                } else {
                    if (phoneReg.test(value)) {
                    callback()
                    } else {
                    callback(new Error('电话号码格式不正确'))
                    }
                }
                }, 100)
            }
            //邮箱自定规则
            var checkEmail = (rule, value, callback) => {
                const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
                if (!value) {
                return callback(new Error('邮箱不能为空'))
                }
                setTimeout(() => {
                if (mailReg.test(value)) {
                    callback()
                } else {
                    callback(new Error('请输入正确的邮箱格式'))
                }
                }, 100)
            }

        return{
            
            userInfo:{
                query:'',
                //当前页数
                pagenum:1,
                //当前每页显示多少数据
                pagesize:2
            },
            userList:[],
            total:0,
            //添加用户展示框
            addFlag:false,
            //修改用户展示框
            editFlag:false,
            //分配角色
            usersRoleFlag:false,
            //保存查询用户
            editFrom:{},
            //分配角色
            userinfos:{},
            //分配角色下拉
            selectListRoles:[],
            //绑定分配角色id
            selectId:'',
            addFrom:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            addFromRules:{
                //验证
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                 password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                 email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                 mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkPhone, trigger: 'blur' }
                ]
            },
            editFromRules:{
                 email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                 mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkPhone, trigger: 'blur' }
                ]
            }
        }
    },
    created(){
        this.getuserList()
    },
    methods:{
      async getuserList(){
        const {data:res}=await this.$http.get('users',{params:this.userInfo})
        if(res.meta.status!==200)  return this.$message.error('获取用户失败！！！')
        this.userList=res.data.users
        this.total=res.data.total
        //console.log(res)
       },
       //监听pagesize
       handleSizeChange(newsize){
           this.userInfo.pagesize=newsize
           this.getuserList()
       },
       //监听页码改变
       handleCurrentChange(newpage){
           this.userInfo.pagenum=newpage
           this.getuserList()
       },
       //改变状态栏
       async usersMgState(userinfo){
       const {data:res}=await this.$http.put('users/'+userinfo.id+'/state/'+userinfo.mg_state)
       if(res.meta.status!==200){
           userinfo.mg_state=!userinfo.mg_state
           return this.$message.error('更新状态失败！')
        } 
        this.$message.success('更新状态成功')
       },
        //展示添加用户
        addUsers(){
            this.addFlag=true
        },
        //关闭重置
        closeDiaLog(){
            this.$refs.addFromRef.resetFields()
        },
        //验证表单是否有数据且格式正确
        btn_addfrom(){
            //
            this.$refs.addFromRef.validate(async val=>{
                //console.log(val)
                if(!val) return
                //发起请求
               const {data:res}=await this.$http.post('users',this.addFrom)
               if(res.meta.status!==201) return this.$message.error('添加失败')
               this.$message.success('添加成功')
               //关闭用户框
               this.addFlag=false
               //刷新用户列表
               this.getuserList()
            })
        },
        async showdark(id){
           const{data:res}=await this.$http.get('users/'+id)
           if(res.meta.status!==200) return this.$message.error('查询用户请求失败')
           this.editFrom=res.data
           //console.log(this.editFrom)
           this.editFlag=true
        },
        //修改
        btn_editFrom(id){
            this.$refs.editFromRef.validate(async va=>{
                if(!va) return
                const{data:res}=await this.$http.put('users/'+this.editFrom.id,{email:this.editFrom.email,mobile:this.editFrom.mobile})
                console.log(res.meta.status)
                if(res.meta.status!==200) return this.$message.error('修改失败')
                this.$message.success('修改成功')
                this.editFlag=false
                this.getuserList()
            })
        },
        //删除
          async  deleteFrom(id){
          const result=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>err)
            //confirm 代表确认删除
            //cancel 代表取消删除
            //console.log(result)
            if(result!=='confirm') return this.$message.info('取消删除')
            const {data:res} =await this.$http.delete('users/'+id)
            if(res.meta.status!==200) return this.$message.error('删除用户失败')
            this.$message.success('删除用户成功')
            this.getuserList()
        },
        //打开分配角色
        async roleShow(item){
            this.userinfos=item
            const {data:res}=await this.$http.get('roles')
            if(res.meta.status!==200) return this.$message.error('获取分配角色失败')
            this.selectListRoles=res.data
            this.usersRoleFlag=true
        },
        //分配角色
        async rolesAdd(){
            if(!this.selectId) return this.$message.error('请选择要分配的角色')
            const {data:res}=await this.$http.put('users/'+this.userinfos.id+'/role',{rid:this.selectId})
            if(res.meta.status!==200) return this.$message.error('分配角色失败')
            this.$message.success('分配角色成功')
            this.getuserList()
            this.usersRoleFlag=false
        }
    }
}
</script>
<style lang="less" scoped>
.el-card{
    margin-top: 10px;
}
.el-row{
   height: 80px;
   line-height: 80px;
}
.el-table-column{
    height: 10px;
    text-align: center;
}

.el-main .el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 40px;
}
.el-table__body tr,
  .el-table__body td {
    padding: 0;
    height: 40px;
}

</style>