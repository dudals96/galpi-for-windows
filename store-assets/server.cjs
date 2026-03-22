const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = 5174
const DIR = __dirname

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.css': 'text/css',
  '.js': 'text/javascript',
}

http.createServer((req, res) => {
  let filePath = path.join(DIR, req.url === '/' ? '/icon-preview.html' : req.url)
  const ext = path.extname(filePath)
  const contentType = MIME[ext] || 'text/plain'

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end('Not found')
      return
    }
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(data)
  })
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
