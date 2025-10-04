import { query } from '~/server/utils/db.js'

export default defineEventHandler(async (event) => {
  const { page = 1, limit = 20 } = getQuery(event) // 從 query string 抓分頁參數
  const offset = (page - 1) * limit

  try {
    // ⚡ 用 DISTINCT 抓唯一分類
    const rows = await query(`
      SELECT DISTINCT Classify AS category
      FROM product
      WHERE Classify IS NOT NULL AND LTRIM(RTRIM(Classify)) <> ''
      ORDER BY Classify
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `)

    // 清理字串：去掉頭尾空白與標點符號
    const cleaned = rows.map(r => {
      let cat = r.category?.trim() || ''
      // 移除標點符號與特殊字元
      cat = cat.replace(/[.,!?\-()'"\[\]、。；：]/g, '')
      return cat
    })

    return cleaned
  } catch (err) {
    console.error('API /categories 錯誤:', err)
    throw createError({
      statusCode: 500,
      statusMessage: '分類讀取失敗'
    })
  }
})
