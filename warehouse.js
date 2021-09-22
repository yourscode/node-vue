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
// 封装一个函数

var monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
var getMonth = (index, res) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      const conf = {}
      conf.stylesXmlFile = 'styles.xml'
      conf.cols = []
      conf.rows = []
      var conf2 = {}
      conf2.cols = []
      conf2.rows = []
      conf2.stylesXmlFile = 'styles.xml'
      conf2.name = 'project'
      var conf3 = {}
      conf3.cols = []
      conf3.rows = []
      conf3.stylesXmlFile = 'styles.xml'
      conf3.name = 'maintain'
      var conf4 = {}
      conf4.cols = []
      conf4.rows = []
      conf4.stylesXmlFile = 'styles.xml'
      conf4.name = 'others'
      // 汇总表
      var conf5 = {}
      conf5.cols = []
      conf5.rows = []
      conf5.stylesXmlFile = 'styles.xml'
      conf5.name = 'project-sum'
      var conf6 = {}
      conf6.cols = []
      conf6.rows = []
      conf6.stylesXmlFile = 'styles.xml'
      conf6.name = 'maintain-sum'
      var conf7 = {}
      conf7.cols = []
      conf7.rows = []
      conf7.stylesXmlFile = 'styles.xml'
      conf7.name = 'others-sum'
      if (err) {
      // 执行出错
        throw err
      } else {
      // var sql = `SELECT DISTINCT a.phoneNumber,b.地市,b.看管人姓名,b.区县编号 from tel a INNER JOIN sheet1 b on a.phoneNumber = b.看管人手机号码;
      // drop table test;CREATE TABLE test(phone_id VARCHAR(20),userName VARCHAR(20));`
        var sql = `select 领用申请单号, 物料编号, 物料名称, 单位, 领用申请数量, 累计交货数量, 领用类型, 项目编码, 项目, 任务编码,任务, 支出类型名称, 施工单位, 领用申请单申请人,b.department 所属部门, 领用申请单创建人, 领用申请单创建日期,平均价格, 金额
      from 出库通知单2018 a LEFT JOIN staff b on SUBSTRING_INDEX(a.领用申请单创建人,'@', 1) = SUBSTRING_INDEX(b.email,'@', 1) WHERE 领用申请单创建日期 >='2018-${index > 9 ? index : '0' + index}-${index > 9 ? index : '0' + index}' and 领用申请单创建日期 <='2018-${index > 9 ? index : '0' + index}-31';
      select 领用申请单号, 物料编号, 物料名称, 单位, 领用申请数量, 累计交货数量, 领用类型, 项目编码, 项目, 任务编码,任务, 支出类型名称, 施工单位, 领用申请单申请人,b.department 所属部门,领用申请单创建人, 领用申请单创建日期,平均价格, 金额 from 出库通知单2018 a LEFT JOIN staff b on SUBSTRING_INDEX(a.领用申请单创建人,'@', 1) = SUBSTRING_INDEX(b.email,'@', 1) WHERE not 项目编码='' and 领用申请单创建日期 >='2018-${index > 9 ? index : '0' + index}-${index > 9 ? index : '0' + index}' and 领用申请单创建日期 <='2018-${index > 9 ? index : '0' + index}-31';
      select 领用申请单号, 物料编号, 物料名称, 单位, 领用申请数量, 累计交货数量, 领用类型, 项目编码, 项目, 任务编码,任务, 支出类型名称, 施工单位, 领用申请单申请人,b.department 所属部门,领用申请单创建人, 领用申请单创建日期,平均价格, 金额  from 出库通知单2018 a LEFT JOIN staff b on SUBSTRING_INDEX(a.领用申请单创建人,'@', 1) = SUBSTRING_INDEX(b.email,'@', 1) WHERE 项目编码='' and 领用申请单创建日期 >='2018-${index > 9 ? index : '0' + index}-${index > 9 ? index : '0' + index}' and 领用申请单创建日期 <='2018-${index > 9 ? index : '0' + index}-31' and b.department in ('网络部','无线中心','有线业务部','网络部');
      select c.* from (select 领用申请单号, 物料编号, 物料名称, 单位, 领用申请数量, 累计交货数量, 领用类型, 项目编码, 项目, 任务编码,任务, 支出类型名称, 施工单位, 领用申请单申请人, ifnull(b.department,0) 所属部门,领用申请单创建人, 领用申请单创建日期,平均价格, 金额 from 出库通知单2018 a LEFT JOIN staff b on SUBSTRING_INDEX(a.领用申请单创建人,'@', 1) = SUBSTRING_INDEX(b.email,'@', 1) WHERE 项目编码='' and 领用申请单创建日期 >='2018-${index > 9 ? index : '0' + index}-${index > 9 ? index : '0' + index}' and 领用申请单创建日期 <='2018-${index > 9 ? index : '0' + index}-31') c where c.所属部门 not in ('网络部','无线中心','有线业务部','网络部');
      select h.所属部门,h.施工单位,h.物料名称,h.单位,sum(h.领用申请数量) 领用数量,count(h.物料名称) 领用次数,sum(h.金额) 领用物资总价  from (select 领用申请单号, 物料编号, 物料名称, 单位, 领用申请数量, 累计交货数量, 领用类型, 项目编码, 项目, 任务编码,任务, 支出类型名称, 施工单位, 领用申请单申请人,b.department 所属部门,领用申请单创建人, 领用申请单创建日期,平均价格, 金额 from 出库通知单2018 a LEFT JOIN staff b on SUBSTRING_INDEX(a.领用申请单创建人,'@', 1) = SUBSTRING_INDEX(b.email,'@', 1) WHERE not 项目编码='' and 领用申请单创建日期 >='2018-${index > 9 ? index : '0' + index}-${index > 9 ? index : '0' + index}' and 领用申请单创建日期 <='2018-${index > 9 ? index : '0' + index}-31') h GROUP BY h.所属部门,h.施工单位,h.物料名称,h.单位;
      select h.所属部门,h.施工单位,h.物料名称,h.单位,sum(h.领用申请数量) 领用数量,count(h.物料名称) 领用次数,sum(h.金额) 领用物资总价  from (select 领用申请单号, 物料编号, 物料名称, 单位, 领用申请数量, 累计交货数量, 领用类型, 项目编码, 项目, 任务编码,任务, 支出类型名称, 施工单位, 领用申请单申请人,b.department 所属部门,领用申请单创建人, 领用申请单创建日期,平均价格, 金额  from 出库通知单2018 a LEFT JOIN staff b on SUBSTRING_INDEX(a.领用申请单创建人,'@', 1) = SUBSTRING_INDEX(b.email,'@', 1) WHERE 项目编码='' and 领用申请单创建日期 >='2018-${index > 9 ? index : '0' + index}-${index > 9 ? index : '0' + index}' and 领用申请单创建日期 <='2018-${index > 9 ? index : '0' + index}-31' and b.department in ('网络部','无线中心','有线业务部','网络部')) h GROUP BY h.所属部门,h.施工单位,h.物料名称,h.单位;
      select h.所属部门,h.施工单位,h.物料名称,h.单位,sum(h.领用申请数量) 领用数量,count(h.物料名称) 领用次数,sum(h.金额) 领用物资总价  from (select c.* from (select 领用申请单号, 物料编号, 物料名称, 单位, 领用申请数量, 累计交货数量, 领用类型, 项目编码, 项目, 任务编码,任务, 支出类型名称, 施工单位, 领用申请单申请人, ifnull(b.department,0) 所属部门,领用申请单创建人, 领用申请单创建日期,平均价格, 金额 from 出库通知单2018 a LEFT JOIN staff b on SUBSTRING_INDEX(a.领用申请单创建人,'@', 1) = SUBSTRING_INDEX(b.email,'@', 1) WHERE 项目编码='' and 领用申请单创建日期 >='2018-${index > 9 ? index : '0' + index}-${index > 9 ? index : '0' + index}' and 领用申请单创建日期 <='2018-${index > 9 ? index : '0' + index}-31') c where c.所属部门 not in ('网络部','无线中心','有线业务部','网络部')) h GROUP BY h.所属部门,h.施工单位,h.物料名称,h.单位;`
        conn.query(sql, (err, data) => {
          if (err) throw err
          // console.log(data)

          const tempArr = ['领用申请单号', '物料编号', '物料名称', '单位', '领用申请数量', '累计交货数量', '领用类型', '项目编码', '项目', '任务编码', '任务', '支出类型名称', '施工单位', '领用申请单申请人', '所属部门', '领用申请单创建人', '领用申请单创建日期', '平均价格', '金额']
          const tempSum = ['所属部门', '施工单位', '物料名称', '单位', '领用数量', '领用次数', '领用物资总价']
          // 明细表遍历
          for (const item of tempArr) {
            // if (tempArr.indexOf(key[]) !== -1) {
            const tits = {}
            // 添加内容
            tits.caption = item
            // 添加对应类型，这类型对应数据库中的类型，入number，data但一般导出的都是转换为string类型的
            tits.type = 'string'
            // 将每一个表头加入cols中
            conf.cols.push(tits)
            conf2.cols.push(tits)
            conf3.cols.push(tits)
            conf4.cols.push(tits)
            // }
          }
          // 汇总表遍历
          for (const item of tempSum) {
            // if (tempArr.indexOf(key[]) !== -1) {
            const tits = {}
            // 添加内容
            tits.caption = item
            // 添加对应类型，这类型对应数据库中的类型，入number，data但一般导出的都是转换为string类型的
            tits.type = 'string'
            // 将每一个表头加入cols中
            conf5.cols.push(tits)
            conf6.cols.push(tits)
            conf7.cols.push(tits)
            // conf4.cols.push(tits)
            // }
          }
          for (const key of data[0]) {
            var littlerow = []
            for (const item of tempArr) {
              littlerow.push(key[item])
            }
            // console.log(littlerow)
            conf.rows.push(littlerow)
          }
          // console.log(conf.cols, 111111111111111111111111)
          conf.name = monthArr[index - 1]
          // conf2相关代码
          for (const key of data[1]) {
            var littlerow2 = []
            for (const item of tempArr) {
              littlerow2.push(key[item])
            }
            conf2.rows.push(littlerow2)
          }
          for (const key of data[2]) {
            var littlerow3 = []
            for (const item of tempArr) {
              littlerow3.push(key[item])
            }
            conf3.rows.push(littlerow3)
          }
          for (const key of data[3]) {
            var littlerow4 = []
            for (const item of tempArr) {
              littlerow4.push(key[item])
            }
            conf4.rows.push(littlerow4)
            // console.log(littlerow4)
          }
          for (const key of data[4]) {
            var littlerow5 = []
            for (const item of tempSum) {
              littlerow5.push(key[item] + '')
            }
            conf5.rows.push(littlerow5)
          }
          for (const key of data[5]) {
            var littlerow6 = []
            for (const item of tempSum) {
              littlerow6.push(key[item] + '')
            }
            conf6.rows.push(littlerow6)
          }
          for (const key of data[6]) {
            var littlerow7 = []
            for (const item of tempSum) {
              littlerow7.push(key[item] + '')
            }
            conf7.rows.push(littlerow7)
          }
          console.log('conf查询结果出来了++' + index + '月份')
          // 将所有数据写入nodeExcel中
          const result = nodeExcel.execute([conf, conf2, conf3, conf4, conf5, conf6, conf7])
          // 设置响应头，在Content-Type中加入编码格式为utf-8即可实现文件内容支持中文
          res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8')
          // 设置下载文件命名，中文文件名可以通过编码转化写入到header中。
          res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURI(`2018年${index}月出库通知`) + '.xlsx')
          // 将文件内容传入
          res.end(result, 'binary')
        })
        conn.release()
      }
    })
    resolve(res)
  })
}
// 后台导出走访表接口
app.get('/exportExcel1', function(req, res) {
  const conf = {}
  conf.cols = []
  const thisres = res;
  (() => {
    getMonth(1, thisres)
  })()
})
app.get('/exportExcel2', function(req, res) {
  const conf = {}
  conf.cols = []
  const thisres = res;
  (() => {
    getMonth(2, thisres)
  })()
})
app.get('/exportExcel3', function(req, res) {
  const conf = {}
  conf.cols = []
  const thisres = res;
  (() => {
    getMonth(3, thisres)
  })()
})
app.get('/exportExcel4', function(req, res) {
  const conf = {}
  conf.cols = []
  const thisres = res;
  (() => {
    getMonth(4, thisres)
  })()
})
app.get('/exportExcel5', function(req, res) {
  const conf = {}
  conf.cols = []
  const thisres = res;
  (() => {
    getMonth(5, thisres)
  })()
})
app.get('/exportExcel6', function(req, res) {
  const conf = {}
  conf.cols = []
  const thisres = res;
  (() => {
    getMonth(6, thisres)
  })()
})
app.get('/exportExcel7', function(req, res) {
  const conf = {}
  conf.cols = []
  const thisres = res;
  (() => {
    getMonth(7, thisres)
  })()
})
app.get('/exportExcel8', function(req, res) {
  const conf = {}
  conf.cols = []
  const thisres = res;
  (() => {
    getMonth(8, thisres)
  })()
})
app.get('/exportExcel9', function(req, res) {
  const conf = {}
  conf.cols = []
  const thisres = res;
  (() => {
    getMonth(9, thisres)
  })()
})
app.get('/exportExcel10', function(req, res) {
  const conf = {}
  conf.cols = []
  const thisres = res;
  (() => {
    getMonth(10, thisres)
  })()
})
app.get('/exportExcel11', function(req, res) {
  const conf = {}
  conf.cols = []
  const thisres = res;
  (() => {
    getMonth(11, thisres)
  })()
})
app.get('/exportExcel12', function(req, res) {
  const conf = {}
  conf.cols = []
  const thisres = res;
  (() => {
    getMonth(12, thisres)
  })()
})
// chrome.exec('start http://localhost:3000/exportExcel1')
for (let i = 1; i <= 12; i++) {
  const url = 'start http://localhost:3000/exportExcel' + i
  chrome.exec(url)
}
// chrome.exec('start http://localhost:3000/exportExcel3')
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

