<!--
 * @Autor: huasenjio
 * @Date: 2022-08-28 18:32:13
 * @LastEditors: huasenjio
 * @LastEditTime: 2022-11-04 00:27:27
 * @Description: 
-->
<template>
  <div id="js-wrap-left" class="wrap-left" v-discolor>
    <div class="logo">
      <img v-lazy :src="brandUrl" />
    </div>
    <ul class="navbar">
      <router-link :to="item.path" v-for="(item, index) in this.navs" :key="index">
        <el-tooltip placement="right" popper-class="wrap-left__navbar__popper" :content="item.name">
          <li>
            <i :class="item.iconClass" class="inherit-text"> </i>
          </li>
        </el-tooltip>
      </router-link>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import navs from '@/config/nav.config.js';
export default {
  name: 'WrapLeft',
  data() {
    return {
      navs,
    };
  },
  computed: {
    ...mapState(['appConfig']),

    brandUrl() {
      return this.appConfig.site.brandUrl;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap-left {
  width: 60px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  .logo {
    width: 100%;
    height: 75px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      position: relative;
      left: 2px;
      width: 40px;
      height: 40px;
    }
  }
  .navbar {
    width: 100%;
    height: calc(100% - 75px);
    a {
      color: inherit;
      li {
        width: 32px;
        height: 32px;
        margin: 20px auto 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
          font-size: 28px;
          color: var(--gray-500);
        }
      }
    }
    .router-link-active {
      i {
        color: var(--red-500) !important;
      }
    }
  }
}
</style>
<style lang="scss">
.wrap-left__navbar__popper {
  left: 52px !important;
}
</style>
