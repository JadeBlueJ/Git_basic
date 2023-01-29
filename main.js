
function getval(event){
    event.preventDefault();
    alert("The form has been submitted");
    var name1 = event.target.fname.value;
    var mail = event.target.mail.value;
    var phone = event.target.phone.value;

let ob = {
    name1,
    mail,
    phone
};

localStorage.setItem(mail, JSON.stringify(ob))
UIelement(ob);

}
const ul = document.querySelector('#users');
var itemlist = document.querySelector('.users');

function UIelement(ob){

        var li=document.createElement('li');
        li.appendChild(document.createTextNode(`${ob.name1} : ${ob.mail} : ${ob.phone}`) );
        li.id=ob.mail;
        //console.log(li);

        
        var newele=document.createElement('button');
        newele.className=' btn btn-danger btn-sm m-1 float-right';
        newele.appendChild(document.createTextNode('Delete'));
        newele.id='delbtn';
        newele.onclick =() =>
        {   
            if (confirm('delete me?'))
            {   console.log(li)
                localStorage.removeItem(ob.mail)
                ul.removeChild(li);
                // why does this work? ul.removeChild(li);
            }
        }

        var editele = document.createElement('button');
        editele.className='btn btn-secondary btn-sm m-1 float-right'
        editele.appendChild(document.createTextNode('Edit'));
        editele.onclick=()=>{
            localStorage.removeItem(ob.mail);
            document.getElementById('fullname').value = ob.name1;
            document.getElementById('mailid').value = ob.mail;
            document.getElementById('phoneno').value = ob.phone;
            
            ul.removeChild(li)
        }

        li.appendChild(newele);
        li.appendChild(editele);
        ul.appendChild(li);
}






