<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>   

        <!-- 卡片 -->
        <el-card>
            <div id="main" style="width: 600px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
    data(){
        return{

        }
    },
    created(){

    },
    //页面已经完成渲染
    async mounted(){
        var myChart = echarts.init(document.getElementById('main'))

        //获取数据
        const {data:res}=await this.$http.get('reports/type/1')
        if(res.meta.status!==200)return this.$message.error("获取数据失败")
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(res.data)
    },
    methods:{

    }
}
</script>

<style lang="less" scoped>
.el-card{
    margin-top: 10px;
    
}
</style>