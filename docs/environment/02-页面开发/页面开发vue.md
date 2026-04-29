---
title: 页面开发[vue]
sidebar: auto
collapsable: true
---

# 页面开发[vue]



||     时间     | 作者  | 备注 |
||:----------:|:---:| :------ |
|| 2024-12-12 | 孟佳佳 | 初稿 |
|| 2024-12-19 | 孟佳佳 | 调整vue页面开发骨架工程地址 |
|| 2025-2-28 | 张剑峰 | 完善文档中的相关内容，主要是骨架和后端的代码。本文作为vue-action的案例，后续还会出一个vue-rest的。本文的前端页面代码待修改调试更新。 |
|| 2025-3-28 | 樊志君 | 补充vue组件化骨架说明 |
|| 2025-09-04 | 孟佳佳 | 更新文档中相关链接链接 |
|| 2025-10-11 | 樊志君 | vue+action仅作为特殊场景应用，推荐标准模型vue开发模式 |

- 本篇文档描述的vue+action仅作为特殊场景应用：解决的场景是 项目上后端不想大改，但是前端技术要求是vue的情况；
- 从20251011开始，推荐直接[[标准编码模型vue开发](https://fdoc.epoint.com.cn/onlinedoc/rest/d/RbqMNr "标准编码模型vue开发")](?file=012-快速入门/011-页面开发/030-页面开发[编码模型vue])

## 前置说明

- 在开发之前，需要确保[环境安装](https://fdoc.epoint.com.cn/onlinedoc/rest/d/A3YRVf)都到位了，本文来做一个用户管理功能，用户管理的数据表使用框架内置的frame_user。
- 本文涉及的[[工程结构规范](https://fdoc.epoint.com.cn/onlinedoc/rest/d/M3Azya "工程结构规范")](?file=010-项目介绍/020-技术规范/010-工程管理/010-工程结构规范)、前端的一些技能：[页面结构](http://192.168.219.170/docs/vue/frame/guide/developer-guide.html#页面开发)、[布局](http://192.168.219.170/docs/vue/latest/frame/guide/layout/container.html)、[[控件](https://fdoc.epoint.com.cn/onlinedoc/rest/d/zyMRZf "控件")](?file=015-核心框架/015-FDD/006-VUE/095-开发指南/030-控件/001-简单表单控件/001-Button按钮控件)、后端的一些技能：[[DAO简介](https://fdoc.epoint.com.cn/onlinedoc/rest/d/j2Qfyy "控件")](?file=015-核心框架/015-FDD/010-DAO/010-简介)、[[持久层规范](https://fdoc.epoint.com.cn/onlinedoc/rest/d/qMneUz "持久层规范")](?file=015-核心框架/015-FDD/010-DAO/030-开发指南/010-基础/020-持久层编码规范)、[[增删改查](https://fdoc.epoint.com.cn/onlinedoc/rest/d/e6Nrqi "增删改查")](?file=015-核心框架/015-FDD/010-DAO/030-开发指南/010-基础/030-增删改查)可以提前做些了解，可以辅助理解下面的代码。
- 本文讲解的是前端vue、后端Action的编码实现方式，但后端Action的编码相较于之前会有些许不同，具体在下面章节会详细介绍；未来会推荐大家使用前端vue、后端rest的编码模型。

## 下载开发骨架
- 在vue的技术体系下，前后台的代码放置在不同的工程中。

### 下载后端开发骨架

- [后端工程骨架下载地址](http://192.168.0.200/frame-public-group/epoint-component-demo/-/tree/dev/vue20251011)
- 通过git bash下载，在命令窗口中输入`git clone -b feature/example http://192.168.0.200/frame-public-group/epoint-component-demo.git`，然后回车即可下载到页面开发骨架。
- 注意:本工程中`epoint-component-vue`为标准编码模型rest开发模式，如需aciotn模式的，请先清空`epoint-component-vue`，然后执行`eui-cli comp`后 选择aciotn模式刷新目录，具体见[[准备环境-vue组件化环境安装-创建vue组件化工程](https://fdoc.epoint.com.cn/onlinedoc/rest/d/IJzi6b "准备环境-vue组件化环境安装-创建vue组件化工程")](?file=012-快速入门/006-启动项目/001-准备环境)
- 导入IDE中

![020-1743144915118.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=0318dfd4-a86d-4495-9ad2-4ed04ae76752)


- 工程骨架说明：
```
├── epoint-component-demo  -- 管理工程（用于外部jar包依赖管理，以及自身包的管理）
│   ├── epoint-component-action      -- 控制层工程（强依赖逻辑层工程、包含前端mini页面）
│   │   ├── pom.xml
│   ├── epoint-component-api      -- 服务接口工程
│   │   ├── pom.xml
│   ├── epoint-component-service      -- 逻辑层工程
│   │   ├── pom.xml
│   ├── epoint-component-vue      -- vue组件页面工程
│   │   ├── package.json
│   ├── pom.xml
```

### 下载页面开发骨架
- 组件化vue页面开发骨架已包含在`epoint-component-vue`中，另外还需要vue-web工程，具体结构参考[[工程结构规范](https://fdoc.epoint.com.cn/onlinedoc/rest/d/M3Azya "工程结构规范")](?file=010-项目介绍/020-技术规范/010-工程管理/010-工程结构规范)
- 导入IDE中

- 页面骨架说明：
```
    ├─dist                  # 打包后的目录
    ├─public                # 公共静态资源目录
    └─src
       ├─api                # 接口文件 (仅限全局公用，否则请在页面目录内内聚)
       ├─assets             # 资源文件 (仅限全局公用，否则请在页面目录内内聚)
       ├─components         # 组件文件 (仅限全局公用，否则请在页面目录内内聚)
       ├─frame              # 框架资源目录，不允许修改
       ├─layouts            # 布局
       ├─locales            # 语言
       ├─router             # 路由
       ├─store              # 状态管理
       ├─views              # 页面管理
       ├    └─frame-ou          # 部门管理目录（这里以部门管理为例子，实际项目中根据各自需求创建）
       ├        ├─api.js        # 部门管理相关页面使用的所有接口请求所在文件
       ├        ├─edit.vue      # 部门管理相关弹窗编辑等其他该目录所需的子模块（命名和功能看具体子模块所需，可多个）
       └        └─list.vue      # 部门管理列表页面
       └─utils              # 通用工具方法
```

## 编写服务
[[编写服务](https://fdoc.epoint.com.cn/onlinedoc/rest/d/jyUJnm "编写服务")](?file=012-快速入门/011-页面开发/010-页面开发[miniui])

## 编写前台页面
- 在admin工程的admin/src/views目录下新建一个文件夹user
- 在user文件夹内新建3个vue页面：列表页（userlist）、编辑页（useredit）、详情页（userdetail）

    ![1226072733901200.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=61a8b72b-16c6-4b94-a3a5-38cb2251ce40)

### 列表页
```vue
<template>
  <e-container class="fui-page">
    <e-header>
      <e-title title="用户列表" show-refresh show-help>
        <template #help>
          <p>通过'导出'按钮导出的组织架构数据无法通过'模板化导入按钮'导入, 请使用'模板化导出'按钮导出后再导入;</p>
          <p>拖拽排序功能只支持部门内操作,需要打开搜索框勾选直属用户选项</p>
        </template>
      </e-title>
    </e-header>
    <e-container>
      <e-left title="选择部门">
        <e-tree v-model:expanded-keys="expandedKeys" :data="treeData" show-filter :load-more="loadMore" :filter-method="filterMethod" :field-names="fieldNames" @select="onNodeClick" />
      </e-left>
      <e-main>
        <e-toolbar-new ref="toolbarRef" v-model:filter-model="searchParams" :btn-list="toolbarBtnList" :max-btn-display-count="4" :filter-list="toolbarFilterList" @filter="onFilter" />
        <e-content v-slot="{ height }">
          <data-grid
                  ref="tableRef"
                  id-field="userGuid"
                  :data="dataSource"
                  :total="total"
                  show-selection-column
                  :current="current"
                  :page-size="pageSize"
                  :columns="columnList"
                  :height="height"
                  :loading="loading"
                  @change="onTableChange"
                  @refresh="refresh"
          >
            <template #bodyCell="{ column, text, record }">
              <template v-if="column.dataIndex === 'displayName'">
                <e-button link @click="openDetail(record)">{{ text }}</e-button>
              </template>
              <template v-else-if="column.dataIndex === 'jzqk' && text === '有兼职'">
                <e-button link style="color: red" @click="showSecondOu(record)">{{ text }}</e-button>
              </template>
              <template v-else-if="column.dataIndex === 'jzqk'">
                <e-button link style="color: #3472d7" @click="showSecondOu(record)">{{ text }}</e-button>
              </template>
              <template v-else-if="column.dataIndex === 'zt'"><i :class="`zt-dot ${text === '启用' ? 'success' : 'error'}`" />{{ text }} </template>
            </template>
          </data-grid>
        </e-content>
      </e-main>
    </e-container>
  </e-container>

  <e-dialog v-model="dialogVisible" :title="subDialogTitle" :width="dialogSize.width" :height="dialogSize.height">
    <edit v-if="dialogVisible" :user-guid="curUserGuid" :left-guid="ouGuid" :ou-name="ouName" :is-copy="isCopy" @save="updateFrameUser" @cancel="dialogVisible = false" />
  </e-dialog>
  <e-dialog v-model="detailDialogVisible" title="用户详情" :width="dialogSize.width" :height="dialogSize.height">
    <detail v-if="detailDialogVisible" :user-guid="curUserGuid" :left-guid="ouGuid" :ou-name="ouName" :is-copy="isCopy" @cancel="detailDialogVisible = false" />
  </e-dialog>
</template>

<script setup>
import { computed, getCurrentInstance, reactive, ref } from 'vue';
import { EMessage, EMessageBox } from '@epoint-fe/eui-components';
import { useTableDataSource, useTreeDataSource } from '@epoint-fe/eui-hooks';
import { EContent, ETitle, EToolbarNew } from '@frame/layouts';
import DataGrid from '@frame/components/datagrid/datagrid.vue';
import { getRightUrl, getUrlParams, action2restFactory } from '@epoint-fe/utils';
import Edit from './useredit.vue';
import Detail from './userdetail.vue';

const action2rest = action2restFactory.action2restAxios;

const tableRef = ref();
const toolbarRef = ref();
const isSub = getUrlParams('isSub');

const dialogSize = computed(() => ({
  width: Math.min(window.innerWidth, 1400),
  height: Math.min(window.innerHeight, 900)
}));

const { fieldNames, loadMore, filterMethod, expandedKeys, dataSource: treeData } = useTreeDataSource('/frameuserlistaction/getTreeModel');

const enabledOptions = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '启用',
    value: '1'
  },
  {
    label: '禁用',
    value: '0'
  }
];
const searchParams = reactive({
  userName: '',
  loginId: '',
  ouName: '',
  enabled: ''
});
const columnList = [
  { dataIndex: 'displayName', title: '用户姓名', ellipsis: true },
  { dataIndex: 'showLoginId', title: '用户登录名', width: 200 },
  { dataIndex: 'ouName', title: '所在部门', ellipsis: true, width: 200 },
  { dataIndex: 'jzqk', title: '兼职情况', ellipsis: true, width: 200 },
  { dataIndex: 'zt', title: '状态', width: 100 },
  {
    dataIndex: 'orderNumber',
    title: '排序',
    width: 100,
    sorter: true,
    editor: { type: 'e-input-number', props: { min: 0, max: 99999999 } }
  },
  {
    title: '操作',
    width: 140,
    key: 'action',
    action: {
      asText: false,
      items: [
        {
          icon: 'Edit',
          label: '编辑',
          onClick: (row) => {
            editRow(row);
          }
        },
        {
          icon: 'CopyDocument',
          label: '复制',
          onClick: (row) => {
            copyRow(row);
          }
        },
        {
          icon: 'Refresh',
          label: '初始化密码',
          onClick: (row) => {
            resetPassword(row);
          }
        },
        {
          icon: 'Setting',
          label: 'USB设置',
          onClick: (row) => {
            keySet(row);
          }
        },
        {
          icon: 'MessageBox',
          label: '模块订阅',
          onClick: (row) => {
            selectModule(row);
          }
        },
        {
          icon: 'Setting',
          label: '配置角色',
          onClick: (row) => {
            selectRole(row);
          }
        },
        {
          icon: 'ChatDotRound',
          label: '复制用户角色模块关系',
          onClick: (row) => {
            copyRight(row);
          }
        }
      ]
    }
  }
];

const ouGuid = ref('');
const ouName = ref('');
const onNodeClick = (selectedKeys, data) => {
  const key = selectedKeys[0];
  ouGuid.value = key === 'f9root' ? '' : key;
  ouName.value = key === 'f9root' ? '' : data.node.text;
};
const refreshTable = () => {
  tableRef.value && tableRef.value.refresh();
};
const params = computed(() => {
  return Object.assign({}, searchParams, {
    leftTreeNodeGuid: ouGuid.value
  });
});
const { dataSource, pageSize, current, total, loading, refresh, onTableChange, goToFirstPage } = useTableDataSource('/frameoulistcontroller/getDataGridData', {
  idField: 'userGuid',
  columns: columnList,
  params
});
const onFilter = () => {
  // 搜索时返回到第一页
  goToFirstPage();
};
const handleRequestCallback = (data) => {
  if (data.success) {
    EMessage.success(data.msg);
    refreshTable();
  } else {
    const msg = data.msg || '保存失败';
    EMessage.error(msg);
  }
};
const saveAll = async () => {
  await action2rest({
    url: 'frameoulistcontroller/saveAll?preoperate=getDataGridData',
    data: {
      params: JSON.stringify({
        data: tableRef.value && tableRef.value.getModifiedData(),
        idField: 'userGuid'
      })
    }
  }).thne((result) => {
    handleRequestCallback(result);
  });
};
const isTableSelected = computed(() => {
  return tableRef.value && tableRef.value.getSelectionRows().length > 0;
});

const deleteSelected = () => {
  EMessageBox.confirm('数据删除后不可恢复', '删除提醒', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const selects = tableRef.value && tableRef.value.getSelectionRows();
    await action2rest({
      url: '/frameoulistcontroller/deleteSelect?preoperate=getDataGridData',
      data: {
        params: JSON.stringify({
          data: selects,
          idField: 'userGuid'
        })
      }
    }).then((result) => {
      handleRequestCallback(result);
    });
  });
};

const setUserEnable = async () => {
  const selects = tableRef.value && tableRef.value.getSelectionRows();
  await action2rest({
    url: '/frameoulistcontroller/setUserEnable?preoperate=getDataGridData',
    data: {
      params: JSON.stringify({
        data: selects,
        idField: 'userGuid'
      })
    }
  }).then((result) => {
    handleRequestCallback(result);
  });
};

const dialogVisible = ref(false);
const isCopy = ref(false);
const detailDialogVisible = ref(false);
const curUserGuid = ref('');
const subDialogTitle = ref('修改用户');
const newRow = () => {
  curUserGuid.value = '';
  isCopy.value = false;
  subDialogTitle.value = '新增用户';
  dialogVisible.value = true;
};
const openDetail = (row) => {
  curUserGuid.value = row.userGuid;
  detailDialogVisible.value = true;
};
const editRow = (row) => {
  curUserGuid.value = row.userGuid;
  isCopy.value = false;
  subDialogTitle.value = '修改用户';
  dialogVisible.value = true;
};
const copyRow = (row) => {
  curUserGuid.value = row.userGuid;
  isCopy.value = true;
  subDialogTitle.value = '复制用户';
  dialogVisible.value = true;
};
const updateFrameUser = () => {
  refreshTable();
  dialogVisible.value = false;
};
const resetPassword = async (row) => {
  if (row.isCopy === 1) {
    EMessageBox.alert('关联账号不允许这么操作', '提示', { type: 'warning' });
  } else {
    EMessageBox.confirm('是否继续初始化密码操作?', '提醒', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await action2rest({
        url: '/frameuserlistaction/rePassword',
        data: {
          cmdparams: JSON.stringify([row.userGuid])
        }
      }).then((result) => {
        handleRequestCallback(result);
      });
    });
  }
};

const { proxy } = getCurrentInstance();

//打开授权角色设置页
const copyRight = async (row) => {
  const url = getRightUrl(`framemanager/orga/orga/user/frameuserroleandmodulecopylist?isSub=${isSub}&userGuid=${row.userGuid}`);
  proxy?.$dialog({
    title: '复制用户角色模块权限',
    url,
    width: 1250,
    height: 580,
    closeCallback: (params) => {
      if (params !== 'close' && params !== '') {
        refreshTable();
      }
    }
  });
};

//打开授权角色设置页
const selectRole = async (row) => {
  const url = getRightUrl(`framemanager/orga/orga/user/settinguserrole?userGuid=${row.userGuid}`);
  proxy?.$dialog({
    title: '设置用户角色关系',
    url,
    width: 710,
    height: 490,
    closeCallback: (params) => {
      if (params !== 'close' && params !== '') {
        refreshTable();
      }
    }
  });
};

//打开模块页
const selectModule = async (row) => {
  let tUrl = `framemanager/orga/uiset/menu/module/subscribemodule/subscribemoduletree?userGuid=${row.userGuid}`;
  if (isSub && isSub == '1') {
    tUrl = `framemanager/orga/uiset/menu/module/sub/subsubscribemoduletree?userGuid=${row.userGuid}`;
  }
  const url = getRightUrl(tUrl);
  proxy?.$dialog({
    title: '订阅模块',
    url,
    width: 1000,
    height: 800
  });
};

const keySet = async (row) => {
  if (row.isCopy === 1) {
    EMessageBox.alert('关联账号不允许这么操作', '提示', { type: 'warning' });
  } else {
    const url = getRightUrl(`framemanager/orga/orga/user/usbkeyset?userGuid=${row.userGuid}&isSub=${isSub}`);
    proxy?.$dialog({
      title: 'USB 设置',
      url,
      width: 950,
      height: 550
    });
  }
};

const showSecondOu = async (record) => {
  if (record.isCopy === 1) {
    EMessageBox.alert('关联账号不允许这么操作', '提示', { type: 'warning' });
  } else {
    const url = getRightUrl(`framemanager/orga/orga/user/framesecondoulist?userGuid=${record.userGuid}&isSub=${isSub}`);
    proxy?.$dialog({
      title: '用户兼职设定',
      url,
      width: 1200,
      height: 600,
      closeCallback: () => {
        refreshTable();
      }
    });
  }
};

const toolbarBtnList = ref([
  {
    type: 'primary',
    onClick: newRow,
    content: '新增用户'
  },
  {
    type: 'primary',
    plain: true,
    onClick: saveAll,
    content: '保存'
  },
  {
    type: 'danger',
    plain: true,
    onClick: deleteSelected,
    disabled: () => !isTableSelected.value,
    content: '删除选定'
  },
  {
    type: 'primary',
    plain: true,
    onClick: setUserEnable,
    disabled: () => !isTableSelected.value,
    content: '启用/禁用'
  },
  {
    type: 'primary',
    plain: true,
    disabled: () => !isTableSelected.value,
    content: '移动'
  },
  {
    type: 'primary',
    plain: true,
    content: '调整排序步长'
  },
  {
    type: 'primary',
    plain: true,
    disabled: () => !isTableSelected.value,
    content: '转移用户角色'
  },
  {
    type: 'primary',
    plain: true,
    disabled: () => !isTableSelected.value,
    content: '授权/取消同步第三方'
  }
]);
const toolbarFilterList = ref([
  {
    label: '用户名',
    prop: 'userName',
    external: true,
    editor: {
      type: 'e-input'
    }
  },
  {
    label: '用户登录名',
    prop: 'loginId',
    external: true,
    editor: {
      type: 'e-input'
    }
  },
  {
    label: '用户生日',
    prop: 'birthday',
    external: true,
    editor: {
      type: 'e-date-picker',
      props: {
        type: 'date',
        valueFormat: 'YYYY-MM-DD'
      }
    }
  },
  {
    label: '状态',
    prop: 'enabled',
    external: false,
    editor: {
      type: 'e-radio-group',
      props: {
        options: enabledOptions
      }
    }
  }
]);
</script>

<style lang="less" scoped>
.zt-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 12px;

  &.success {
    background-color: var(--e-color-success);
  }

  &.error {
    background-color: var(--e-color-error);
  }
}
</style>
```

## 编写控制层Action
- 在`epoint-example-action`工程下新建`class`：`FrameUserListController`并继承`com.epoint.basic.controller.BaseController`。


```java
package com.epoint.basic.frameou.action;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.epoint.basic.controller.BaseController;
import com.epoint.basic.soa.SOAService;
import com.epoint.core.utils.string.StringUtil;
import com.epoint.frame.service.OrganLogCode;
import com.epoint.frame.service.organ.ou.api.IOuServiceInternal;
import com.epoint.frame.service.organ.ou.entity.FrameOu;

/**
 * frameuserlist页面对应的后台
 *
 * @author jixw
 * @version [版本号, 2024-08-12 18:33:50]
 */
@RestController("frameuserlistcontroller")
@Scope("request")
public class FrameUserListController extends BaseController
{

    private FrameUserDemoService service = new FrameUserDemoService();

    private String userName;

    /**
     * 表格控件model
     */
    private DataGridModel<User> model;

    @Override
    public void pageLoad() {
    }


    public DataGridModel<User> getDataGridData() {
        // 获得表格对象
        if (model == null) {
            model = new DataGridModel<User>()
            {

                @Override
                public List<User> fetchData(int first, int pageSize, String sortField, String sortOrder) {
                    PageData<User> pageData = service.paginatorUser(userName, first, pageSize);
                    this.setRowCount(pageData.getRowCount());
                    return pageData.getList();
                }

            };
        }
        return model;
    }

    /**
     * 删除选定用户
     *
     */
    public void deleteSelect(List<String> select) {
        for (String sel : select) {
            service.deleteByGuid(sel);
        }
        addCallbackParam("msg", "成功删除！");
    }


    /**
     * 保存数据
     *
     */
    public void save(User dataBean) {
        if (StringUtil.isNotBlank(dataBean.getUserGuid())) {
            if (!dataBean.getUserGuid().equals(service.findUserguid(dataBean.getLoginId()))) {
                addCallbackParam("msg", "此登录名已经被使用，请重新修改！");
            }
            else {
                dataBean.setUpdatePwd(new Date());
                service.update(dataBean);
                addCallbackParam("msg", "修改成功！");
            }
        }
        else {
            if (service.checkLoginID(dataBean.getLoginId())) {
                addCallbackParam("msg", "此登录名已经被使用，请重新修改！");
            }
            else {
                dataBean.setUserGuid(UUID.randomUUID().toString());
                dataBean.setUpdatePwd(new Date());
                // 为了简便，这里写死用户所在部门为系统管理部
                dataBean.setOuGuid("9579bbf9-31d0-4548-b78f-ea4392bf68f9");
                // 用户密码为系统默认密码
                DataEncryptionUtil encryptUtil = DataEncryptionUtil.getInstanceReversible();
                String pwd = encryptUtil.encryption(ConfigUtil.getFrameConfigPropertiesPrior(EpointKeyNames9.FRAME_CONFIG_DEFAULTPASSWORD), true);
                dataBean.setPassword(pwd);

                service.insert(dataBean);
                addCallbackParam("msg", "保存成功！");
                dataBean = null;
            }
        }
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

}
```

## vue菜单配置
![12558000052000.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=f0493ac6-2599-44f1-a305-f746d1e35fa2)

vue页面菜单配置规范待更新。

## 启动测试
- web工程使用[[启动项目](https://fdoc.epoint.com.cn/onlinedoc/rest/d/JfIRBz "启动项目")](?file=012-快速入门/006-启动项目/003-启动项目/003-开发环境启动)中的`启动后端`
- vue工程使用[[启动项目](https://fdoc.epoint.com.cn/onlinedoc/rest/d/JfIRBz "启动项目")](?file=012-快速入门/006-启动项目/003-启动项目/003-开发环境启动)中的`启动前端（vue）`
- 启动项目，登录后访问`http://localhost:5173/user/userlist`打开用户管理列表页面。

![12632453935900.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=cab8274b-bb34-4fef-8b3b-be77568511d7)

## 核心逻辑讲解
### 前后台交互
- 初始化表单数据通过：`onMounted`函数实现，通过restful接口调用的方式完成整个页面的初始化数据获取。

```typescript
onMounted(async () => {
});
```

- 提交页面通过：`action2rest`方法实现，ajax请求的方式传入服务请求地址及请求参数。

```typescript
const updateFrameUser = async () => {
  return action2rest({
    url: `/frameusereditaction/update?userGuid=${props.userGuid}`,
    data: {
      params: JSON.stringify({
        frameUser: frameUser.value,
        userExtendInfo: userExtendInfo.value,
        jobList: jobList.value
      }),
      cmdParams: JSON.stringify([''])
    }
  });
};
```

- 一些控件的二次请求，则由控件数据源属性绑定数据源对象，通过获取数据源对象绑定的后台方法，由控件内部自行发起请求实现，如表格：
  ![77388467260500.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=32604e2f-67f4-41e4-9655-6bb45211d535)
![77415396016900.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=119969c1-dfc2-4344-8c97-3ad6d3eef714)

### 数据绑定
- 表单数据绑定主要依靠控件的v-model属性来实现，绑定的字段需要与后台定义的对象保持一致，比如用户编辑页面绑定的用户名、登录名，都需要与后台Controller返回的User对象中的属性匹配。

![79690532811900.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=eb1cc1b2-3e5c-4d66-a01a-f2b2b09d2851)
![79723192937700.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=ebe94c89-c2b1-4401-a063-77ae9a6a6219)
