<!--
 * @Autor: huasenjio
 * @Date: 2022-10-07 10:21:54
 * @LastEditors: huasenjio
 * @LastEditTime: 2023-04-13 00:20:58
 * @Description: 管理员账号管理
-->

<template>
  <div class="account-admin">
    <TableList
      :tableData="manages"
      :tableMap="tableMap"
      :formData.sync="searchForm"
      :formMap="searchFormMap"
      :showAdd="true"
      :total="total"
      @edit="editManage"
      @add="addManage"
      @remove="removeManage"
      @search="queryManage"
      @paginationChange="paginationChange"
      @updatePagination="updatePagination"
    ></TableList>
    <DialogForm
      v-if="show"
      ref="dialogForm"
      width="460"
      :title="mode == 'add' ? '添加管理员' : '编辑管理员'"
      :visible.sync="show"
      :mode="mode"
      :close-on-click-modal="false"
      :buttons="{ comfirm: '确 认', cancel: '取 消' }"
      :formMap="formMap"
      :formData.sync="form"
      :formRule="rule"
      @comfirmForm="save"
      @cancelForm="cancel"
    ></DialogForm>
  </div>
</template>

<script>
import TableList from '@/components/content/table-list/TableList.vue';
import DialogForm from '@/components/content/dialog-form/DialogForm.vue';
import { Validator } from 'huasen-lib';
const validator = new Validator();
const getElementFormValidator = validator.getElementFormValidator.bind(validator);
export default {
  name: 'AccountAdmin',
  components: { TableList, DialogForm },
  data() {
    return {
      // 表格相关
      manages: [],
      tableMap: [
        {
          label: '账号',
          key: 'id',
        },
        {
          label: '密码',
          key: 'password',
        },
        {
          label: '权限码',
          key: 'code',
        },
      ],
      total: 0,

      // 搜索表单
      searchForm: {
        id: '',
        code: '',
      },
      searchFormMap: [
        {
          label: '账号',
          type: 'input',
          key: 'id',
        },
        {
          label: '权限码',
          key: 'code',
          type: 'select',
          selectOptions: this.CONSTANT.dictionary.code,
        },
      ],

      // 添加编辑表单
      show: false,
      mode: 'add',
      formMap: [
        {
          label: '账号',
          key: 'id',
          type: 'input',
          editDisabled: true,
        },
        {
          label: '密码',
          key: 'password',
          type: 'input',
        },
        {
          label: '权限码',
          key: 'code',
          type: 'select',
          selectOptions: this.CONSTANT.dictionary.code,
        },
      ],
      rule: {
        id: [{ validator: getElementFormValidator(['isNonEmpty::必填项', 'minLength:5::长度小于5', 'maxLength:20::长度大于20', 'isEmail::请输入邮箱']) }],
        password: [{ validator: getElementFormValidator(['isNonEmpty::必填项', 'minLength:5::长度小于5', 'maxLength:50::长度大于50']) }],
      },
      form: {
        id: '',
        password: '',
        code: 0,
      },
      pageNo: 1,
      pageSize: 10,
    };
  },
  mounted() {
    this.queryManage();
  },
  methods: {
    queryManage() {
      let params = Object.assign(
        {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        },
        this.searchForm,
      );
      this.API.manage
        .findManageByPage(params, {
          notify: false,
        })
        .then(res => {
          this.manages = res.data.list;
          this.total = res.data.total;
          this.cancel();
        });
    },
    updatePagination(pageNo, pageSize) {
      this.pageNo = pageNo;
      this.pageSize = pageSize;
    },
    removeManage(index, row, pageNo, pageSize) {
      if (this.$store.state.manage.id === row.id) {
        this.$tips('error', '当前登录账号，不允许被删除！', 'top-right', 1200);
        return;
      }
      if (row.code >= 3) {
        if (this.manages.filter(item => item.code >= 3).length <= 1) {
          this.$tips('error', '至少保留一个权限码 >= 3 的管理员', 'top-right', 1200);
          return;
        }
      }
      this.API.manage.removeManage({ _id: row._id }).then(res => {
        this.queryManage();
      });
    },
    addManage() {
      this.show = true;
      this.mode = 'add';
    },
    editManage(index, row) {
      this.show = true;
      this.mode = 'edit';
      this.$nextTick(() => {
        this.form = Object.assign(this.form, row);
      });
    },
    // 分页组件发生变化
    paginationChange(pageNo, pageSize) {
      this.queryManage();
    },
    save() {
      if (this.mode === 'edit') {
        this.API.manage.updateManage(this.form).then(res => {
          this.queryManage();
        });
      } else if (this.mode === 'add') {
        delete this.form._id;
        delete this.form._v;
        this.API.manage.addManage(this.form).then(res => {
          this.queryManage();
        });
      }
    },
    cancel() {
      if (this.$refs.dialogForm) {
        this.$refs.dialogForm.close();
      }
      this.show = false;
    },
  },
};
</script>

<style>
.account-admin {
  width: 100%;
  height: 100%;
}
</style>
