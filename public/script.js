const send = document.querySelector('#send');

if (send) {
   send.addEventListener('click', () => {
        const date = new Date()
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        const month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()
        const year = date.getFullYear()
        const usere = {
            email: document.querySelector('#email').value,
            date: `${day}.${month}.${year}`
        }
        if (document.querySelector('#email').value) {
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