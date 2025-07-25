<!--
 * @Autor: huasenjio
 * @Date: 2022-10-06 10:19:56
 * @LastEditors: huasenjio
 * @LastEditTime: 2023-04-25 23:27:22
 * @Description: 表格数据展示组件
-->
<template>
  <div class="table-list">
    <!-- 参数搜索 -->
    <header v-if="showHeader">
      <el-form ref="searchForm" :inline="true" :model="formData">
        <el-row :gutter="10">
          <el-col v-for="(formItem, index) in formMap" :key="index" :span="formItem.span || 5">
            <el-form-item>
              <!-- input -->
              <el-input
                v-if="formItem.type == 'input'"
                v-model="formData[formItem.key]"
                :placeholder="handlePlaceHolder(formItem)"
                @keyup.native.enter="search"
                @clear="search"
                clearable
              ></el-input>
              <!-- select -->
              <el-select v-if="formItem.type == 'select'" v-model="formData[formItem.key]" :placeholder="handlePlaceHolder(formItem)" @change="search">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in formItem.selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button size="small" type="primary" @click="search">查询</el-button>
              <el-button size="small" v-if="showAdd" type="success" @click="add">添加</el-button>
              <el-button size="small" v-if="showAddMany" type="info" @click="addMany">导入/出</el-button>
              <el-popconfirm v-if="showRemoveMany" @confirm="removeMany" class="ml-px-10" popper-class="delete-popcomfirm" title="确定删除吗？">
                <el-button slot="reference" size="small" type="danger">批量删除</el-button>
              </el-popconfirm>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>
    <!-- 中间表格 -->
    <main v-if="showContent">
      <el-table
        ref="table"
        :data="tableData"
        :stripe="true"
        :border="true"
        highlight-current-row
        @selection-change="handleSelectionChange"
        @cell-dblclick="handleCopy"
        height="100%"
      >
        <!-- 多选 -->
        <el-table-column v-if="showSelection" type="selection" width="48"> </el-table-column>
        <!-- 序号 -->
        <el-table-column type="index" width="50" label="序号"> </el-table-column>
        <!-- 数据列 -->
        <el-table-column v-for="(col, index) in tableMap" :key="index" :label="col.label" :width="col.width" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <!-- 图标 -->
            <template v-if="col.key === 'icon'">
              <div class="w-full h-px-30 flex items-center">
                <img v-lazy class="max-w-full max-h-full" :src="scope.row[col.key]" />
              </div>
            </template>
            <!-- 添加时间&更新时间 -->
            <template v-else-if="col.key === 'createTime' || col.key === 'updateTime'">
              <div class="text">{{ formatDate(scope.row[col.key]) }}</div>
            </template>
            <!-- 权限码 -->
            <template v-else-if="col.key === 'code'">
              <el-tag v-if="scope.row[col.key] === 3" type="danger" size="mini">作者权限</el-tag>
              <el-tag v-if="scope.row[col.key] === 2" type="warning" size="mini">管理权限</el-tag>
              <el-tag v-if="scope.row[col.key] === 1" type="info" size="mini">特权用户</el-tag>
              <el-tag v-if="scope.row[col.key] === 0" size="mini">普通用户</el-tag>
            </template>
            <!-- 开关 -->
            <template v-else-if="col.key === 'enabled'">
              <el-switch v-model="scope.row[col.key]" size="mini" disabled></el-switch>
            </template>

            <!-- 其它 -->
            <div v-else class="text">{{ scope.row[col.key] | emptyTip }}</div>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" :width="240">
          <template slot-scope="scope">
            <el-button v-if="showDetail" size="mini" plain @click="detail(scope.$index, scope.row)">详情书</el-button>
            <el-button v-if="showRelation" size="mini" type="info" plain @click="relation(scope.$index, scope.row)">关联</el-button>
            <el-button v-if="showCopy" size="mini" type="warning" plain @click="copy(scope.$index, scope.row)">复制</el-button>
            <el-button v-if="showEdit" size="mini" type="primary" plain @click="edit(scope.$index, scope.row)">编辑</el-button>
            <el-popconfirm v-if="showRemove" @confirm="remove(scope.$index, scope.row)" class="ml-px-10" popper-class="delete-popcomfirm" title="确定删除吗？">
              <el-button slot="reference" size="mini" plain type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <!-- 底部分页 -->
    <footer v-if="showContent">
      <el-pagination
        class="flex mt-px-28"
        @size-change="handlePageSizeChange"
        @current-change="handlePageNoChange"
        :current-page="pagination.pageNo"
        background
        :page-sizes="[10, 20, 50, 100]"
        :pageSize="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        popper-class="page-size-popper"
      >
      </el-pagination>
    </footer>
  </div>
