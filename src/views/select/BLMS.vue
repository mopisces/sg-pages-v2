<template>
	<div>
		<van-dropdown-menu>
			<van-dropdown-item v-model="selectItem" :options="dropDownOption" />
			<van-dropdown-item v-model="formData.active" :options="config.dropDown.activeOption" />
		</van-dropdown-menu>
		<vxe-table ref="blms" stripe border :height="height" :data="tableData">
			<vxe-table-column title="糊机备纸" field="糊机备纸" min-width="130"></vxe-table-column>
			<vxe-table-column title="SF1芯纸" field="SF1芯纸" min-width="130"></vxe-table-column>
			<vxe-table-column title="SF1面纸" field="SF1面纸" min-width="130"></vxe-table-column>
			<vxe-table-column title="SF2芯纸" field="SF2芯纸" min-width="130"></vxe-table-column>
			<vxe-table-column title="SF2面纸" field="SF2面纸" min-width="130"></vxe-table-column>
			<vxe-table-column title="SF3芯纸" field="SF3芯纸" min-width="130"></vxe-table-column>
			<vxe-table-column title="SF3面纸" field="SF3面纸" min-width="130"></vxe-table-column>
		</vxe-table>
	</div>
</template>
<script>
	import { mapGetters } from 'vuex'
	import { DropdownMenu, DropdownItem } from 'vant'
	import { getBlMS } from '@/api/select'
	export default {
		components:{
			[DropdownMenu.name]: DropdownMenu,
			[DropdownItem.name]: DropdownItem,
		},
		data(){
			return {
				config:{
					dropDown:{
						indexOption  : [],
						activeOption : [
							{
								text  : '按长度',
								value : 0
							},
							{
								text  : '按重量',
								value : 1
							}
						]
					},
					table:{
						columns:[],
						height : 0
					},
					isnew : false
				},
				formData:{
					index  : 0,
					active : 0,
				},
				tableData : []
			}
		},
		methods:{
			getConfig(){
				if( this.weight == 0 ){
					this.config.dropDown.activeOption = [
						{
							text  : '按长度',
							value : 0
						}
					];
				}else{
					this.config.dropDown.activeOption = [
						{
							text  : '按长度',
							value : 0
						},
						{
							text  : '按重量',
							value : 1
						}
					];
				}
				this.fetchData()
			},
			async fetchData(){
				const { result } = await getBlMS({ db_item :this.selectItem || 0, blms_active_type:this.formData.active })
				this.tableData = result
			},
			selectItemChange( selectItem ){
				this.config.isnew = this.config.dropDown.indexOption[selectItem].isnew == 0 ? false : true
				if( this.config.isnew ){
					this.config.dropDown.activeOption = [
						{
							text  : '按长度',
							value : 0
						},
						{
							text  : '按重量',
							value : 1
						}
					];
				}else{
					this.config.dropDown.activeOption = [
						{
							text  : '按长度',
							value : 0
						}
					];
				}
				if( this.formData.active == 0 ){
					this.fetchData()
				} else {
					this.formData.active = 0
				}
			},
			setElementSize(){
				this.$store.commit('layout/setHeight', window.screen.height - 96 - 50)
			}
		},
		created(){
			this.$store.commit('layout/setTitle','备料查看')
			this.$store.commit('layout/setActive','blms')
			this.getConfig()
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
			activeChange(){
				return this.formData.active
			},
			...mapGetters({
				height:'layout/height',
				dropDownOption:'layout/dbItem',
				weight:'layout/weight'
			}),
			selectItem:{
				get () {
					return this.$store.state.layout.dropDownIndex
				},
				set (value) {
					this.$store.commit('layout/setDropDownIndex', 	value)
					this.fetchData()
				}
			}
		},
		watch:{
			activeChange( newV, oldV ){
				this.fetchData()
			}
		}
	}
</script>