require('dotenv').config()
const express = require('express')
const path = require('path')
const fs = require('fs')
const nodemailer = require('nodemailer')
const TelegramBot = require('node-telegram-bot-api')
const bodyParser = require('body-parser')
const { rejects } = require('assert')

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

let chat_id_administrator = process.env.CHAT_ID_ADMIN
let chatId = undefined
let order = {}
// bot.on('message', msg => {
//     chatId = msg.chat.id
//     console.log(chatId);
    
//     bot.sendMessage(chatId, 'я телеграм бот з сайту coffee shop')
// })
bot.onText(/\/star/, (msg) => {
    chatId = msg.chat.id
    bot.sendMessage(msg.chat.id, 'Привіт я телеграм бот з сайту coffee shop.', {
        reply_markup: {
            keyboard: [
                ['/замовити']
            ]
        }
    })
})
bot.onText(/\/замовити/, msg => {
    chatId = msg.chat.id
    bot.sendPhoto(chatId, './public/img/vicaragua_coffee_beans2.png',{
        caption: 'Кава: vicaragua coffee beans \nЦіна: 25$ \nЯкщо хочете цю каву то введіть: vicaragua coffee beans'
    })
    bot.sendPhoto(chatId, './public/img/americano_coffee.png',{
        caption: 'Кава: americano coffee \nЦіна: 50$ \nЯкщо хочете цю каву то введіть: americano coffee'
    })
    bot.sendPhoto(chatId, './public/img/virgin_coffee_gred.png',{
        caption: 'Кава: virgin coffee gred \nЦіна: 100$ \nЯкщо хочете цю каву то введіть: virgin coffee gred'
    })
})

bot_message_order('vicaragua coffee beans', 25)
bot_message_order('americano coffee', 50)
bot_message_order('virgin coffee gred', 100)





bot.on('callback_query', (query) => {

    switch (query.data) {
        case 'cancel':
            bot.sendMessage(query.message.chat.id, 'Якщо ви хочете скасувати замовлення то введіть: так, а якщо не хочете то: ні')
            break;
        default:
            break;
    }

    bot.answerCallbackQuery(query.id)
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

    bot_message(chat_id_administrator, data_orders)
    
})
app.post('/review', (req, res) => {
    const {name_product, review_text, rating, date} = req.body

    const text = `Назва продукту: ${name_product}; \nВідгук про продукт: ${review_text}; \nРейтінг продукту: ${rating}; \nЧас написання відгуку: ${date}; \n`
    fs.appendFile('review_user.txt', text, err => {
        if (err) {
            return err
        }
    })
    bot_message(chat_id_administrator, text)
})
app.post('/signup', (req, res) => {
    const {name, email, password} = req.body
    const text = `Ім'я користувача: ${name}; \n Емейл користувача: ${email}; \n Пароль користувача: ${password}; \n`
    fs.appendFile('signup.txt', text, err => {
        if (err) {
            return err
        }
    })
    bot_message(chat_id_administrator, text)
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



function bot_message(id, text) {
    bot.sendMessage(id, text)
    .then(() => {
        console.log("повідомлення надіслано");
        
    })
    .catch((err) => {
        console.error(err);
    })
}
function bot_message_order(name,price) {
    bot.onText(new RegExp(name, 'i'), msg => {
        chatId = msg.chat.id
        order = {
            stap: 'selects the quantity of the product',
            data: {
                name: name,
            }
        }
        bot.sendMessage(chatId, 'Чудовий вибір! \nСкільки хочете?', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Скасувати замовлення', callback_data: 'cancel'}]
                ]
            }
        })
        let chat = bot.on('message', msg => { 
            chatId = msg.chat.id
            if(msg.text.toLocaleLowerCase() !== 'так') {
                switch (order.stap) {
                    case 'selects the quantity of the product':
                        order.data.pieces = +msg.text
                        order.stap = 'chooses the goods for whom'
                        bot.sendMessage(chatId, 'Кому хочете відправити?', {
                            reply_markup: {
                                inline_keyboard: [
                                    [{text: 'Скасувати замовлення', callback_data: 'cancel'}]
                                ]
                            }
                        })
                        break;
                    case 'chooses the goods for whom':
                        order.data.whom = msg.text
                        order.stap = 'your email'
                        bot.sendMessage(chatId, 'Ваш емейл', {
                            reply_markup: {
                                inline_keyboard: [
                                    [{text: 'Скасувати замовлення', callback_data: 'cancel'}]
                                ]
                            }
                        })
                        break;
                    case 'your email':
                        order.data.email = msg.text
                        order.stap = 'address'
                        bot.sendMessage(chatId, 'Адреса', {
                            reply_markup: {
                                inline_keyboard: [
                                    [{text: 'Скасувати замовлення', callback_data: 'cancel'}]
                                ]
                            }
                        })
                        break;
                    case 'address':
                        order.data.address = msg.text
                        order.stap = 'address'
                        let text =`Назва кави: ${order.data.name} \nКількість: ${order.data.pieces} \nКому хочете відправити: ${order.data.whom} \nВаш емейл: ${order.data.email} \nАдреса: ${order.data.address} \nСкільки буде коштувати: ${order.data.pieces * price}$`
                        bot.sendMessage(chatId, text)
                        order = {}
                        fs.appendFile('orders.txt', text, err => {
                            if (err) {
                                return err
                            }
                        })
                        bot_message(chat_id_administrator, text)


                        break
                    default:
                        break;
                }
            } else {
                order = {}
                return
            }
        

        })
    
        if (chat === undefined) {
            return
        }
    })
}


    