// lesson1

// // 这句的意思就是引入 `express` 模块，并将它赋予 `express` 这个变量等待使用。
// var express = require('express');
// // 调用 express 实例，它是一个函数，不带参数调用时，会返回一个 express 实例，将这个变量赋予 app 变量。
// var app = express();

// // app 本身有很多方法，其中包括最常用的 get、post、put/patch、delete，在这里我们调用其中的 get 方法，为我们的 `/` 路径指定一个 handler 函数。
// // 这个 handler 函数会接收 req 和 res 两个对象，他们分别是请求的 request 和 response。
// // request 中包含了浏览器传来的各种信息，比如 query 啊，body 啊，headers 啊之类的，都可以通过 req 对象访问到。
// // res 对象，我们一般不从里面取信息，而是通过它来定制我们向浏览器输出的信息，比如 header 信息，比如想要向浏览器输出的内容。这里我们调用了它的 #send 方法，向浏览器输出一个字符串。
// app.get('/',function(req,res){
//     res.send("我回来了！");
// })

// // 定义好我们 app 的行为之后，让它监听本地的 3000 端口。这里的第二个函数是个回调函数，会在 listen 动作成功后执行，我们这里执行了一个命令行输出操作，告诉我们监听动作已完成。
// app.listen(3000,function(){
//     console.log("app is listen at port 3000...");
// })

// lesson2
// // 引入依赖
// var express = require("express");
// var utility = require("utility");
// // 建立 express 实例
// var app = express();

// app.get('/',function(req,res){
//   // 从 req.query 中取出我们的 q 参数。
//   // 如果是 post 传来的 body 数据，则是在 req.body 里面，不过 express 默认不处理 body 中的信息，需要引入 https://github.com/expressjs/body-parser 这个中间件才会处理，这个后面会讲到。
//   // 如果分不清什么是 query，什么是 body 的话，那就需要补一下 http 的知识了
//   var q = req.query.q;

//   // 调用 utility.md5 方法，得到 md5 之后的值
//   // 之所以使用 utility 这个库来生成 md5 值，其实只是习惯问题。每个人都有自己习惯的技术堆栈，
//   // 我刚入职阿里的时候跟着苏千和朴灵混，所以也混到了不少他们的技术堆栈，仅此而已。
//   // utility 的 github 地址：https://github.com/node-modules/utility
//   // 里面定义了很多常用且比较杂的辅助方法，可以去看看
//   var md5Value = utility.md5(q);

//   res.send(md5Value);
// });

// app.listen(3000,function(req,res){
//     console.log("app is running at 3000 port...");
// })

// lesson3

// var express = require("express");
// var superagent = require("superagent");
// var cheerio = require("cheerio");

// var app = express();

// app.get('/', function (req, res, next) {
//     // 用 superagent 去抓取 https://cnodejs.org/ 的内容
//     superagent.get('https://cnodejs.org/')
//       .end(function (err, sres) {
//         // 常规的错误处理
//         if (err) {
//           return next(err);
//         }
//         // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
//         // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
//         // 剩下就都是 jquery 的内容了
//         var $ = cheerio.load(sres.text);
//         var items = [];
//         $('#topic_list .topic_title').each(function (idx, element) {
//           var $element = $(element);
//           items.push({
//             title: $element.attr('title'),
//             href: $element.attr('href')
//         });
//         console.log($element);
//         });

//         res.send(items);
//       });
//   });

//   app.listen(3000,function(req,res){
//       console.log("app is listen at 3000 port!");
//   })

// lesson4

var express = require('express')
var eventproxy = require('eventproxy')
var superagent = require('superagent')
var cheerio = require('cheerio')
// url 模块是 Node.js 标准库里面的
// http://nodejs.org/api/url.html
var url = require('url')
var app = express()

var cnodeUrl = 'https://cnodejs.org/'

superagent.get(cnodeUrl).end(function(err, res) {
  if (err) {
    return console.error(err)
  }
  var topicUrls = []
  var $ = cheerio.load(res.text)
  // 获取界面所有链接
  $('#topic_list .topic_title').each(function(idx, element) {
    var $element = $(element)
    // console.log($element);
    // $element.attr('href)本来的样子是  /topic/542acd7d5d28233425538b04
    // 我们用url.resolve来自动推断出完整url，变成
    // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
    // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
    var href = url.resolve(cnodeUrl, $element.attr('href'))
    topicUrls.push(href)
  })
  // console.log(topicUrls);
  // 得到一个 eventproxy 的实例
  var ep = new eventproxy()

  // 命令 ep 重复监听 topicUrls.length 次（在这里也就是 40 次） `topic_html` 事件再行动
  ep.after('topic_html', topicUrls.length, function(topics) {
    // topics 是个数组，包含了 40 次 ep.emit('topic_html', pair) 中的那 40 个 pair

    // 开始行动
    topics = topics.map(function(topicPair) {
      // 接下来都是 jquery 的用法了
      var topicUrl = topicPair[0]
      var topicHtml = topicPair[1]
      var $ = cheerio.load(topicHtml)
      return ({
        title: $('.topic_full_title').text().trim(),
        href: topicUrl,
        comment1: $('.reply_content').eq(0).text().trim()
      })
    })

    // console.log('final:');
    console.log(topics)
  })

  topicUrls.forEach(function(topicUrl) {
    superagent.get(topicUrl)
      .end(function(err, res) {
        // console.log('fetch ' + topicUrl + ' successful');
        ep.emit('topic_html', [topicUrl, res.text])
      })
  })
})
app.listen(3000, function(req, res) {
  console.log('app is listen at 3000 port...')
})
