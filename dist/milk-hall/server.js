/**
 * ============================================
 *   解忧杂货铺 - Express 后端服务
 *   基于 OpenAI SDK 兼容模式调用阿里云百炼 DeepSeek
 * ============================================
 */

// 加载环境变量（必须在最前面，确保后续代码能读取到配置）
require('dotenv').config();

const express = require('express');
const OpenAI = require('openai');

// ==================== 基础配置 ====================

const app = express();
const PORT = 3456;

// 中间件：解析 JSON 请求体 & 静态文件托管
app.use(express.json());
app.use(express.static('public'));

// ==================== 角色系统 ====================
// 每个分类对应一位"杂货铺店员"，各有独特的回信风格

const ROLE_CONFIG = {
  // 🎲 小波 — 迷途诗人·胶片风
  brain: {
    name: '小波',
    emoji: '🎲',
    systemPrompt: `你是"小波"，一个迷途诗人。你的回答像胶片摄影一样有质感和层次。风格冷幽默诗意，不用脏话，偶尔引用歌词诗句。回答简洁有画面感。`,
  },
  // 💌 浪矢爷爷 — 温和引导
  heart: {
    name: '浪矢爷爷',
    emoji: '💌',
    systemPrompt: `你是"浪矢爷爷"，温暖慈祥的老人。你总是先肯定对方的感受，再温和地给出建议。语气像写信，真诚朴实。`,
  },
  // 💼 敦也 — 理性三步
  work: {
    name: '敦也',
    emoji: '💼',
    systemPrompt: `你是"敦也"，冷静理性的职场人。遇到问题习惯分三步分析：现状、原因、对策。言简意赅，逻辑清晰。`,
  },
  // 🌸 晴美 — 先共情
  emotion: {
    name: '晴美',
    emoji: '🌸',
    systemPrompt: `你是"晴美"，善解人意的倾听者。你总是先共情对方的情绪，再温柔地引导思考。温暖但不腻。`,
  },
};

// ==================== OpenAI 客户端初始化 ====================

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: process.env.BASE_URL,
});

// ==================== CORS 配置（允许所有来源） ====================

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// ==================== 核心 API：聊天接口 ====================
// POST /api/chat
// 请求体：{ message: string, category: 'brain' | 'heart' | 'work' | 'emotion' }
// 响应：SSE 流式文本（text/event-stream）

app.post('/api/chat', async (req, res) => {
  const { message, category } = req.body;

  // --- 参数校验 ---
  if (!message || !message.trim()) {
    return res.status(400).json({ error: '信件内容不能为空哦~' });
  }

  // 如果没有传 category，默认使用 brain（小波）
  const roleKey = category && ROLE_CONFIG[category] ? category : 'brain';
  const role = ROLE_CONFIG[roleKey];

  // --- 设置 SSE 响应头 ---
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // 先发送角色信息，让前端知道是谁在回信
  res.write(`data: ${JSON.stringify({ type: 'role', name: role.name, emoji: role.emoji })}\n\n`);

  try {
    // --- 调用 DeepSeek（流式） ---
    const stream = await client.chat.completions.create({
      model: process.env.MODEL || 'deepseek-v3',
      messages: [
        { role: 'system', content: role.systemPrompt },
        { role: 'user', content: message },
      ],
      stream: true, // 开启流式输出
      max_tokens: 1024,
      temperature: 0.8,
    });

    // --- 逐块读取流式数据，通过 SSE 推送给前端 ---
    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) {
        // 每个文本片段包装成 SSE data 事件
        res.write(`data: ${JSON.stringify({ type: 'content', text: content })}\n\n`);
      }
    }

    // 流结束信号
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (err) {
    console.error('[解忧杂货铺] API 调用失败:', err.message || err);

    // --- 错误兜底：返回友好提示 ---
    const errorMsg = err.status === 401
      ? '店长出门忘带钥匙了（API Key 无效），请检查配置~'
      : err.status === 429
        ? '来信太多了，杂货铺忙不过来，请稍后再来~'
        : `杂货铺出了点小状况：${err.message || '未知错误'}，请稍后再试~`;

    res.write(`data: ${JSON.stringify({ type: 'error', text: errorMsg })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  }
});

// ==================== 启动服务 ====================

app.listen(PORT, () => {
  console.log(`\n  🏪 解忧杂货铺已开门营业！`);
  console.log(`  📍 地址: http://localhost:${PORT}`);
  console.log(`  🤖 模型: ${process.env.MODEL || 'deepseek-v3'}`);
  console.log(`  🔗 API:  ${process.env.BASE_URL || '未配置'}\n`);
});
