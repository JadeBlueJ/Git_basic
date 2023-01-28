function getval(event){
    event.preventDefault();
    alert("The form has been submitted");
const nam = document.getElementById('fname').value;
const mail = document.getElementById('mail').value;
const phone = document.getElementById('phone').value;
//const dat=document.getElementById('call').value;
//const tim =document.getElementById('tim').value;
//localStorage.setItem('name',nam);
//localStorage.setItem('mail',mail);
//localStorage.setItem('date',dat);
//localStorage.setItem('phone',phone);
//localStorage.setItem('time',tim);
let ob = {
    name : nam,
    mail : mail,
    phone : phone,
    //date : dat,
    //time : tim,
};

localStorage.setItem(mail, JSON.stringify(ob))

}

const form = document.querySelector('#my-form');
const nam = document.querySelector('#fname');
const email = document.querySelector('#mail');
const phon = document.querySelector('#tel')
const ul = document.querySelector('#users');
//const msg = document.querySelector('.msg');
var itemlist = document.querySelector('.users');

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
        ul.appendChild(li);
        nam.value='';
        email.value='';
        phone.value='';
        
        var newele=document.createElement('button');
        newele.className=' btn btn-danger btn-sm m-1 float-right';
        newele.appendChild(document.createTextNode('Delete'));
        newele.id='delbtn';

        newele.onclick =() =>
        {
            if (confirm('delete me'))
            {
                ul.removeChild(li);
                //itemlist.removeChild(delitem);
            }
        }
        li.appendChild(newele);
})






