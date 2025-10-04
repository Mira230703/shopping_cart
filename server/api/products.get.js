// server/api/products.get.js
import { query } from '~/server/utils/db.js'

export default defineEventHandler(async (event) => {
  try {
    const { page = 1, pageSize = 20, q = '', category = '', top = false } = getQuery(event)
    const pg = Math.max(1, Number(page))
    const ps = Math.min(100, Math.max(1, Number(pageSize)))
    const offset = (pg - 1) * ps

    const esc = (s = '') => String(s).replace(/'/g, "''").trim()

    const conds = []
    if (category && category !== '全部') {
      conds.push(`LTRIM(RTRIM(Classify)) = N'${esc(category)}'`)
    }
    if (q) {
      const kw = esc(q)
      conds.push(`(
        ProductName LIKE N'%${kw}%' OR
        ProductName_zh LIKE N'%${kw}%' OR
        Descriptions LIKE N'%${kw}%'
      )`)
    }
    const where = conds.length ? `WHERE ${conds.join(' AND ')}` : ''

    // 如果有 top=true，強制取前 20 名（依 Quantity 排序）
    let rows
    if (top === 'true') {
      rows = await query(`
        SELECT TOP 20
          Id AS id,
          ProductName AS name_zh,
          ProductName_zh AS name,
          Descriptions AS description,
          Classify AS category,
          Price AS price,
          Quantity AS quantity
        FROM product
        ${where}
        ORDER BY Quantity DESC
      `)
    } else {
      rows = await query(`
        SELECT
          Id AS id,
          ProductName AS name_zh,
          ProductName_zh AS name,
          Descriptions AS description,
          Classify AS category,
          Price AS price,
          Quantity AS quantity
        FROM product
        ${where}
        ORDER BY Quantity DESC
        OFFSET ${offset} ROWS FETCH NEXT ${ps} ROWS ONLY
      `)
    }

    const totalRes = await query(`
      SELECT COUNT(*) AS total
      FROM product
      ${where}
    `)
    const total = totalRes?.[0]?.total ?? 0

    const sanitize = (str) => {
      if (!str) return ''
      return String(str)
        .toLowerCase()
        .replace(/[\p{P}\p{S}]/gu, '')
        .replace(/\s+/g, '')
    }

    return {
      data: rows.map(p => ({
        ...p,
        image: `/PNG/${sanitize(p.name_zh)}.png`,
        name_clean: sanitize(p.name)
      })),
      pagination: {
        page: pg,
        pageSize: ps,
        total,
        totalPages: Math.max(1, Math.ceil(total / ps))
      }
    }
  } catch (err) {
    console.error('API /products 錯誤:', err)
    throw createError({ statusCode: 500, statusMessage: '資料庫存取失敗' })
  }
})
