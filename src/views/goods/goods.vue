<template>
    <div>
         <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
        <!-- 顶部搜索 -->
        <el-row>
            <el-col :span="8">
                 <el-input placeholder="请输入内容" v-model="querInfo.query" class="input-with-select" clearable @clear="getGoodsList">
                <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button> </el-input>
            </el-col>
            <el-col :span="4">
                 <el-button type="primary" @click="AddGoods">添加商品</el-button>
            </el-col>
        </el-row>

        <!-- tab表格区域 -->
        <el-table :data="goodsList" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column  prop="goods_name"  label="商品名称" width="700px"></el-table-column>  
            <el-table-column  prop="goods_price"  label="商品价格(元)" width="70px"></el-table-column>  
            <el-table-column  prop="goods_weight"  label="商品重量" width="70px"></el-table-column>  
            <el-table-column  prop="add_time"  label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.add_time|dateFormat}}
                </template>
            </el-table-column>  
            <el-table-column  label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="DelteTableColum(scope.row.goods_id)"></el-button>
                </template>
            </el-table-column>  
        </el-table>
        <!-- 分页 -->
           <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="querInfo.pagenum" 
           :page-sizes="[1, 2, 3, 4]" :page-size="querInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
           </el-pagination>
    </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            querInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            topInput:'',
            goodsList:[],
            total:0
        }
    },
    created(){
        this.getGoodsList()
    },
     methods:{
      async  getGoodsList(){
            const {data:res}=await this.$http.get('goods',{params:this.querInfo})
            if(res.meta.status!==200) return this.$message.error("获取商品列表失败")
            this.goodsList=res.data.goods
            this.total=res.data.total
            //console.log(this.goodsList)
        },
        //跳转页
        handleSizeChange(newSize){
            this.querInfo.pagesize=newSize
            this.getGoodsList()
        },
        handleCurrentChange(newPagenum){
            this.querInfo.pagenum=newPagenum
            this.getGoodsList()
        },
        //删除
        async DelteTableColum(id){
            const result=await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>err)
             if(result!=='confirm') return this.$message.info('取消删除')
             const {data:res} =await this.$http.delete('goods/'+id) 
            if(res.meta.status!==200) return this.$message.error('删除商品列表失败')
            this.$message.success('删除商品列表成功')
            this.getGoodsList()
        },
        AddGoods(){
            this.$router.push('/goods/addgoods')
        }
    }
}
</script>
<style lang="less" scoped>
.el-card,.el-table{
    margin-top: 10px;
}
</style>