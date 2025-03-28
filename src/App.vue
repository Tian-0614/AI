<template>
	<div id="app_micro_main">
		<!-- <t-xiaoxin></t-xiaoxin> -->
		<t-xiaoxin2></t-xiaoxin2>
		<!-- <markdown></markdown> -->
	</div>
</template>
<script>
import tXiaoxin from '@/components/t-xiaoxin.vue'
import tXiaoxin2 from '@/components/t-xiaoxin-v2.vue'
import markdown from '@/components/markdown.vue'
export default {
	name: 'AppMicroMain',
	components:{tXiaoxin,tXiaoxin2,markdown},
	data() {
		return {

		}
	},	
}
</script>
<style lang="scss">

body{
	margin: 0;
	padding: 0;
}
#app_micro_main{
	width: 100vw;
	height: 100vh;
	box-sizing: border-box;
}

</style>
 