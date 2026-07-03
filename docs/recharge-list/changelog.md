# 回血清单 (Recharge Station) -- CHANGELOG

## V1.0 (2026-07-03) -- 首次发布

### 新增功能

- **能量节点流**：100件回血小事垂直列表，按序渲染，包含图标、文字、胶囊电池三部分
- **点击完成/取消**：支持点击节点切换完成状态，完成时触发反馈，取消时还原
- **充能粒子爆发**：点击完成时8个绿色粒子从电池位置向外扩散，持续600ms
- **电流声音效**：Web Audio API合成sawtooth波形电流声（800Hz->400Hz，0.15s），在用户手势后播放
- **胶囊电池动画**：完成时电池从0填充到100%（cubic-bezier缓动），绿色渐变带外发光
- **连接线流动**：节点间2px垂直连接线，3px圆点流动动画，hover金色/完成绿色
- **本周回血计数**：右下角毛玻璃固定卡片，累计本周完成次数，每周一00:00自动重置
- **第101个隐藏电源**：列表底部6px隐藏按钮，点击弹出毛玻璃弹窗，显示哲学文案："允许自己永远充不满电。"
- **小猫SVG动画**：底部装饰小猫（椭圆身体+圆形头部+三角耳朵+尾巴+胡须），三种状态：
  - sleep（默认）：闭眼弧线+Zzz文字+呼吸浮动
  - stare（联动）：大圆睁眼+蓝色瞳孔+高光+头部抖动
  - yawn（联动）：闭眼+张大嘴红色椭圆
- **小猫联动逻辑**：首次点击隐藏电源时触发，睡眠->睁眼（2s）->哈欠（3.5s）->睡眠循环
- **心电图背景纹理**：SVG data URI平铺背景，模拟心电图波形
- **心电图加载动画**：页面挂载时1.2s波动动画（`ecg-flash`关键帧）
- **数据持久化**：localStorage存储完成状态（`recharge_done_ids`）、周计数（`recharge_count`）、重置时间戳（`recharge_count_ts`）
- **周重置逻辑**：基于`recharge_count_ts`判断是否跨周，跨周时计数归零但完成状态保留
- **移动端响应式**：640px以下胶囊内边距、图标尺寸、电池尺寸、计数器位置自适应

### 技术实现

- **框架**：React 18 + TypeScript + Framer Motion
- **动画引擎**：`motion.div` 节点入场动画（`whileInView`，交错延迟）、`AnimatePresence` 弹窗过渡、`spring` 计数器弹性
- **音频合成**：Web Audio API，`OscillatorNode`(sawtooth) + `BiquadFilterNode`(bandpass) + `GainNode`，延迟创建AudioContext
- **背景纹理**：SVG path编码为data URI，`background-image`重复平铺，CSS伪元素实现加载动画
- **毛玻璃效果**：`backdrop-filter: blur(4px/12px/20px)`，配合`-webkit-backdrop-filter`兼容Safari
- **粒子系统**：8个粒子，`Math.cos/sin` 计算方向，`motion.span` 动画扩散
- **小猫SVG**：纯SVG手绘，CSS动画控制呼吸浮动和抖动，状态切换通过React props驱动
- **数据层**：localStorage读写均包裹`try-catch`，支持存储不可用/数据损坏时静默降级
- **图标池**：100个emoji+中文字符混合池，按索引循环分配

### 设计风格

- **色调**：暖白底（`#FDFBF7`）+ 浅灰绿文字（`#5a5048`）+ 绿色高亮（`#4cba4c`）
- **字体**：标题 Noto Serif SC 衬线体，正文 Noto Sans SC 无衬线体
- **材质**：半透明毛玻璃卡片（节点、计数器、弹窗），圆角12-18px
- **构图**：居中窄列布局（max-width: 680px），垂直滚动流
- **点缀**：心电图纹理、金色hover边框、绿色完成态、小猫装饰
- **氛围**：日系文艺风，温暖、克制、有呼吸感