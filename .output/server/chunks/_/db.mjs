import sql from 'mssql';

const config = {
  server: "localhost\\SQLEXPRESS",
  database: "shopping_cart",
  user: "sa",
  // 或你自訂的 SQL 帳號
  password: "123456",
  // 請填入你在 SSMS 設定的密碼
  options: {
    encrypt: false,
    // Azure 建議設 true，本地可 false
    trustServerCertificate: true
    // 本地開發要 true，避免憑證錯誤
  }
};
async function query(sqlQuery, params = {}) {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    for (const key in params) {
      request.input(key, params[key]);
    }
    const result = await request.query(sqlQuery);
    return result.recordset;
  } catch (err) {
    console.error("SQL error:", err.message);
    console.error("\u8A73\u7D30\u932F\u8AA4:", err);
    throw err;
  }
}

export { query as q };
//# sourceMappingURL=db.mjs.map
