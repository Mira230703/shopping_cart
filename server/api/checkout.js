export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('收到訂單：', body)

  // 這裡可以改成寫入資料庫
  return { message: '✅ 訂單已送出！' }
})