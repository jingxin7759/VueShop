<template>
    <div>
        <!-- 面包屑导航区 -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->

        <el-card>
            <el-row><el-alert title="注意： 只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert></el-row>
            <el-row class="elrow_topList">
                <div>
                    <span>选择商品分类:</span>
                    <el-cascader
                        v-model="selectKeys"
                        :options="cateList"
                        :props="cascaderProps"
                        @change="handleChange" expand-trigger="hover">
                    </el-cascader>
                </div>
            </el-row>

            <!-- tab页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <div class="flex_btn"><el-button type="primary" :disabled="isBtnDisable" @click="showAdd">添加参数</el-button></div>
                     
                   <!-- 渲染动态参数 -->
                   <el-table :data="manyDataList" border stripe class="manyClassTop">
                       <el-table-column type="expand">
                           <template slot-scope="scope">
                               <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="deletecans(i,scope.row)">{{item}}</el-tag>
                               <el-input class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                       <el-table-column type="index" label="#"></el-table-column>
                       <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                       <el-table-column  label="操作">
                           <template slot-scope="scope">
                               <el-button type="primary" icon="el-icon-edit" @click="showEditFrom(scope.row.attr_id)">编辑</el-button>
                               <el-button type="danger" icon="el-icon-delete" @click="showDelteFrom(scope.row.attr_id)">删除</el-button>
                           </template>
                       </el-table-column>
                   </el-table>
                  
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                   <div class="flex_btn"> <el-button type="primary" :disabled="isBtnDisable" @click="showAdd">添加参数</el-button></div>

                    <!-- 静态渲染参数 -->
                   <el-table :data="onlyDataList" border stripe class="manyClassTop">
                       <el-table-column type="expand">
                           <template slot-scope="scope">
                               <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="deletecans(i,scope.row)">{{item}}</el-tag>
                               <el-input class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                           </template>
                       </el-table-column>
                       <el-table-column type="index" label="#"></el-table-column>
                       <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column  label="操作">
                           <template slot-scope="scope">
                               <el-button type="primary" icon="el-icon-edit" @click="showEditFrom(scope.row.attr_id)">编辑</el-button>
                               <el-button type="danger" icon="el-icon-delete" @click="showDelteFrom(scope.row.attr_id)">删除</el-button>
                           </template>
                       </el-table-column>
                   </el-table>
                </el-tab-pane>
                
            </el-tabs>
        </el-card>

        <!-- 添加 -->

        <el-dialog    :title="'添加'+this.isMany" :visible.sync="addFlag" width="50%" @close="addCloseFrom">
       <el-form ref="addFromRef"  label-width="80px" :model="addFrom" :rules="addFromRules">
            <el-form-item :label='this.isMany' prop="attr_name">
                <el-input  v-model="addFrom.attr_name"></el-input>
            </el-form-item>
       </el-form>

       <span slot="footer" class="dialog-footer">
            <el-button @click="addFlag = false">取 消</el-button>
            <el-button type="primary" @click="btn_addFrom">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog  :title="'修改'+this.isMany" :visible.sync="editFlag" width="50%" @close="editCloseFrom">
       <el-form ref="editFromRef"  label-width="80px" :model="editFrom" :rules="editFromRules">
            <el-form-item :label='this.isMany' prop="attr_name">
                <el-input  v-model="editFrom.attr_name"></el-input>
            </el-form-item>
       </el-form>

       <span slot="footer" class="dialog-footer">
            <el-button @click="editFlag = false">取 消</el-button>
            <el-button type="primary" @click="btn_editFrom">确 定</el-button>
        </span>
    </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            cateList:[],
            //选择框
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            selectKeys:[],
            //默认选择标签页
            activeName:"many",
            //动态参数
            manyDataList:[],
            //静态参数
            onlyDataList:[],
            addFlag:false,
            addFrom:{},
            addFromRules:{
                 attr_name: [
                    { required: true, message: '请输入参数', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ]
            },
            //修改
            editFlag:false,
            editFrom:{},
            editFromRules:{
                attr_name: [
                    { required: true, message: '请输入参数', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ]
            }
            
        }
    },
    created(){
        this.getParamsList()
    },
    methods:{
        //获取所有的商品分类
        async getParamsList(){
            
            const {data:res}=await this.$http.get('categories')
            if(res.meta.status!==200) return this.$message.error("获取分类列表失败")
            this.cateList=res.data
            //console.log(this.cateList)
        },
        async handleChange(){
            //判断selectkeys长度为三 若不是代表没有选择三级权限
            this.getCatChange()
             
        },
        handleClick(){
               this.getCatChange()
        },
        //抽取函数
        async getCatChange(){
            if(this.selectKeys.length!==3){
                this.selectKeys=[]
                this.manyDataList=[]
                this.onlyDataList=[]
                return
            }
            //根据所选id，发起请求

            const {data:res}=await this.$http.get('categories/'+this.cateId+'/attributes',{params:{sel:this.activeName}})
            if(res.meta.status!==200) return this.$message.error("获取分类参数失败")
           
            res.data.forEach(item => {
               item.attr_vals=item.attr_vals ? item.attr_vals.split(' '):[]
               item.inputVisible=false
               item.inputValue=''
            })
             console.log(res.data)
            //判断数据为动态还是静态 分别赋值
            if(this.activeName==="many"){
                this.manyDataList=res.data
            }else{
                this.onlyDataList=res.data
            }
        },
        btn_addFrom(){
            this.$refs.addFromRef.validate(async va=>{
                if(!va) return
                const {data:res}=await this.$http.post('categories/'+this.cateId+'/attributes',{attr_name:this.addFrom.attr_name,attr_sel:this.activeName})
                if(res.meta.status!==201) return this.$message.error('添加参数失败')
                this.$message.success('添加参数成功')

                this.getParamsList()
                this.addFlag=false
            })
        },
        showAdd(){
           this.addFlag=true
           
        },
        //重置添加表单
        addCloseFrom(){
            this.$refs.addFromRef.resetFields()
        },
        //修改
        editCloseFrom(){
            this.$refs.editFromRef.resetFields()
        },
         btn_editFrom(){
            this.$refs.editFromRef.validate(async va=>{
                if(!va) return
                const {data:res}=await this.$http.put('categories/'+this.cateId+'/attributes/'+this.editFrom.attr_id,{attr_name:this.editFrom.attr_name,attr_sel:this.activeName})
                if(res.meta.status!==200) return this.$message.error('修改参数失败')
                this.$message.success('修改参数成功')
                this.getParamsList()
                this.editFlag=false
            })
            
        },
        async showEditFrom(attr_id){
            const {data:res}=await this.$http.get('categories/'+this.cateId+'/attributes/'+attr_id,{params:{attr_sel:this.activeName}})
            if(res.meta.status!==200) return this.$message.error('获取参数失败')
            this.editFrom=res.data
            this.editFlag=true
        },
        //删除
        async showDelteFrom(delteId){
            
            const result=await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>err)
             if(result!=='confirm') return this.$message.info('取消删除')
             const {data:res} =await this.$http.delete('categories/'+this.cateId+'/attributes/'+delteId)
            if(res.meta.status!==200) return this.$message.error('删除参数失败')
            this.$message.success('删除参数成功')
            this.getParamsList()
        },
        //输入框与tag
        showInput(row){
            
            row.inputVisible=true
            //自动获取焦点
            //$nextTick当页面被重新渲染时 调用指定函数的代码
             this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
        });
        },
         handleInputConfirm(row){
               
            if(row.inputValue.trim().length===0){
                row.inputValue=''
                row.inputVisible=false
                return
            }
            //没有retrun 代表有值 需要后续操作
           this.saveEdit(row)
        },
        //修改参数
        async saveEdit(row){
             row.attr_vals.push(row.inputValue.trim())
             row.inputValue=''
             row.inputVisible=false

             const {data:res}=await this.$http.put('categories/'+this.cateId+'/attributes/'+row.attr_id,
             {attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(' ')}
             )
             if(res.meta.status!==200)  return this.$message.error("修改参数失败")
             this.$message.success('修改参数成功')

             this.getParamsList()
        },
        deletecans(i,row){
            row.attr_vals.splice(i,1)
            this.saveEdit(row)
        }
    },
    computed:{
        //按钮禁用与使用
        isBtnDisable(){
            if(this.selectKeys.length!==3){
                return true
            }
            return false
        },
        cateId(){
            if(this.selectKeys.length===3){
                return this.selectKeys[2]
            }
            return null
        },
        isMany(){
            if(this.activeName==="many"){
                return '动态属性'
            }
            return '静态属性'
        }
    }
    
}
</script>

<style lang="less" scoped>
.el-card{
    margin-top: 10px;
}
.elrow_topList{
    display: flex;
}
.elrow_topList div{
    margin-top: 10px;
    margin-left: 10px;
    justify-content: left;
}
.el-tabs{
    margin-top: 10px;
    margin-left: 10px;
}
.flex_btn {
    display: flex;
}
.flex_btn .el-button{
    justify-content: left;
}
.manyClassTop{
    margin-top: 10px;
}
.el-tag{
    margin-left: 5px;
}
.input-new-tag{
    width: 80px;
}
</style>