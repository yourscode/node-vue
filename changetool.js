var express = require('express')
const mysql = require('mysql')
const nodeExcel = require('excel-export')
const fs = require('fs')
const chrome = require('child_process')
const path = require('path')
var app = express()
// var pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '123456',
//   port: 3306,
//   database: 'basedata',
//   connectionLimit: 1000000,
//   multipleStatements: true
// })
// app.get('/', function (req, res) {
//   res.send('welcome！')
// })

// app.listen(3000, function () {
//   console.log('app is listen at port 3000...')
// })

var xlsx = require('node-xlsx')
const { type } = require('os')
// const { resolve } = require('path')
// const { reject } = require('core-js/fn/promise')
// const { reject } = require('core-js/fn/promise')
// const { start } = require('repl')
// var fs = require('fs')
// const folderName = 'C:\\Users\\The man\\Desktop\\nodeFolder'
const changeFolder = process.env.HOME || process.env.USERPROFILE + '\\Desktop\\changeFolder'
// var aimFile = folderName + '\\testxlsx.xlsx'
//! !用于结束后清空文件夹
// var files = fs.readdirSync(folderName)
// files.forEach((file) => {
//   fs.unlink(folderName + '\\' + file, (err) => {
//     if (err) throw err
//   })
// })
//
// drop table test;CREATE TABLE test(phone_id VARCHAR(20));
//
// flag 用于标志状态
function modifyFolder(params) {
  return new Promise(function(resolve, reject) {
    try {
      if (!fs.existsSync(changeFolder)) {
        fs.mkdirSync(changeFolder)
      }
    } catch (err) {
      console.error(err)
    }
    // var getname = () => {
    fs.readdir(changeFolder, 'utf-8', (err, data) => {
      // var contentName = ''
      if (err) throw err
      console.log(data)
      // if (data.length === 1) {
      for (const key of data) {
        if (key === 'CGI.xlsx' || key === 'CGI.xls') {
          var promise1 = new Promise((resolve, reject) => {
            // contentName = key
            // console.log(data)
            var oldName = changeFolder + '\\' + key
            console.log(oldName)
            try {
              // Truncate Table tel
              // 用户表数据
              var userTableData = []
              var tableSum = ''
              // 表数据
              var tableData = xlsx.parse(oldName)
              // 循环读取表中所有sheet的数据
              // for (var val in tableData) {
              // 下标数据
              var itemData = tableData[0]
              // console.log(itemData.data[0].push(','))
              console.log(process.argv[2])
              var argvVal = process.argv[2]
              console.log(argvVal)
              if (argvVal !== undefined) {
                argvVal = process.argv[2].split(',' || '，')
                const mapValue = itemData.data.map(item => {
                  var insertArr = []
                  for (let index = 0; index < argvVal.length; index++) {
                    if (item[Number(argvVal[index]) - 1] === undefined || item[Number(argvVal[index]) - 1] === '#N/A' || item[Number(argvVal[index]) - 1] === '') {
                      insertArr.push('null')
                    } else {
                      insertArr.push(item[Number(argvVal[index]) - 1])
                    }
                    // console.log('hello world')
                  }
                  return insertArr
                })
                itemData.data = mapValue
                // console.log(mapValue)
              }
              for (var index = 0; index < itemData.data.length; index++) {
                // 0为表头数据.
                //   // itemData.data[0].push(',')
                //   continue
                // }
                // console.log(itemData.data[index])
                // if (index === 2) {
                // 进制转换
                // if (index === 0) {
                //   itemData.data[index].push('CGI转译')
                // } else {
                //   // !!!如果选择列的话需要修改下面数组的下标
                //   var str = itemData.data[index][1] + ''
                //   var phoneNums = str.split('-')
                //   var firstNum = Number(phoneNums[2]).toString(16)
                //   var secondNum = Number(phoneNums[3]).toString(16)
                //   if (secondNum.length === 1) {
                //     secondNum = '0' + secondNum
                //   }
                //   var mergeNum = firstNum + secondNum
                //   itemData.data[index].push(parseInt(mergeNum, 16))
                // }
                var arr = itemData.data[index]
                // console.log(arr)
                // const singleArr = []
                // for (const i of arr) {
                //   if (i === '#N/A' || i === '' || i === undefined) {
                //     // eslint-disable-next-line no-const-assign
                //     // i = 'null'
                //     // console.log(i, 1111111)
                //     singleArr.push(['null'])
                //   } else if (i !== arr[arr.length - 1]) {
                //   // singleArr.push([i], ',')
                //     singleArr.push([i])
                //   } else {
                //     singleArr.push([i] + '\n')
                //   }
                // }
                // another way
                var singleArr = []
                var singleArr1 = arr.filter((cur, index) => {
                  if (cur === '#N/A' || cur === '' || cur === undefined) {
                    // eslint-disable-next-line no-const-assign
                    // i = 'null'
                    // console.log(i, 1111111)
                    singleArr.push(['null'])
                  } else if (index !== (arr.length - 1)) {
                    // singleArr.push([i], ',')
                    singleArr.push([cur])
                  } else {
                    singleArr.push([cur] + '\n')
                    singleArr.push('\n')
                  }
                  return singleArr
                })
                singleArr = singleArr1
                userTableData.push(singleArr)
                // 原来的样子 tableSum = tableSum + singleArr
                tableSum = tableSum + (singleArr + '\n')
              }
              console.log(singleArr)
              // 导出excel
              // var buffer = xlsx.build([{ name: 'sheets', data: userTableData }])
              // fs.writeFile('./text3.xlsx', buffer, function (err) {
              //   if (err) {
              //     return console.error(err)
              //   }
              //   console.log('数据写入成功！')
              //   console.log('--------我是分割线-------------')
              //   console.log('读取写入的数据！')
              //   var testData = xlsx.parse('./text3.xlsx')
              //   console.log(testData)
              // })

              const configUrl = path.join(process.env.HOME || process.env.USERPROFILE + '/Desktop/', 'text3.txt')

              fs.writeFile(configUrl, tableSum, function(err) {
                console.log(err)
              })
              // console.log('走访表数据提取：', userTableData)
              // console.log('走访表数据提取：', tableSum)
              // }
              // console.log('-------------end-------------')
            } catch (e) {
              // 输出日志
              console.log('excel读取异常,error=%s', e.stack)
            }
            resolve(1)
          })
        }
      }
      Promise.all([promise1]).then(() => {
        console.log('请查看桌面text3.txt文件...')
      })
      // } else {
      //   console.log('请放入：CGI.xlsx的excel文件！')
      // }
    })
  })
  // return new Promise((resolve, reject) => {})
}

