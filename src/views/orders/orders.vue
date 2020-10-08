<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>        

        <!-- 卡片区域 -->

        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容"  class="input-with-select"  v-model="querInfo.query" clearable @clear="getOrdersList">
                    <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button> </el-input>
                </el-col>
            </el-row>

        <el-table :data="ordersList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column  prop="order_number"  label="订单编号" ></el-table-column> 
                <el-table-column  prop="order_price"  label="订单价格" width="100px"></el-table-column>
                <el-table-column  prop="pay_status"  label="是否付款" width="100px">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  prop="is_send"  label="是否发货" width="100px"></el-table-column> 
                <el-table-column  prop="create_time"  label="下单时间" >
                    <template slot-scope="scope">
                    {{scope.row.create_time|dateFormat}}
                </template>
                </el-table-column>
                <el-table-column  label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit"></el-button>
                    <el-button type="success" icon="el-icon-location" size="mini" @click="showBox"></el-button>
                </template>
            </el-table-column>  
            </el-table>
            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="querInfo.pagenum" 
            :page-sizes="[1, 2, 3, 4]" :page-size="querInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 修改 -->
        <el-dialog  title="编辑" :visible.sync="editFlag" width="50%" @close="editCloseFrom">
            <el-form ref="editFromRef"  label-width="100px" :model="editFrom" :rules="editFromRules">
                <el-form-item label='省市区/县' prop="address1">
                    <el-cascader :options="cityData" v-model="editFrom.address1"></el-cascader>
                </el-form-item>
                <el-form-item label='详细地址' prop="address2">
                    <el-input  v-model="editFrom.address2"></el-input>
                </el-form-item>
            </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="editFlag = false">取 消</el-button>
            <el-button type="primary" @click="btn_editFrom">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 地址 -->
     <el-dialog  title="物流进度" :visible.sync="boxFlag" width="50%" >
           <el-timeline>
            <el-timeline-item
            v-for="(activity, index) in kuaidiList"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
            </el-timeline-item>
        </el-timeline>

        <span slot="footer" class="dialog-footer">
            <el-button @click="boxFlag = false">取 消</el-button>
            <el-button type="primary" @click="btn_boxFrom">确 定</el-button>
        </span>
    </el-dialog>
    </div>
</template>

<script>
import cityData from '../../assets/js/citydata'
export default {
    data(){
        return{
            querInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            ordersList:[],
            total:0,
            editFlag:false,
            boxFlag:false,
            editFrom:{
                address1:[],
                address2:''
            },
            editFromRules:{
                address1: [
                    { required: true, message: '请选择区县', trigger: 'blur' }
                ],
                address2: [
                    { required: true, message: '请选择地址', trigger: 'blur' }
                ]
            },
            cityData,
            kuaidiList:[]
        }
    },
    created(){
        this.getOrdersList()
    },
    methods:{
        async getOrdersList(){
            const {data:res}=await this.$http.get('orders',{params:this.querInfo})
            
            if(res.meta.status!==200)return this.$message.error("获取订单列表失败")
            this.ordersList=res.data.goods
            this.total=res.data.total
            
        },
        handleSizeChange(newsize){
            this.querInfo.pagesize=newsize
            this.getOrdersList()
        },
        handleCurrentChange(newNum){
            this.querInfo.pagenum=newNum
            this.getOrdersList()
        },
        btn_editFrom(){
            this.editFlag=false
        },
        showEdit(){
            this.editFlag=true
        },
        editCloseFrom(){
            this.$refs.editFromRef.resetFields()
        },
        async showBox(){
            const {data:res}=await this.$http.get('/kuaidi/1106975712662')
            if(res.meta.status!==200)return this.$message.error("获取物流进度失败")
            this.kuaidiList=res.data
            //console.log(this.kuaidiList)
            this.boxFlag=true
        },
        btn_boxFrom(){

        }
    }
}
</script>

<style lang="less" scoped>

.el-card,.el-table{
    margin-top: 10px;
    margin-bottom: 10px;
}
.el-cascader{
    width: 100%;
}
</style>