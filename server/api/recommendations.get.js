// /server/api/recommendations.get.js
import { query } from '~/server/utils/db.js'

export default defineEventHandler(async (event) => {
  try {
    const { item } = getQuery(event)

    if (!item) {
      throw createError({
        statusCode: 400,
        statusMessage: '缺少必要參數 item'
      })
    }

    const MAX_RECOMMENDATIONS = 15

    // 1️⃣ 正向推薦 A → B
    const sqlForward = `
      SELECT TOP ${MAX_RECOMMENDATIONS}
        p.Id,
        p.ProductName AS rawNameZh,
        p.ProductName_zh AS rawName,
        p.Classify AS Category,
        p.Price,
        r.Confidence,
        r.Lift
      FROM [dbo].[Recommendations] r
      JOIN [dbo].[product] p ON r.RecommendedItem = p.ProductName
      WHERE r.Itemname = @item
      ORDER BY r.Confidence DESC
    `
    let result = await query(sqlForward, { item })

    // 2️⃣ 不足 15 筆 → 補反向推薦 B → A
    if (result.length < MAX_RECOMMENDATIONS) {
      const sqlBackward = `
        SELECT TOP ${MAX_RECOMMENDATIONS - result.length}
          p.Id,
          p.ProductName AS rawNameZh,
          p.ProductName_zh AS rawName,
          p.Classify AS Category,
          p.Price,
          r.Confidence,
          r.Lift
        FROM [dbo].[Recommendations] r
        JOIN [dbo].[product] p ON r.Itemname = p.ProductName
        WHERE r.RecommendedItem = @item
        ORDER BY r.Confidence DESC
      `
      const back = await query(sqlBackward, { item })
      result = result.concat(back)
    }

    // 3️⃣ 如果還是沒有 → 撈 product 表銷量前 10 名
// 3️⃣ 不足 15 筆 → 用熱門商品補足
      if (result.length < MAX_RECOMMENDATIONS) {
        const sqlFallback = `
          SELECT TOP ${MAX_RECOMMENDATIONS - result.length}
            p.Id,
            p.ProductName AS rawNameZh,
            p.ProductName_zh AS rawName,
            p.Classify AS Category,
            p.Price,
            0 AS Confidence,
            0 AS Lift
          FROM [shopping_cart].[dbo].[product] p
          WHERE p.Quantity IS NOT NULL
          ORDER BY p.Quantity DESC
        `
        const fallback = await query(sqlFallback)
        result = result.concat(fallback)
      }


    // 名稱處理 (去掉空白/符號，生成圖片檔名)
    const cleanName = (name) =>
      name ? name.replace(/[\s\W_]+/g, '').toLowerCase() : ''

    return {
      item,
      recommendations: result.map(r => ({
        id: r.Id,
        name: r.rawName,      // 中文
        name_zh: r.rawNameZh, // 英文
        category: r.Category,
        price: r.Price,
        image: `/PNG/${cleanName(r.rawNameZh)}.png`,
        confidence: r.Confidence,
        lift: r.Lift
      }))
    }
  } catch (err) {
    console.error('API /recommendations 錯誤:', err)
    throw createError({
      statusCode: 500,
      statusMessage: '查詢推薦商品失敗，請稍後再試'
    })
  }
})