</template>

<script>
import { tool } from 'huasen-lib';
export default {
  name: 'TableList',

  props: {
    formData: {
      type: Object,
      default: () => {
        return {
          name: 'huasen',
        };
      },
    },

    formMap: {
      type: Array,
      default: () => [
        {
          span: 6,
          label: '姓名',
          type: 'input',
          key: 'name',
        },
      ],
    },

    tableMap: {
      type: Array,
      default: () => [
        {
          label: '日期',
          key: 'data',
        },
      ],
    },

    tableData: {
      type: Array,
      default: () => [
        {
          date: '1979-01-01',
        },
      ],
    },

    total: {
      type: Number,
      default: 0,
    },

    showAdd: {
      type: Boolean,
      default: false,
    },
    showAddMany: {
      type: Boolean,
      default: false,
    },
    showRemove: {
      type: Boolean,
      default: true,
    },
    showEdit: {
      type: Boolean,
      default: true,
    },
    showRelation: {
      type: Boolean,
      default: false,
    },
    showCopy: {
      type: Boolean,
      default: false,
    },
    showSelection: {
      type: Boolean,
      default: false,
    },
    showDetail: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    showContent() {
      return this.tableMap.length === 0 ? false : true;
    },
    showHeader() {
      return this.formMap.length === 0 ? false : true;
    },
  },

  data() {
    return {
      pagination: {
        pageNo: 1,
        pageSize: 10,
      },
      // 是否显示多选删除按钮
      showRemoveMany: false,
    };
  },

  watch: {
    pagination: {
      handler(val) {
        this.$emit('updatePagination', val.pageNo, val.pageSize);
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    handleSelectionChange() {
      this.showRemoveMany = this.$refs.table.selection.length === 0 ? false : true;
    },

    handlePlaceHolder(formItem) {
      return `请输入${formItem.label}`;
    },

    handlePageSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.handleEmit('paginationChange', this.pagination.pageNo, pageSize);
    },

    handlePageNoChange(pageNo) {
      this.pagination.pageNo = pageNo;
      this.handleEmit('paginationChange', pageNo, this.pagination.pageSize);
    },

    add() {
      this.$emit('add');
    },

    addMany() {
      this.$emit('addMany');
    },

    remove(index, row) {
      this.handleEmit('remove', index, row, this.pagination.pageNo, this.pagination.pageSize);
    },

    removeMany() {
      let select = this.$refs.table.selection || [];
      this.handleEmit('removeMany', select);
    },

    edit(index, row) {
      this.$emit('edit', index, row);
    },

    detail(index, row) {
      this.$emit('detail', index, row);
    },

    relation(index, row) {
      this.$emit('relation', index, row);
    },

    copy(index, row) {
      this.$emit('copy', index, row);
    },

    search() {
      this.pagination = {
        pageNo: 1,
        pageSize: 10,
      };
      this.handleEmit('search', this.pagination.pageNo, this.pagination.pageSize);
    },

    formatDate(dateStr) {
      return dateStr ? tool.formatDate(dateStr, 'YYYY-MM-DD HH:mm:ss') : '--';
    },

    handleEmit(eventName) {
      this.$nextTick(() => {
        let args = [...Array.from(arguments)];
        args.shift();
        this.$emit(eventName, ...args);
      });
    },

    handleCopy(row, column, cell, event) {
      tool.copyTextToClip(cell.innerText, () => {
        alert('已拷贝单元格内容');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.table-list {
  width: 100%;
  height: 100%;
  header {
    ::v-deep .el-form {
      .el-col {
        .el-form-item {
          width: 100%;
          margin: 10px 0;
          .el-form-item__content {
            width: 100%;
          }
          .el-select {
            width: 100%;
          }
          input {
            width: 100%;
          }
        }
      }
    }
  }
  main {
    width: 100%;
    height: 100%;
  }
  footer {
    ::v-deep .el-pagination {
      .el-pagination__sizes {
        margin-right: auto;
      }
    }
  }
}
</style>
