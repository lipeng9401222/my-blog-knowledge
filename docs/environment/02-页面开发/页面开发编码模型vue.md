---
title: 页面开发[编码模型vue]
sidebar: auto
collapsable: true
---

# 页面开发[编码模型vue]



||     时间     | 作者  | 备注              |
||:----------:|:---:|:----------------|
|| 2025-09-02 | 孟佳佳 | 初稿              |
|| 2025-09-09 | 孟佳佳 | 补充移动端vue开发及代码资源 |
|| 2025-10-11 | 樊志君 | 补充内容 |


- 本文讲解的是前端vue、后端rest的编码模型实现方式。

## 前置说明

- 在开发之前，需要确保[[环境安装](https://fdoc.epoint.com.cn/onlinedoc/rest/d/A3YRVf "环境安装")](?file=012-快速入门/001-安装环境)都到位了，本文来做一个用户管理功能，用户管理的数据表使用框架内置的frame_user。
- 本文涉及的[[工程结构规范](https://fdoc.epoint.com.cn/onlinedoc/rest/d/M3Azya "工程结构规范")](?file=010-项目介绍/020-技术规范/010-工程管理/010-工程结构规范)、前端的一些技能：[页面结构](http://192.168.219.170/docs/vue/latest/frame/guide/developer-guide.html#页面开发)、[布局](http://192.168.219.170/docs/vue/latest/frame/guide/layout/container.html)、[[控件](https://fdoc.epoint.com.cn/onlinedoc/rest/d/zyMRZf "控件")](?file=015-核心框架/015-FDD/006-VUE/095-开发指南/030-控件/001-简单表单控件/001-Button按钮控件)、后端的一些技能：[[DAO简介](https://fdoc.epoint.com.cn/onlinedoc/rest/d/E36BRz "DAO简介")](?file=015-核心框架/015-FDD/010-DAO/010-简介)、[[持久层规范](https://fdoc.epoint.com.cn/onlinedoc/rest/d/qMneUz "持久层规范")](?file=015-核心框架/015-FDD/010-DAO/030-开发指南/010-基础/020-持久层编码规范)、[[增删改查](https://fdoc.epoint.com.cn/onlinedoc/rest/d/e6Nrqi "增删改查")](?file=015-核心框架/015-FDD/010-DAO/030-开发指南/010-基础/030-增删改查)可以提前做些了解，可以辅助理解下面的代码。


## 下载开发骨架
[[下载开发骨架](https://fdoc.epoint.com.cn/onlinedoc/rest/d/Y3mUry "下载开发骨架")](?file=012-快速入门/011-页面开发/010-页面开发[vue]#下载开发骨架)

## 编写服务
由于标准模型编码使用标准restful接口发起服务端调用所有控件相关的调用全部由底层封装，树模型、图片上传等均需在底层接口定义后进行实现。
具体服务端开发规范可参考文档：[[基础规范](https://fdoc.epoint.com.cn/onlinedoc/rest/d/NnE7rq "基础规范")](files=015-核心框架/015-FDD/009-编码模型/010-编码规范/010-基础规范.md)

### mis表添加
在mis平台创建新表或添加业务相关已存在的表，此为必须过程。若为新表，则通过mis平台生成实体即可。生成后的实体拷贝的业务包路径下。

![25821761853500.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=12f8adf5-4875-46d5-af96-2769d00b4cb0)

![25869855002800.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=96aecee9-1a60-4203-983d-b7a0b71e4351)

### 接口
- 在`epoint-component-api`工程下新建package：`com.epoint.model.testou.api`，然后新建`interface`（接口）：`ITestOuService`

此处给出简单调用实现案例：
```java
import java.util.Map;
import com.epoint.api.manage.annotation.ApiDescription;
import com.epoint.basic.faces.export.ExportModel;
import com.epoint.core.dto.model.TreeModel;
import com.epoint.core.dto.restmodel.context.CommonContext;
import com.epoint.core.dto.restmodel.result.PageResult;
import com.epoint.model.testou.api.entity.TestOu;
import com.epoint.workflow.controller.restmodel.context.WorkflowCommonContext;

public interface ITestOuService
{
    /**
     * 新增
     *
     * @param ouContext
     * @return void
     */
    void addOu(CommonContext ouContext);

    /**
     * 删除
     *
     * @param ouContext
     * @return void
     */
    void deleteOu(CommonContext ouContext);

    /**
     * 更新单条
     *
     * @param ouContext
     * @return void
     */
    void updateOu(CommonContext ouContext);

    /**
     * 查询
     *
     * @param workflowCommonContext
     * @return com.epoint.testou.api.entity.TestOu
     */
    TestOu getTestOu(WorkflowCommonContext workflowCommonContext);

    /**
     * 保存
     *
     * @param workflowCommonContext
     * @return void
     */
    Map<String, Object> saveOu(WorkflowCommonContext workflowCommonContext);

    /**
     * 列表
     *
     * @param commonContext
     * @return com.epoint.core.dto.restmodel.result.PageResult<com.epoint.testou.api.entity.TestOu>
     */
    PageResult<TestOu> getPageResult(@ApiDescription("commonContext") CommonContext commonContext);

    /**
     * 导出模型
     *
     * @return com.epoint.basic.faces.export.ExportModel
     */
    ExportModel getExportModel();

    /**
     * 部门树
     *
     * @param context
     * @return com.epoint.core.dto.model.TreeModel
     */
    TreeModel getTreeModel(CommonContext context);
}
```

### 实现
- 在`epoint-component-service`工程下新建package：`com.epoint.model.testou.service`，然后新建`class`（实现）：`TestOuServiceImpl`

此处给出简单调用实现案例：
```java
import java.util.*;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;
import com.epoint.basic.faces.export.ExportModel;
import com.epoint.basic.faces.tree.ConstValue9;
import com.epoint.basic.faces.tree.LazyTreeModal9;
import com.epoint.basic.faces.tree.SimpleFetchHandler9;
import com.epoint.basic.faces.tree.TreeData;
import com.epoint.core.dto.base.TreeNode;
import com.epoint.core.dto.model.TreeModel;
import com.epoint.core.dto.restmodel.context.CommonContext;
import com.epoint.core.dto.restmodel.query.Condition;
import com.epoint.core.dto.restmodel.result.PageResult;
import com.epoint.core.utils.collection.EpointCollectionUtils;
import com.epoint.core.utils.container.ContainerFactory;
import com.epoint.core.utils.log.LogUtil;
import com.epoint.core.utils.string.StringUtil;
import com.epoint.frame.service.metadata.mis.common.api.IMisCommonService;
import com.epoint.model.testou.api.ITestOuService;
import com.epoint.model.testou.api.entity.TestOu;
import com.epoint.workflow.controller.restmodel.api.IWorkflowCommonService;
import com.epoint.workflow.controller.restmodel.context.WorkflowCommonContext;
import com.epoint.workflow.service.common.entity.execute.WorkflowWorkItem;
import com.epoint.workflow.service.common.util.WorkflowKeyNames9;
import com.epoint.workflow.service.external.api.IWFInstanceDataAPI9;

@Component
public class TestOuServiceImpl implements ITestOuService {
    /**
     * 新增
     *
     * @param ouContext
     *
     * @return void
     */
    @Override
    public void addOu(CommonContext ouContext) {
        IMisCommonService misService = ContainerFactory.getContainInfo().getComponent(IMisCommonService.class);
        misService.insert(ouContext);
    }

    /**
     * 删除
     *
     * @param ouContext
     *
     * @return void
     */
    @Override
    public void deleteOu(CommonContext ouContext) {
        IMisCommonService misService = ContainerFactory.getContainInfo().getComponent(IMisCommonService.class);
        misService.deleteById(ouContext);
    }

    /**
     * 更新单条
     *
     * @param ouContext
     *
     * @return void
     */
    @Override
    public void updateOu(CommonContext ouContext) {
        IMisCommonService misService = ContainerFactory.getContainInfo().getComponent(IMisCommonService.class);
        misService.update(ouContext);
    }

    /**
     * 查询
     *
     * @param workflowCommonContext
     *
     * @return com.epoint.testou.api.entity.TestOu
     */
    @Override
    public TestOu getTestOu(WorkflowCommonContext workflowCommonContext) {
        IMisCommonService misCommonService = ContainerFactory.getContainInfo().getComponent(IMisCommonService.class);
        IWFInstanceDataAPI9 instanceapi = ContainerFactory.getContainInfo().getComponent(IWFInstanceDataAPI9.class);
        // 兼容工作流场景再次打开根绝pviGuid查询场景
        String rowGuid = "";
        if (EpointCollectionUtils.isEmpty(workflowCommonContext.getPageConditions())
                || EpointCollectionUtils.isEmpty(workflowCommonContext.getPageConditions("rowguid"))) {
            if (StringUtil.isNotBlank(workflowCommonContext.getProcessVersionInstanceGuid())) {
                // 获取相关参数
                rowGuid = instanceapi.getContextItemValue(workflowCommonContext.getProcessVersionInstanceGuid(),
                        workflowCommonContext.getMainTable());
                if (StringUtil.isNotBlank(rowGuid)) {
                    workflowCommonContext.addCondition(new Condition("rowguid", "eq", rowGuid));
                }
            }
        } else {
            List<Condition> ouguids = workflowCommonContext.getPageConditions("rowguid");
            if (EpointCollectionUtils.isNotEmpty(ouguids) && ouguids.get(0) != null) {
                rowGuid = (String) ouguids.get(0).getValue();
            }
        }
        if (StringUtil.isBlank(rowGuid)) {
            return new TestOu();
        }
        return misCommonService.find(workflowCommonContext, TestOu.class);
    }

    /**
     * 保存（新增或修改）
     *
     * @param workflowCommonContext
     *
     * @return void
     */
    @Override
    public Map<String, Object> saveOu(WorkflowCommonContext workflowCommonContext) {
        Map<String, Object> dataMap = new HashMap<String, Object>();
        try {
            TestOu mainEntity = (TestOu) workflowCommonContext.getEntityList().get(0).get(CommonContext.MAINENTITY);
            if (StringUtil.isBlank(mainEntity.getRowguid())
                    && StringUtil.isNotBlank(workflowCommonContext.getRowGuid())) {
                String rowGuid = workflowCommonContext.getRowGuid();
                if (StringUtil.isNotBlank(rowGuid)) {
                    mainEntity.setRowguid(rowGuid);
                }
            }
            if (StringUtil.isNotBlank(mainEntity.getRowguid())) {
                workflowCommonContext.ignoreKeyConflictMode();
                // 修改
                updateOu(workflowCommonContext);
            } else {
                mainEntity.setRowguid(UUID.randomUUID().toString());
                // 新增
                addOu(workflowCommonContext);
            }

            // 判断有无异常信息，有的话提前结束
            if (StringUtil.isBlank(workflowCommonContext.getMessage())) {
                // 启动流程场景
                // 判断request里面是否有pviguid和workitemguid，两个都没有就是发起，需要手动设置下operatetype为启动工作流，然后再把context传给工作流的operate方法
                if (StringUtil.isBlank(workflowCommonContext.getWorkitemGuid())
                        && StringUtil.isBlank(workflowCommonContext.getProcessVersionInstanceGuid())
                        && StringUtil.isNotBlank(workflowCommonContext.getProcessGuid())) {
                    workflowCommonContext.getOperateParams().setOperateType(WorkflowKeyNames9.OperationType_Start);
                    IWorkflowCommonService workflowCommonService = ContainerFactory.getContainInfo()
                            .getComponent(IWorkflowCommonService.class);
                    dataMap = workflowCommonService.operate(workflowCommonContext);
                }
                dataMap.put("message", "保存成功！");
                dataMap.put("flag", "success");
            } else {
                dataMap.put("message", workflowCommonContext.getMessage());
            }
            if (StringUtil.isBlank(mainEntity.getPviguid(), false) && dataMap.containsKey("currentWorkItem")) {
                WorkflowWorkItem workflowWorkItem = (WorkflowWorkItem) dataMap.get("currentWorkItem");
                mainEntity.getModifyFlag().clear();
                mainEntity.setPviguid(workflowWorkItem.getProcessVersionInstanceGuid());
                updateOu(workflowCommonContext);
            }
        } catch (Exception e) {
            dataMap.put("message", "保存失败！");
            Logger log = LogUtil.getSLF4JLog(TestOuServiceImpl.class);
            log.error(e.getMessage(), e);
        }
        return dataMap;
    }

    /**
     * 列表
     *
     * @param commonContext
     *
     * @return com.epoint.core.dto.restmodel.result.PageResult<com.epoint.testou.api.entity.TestOu>
     */
    @Override
    public PageResult<TestOu> getPageResult(CommonContext commonContext) {
        IMisCommonService misCommonService = ContainerFactory.getContainInfo().getComponent(IMisCommonService.class);
        return misCommonService.pageList(commonContext, TestOu.class);
    }

    /**
     * 导出模型
     *
     * @return com.epoint.basic.faces.export.ExportModel
     */
    @Override
    public ExportModel getExportModel() {
        // ,独立单位,子流转
        return new ExportModel("ouname", "部门名称");
    }

    /**
     * 部门树
     *
     * @param context
     *
     * @return com.epoint.core.dto.model.TreeModel
     */
    @Override
    public TreeModel getTreeModel(CommonContext context) {
        // 取出树节点条件、构建treenode（用于查询）
        TreeNode selected = context.getTreenode().getNode();
        // 构建树模型
        LazyTreeModal9 treeModel = new LazyTreeModal9(new SimpleFetchHandler9() {
            @Override
            @SuppressWarnings({"unchecked", "rawtypes"})
            public List<?> fetchData(int level, TreeData obj) {
                return getPageResult(context).getData();
            }

            @Override
            public int fetchChildCount(TreeData obj) {
                return 0;
            }

            @Override
            @SuppressWarnings("unchecked")
            public List<?> search(String condition) {
                // TODO Auto-generated method stub
                return null;
            }

            @Override
            public List<TreeData> changeDBListToTreeDataList(List<?> objlist) {
                List<TreeData> result = new ArrayList<TreeData>();
                if (objlist != null && !objlist.isEmpty()) {
                    for (Object obj : objlist) {
                        TreeData data = new TreeData();
                        if (obj instanceof TestOu) {
                            TestOu item = (TestOu) obj;
                            data.setTitle(item.getOuname());
                            data.setObjectGuid(item.getRowguid());
                            data.setPath("parent");
                            data.setLeaf(false);
                            data.setNoClick(true);
                        } else {
                            TestOu item = (TestOu) obj;
                            data.setTitle(item.getOuname());
                            data.setObjectGuid(item.getRowguid());
                            data.setLeaf(true);
                        }
                        result.add(data);
                    }
                }

                return result;
            }
        });
        treeModel.setRootName("所有部门");
        Map<String, Object> customParamsMap = context.getCustomParamsMap();
        if (customParamsMap.containsKey("selectou")
                && "1".equalsIgnoreCase(customParamsMap.get("selectou").toString())) {
            treeModel.setTreeType(ConstValue9.RADIO_SINGLE);
            treeModel.setRootSelect(false);
        }
        if (selected != null && StringUtil.isNotBlank(selected.getId())) {
            treeModel.setTreeNode(selected);
        }
        return treeModel;

    }
}
```

### controller
- 在`epoint-component-action`工程下新建package：`com.epoint.model.testou.controller`，然后新建`class`（接口）：`TestOuControllerTestOuController`

此处给出简单调用实现案例：
```java
import java.util.Collections;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.epoint.basic.faces.export.DataExport;
import com.epoint.basic.faces.export.ExportModel;
import com.epoint.basic.faces.export.Q_DataExport;
import com.epoint.core.dto.restmodel.RestResult;
import com.epoint.core.dto.restmodel.context.CommonContext;
import com.epoint.core.dto.restmodel.context.RequestContextConverter;
import com.epoint.core.dto.restmodel.query.Condition;
import com.epoint.core.dto.restmodel.request.CommonParams;
import com.epoint.core.dto.restmodel.request.CommonRequest;
import com.epoint.core.dto.restmodel.result.PageResult;
import com.epoint.core.grammar.Record;
import com.epoint.core.utils.json.JsonUtil;
import com.epoint.core.utils.web.WebUtil;
import com.epoint.model.testou.api.ITestOuService;
import com.epoint.model.testou.api.entity.TestOu;
import com.epoint.workflow.controller.restmodel.WorkflowBaseModelController;
import com.epoint.workflow.controller.restmodel.api.IWorkflowCommonService;
import com.epoint.workflow.controller.restmodel.context.WorkflowCommonContext;
import com.epoint.workflow.controller.restmodel.context.WorkflowRequestContextConverter;

@RestController
@RequestMapping("/testoucontroller")
public class TestOuController extends WorkflowBaseModelController
{

    @Autowired
    ITestOuService testOuService;

    @Autowired
    private IWorkflowCommonService workflowCommonService;

    @RequestMapping("/getOuList")
    public RestResult<PageResult<TestOu>> getOuList(@RequestBody CommonRequest<TestOu> request) {
        CommonContext ouContext = RequestContextConverter.convertToContext(request, TestOu.class, CommonContext.class);
        PageResult<TestOu> pageResult = testOuService.getPageResult(ouContext);
        return RestResult.success(pageResult);
    }

    /**
     * 获取用户详情
     *
     * @param request
     * @return
     */
    @RequestMapping("/getTestOu")
    public RestResult<TestOu> getTestOu(@RequestBody CommonRequest<TestOu> request) {
        WorkflowCommonContext workflowCommonContext = WorkflowRequestContextConverter
                .convertToWorkflowCommonContext(request, TestOu.class);
        return RestResult.success(testOuService.getTestOu(workflowCommonContext));
    }

    /**
     * 工作流页面保存按钮使用
     *
     * @param request
     * @return
     */
    @RequestMapping("/save")
    public RestResult<Map<String, Object>> save(@RequestBody CommonRequest<TestOu> request) {
        this.authorize(null);
        WorkflowCommonContext workflowCommonContext = WorkflowRequestContextConverter
                .convertToWorkflowCommonContext(request, TestOu.class);
        Map<String, Object> dataMap = testOuService.saveOu(workflowCommonContext);
        return RestResult.success(dataMap);
    }

    /**
     * 工作流页面提交
     *
     * @param request
     * @return
     */
    @RequestMapping("/submit")
    public RestResult<Boolean> submit(@RequestBody CommonRequest<TestOu> request) {
        this.authorize(null);
        WorkflowCommonContext objectCommonContext = WorkflowRequestContextConverter.convertToCommonContext(request);

        // 后续流转
        workflowCommonService.operate(objectCommonContext);

        return RestResult.success();
    }

    /**
     * 可拓展入参规范-批量删除用户
     *
     * @param request
     * @return
     */
    @RequestMapping("/deleteById")
    public RestResult<Boolean> deleteOuById(@RequestBody CommonRequest<TestOu> request) {
        CommonContext commonContext = RequestContextConverter.convertToCommonContext(request, TestOu.class);
        testOuService.deleteOu(commonContext);
        if (!commonContext.isSuccess()) {
            return RestResult.fail(commonContext.getMessage());
        }
        return RestResult.success("删除成功");
    }

    @RequestMapping("/getExportModel")
    public RestResult getExportModel() {
        Q_DataExport exportParams = JsonUtil.objectToObject(
                JsonUtil.jsonToMap(WebUtil.getRequestParameterStr(WebUtil.getRequest(), "params")), Q_DataExport.class);
        DataExport dataExport = new DataExport(exportParams);
        // ,独立单位,子流转
        ExportModel exportModel = testOuService.getExportModel();
        return RestResult.success(dataExport.encode(exportModel));
    }

    @RequestMapping("/export")
    public void export() {
        Q_DataExport dataExport = JsonUtil.objectToObject(
                JsonUtil.jsonToMap(WebUtil.getRequestParameterStr(WebUtil.getRequest(), "params")), Q_DataExport.class);
        // todo 等前端改后这个request就不需要自己构建了
        CommonRequest<Record> request = new CommonRequest<>();
        CommonParams commonParams = new CommonParams();
        commonParams.setConditions(Collections.singletonList(new Condition("rowguid", "nq", "")));
        commonParams.setExportData(dataExport);
        request.setParams(commonParams);
        new <TestOu> RestResult().doExportModel(this.getClass(), "getOuList", testOuService.getExportModel(), request);
    }

    /**
     * 获取部门懒加载树
     *
     * @param request
     * @return
     */
    @RequestMapping("/getTreeModel")
    public RestResult<Map<String, Object>> getTreeModel(@RequestBody CommonRequest request) {
        CommonContext context = RequestContextConverter.convertToCommonContext(request, TestOu.class);
        return RestResult.convertTreeModel(testOuService.getTreeModel(context), context);
    }
}
```

## vue菜单配置

菜单配置：

![14332474647900.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=f9ea18b1-cc13-42c9-91ab-2de68aa18206)

路由配置：

![14357831913000.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=9f549976-4b2c-4c40-bde4-1fc324a61b6f)

vue页面菜单配置规范待更新。

## 启动测试
- web工程使用[[启动项目](https://fdoc.epoint.com.cn/onlinedoc/rest/d/JfIRBz "启动项目")](?file=012-快速入门/006-启动项目/003-启动项目/003-开发环境启动)中的`启动后端`
- vue工程使用[[启动项目](https://fdoc.epoint.com.cn/onlinedoc/rest/d/JfIRBz "启动项目")](?file=012-快速入门/006-启动项目/003-启动项目/003-开发环境启动)中的`启动前端（vue）`
- 启动项目，登录后访问`http://localhost:5173/epoint-web/admin/testou-list`打开测试部门管理列表页面。

![14431602809500.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=167b6751-d1c5-4633-abe6-a64ab935fc32)

## 核心逻辑讲解
### 前后台交互
- 初始化表单数据通过：`onMounted`函数实现，通过restful接口调用的方式完成整个页面的初始化数据获取。

```typescript
onMounted(async () => {
});
```

- 提交页面通过：`request`方法实现，ajax请求的方式传入服务请求地址及请求参数。

```typescript
const getTestOuByGuid = async (rowGuid) => {
  return request({
    url: `/testoucontroller/getTestOu`,
    data: {
      params: {
        conditions: [
          {
            path: 'rowguid',
            type: 'EQ',
            value: rowGuid
          }
        ]
      }
    }
  });
};
```

## demo资源包
可下载[[demo资源包](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=b8f4bf51-eb0d-43e7-9ed0-ba4d24ac3f7b)](./../../../assets/012/011/demo资源包.rar)到本地工程查看示例。
