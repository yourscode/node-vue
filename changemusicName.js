const fs = require('fs')
const path = require('path')

var musicPath = path.resolve('C:\\Users\\The man\\Downloads\\Music')
fs.readdir(musicPath, (err, data) => {
  if (err) throw err
  // var arr = data.map((item, index) => {
  //   return item.replace(/正在播放- /g, '')
  // })
  // console.log(arr)
  for (var item of data) {
    if (item.indexOf('正在播放') !== -1) {
      // fs.readFile(`${musicPath}/${item}`, (err, data) => {
      console.log(item)
      if (err) throw err
      var newitem = item.replace(/正在播放- /g, '')
      // console.log(newitem)
      fs.rename(`${musicPath}/${item}`, `${musicPath}/${newitem}` + path.extname(item), (err) => {
        if (!err) {
          console.log('get')
        }
      })
      // })
    }
  }
})
