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

const categories_get = defineEventHandler(async (event) => {
  const { page = 1, limit = 20 } = getQuery(event);
  const offset = (page - 1) * limit;
  try {
    const rows = await query(`
      SELECT DISTINCT Classify AS category
      FROM product
      WHERE Classify IS NOT NULL AND LTRIM(RTRIM(Classify)) <> ''
      ORDER BY Classify
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `);
    const cleaned = rows.map((r) => {
      var _a;
      let cat = ((_a = r.category) == null ? void 0 : _a.trim()) || "";
      cat = cat.replace(/[.,!?\-()'"\[\]、。；：]/g, "");
      return cat;
    });
    return cleaned;
  } catch (err) {
    console.error("API /categories \u932F\u8AA4:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "\u5206\u985E\u8B80\u53D6\u5931\u6557"
    });
  }
});

export { categories_get as default };
//# sourceMappingURL=categories.get.mjs.map
