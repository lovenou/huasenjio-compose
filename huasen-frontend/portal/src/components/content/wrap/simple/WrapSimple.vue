<!--
 * @Autor: huasenjio
 * @Date: 2022-09-09 22:44:29
 * @LastEditors: huasenjio
 * @LastEditTime: 2023-04-13 00:01:27
 * @Description: 
-->
<template>
  <div class="wrap-simpleMode animate__animated animate__fadeInDown">
    <HomeWallpaper :fullscreen="true"></HomeWallpaper>
    <HomeSearch :top="'180px'"></HomeSearch>
    <!-- 关闭极简模式按钮 -->
    <i @click="closeSimpleMode" class="exit iconfont icon-md-qr-scanner mix-blend-lighten"></i>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import HomeSearch from '@/views/home/search/HomeSearch.vue';
import HomeWallpaper from '@/views/home/wallpaper/HomeWallpaper.vue';
export default {
  name: 'WrapSimple',
  components: { HomeWallpaper, HomeSearch },
  computed: {
    ...mapState(['user']),
  },
  mounted() {
    this.initLocalThemeInfo();
  },
  methods: {
    ...mapMutations(['commitAll']),
    ...mapActions(['snapshoot', 'initLocalThemeInfo']),
    closeSimpleMode() {
      this.commitAll({
        user: {
          config: {
            simpleMode: false,
          },
        },
      });
      this.snapshoot({ paths: ['config.simpleMode'] });
      this.$nextTick(() => {
        // hs-todo：发布一个resize事件
        let event = new Event('resize', { bubbles: true, cancelable: false });
        document.dispatchEvent(event);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap-simpleMode {
  position: absolute;
  width: 100%;
  height: 100%;
  .exit {
    position: absolute;
    padding: 2px;
    bottom: 18px;
    right: 26px;
    font-size: 24px;
    // filter: invert(100%);
    cursor: pointer;
    border-radius: 6px;
    background-color: var(--gray-o5);
  }
}
</style>
