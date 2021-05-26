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
// const { resolve } = require('path')
// const { reject } = require('core-js/fn/promise')
// const { reject } = require('core-js/fn/promise')
// const { start } = require('repl')
// var fs = require('fs')
// const folderName = 'C:\\Users\\The man\\Desktop\\nodeFolder'
const folderName = process.env.HOME || process.env.USERPROFILE + '\\Desktop\\nodeFolder'
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
      var sql = `select a.* ,case when c.phoneNumber  is not null then '是' else '否' end 是否走访  from 
      (select b.phone_id,a.* , case when a.地市 is not null then '是' else '否' end 是否通话 
      from sheet1 a RIGHT JOIN converse b on a.集团成员手机号 = b.phone_id ) a LEFT JOIN tel c on a.phone_id = c.phoneNumber;`
      conn.query(sql, (err, data) => {
        if (err) throw err
        // console.log(data)
        const rows = []

        const tempArr = ['phone_id', '集团名称(与证件上一致)', `建档集团编号(92、JX)`, '区县编号', '集团成员姓名', '看管人BOSS工号', '看管人姓名', '是否通话', '是否走访']
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
        // const rows = ['phoneNumber', '地市', '看管人姓名', '区县编号']
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
        // console.log(datas, data)
        // 将所有数据写入nodeExcel中
        const result = nodeExcel.execute(conf)
        // 设置响应头，在Content-Type中加入编码格式为utf-8即可实现文件内容支持中文
        res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8')
        // 设置下载文件命名，中文文件名可以通过编码转化写入到header中。
        res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURI('走访、通话用户信息表') + '.xlsx')
        // 将文件内容传入
        res.end(result, 'binary')
      })
      conn.release()
      //! !用于结束后清空文件夹
      var files = fs.readdirSync(folderName)
      files.forEach((file) => {
        if (file === '走访.xlsx') {
          fs.unlink(folderName + '\\' + file, (err) => {
            if (err) throw err
            console.log('走访.xlsx已删除...')
          })
        }
      })
    }
  })
})

