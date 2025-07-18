<!--
 * @Autor: huasenjio
 * @Date: 2021-12-05 20:23:00
 * @LastEditors: huasenjio
 * @LastEditTime: 2023-06-10 00:12:58
 * @Description: 
-->
<template>
  <div id="js-home-record" class="home-record" v-discolor>
    <header>
      <div class="title">
        自定义网站
        <i class="iconfont icon-md-attach"></i>
      </div>
      <ul>
        <li @click="openAddMode">
          <i class="iconfont icon-tianjia"></i>
          <span class="sm:hidden">添加</span>
        </li>
        <li @click="openEditMode" :class="{ active: isEditMode }">
          <i class="iconfont icon-md-settings"></i>
          <span class="sm:hidden">编辑</span>
        </li>
        <li @click="openDeleteMode" :class="{ active: isDeleteMode }">
          <i class="iconfont icon-md-trash"></i>
          <span class="sm:hidden">管理</span>
        </li>
        <li @click="handleRecovery">
          <i class="iconfont icon-md-sync"></i>
          <span class="sm:hidden">数据</span>
        </li>
        <li @click="openCustomWallpaper">
          <i class="iconfont icon-md-happy"></i>
          <span class="sm:hidden">个性</span>
        </li>
        <li @click="openSimpleMode">
          <i class="iconfont icon-md-qr-scanner"></i>
          <span class="sm:hidden">全屏</span>
        </li>
      </ul>
    </header>
    <main id="js-home-record__main" v-discolor>
      <ul v-balance>
        <li class="record-item" v-for="(item, index) in user.records" :key="`${item}-${index}`">
          <a class="inherit-text text" v-if="!isEditMode" :title="item.name" :href="item.url" :class="{ 'delete-model': isDeleteMode }" target="_blank">
            {{ item.name }}
          </a>
          <!-- 编辑的替身 -->
          <a v-else @click="handleEdit(item, index)" class="pointer text" :class="{ 'edit-mode': isEditMode }">
            {{ item.name }}
          </a>
          <!-- 删除按钮 -->
          <i v-if="isDeleteMode" @click="handleDelete(item)" class="iconfont icon-md-close-circle delete-icon"> </i>
        </li>
      </ul>
    </main>
    <FormDialog
      v-if="showForm"
      :visible.sync="showForm"
      ref="formDialog"
      width="400"
      height="420"
      :buttons="{ comfirm: '确 认', cancel: '取 消' }"
      :title="title"
      :close-on-click-modal="false"
      :formData="formData"
      :formMap="formMap"
      :formRule="formRule"
      @comfirmForm="save"
      @cancelForm="cancel"
    ></FormDialog>
    <CustomDrawer :visible.sync="showCustom" :direction="'rtl'" :size="435" :wrapperClosable="false"></CustomDrawer>
    <RecoveryDialog v-if="showRecovery" :visible.sync="showRecovery" :showMax="false"></RecoveryDialog>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

import { Validator, tool } from 'huasen-lib';
const validator = new Validator();
const getElementFormValidator = validator.getElementFormValidator.bind(validator);

import Bus from '@/plugin/event-bus.js';
import * as BusType from '@/plugin/event-type.js';

import FormDialog from '@/components/content/formDialog/FormDialog.vue';
import CustomDrawer from '@/components/content/customDrawer/CustomDrawer.vue';
import RecoveryDialog from '@/components/content/recoveryDialog/RecoveryDialog.vue';

