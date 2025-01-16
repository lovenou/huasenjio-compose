(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-141b1ac0"],{"7beb":function(e,a,t){},98500:function(e,a,t){"use strict";t("7beb")},af15:function(e,a,t){"use strict";t.r(a);t("0643"),t("fffc");var i=t("ca7f"),s=t("102f");const o=new(t("dabc").a),r=o.getElementFormValidator.bind(o);var d={name:"AccountUser",components:{TableList:i.a,DialogForm:s.a},data(){return{users:[],tableMap:[{label:"账号",key:"id"},{label:"密码",key:"password"},{label:"昵称",key:"name"},{label:"头像",key:"headImg"},{label:"收录站点",key:"records"},{label:"配置",key:"config"},{label:"权限码",key:"code"},{label:"是否启用",key:"enabled"}],total:0,searchForm:{id:"",name:"",code:""},searchFormMap:[{label:"账号",type:"input",key:"id"},{label:"昵称",type:"input",key:"name"},{label:"权限码",key:"code",type:"select",selectOptions:this.CONSTANT.dictionary.code}],show:!1,mode:"add",formMap:[{label:"账号",key:"id",type:"input",editDisabled:!0},{label:"密码",key:"password",type:"input"},{label:"昵称",key:"name",type:"input"},{label:"头像",key:"headImg",type:"input"},{label:"收录站点",key:"records",type:"input"},{label:"配置",key:"config",type:"input"},{label:"权限码",key:"code",type:"select",selectOptions:this.CONSTANT.dictionary.code},{label:"是否可用",key:"enabled",type:"switch",disabled:!1}],rule:{id:[{validator:r(["isNonEmpty::必填项","minLength:5::长度小于5","maxLength:50::长度大于50","isEmail::请输入邮箱"])}],password:[{validator:r(["isNonEmpty::必填项","minLength:5::长度小于5"])}],name:[{validator:r(["minLength:2::长度小于2","maxLength:20::长度大于20"])}]},form:{id:"",password:"",code:0,name:"",headImg:"",records:"",config:"",enabled:!0},pageNo:1,pageSize:10}},watch:{"form.code":{handler(e){let a=this.formMap.find(e=>"enabled"===e.key);e<2?a.disabled=!1:(this.form.enabled=!0,a.disabled=!0)},deep:!0}},mounted(){this.queryUser()},methods:{queryUser(){let e=Object.assign({pageNo:this.pageNo,pageSize:this.pageSize},this.searchForm);this.API.user.findUserByPage(e,{notify:!1}).then(e=>{this.users=e.data.list,this.total=e.data.total,this.cancel()})},updatePagination(e,a){this.pageNo=e,this.pageSize=a},removeUser(e,a,t,i){this.$store.state.manage.id!==a.id?this.API.user.removeUser({_id:a._id}).then(e=>{this.queryUser()}):this.$tips("error","当前登录账号，不允许被删除！","top-right",1200)},addUser(){this.show=!0,this.mode="add"},editUser(e,a){this.show=!0,this.mode="edit",this.$nextTick(()=>{this.form=Object.assign(this.form,a)})},paginationChange(e,a){this.queryUser()},save(){"edit"===this.mode?this.API.user.updateUser(this.form).then(e=>{this.queryUser()}):"add"===this.mode&&(delete this.form._id,delete this.form._v,this.API.user.addUser(this.form).then(e=>{this.queryUser()}))},cancel(){this.$refs.dialogForm&&this.$refs.dialogForm.close(),this.show=!1}}},n=(t("98500"),t("2877")),l=Object(n.a)(d,(function(){var e=this,a=e._self._c;return a("div",{staticClass:"account-user"},[a("TableList",{attrs:{tableData:e.users,tableMap:e.tableMap,formData:e.searchForm,formMap:e.searchFormMap,showAdd:!0,total:e.total},on:{"update:formData":function(a){e.searchForm=a},"update:form-data":function(a){e.searchForm=a},edit:e.editUser,add:e.addUser,remove:e.removeUser,search:e.queryUser,paginationChange:e.paginationChange,updatePagination:e.updatePagination}}),e.show?a("DialogForm",{ref:"dialogForm",attrs:{width:"460",title:"add"==e.mode?"添加用户":"编辑用户",visible:e.show,mode:e.mode,"close-on-click-modal":!1,buttons:{comfirm:"确 认",cancel:"取 消"},formMap:e.formMap,formData:e.form,formRule:e.rule},on:{"update:visible":function(a){e.show=a},"update:formData":function(a){e.form=a},"update:form-data":function(a){e.form=a},comfirmForm:e.save,cancelForm:e.cancel}}):e._e()],1)}),[],!1,null,null,null);a.default=l.exports}}]);
//# sourceMappingURL=chunk-141b1ac0.6acd8b9e.js.map