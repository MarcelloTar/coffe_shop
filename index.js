require('dotenv').config()
const express = require('express')
const path = require('path')
const fs = require('fs')
const nodemailer = require('nodemailer')
const TelegramBot = require('node-telegram-bot-api')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT;
const email = process.env.GMAIL_EMAIL
const password = process.env.GMAIL_PASS

const telegram_bot_api = process.env.TELEGRAM_BOT_API
const bot = new TelegramBot(telegram_bot_api, {polling: true})


let transtorter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: password
    }
})


app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

let chatId = undefined

bot.on('message', msg => {
    chatId = msg.chat.id
    bot.sendMessage(chatId, 'я телеграм бот з сайту coffee shop')
})



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
app.get('/leads', (req, res) => {

    if (fs.existsSync('leads.txt')) {
        fs.readFile('leads.txt', 'utf8', (err, data) => {
            if(err) {
                console.error(err);
            }
            let text = data.split('\n').filter(item => {
                return item !== ''
            })
            for (let i = 0; i < text.length; i++) {
                text[i] =  `
                    <div class="main_box">
                        <div class="main_box_number_email"> 
                            <p class="number">${i + 1}</p> 
                            <p class="email">${text[i].split(' ')[2]}</p>
                        </div>
                        <p class="date">${text[i].split(' ')[5]}</p>
                    </div>
                `
            }
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                    <link rel="stylesheet" href="style/leads.css">
                </head>
                <body>
                    <div class="wrapper">
                        <header class="header">
                            <img src="img/icon/logo.svg" alt="" data-aos="fade-down" data-aos-duration="2000" data-aos-delay="300">
                        </header>
                        <main class="main">    
                            <div class="main__container">
                                <p class="list_of_all_subscribers">Список всіх підписників</p>
                                ${text.join('')}
                            </div>
                        </main>
                    </div>
                </body>
                </html>
            `)
        })
    } else {
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <link rel="stylesheet" href="style/leads.css">
            </head>
            <body>
                <div class="wrapper">
                    <header class="header">
                        <img src="img/icon/logo.svg" alt="" data-aos="fade-down" data-aos-duration="2000" data-aos-delay="300">
                    </header>
                    <main class="main">
                        <div class="main__container">
                            <p class="list_of_all_subscribers">Список всіх підписників</p>
                            <p class="no_email">нема введених емейлів</p>
                        </div>
                    </main>
                </div>
            </body>
            </html>
        `)
    }
});
app.get('/form_administrator', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'form_administrator.html'))
})
app.get('/registration_and_login', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'registration_and_login.html'))
})


app.post('/leads', (req, res) => {
    const {email, date} = req.body
    const emailData = `емейл користувача ${email} і час ${date} \n`
    fs.appendFile('leads.txt', emailData, (err) => {
        if(err) throw err
        res.send('емейл відправлено')
    })
})
app.post('/form_administrator', (req, res) => {
    const text = Object.keys(req.body)
    fs.readFile('leads.txt', 'utf8', (err, data) => {
        const emailUser = data
        .split('\n')
        .filter(item => item !== '')
        .map(item => {
            return item.split(' ')[2]
        })

        for (let i = 0; i < emailUser.length; i++) {
            let mailOptions = {
                from: email,
                to: emailUser[i],
                subject: 'Coffe shop',
                text: text[0]
            }
            transtorter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    return console.log(err)
                }
                console.log('лист успішно відпралено', info.response);
            })
        }
    })
})
app.post('/product_order', (req, res) => {
    const {name, pieces, name_persone, email, address, price} = req.body
    const data_orders = `ім'я кому відправлити: ${name_persone}; \n емейл: ${email}; \n адрес: ${address}; \n товар: ${name}; \n кількість товару: ${pieces}; \n ціна всього продукту: ${price}; \n
    `
    // console.log(data_orders);
    
    fs.appendFile('orders.txt', data_orders, err => {
        if (err) {
            return err
        } 
    })

    bot.sendMessage(chatId, data_orders)
    .then(() => {
        console.log("повідомлення надіслано");
        
    })
    .catch((err) => {
        console.error(err);
    })
    
})
app.post('/review', (req, res) => {
    const {name_product, review_text, rating, date} = req.body

    const text = ` Назва продукту: ${name_product}; \n Відгук про продукт: ${review_text}; \n Рейтінг продукту: ${rating}; \n Час написання відгуку: ${date}; \n`
    fs.appendFile('review_user.txt', text, err => {
        if (err) {
            return err
        }
    })
    bot.sendMessage(chatId, text)
    .then(() => {
        console.log("повідомлення надіслано");
        
    })
    .catch((err) => {
        console.error(err);
    })
})
app.post('/signup', (req, res) => {
    const {name, email, password} = req.body
    const text = `Ім'я користувача: ${name}; \n Емейл користувача: ${email}; \n Пароль користувача: ${password}; \n`
    fs.appendFile('signup.txt', text, err => {
        if (err) {
            return err
        }
    })
    bot.sendMessage(chatId, text)
    .then(() => {
        console.log("повідомлення надіслано");
        
    })
    .catch((err) => {
        console.error(err);
    })
})

app.delete('/leads', (req, res) => {
    if (fs.existsSync('leads.txt')) {
        fs.unlink('leads.txt', (err) => {
            if (err) {
                return console.log(err);
            }
        })
    }
})

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'page', 'not_found.html'))
})

app.listen(port, () => {
    console.log(`Север запущений на http://localhost:${port}`);
    
})