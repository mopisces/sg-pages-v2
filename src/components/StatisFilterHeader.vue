<template>
	<div>
		<van-notice-bar color="#1989fa" background="#ecf9ff" mode="link" @click="noticeClick(0)" wrapable>
			<div class="van-row van-row--flex van-row--justify-center"  style="text-align:left">
				<div class="van-col van-col--12">
					时间:{{ config.notice.timeTypeText }}
				</div>
				<div class="van-col van-col--12">
					线别:{{ config.notice.lineTypeText }}
				</div>
			</div>
			<div class="van-row van-row--flex van-row--justify-center"  style="text-align:left">
				<div class="van-col van-col--12">
					班组:{{ config.notice.classTypeText }}
				</div>
				<div class="van-col van-col--12">
					图表属性:{{ config.notice.chartPropertiesText }}
				</div>
			</div>
		</van-notice-bar>
		<van-popup v-model="popupShow" position="right" :style="{ height: '100%', width:'100%' }" :close-on-click-overlay="false">
			<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom">
				<div class="van-nav-bar__title van-ellipsis">
					筛选条件
				</div>
			</div>
			<div style="margin-top:46px;"></div>
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
  			时间
			</div>
			<div class="van-row van-row--flex van-row--justify-center"  style="text-align:center">
				<div class="van-col van-col--6" v-for="(item,index) in timeType" :key="index">
					<van-button v-bind:color="item.value == config.select.timeType ? '#de1a1e' :'' " type="primary" size="small" @click="timeTypeClick(item)">{{ item.text }}</van-button>
				</div>
			</div>
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
  			线别
			</div>
			<div class="van-row van-row--flex van-row--justify-center"  style="text-align:center">
				<div class="van-col van-col--6" v-for="(item,index) in lineType" :key="index">
					<van-button v-bind:color="item.value == config.select.lineType ? '#de1a1e' :'' " type="primary" size="small" @click="lineTypeClick(item)" :disabled="!item.isnew" >{{ item.text }}</van-button>
				</div>
			</div>
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
  			班组
			</div>
			<div class="van-row van-row--flex van-row--justify-center"  style="text-align:center">
				<div class="van-col van-col--6" v-for="(item,index) in classType" :key="index">
					<van-button v-bind:color="item.value == config.select.classType ? '#de1a1e' :'' " type="primary" size="small" @click="classTypeClick(item)">{{ item.text }}</van-button>
				</div>
			</div>
			<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;">
	  			图表属性
			</div>
			<div class="van-row van-row--flex van-row--justify-center"  style="text-align:center;margin-top:5px;" v-for="(it,id) in Math.ceil(chartProperties.length/3)" :key="id">
				<div class="van-col van-col--6" v-for="(item,index) in chartProperties.slice(id*3,id*3 + 3)" :key="index">
					<van-button  v-bind:color="item.value == config.select.chartProperties ? '#de1a1e' :'' " type="primary" size="small" @click="chartPropertiesClick(item)">{{ item.text }}</van-button>
				</div>
			</div>
			<div style="padding: 0px 16px;margin-top:30px">
				<van-button type="primary" size="large" @click="closeClick()">确定</van-button>
			</div>
		</van-popup>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex'
	export default {
		props:['show'],
		data(){
			return {
				popupShow:this.show,
				statisMethod:'list',
				insideChartType:[
					{ text: '柱状图',   value: 'sgStatistic' },
				],
				userChartType:[],
				
				config:{
					select:{
						lineType        : null,
						timeType        : null,
						classType       : null,
						chartProperties : null,
					},
					notice:{
						timeTypeText        : '',
						lineTypeText        : '',
						classTypeText       : '',
						chartPropertiesText : ''
					}
				},
				timeType:[
					{ text: '按天', value: 1},
					{ text: '按周', value: 2},
					{ text: '按月', value: 3},
				],
				classType:[
					{ text: '全部', value: 'ALL'},
					{ text: 'A', value: 'A'},
					{ text: 'B', value: 'B'},
					{ text: 'C', value: 'C'},
					{ text: 'D', value: 'D'},
				],
				chartProperties:[
					{ text: '面积', value: 'sumArea'},
                    { text: '米数', value: 'sumLen'},
                    { text: '车速', value: 'avgSpeed'},
                    { text: '损耗', value: 'sumLoss'},
                    { text: '停次', value: 'sumStops'}
				],

			}
		},
		methods:{
			closeClick(){
				/*if( isClose == 1 ){
					this.$emit('selectOption',this.config.select)
					this.popupShow = false
				}else{
					this.popupShow = true
				}*/
				this.$emit('selectOption',this.config.select)
				this.popupShow = false
			},
			noticeClick(){
				this.popupShow = true
				//this.closeClick( isClose );
			},
			timeTypeClick( item ){
				this.config.select.timeType = item.value
				this.config.notice.timeTypeText = item.text
			},
			lineTypeClick( item ){
				this.config.select.lineType = item.value
				this.config.notice.lineTypeText = item.text
			},
			classTypeClick( item ){
				this.config.select.classType = item.value
				this.config.notice.classTypeText = item.text
			},
			chartPropertiesClick( item ){
				this.config.select.chartProperties = item.value
				this.config.notice.chartPropertiesText = item.text
			},
			getNoticeInit(){
				this.config.select.timeType = this.timeType[0].value
				for (var i = 0; i < this.lineType.length; i++) {
					if(this.lineType[i].isnew == 1) this.config.select.lineType  = this.lineType[i].value
						break
				}
				this.config.select.classType = this.classType[0].value
				this.config.select.chartProperties = this.chartProperties[0].value
			},
			init(){
				if( !this.selectable && this.selectable.length > 0 ){
					this.config.select.lineType = 'ALL'
					this.config.notice.lineTypeText = '全部'
				} else {
					this.config.select.lineType =  this.lineType[this.selectable[0]].value
					this.config.notice.lineTypeText = this.lineType[this.selectable[0]].text
				}
				this.config.select.timeType = 1
				this.config.notice.timeTypeText = '按天'

				this.config.select.classType = 'ALL'
				this.config.notice.classTypeText = '全部'

				this.config.select.chartProperties = 'sumArea'
				this.config.notice.chartPropertiesText = '面积'

				this.$emit('selectOption',this.config.select)
			},
		},
		mounted(){
			this.init()
		},
		created(){
			
		},
		computed:{
			...mapGetters({
				lineType:'layout/totalLine',
				selectable:'layout/selectable'
			}),
		},
		watch:{
			show(newV,oldV){
				this.popupShow = newV;
			},
			popupShow(newV,oldV){
				this.$emit("update:show", newV);
			},
		}
	}
</script>
