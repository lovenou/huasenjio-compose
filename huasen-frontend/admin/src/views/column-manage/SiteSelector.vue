<!--
 * @Autor: huasenjio
 * @Date: 2022-09-12 10:40:59
 * @LastEditors: huasenjio
 * @LastEditTime: 2023-05-28 13:25:28
 * @Description: 网站选择器
-->

<template>
  <HsDrawer v-bind="$attrs" v-on="$listeners">
    <div class="site-selector">
      <div class="site-selector-main">
        <div class="selected">
          <div class="header">
            <div class="title">已选择</div>
          </div>
          <ul class="site-list">
            <template v-if="selectSites.length">
              <Draggable v-model="selectSites" filter=".no-drap" animation="400">
                <transition-group>
                  <li class="site-item drag-item" v-for="(item, index) in selectSites" :key="item._id">
                    <i class="el-icon-rank pointer"></i>
                    <div class="name text no-drap">{{ item.name | emptyTip }}</div>
                    <div class="description text no-drap">{{ item.description | emptyTip }}</div>
                    <i class="el-icon-delete pointer remove no-drap" @click="remove(item, index)"></i>
                  </li>
                </transition-group>
              </Draggable>
            </template>
            <el-empty v-else :image-size="60" description="请选择展示的网站"></el-empty>
          </ul>
        </div>
        <div class="selecting">
          <div class="header">
            <div class="title">待选择</div>
            <div class="search">
              <el-select v-model="searchType">
                <el-option :label="'标签名'" :value="'tag'"> </el-option>
                <el-option :label="'网站名'" :value="'siteName'"> </el-option>
              </el-select>
              <el-input :placeholder="searchPlaceholderText" suffix-icon="el-icon-search" v-model="searchText"> </el-input>
            </div>
          </div>
          <ul class="site-group">
            <li class="site" :class="{ active: getSelectStatus(site) }" v-for="site in displaySites" :key="site._id" @click="selectSite(site)">
              <div class="icon-group">
                <img v-lazy :src="imgUrl(site)" />
              </div>
              <div class="text-group">
                <div :title="site.name" class="name text">{{ site.name | emptyTip }}</div>
                <div :title="site.description" class="description text">{{ showTag ? site.targetTagName : site.description | emptyTip }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="site-selector-footer">
        <el-button type="primary" plain @click="save">确定配置</el-button>
        <el-button type="warning" plain @click="cancel">取消修改</el-button>
      </div>
    </div>
  </HsDrawer>
</template>
<script>
import Draggable from 'vuedraggable';
import HsDrawer from '@/components/common/drawer/Drawer.vue';
export default {
  name: 'SiteSelector',

  components: { HsDrawer, Draggable },

  props: {
    currentColumn: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      searchText: '',
      searchType: 'siteName', // tag || siteName
      selectSites: [],
      selectSiteIndex: [],
      sites: [],
      // 初始化选中的链接id
      preSelectSiteIndex: [],
    };
  },

  computed: {
    displaySites() {
      if (this.searchType === 'tag') {
        if (!this.searchText) {
          // 没有搜索字符时，展示全部
          return this.sites;
        } else {
          // 匹配tag，展示命中的站点
          return this.sites.filter(item => {
            if (item.expand && item.expand !== '{}') {
              try {
                let tags = JSON.parse(item.expand).tag;
                return tags.some(tagName => {
                  if (tagName.toUpperCase().includes(this.searchText.toUpperCase())) {
                    item.targetTagName = tagName;
                    return true;
                  }
                });
              } catch {
                console.log('标签筛选异常');
              }
            }
          });
        }
      } else {
        return this.sites.filter(item => item.name.toUpperCase().includes(this.searchText.toUpperCase()));
      }
    },
    searchPlaceholderText() {
      return '请输入' + (this.searchType === 'tag' ? '标签' : '网站') + '名称';
    },
    showTag() {
      return this.searchText && this.searchType === 'tag';
    },
  },

  watch: {
    selectSiteIndex() {
      this.handleSelectSite();
    },

    sites() {
      this.handleSelectSite();
    },

    currentColumn: {
      handler(nV, oV) {
        try {
          this.selectSiteIndex = Array.isArray(JSON.parse(nV.siteStore)) ? [...JSON.parse(nV.siteStore)] : [];
          // 保存第一次初始化的选中链接
          this.preSelectSiteIndex = [...this.selectSiteIndex];
        } catch (err) {
          this.selectSiteIndex = [];
        }
      },
      deep: true,
      immediate: true,
    },
  },

  mounted() {
    this.querySite();
  },

  methods: {
    querySite() {
      this.API.site.findSiteByList({}, { notify: false }).then(res => {
        this.sites = res.data;
      });
    },

    handleSelectSite() {
      let selectSiteTemp = [];
      this.selectSiteIndex.forEach(_id => {
        this.sites.some(site => {
          if (site._id === _id) {
            selectSiteTemp.push(site);
            // 一真则真，中断查找
            return true;
          }
        });
      });
      this.selectSites = selectSiteTemp;
    },

    getSelectStatus(site) {
      return this.selectSiteIndex.includes(site._id);
    },

    imgUrl(site) {
      return site.icon ? site.icon : require('@/assets/img/error/image-error.png');
    },

    selectSite(site) {
      let { _id } = site;
      let existInex = this.selectSiteIndex.indexOf(_id);
      if (existInex === -1) {
        // 不存在
        this.selectSiteIndex.push(_id);
      } else {
        // 存在
        this.selectSiteIndex.splice(existInex, 1);
      }
    },

    async save() {
      let needBindSite = [];
      let needUnbindSite = [];
      needUnbindSite = this.preSelectSiteIndex.filter(el => this.selectSiteIndex.indexOf(el) === -1);
      needBindSite = this.selectSiteIndex.filter(el => this.preSelectSiteIndex.indexOf(el) === -1);
      // 更改栏目
      let siteStore = this.selectSites.map(item => item._id);
      await this.API.column.updateColumn({
        _id: this.currentColumn._id,
        siteStore: JSON.stringify(siteStore),
      });
      // 选择性绑定/解绑
      if (needBindSite.length) {
        await this.API.site.bindColumnToSite(
          {
            columnId: this.currentColumn._id,
            sites: needBindSite,
          },
          {
            notify: false,
          },
        );
      }
      if (needUnbindSite.length) {
        await this.API.site.unbindColumnToSite(
          {
            columnId: this.currentColumn._id,
            sites: needUnbindSite,
          },
          {
            notify: false,
          },
        );
      }
      this.$emit('save');
    },

    cancel() {
      this.$emit('cancel');
      this.$emit('update:visible', false);
    },

    remove(site, index) {
      let existInex = this.selectSiteIndex.indexOf(site._id);
      if (existInex !== -1) {
        // 不存在
        this.selectSiteIndex.splice(existInex, 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.site-selector {
  width: 100%;
  height: 100%;
  .site-selector-main {
    width: 100%;
    height: calc(100% - 60px);
    overflow-x: hidden;
    overflow-y: auto;
    .selected {
      width: calc(100% - 20px);
      height: calc(40% - 20px);
      margin: 10px auto;
      padding: 10px 10px;
      border-radius: 2px;
      background-color: var(--gray-0);
      overflow-x: hidden;
      overflow-y: auto;
      .site-list {
        width: 100%;
        height: calc(100% - 34px);
        margin-top: 10px;
        overflow-x: hidden;
        overflow-y: auto;
        .site-item {
          display: flex;
          align-items: center;
          margin-top: 8px;
          .name {
            max-width: 120px;
            margin-left: 10px;
          }
          .description {
            flex: 1;
            font-size: 12px;
            color: var(--gray-500);
            margin-left: 10px;
          }
          i {
            width: 20px;
            font-size: 20px;
          }
          .drag {
            color: var(--gray-600);
          }
          .remove {
            margin-left: auto;
            color: var(--red-500);
          }
        }
      }
    }
    .selecting {
      width: calc(100% - 20px);
      height: calc(60% - 20px);
      margin: 10px auto;
      padding: 10px 10px;
      border-radius: 2px;
      background-color: var(--gray-0);
      overflow-x: hidden;
      overflow-y: auto;
      .site-group {
        width: 100%;
        height: calc(100% - 90px);
        margin-top: 14px;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        overflow-x: hidden;
        overflow-y: auto;
        .site {
          position: relative;
          width: 148px;
          height: 54px;
          padding: 6px 8px;
          margin-top: 10px;
          margin-left: 4px;
          display: flex;
          border: 1px solid var(--gray-100);
          background-color: var(--gray-0);
          box-shadow: 0px 0px 20px -5px rgba(158, 158, 158, 0.2);
          transition: all 0.3s ease;
          border-radius: 4px;
          cursor: pointer;
          .icon-group {
            width: 36px;
            height: 36px;
            border: 1px solid var(--gray-200);
            overflow: hidden;
            border-radius: 4px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .text-group {
            width: calc(100% - 6px - 36px);
            margin-left: 6px;
            .name {
              width: 100%;
              color: var(--gray-700);
              font-size: 14px;
            }
            .description {
              width: 100%;
              color: var(--gray-500);
              font-size: 12px;
            }
          }
          &:hover {
            transform: translateY(-3px);
            box-shadow: 0 26px 20px -24px var(--gray-700);
          }
        }
        .active {
          &::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            display: block;
            width: 100%;
            height: 3px;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            background-color: var(--green-400);
          }
        }
      }
    }
    .title {
      margin-bottom: 6px;
      font-size: 16px;
    }
    .search {
      display: flex;
      ::v-deep .el-select {
        width: 100px;
        margin-right: 2px;
        input {
          padding-left: 10px;
          padding-right: 25px;
        }
        .el-input__suffix {
          right: 0;
        }
      }
    }
  }
  .site-selector-footer {
    width: 100%;
    height: 60px;
    padding: 10px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: auto;
    background-color: var(--gray-0);
  }
  /*隐藏滚动条*/
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
