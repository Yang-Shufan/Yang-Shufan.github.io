杨书帆学术个人网站 V5 — GitHub Pages + Pages CMS
===================================================

一、这是什么？

本压缩包同时包含：
- 正式公开网站：index.html、style.css、脚本、图片、CV、论文 PDF
- 编辑器配置：.pages.yml（特别重要！macOS 会隐藏以点开头的文件）
- 可编辑的数据：data/ 目录内的 6 个 JSON 文件

公开网页默认只允许访客阅读。
你本人通过 https://app.pagescms.org/ 用 GitHub 登录后管理资料。
这里不需要单独购买网站服务器、域名或后台服务器。

二、首次发布到 GitHub Pages（只需做一次）

1. 登录 GitHub，确认自己使用的 GitHub 用户名。
2. 打开 https://github.com/new ，创建一个 PUBLIC 仓库。
   如果你的 GitHub 用户名是 yangshufan，仓库名须为 yangshufan.github.io
   如果用户名不是 yangshufan，仓库名应当改成“实际用户名.github.io”。
3. ZIP 解压后，通过仓库 Add file > Upload files 上传压缩包内部的所有文件和文件夹。
   请确认 index.html 和 .pages.yml 在仓库根目录，data/ 文件夹也已完整上传。
   macOS Finder 可以按 Command + Shift + . 显示隐藏的 .pages.yml。
4. 点击 Commit changes 保存。
5. 仓库 Settings > Pages > Build and deployment：
   Source: Deploy from a branch
   Branch: main / (root)
   点击 Save，然后在 Actions/Pages 查看部署状态。
6. 网站网址：https://实际用户名.github.io/

三、启用在线编辑器（只需做一次）

1. 打开 https://app.pagescms.org/ ，使用你的 GitHub 账号登录。
2. 根据页面提示安装/授权 Pages CMS GitHub App，只授权你要编辑的网站仓库即可。
3. 进入这个仓库。Pages CMS 会自动读取根目录的 .pages.yml，显示以下栏目：
   Homepage, About & CV / Publications — paste APA / Working Papers — paste APA /
   Education / Conferences & Invited Talks / Professional Activities。
4. 修改后点击 Save；Pages CMS 自动提交到 GitHub，GitHub Pages 随后发布。
   你以后不再需要重新上传整个 ZIP。

四、最常用操作：粘贴 APA 文献

打开 Publications — paste APA，创建新记录或修改现有记录。
第一项输入是“APA reference (paste whole citation)”，例如：
Yang, S., & Zhou, L. (2026). A Study of Public Services. Public Administration Review, 20(2), 100–120. https://doi.org/10.1234/example

保存后，个人网站会自动从 APA 文本抽取作者、年份、原始标题、期刊名称、卷期和页码，按统一的网页格式展示。
Language 留空时，网页会按文章原题是否包含汉字推断中文或英文；如果不准确，可手动选择。
你也可以只粘贴 Working Paper：
Yang, S. (2026). Offsetting Administrative Burden: AI Chatbot Assistance in Digital Public Service Encounters.

请注意：Pages CMS 官方在线编辑器不提供在输入框内实时拆分 APA 的能力。
本方案采用“粘贴 APA → Save → 在个人主页自动解析”的流程。
因此，只有在刷新公开网站后才能看到最终排版。
引文解析面向常见 APA 7 风格：复杂的缩写、非标准标点或缺失字段可能产生歧义。
遇到歧义时，可以用“Original title override / Journal override / Year override”人工修正。

【中文论文特别注意】
- 你输入中文 APA：保留中文文章原题和中文期刊原名。
- 官方英文标题：填写 Official English article title，自行核实并决定用语。
- 官方英文期刊名：填写 Official English journal name，自行核实。
- 程序绝不自动翻译中文论文标题、中文期刊名或中文作者姓名。
- 作者展示：Verified English author names 里填写全名，用半角分号分隔，例如 Shufan Yang; Lingyi Zhou。
- 通讯：Corresponding author 填对应展示全名，例如 Lingyi Zhou；程序自动加 *。
- 四篇既有中文论文的英文译名由旧版网站迁移而来，尚需你确认正式名称是否与期刊一致。
- Display order 输入 1、2、3……，数字越小排得越前；不依赖发表年份。
- 可用 Show on website 选择隐藏某一条记录。

