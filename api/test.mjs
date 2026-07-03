// 最小化测试函数 - 验证 Vercel Functions 是否能正常运行
export default async function handler(req, res) {
  return res.status(200).json({
    ok: true,
    message: "Functions are working!",
    nodeVersion: process.version,
    env: Object.keys(process.env).filter(k => k.startsWith("GITHUB")).join(", ") || "no GITHUB_ vars",
    time: new Date().toISOString()
  });
}
