<template>
  <div id="app">
    <!--加载页面动画-->
    <div class="shadow" id="shadow">
      <div class="loading" id="loading" style="display: none">
        <span>L</span>
        <span>o</span>
        <span>a</span>
        <span>d</span>
        <span>i</span>
        <span>n</span>
        <span>g</span>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    created() {
      //在页面加载时读取sessionStorage里的状态信息
      if (sessionStorage.getItem("store")) {
        this.store.replaceState(Object.assign({}, this.store.state, JSON.parse(sessionStorage.getItem(“store”))))
      }
      //在页面刷新时将vuex里的信息保存到sessionStorage里
      window.addEventListener("beforeunload", () => {
        sessionStorage.setItem("store", JSON.stringify(this.$store.state))
      })
    },
  }

  setTimeout(function () {
    let loadingDom = document.getElementById("loading")
    loadingDom.style.display = "block"
  }, 100)
  window.onload = function () {
    let loadDom = document.getElementById("loading")
    loadDom.style.display = "none"
    let shadowDom = document.getElementById("shadow")
    shadowDom.style.display = "none"
  }
</script>

<style>
  @import "assets/css/loadingAnimate.css";

  body {
    margin: 0;
    padding: 0;
  }

  .shadow {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #000000;
    z-index: 1000;
  }

  .shadow .loading {
    position: absolute;
    top: 50%;
    left: 42%;
  }
</style>