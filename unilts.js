var db = {}

db.queryExcel = function(filename, sql) {
  return new Promise(function(resolve, reject) {
    if (!sql) {
      reject('传参错误!')
      return
    }

    pool.query(sql, function(err, rows, fields) {
      if (err) {
        console.log(err)
        reject(err)
        return
      }

      resolve(rows)
    })
  }).theh(() => {
    var path = '/exportExcel2'
    var sql = ` select b.phone_id,a.* , case when a.地市 is not null then '是' else '否' end 是否通话 
    from sheet1 a RIGHT JOIN converse b on a.集团成员手机号 = b.phone_id;`
    const tempArr = ['phone_id', '集团名称(与证件上一致)', `建档集团编号(92、JX)`, '区县编号', '集团成员姓名', '看管人BOSS工号', '看管人姓名', '是否通话']
    var excelName = '通话用户信息表'
    function exportExcel(path, sql, tempArr, excelName) {
      app.get(path, function(req, res) {
        // 创建一个写入格式map，其中cols(表头)，rows(每一行的数据);
        const conf = {}
        // 在conf中添加cols
        conf.cols = []
        pool.getConnection((err, conn) => {
          if (err) {
            // 执行出错
            throw err
          } else {
            conn.query(sql, (err, data) => {
              if (err) throw err
              // console.log(data[0])
              const rows = []
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
              for (let i = 0; i < data.length; i++) {
                const row = []// 用来装载每次得到的数据
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
              res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURI(excelName) + '.xlsx')
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
    }
  })
}
