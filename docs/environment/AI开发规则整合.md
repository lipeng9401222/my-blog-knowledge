---
title: AI开发规则整合
sidebar: auto
collapsable: true
---

# AI开发规则整合


该文档是整合公司开发实践AI工具时对于各种开发场景的规则整合。

## 后端开发规则整合

### 框架后端开发规则

适用于框架后端开发的通用规则。

```
Always respond in 中文
1、工程环境
jdk1.8，springboot、springcloud、springmvc

2、项目结构
包名：com.epoint
代码分层：html、action、service、api（interface）
代码位置：action工程、api工程、service工程
其他点：
action模块存放html前端页面以及后台action代码。action类相当于controller层
api模块存放接口定义、实体类以及核心代码（在服务化模式下只引用api包）。
service模块存放一些接口实现类以及页面后台所需代码。

3、前端
前端使用自研框架，请分析项目中前端代码后模仿实现。
前端文件的编写请模仿项目中的html文件编写，不要使用开源的编写方法。

- 引入必要的css与js文件
<script src="../../../../frame/fui/js/cssboot.js"></script>
<script src="../../../../rest/resource/jsboot"></script>
请按照已有的前端html文件调整文件相对的路径。

- 前后台交互
-- 初始化页面通过：epoint.initPage方法实现，通过传入后台Action的名称即可完成整个页面的初始化数据获取。
epoint.initPage('frameuserdemolistaction');

-- 提交页面通过：epoint.execute方法实现，通过传入后台Action中的方法名称，以及需要提交的表单域id即可。closeCallback代表需要回调的方法。
function saveAndClose() {
    if (epoint.validate()) {
        epoint.execute('save', 'fui-form', closeCallback);
    }
}

-- 一些控件的二次请求，则由控件属性action绑定的后台方法，由控件内部自行发起请求实现，比如表格。
<div action="getDocDataGrid" allowCellEdit="true" allowCellSelect="true" allowResize="true"
             class="mini-datagrid" editNextOnEnterKey="true" editNextRowCell="true" id="datagrid"
             idField="rowguid" multiSelect="true" name="datagrid" showPager="true" style="width: 100%; height: 100%;">

-- 数据绑定
表单数据绑定主要依靠控件的bind属性来实现，绑定的字段需要与后台定义的对象保持一致，比如用户编辑页面绑定的用户名、登录名，都需要与后台Action返回的User对象中的属性匹配。
<input bind="dataBean.name" class="mini-textbox" emptyText="请输入接口名称" onenter="searchData/>
<input bind="appGuid" class="mini-hidden" onenter="search"/>

4、Action
控制层叫做Action，与常规的rest有些差异
所有的action都需要继承com.epoint.basic.controller.BaseController这个基类，添加RestController注解以及@Scope("request")注解

-- 成员变量与get、set方法编写
成员变量与前端的数据绑定有关。在前端bind绑定后的数据需要在action中编写成员方法以及get、set方法提供使用。

-- pageload方法编写
重写pageload方法，可以初始化一些成员变量和请求参数。

-- 具体逻辑
与前端页面中需要的方法对应编写即可。详细可以参考

5、Service

DAO的接口规范
-实体编写规范
实体类必须继承com.epoint.core.BaseEntity

实体类中不能有属性定义，仅有get、set方法。
get方法内部实现的时候，要根据返回类型来调用父类对应的get：比如Boolean要调用getBoolean、Date要调用getDate、InputStream要调用getInputStream。注意没有getString，String直接get即可
set方法，则直接将数据库字段名称进行映射赋值即可。

public void setServerPath(String serverPath) {
    super.set("serverPath", serverPath);
}
public InputStream getContent() {
    return super.getInputStream("content");
}
类上必须有com.epoint.core.annotation.Entity注解进行标注
下面是Entity注解的一些具体属性使用说明：

table：绑定数据库表名

id：设置物理表的主键

strategy：设置主键生成的策略，如果表的主键是rowId之类自增长的，需要设置此属性值为StrategyType.AUTO
ignore_field：设置忽略字段（通过此属性配置的字段，将不会和数据库进行映射，仅作为普通pojo变量使用）

ignore_insert_field：设置忽略新增字段（通过此属性配置的字段，新增的时候将不会插入到数据库）

ignore_update_field：设置忽略更新字段（通过此属性配置的字段，更新的时候将不会插入到数据库）

stream_field：设置二进制流字段（二进制字段，我们的数据类型一般定义为InputStream，所以必须通过此属性来配置，否则无法做数据类型转换）

-增删改查的使用方式
前提你需要创建一个dao对象，注意包路径：
import com.epoint.core.dao.CommonDao;
import com.epoint.core.dao.ICommonDao;

ICommonDao dao = CommonDao.getInstance();

--查询
---查询数量
String sql = "select count(*) from Frame_User";
int count = dao.queryInt(sql);
//Integer count = dao.find(sql, Integer.class);
//Long count = dao.find(sql, Long.class);
---判断是否存在
String sql = "select count(*) from Frame_User where upper(LoginID)= ?";
boolean exist = dao.queryBoolean(sql, loginID.toUpperCase());
---查询单个字段
String sql = "select displayName from Frame_User where userGuid = ?";
String name = dao.find(sql, String.class, userGuid);
---查询多个字段
//有的时候我们仅想查询一张表的某几个字段，我们写出正常sql之后，一样可以通过dao来返回完整的实体对象或者Record

String sql = "select userGuid,birthday,qqnumber,msnnumber,postalAddress,identityCardNum,isDisable from frame_user_extendinfo where userGuid = ?";
FrameUserExtendInfo info= dao.find(sql, FrameUserExtendInfo.class, userGuid);
// Record info = dao.find(sql, Record.class, userGuid);
---根据主键查询实体对象
FrameUser user = dao.find(FrameUser.class, userGuid);
---查询单个实体对象
String sql = "select * from Frame_User where upper(LoginID)=? ";
FrameUser user = dao.find(sql, FrameUser.class, loginID.toUpperCase());
---查询List实体对象
String sql = "select * from frame_user order by ordernumber ";
List<FrameUser> list = dao.findList(sql, FrameUser.class);
---查询List Map对象
//如果没有建立实体,那么可以通过下面的查询方式，直接返回一个弱类型的Record对象集//合来使用，Record继承自Map，使用方式和Map一致

String sql = "select * from frame_user order by ordernumber ";
List<Record> list = dao.findList(sql, Record.class);
---分页查询List实体对象
//从第20条开始查询
int start = 20 ;
//查询10条记录
int pageSize = 10;
String sql = "select * from frame_user order by ordernumber ";
List<FrameUser> list = dao.findList(sql, start, pageSize, FrameUser.class);
---大数据量查询List
添加了大数据量列表查询接口findBigNumList，其实查询List实体对象及List Map对象的用法与文中findList方法用法相同。

---查询List实体对象

String sql = "select * from frame_user order by ordernumber ";
List<FrameUser> list = dao.findBigNumList(sql, FrameUser.class);
---查询List Map对象

String sql = "select * from frame_user order by ordernumber ";
List<Record> list = dao.findBigNumList(sql, Record.class);

--新增
// 主键是rowID的话，一般依靠数据库的自增来实现,代码不需要显式的赋值 // 如果主键是rowGuid字符串的话,需要使用UUID.randomUUID().toString()来生成guid值赋上

---强类型实体模式
FrameOperationLog fol = new FrameOperationLog();
fol.setOperateDate(new Date());
fol.setOperateUserGuid("45f0c5f9-cad2-49e6-887d-b38dfcbc23de");
fol.setOperateUserDisplayName("系统管理员");
fol.setOperateContent("你插入了一条操作日志");
//直接调用dao的insert完成插入操作
dao.insert(fol);
---弱类型Record模式
//通过表名构建弱类型Record对象
Record fol = new Record("Frame_OperationLog");
//通过字段名、字段值给对象赋值
fol.set("OperateDate", new Date());
fol.set("OperateUserGuid", "45f0c5f9-cad2-49e6-887d-b38dfcbc23de");
fol.set("OperateUserDisplayName", "系统管理员");
fol.set("OperateContent", "你插入了一条操作日志");
//直接调用dao的insert完成插入操作
dao.insert(fol);
---sql
String sql = "insert into Frame_OperationLog (OperateDate,OperateUserGuid,OperateUserDisplayName,OperateContent) values(?,?,?,?)";
// 直接调用dao的execute完成插入操作
dao.execute(sql, new Date(), "45f0c5f9-cad2-49e6-887d-b38dfcbc23de", "系统管理员", "你插入了一条操作日志");

--更新
---强类型实体模式
public void updateFrameUser(FrameUser user) {
    dao.update(user);
}
---弱类型Record模式
//弱类型的更新，需要额外的设置表名、主键字段名称
public void updateFrameUser(Record user) {
    //设置表名
    user.setSql_TableName("Frame_User");
    //设置主键字段名
    user.setPrimaryKeys("userGuid");
    //设置要更新的字段值
    fol.==set==("OperateDate", new Date());
    dao.update(user);
}
注意：弱类型的更新，需要调用set方法，不能使用put，否则将无法触发对应字段的更新。
--sql
public void updateUserLoginTime(Date upDateTime, String userGuid) {
    String sql = "update Frame_User  set upDateTime=? where userGuid=?";
    dao.execute(sql, upDateTime, userGuid);
}
--删除
---强类型实体模式
//这种删除模式比较的少见,大多用于服务端的关联删除,客户端删除一条记录一般都会通过//主键拼接sql进行删除

public void deleteLog(FrameOperationLog log) {
     //直接通过实体对象进行删除
     dao.delete(log);
}
---弱类型Record模式
public void deleteLog(Record log) {
    //设置表名
    log.setSql_TableName("Frame_OperationLog");
    //设置主键字段名
    log.setPrimaryKeys("Row_ID");
    dao.delete(log);
}
---sql
String sql = "Delete From Frame_OperationLog where row_id = ?";
dao.execute(sql, row_id);

注意：
对于pagedata参数，需要设置list和rowcount两个参数，具体可以参考
List<Class> list = dao.findList(sql.toString(), first, pageSize, Class.class, params.toArray());
int total = dao.queryInt("SELECT COUNT(*) FROM (" + sql.toString() + ") t", params.toArray());
return new PageData<>(list, total);

6、一些通用API
-获取用户身份
在action中如果继承basecontroller基类可以直接获取userSession来获取用户身份。
也可以通过protected AbstractSession session = SessionUtil.getInstance();直接获取session。

-记录日志
aciton中可以通过insertSystemLog方法来记录系统日志或者insertOperateLog方法来记录操作日志。具体可以参考其他action类中编写

-其它一些工具类位置：epoint-utils下的方法
在使用通用方法时优先使用框架已有的工具类，具体方法调用请参考已有类中使用，不要用从没有用过的方法。
字符串服务
类名: com.epoint.core.utils.string.StringUtil

功能简介: 提供针对字符串的各项操作能力，包括判空、截取、大小写转换等。

XML服务
类名: com.epoint.core.utils.xml.ReadXML, com.epoint.core.utils.xml.WriteXML, com.epoint.core.utils.xml.BeanXmlUtil

功能简介: 提供针对XML的解析、生成、对象与XML相互转换等能力。

Excel服务
类名: com.epoint.core.utils.excel.parser.ExcelParser, com.epoint.core.utils.excel.generator.ExcelGenerator

功能简介: 提供针对Excel的解析、生成能力。

JSON服务
类名: com.epoint.core.utils.json.JsonUtil

功能简介: 提供Java对象与JSON相互转换的能力。

日期服务
类名: com.epoint.core.utils.date.EpointDateUtil

功能简介: 提供针对Java日期的各种操作，如字符串转日期、获取年月日等。

模拟请求服务
类名: com.epoint.core.utils.httpclient.HttpUtil

功能简介: 提供Java后台模拟HTTP请求的能力，包括GET、POST、文件传输、证书绕过等。

配置文件服务
类名: com.epoint.core.utils.config.ConfigUtil

功能简介: 提供读写Properties配置文件的能力。

文件操作服务
类名: com.epoint.core.utils.file.FileManagerUtil

功能简介: 提供针对文件的各项操作，如读取文件、拷贝文件、遍历文件信息等。

反射服务
类名: com.epoint.core.utils.reflect.ReflectUtil, com.epoint.core.utils.reflect.MethodUtils

功能简介: 提供Java的动态处理能力，包括创建对象、调用普通实例方法、调用静态方法、获取类中方法对象等。

缓存服务
类名: com.epoint.core.utils.memory.RedisCacheUtil, com.epoint.core.utils.memory.EHCacheUtil, com.epoint.core.utils.memory.MemoryUtil

功能简介: 缓存工具类，提供针对缓存的增删改查。三个工具类分别是分布式缓存、本地缓存、通用缓存工具。

图片服务
类名: com.epoint.core.utils.image.ImageUtil

功能简介: 提供各种处理图片的能力，如缩放、旋转、附加水印等。

正则服务
类名: com.epoint.core.utils.regex.RegexValidateUtil

功能简介: 提供各种常规正则验证能力，如邮箱、数字、身份证、手机号码、传真、QQ等。

WebService服务
类名: com.epoint.core.utils.webservice.WebServiceUtil

功能简介: 提供Java与各种技术实现的WebService互通能力，如CXF、Axis2、XFire等。

Web服务
类名: com.epoint.core.utils.web.WebUtil

功能简介: 提供Web场景下各种底层工具方法，如获取当前请求对象、获取请求参数、地址；操作Session、Cookie；判断当前请求是否数据请求、是否页面请求等。

用户会话服务
类名: com.epoint.core.utils.web.SessionUtil

功能简介: UserSession的反射调用工具，用于一些上下级关联错位的应用场景，主要Service中需要获取当前用户信息。

项目路径服务
类名: com.epoint.core.utils.classpath.ClassPathUtil

功能简介: 获取当前项目的部署路径、编译路径。

数据转换服务
类名: com.epoint.core.utils.convert.ConvertUtil

功能简介: 提供针对Java不同数据类型之间相互转换的能力。

数据压缩服务
类名: com.epoint.core.utils.zip.ZipUtil, com.epoint.core.utils.compress.CompressUtil

功能简介: 提供文件压缩、解压缩、数据压缩等能力。

邮件服务
类名: com.epoint.core.utils.email.SendMail, com.epoint.core.email.ReciveMail

功能简介: 提供针对各种外部邮箱的发送、接收邮件的能力，如QQ、新浪、雅虎、163等。

加解密服务
类名: com.epoint.core.utils.security.crypto.AESUtils, com.epoint.core.utils.security.crypto.DESUtils, com.epoint.core.utils.security.crypto.MDUtils, com.epoint.core.utils.security.crypto.sm.sm4.SM4Util, com.epoint.core.utils.security.crypto.sm.sm3.SM3Util, com.epoint.core.utils.security.crypto.sm.sm2.SM2Util, com.epoint.core.utils.security.DataEncryptionUtil, com.epoint.core.utils.security.crypto.ParamEncryptUtil

功能简介: 提供针对各种加解密算法的加密、解密能力。

安全服务
类名: com.epoint.core.utils.security.SafeUtil

功能简介: 提供针对参数的各种校验、数据脱敏能力。

```

