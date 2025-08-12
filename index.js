const express = require('express')
const path = require('path')

const app = express()
const port = 3000
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'index.html'))
})
app.get('/popular_product', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'popular_product.html'))
})
app.get('/customer', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'customer.html'))
})
app.get('/best_product', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'best_product.html'))
})
app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'blog.html'))
})
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'page', 'not_found.html'))
})
app.listen(port, () => {
    console.log(`Север запущений на http://localhost:${port}`);
    
})