<template>
	<div>
		<van-field clickable placeholder="请选择日期" input-align="center" :label="label" @click="show = true" v-model="dateTime" readonly>
			<van-icon slot="right-icon" name="arrow"/>
		</van-field>
		<van-popup v-model="show" position="bottom" @click-overlay="clickOverlay" :close-on-click-overlay="false" get-container="body">
			<van-datetime-picker v-model="pickerTime" :min-date="min" :max-date="max" type="date" show-toolbar @cancel="onCancel" @confirm="onConfirm">
			</van-datetime-picker>
		</van-popup>
	</div>
</template>
<script>
	import { dateTimeFormat } from '@/utils';
	export default {
		props:['dateTime','minDate','maxDate','label'],
		data(){
			return {
				pickerTime : new Date(this.dateTime),
				max  : new Date(this.maxDate),
				min  : new Date(this.minDate),
				show : false
			}
		},
		methods:{
			clickOverlay(){
				this.show = false;
			},
			onCancel(){
				this.clickOverlay();
			},
			onConfirm( value ){
				this.$emit("update:dateTime", dateTimeFormat(value,'yyyy-MM-dd'));
				this.clickOverlay();
			}
		},
		created(){

		},
		mounted(){

		},
		computed:{
			
		},
		watch:{
			dateTime(newV,oldV){
				this.pickerTime = new Date(this.dateTime);
			}
		}
	}
</script>
