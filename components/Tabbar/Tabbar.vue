<template>
  <view class="tabbar">
    <view 
      class="tab-item" 
      :class="{ active: currentTab === 0 }"
      @tap="switchTab(0)"
    >
	<img src="@/static/EXCEL.png" alt="" />
      <text>导出Excel</text>
    </view>

    <view 
      class="tab-item" 
      :class="{ active: currentTab === 1 }"
      @tap="switchTab(1)"
    >
      <img src="@/static/clipboard.png" alt="" />
      <text>批量剪切板</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    currentTab: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchTab(index) {
      this.$emit('switchTab',index)
    }
  }
}
</script>

<style scoped>
.tabbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: #ffffff;
  border-top: 1px solid #eaeaea;
}

.tab-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #666666;
}

.tab-item.active {
  color: #000000;
}

.tab-item image {
  width: 24px;
  height: 24px;
}
</style>