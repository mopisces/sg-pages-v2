<template>
	<div class="nofound-container">
		<div class="nofound-image">
			<van-image :src="logo" width="80%" height="60%"/>
		</div>
		<div class="nofound-title">404 很抱歉，您查看的页面找不到了！</div>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				logo:require('../assets/image/404.png'),
			}
		},
		methods:{

		},
		created(){
			
		},
		mounted(){

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
<style>
	/* @import '~@/assets/style/nofound.css' */

	.nofound-image{
		height:60%;
		width:100%;
	}

	.nofound-title {
		height:40%;
		width:100%;
	}

	.nofound-container{
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
	    bottom: 0;
	    display: -webkit-flex;
		display: flex;
		flex-direction: column;
		justify-content:center;
		text-align:center;
		background: #4284DB;  
		background: -webkit-linear-gradient(left, #29EAC4, #4284DB);
		background: -o-linear-gradient(left, #29EAC4, #4284DB);
		background: linear-gradient(to right, #29EAC4, #4284DB);  
	}
</style>
