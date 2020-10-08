<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-table  :data="rightsList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="authName" label="姓名"> </el-table-column>
                <el-table-column prop="path" label="路径"> </el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level==='0'">一级权限</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level==='1'">二级权限</el-tag>
                        <el-tag type="danger" v-else>三级权限</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return{
            rightsList:[]
        }
    },
    created(){
        //获取所有的权限
        this.getRightsList()
    },
    methods:{
        async getRightsList(){
            const {data:res}=await this.$http.get('rights/list')
            if(res.meta.status!==200) return this.$message.error('获取权限失败！！！')
            this.rightsList=res.data
            console.log(this.rightsList)
        }
    }
}
</script>

<style lang="less" scoped>
.el-card{
    margin-top: 10px;
}
</style>