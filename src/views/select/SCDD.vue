<template>
	<div>
		<van-sticky :offset-top="46">
			<van-dropdown-menu>
				<van-dropdown-item v-model="selectItem" :options="dropDownOption" />
				<van-dropdown-item title="筛选" ref="filter">
					<van-field label="序号" v-model="formData.sn" placeholder="精确查询" input-align="center"/>
					<van-field label="订单号" v-model="formData.order_number" placeholder="精确查询" input-align="center"/>
					<van-field label="客户名称" v-model="formData.company_name" placeholder="精确查询" input-align="center" v-if=" Math.max(...permissions) <= 1 "/>
					<van-field label="纸质" v-model="formData.paper_code" placeholder="精确查询" input-align="center"/>
					<van-field label="坑型" v-model="formData.flute_type" placeholder="精确查询" input-align="center"/>
					<van-field label="门幅" v-model="formData.width" placeholder="精确查询" input-align="center"/>
					<div style="padding: 5px 16px;">
						<van-row gutter="20" type="flex" justify="center">
							<van-col span="10">
								<van-button type="danger" block round @click="resetClick">重置</van-button>
							</van-col>
							<van-col span="10">
								<van-button type="primary" block round @click="filterClick">筛选</van-button>
							</van-col>
						</van-row>
					</div>
				</van-dropdown-item>
			</van-dropdown-menu>
		</van-sticky>
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading"  :immediate-check="false" :finished="config.list.pushLoading.finished"  finished-text="没有更多了" @load="onLoad" :offset="100" >
				<div :class="'card-detail van-clearfix ' + (index % 2 ? 'bg-color-odd':'bg-color-even')" v-for="(item,index) in listInfo" :key="index">
					<div  v-show="config.updown">
						<div class="oblique-sign-up" v-if="item.tag === '1'">上刀</div>
				        <div class="oblique-sign-down" v-if="item.tag === '-1'">下刀</div>
					</div>
					<table class="card-info">
						<tr>
							<td>
								序号:<span class="text-color">{{ item.order_number }}</span>
							</td>
							<td colspan="2">
								订单号:<span class="text-color">{{ item.order_number }}</span>
							</td>
						</tr>
						<tr>
							<td colspan="3">
								客户名称:<span class="text-color">{{ item.company_name }}</span>
							</td>
						</tr>
						<tr>
							<td>
								订单数:<span class="text-color">{{ item.quantity }}</span>
							</td>
							<td>
								门幅:<span class="text-color">{{ item.width }}</span>
							</td>
							<td>
								纸质:
								<span class="text-color" v-if=" config.isnew ">{{ item.paper_code }}</span>
								<span class="text-color" v-else>{{ item.paper }}</span>
							</td>
						</tr>
						<tr>
							<td>
								坑型:<span class="text-color">{{ item.flute_type }}</span>
							</td>
							<td>
								纸宽:<span class="text-color">{{ item.paper_w }}</span>
							</td>
							<td>
								纸长:<span class="text-color">{{ item.paper_len }}</span>
							</td>
						</tr>
						<tr>
							<td>
								切刀数:<span class="text-color">{{ item.cutting_qty }}</span>
							</td>
							<td>
								总长:<span class="text-color">{{ item.total_len }}</span>
							</td>
							<td>
								剖1:
								<span class="text-color" v-if="config.isnew">{{ item.slitting }}</span>
								<span class="text-color" v-else>{{ item.slitting1 }}</span>
							</td>
						</tr>
						<tr>
							<td>
								压型:<span class="text-color">{{ item.pressing_type }}</span>
							</td>
							<td>
								捆数:
								<span class="text-color" v-if="config.isnew">{{ item.bundling_qty }}</span>
								<span class="text-color" v-else>{{ item.bundle_qty }}</span>
							</td>
							<td>
								修边:<span class="text-color">{{ item.trimming }}</span>
							</td>
						</tr>
						<tr>
							<td colspan="3">
								压线资料1:
								<span class="text-color" v-if=" config.isnew ">{{ item.slitting_data }}</span>
								<span class="text-color" v-else>{{ item.slitting_data1 }}</span>
							</td>
						</tr>
						<tr>
							<td colspan="3">
								预计完成时间:<span class="text-color">{{ item.pre_finishtime }}</span>
							</td>
						</tr>
					</table>
				</div>
			</van-list>
		</van-pull-refresh>
	</div>
</template>
<script>
	import { getUserInfo } from '@/utils'
	import { mapGetters } from 'vuex'
	import { getScdd } from '@/api/select'
	export default {
		data(){
			return {
				config : {
					list:{
						pullRefresh:{
							reloading : false,
						},
						pushLoading:{
							finished : false,
							loading  : false
						}
					},
					dropDownOption:[],
					updown : false,
					isnew  : false
				},
				formData:{
					sn     : '',
					order_number : '',
					company_name : '',
					paper_code   : '',
					flute_type   : '',
					width       : '',
					cur_page     : 1
				},
				listInfo : [],
				root:null
			}
		},
		methods:{
			pullOnRefresh(){
				this.listInfo = []
				this.formData.cur_page = 1
				this.config.list.pullRefresh.reloading = false
				this.config.list.pushLoading.finished  = false
				this.config.list.pushLoading.loading   = true;
				this.fetchData()
			},
			onLoad(){
				this.formData.cur_page++
				this.fetchData()
			},
			resetClick(){
				this.formData = this.$options.data().formData
			},
			filterClick(){
				this.$refs.filter.toggle()
				this.pullOnRefresh()
			},
			async fetchData(){
				let postData = Object.assign({ db_item: this.selectItem || 0 },this.formData)
				const { result } = await getScdd(postData)

				let maxLength = 3
				if( this.config.updown ){
					maxLength = 6
				}
				if( result && result.length < maxLength ){
					this.config.list.pushLoading.finished = true
				}
				this.config.list.pushLoading.loading = false

				result.forEach((item,index)=>{
					this.listInfo.push(item)
				})
			},
			getDropDown(){
				this.config.updown = this.dropDownOption[ this.selectItem ].updown == 0 ? false : true
				this.config.isnew = this.dropDownOption[ this.selectItem ].isnew == 0 ? false : true
				this.fetchData()
			},
			init(){
				this.$store.commit('layout/setTitle','生产订单')
				this.$store.commit('layout/setActive','scdd')
				console.log()
			}
		},
		created(){
			this.init()
		},
		mounted(){
			this.getDropDown()
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			...mapGetters({
				dropDownOption:'layout/dbItem',
				permissions:'user/permissions'
			}),
			selectItem:{
				get () {
					return this.$store.state.layout.dropDownIndex
				},
				set (value) {
					this.$store.commit('layout/setDropDownIndex', value)
					this.config.updown = this.dropDownOption[ value ].updown == 0 ? false : true
					this.config.isnew  = this.dropDownOption[ value ].isnew == 0 ? false : true
					this.pullOnRefresh()
				}
			}
		},
		watch:{}
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css'
</style>