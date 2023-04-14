<template>
  <checkbox-group @change="checkboxChange">
    <view class="content" v-for="(item ,index) in title" :key="index">
      <checkbox :value="item.name" :checked="item.checked">{{item.name}}</checkbox>
    </view>
  </checkbox-group>
  <view class="input-box">
    <textarea class="input" maxlength="-1" placeholder='转换内容按上方勾选顺序依次填写,例:紫气东来:jiandan50180+126' v-model="str">
      </textarea>
    <button @click="submitEvent" class="submit">提交</button>
  </view>
</template>

<script setup>
  import {
    ref
  } from 'vue';

  import {
    createExecl
  }
  from '@/plugin/createExecl.js';
  import {
    getUserJson
  } from '@/plugin/getUserJson.js'
  const checked = ref(true);
  const str = ref('')
  const title = [{
      name: '用户名',
      value: 'name',
      checked: false
    },
    {
      name: '账号',
      value: 'id',
      checked: false
    },
    {
      name: '金额',
      value: 'amount',
      checked: false
    },
  ]
  //表格标题
  let table = []
  //金额数组
  let amountArr = []
  //表格底部
  let tableFoot = [{}]
  let newUserList = []

  //监听checkbox的改变
  const checkboxChange = (e) => {
    // console.log('checkbox发生change事件，checked值为true的为：', e.detail.value)
    table = e.detail.value
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

  //点击提交后处理数据
  const submitEvent = () => {
    //获取用户数据列表
    const userList = getUserJson(table, tableFoot, str.value)
    const {
      date, //当前日期
      millisecond
    } = getDate()
    for (let i = 0; i < userList.length; i++) {
      newUserList.push(userList[i].userInfo)
      // console.log(newUserList);
      amountArr.push(userList[i].userInfo['金额'])
    }
    //获取总金额
    const totalAmount = calculation(amountArr)
    newUserList = [...newUserList, ...tableFoot]
    // console.log(newUserList);
    const fileName = date + '_' + newUserList[0]['用户名'] + '_' + tableFoot[0]['账号'] + '_' + millisecond
    //生成Execl文件
    createExecl(newUserList, fileName)
    str.value = ''
  }
  //计算用户提交的数据
  const calculation = (amountArr) => {
    //总金额
    let totalAmount = 0
    for (let i = amountArr.length - 1; i >= 0; i--) {
      totalAmount += parseInt(amountArr[i])
    }
    const orderQuantity = amountArr.length
    tableFoot[0]['账号'] = ('共计：' + orderQuantity + '单')
    tableFoot[0]['金额'] = ("金额：" + totalAmount.toFixed(2))
    return totalAmount
  }
  //获取当前时间
  const getDate = () => {
    var myDate = new Date();
    const month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月) 所以获取当前月份是 myDate.getMonth()+1;   
    const day = myDate.getDate(); //获取当前日(1-31)  
    const millisecond = myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
    const date = month + '月' + day + '日'
    return {
      date,
      millisecond
    }
  }
</script>

<style lang="less" scoped>
  .content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

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