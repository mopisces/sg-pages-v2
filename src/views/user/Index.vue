<template>
	<div>
		<vxe-toolbar>
			<template #buttons>
				<van-button type="info" @click="handleAdd()">添加用户</van-button>
			</template>
		</vxe-toolbar>
		<vxe-table ref="user" stripe :height="config.table.height" :data="list" :row-key="true">
			<vxe-table-column title="用户名" field="user" min-width="10"></vxe-table-column>
        	<vxe-table-column title="密码" field="pass"  min-width="30"></vxe-table-column>
        	<vxe-table-column title="操作" min-width="50">
        		<template #default="{ row }">
        			<van-button type="warning" size="mini" @click="handleEdit(row)">修改</van-button>
        			<van-button type="danger" size="mini" @click="handleStatus(row)">删除</van-button>
        		</template>
        	</vxe-table-column>
		</vxe-table>
		<van-dialog v-model="show" :title="title" show-cancel-button close-on-popstate :before-close="checkData">
			<van-field v-model="form.user" error required label="用户名" :disabled="form.is_edit == 1 ? true : false" />
			<van-field v-model="form.pass" error required label="密码" placeholder="请输入密码" />
		</van-dialog>

	</div>
</template>
<script>
	import schema from 'async-validator'
	import { getList, doEdit, doStatus } from '@/api/user'
	export default {
		data(){
			return {
				config:{
					table:{
						height:0,
					}
				},
				list:[],
				show:false,
				title:'添加用户',
				checked:false,
				form:{
					id:'',
					user:'',
					pass:'',
					is_edit:0
				},
				rules:{
					user:[{required:true,message:'请输入用户名'}],
					pass:[{required:true,message:'请输入密码'}],
				},
				validator:{},
			}
		},
		methods:{
			async fetchData(){
				const { result } = await getList()
				this.list = result
			},
			handleEdit(row){
				this.title = '修改用户信息';
				this.show = true;
				this.form = row;
				this.form.is_edit = 1;
			},
			handleAdd(){
				this.title = '添加用户';
				this.form = this.$options.data().form;
				this.show = true;
			},
			checkData(action, done){
				if( action == 'cancel' ){
					this.form = this.$options.data().form
					return done()
				}
				if( action == 'confirm' ){
					this.validator.validate(this.form).then(async ()=>{
						/*this.$request.user.doEdit(this.form).then(res=>{
							if( res.errorCode != '00000' ){
								return done(false)
							}else{
								this.$toast.success(res.msg)
								this.form = this.$options.data().form
								this.fetchData()
								return done()
							}
						});*/
						let test = {
							id:1,
							user:'hello123问问',
							pass:'world',
							is_edit:1
						}
						const { result } = await doEdit(test)
						this.$toast.success(result.msg)
						this.form = this.$options.data().form
						this.fetchData()
						return done()
					}).catch(({ errors, fields })=>{
						this.$toast.fail(errors[0].message)
					})
				}
			},
			async handleStatus(row){
				let postData = {
					id:row.id,
					status:0
				}
				await doStatus(postData)

				this.$toast.success('删除成功')
				
				this.$refs.user.remove(row)
			},
			init(){
				this.$store.commit('layout/setTitle','用户管理')
				this.$store.commit('layout/setActive','menu')
				this.fetchData()
				this.validator = new schema(this.rules)
			},
			setElementSize(){
				this.config.table.height = window.screen.height - 96 - 52
			}
		},
		created(){
			this.init()
		},
		mounted(){
			this.setElementSize()
			window.onresize = () => {
				return (() => {
					this.setElementSize()
				})()
			}
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>