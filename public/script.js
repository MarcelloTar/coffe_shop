const send = document.querySelector('#send');

if (send) {
   send.addEventListener('click', () => {
        console.log('hello');
        
        const date = new Date()
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        const month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()
        const year = date.getFullYear()
        const usere = {
            email: document.querySelector('#email').value,
            date: `${day}.${month}.${year}`
        }
        if (document.querySelector('#email')) {
            console.log('input');
            
            console.log(document.querySelector('#email').value );
            console.log(typeof(document.querySelector('#email').value) );


            axios.post('/leads', usere)
            .then(res => {
                console.log(res);
                
                alert('bien')
            })
            .catch(err => {
                console.error('сталася помилка під час реєстрації', err);
            })
        }
    }) 
}




const clearing_followers = document.querySelector('.clearing_followers');

if (clearing_followers) {
    clearing_followers.addEventListener('click', () => {
        axios.delete('/leads')
        .then(res => {
            console.log(res);
            
            alert('електронні пошти виделано')
        })
        .catch(err => {
            console.log('помивка', err);
        })    
    })
}



const send_message = document.querySelector('#send_message');

if (send_message) {
    send_message.addEventListener('click', () => {
        const text = document.querySelector('#textarea').value
        axios.post('/form_administrator', text)
        .then(res => {
            console.log(res);

            alert('Повідомлення успішно відправлено')
            document.querySelector('#textarea').value = ''
            
        })
        .catch(err => {
            console.log('помивка', err);
        })
    })
}







const products = {
    vicaragua_coffee_beans: {
        name: "vicaragua coffee beans",
        price: 20,
        src: 'vicaragua_coffee_beans2'
    },
    americano_coffee: {
        name: "americano coffee",
        price: 50,
        src: 'americano_coffee'
    },
    virgin_coffee_gred: {
        name: "virgin coffee gred",
        price: 100,
        src: 'virgin_coffee_gred'
    }
}

const modal = document.querySelector('.modal');

if (modal) {
    document.querySelectorAll('[data-name-product]').forEach(item => {
        item.addEventListener('click', () => {
            open_modal()
            const product = item.getAttribute('data-name-product')
            let price = 0
            document.querySelector('.modal_content').innerHTML = `
            <form class="form_product">
                <p class="close">&times;</p>
                <img src="img/${products[product].src}.png" alt="">
                <p>Goods: ${products[product].name}</p>
                <p>Price: ${products[product].price}$</p>
                <div class="box_modal">
                <p style="margin: 0;">How many pieces:</p> 
                <input type="number" id="name_pieces_input" required name="pieces">
                </div>
                <div class="box_modal">
                <p style="margin: 0;" class="name_persone">The name of the person you are sending to:</p> 
                <input type="text" class="name_persone_input" required name="name_persone">
                </div>
                <div class="box_modal">
                <p style="margin: 0;" class="name_email">Your email:</p> 
                <input type="email" class="name_email_input" required name="email">
                </div>
                <div class="box_modal">
                <p style="margin: 0;" class="name_address">Address:</p> 
                <input type="text" class="name_address_input" required name="address">
                </div>
                <p>Final price: <span class="Final_price" >${price}</span>$</p>
                <button>Buy</button>
            </form>
            `
            document.querySelector('#name_pieces_input').addEventListener('input', () => {
                if (document.querySelector('#name_pieces_input').value < 0) {
                    document.querySelector('#name_pieces_input').value *= -1
                }
                price = +document.querySelector('#name_pieces_input').value * products[product].price
                document.querySelector('.Final_price').textContent = price
            })

            document.querySelector('.close').addEventListener('click', close_modal)

            const form_product = document.querySelector('.form_product');
            form_product.addEventListener('submit', (e) => {
                e.preventDefault()
                if (price > 0) {
                    const formData = new FormData(form_product)
                    const data_product = {
                        name: products[product].name,
                        pieces: formData.get('pieces'),
                        name_persone: formData.get('name_persone'),
                        email: formData.get('email'),
                        address: formData.get('address'),
                        price: price
                    }
                    console.log(data_product);

                    axios.post('/product_order', data_product)
                    .then(res => {
                        console.log(res);

                        alert('товар відправлено')
                        
                    })
                    .catch(err => {
                        console.log('помивка', err);
                    })
                }
            
            })
        })
    })   
    document.addEventListener('keydown', (e) => {
        console.log('gfd');
        if (e.code == "Escape" && !modal.classList.contains('none')) { 
            close_modal();
        }
    });
}



const signup_form = document.querySelector('#signup_form');

if (signup_form) {
    signup_form.addEventListener('submit', (e) => {
        e.preventDefault()
        const formData = new FormData(signup_form)
        const data_user = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password')
        }
        axios.post('/signup', data_user)
        .then(res => {
            alert('Реєстрація успішно прийшла')
        })
        .catch(err => {
            console.log('Сталася помивка', err);
            
        })
    })
}

const review_button = document.querySelector('.review_button');



const rating_button = document.querySelectorAll('[data-rating]');
let rating = 0

if (rating_button.length > 0) {
    rating_button.forEach(item => {
        item.addEventListener('click', () => {
            rating = item.getAttribute('data-rating')
            const rating_box_button_img = document.querySelectorAll('.rating_box_button img');
            for (let i = 0; i < rating_button.length; i++) {
                rating_box_button_img[i].classList.remove('activer_rating')
            }
            for (let i = 0; i < rating; i++) {
                rating_box_button_img[i].classList.add('activer_rating')
            }
        })
    })
}


if (review_button) {
    review_button.addEventListener('click', () => {
        let select_value = document.querySelector('#select').value
        if (select_value && rating !== 0) {
            const data_review = {
                name_product: select_value,
                review_text: document.querySelector('#review_textarea').value || 'нема',
                rating: rating,
                date: new Date().toLocaleString()
            }
            console.log(data_review);
            
            axios.post('/review', data_review)
            .then(res => {
                alert('Відглук відправлений')
            })
            .catch(err => {
                console.log('стаслась помивка', err);
            })
        }
    })
}



function open_modal() {
    modal.classList.remove('none')
    document.body.style.overflow = 'hidden'
}
function close_modal() {
    modal.classList.add('none')
    document.body.style.overflow = ''
}


