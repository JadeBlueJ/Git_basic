const form = document.querySelector('#my-form');
const nam = document.querySelector('#fname');
const email = document.querySelector('#mail');
const ul = document.querySelector('#users');
//const msg = document.querySelector('.msg');

document.addEventListener('submit', (e)=>{
    e.preventDefault();
    /*if(nam.value==='' || email.value==='')
    {
        msg.classList.add('error');
        msg.innerHTML='Please fill out the necessary fields'

        setTimeout(() => {
            msg.remove();
        }, 3000);
    }
    else */
        const li=document.createElement('li');
        li.appendChild(document.createTextNode(`${nam.value} : ${email.value}`));
        ul.append(li);
        nam.value='';
        email.value='';
    
})