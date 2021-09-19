<template>
	<div>
		<van-sticky :offset-top="46">
			<van-dropdown-menu>
				<van-dropdown-item v-model="selectItem" :options="dropDownOption" />
			</van-dropdown-menu>
		</van-sticky>
		<van-divider :style="{color: '#1989fa', borderColor: '#1989fa', padding: '0 16px'}" v-if="formData.change_id">
			ID&nbsp;[&nbsp;{{ formData.change_id }}&nbsp;]
		</van-divider>
		<div style="width:100%;height:5rem;text-align:center;padding-top:5rem">
			<van-slider v-model="formData.change_value"  bar-height="5px" :max="10000"/>
		</div>
		<van-cell value="ID对应值">
			<template slot="right-icon">
				<van-stepper v-model="value" integer input-width="42" min="0" max="10000" @change="stepperChange" :disabled-input="true" />
			</template>
		</van-cell>
		<van-row type="flex" justify="space-around">
			<van-col span="10">
				<van-button type="info" style="width:80%;" @click="modifyClick()">修改</van-button>
			</van-col>
			<van-col span="10">
				<van-button type="info" plain  style="width:80%;" @click="clearClick()">清空记录</van-button>
			</van-col>
		</van-row>
	    <div style="margin: 20px 0 80px;">
	        <div style="padding: 2px 20px;font-size: 14px;text-align: center;overflow: auto;white-space: nowrap;" v-for="(item,index) in alterValue[ selectItem ]">
	            <span v-if=" !config.isnew ">
	            	id&nbsp;[&nbsp;
	            	<span style="color: #3598dc;">{{item.id}}</span>
	            	&nbsp;]
	            </span>
	            <span style="color: #3598dc;text-decoration: underline;cursor: pointer;" @click="recover(item)">
	            	{{item.before}}
	            </span>
	            <van-icon name="arrow" size="12" color="#3598dc"/>
	            <van-icon name="arrow" size="12" color="#3598dc"/>
	            <van-icon name="arrow" size="12" color="#3598dc"/>
	            &nbsp;<span style="color: #3598dc;">{{item.after}}</span>
	            [&nbsp;<span style="color: #3598dc;">{{item.time}}</span>&nbsp;]
	        </div>
	    </div>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex'
	import { getValue, changeVal } from '@/api/alter'
	export default {
		data(){
			return {
				config : {
					isnew : false
				},
				formData : {
					change_id:'',
					change_value : 0
				},
				value       : 0,
				recordList  : []
			}
		},
		methods:{
			getConfig(){
				this.config.isnew = this.dropDownOption[ this.selectItem ].isnew
			},
			stepperChange(value,detail){
				this.formData.change_value = Number(value);
				if( Number(value) > 10000 ){
					this.formData.change_value = 10000;
				}
			},
			modifyClick(){
				this.$dialog.confirm({
					message: '确认要修改吗?'
				}).then(()=>{
					this.changeVal();
				}).catch(()=>{
					this.$dialog.close();
				});
			},
			clearClick(){
				this.$dialog.confirm({
					message: '确认要清空记录吗?'
				}).then(()=>{
					this.clearRecord();
				}).catch(()=>{
					this.$dialog.close();
				});
			},
			recover( item ){
				if( !this.config.isnew ){
					this.formData.change_id = item.id;
				}
				this.formData.change_value = Number(item.before);
			},
			async fetchData(){
				const { result } = await getValue({db_item:this.selectItem})

				if( !this.dropDownOption[ this.selectItem ].isnew ){
					this.formData.change_id = result.id
					this.value = result.value
				} else {
					this.value = result
				}
			},
			async changeVal(){
				let postData = Object.assign({db_item:this.selectItem || 0}, this.formData)

				const { result } = await changeVal(postData)

				this.$store.commit('alter/setAlterValue',{ db_item:this.selectItem, record:result })
				
			},
			async clearRecord(){
				await this.$store.commit('alter/setClear',{ db_item:this.selectItem })
				this.$toast.success('清除成功！')
			},
			init(){
				this.getConfig()
				this.fetchData()
			}
		},
		created(){
			this.$store.commit('layout/setTitle','修改')
			this.$store.commit('layout/setActive','menu')
			this.init();
		},
		mounted(){

		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			sliderChange(){
				return this.formData.change_value;
			},
			...mapGetters({
				dropDownOption:'layout/dbItem',
				alterValue:'alter/alterValue'
			}),
			selectItem:{
				get () {
					return this.$store.state.layout.dropDownIndex
				},
				set (value) {
					this.$store.commit('layout/setDropDownIndex', value)
					this.config.isnew = this.dropDownOption[ value ].isnew
				}
			}
		},
		watch:{
			sliderChange( newV, oldV ){
				this.value = Number( newV );
			},
		}
	}
</script>