const process = require("node:process");
const fs = require("fs");
function getDate(date) {
  try {
    const today = date ? new Date(date) : new Date();
    const year = today.getFullYear();
    const month = fixDate(today.getMonth() + 1);
    const day = fixDate(today.getDate());
    const parentDir = year + "-" + month;
    const childDir = month + "-" + day;
    console.log("today is ", today, parentDir, childDir);
    return { parentDir, childDir };
  } catch (err) {
    return getDate();
  }
}
function fixDate(num) {
  if (num <= 9) {
    num = "0" + num;
  }
  return num;
}

// 获取指令的时间
function getDircDate() {
  const [date, type] = process.argv.slice(2);
  if (type === "custom") {
    // 此时传参为目标路径
    return createDirs(date);
  }
  let { parentDir, childDir } = getDate(date);
  createDirs(parentDir + "&" + childDir);
}

getDircDate();

/**
 * 创建目录
 * @param {需要创建的目标} dirs
 * @param {当前路径} dir
 */
function createDirs(dirs, dir = __dirname) {
  const fileNames = dirs.split("&");
  //   判断目录下是否存在此文件夹
  let exist = false;
  const files = fs.readdirSync(dir);
  let parentDir = fileNames[0];
  exist = files.includes(parentDir);
  const fullPath = dir + "/" + parentDir;
  console.log(parentDir, exist ? "已存在" : "准备创建");
  if (!exist) {
    fs.mkdirSync(fullPath);
  }
  if (fileNames.length === 1) {
    // 只有一层了
    createFileOrDir(fullPath);
  } else {
    fileNames.shift();
    createDirs(fileNames.join("&"), fullPath);
  }
}
/**
 * copy来源路径目录，创建文件夹或文件到目标路径 递归
 * @param {*} path - 目标路径
 * @param {*} originPath - 来源路径
 */
function createFileOrDir(path, originPath = "./template") {
  // 目标文件
  const aimFiles = fs.readdirSync(originPath, { withFileTypes: true });
  const files = fs.readdirSync(path);
  // console.log("files", path, files, aimFiles);
  aimFiles.forEach((item) => {
    if (item.isDirectory()) {
      fs.mkdir(path + "/" + item.name, {}, () => {
        console.log("创建文件夹", item.name);
        createFileOrDir(path + "/" + item.name, originPath + "/" + item.name);
      });
      return;
    }
    if (files.includes(item.name)) {
      console.log(item.name, "已存在，不覆盖");
      return;
    }
    try {
      const data = fs.readFileSync(originPath + "/" + item.name);
      fs.writeFile(path + "/" + item.name, data, () => {
        console.log(`完成写入${item.name}`);
      });
    } catch (err) {
      console.log("读取异常", err);
    }
  });
}
