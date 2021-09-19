<template>
	<div>
		<van-sticky :offset-top="46">
			<van-row>
				<van-col span="12">
					<van-dropdown-menu>
						<van-dropdown-item v-model="selectItem" :options="dropDownOption" />
					</van-dropdown-menu>
				</van-col>
				<van-col span="12">
					<van-button size="large" @click="config.popup.filterShow = true" >筛选</van-button>
				</van-col>
			</van-row>
		</van-sticky>
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading" :immediate-check="false" :finished="config.list.pushLoading.finished"  finished-text="没有更多了" @load="onLoad" :offset="100">
				<div :class="'card-detail van-clearfix ' + (index % 2 ? 'bg-color-odd':'bg-color-even')" v-for="(item,index) in listInfo" :key="index">
					<div  v-show="config.updown">
						<div class="oblique-sign-up" v-if="item.tag === '1'">上刀</div>
				        <div class="oblique-sign-down" v-if="item.tag === '-1'">下刀</div>
					</div>
					<table class="card-info">	
						<tr>
							<td>
								序号:<span class="text-color">{{ item.sn }}</span>
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
								纸质:
								<span class="text-color" v-if="config.isnew">{{ item.paper_code }}</span>
								<span class="text-color" v-else>{{ item.paper }}</span>
							</td>
							<td>
								坑型:<span class="text-color">{{ item.flute_type }}</span>
							</td>
							<td>
								门幅:<span class="text-color">{{ item.width }}</span>
							</td>
						</tr>
						<tr>
							<td>
								修边:<span class="text-color">{{ item.trimming }}</span>
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
								剖1:
								<span class="text-color" v-if="config.isnew">{{ item.slitting }}</span>
								<span class="text-color" v-else>{{ item.slitting1 }}</span>
							</td>
							<td>
								订单数:<span class="text-color">{{ item.order_qty }}</span>
							</td>
						</tr>
						<tr>
							<td>
								压型:<span class="text-color">{{ item.pressing_type }}</span>
							</td>
							<td>
								生产刀数:
								<span class="text-color" v-if="config.updown">{{ item.prod_qty }}</span>
								<span class="text-color" v-else>{{ item.good_qty }}</span>
							</td>
							<td>
								坏品数:<span class="text-color">{{ item.bad_qty }}</span>
							</td>
						</tr>
						<tr>
							<td>
								停车次数:<span class="text-color">{{ item.stops }}</span>
							</td>
							<td colspan="2">
								停车时间:<span class="text-color">{{ item.stop_time }}</span>
							</td>
						</tr>
						<tr>
							<td colspan="3">
								完成时间:<span class="text-color">{{ item.finish_date }}</span>
							</td>
						</tr>
						<tr>
							<td colspan="3">
								压线资料1:
								<span class="text-color" v-if="config.isnew">{{ item.slitting_data }}</span>
								<span class="text-color" v-else>{{ item.slitting_data1 }}</span>
							</td>
						</tr>
					</table>
				</div>
			</van-list>
		</van-pull-refresh>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<van-field label="序号" v-model="formData.sn" placeholder="精确查询" input-align="center"/>
				<van-field label="订单号" v-model="formData.order_number" placeholder="精确查询" input-align="center"/>
				<van-field label="客户名称" v-model="formData.company_name" placeholder="精确查询" input-align="center" v-if=" Math.max(...permissions) <= 1 "/>
				<van-field label="纸质" v-model="formData.paper_code" placeholder="精确查询" input-align="center"/>
				<van-field label="坑型" v-model="formData.flute_type" placeholder="精确查询" input-align="center"/>
				<van-field label="门幅" v-model="formData.width" placeholder="精确查询" input-align="center"/>
				<new-time-picker :dateTime.sync="beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker :dateTime.sync="endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex'
	import PopupFilter from '@/components/PopupFilter.vue'
	import NewTimePicker from '@/components/NewTimePicker.vue'
	import { getWgdd } from '@/api/select'
	export default {
		components:{
			PopupFilter,
			NewTimePicker
		},
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
					popup:{
						filterShow : false,
						timePicker:{
							isFinishLoad : false
						}
					},
					updown : false,
					isnew  : false,
					getInitDate : true,
					switch:{
						checked : false
					}
				},
				formData:{
					sn          : '',
					order_number : '',
					company_name : '',
					paper_code   : '',
					flute_type   : '',
					width       : '',
					cur_page     : 1
				},
				listInfo : [],
			}
		},
		methods:{
			pullOnRefresh(){
				this.listInfo = [];
				this.formData.cur_page = 1;
				this.config.list.pullRefresh.reloading = false;
				this.config.list.pushLoading.finished  = false;
				this.config.list.pushLoading.loading   = true;
				this.fetchData()
			},
			onLoad(){
				this.formData.cur_page++;
				this.fetchData()
			},
			resetClick(){
				this.formData = this.$options.data().formData
			},
			filterClick(){
				this.pullOnRefresh();
			},
			getDropDown(){
				this.config.updown = this.dropDownOption[ this.selectItem ].updown == 0 ? false : true
				this.config.isnew = this.dropDownOption[ this.selectItem ].isnew == 0 ? false : true
			},
			async fetchData(){
				let postData = Object.assign({ db_item: this.selectItem || 0 }, this.formData, {wgdd_begin_time:this.beginDate,wgdd_end_time:this.endDate})
				const { result } = await getWgdd(postData)

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
			init(){
				this.$store.commit('layout/setTitle','完工订单')
				this.$store.commit('layout/setActive','wgdd')
				if( sessionStorage.getItem('sg_wgdd_date') !== null ){
					let storageData = JSON.parse(sessionStorage.getItem('sg_wgdd_date'))
					this.$store.dispatch('layout/setWgddDate',storageData)
				}
			}
		},
		created(){
			this.init()
		},
		mounted(){
			this.getDropDown()
			this.fetchData()
		},
		updated(){
			
		},
		destroyed(){
			if( this.config.switch.checked ){
				sessionStorage.setItem('sg_wgdd_date',JSON.stringify(this.pageConfig));
			}else{
				sessionStorage.removeItem('sg_wgdd_date');
			}
		},
		computed:{
			...mapGetters({
				dropDownOption:'layout/dbItem',
				pageConfig:'layout/wgdd',
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
			},
			beginDate:{
				get () {
					return this.$store.state.layout.wgdd.beginDate
				},
				set ( value ) {
					this.$store.commit('layout/setBeginDate', value)
				}
			},
			endDate:{
				get () {
					return this.$store.state.layout.wgdd.endDate
				},
				set ( value ) {
					this.$store.commit('layout/setEndDate', value)
				}
			}
		},
		watch:{
			
		}
	}
</script>
<style type="text/css">
	@import '~@/assets/style/card.css'
</style>