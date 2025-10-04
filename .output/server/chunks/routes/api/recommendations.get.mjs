import { d as defineEventHandler, g as getQuery, c as createError } from '../../nitro/nitro.mjs';
import { q as query } from '../../_/db.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'mssql';

const recommendations_get = defineEventHandler(async (event) => {
  try {
    const { item } = getQuery(event);
    if (!item) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u7F3A\u5C11\u5FC5\u8981\u53C3\u6578 item"
      });
    }
    const MAX_RECOMMENDATIONS = 15;
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
    `;
    let result = await query(sqlForward, { item });
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
      `;
      const back = await query(sqlBackward, { item });
      result = result.concat(back);
    }
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
        `;
      const fallback = await query(sqlFallback);
      result = result.concat(fallback);
    }
    const cleanName = (name) => name ? name.replace(/[\s\W_]+/g, "").toLowerCase() : "";
    return {
      item,
      recommendations: result.map((r) => ({
        id: r.Id,
        name: r.rawName,
        // 中文
        name_zh: r.rawNameZh,
        // 英文
        category: r.Category,
        price: r.Price,
        image: `/PNG/${cleanName(r.rawNameZh)}.png`,
        confidence: r.Confidence,
        lift: r.Lift
      }))
    };
  } catch (err) {
    console.error("API /recommendations \u932F\u8AA4:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "\u67E5\u8A62\u63A8\u85A6\u5546\u54C1\u5931\u6557\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66"
    });
  }
});

export { recommendations_get as default };
//# sourceMappingURL=recommendations.get.mjs.map
