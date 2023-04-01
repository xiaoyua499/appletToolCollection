<template>
  <checkbox-group @change="checkboxChange">
    <view class="content" v-for="(item ,index) in title" :key="index">
      <checkbox :value="item.value" :checked="item.checked">{{item.name}}</checkbox>
    </view>
  </checkbox-group>
  <view class="input-box">
    <textarea class="input" maxlength="-1" placeholder='转换内容' v-model="str"></textarea>
    <button @click="submitEvent" class="submit">提交</button>
  </view>
</template>

<script setup>
  import {
    ref
  } from 'vue';
  const checked = ref(true);
  const str = ref('')
  const title = [{
      name: ' 日期',
      value: 'day',
      checked: false
    },
    {
      name: ' 账号',
      value: 'id',
      checked: true
    },
    {
      name: ' 金额',
      value: 'amount',
      checked: true
    },
  ]

  const userList = []
  const checkboxChange = (e) => {
    console.log('checkbox发生change事件，checked值为true的为：', e.detail.value)

    const items = title
    const values = e.detail.value
    for (let i = 0, lenI = title.length; i < lenI; ++i) {
      items[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value === values[j]) {
          items[i].checked = true
          break
        }
      }
    }
  }
  const submitEvent = () => {
    // console.log(str.value);
    const newStr = str.value.replace(/[ ]|[\r\n]/g, "").split(';')
    // console.log(newStr);
    for (let i = 0; i < newStr.length; i++) {
      const userInfo = {
        name: '',
        quantity: '',
        grossAmount: '',
        id: '',
        amount: ''
      }
      const list = newStr[i].split(':')
      userInfo.name = list[0]
      const newList = list[1].split('+')
      userInfo.id = newList[0]
      userInfo.amount = newList[1]
      userList[i] = userInfo
    }
    console.log(userList);
    str.value = ''

  }
</script>

<style lang="less" scoped>
  .input-box {
    .input {
      width: auto;
      min-height: 50px;
      border: 1px solid #ccc;
      background-color: #fff;
      overflow: scroll;
    }

    .submit {
      color: #fff;
      background-color: #07c160;
    }
  }
</style>