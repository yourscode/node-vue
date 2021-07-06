function repeat(func, times, wait) {
  return async function(...arr) {
    for (let i = 0; i < times; i++) {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(func.apply(this, arr))
        }, wait)
      })
    }
  }
}

const repeatFunc = repeat(alert, 4, 3000)
repeatFunc('hello,world')
// function repeat(func, times, wait) {
//   return async function(...arr) {
//     for (let i = 0; i < times; i++){
//       await new Promise((resolve, reject) => {
//         setTimeout(() => {
//         resolve(func.apply(this,arr))
//         },wait)
//       })
//     }
// }
