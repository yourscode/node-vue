var express = require('express')
const mysql = require('mysql')
const nodeExcel = require('excel-export')
const fs = require('fs')
const chrome = require('child_process')
const path = require('path')
var app = express()
var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  port: 3306,
  database: 'basedata',
  connectionLimit: 1000000,
  multipleStatements: true
})
app.get('/', function(req, res) {
  res.send('welcome！')
})

app.listen(3000, function() {
  console.log('app is listen at port 3000...')
})

var xlsx = require('node-xlsx')
const folderName = process.env.HOME || process.env.USERPROFILE + '\\Desktop\\warehouse'
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
// 后台导出走访表接口
app.get('/exportExcel', function(req, res) {
  // 创建一个写入格式map，其中cols(表头)，rows(每一行的数据);
  const conf = {}
  // 手动创建表头中的内容
  // const cols = ['电话', '城市', '看管人姓名', '区县编号']
  // 在conf中添加cols
  conf.cols = []
  // for (let i = 0; i < cols.length; i++) {
  //   // 创建表头数据所对应的类型,其中包括 caption内容 type类型
  //   const tits = {}
  //   // 添加内容
  //   tits.caption = cols[i]
  //   // 添加对应类型，这类型对应数据库中的类型，入number，data但一般导出的都是转换为string类型的
  //   tits.type = 'string'
  //   // 将每一个表头加入cols中
  //   conf.cols.push(tits)
  // }
  // mysql查询数据库的用户信息
  // userModel.find({}, function(err, data) {
  pool.getConnection((err, conn) => {
    if (err) {
      // 执行出错
      throw err
    } else {
      // var sql = `SELECT DISTINCT a.phoneNumber,b.地市,b.看管人姓名,b.区县编号 from tel a INNER JOIN sheet1 b on a.phoneNumber = b.看管人手机号码;
      // drop table test;CREATE TABLE test(phone_id VARCHAR(20),userName VARCHAR(20));`
      var sql = `select 领用申请单号, 物料编号, 物料名称, 单位, 领用申请数量, 累计交货数量, 领用类型, 项目编码, 项目, 任务编码,任务, 支出类型名称, 施工单位, 领用申请单申请人, 领用申请单创建人, 领用申请单创建日期,平均价格, 金额
      from 出库通知单 WHERE 领用申请单创建日期 >'2021-08-09' and 领用申请单创建日期 <'2021-08-10';`
      conn.query(sql, (err, data) => {
        if (err) throw err
        // console.log(data)
        const rows = []

        const tempArr = ['领用申请单号', '物料编号', '物料名称', '单位', '领用申请数量', '累计交货数量', '领用类型', '项目编码', '项目', '任务编码', '任务', '支出类型名称', '施工单位', '领用申请单申请人', '领用申请单创建人', '领用申请单创建日期', '平均价格', '金额']
        for (const key in data[0]) {
          if (tempArr.indexOf(key) !== -1) {
            // 创建表头数据所对应的类型,其中包括 caption内容 type类型
            const tits = {}
            // 添加内容
            tits.caption = key
            // 添加对应类型，这类型对应数据库中的类型，入number，data但一般导出的都是转换为string类型的
            tits.type = 'string'
            // 将每一个表头加入cols中
            conf.cols.push(tits)
            rows.push(key)
          }
        }
        // console.log(rows)
        // 创建一个和表头对应且名称与数据库字段对应数据，便于循环取出数据
        // 用于承载数据库中的数据
        const datas = []
        // 循环数据库得到的数据
        for (let i = 0; i < data.length; i++) {
          const row = []// 用来装载每次得到的数据
          // 内循环取出每个字段的数据
          for (let j = 0; j < rows.length; j++) {
            row.push(data[i][rows[j] + ''])
          }
          // 将每一个{ }中的数据添加到承载中
          datas.push(row)
        }
        conf.rows = datas
        conf.name = 'Jan'
        console.log(conf)
        // 将所有数据写入nodeExcel中
        const result = nodeExcel.execute(conf)
        // 设置响应头，在Content-Type中加入编码格式为utf-8即可实现文件内容支持中文
        res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8')
        // 设置下载文件命名，中文文件名可以通过编码转化写入到header中。
        res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURI('warehouse(出库通知单)') + '.xlsx')
        // 将文件内容传入
        res.end(result, 'binary')
      })
      conn.release()
    }
  })
})

// const first = new Promise((resolve, reject) => {
//   setTimeout(resolve, 500, '第一个')
// })
// const second = new Promise((resolve, reject) => {
//   setTimeout(resolve, 100, '第二个')
// })

// Promise.race([first, second]).then(result => {
//   console.log(result) // 第二个
// })

// 一月英文缩写Jan；二月英文缩写Feb；三月英文缩写Mar；四月英文缩写Apr；五月英文缩写May；六月英文缩写Jun；七月英文缩写Jul；八月英文缩写Aug；九月英文缩写Sept；十月英文缩写Oct；十一月英文缩写Nov.十二月英文缩写Dec

// ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