五、Read article 如何出现？

- 上传 PDF：在文章的 Read article — upload PDF 处选文件，保存；页面显示 Read article。
- 不上传 PDF、但有官网 DOI/链接：填 external URL，页面也显示一个 Read article。
- APA 末尾含 DOI URL 时，如果未填其他链接，程序会使用它。
- PDF 和网址都没有，也没有 DOI：不显示 Read article。
- 同时有 PDF 和 URL：优先指向 PDF，只显示一个 Read article。
- 上传到公开 GitHub 仓库的 PDF 也是公开文件。上传前请核对出版社的公开传播许可。

六、更换 CV、照片、主页文字

打开 Homepage, About & CV。
- CV PDF：重新上传，保存后自动替换下载按钮链接。
- Profile photo：选择照片或上传新照片，保存后自动替换。
- 首页横幅背景图：在 Homepage, About & CV 中找到“首页横幅背景图 / Hero background image”，上传 JPG/PNG/WebP 并保存即可换图。网站自动保留暖色渐变和色调，不必修改 CSS。
- Hero 标题、副标题、姓名、邮箱、研究关键词、各栏目标题和 About Me 段落都可修改。
- About Me 每个条目是一段；支持 **加粗** 和 [链接文字](https://...) 两种简易格式。
- 也可以重新排序关键词或 About Me 段落。
- 清空 CV 字段后，网站自动隐藏 CV 按钮。

七、会议和活动

Conferences & Invited Talks 的每条记录包含：
- Year：年份
- Original language：中文或英文
- Conference name：会议名，不附大学名
- Official English translation：中文会议可手工填写正式英文译名
- Host institution：举办机构（若信息不确定可以留空）
- City / Country：城市、国家
显示为：
中文会议名称
官方英文译名（只有你填了才出现）
举办机构 · 城市, 国家  （同一行）
国际英文会议不显示英文译名这一额外行。
不出现谁 present、conference presentation 等描述。

Professional Activities 预先只保留两个现任职务：
Executive Editor（公共管理共同体执行主编）
Head of the “Dialogue with Outstanding Scholarship” Series（对话佳作栏目负责人）

八、不要搞混网站与后台

公开主页： https://你的用户名.github.io/ ，任何人只可浏览。
编辑后台： https://app.pagescms.org/ ，须经 GitHub 身份验证和仓库授权才能保存。
公开站点并没有登录表单或修改功能。

九、离线预览与已知限制

直接双击 index.html 可以预览 V4 自带的初始页面快照。
但由于浏览器对本地 file:// 的 JSON 读取有限制，双击预览时不保证能加载之后修改过的 data/ 内容。
若需在本地查看新的 JSON 内容，可以在电脑安装 Python 后，在该目录运行：
    python3 -m http.server 8000
再访问 http://localhost:8000/
如果你不想使用命令行，直接看 GitHub Pages 上的已发布网页即可。

无需数据库，无需构建工具，无需服务器管理。
站点通过访问 data/ 下的 JSON 文件展示最新内容；保存修改后，GitHub Pages 可能需要短暂重新发布。
CMS 的表单结构依据 Pages CMS 当前官方配置语法编写，首次连接请在 app.pagescms.org 实际确认页面行为。


十、V5 宽屏与主页背景图（新增）

- 宽屏时网站不再采用原先 1780px 的整体最大宽度；右侧横幅从侧栏边界铺到浏览器右侧，不再有两侧白色空档。
- About / Education / Publications 等正文阅读宽度继续受限，避免文字在超宽显示器上太长。
- 新首页默认使用站主提供的河畔夕阳图片，位于 assets/hero/riverside-sunset.jpg。
- 在 Pages CMS: Homepage, About & CV → 首页横幅背景图 / Hero background image → 上传或选择图片 → Save。
- 站点会自动读取 data/profile.json 里的 hero_background 字段；请不要删除该字段。
- 保存后请刷新公开网站，GitHub Pages 的发布缓存有时需要一小段时间才能刷新。
- 选择的图片仅用于装饰性背景，原有渐变、排版和正文都会保持不变。
- 上传照片前请确认你有权将图片公开展示；GitHub 仓库和其中的图片会公开。
