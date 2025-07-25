<!--
 * @Autor: huasenjio
 * @Date: 2021-12-08 23:24:34
 * @LastEditors: huasenjio
 * @LastEditTime: 2023-03-28 00:22:35
 * @Description: 
-->
<template>
  <div id="js-home-site" class="home-site" v-discolor>
    <section :id="`site-anchor-${encodeURI(index)}`" v-for="(category, index) in categorySitesData" :key="`${category.typeName}-${index}`">
      <div class="site-item" v-discolor>
        <header>
          <i class="category-icon relative left-px-2 iconfont icon-tag"></i>
          <a class="category-title" :name="category.typeName">{{ category.typeName }}</a>
          <div v-if="showTag(category)" class="w-full pb-px-4 my-px-4 overflow-x-auto overflow-y-hidden">
            <div class="inherit-bg tag-container flex items-center p-px-4 bg-gray-100 rounded-full">
              <!-- 默认占位标签 -->
              <div
                class="inherit-bg flex-shrink-0 text-12px text text-center w-px-80 px-px-2 py-px-4 ml-px-6 first:ml-px-0 hover:bg-blue-400 hover:text-white transition rounded-full pointer"
                title="全部"
                :class="{ selected: category.selectedTag === '' }"
                @click="handleSelectTag(category, '')"
              >
                全部
              </div>
              <!-- 其他标签 -->
              <div
                class="inherit-bg flex-shrink-0 text-12px text text-center w-px-80 px-px-2 py-px-4 ml-px-6 first:ml-px-0 hover:bg-blue-400 hover:text-white transition rounded-full pointer"
                v-for="tagText in category.allTags"
                :key="tagText"
                :title="tagText"
                :class="{ selected: category.selectedTag === tagText }"
                @click="handleSelectTag(category, tagText)"
              >
                {{ tagText }}
              </div>
            </div>
          </div>
        </header>
        <main>
          <ul v-balance>
            <div v-for="(site, i) in handleDisplaySites(category)" :key="`${site.url}-${i}`" class="site relative inherit-text" @click="openDetail(site)">
              <div class="pin-group absolute -top-px-6 right-px-0 w-full h-px-16 flex justify-end">
                <div
                  v-for="(pin, pinIndex) in handlePin(site)"
                  :key="`${pin}-${pinIndex}`"
                  :style="{ backgroundColor: LODASH.get(pinMap, pin + '.color') }"
                  class="w-px-16 h-px-16 mr-px-2 text-12px text-gray-0 flex justify-center items-center rounded-full"
                >
                  <template v-if="LODASH.get(pinMap, pin)">
                    {{ LODASH.get(pinMap, pin + '.label') }}
                  </template>
                </div>
              </div>

              <div class="site-card inherit-text text w-px-180 sm:w-px-150">
                <div class="img-group">
                  <img v-lazy="{ siteUrl: site.url, iconPatch: appConfig.site.autoIconPatch }" :src="imgUrl(site)" />
                  <div class="direct" title="直达站点" @click.stop="goSite(site)"><i class="iconfont icon-xiangyou"></i></div>
                </div>
                <div class="text-group">
                  <div class="name text" :title="site.name">{{ site.name }}</div>
                  <div class="describe inherit-text text" :title="site.description">{{ site.description }}</div>
                </div>
              </div>
            </div>
          </ul>
        </main>
      </div>
    </section>
    <SiteDetail v-if="showDetail" :visible.sync="showDetail" :site="currentSite" :append-to-body="true" @close="closeDetail"></SiteDetail>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { tool } from 'huasen-lib';
