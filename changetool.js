const fs = require('fs')
const path = require('path')

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
        if (key === 'CGI.xlsx' || key === 'CGI.xls' || key === 'cgi.xlsx' || key === 'cgi.xls') {
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

              var flagStart = true
              if (argvVal && argvVal.length === 1) {
                if (argvVal === 'f') {
                  flagStart = false
                  argvVal = undefined
                }
              }
              if (argvVal !== undefined) {
                argvVal = process.argv[2].split(',' || '，')
                if (argvVal.indexOf('f') !== -1) {
                  flagStart = false
                  argvVal = argvVal.slice(0, argvVal.length - 1)
                  console.log(argvVal.indexOf('f'), argvVal)
                }
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
                // console.log(itemData.data)
              }
              var itemIndex = ''
              var itemFlag = false
              for (var index = 0; index < itemData.data.length; index++) {
                // 0为表头数据.
                //   // itemData.data[0].push(',')
                //   continue
                // }
                // console.log(itemData.data[index])
                // if (index === 2) {
                // 进制转换
                if (flagStart) {
                  if (index === 0) {
                    for (const item of itemData.data[0]) {
                      if (item === 'CGI') {
                        itemIndex = itemData.data[0].indexOf(item)
                        itemFlag = true
                        itemData.data[index].push('CGI转译')
                      }
                    }
                  } else {
                    if (itemFlag) {
                      var str = itemData.data[index][itemIndex] + ''
                      var phoneNums = str.split('-')
                      var firstNum = Number(phoneNums[2]).toString(16)
                      var secondNum = Number(phoneNums[3]).toString(16)
                      if (secondNum.length === 1) {
                        secondNum = '0' + secondNum
                      }
                      var mergeNum = firstNum + secondNum
                      itemData.data[index].push(parseInt(mergeNum, 16))
                    }
                  }
                }
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
                    return singleArr.push('null')
                  } else if (index !== (arr.length - 1)) {
                    return singleArr.push((cur + '').replace(/\s$/, ''))
                  } else {
                    return singleArr.push((cur + '').replace(/\s$/, '') + '\n')
                    // singleArr.push('\n')
                  }
                })

                userTableData.push(singleArr)
                // 原来的样子 tableSum = tableSum + singleArr
                tableSum = tableSum + singleArr
              }

              const configUrl = path.join(process.env.HOME || process.env.USERPROFILE + '/Desktop/', 'text3.txt')

              fs.writeFile(configUrl, tableSum, function(err) {
                console.log(err)
              })
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

// const first = new Promise((resolve, reject) => {
//   setTimeout(resolve, 500, '第一个')
// })
// const second = new Promise((resolve, reject) => {
//   setTimeout(resolve, 100, '第二个')
// })

// Promise.race([first, second]).then(result => {
//   console.log(result) // 第二个
// })