modifyFolder()

// 读取Excel数据
/*
try {
  // pool.getConnection((err, conn) => {
  //   if (err) throw err
  //   var sql = `Truncate Table tel;`
  //   conn.query(sql, (err, result) => {
  //     if (err) throw err
  //     console.log(result)
  //     // res.json({ code: 200, msg: result })
  //     // res.send("搜索成功!");
  //   })
  //   conn.release()
  // })

  // Truncate Table tel
  // 用户表数据
  var userTableData = []
  // 表数据
  var tableData = xlsx.parse(aimFile)
  // 循环读取表数据
  for (var val in tableData) {
    // 下标数据
    var itemData = tableData[val]
    // console.log(itemData)
    // var regx1 = /(1[3|4|5|7|8|9][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g
    // var regx = /(1[\d]{2}[\s]?[\d]{4}[\s]?[\d]{4})/g
    // var str = '保卫处万处长130 6517 3126,198802999011沟通人员进校'
    // var phoneNums = str.match(regx)
    // console.log(phoneNums)
    // 循环读取用户表数据
    for (var index in itemData.data) {
      // 0为表头数据
      if (index === 0) {
        continue
      }
      var regx = /(1[\d]{2}[\s]?[\d]{4}[\s]?[\d]{4})/g
      var str = itemData.data[index][9] + ''
      var phoneNums = str.match(regx)
      // console.log(phoneNums)
      if (phoneNums !== null) {
        userTableData.push(...phoneNums)
      }
    }
    console.log(userTableData)
    var phoneData = [];
    (async() => {
      pool.getConnection((err, conn) => {
        if (err) throw err
        var sql = `Truncate Table tel;`
        conn.query(sql, (err, result) => {
          if (err) throw err
          console.log(result)
          // res.json({ code: 200, msg: result })
          // res.send("搜索成功!");
        })
        conn.release()
      })
      for (const i of userTableData) {
        const sql = `insert tel(phoneNumber) values('${i.replace(/\s/g, '')}')`
        await insert(sql)
        phoneData.push([i.replace(/\s/g, '')])
      }
    })()
    // 第二种方法
    // pool.getConnection((err, conn) => {
    //   if (err) throw err
    //   var sql = `insert tel(phoneNumber) values ?;`
    //   conn.query(sql, [phoneData], (err, result) => {
    //     if (err) throw err
    //     console.log(result)
    //   })
    //   conn.release()
    // })
    // console.log(phoneData, phoneData.length)
  }

  console.log('-------------end-------------')
} catch (e) {
  // 输出日志
  console.log('excel读取异常,error=%s', e.stack)
}
*/
// const cols = ['phoneNumber', '地市', '集团名称(与证件上一致)', '集团成员手机号', '建档集团编号(92、JX)', '建档集团名称',
//   '区县编号',
//   '看管人BOSS工号',
//   '看管人姓名',
//   '看管人手机号码',
//   '集团成员姓名',
//   '集团成员职务',
//   '关键成员标识\n(下拉可选)',
//   '成员属性\n(下拉可选)',
//   '看管线条\n(下拉可选)',
//   '主管/网格长姓名',
//   '主管/网格长工号',
//   '主管/网格长手机号码',
//   '备注']
// const first = new Promise((resolve, reject) => {
//   setTimeout(resolve, 500, '第一个')
// })
// const second = new Promise((resolve, reject) => {
//   setTimeout(resolve, 100, '第二个')
// })

// Promise.race([first, second]).then(result => {
//   console.log(result) // 第二个
// })

