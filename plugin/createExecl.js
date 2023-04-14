import {
  read,
  utils,
  writeFileXLSX,
  write
} from 'xlsx';
//生成Execl文件

let max_length = 0
//遍历Json数组，并找出最长字符串的长度
function traverseObj(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      // 如果值是一个字符串，则比较其长度是否最大，并更新max_length
      if (typeof value === "string") {
        const length = value.length;
        if (length > max_length) {
          max_length = length;
          // console.log(max_length);
        }
      }
      // 如果值是一个对象，则递归调用该函数
      if (typeof value === "object") {
        traverseObj(value);
      }
    }
  }
  return max_length
}

/**创建Excel文件
 * @param {Object} jsonData json格式的数据
 * @param {Object} fileName 文件名
 */
export function createExecl(jsonData, fileName) {
  // 将 JSON 数据转化为 worksheet
  const worksheet = utils.json_to_sheet(jsonData);
  // 设置单元格宽度自适应
  /* 设置默认列宽为8 */
  worksheet["!cols"] = [{
    width: 8
  }];

  /* 循环所有列以查找最大单元格宽度，并更新列的宽度 */
  const maxWidth = traverseObj(jsonData)
  const range = utils.decode_range(worksheet['!ref']);
  var numCols = range.e.c - range.s.c + 1;
  // console.log(maxWidth);
  for (let i = 0; i < numCols; i++) {
    worksheet['!cols'][i] = {
      width: maxWidth + 5
    };
  }
  // // 设置边框加粗
  // const borderStyle = {
  //   top: {
  //     style: 'thick',
  //     color: {
  //       rgb: '000000'
  //     }
  //   },
  //   bottom: {
  //     style: 'thick',
  //     color: {
  //       rgb: '000000'
  //     }
  //   },
  //   left: {
  //     style: 'thick',
  //     color: {
  //       rgb: '000000'
  //     }
  //   },
  //   right: {
  //     style: 'thick',
  //     color: {
  //       rgb: '000000'
  //     }
  //   }
  // };
  // for (let col = range.s.c; col <= range.e.c; col++) {
  //   for (let row = range.s.r; row <= range.e.r; row++) {
  //     const cell = utils.encode_cell({
  //       c: col,
  //       r: row
  //     });
  //     worksheet[cell].s = borderStyle;
  //   }
  // }

  // 将 worksheet 导出为 Excel 文件
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  var fileData = write(workbook, {
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