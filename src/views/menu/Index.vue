<template>
	<div>
		<van-grid square :gutter="10" :column-num="3">
			<!-- <van-grid-item text="修改" to="/sg/alter" v-if="showAlter">
				<van-icon slot="icon" name="setting-o" size="35" color="#1a991d"/>
			</van-grid-item>
			<van-grid-item text="用户管理" to="/sg/user">
				<van-icon slot="icon" name="friends-o" size="35" color="#1a991d"/>
			</van-grid-item>
			<van-grid-item text="生产报表" to="/sg/statis">
				<van-icon slot="icon" name="chart-trending-o" size="35" color="#1a991d"/>
			</van-grid-item> -->
			<template v-for="(item,index) in routes">
				<template v-if="item.children && item.children.length">
					<template v-for="(route,idx) in item.children">
						<!-- <van-tabbar-item :name="route.name" :to=" item.path + '/' +  route.path " :index="idx" v-if="route.icon">
							<van-icon slot="icon" :name="route.icon"/>
							{{ route.meta.title }}
						</van-tabbar-item> -->
						<van-grid-item :text="route.meta.title" :to=" item.path + '/' +  route.path " v-if="route.menuIcon">
							<van-icon slot="icon" :name="route.menuIcon" size="35" color="#1a991d"/>
						</van-grid-item>
					</template>
				</template>
			</template>
		</van-grid>
	</div>
</template>
<script>
	import { getUserInfo } from '@/utils'
	import { mapGetters } from 'vuex'
	export default {
		data(){
			return {
				showAlter:false
			}
		},
		methods:{

		},
		created(){
			this.$store.commit('layout/setTitle','菜单')
			this.$store.commit('layout/setActive','menu')
		},
		mounted(){
			try{
				if(getUserInfo().root == 0) this.showAlter = true
			}catch(err){
				this.showAlter = false
			}
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			...mapGetters({
				routes:'routes/routes'
			}),
		},
		watch:{

		}
	}
</script>