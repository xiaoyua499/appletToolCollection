<template>
	<view style="padding: 5px;">
		<view style="width: 100%;text-align: center;margin-bottom: 8px;">文本批量导入剪切板工具</view>
		<view class="input-box">
		  <textarea  ref="textareaRef" :focus="isFocus"  class="input" maxlength="-1" placeholder='转换剪切板模版:1. 璟和小娇夫，村医认证开启新篇章！2. 女耕男织，璟和夫妇种田文来袭！' v-model="str">
		    </textarea>
		  <button @click="submitEvent" class="submit">提交</button>
		</view>
		<!-- 进度条显示区域 -->
		   <view v-if="showProgress" class="progress-container">
		     <progress :percent="progressValue" activeColor="#10AEFF"></progress>
		     <span>{{ progressText }}</span>
		   </view>
		<view style="width: 100%;text-align: center;margin-bottom: 8px;">输入文本后点击提交按钮等待进度条完成后即可批量复制进剪切板！复制过程中请勿动手机屏幕！！！</view>
		 
	</view>
</template>

<script setup>
	import { nextTick, reactive, ref } from 'vue';
	const str = ref('');
	let clipboardTextArr = reactive([]);
	const isFocus = ref(false)
	const textareaRef = ref(null); // 绑定textarea的ref
	
	// 进度条相关的状态
	  const showProgress = ref(false);
	  const progressValue = ref(0);
	  const progressText = ref('');
	const submitEvent = () => {
		console.log(str.value);
		isFocus.value=false
		setTimeout(()=>{
			isFocus.value=true
		},100)
		processText(str.value);
		
		
	};
	
	const processText = (text) => {
		// 使用正则表达式将文本按序号进行分割
		let splitCommentsArray = text.split(/(?=\d{1,2}\.\s)/);
		
		// 去除每条评论的序号、结尾标点符号、换行符
		let cleanedCommentsArray = splitCommentsArray.map(comment => 
		    comment.replace(/^\d{1,2}\.\s/, '') // 去除序号
		           .replace(/[！。~\n]+$/, '') // 去除结尾标点符号和换行符
		           .trim() // 去除前后多余空格
		);
		
		// 过滤掉单个的数字和空白项
		cleanedCommentsArray = cleanedCommentsArray.filter(comment => isNaN(comment) && comment.trim() !== '');
		clipboardTextArr = cleanedCommentsArray;
		console.log(clipboardTextArr);
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
</script>
<style lang="less">
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

      }
	  }
	  .progress-container {
	      margin-top: 20px;
	      text-align: center;
	  
	      progress {
	        width: 100%;
	        height: 20px;
	        margin-bottom: 10px;
	      }
	  
	      span {
	        font-size: 14px;
	      }
	    }
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
</style>
