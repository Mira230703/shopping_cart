// server/api/product/[id].get.js
import { query } from '~/server/utils/db.js'

export default defineEventHandler(async (event) => {
  try {
    const { id } = event.context.params

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: '缺少商品 ID'
      })
    }

    // ✅ 使用 [dbo] 明確指定 schema
    const sql = `
      SELECT
        Id AS id,
        ProductName AS rawNameZh,
        ProductName_zh AS rawName,
        Descriptions AS description,
        Classify AS category,
        Price AS price
      FROM [dbo].[product]
      WHERE Id = @id
    `
    const rows = await query(sql, { id })

    if (!rows.length) {
      throw createError({
        statusCode: 404,
        statusMessage: '找不到此商品'
      })
    }

    // 名稱處理 (去掉空白/符號，生成圖片檔名)
    const product = rows[0]
    const cleanName = (name) =>
      name ? name.replace(/[\s\W_]+/g, '').toLowerCase() : ''

    product.image = `/PNG/${cleanName(product.rawNameZh)}.png`
    product.name = product.rawName
    product.name_zh = product.rawNameZh

    return product
  } catch (err) {
    console.error('API /product/:id 錯誤:', err)
    throw createError({
      statusCode: 500,
      statusMessage: '資料庫存取失敗'
    })
  }
})
