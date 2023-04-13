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
const userList = []
// let newUserList = []
//获取用户输入的字符串并转换为json格式
export function getUserJson(table, tableFoot, str) {
  const newStr = ToCDB(str)
  // console.log(newStr);
  const removeSpacesArr = newStr.replace(/[ ]|[\r\n]/g, ";").split(';;')
  // console.log(123, removeSpacesArr);
  for (let i = 0; i < removeSpacesArr.length; i++) {
    const userInfo = {}
    const list = removeSpacesArr[i].replace(/[:]|[;]/g, "+")
    const newList = list.replace(/[+]+/g, "+").split('+')
    // console.log(123, newList);
    for (let j = 0; j < newList.length; j++) {
      userInfo[table[j]] = newList[j]
    }
    userList.push(userInfo)
    // newUserList = userList.concat(tableFoot)
    // // console.log(newUserList);
  }
  return {
    userList
  }
}