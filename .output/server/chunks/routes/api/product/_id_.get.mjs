import { d as defineEventHandler, c as createError } from '../../../nitro/nitro.mjs';
import { q as query } from '../../../_/db.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'mssql';

const _id__get = defineEventHandler(async (event) => {
  try {
    const { id } = event.context.params;
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u7F3A\u5C11\u5546\u54C1 ID"
      });
    }
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
    `;
    const rows = await query(sql, { id });
    if (!rows.length) {
      throw createError({
        statusCode: 404,
        statusMessage: "\u627E\u4E0D\u5230\u6B64\u5546\u54C1"
      });
    }
    const product = rows[0];
    const cleanName = (name) => name ? name.replace(/[\s\W_]+/g, "").toLowerCase() : "";
    product.image = `/PNG/${cleanName(product.rawNameZh)}.png`;
    product.name = product.rawName;
    product.name_zh = product.rawNameZh;
    return product;
  } catch (err) {
    console.error("API /product/:id \u932F\u8AA4:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "\u8CC7\u6599\u5EAB\u5B58\u53D6\u5931\u6557"
    });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
