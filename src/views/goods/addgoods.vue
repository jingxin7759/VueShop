<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->

        <el-card>
            <el-alert title="添加商品信息" type="info" show-icon></el-alert>

            <!-- 步骤条 -->
            <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- tabs标签页 -->
            <el-form ref="addFromRef" :rules="addFromRules" :model="addForm" label-width="80px"  :label-position="'top'"  >

                <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforTabLeave" @tab-click="tabClick">

                    <el-tab-pane label="基本信息" name="0">

                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_cat">
                            <el-cascader v-model="addForm.goods_cat" :options="catList" :props="cascaderProps" @change="handleChange">
                            </el-cascader>
                        </el-form-item>

                        </el-tab-pane>

                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyDataList" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="items" v-for="(items,i) in item.attr_vals" :key="i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>  
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyDataList" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- 上传图片 -->
                        <el-upload
                            class="upload-demo"
                            :action="urlBase"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture" :headers="headUPload" :on-success="successLoad">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本 -->
                        <quill-editor v-model="addForm.goods_introduce" > </quill-editor>  
                        <el-button  type="primary" class="btnAddGodds" @click="addGodds">添加商品</el-button>
                    </el-tab-pane>

                </el-tabs>

            </el-form>
        </el-card>

        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="pngFlag" width="30%">
        <img :src="httpPathPng">
        </el-dialog>
    </div>
</template>



<script>

import _ from 'lodash'
export default {
    data(){
        return{
            activeIndex:'0',
            //添加
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_number:0,
                goods_weight:0,
                //商品所属分类
                goods_cat:[],
                //上传图片
                pics:[],
                //详情
                goods_introduce:'',
                attrs:[]
            },
            catList:[],
            cascaderProps:{
                expandTrigger: 'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            manyDataList:[],
            onlyDataList:[],
            urlBase:'http://127.0.0.1:8888/api/private/v1/upload',
            addFromRules:{
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                goods_price:[
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_number:[
                    { required: true, message: '请输入商品数量', trigger: 'blur' }
                ],
                goods_weight:[
                    { required: true, message: '请输入商品重量', trigger: 'blur' }
                ],
                goods_cat:[
                    { required: true, message: '请输入商品分类', trigger: 'blur' }
                ]
            },
            headUPload:{
            
            Authorization:window.sessionStorage.getItem('token')
            },
            httpPathPng:'',
            pngFlag:false
        }
    },
    created(){

        this.getCateList()

    },
    methods:{
        async getCateList(){

            const {data:res}=await this.$http.get('categories')
            if(res.meta.status!==200) return this.$message.error("获取分类列表失败")
            this.catList=res.data
            
        },
        handleChange(){

            if(this.addForm.goods_cat.length!==3) this.addForm.goods_cat=[]
            
        },
        beforTabLeave(activeName, oldActiveName){
            if(oldActiveName==='0' && this.addForm.goods_cat.length!==3){
                this.$message.error("请选择商品分类")
                return false
            } 
        },
        async tabClick(){
            //展示动态参数
            //console.log(this.activeIndex)
            if(this.activeIndex==='1'){
                const {data:res}=await this.$http.get('categories/'+this.cateId+'/attributes',{params:{sel:'many'}})
                //console.log(res.data)
                if(res.meta.status!==200) return this.$message.error("获取参数失败")
                res.data.forEach(va=>{
                    va.attr_vals=va.attr_vals.length===0 ? [] :va.attr_vals.split(' ')
                })
                this.manyDataList=res.data
            }else if(this.activeIndex==='2'){
                const {data:res}=await this.$http.get('categories/'+this.cateId+'/attributes',{params:{sel:'only'}})
                if(res.meta.status!==200) return this.$message.error("获取参数失败")
                this.onlyDataList=res.data
            }
        },
        handlePreview(res){
            //console.log(res)
            this.httpPathPng=res.response.data.url
            this.pngFlag=true
        },
        handleRemove(res){
            
            //获取临时存储数据
            const path=res.response.data.tmp_path
            //找到对应的索引
            const i =this.addForm.pics.findIndex(x=>x.pic===path)
            //删除
            this.addForm.pics.splice(i,1)
            //console.log(this.addForm)
        },
        successLoad(res){
            
            const pic={pic:res.data.tmp_path}
            this.addForm.pics.push(pic)
        },
        async addGodds(){
            this.$refs.addFromRef.validate(va=>{
                if(!va) return this.$message.error("请填写必填项！")
            })
            //添加
            const from = _.cloneDeep(this.addForm)
            from.goods_cat=from.goods_cat.join(',')
            
            //处理动态属性
            
            this.manyDataList.forEach(item=>{
                const info={attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')}
                this.addForm.attrs.push(info)
            })
            //处理静态属性
            this.onlyDataList.forEach(item=>{
                const info={attr_id:item.attr_id,attr_value:item.attr_vals}
                this.addForm.attrs.push(info)
            })
            from.attrs=this.addForm.attrs
            const {data:res}=await this.$http.post('goods',from)
            if(res.meta.status!==201) return this.$message.error("添加商品失败")
            this.$message.success("添加商品成功")
        }
        
    },
    computed:{
        cateId(){
            if(this.addForm.goods_cat.length===3){
                return this.addForm.goods_cat[2]
            }
            return null
        }
    }
}
</script>

<style lang="less" scoped>
.el-card,.btnAddGodds{
    margin-top: 10px;
    
}
.el-steps{
    margin-top: 15px;
    margin-bottom: 15px;
}
.el-form-item{
    text-align: left;
}

</style>