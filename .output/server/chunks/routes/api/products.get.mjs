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

const products_get = defineEventHandler(async (event) => {
  var _a, _b;
  try {
    const { page = 1, pageSize = 20, q = "", category = "", top = false } = getQuery(event);
    const pg = Math.max(1, Number(page));
    const ps = Math.min(100, Math.max(1, Number(pageSize)));
    const offset = (pg - 1) * ps;
    const esc = (s = "") => String(s).replace(/'/g, "''").trim();
    const conds = [];
    if (category && category !== "\u5168\u90E8") {
      conds.push(`LTRIM(RTRIM(Classify)) = N'${esc(category)}'`);
    }
    if (q) {
      const kw = esc(q);
      conds.push(`(
        ProductName LIKE N'%${kw}%' OR
        ProductName_zh LIKE N'%${kw}%' OR
        Descriptions LIKE N'%${kw}%'
      )`);
    }
    const where = conds.length ? `WHERE ${conds.join(" AND ")}` : "";
    let rows;
    if (top === "true") {
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
      `);
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
      `);
    }
    const totalRes = await query(`
      SELECT COUNT(*) AS total
      FROM product
      ${where}
    `);
    const total = (_b = (_a = totalRes == null ? void 0 : totalRes[0]) == null ? void 0 : _a.total) != null ? _b : 0;
    const sanitize = (str) => {
      if (!str) return "";
      return String(str).toLowerCase().replace(/[\p{P}\p{S}]/gu, "").replace(/\s+/g, "");
    };
    return {
      data: rows.map((p) => ({
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
    };
  } catch (err) {
    console.error("API /products \u932F\u8AA4:", err);
    throw createError({ statusCode: 500, statusMessage: "\u8CC7\u6599\u5EAB\u5B58\u53D6\u5931\u6557" });
  }
});

export { products_get as default };
//# sourceMappingURL=products.get.mjs.map
