let sum = 0;
var priceval = document.getElementById('mod')
priceval.innerHTML= `Rs. ${sum}`;

async function getval(event){
    event.preventDefault();
    alert("The form has been submitted");
    var name1 = event.target.fname.value;
    var price = event.target.price.value;

let ob = {
    name1,
    price,
};

    try
    {
        let resp = await axios.post('https://crudcrud.com/api/3ce73743890540dba5870b64d1ad4d2a/products',ob)

        UIelement(resp.data)
        sum+=parseInt(resp.data.price)
        priceval.innerHTML= `Rs. ${sum}`;
    }
    // localStorage.setItem(mail, JSON.stringify(ob))
    // UIelement(ob);
    catch(e)
    {
        console.log(e)
    }

}

const ul = document.querySelector('#prods');
//var itemlist = document.querySelector('.users');

window.addEventListener("load", async(e)=>{
    e.preventDefault();
    try{
        let resp = await axios.get('https://crudcrud.com/api/3ce73743890540dba5870b64d1ad4d2a/products')
   //items=Object.keys(val);
        resp.data.forEach(item => {
         UIelement(item);
         sum+=parseInt(item.price);
         priceval.innerHTML= `Rs. ${sum}`;
    // });
})
    }
catch(e)
    {
        console.log(e)
    }
})


async function UIelement(ob){

        var li=document.createElement('li');
        li.appendChild(document.createTextNode(`${ob.name1} : ${ob.price}`) );
        //console.log(li);

        
        var newele=document.createElement('button');
        newele.className=' btn btn-danger btn-sm m-1 float-right';
        newele.appendChild(document.createTextNode('Delete'));
        newele.id='delbtn';
        newele.addEventListener("click", async()=>
        {   
            if (confirm('delete me?'))
            {   //console.log(li)
                //var item = event.target.parentElement;
                //ul.removeChild(item)
                //localStorage.removeItem(item.id)
                // localStorage.removeItem(ob.mail)
                ul.removeChild(li);

                try
                {
                    let resp = await axios.delete(`https://crudcrud.com/api/3ce73743890540dba5870b64d1ad4d2a/products/${ob._id}`)
                    sum-=parseInt(ob.price);
                    priceval.innerHTML= `Rs. ${sum}`;
                    console.log(resp.data)
                    
                }
                catch(e)
                {
                    console.log(e)
                }
                }
        })

        li.appendChild(newele);
        ul.appendChild(li);
}