export default {
  name: 'HomeRecord',
  components: { FormDialog, CustomDrawer, RecoveryDialog },
  data() {
    return {
      // 状态相关
      isEditMode: false,
      isDeleteMode: false,
      showForm: false,
      showCustom: false,
      showRecovery: false,

      // 输入表单相关
      title: '',
      formData: {
        name: '',
        url: '',
        remarks: '',
      },

      formMap: [
        {
          key: 'name',
          label: '站点名称',
          type: 'input',
        },
        {
          key: 'url',
          label: '站点链接',
          type: 'input',
        },
        {
          key: 'remarks',
          label: '备注',
          type: 'textarea',
          minRows: 4,
        },
      ],
      formRule: {
        name: [{ required: true, message: '请输入名称' }, { validator: getElementFormValidator(['isName::请输入汉字/英文/数字']) }],
        url: [{ required: true, message: '请输入链接' }, { validator: getElementFormValidator(['isUrl::请输入正确的网址']) }],
      },
    };
  },
  computed: {
    ...mapState(['user', 'config']),
  },
  watch: {
    // 打开编辑面板时，关闭监听 / 聚焦搜索框事件。
    showForm(val) {
      if (val) {
        Bus.pubEv(BusType.HOME_DESTROY_KEYUP_SLASH);
      } else {
        Bus.pubEv(BusType.HOME_CREATE_KEYUP_SLASH);
      }
    },
  },
  methods: {
    ...mapMutations(['commitAll']),

    openAddMode() {
      this.title = `添加自定义网站`;
      this.isEditMode = false;
      this.isDeleteMode = false;
      this.showForm = true;
    },

    openEditMode() {
      this.isEditMode = !this.isEditMode;
    },

    openDeleteMode() {
      this.isDeleteMode = !this.isDeleteMode;
    },

    // 处理编辑
    handleEdit(site, index) {
      this.title = `编辑自定义网站`;
      this.showForm = true;
      this.$nextTick(() => {
        this.formData = Object.assign(this.formData, site);
      });
    },

    // 打开极简模式
    openSimpleMode() {
      this.handleCommit(
        {
          user: {
            config: {
              simpleMode: !this.user.config.simpleMode,
            },
          },
        },
        ['config.simpleMode'],
      );
    },

    // 删除
    handleDelete(record) {
      let records = [...this.user.records];
      records.map((item, index) => {
        if (item.id == record.id) {
          records.splice(index, 1);
        }
      });
      this.handleCommit(
        {
          user: {
            records: records,
          },
        },
        ['records'],
      );
    },

    // 添加和修改
    save() {
      // 构造数据结构
      let records = [...this.user.records];
      let record = Object.assign(
        {
          id: '',
          name: '',
          url: '',
          remarks: '',
        },
        {
          ...this.formData,
        },
      );
      if (this.isEditMode) {
        // 编辑
        for (let i = 0; i < records.length; i++) {
          if (records[i].id == record.id) {
            records[i] = record;
          }
        }
      } else {
        // 添加
        record.id = tool.getUid(16, 8);
        records.push(record);
      }
      this.handleCommit(
        {
          user: {
            records: records,
          },
        },
        ['records'],
      );
      this.cancel();
    },

    // 取消表单编辑
    cancel() {
      if (this.$refs.formDialog) {
        this.$refs.formDialog.resetFormFields();
      }
      this.showForm = false;
    },

    // 统一处理提交
    handleCommit(data, paths) {
      this.commitAll(data);
      this.$store.dispatch('snapshoot', { paths });
    },

    // 显示备份恢复面板
    async handleRecovery() {
      this.showRecovery = !this.showRecovery;
    },

    openCustomWallpaper() {
      this.showCustom = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.home-record {
  width: 100%;
  margin: 285px auto 0 auto;
  padding: 10px 0 20px 0;
  background-color: var(--gray-0);
  header {
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      i {
        font-size: 20px;
        font-weight: 500;
      }
    }
    ul {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      li {
        margin-left: 10px;
        cursor: pointer;
        i {
          cursor: pointer;
        }
      }
      .active {
        color: var(--red-500);
        i {
          color: var(--red-500);
        }
      }
    }
  }
  main {
    width: calc(100% - 40px);
    margin: 0 auto;
    border-radius: 3px;
    background-color: var(--gray-50);
    ul {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .record-item {
        position: relative;
        width: 128px;
        padding: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        a {
          width: 80%;
          padding: 2px;
          border: 1px solid transparent;
          border-radius: 3px;
          text-align: center;
          color: var(--gray-600);
          &.edit-mode {
            border: 1px solid var(--red-400) !important;
            color: var(--red-400);
          }
          &.delete-model {
            border: 1px solid var(--red-400) !important;
          }
        }
        i {
          position: absolute;
          top: -2px;
          right: 11px;
          cursor: pointer;
        }

        .remove-model {
          border: 1px solid var(--red-400) !important;
        }
        .delete-icon {
          color: var(--red-400);
        }
      }
    }
  }
}
</style>
