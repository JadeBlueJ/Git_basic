
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

axios.post('https://crudcrud.com/api/7f911fed0d704e9684b1c60fcc4099a2/appointment',ob)
.then(val =>UIelement(val.data))
.catch(err=>console.log(err));

// localStorage.setItem(mail, JSON.stringify(ob))
// UIelement(ob);

}
const ul = document.querySelector('#users');
//var itemlist = document.querySelector('.users');

window.addEventListener("load",(e)=>{
    e.preventDefault();
axios.get('https://crudcrud.com/api/7f911fed0d704e9684b1c60fcc4099a2/appointment')
.then(val=>{
   //items=Object.keys(val);
    console.log(val.data)
    val.data.forEach(item => {
         UIelement(item);
    // });
})
})
.catch(e=>console.log(e))
   
})

function UIelement(ob){

        var li=document.createElement('li');
        li.appendChild(document.createTextNode(`${ob.name1} : ${ob.mail} : ${ob.phone}`) );
        li.id=ob.mail;
        //console.log(li);

        
        var newele=document.createElement('button');
        newele.className=' btn btn-danger btn-sm m-1 float-right';
        newele.appendChild(document.createTextNode('Delete'));
        newele.id='delbtn';
        newele.addEventListener("click", ()=>
        {   
            if (confirm('delete me?'))
            {   //console.log(li)
                //var item = event.target.parentElement;
                //ul.removeChild(item)
                //localStorage.removeItem(item.id)
                // localStorage.removeItem(ob.mail)
                ul.removeChild(li);

                axios.delete(`https://crudcrud.com/api/7f911fed0d704e9684b1c60fcc4099a2/appointment/${ob._id}`)
                .then(val=>console.log(val.data))

            }
        }
        );

        var editele = document.createElement('button');
        editele.className='btn btn-secondary btn-sm m-1 float-right'
        editele.appendChild(document.createTextNode('Edit'));
        editele.onclick=()=>{
            // localStorage.removeItem(ob.mail);
            document.getElementById('fullname').value = ob.name1;
            document.getElementById('mailid').value = ob.mail;
            document.getElementById('phoneno').value = ob.phone;
            
            ul.removeChild(li)
        }

        li.appendChild(newele);
        li.appendChild(editele);
        ul.appendChild(li);
}






