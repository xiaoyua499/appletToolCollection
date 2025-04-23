<template>
  <view class="clipboardBox">
    <view class="clipboardTitle">文本批量导入剪切板工具</view>
    <view class="checkboxLayout">
      <view style="padding: 0  0 25px 0;border-bottom: 1px solid #F3F4F6;">
        <wd-checkbox
          v-model="isSerialNumber"
          checked-color="#4CAF50"
          shape="square"
          size="large"
          @change="onChange"
        >去除序号</wd-checkbox>
      </view>
    </view>

    <view class="input-box">
      <span class="input-title">输入文本</span>
      <textarea
        ref="textareaRef"
        :focus="isFocus"
        class="input"
        maxlength="-1"
        placeholder="转换剪切板模版:1. 璟和小娇夫，村医认证开启新篇章！2. 女耕男织，璟和夫妇种田文来袭！"
        v-model="str"
      ></textarea>
      <button class="submit" :class="showProgress ? 'submitProgress' : ''" @click="submitEvent">提交</button>
    </view>
    <!-- 进度条显示区域 v-if="showProgress" -->
    <view v-if="showProgress" class="progress-container">
      <!-- <progress :percent="progressValue" activeColor="#10AEFF"></progress> -->
      <view class="progress-text">
        <span>当前进度</span>
        <span>{{ progressText }}</span>
      </view>
      <wd-progress class="progress" color="#4CAF50" :percentage="progressValue" hide-text></wd-progress>
    </view>
    <view
      class="tip-text"
      :class="showProgress ? 'tipTextProgress' : ''"
    >输入文本后点击提交按钮等待进度条完成后即可批量复制进剪切板！复制过程中请勿动手机屏幕！！！</view>
  </view>
</template>

<script setup>
import {
  nextTick,
  reactive,
  ref
} from 'vue';
const str = ref('');
let clipboardTextArr = reactive([]);
const isFocus = ref(false)
const textareaRef = ref(null); // 绑定textarea的ref
// 进度条相关的状态
const showProgress = ref(false);
const progressValue = ref(0);
const progressText = ref('');

const isSerialNumber = ref(false)
const submitEvent = () => {
  console.log(str.value);
  isFocus.value = false
  setTimeout(() => {
    isFocus.value = true
  }, 100)
  processText(str.value);

};
//处理文本
const processText = (text) => {
  //是否选择去除序号
  if (isSerialNumber.value) {
    clipboardTextArr = str.value.split('\n')
  } else {
    // 使用正则表达式将文本按序号进行分割
    let splitCommentsArray = text.split(/(?=\d{1,2}\.\s)/);
    // 去除每条评论的序号、结尾标点符号、换行符
    let cleanedCommentsArray = splitCommentsArray.map(comment =>
      comment.replace(/^\d{1,2}\.\s/, '') // 去除序号
        .replace(/[！。~\n]+$/, '') // 去除结尾标点符号和换行符
        .trim() // 去除前后多余空格
    );
    // 过滤掉单个的数字和空白项
    clipboardTextArr = cleanedCommentsArray.filter(comment => isNaN(comment) && comment.trim() !== '');
  }
  str.value = '';
  // 初始化进度条状态
  showProgress.value = true;
  progressValue.value = 0;
  progressText.value = `0/${clipboardTextArr.length}`;
  // 顺序复制到剪切板，并处理完成后关闭loading
  processClipboardItems().then(() => {
    // 所有复制完成后隐藏进度条
    showProgress.value = false;
  }).catch(() => {
    // 所有复制完成后隐藏进度条
    showProgress.value = false;
  });
};

const processClipboardItems = async () => {
  const totalItems = clipboardTextArr.length;

  for (let i = 0; i < totalItems; i++) {
    await setClioboard(clipboardTextArr[i]);

    // 更新进度条
    progressValue.value = ((i + 1) / totalItems) * 100; // 更新进度值
    console.log(progressValue.value);
    progressText.value = `${i + 1}/${totalItems}`; // 更新进度文本
  }
};

const setClioboard = (text) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      wx.setClipboardData({
        data: text,
        success(res) {
          resolve(); // 复制成功，继续下一条
        },
        fail(err) {
          reject(err); // 处理失败的情况
        }
      });
    }, 300); // 每次延迟500ms
  });
};
const onChange = ({
  value
}) => {
  isSerialNumber.value = value
}
</script>
<style lang="scss">
.clipboardBox {
  padding: 5px 16px;

  .clipboardTitle {
    padding: 16px 0;
    // padding-bottom: 5px;
    height: 44px;
    text-align: center;
    font-size: 18px;
    font-weight: 400;
    line-height: 42px;
    // border-bottom: 1px solid #ccc;
  }
  .input-box {
    .input-title {
      display: block;
      margin-bottom: 10px;
      color: #333333;
      font-size: 16px;
      font-weight: 400;
      line-height: 19px;
    }
    .input {
      padding: 10px;
      width: auto;
      min-height: 50px;
      height: 200px;
      border: 1px solid #f3f4f6;
      border-radius: 8px;
      background-color: #f9fafb;
      overflow: scroll;
    }
    .input::placeholder {
      color: #9ca3af;
      font-size: 16px;
      font-weight: 400;
      line-height: 19px; /* 你想要的颜色 */
    }

    .submit {
      margin: 50px 0 45px;
      color: #fff;
      border-radius: 24px;
      background-color: #4caf50;
    }
    .submitProgress {
      margin-bottom: 21px;
    }
  }
  .progress-container {
    margin-top: 20px;
    text-align: center;
    .progress-text {
      display: flex;
      justify-content: space-between;
      text-align: center;
      margin-bottom: 20px;
      color: #4b5563;
    }
    .progress {
      .wd-progress {
        .wd-progress__outer {
          height: 8px;
          border-radius: 10px;
        }
      }
    }
    .progress {
      .wd-progress {
        .wd-progress__outer {
          height: 8px;
          border-radius: 10px;
        }
      }
    }

    span {
      font-size: 14px;
    }
  }

  .tip-text {
    margin: 8px 0;
    width: 100%;
    font-family: Inter;
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
    letter-spacing: 0px;
    text-align: center;
    color: #999999;
  }
  .tipTextProgress {
    margin-top: 21px;
  }
  .checkboxLayout {
    margin: 10px 0;
  }
}
</style>