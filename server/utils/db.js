import sql from 'mssql'

const config = {
  server: '172.31.10.231', // ✅ 改成 DB 主機的私有 IP
  port: 1433,               // ✅ 明確指定 SQL Server 連線埠
  database: 'shopping_cart',
  user: 'sa',               // 你的 SQL 登入帳號
  password: 'E1133227!',       // 你的 SQL 密碼
  options: {
    encrypt: false,               // ✅ 因為你不是 Azure，設 false
    trustServerCertificate: true  // ✅ 信任自簽憑證，避免 SSL 錯誤
  }
}

/**
 * 執行 SQL 查詢
 * @param {string} sqlQuery - SQL 語法，支援 @param 參數
 * @param {object} [params={}] - 傳入參數，例如 { item: '白色吊燈' }
 * @returns {Promise<Array>} - 查詢結果陣列
 */
export async function query(sqlQuery, params = {}) {
  try {
    const pool = await sql.connect(config)
    const request = pool.request()

    // 綁定參數 (避免 SQL injection)
    for (const key in params) {
      request.input(key, params[key])
    }

    const result = await request.query(sqlQuery)
    return result.recordset
  } catch (err) {
    console.error('❌ SQL error:', err.message)
    console.error('詳細錯誤:', err)
    throw err
  }
}
