// Capture screenshots of websites in various resolutions. A good way to make sure your websites are responsive. It's speedy and generates 100 screenshots from 10 different websites in just over a minute. It can also be used to render SVG images.
// 输入网址和像素大小就能截取屏幕
const Pageres = require('pageres');

(async() => {
  await new Pageres({ delay: 2 })
    .src('http://www.jd.com', ['1280x1024', '1920x2560', 'iphone 5s'], { crop: true })
    .dest(__dirname)
    .run()

  console.log('Finished generating screenshots!')
})()
