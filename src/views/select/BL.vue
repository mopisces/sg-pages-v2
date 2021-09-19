<template>
	<div>
		<van-dropdown-menu active-color="#1aad19">
			<van-dropdown-item v-model="selectItem" :options="dropDownOption" />
		</van-dropdown-menu>
		<vxe-table stripe :height="height" :data="tableData">
        	<vxe-table-column title="序号" field="sn" min-width="10"></vxe-table-column>
        	<vxe-table-column title="门幅" field="width"  min-width="30"></vxe-table-column>
        	<vxe-table-column title="生产纸质" min-width="50" field="paperMaterial">
        		<template #default="{ row }">
        			<span v-if=" row.paper "> 
							{{ row.paper }} 
						</span>
						<span v-if=" row.paper_code "> 
							{{ row.paper_code }} 
						</span>
					</span>
        		</template>
        	</vxe-table-column>
        	<vxe-table-column title="楞别">
        		<template #default="{ row }">
					<span> 
						{{ row.flute_type }} 
					</span>
        		</template>
        	</vxe-table-column>
        	<vxe-table-column title="总长" field="total_len" min-width="20"></vxe-table-column>
        </vxe-table>
	</div>
</template>	
<script>
	import { mapGetters } from 'vuex'
	import { getBl } from '@/api/select'
	export default {
		data(){
			return {
				config:{
					dropDownOption:[],
					table:{
						columns : [],
					}
				},
				tableData : []
			}
		},
		methods:{
			async fetchData(){
				const { result } = await getBl({ db_item : this.selectItem || 0 })
				this.tableData = result
			},
			setElementSize(){
				this.$store.commit('layout/setHeight', window.screen.height - 96 - 50)
			}
		},
		created(){
			this.$store.commit('layout/setTitle','备料')
			this.$store.commit('layout/setActive','bl')
			this.fetchData()
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
			...mapGetters({
				height:'layout/height',
				dropDownOption:'layout/dbItem'
			}),
			selectItem:{
				get () {
					return this.$store.state.layout.dropDownIndex
				},
				set (value) {
					this.$store.commit('layout/setDropDownIndex', value)
					this.fetchData()
				}
			}
		},
		watch:{
			
		}
	}
</script>