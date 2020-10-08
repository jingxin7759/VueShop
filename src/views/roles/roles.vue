<template>
    <div>
        <!-- 面包屑导航区 -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row class="btnaddjues"><el-button type="primary" @click="rolesaddFlags = true">添加角色</el-button></el-row>
             <el-table :data="rolesList" border stripe>
                 <!-- 下拉 -->
                 <el-table-column type="expand" label="< >">
                     <template slot-scope="scope">
                            <el-row v-for="item in scope.row.children" :key="item.id">
                                <!-- 一级菜单 -->
                                <el-col :span="5"  class="one">
                                    <el-tag>{{item.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!-- 二级菜单 -->
                                <el-col :span="19">
                                    <el-row v-for="item2 in item.children" :key="item2.id">
                                        <el-col :span="6" class="two">
                                            <el-tag type="success"  closable>{{item2.authName}}</el-tag>
                                            <i class="el-icon-caret-right"></i>
                                        </el-col>
                                        <!-- 三级菜单 -->
                                         <el-col :span="18">
                                            <el-tag type="warning"  closable class="three" v-for="item3 in item2.children" :key="item3.id" @close="removerolesid(scope.row,item3.id)">
                                                {{item2.authName}}
                                            </el-tag>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                     </template>
                 </el-table-column>
                 <el-table-column type="index" label="#"></el-table-column>
                 <el-table-column prop="roleName" label="角色名称"> </el-table-column>
                 <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
                 <el-table-column  label="操作" width="500px"> 
                     <template slot-scope="scope">
                         <el-button type="primary" icon="el-icon-edit" @click="rolesEdit(scope.row.id)">编辑</el-button>
                         <el-button type="danger" icon="el-icon-delete" @click="deleteRoles(scope.row.id)">删除</el-button>
                         <el-button type="warning" icon="el-icon-setting" @click="showrolesPower(scope.row)">分配权限</el-button>
                     </template>
                 </el-table-column>
             </el-table>
        </el-card>



        <!-- 添加用户 -->
        <el-dialog    title="添加用户" :visible.sync="rolesaddFlags" width="50%" @close="closeRoles">
         <el-form ref="addrolesRef" :model="addFromroles" label-width="80px" :rules="addFromroles" >
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="addFromroles.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="addFromroles.roleDesc"></el-input>
            </el-form-item>
            
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="rolesaddFlags = false">取 消</el-button>
            <el-button type="primary" @click="btn_addfromroles">确 定</el-button>
        </span>
        </el-dialog>
        
    <!-- 修改用户 -->
    <el-dialog    title="修改用户" :visible.sync="rolesEditFlag" width="50%" >
       <el-form ref="RouleseditFromRef"  label-width="80px" :model="roulesEditFrom" :rules="RoleseditFromRules">
            <el-form-item label="角色名称" >
                <el-input v-model="roulesEditFrom.roleName" disabled></el-input>
            </el-form-item>
            <el-form-item label="技术名称"  prop="roleDesc">
                <el-input v-model="roulesEditFrom.roleDesc"></el-input>
            </el-form-item>
       </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="rolesEditFlag = false">取 消</el-button>
            <el-button type="primary" @click="btn_RoleseditFrom">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 分配权限 -->
        <el-dialog    title="分配权限" :visible.sync="rolesPowerFlag" width="50%" @close="closePower">
            <!-- 树形图 -->
         <el-tree ref="treeNode" :data="rolesListPower" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defalutKeys"> </el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="rolesPowerFlag = false">取 消</el-button>
            <el-button type="primary" @click="powerAdd">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            
            rolesList:[],
            roulesEditFrom:{},
            //权限列表
            rolesListPower:[],
            //权限结构
            treeProps:{
                 children: 'children',
                 label: 'authName'
            },
            rolesaddFlags:false,
            rolesEditFlag:false,
            rolesPowerFlag:false,
            RoleseditFromRules:{
                 roleDesc: [
                    { required: true, message: '请输入技术名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ]
            },
            addFromroles:{
                roleName:'',
                roleDesc:''
            },
            //默认显示id
            defalutKeys:[],
            //权限分配当前id
            rowID:''
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        async getRolesList(){
            const {data:res}=await this.$http.get('roles')
            console.log(res)
            if(res.meta.status!==200) return this.$message.error("获取角色失败")
            this.rolesList=res.data
        },
        async rolesEdit(id){
            const {data:res}=await this.$http.get('roles/'+id)
            if(res.meta.status!==200) return this.$message.error("获取用户失败")
            this.roulesEditFrom=res.data
            
            this.rolesEditFlag=true
        },
        //修改
        btn_RoleseditFrom(){
            
             this.$refs.RouleseditFromRef.validate(async val=>{
                if(!val) return
                const {data:res}=await this.$http.put('roles/'+this.roulesEditFrom.roleId,{roleName:this.roulesEditFrom.roleName,roleDesc:this.roulesEditFrom.roleDesc})
                
                if(res.meta.status!==200) return this.$message.error("修改用户失败")
                this.$message.success("修改用户成功")
                this.rolesEditFlag=false
                this.getRolesList()
            })
        },
        //删除
        async deleteRoles(id){
            const result=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>err)
            if(result!=='confirm') return this.$message.info('取消删除')
            const {data:res} =await this.$http.delete('roles/'+id)
             if(res.meta.status!==200) return this.$message.error('删除用户失败')
            this.$message.success('删除用户成功')
            this.getRolesList()
        },
        //添加
        btn_addfromroles(){
            this.$refs.addrolesRef.validate(async va=>{
                if(!va) return
                const {data:res} =await this.$http.post('roles',this.addFromroles)
                if(res.meta.status!==201)return this.$message.error('添加角色失败')
                this.$message.success('添加角色成功')
                this.rolesaddFlags=false
                this.getRolesList()
            })
        },
        //重置表单
        closeRoles(){
            this.$refs.addrolesRef.resetFields()
        },
        //删除指定标签
        async removerolesid(row,id){
            
            const result=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>err)
            if(result!=='confirm') return this.$message.info('用户取消删除')
            const {data:res}=await this.$http.delete('roles/'+row.id+'/rights/'+id)
            if(res.meta.status!==200) return this.$message.error('用户权限未取消')
            this.$message.success('用户权限取消成功')
            row.children=res.data
        },
        //展示分配权力对话框
        async showrolesPower(row){
            this.rowID=row.id
            const{data:res}= await this.$http.get('rights/tree')
            if(res.meta.status!==200) return this.$message.error('获取权限列表失败')
            this.rolesListPower=res.data
            //渲染三级权限
            this.getrootList(row,this.defalutKeys)
            //console.log(this.defalutKeys)
            this.rolesPowerFlag=true
        },
        //通过递归方式获取全部权限

        getrootList(node,arr){
           
            if(!node.children){
                
                return arr.push(node.id)
               
            }
            node.children.forEach(item=>{
                this.getrootList(item,arr)
            })
        },
        //重置权限分配
        closePower(){
            this.defalutKeys=[]
        },
        //将权限加载到服务器上
        async powerAdd(){
            const keys=[
                ...this.$refs.treeNode.getCheckedKeys(),
                ...this.$refs.treeNode.getHalfCheckedNodes()
            ]
            //console.log(keys)
            const idKeys=keys.join(',')
            const {data:res}=await this.$http.post('roles/'+this.rowID+'/rights',{rids:idKeys})
            if(res.meta.status!==200) return this.$message.error("分配权限失败")
            this.$message.success("分配权限成功")
            this.getRolesList()
            this.rolesPowerFlag=false
            
        }
    }
}
</script>
<style lang="less" scoped>
.el-card{
    margin-top: 10px;
}
.btnaddjues{
    display: flex;
}
.btnaddjues .el-button{
    justify-content: left;
}
.el-table{
    margin-top: 10px;
}
.one,.two{
    margin-top: 10px;
}
.three{
    margin-left: 5px;
}
</style>