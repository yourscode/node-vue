<template>
  <wapper>
    <div id="app">
      <img alt="Vue logo" src="./assets/logo.png">
      <HelloWorld msg="Welcome to Your Vue.js App" />
      <el-button>我回来了！</el-button>
    </div>
  </wapper>

</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Wapper from './components/wapper/src/wapper.vue'
// import card from './components/ezflycard.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    Wapper
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