### 框架action转rest接口规则

使用该规则可以将框架的action转换为标准的rest接口形式。

```
注意以下事项
首先需要对类定义注解需要改造
控制器定义与注解
移除基类继承：删除 extends BaseController，改用 @RestController 和 @RequestMapping。
添加请求映射：使用 @RequestMapping("/path") 定义控制器级别的路径。@RequestMapping打在类上使用类名全小写即可
作用域调整：保留 @Scope("request")，但不再依赖传统 Action 的生命周期方法（如 pageLoad）。

然后判断属性参数类型
在action类中定义的属性参数，如果初始化或者赋值是使用getRequestParameter获取的那么视为url参数，后续参数转换中使用WebUtil.getRequestParameterStr(WebUtil.getRequest(), 请求参数名称)，否则定义的属性参数请使用@RequestParam传递。

再判断是否需要转换该方法
如果是action类内部调用的方法不需要转换，如果没有被内部调用，除了get、set以及pageload方法都需要转换。

下面是转换方法需要的操作和注意事项:

- 请求处理方法
方法注解：将原 Action 中的公共方法转换为 @RequestMapping 标准的注解。@RequestMapping不需要指定请求方式是post或者get。@RequestMapping()方法上映射名称直接按照方法名即可无需转小写。
参数绑定：使用 @RequestParam 或 @RequestBody 替代原 getParameter() 或成员变量绑定。
移除页面交互逻辑：删除与页面回发（isPostback()）相关的逻辑。

- pageload方法处理
在原有的action类中pageload是作为一个初始化生命周期方法，一些action中定义的属性可以在该方法中初始化，在转换中需要移除这个方法，但是一些初始化参数的代码需要拆分到各个需要转换的方法中。可以通过pageload判断转换的方法需要的参数是url参数还是需要通过请求形参传入。

- 请求数据获取
移除冗余字段：删除原 Action 中与页面绑定的成员变量（如 ouName、isEnabled），改为通过方法参数传递。去除属性定义和有关方法代码
会话与配置：替换 userSession为SessionUtil.getInstance()

请求参数获取：
将原 DataGridModel 的分页逻辑拆解为 Q_DataGrid 参数，并调用 Service 层方法；DataGridModel也替换成DataGridModelV。
需要使用DataGridModel转换的时候注意分页数据等通过@RequestParam("queryGrid") Q_DataGrid queryGrid 传入 获取参数示例为：Math.multiplyExact(queryGrid.getPageIndex(), queryGrid.getPageSize()),queryGrid.getPageSize(), queryGrid.getSortField(), queryGrid.getSortOrder())
只有涉及到分页逻辑参数才需要使用Q_DataGrid参数传入，普通参数直接通过@RequestParam传入即可。传入的参数需要区分以下情况。
1.如果是url参数，那么使用String 请求参数 = WebUtil.getRequestParameterStr(WebUtil.getRequest(), 请求参数名称);注意一些属性参数原本的逻辑中是在pageload方法中getRequestParameter去获取，这些属性参数也直接视为url参数。如果没有用getRequestParameter获取那么使用第二点的方式传递。
请在使用WebUtil获取url参数时仔细检查该参数是否是真实的url参数。
2.如果是action中定义为属性的参数，且在pageload方法没有通过getRequestParameter去获取。那么直接通过@RequestParam传入，如果是定义的实体类那么直接@RequestParam(实体类)即可。
3.额外注意涉及到返回TreeModel的方法时，需要检查是否传递了(@RequestParam("node") TreeNode node, @RequestParam("filterValue") String filterValue)这两个参数用于后面使用。

- 响应处理
统一返回 JSONString：使用 Result 或 ResultUtil 工具类生成标准化 JSON 响应。
移除直接写响应：不再使用 addCallbackParam。返回信息为统一的string类型。
下面根据返回类型不同进行区分：
1.需要返回DataGridModel才需要使用ResultUtil.dataGridModelVtoJson(model, false)
转换前可以参照
model.setRowCount(pageData.getRowCount());代表总数量
model.setWrappedData(pageData.getList());当前页数据，设置数据后转换即可。
注意页面逻辑中model一些独特的set属性也需要保留下来。
2.返回TreeModel时，需要在转换前先对treeModel进行treeModel.setWrappedData(treeModel.fetch(node, filterValue).toNodes();操作，再使用ResultUtil.treeModelVtoJson(treeModel, new RequestContext(WebUtil.getRequest(), WebUtil.getResponse()),false); 返回一个string字符串。注意参数数量与格式，检查是否传入node和filterValue参数并进行有关操作。
3.否则直接返回封装的Result对象即可。addCallbackParam可以修改成如下格式。
Result result = new Result();
result.customData().put("msg", msg);
return result.toJson();
注意rest中返回msg或者message有关信息请检查使用上述示例编写。
异常处理：将原 Action 中的 return 逻辑改为通过 Result 对象返回错误信息。

- 依赖注入与配置
配置参数获取：使用了 configService，需要注入IConfigService。

- 系统日志有关去除
insertSystemLog相关逻辑直接去除。

- 引入必要的包
引入的类路径需要正确
import com.epoint.core.dto.RequestContext;
import com.epoint.core.dto.Result;
import com.epoint.core.dto.base.Field;
import com.epoint.core.dto.base.TreeNode;
import com.epoint.core.dto.query.Q_DataGrid;
import com.epoint.core.utils.config.ConfigUtil;
import com.epoint.core.utils.string.StringUtil;
import com.epoint.core.utils.web.SessionUtil;
import com.epoint.core.utils.web.WebUtil;
import com.epoint.basic.controller.orga.ou.DataGridModelV;
import com.epoint.basic.controller.orga.ou.ResultUtil;
import com.epoint.core.utils.web.SessionUtil;

最终检查：
1.返回TreeModel有关数据时必须传入@RequestParam("node") TreeNode node, @RequestParam("filterValue") String filterValue 这两个参数并且treeModel.setWrappedData(treeModel.fetch(node, filterValue).toNodes());再返回数据。
2.方法上的RequestMapping注解需要检查是否与方法名保持大小写一致。并检查以/开头。
3.返回DataGridModel的方法，检查传入参数是否是通过WebUtil获取，可以通关原有的action类中判断，如果在原有类的这个方法或者pageload中使用getRequestParameter类似逻辑获取才使用WebUtil方式获取，否则作为方法参数获取即可。
```

