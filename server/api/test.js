import { query } from '~/server/utils/db.js'

export default defineEventHandler(async () => {
  try {
    const result = await query('SELECT GETDATE() AS currentTime')
    return result
  } catch (err) {
    console.error('SQL 錯誤訊息：', err.message)
    return {
      error: true,
      message: err.message,
      detail: err
    }
  }
})