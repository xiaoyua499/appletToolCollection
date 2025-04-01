<template>
  <view class="box">
	  <exportToExcel v-show="currentTab===0"></exportToExcel>
	  <clipboard v-show="currentTab===1"></clipboard>
	<Tabbar :currentTab="currentTab" @switchTab="switchTab"></Tabbar>
  </view>
</template>

<script setup>
  import { ref } from 'vue';
import Tabbar from '@/components/Tabbar/Tabbar.vue'
  import exportToExcel from '@/pages/exportToExcel/exportToExcel'
  import clipboard from "@/pages/clipboard/clipboard.vue"
  let currentTab = ref(0)
  const switchTab = (index)=>{
	  currentTab.value=index
  }
</script>

<style lang="less" scoped>
</style>