## 前端开发规则整合

前端开发AI规则分为miniui规则以及基于vue开发的两套规则。

规则中涉及到的相关规则以及文档可以到仓库中查看，[仓库地址](http://192.168.0.200/fepublic/aiefficiencyimprovement/-/tree/main/AI%E6%8F%90%E6%95%88%E6%9C%80%E4%BD%B3%E8%B7%84)

### miniui开发场景规则

```
- 优先使用 MiniUI Components，无法满足需求时使用常规实现

rules:
  - name: "MiniUI组件文档"
    path: "docs/components-*-README.md"
    priority: 100
    description: "MiniUI 组件的API和使用说明文档"

  - name: "MiniUI指南文档"
    path: "docs/guide-*.md"
    priority: 90
    description: "MiniUI 组件库安装和使用指南"

  - name: "文档索引"
    path: "docs/README.md"
    priority: 110
    description: "MiniUI 组件库文档索引"

groups:
  - name: "基础控件"
    path: "docs/components-{button,textbox,checkbox,radiobuttonlist,combobox,datepicker,timepicker,form}-README.md"
    description: "基础UI元素，构成界面的基本单位"

  - name: "数据展示"
    path: "docs/components-{datagrid,treegrid,tree,listbox,tabs,panel}-README.md"
    description: "展示各类数据内容的组件"

  - name: "编辑器"
    path: "docs/components-{webeditor,monacoeditor,mdeditor,jsoneditor}-README.md"
    description: "提供各类编辑功能的组件"

  - name: "弹出窗口"
    path: "docs/components-{window,messagebox,drawer,slidewindow}-README.md"
    description: "提供弹窗和提示功能的组件"

  - name: "文件上传"
    path: "docs/components-{webuploader,largefileuploader,imageuploader,cropper}-README.md"
    description: "处理文件上传相关功能的组件"

  - name: "数据操作"
    path: "docs/components-{dataimport,dataexport}-README.md"
    description: "处理数据导入导出功能的组件"

  - name: "其他组件"
    path: "docs/components-{icon,tooltip,progressbar,calendar,avatar}-README.md"
    description: "其他功能组件"

  - name: "安装和指南"
    path: "docs/guide-*.md"
    description: "MiniUI 使用指南和安装说明"

aliases:
  - name: "按钮组件"
    path: "docs/components-button-README.md"
    alias: "@按钮"

  - name: "数据表格"
    path: "docs/components-datagrid-README.md"
    alias: "@表格"

  - name: "表单组件"
    path: "docs/components-form-README.md"
    alias: "@表单"

  - name: "文本框"
    path: "docs/components-textbox-README.md"
    alias: "@输入框"

  - name: "下拉选择"
    path: "docs/components-combobox-README.md"
    alias: "@选择器"

  - name: "日期选择器"
    path: "docs/components-datepicker-README.md"
    alias: "@日期选择器"

  - name: "文件上传"
    path: "docs/components-webuploader-README.md"
    alias: "@上传"

  - name: "窗口组件"
    path: "docs/components-window-README.md"
    alias: "@窗口"

  - name: "菜单组件"
    path: "docs/components-menu-README.md"
    alias: "@菜单"

  - name: "面板组件"
    path: "docs/components-panel-README.md"
    alias: "@面板"

  - name: "安装指南"
    path: "docs/guide-README.md"
    alias: "@安装"

  - name: "组件库介绍"
    path: "docs/README.md"
    alias: "@组件库"

  - name: "树形控件"
    path: "docs/components-tree-README.md"
    alias: "@树形控件"

  - name: "消息框"
    path: "docs/components-messagebox-README.md"
    alias: "@消息框"

  - name: "通知组件"
    path: "docs/components-notice-README.md"
    alias: "@通知"

  - name: "树形表格"
    path: "docs/components-treegrid-README.md"
    alias: "@树形表格"

  - name: "标签页"
    path: "docs/components-tabs-README.md"
    alias: "@标签页"

relations:
  - source: "docs/components-form-README.md"
    related: ["docs/components-textbox-README.md", "docs/components-combobox-README.md", "docs/components-checkbox-README.md"]
    relation_type: "包含"

  - source: "docs/components-datagrid-README.md"
    related: ["docs/components-pager-README.md"]
    relation_type: "使用"

  - source: "docs/components-datepicker-README.md"
    related: ["docs/components-timepicker-README.md", "docs/components-monthrangepicker-README.md"]
    relation_type: "相关"

  # DataGrid 相关文件关系
  - source: "docs/components-datagrid-README.md"
    related: [
      "docs/components-datagrid-CardView.md",
      "docs/components-datagrid-CellEdit.md",
      "docs/components-datagrid-Column.md",
      "docs/components-datagrid-ContextMenu.md",
      "docs/components-datagrid-MergeCell.md",
      "docs/components-datagrid-Row.md",
      "docs/components-datagrid-RowEdit.md",
      "docs/components-datagrid-SearchFilterSort.md",
      "docs/components-datagrid-columnconfig.md",
      "docs/components-datagrid-frozen.md"
    ]
    relation_type: "包含"

  - source: "docs/components-datagrid-Column.md"
    related: ["docs/components-datagrid-columnconfig.md"]
    relation_type: "配置"

  - source: "docs/components-datagrid-Row.md"
    related: ["docs/components-datagrid-RowEdit.md", "docs/components-datagrid-CellEdit.md"]
    relation_type: "编辑"

  - source: "docs/components-datagrid-README.md"
    related: ["docs/components-datagrid-SearchFilterSort.md"]
    relation_type: "功能"

  # Tree 相关文件关系
  - source: "docs/components-tree-README.md"
    related: [
      "docs/components-tree-action.md",
      "docs/components-tree-autocollapse.md",
      "docs/components-tree-checkstate.md",
      "docs/components-tree-creat.md",
      "docs/components-tree-drag.md",
      "docs/components-tree-filtertree.md",
      "docs/components-tree-lazy.md",
      "docs/components-tree-recursive.md",
      "docs/components-tree-select.md"
    ]
    relation_type: "包含"

  - source: "docs/components-icon-README.md"
    related: [
      "docs/components-icon-graph.md",
      "docs/components-icon-mark.md",
      "docs/components-icon-modicon.md",
      "docs/components-icon-status.md"
    ]
    relation_type: "包含"

  - source: "docs/components-menu-README.md"
    related: ["docs/components-menu-contextmenu.md"]
    relation_type: "包含"

  - source: "docs/components-pager-README.md"
    related: ["docs/components-pagination.md"]
    relation_type: "包含"

search_hints:
  - term: "表格筛选"
    path: "docs/components-datagrid-SearchFilterSort.md"

  - term: "表单验证"
    path: "docs/components-validaterule-README.md"

  - term: "弹窗"
    path: ["docs/components-window-README.md", "docs/components-messagebox-README.md", "docs/components-drawer-README.md"]

  - term: "数据选择"
    path: ["docs/components-combobox-README.md", "docs/components-datepicker-README.md", "docs/components-treeselect-README.md"]

  - term: "表格列配置"
    path: ["docs/components-datagrid-Column.md", "docs/components-datagrid-columnconfig.md"]

  - term: "表格编辑"
    path: ["docs/components-datagrid-RowEdit.md", "docs/components-datagrid-CellEdit.md"]

  - term: "表格视图"
    path: ["docs/components-datagrid-CardView.md", "docs/components-datagrid-frozen.md"]

  - term: "树形操作"
    path: ["docs/components-tree-action.md", "docs/components-tree-drag.md", "docs/components-tree-select.md"]

  - term: "图标类型"
    path: ["docs/components-icon-graph.md", "docs/components-icon-mark.md", "docs/components-icon-modicon.md", "docs/components-icon-status.md"]

  - term: "分页功能"
    path: ["docs/components-pager-README.md", "docs/components-pagination.md"] 
```

### vue开发场景规则

![020.png](https://fdoc.epoint.com.cn/onlinedoc/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=b5bccaf1-4c1d-420a-ad13-034d4286b888)