import SiteDetail from '@/views/home/site/SiteDetail.vue';
export default {
  name: 'HomeSite',
  components: {
    SiteDetail,
  },
  data() {
    return {
      showDetail: false,
      currentSite: null,
      pinMap: {
        1: {
          label: '热',
          color: 'var(--danger)',
        },
        2: {
          label: '墙',
          color: 'var(--warning)',
        },
        3: {
          label: '优',
          color: 'var(--success)',
        },
        4: {
          label: '免',
          color: 'var(--primary)',
        },
      },
    };
  },
  computed: {
    ...mapState(['appConfig', 'categorySites']),

    categorySitesData() {
      let data = this.LODASH.cloneDeep(this.categorySites) || [];
      data.forEach(item => {
        item.selectedTag = '';
        item.allTags = this.handleCategoryAllTag(item);
      });
      return data;
    },
  },
  mounted() {
    this.$store.dispatch('initLocalThemeInfo');
  },
  methods: {
    showTag(category) {
      return this.LODASH.get(this.appConfig, 'site.openLabelClassification') && category.allTags.length !== 0;
    },
    // 处理图标链接
    imgUrl(site) {
      // return site.icon ? site.icon : require('@/assets/img/error/image-error.png');
      return site.icon;
    },

    // 选择标签
    handleSelectTag(category, tag) {
      category.selectedTag = category.selectedTag === tag ? '' : tag;
      this.$forceUpdate();
    },

    // 通过选中标签，过滤显示站点
    handleDisplaySites(category) {
      if (category.selectedTag) {
        return category.sites.filter(site => site.tags && site.tags.includes(category.selectedTag));
      } else {
        return category.sites;
      }
    },

    // 收集处理栏目中的所有标签（去重），解析绑定站点对应标签
    handleCategoryAllTag(type) {
      let tags = [];
      let sites = this.LODASH.get(type, 'sites') || [];
      sites.forEach(site => {
        let expand = tool.parseJSON(site.expand, 'Object', {});
        let tag = this.LODASH.get(expand, 'tag');
        // 存在
        if (Array.isArray(tag)) {
          site.tags = tag;
          tags = tags.concat(tag);
        }
      });
      tags = Array.from(new Set(tags));
      return tags;
    },

    // 处理置顶
    handlePin(site) {
      let pin = [];
      try {
        let expand = JSON.parse(site.expand);
        pin = expand.pin.slice(0, 6);
      } catch (err) {
        pin = [];
      }
      return pin;
    },

    goSite(site) {
      window.open(site.url, '_blank');
    },

    openDetail(site) {
      this.API.Site.findSiteDetail({ _id: site._id }, { notify: false })
        .then(res => {
          this.currentSite = res.data;
          this.$nextTick(() => {
            this.showDetail = true;
          });
        })
        .catch(err => {});
    },

    closeDetail() {
      this.showDetail = false;
      this.$nextTick(() => {
        this.currentSite = null;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.home-site {
  flex: 1;
  position: relative;
  background-color: var(--gray-50);
  z-index: 1;
  section {
    width: calc(100% - 20px);
    margin: 10px auto 0 auto;
    &:first-of-type {
      margin-top: 0px;
    }
    .site-item {
      padding: 10px;
      border-radius: 2px;
      background-color: var(--gray-0);
      box-sizing: border-box;
      header {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .category-icon {
          font-size: 20px;
          font-weight: 500;
        }
        .category-title {
          margin-left: 8px;
          font-size: 16px;
          font-weight: 500;
        }
        .selected {
          color: var(--gray-0);
          background-color: var(--blue-400);
        }
        .tag-container {
          min-width: max-content;
        }
      }
      main {
        ul {
          display: flex;
          flex-wrap: wrap;
          .site {
            margin-top: 10px;
            .pin-group {
              transition: transform 0.3s ease;
            }
            .site-card {
              position: relative;
              height: 64px;
              padding: 8px;
              display: flex;
              align-items: center;
              border-radius: 3px;
              color: var(--gray-600);
              border: 1px solid rgba(0, 0, 0, 0.02);
              box-shadow: 0px 0px 20px -5px rgba(158, 158, 158, 0.2);
              transition: box-shadow 0.3s ease;
              transition: transform 0.3s ease;
              .img-group {
                position: absolute;
                left: 10px;
                width: 42px;
                height: 42px;
                display: flex;
                justify-content: center;
                align-items: center;
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 100% 100%;
                border-radius: 8px;
                overflow: hidden;
                z-index: 2;
                img {
                  position: absolute;
                  border-radius: 8px;
                  width: 100%;
                  height: 100%;
                }
                .direct {
                  position: absolute;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 8px;
                  width: 100%;
                  height: 100%;
                  background-color: transparent;
                  transition: all 0.3s ease;
                  pointer-events: none;
                  cursor: pointer;
                  i {
                    font-size: 24px;
                    color: transparent;
                    transition: color 0.3s ease;
                  }
                }
              }
              .text-group {
                width: calc(100% - 50px);
                display: block;
                margin-left: 60px;
                .name {
                  font-weight: 500;
                }
                .describe {
                  color: var(--gray-400);
                  font-size: 12px;
                }
              }
              &:hover {
                .img-group {
                  .direct {
                    pointer-events: all;
                    background-color: var(--black-o5);
                    i {
                      color: var(--white);
                    }
                  }
                }
              }
            }
            &:hover {
              .pin-group {
                transform: translateY(-2px);
              }
              .site-card {
                transform: translateY(-2px);
                box-shadow: 0 26px 40px -24px var(--gray-800);
              }
            }
          }
        }
      }
    }
  }
  // 动态插入样式名，实现锚点效果
  .active-anchor {
    header {
      .category-icon {
        color: var(--red-500) !important;
      }
      .category-title {
        color: var(--red-500) !important;
      }
    }
  }
}
</style>
