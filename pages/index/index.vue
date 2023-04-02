<template>
  <checkbox-group @change="checkboxChange">
    <view class="content" v-for="(item ,index) in title" :key="index">
      <checkbox :value="item.name" :checked="item.checked">{{item.name}}</checkbox>
    </view>
  </checkbox-group>
  <view class="input-box">
    <textarea class="input" maxlength="-1" placeholder='转换内容按上方勾选顺序依次填写,例:紫气东来:jiandan50180+126'
      v-model="str"></textarea>
    <button @click="submitEvent" class="submit">提交</button>
  </view>
</template>

<script setup>
  import {
    ref
  } from 'vue';
  import {
    read,
    utils,
    writeFileXLSX,
    write
  } from 'xlsx';
  const checked = ref(true);
  const str = ref('')
  const title = [{
      name: '用户名',
      value: 'day',
      checked: false
    },
    {
      name: ' 账号',
      value: 'id',
      checked: false
    },
    {
      name: ' 金额',
      value: 'amount',
      checked: false
    },
  ]

  const userList = []
  let table = []
  let amountArr = []
  let tableFoot = []
  //监听checkbox的改变
  const checkboxChange = (e) => {
    // console.log(e);
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
  //将全角字符转换为半角字符
  function ToCDB(str) {
    var tmp = "";
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) == 12288) {
        tmp += String.fromCharCode(str.charCodeAt(i) - 12256);
        continue;
      }
      if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
        tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
      } else {
        tmp += String.fromCharCode(str.charCodeAt(i));
      }
    }
    return tmp
  }
  //点击提交后处理数据
  const submitEvent = () => {
    const newStr = ToCDB(str.value)
    // console.log(newStr);
    const removeSpacesArr = newStr.replace(/[ ]|[\r\n]/g, ";").split(';;')
    // console.log(removeSpacesArr);
    for (let i = 0; i < removeSpacesArr.length; i++) {
      const userInfo = []
      const list = removeSpacesArr[i].replace(/[:]|[;]/g, "+")
      // console.log(list);
      const newList = list.replace(/[+]+/g, "+").split('+')
      const amount = newList[newList.length - 1]
      amountArr.push(Number(amount))
      userList.push(newList)
    }
    console.log(amountArr);
    calculation(amountArr)
    const {
      date,
      millisecond
    } = getDate()
    console.log(date,
      millisecond);
    const fileName = date + '_' + userList[0][0] + '_' + tableFoot[0] + '_' + millisecond
    console.log(fileName);
    exportFile(tableFoot, table, userList, fileName)
    str.value = ''
  }
  //计算用户提交的数据
  const calculation = (amountArr) => {
    let totalAmount = 0
    for (let i = amountArr.length - 1; i >= 0; i--) {
      totalAmount += amountArr[i]
    }
    const orderQuantity = amountArr.length
    // console.log(amountArr.length);
    // console.log(totalAmount);
    tableFoot.push('共计：' + orderQuantity + '单', totalAmount)
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
  //生成Execl文件
  const exportFile = (tableFoot, table, data, fileName) => {
    data.unshift(table)
    data.push(tableFoot)
    const ws = utils.aoa_to_sheet(data)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Sheet1')
    var fileData = write(wb, {
      bookType: "xlsx",
      type: 'base64'
    });

    let filePath = `${wx.env.USER_DATA_PATH}/${fileName}.xlsx`
    // 写文件
    const fs = wx.getFileSystemManager()
    fs.writeFile({
      filePath: filePath,
      data: fileData,
      encoding: 'base64',
      success(res) {
        console.log(res)
        const sysInfo = wx.getSystemInfoSync()
        // 导出
        if (sysInfo.platform.toLowerCase().indexOf('windows') >= 0) {
          // 电脑PC端导出
          wx.saveFileToDisk({
            filePath: filePath,
            success(res) {
              console.log(res)
            },
            fail(res) {
              console.error(res)
              util.tips("导出失败")
            }
          })
        } else {
          // 手机端导出
          // 打开文档
          wx.openDocument({
            filePath: filePath,
            showMenu: true,
            success: function(res) {
              console.log('打开文档成功')
            },
            fail: console.error
          })
        }

      },
      fail(res) {
        console.error(res)
        if (res.errMsg.indexOf('locked')) {
          wx.showModal({
            title: '提示',
            content: '文档已打开，请先关闭',
          })
        }

      }
    })
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