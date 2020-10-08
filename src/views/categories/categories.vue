<template>
    <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
        <el-row class="btn_catesAdd"><el-button type="primary" @click="showAddFrom">添加分类</el-button></el-row>

        <!-- 表格 -->
        
            <tree-table class="treeTable" :data="catesList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border show-row-hover> 
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-circle-check" v-if="scope.row.cat_deleted===false"></i>
                    <i class="el-icon-circle-close" v-else style="color:red"></i>
                </template>
                <!-- 排序 -->
                <template slot="opt" slot-scope="scope">
                   <el-button type="primary" icon="el-icon-search" @click="showCateEdit(scope.row.cat_id)">编辑</el-button>
                   <el-button type="danger" icon="el-icon-delete" @click="deleteCates(scope.row.cat_id)">删除</el-button>
                </template>
                <!-- 操作 -->

            </tree-table>
        
        <!-- 分页 -->
           <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="querInfo.pagenum" 
           :page-sizes="[1, 2, 3, 4]" :page-size="querInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
           </el-pagination>
    </el-card>

    <!-- 添加 -->
    <el-dialog    title="添加用户" :visible.sync="addFlag" width="50%" @close="closeAddCate">
      <el-form ref="addFromRef" :model="addFrom" label-width="80px" :rules="addFromRules" >
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addFrom.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类" >
                <!-- options 指定数据源 -->
                <el-cascader
                    expand-trigger="hover"
                    v-model="selectKeys"
                    :options="parentList"
                    :props="cascaderProps"
                    @change="parentChange" clearable change-on-select></el-cascader>
            </el-form-item>
           
       </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addFlag = false">取 消</el-button>
            <el-button type="primary" @click="btn_addfrom">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 修改 -->
          <el-dialog    title="修改用户" :visible.sync="editFlag" width="50%" >
       <el-form ref="editFromRef"  label-width="80px" :model="editFrom" :rules="editFromRules">
            <el-form-item label="用户名称" >
                <el-input v-model="editFrom.cat_name" ></el-input>
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
        return {
            //查询条件
            querInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            //商品分类
            catesList:[],
            //总数据
            total:0,
            addFlag:false,
            editFlag:false,
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },  
            //添加
            addFrom:{
                cat_name:'',
                //父级id
                cat_pid:0,
                //分类的等级，默认是一级
                cat_level:0
            },
            //保存修改
            editFrom:{},
            //父级分类列表
            parentList:[],
            //父级选择双向绑定
            selectKeys:{},
            addFromRules:{
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ]
            },
            editFromRules:{
                 cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ]
            },
            //为表格指定列
            columns:[
                {
                    label:'分类名称',
                    prop:'cat_name'
                },
                {
                    label:'是否有效',
                    type:'template',
                    template:'isok'
                },
                {
                    label:'操作',
                    type:'template',
                    template:'opt'
                }
            ]
        }
    },
    created(){
        this.getCatesList()
    },
   methods:{
        async getCatesList(){
            const {data:res}=await this.$http.get('categories',{params:this.querInfo})
            //console.log(res.data)
            if(res.meta.status!==200) return this.$message.error("获取商品分类失败")
            this.catesList=res.data.result
            this.total=res.data.total
        },
        handleSizeChange(newsize){
           this.querInfo.pagesize=newsize
           this.getCatesList()
       },
       //监听页码改变
       handleCurrentChange(newpage){
           this.querInfo.pagenum=newpage
           this.getCatesList()
       },
       //添加新的分类
       btn_addfrom(){
           this.$refs.addFromRef.validate(async va=>{
               if(!va) return
               const {data:res}=await this.$http.post('categories',this.addFrom)
               if(res.meta.status!==201) return this.$message.error("添加分类失败")
               this.$message.success('添加分类成功')
               this.getCatesList()
               this.addFlag=false
           })
       },
       showAddFrom(){
           this.getFromSlectList()
           this.addFlag=true
       },
       async getFromSlectList(){
          
          const {data:res}=await this.$http.get('categories',{params:{type:2}})
          //console.log(res.data)
            if(res.meta.status!==200) return this.$message.error("获取商品分类失败")
            this.parentList=res.data

       },
       parentChange(){
           //如果selectKeys数组中的length大于0,证明选中的父级分类
           //反之,就说明没有选中任何父级分类
           //父级分类的id
           if(this.selectKeys.length>0){
               this.addFrom.cat_pid=this.selectKeys[this.selectKeys.length-1]
               //为当前分类等级赋值
               this.addFrom.cat_level=this.selectKeys.length
           }
       },
       //重置添加分类
       closeAddCate(){
           this.$refs.addFromRef.resetFields()
           this.selectKeys=[]
            this.addFrom.cat_level=0
            this.addFrom.cat_pid=0
       },
       //打开编辑
       async showCateEdit(id){
         const {data:res}=await this.$http.get('categories/'+id)
         if(res.meta.status!==200) return this.$message.error("查询分类失败")
         this.editFrom=res.data
         this.editFlag=true

       },
        btn_editFrom(){
            
            this.$refs.editFromRef.validate(async va=>{
                if(!va) return
                const {data:res}=await this.$http.put('categories/'+this.editFrom.cat_id,{cat_name:this.editFrom.cat_name})
                if(res.meta.status!==200) return this.$message.error("修改分类失败")
                this.$message.success('修改分类成功')
               this.getCatesList()
               this.editFlag=false
            })
        },
        //删除
        async deleteCates(id){
            const result=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>err)
            if(result!=='confirm') return this.$message.info('取消删除')
            const {data:res}=await this.$http.delete('categories/'+id)
            if(res.meta.status!==200) return this.$message.error("删除分类失败")
            this.$message.success('删除分类成功')
            this.getCatesList()
        }
    }
    
}
</script>
<style lang="less" scoped>
.el-card{
    margin-top: 10px;
}
.btn_catesAdd{
    display: flex;
}
.btn_catesAdd .el-button{
    justify-content: flex-start;
}
.el-table{
    margin-top: 10px;
    
}
.el-icon-circle-check{
    color: lightgreen;
    font-size: 20px;
}
.el-icon-circle-close{
    color: red;
    font-size: 20px;
}
.treeTable{
    margin-top: 10px;
}
.el-cascader{
    width: 100%;
}
</style>