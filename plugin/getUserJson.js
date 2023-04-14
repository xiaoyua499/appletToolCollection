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
//用户列表
const userList = []

/** 获取用户输入的字符串并转换为json格式
 * @param {Object} table 表头
 * @param {Object} tableFoot 表尾
 * @param {Object} str 用户输入的字符串
 */
export function getUserJson(table, tableFoot, str) {
  const newStr = ToCDB(str)
  const regex = /^\s*(.+?:)?\s*(.+?)\s*$/gm;
  let match;
  const userList = [];
  while ((match = regex.exec(newStr)) !== null) {
    // 匹配到的分组 1
    const group1 = match[1] ? match[1].replace(":", "") : "";
    // 匹配到的分组 2
    const group2 = match[2].split("+").map(str => str.trim());
    const groups = []
    if (group1.length !== 0) {
      groups = [group1, ...group2];
    } else {
      groups = [...group2];
    }
    const userInfo = {};
    for (let i = 0; i < groups.length && i < table.length; i++) {
      userInfo[table[i]] = groups[i];
    }
    // 保存结果
    userList.push({
      userInfo
    });
  }
  return userList
}