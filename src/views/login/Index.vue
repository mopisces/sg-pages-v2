<template>
	<div class="login-container">
		<div class="login-header">
			<van-image :src="logo" width="80%" height="80%"/>
		</div>
		<div class="login-content">
			<div class="login-factory">
				<span v-if="available">{{ factoryName }}</span>
				<span v-else>请联系服务商获取厂家密钥</span>
			</div>
			<div class="login-from">
				<div class="form-content">
					<div>
						<van-field v-model="formData.userName" label="用户名" placeholder="请输入登录名" required/>
						<van-field v-model="formData.userPass" type="password" label="密码" placeholder="请输入密码" required></van-field>
					</div>
					<div  class="login-2rem">
						<van-button type="primary" size="normal" block @click="onLogin" :disabled="!available">登录</van-button>
					</div>
					<div  class="login-2rem">
						<van-divider dashed>
							<a href="http://www.beian.miit.gov.cn"> 浙ICP备16024747号-1</a>
						</van-divider>
					</div>
				</div>
			</div>
		</div>
		<div class="login-foot">
			<van-divider dashed>
				<a href="http://www.jpeng.com.cn/"> Copyright © {{ year }} 佳鹏电脑.All rights reserved. </a>
			</van-divider>
		</div>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex'
	import { setFactoryName, getFactoryName } from '@/utils/factory'
	import schema from 'async-validator'
	export default {
		data(){
			return {
				logo: require( '../../assets/image/jplogo.png'),
				formData:{
					userName:null,
					userPass:null
				},
				year:null,
				rules:{
					userName : [
						{ type: 'string', required: true, message: '请输入用户名'}
					],
					userPass : [
						{ type: 'string', required: true, message: '请输入密码'},
					]
				},
				available:true,
				validator:null,
				/*redirect:undefined*/
			}
		},
		methods:{
			onLogin(){
				this.validator.validate(this.formData).then(()=>{
					this.login( this.formData )
				}).catch(({ errors, fields })=>{
					this.$toast.fail(errors[0].message)
				})
			},
			async login(){
				this.$store
					.dispatch("user/login", {user_name:this.formData.userName,user_pass:this.formData.userPass})
					.then(()=>{
						this.$router.push("/sg/monitor")
					})
			},
			getNowYear(){
				let dateYear = new Date()
				this.year = dateYear.getFullYear()
			},
			async init(){
				this.getNowYear()
				if( this.validator == null ) this.validator = new schema(this.rules)
				try{
					if( !this.$route.query.factoryName ){
						this.available = false
						return 
					}
					let factoryName
					factoryName = this.$route.query.factoryName
					await this.$store.dispatch("factory/setFactoryName",factoryName)
					await this.$store.dispatch("layout/getSelectConfig")
				}catch( err ){
					this.available = false
				}
			}
		},
		created(){
			this.init()
		},
		mounted(){

		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			...mapGetters({
				factoryName:'layout/factoryName',
			}),
		},
		/*watch:{
			$route:{
				handler(router){
					this.redirect = (router.query && router.query.redirect) || "/"
				},
				immediate: true,
			}
		}*/
	}
</script>