// 后台接口导出通话excel表格
app.get('/exportExcel2', function(req, res) {
  // 创建一个写入格式map，其中cols(表头)，rows(每一行的数据);
  const conf = {}
  // 手动创建表头中的内容
  // 在conf中添加cols
  conf.cols = []
  pool.getConnection((err, conn) => {
    if (err) {
      // 执行出错
      throw err
    } else {
      var sql = `SELECT f.* ,(f.通话用户数/f.目标用户数) as 通话率,(f.走访用户数/f.目标用户数) as 走访率 from  (select COALESCE(d.区县编号,'总计') AS 区县编号,count(区县编号) 目标用户数,SUM(d.是否通话) 通话用户数,SUM(d.是否走访) 走访用户数  from
      (select a.* ,case when c.phoneNumber  is not null then '是' else '否' end 是否走访  from 
      (select b.phone_id,a.* , case when a.地市 is not null then '是' else '否' end 是否通话 
       from sheet1 a INNER JOIN converse b on a.集团成员手机号 = b.phone_id) a LEFT JOIN tel c on a.phone_id = c.phoneNumber) d GROUP BY 区县编号 WITH ROLLUP) f ;`
      conn.query(sql, (err, data) => {
        if (err) throw err
        const rows = []
        const tempArr = ['区县编号', '目标用户数', `通话用户数`, '走访用户数', '通话率', '走访率']
        // console.log(data)
        for (const key in data[0]) {
          if (tempArr.indexOf(key) !== -1) {
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
        // 用于承载数据库中的数据
        const datas = []
        // 循环数据库得到的数据
        // data = data[0]
        for (let i = 0; i < data.length; i++) {
          const row = []// 用来装载每次得到的数据
          // 内循环取出每个字段的数据
          for (let j = 0; j < rows.length; j++) {
            row.push(data[i][rows[j] + ''] + '')
          }
          // 将每一个{ }中的数据添加到承载中
          datas.push(row)
        }
        // console.log(datas)
        conf.rows = datas
        // 将所有数据写入nodeExcel中
        const result = nodeExcel.execute(conf)
        // 设置响应头，在Content-Type中加入编码格式为utf-8即可实现文件内容支持中文
        res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8')
        // 设置下载文件命名，中文文件名可以通过编码转化写入到header中。
        res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURI('用户信息汇总表') + '.xlsx')
        // 将文件内容传入
        res.end(result, 'binary')
      })
      conn.release()
      //! !用于结束后清空文件夹
      var files = fs.readdirSync(folderName)
      files.forEach((file) => {
        if (file === '通话.xlsx') {
          fs.unlink(folderName + '\\' + file, (err) => {
            if (err) throw err
            console.log('通话.xlsx已删除...')
          })
        }
      })
    }
  })
})
// 后台接口输出客户汇总表
app.get('/exportExcel3', function(req, res) {
  // 创建一个写入格式map，其中cols(表头)，rows(每一行的数据);
  const conf = {}
  // 手动创建表头中的内容
  // 在conf中添加cols
  conf.cols = []
  pool.getConnection((err, conn) => {
    if (err) {
      // 执行出错
      throw err
    } else {
      var sql = `SELECT * from small ;`
      conn.query(sql, (err, data) => {
        if (err) throw err
        const rows = []
        const tempArr = ['id', 'name', `type`, 'typecode', 'tel', 'pname', 'citycode', 'cityname', 'wanggename', 'adname', 'tel1', 'tel3', 'tel3']
        // console.log(data)
        for (const key in data[0]) {
          if (tempArr.indexOf(key) !== -1) {
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
        // 用于承载数据库中的数据
        const datas = []
        // 循环数据库得到的数据
        // data = data[0]
        for (let i = 0; i < data.length; i++) {
          const row = []// 用来装载每次得到的数据
          // 内循环取出每个字段的数据
          for (let j = 0; j < rows.length; j++) {
            if (rows[j] === 'tel') {
              var regx = /(1[\d]{2}[\s]?[\d]{4}[\s]?[\d]{4})/g
              var str = data[i][rows[j] + ''] + ''
              var phoneNums = str.match(regx)
              if (phoneNums !== null) { row.push(phoneNums[0]) } else {
                row.push(null)
              }
              console.log(phoneNums)
            } else {
              row.push(data[i][rows[j] + ''] + '')
            }
          }
          // 将每一个{ }中的数据添加到承载中
          datas.push(row)
        }
        // console.log(datas)
        conf.rows = datas
        // 将所有数据写入nodeExcel中
        const result = nodeExcel.execute(conf)
        // 设置响应头，在Content-Type中加入编码格式为utf-8即可实现文件内容支持中文
        res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8')
        // 设置下载文件命名，中文文件名可以通过编码转化写入到header中。
        res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURI('small') + '.xlsx')
        // 将文件内容传入
        res.end(result, 'binary')
      })
      conn.release()
      //! !用于结束后清空文件夹
      // var files = fs.readdirSync(folderName)
      // files.forEach((file) => {
      //   if (file === '通话.xlsx') {
      //     fs.unlink(folderName + '\\' + file, (err) => {
      //       if (err) throw err
      //       console.log('通话.xlsx已删除...')
      //     })
      //   }
      // })
    }
  })
})

function insert(sql, item) {
  return new Promise((resolve, reject) => {
    pool.getConnection((_err, conn) => {
      conn.query(sql, function(err, result) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          // console.log(result)
          resolve('ok')
        }
      })
      conn.release()
    })
  })
}
// flag 用于标志状态
function modifyFolder(params) {
  return new Promise(function(resolve, reject) {
    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName)
      }
    } catch (err) {
      console.error(err)
    }
    // var getname = () => {
    fs.readdir(folderName, 'utf-8', (err, data) => {
      // var contentName = ''
      if (err) throw err
      console.log(data)
      for (const key of data) {
        if (key === '走访.xlsx' || key === '走访.xls') {
          var promise1 = new Promise((resolve, reject) => {
            // contentName = key
            // console.log(data)
            var oldName = folderName + '\\' + key
            console.log(oldName)
            try {
              // Truncate Table tel
              // 用户表数据
              var userTableData = []
              // 表数据
              var tableData = xlsx.parse(oldName)
              // 循环读取表数据
              for (var val in tableData) {
                // 下标数据
                var itemData = tableData[val]
                for (var index in itemData.data) {
                  // 0为表头数据
                  if (index === 0) {
                    continue
                  }
                  var regx = /(1[\d]{2}[\s]?[\d]{4}[\s]?[\d]{4})/g
                  var str = itemData.data[index][9] + ''
                  var phoneNums = str.match(regx)
                  if (phoneNums !== null) {
                    userTableData.push(...phoneNums)
                  }
                }
                console.log('走访表数据提取：', userTableData)
                var phoneData = [];
                (async() => {
                  pool.getConnection((err, conn) => {
                    if (err) throw err
                    var sql = `Truncate Table tel;`
                    conn.query(sql, (err, result) => {
                      if (err) throw err
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
                  console.log('走访表已导入到数据库')
                  // 修改一个 resolve()
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
              // console.log('-------------end-------------')
            } catch (e) {
              // 输出日志
              console.log('excel读取异常,error=%s', e.stack)
            }
            resolve(1)
          })
        }
      }
    })
  })
  // return new Promise((resolve, reject) => {})
}

// modifyFolder()
