# Think

```javascript
      for(var i of data){
        let obj = {};
        obj.county = i[0];
        console.log(obj);
        obj.aim = i[1]
        obj.number = i[2]
        obj.discount = i[3];
        obj.progress = i[4];
        obj.score = i[5];
        this.tableData.push(obj);
        // console.log(i);
      }
```

**当把let obj = {}; 放在for循环的外面的时候会只能循环最后一个数组为什么？**



#### 记录：    路由配置：router文件夹下index.js

```javascript
import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
Vue.use(Router);

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },

    {
      path: '/morning',
      name: 'morning',
      component: () => import('../views/morning.vue')
    },
    {
      path: '/afternoon',
      name: 'afternoon',
      component: () => import('../views/afternoon.vue')
    },
    {
      path: '/total',
      name: 'total',
      component: () => import('../views/total.vue')
    }
  ]
});


```





#### 记录：这是我重构element ui tabel列动态变换的时候遇到的问题	 当使用for 循环遍历数组的时候tabledata数据不展示，当遍历对象的时候对象tabledata数据展示

```javascript
展示数据但是表头数据有问题不是我想要的数据。         
		  let sent = {};
          for(let i of response.data.title){
              sent[i] = 0
          }
          for(let key in this.tableData[0]){
            this.tableColumns2.push({
                prop: key,
                label: key,
                align: 'center'
            });
          }
          this.tableColumns2[0].fixed = 'fixed';

//方法二，不展示数据只是展示表头数据

          let title = response.data.title;
          for(let j = 0; j < title.length; j++){
            if(j == 0){
                this.tableColumns2.push({
                prop: title[j],
                fixed: 'fixed',
                label: title[j],
                align: 'center',
                width: '100'
            });
            }else{
                this.tableColumns2.push({
                prop: title[j],
                label: title[j],
                align: 'center'
            });
            }
          }
          console.log(this.tableData);
        })
        
        
    // 已经解决，其实与for in或者for  of没有关系，tabledata数据对象的key值与prop的值不对应，key值是我自己加上去的，这样反而限制了对象的灵活性，直接把返回的title对象的值作为data对象的key一步到位！
```



#### 记录keep-alive

```
##### 概念

    keep-alive 是 Vue 的内置组件，当它包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。和 transition 相似，keep-alive 是一个抽象组件：它自身不会渲染成一个 DOM 元素，也不会出现在父组件链中。

##### 作用

    在组件切换过程中将状态保留在内存中，防止重复渲染DOM，减少加载时间及性能消耗，提高用户体验性

##### 原理

    在 created 函数调用时将需要缓存的 VNode 节点保存在 this.cache 中／在 render（页面渲染） 时，如果 VNode 的 name 符合缓存条件（可以用 include 以及 exclude 控制），则会从 this.cache 中取出之前缓存的 VNode 实例进行渲染。

    **VNode**：虚拟DOM，其实就是一个JS对象
```

### 关于this

```JavaScript
我的答案：
person1  person2
window  person2 X ==>window 
window  window  person2
window  window  window  all X


person1   person2
window   window   all X  person1   person1
window   window   person2
person1   person2   person1



window   window   person2

obj   person2   obj

链接：https://mp.weixin.qq.com/s/hYm0JgBI25grNG_2sCRlTA
```











