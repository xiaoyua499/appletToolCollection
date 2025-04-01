<template>
  <view class="box">
   <checkbox-group @change="checkboxChange" class="content">
      <view v-for="(item ,index) in title" :key="index" class="checkbox-box">
        <checkbox :value="item.name" :checked="item.checked"></checkbox>
        <span v-if="!item.showInput" @click='modifyTitle(item)'>{{item.name}}</span>
        <input type="text" class="titleInput" v-else>
      </view>
      <button class="addTitle" @click="addTitle">
        +
      </button>
    </checkbox-group>
    <view class="rename-box">
      <span>表格名称</span>
      <input type="text" class="rename" placeholder='请输入表格名称(选填)' v-model="setFileName">
      <button class="btn" @click="getFileName">确定</button>
    </view>
    <view class="">
      {{sample}}
    </view>
    <view class="input-box">
      <textarea class="input" maxlength="-1" placeholder='转换内容按上方勾选顺序依次填写,例:紫气东来:jiandan50180+126' v-model="str">
        </textarea>
      <button @click="submitEvent" class="submit">提交</button>
    </view>
  </view>
</template>

<script setup>
  import {
    nextTick,
    reactive,
    ref
  } from 'vue';

  import {
    createExecl
  }
  from '@/plugin/createExecl.js';
  import {
    getUserJson
  } from '@/plugin/getUserJson.js'
  import Tabbar from '@/components/Tabbar/Tabbar.vue'
  const checked = ref(true);
  const str = ref('')
  const title = reactive([{
      name: '用户名',
      checked: false,
      showInput: false
    },
    {
      name: '账号',
      checked: false,
      showInput: false
    },
    {
      name: '金额',
      checked: false,
      showInput: false
    },
    {
      name: '日期',
      checked: false,
      showInput: false
    },
  ])
  //表格标题
  let table = []
  //金额数组
  let amountArr = []
  //表格底部
  let tableFoot = [{}]
  let newUserList = []
  let setFileName = ref('')
  let fileName = ''
  let sample = ref('')
  //监听checkbox的改变
  const checkboxChange = (e) => {
    // console.log('checkbox发生change事件，checked值为true的为：', e.detail.value)
    table = e.detail.value
    sample.value = table.join('+')
    // console.log(sample.value);
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
    if (fileName === '') {
      //默认文件名
      fileName = date + '_' + newUserList[0]['用户名'] + '_' + tableFoot[0]['账号'] + '_' + millisecond
    }
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
    tableFoot[0]['金额'] = ("总金额：" + totalAmount.toFixed(2))
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
  //获取文件名称
  const getFileName = () => {
    fileName = setFileName.value
  }
  //添加自定义标签
  const addTitle = () => {
    title.push({
      name: '淘宝',
      checked: false,
      showInput: false
    })
  }
  let timer = null
  //双击修改标签名
  const modifyTitle = (item) => {
    if (timer) {
      clearTimeout(timer); // 清除第一次点击的计时器
      timer = null;
      item.showInput = true
      console.log('Double click!');
    } else {
      timer = setTimeout(() => {
        console.log('Single click!');
        timer = null;
      }, 300); // 设置计时器等待第二次点击
    }
  }
</script>

<style lang="less" scoped>
  .box {
    padding: 10px;

    .content {
      display: flex;
      flex-wrap: wrap;
      align-content: center;
      justify-content: flex-start;
      min-height: 40px;

      .checkbox-box {
        display: flex;
        align-items: center;
        width: 80px;

        .titleInput {
          width: 30px;
          border: 1px solid #ccc;
        }
      }

      .addTitle {
        padding: 0;
        margin: 0;
        width: 30px;
        height: 30px;
        background-color: #fff;
        font-size: 25px;
        text-align: center;
        line-height: 30px;
        border-radius: 50%;
        border: 1px solid #000;
      }
    }

    .rename-box {
      margin: 10px 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .rename {
        margin: 0 5px;
        padding: 2px;
        height: 30px;
        border: 1px solid #ccc;
      }

      .btn {
        margin: 0;
        // width: 40px;
        height: 30px;
        color: #fff;
        font-size: 16px;
        text-align: center;
        line-height: 30px;
        background-color: #07c160;
      }
    }


    .input-box {
      .input {
        padding: 5px;
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
  }
</style>