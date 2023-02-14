let sum = 0;
var priceval = document.getElementById('mod')
priceval.innerHTML= `Rs. ${sum}`;

function getval(event){
    event.preventDefault();
    alert("The form has been submitted");
    var name1 = event.target.fname.value;
    var price = event.target.price.value;

let ob = {
    name1,
    price,
};

axios.post('https://crudcrud.com/api/a84fc970b1694a95883eb3df71ebf951/products',ob)
.then(val =>{
    UIelement(val.data)
    sum+=parseInt(val.data.price)
    priceval.innerHTML= `Rs. ${sum}`;
    })
.catch(err=>console.log(err));

// localStorage.setItem(mail, JSON.stringify(ob))
// UIelement(ob);

}
const ul = document.querySelector('#prods');
//var itemlist = document.querySelector('.users');

window.addEventListener("load",(e)=>{
    e.preventDefault();
axios.get('https://crudcrud.com/api/a84fc970b1694a95883eb3df71ebf951/products')
.then(val=>{
   //items=Object.keys(val);

    val.data.forEach(item => {
         UIelement(item);
         sum+=parseInt(item.price);
         priceval.innerHTML= `Rs. ${sum}`;
    // });
})
})
.catch(e=>console.log(e))
   
})


function UIelement(ob){

        var li=document.createElement('li');
        li.appendChild(document.createTextNode(`${ob.name1} : ${ob.price}`) );
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

                axios.delete(`https://crudcrud.com/api/a84fc970b1694a95883eb3df71ebf951/products/${ob._id}`)
                .then(val=>{
                    sum-=parseInt(ob.price);
                    priceval.innerHTML= `Rs. ${sum}`;
                    console.log(val.data)
                })
            }
        }
        );
        li.appendChild(newele);
        ul.appendChild(li);
}






