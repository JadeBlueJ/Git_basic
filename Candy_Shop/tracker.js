const ul = document.querySelector('#users');


function getval(event){
    alert("The form has been submitted");
    var cname = event.target.cname.value;
    var description = event.target.descr.value;
    var cprice = event.target.cprice.value;
    var qty = event.target.qty.value;
   
let ob = {
    cname,
    description,
    cprice,
    qty
};

axios.post('http://localhost:3000/shop/add-candy',ob)
.then(val =>{
    // console.log(val)
    UIelement(val.data.newCandyDetail)
})
.catch(err=>console.log(err));
}


//var itemlist = document.querySelector('.users');
window.addEventListener("DOMContentLoaded",(e)=>{
    e.preventDefault();
axios.get('http://localhost:3000/shop/get-candies')
.then(val=>{
    val.data.allCandy.forEach(item => {
    UIelement(item);
    // });
})
})
.catch(e=>console.log(e))
   
})

function UIelement(ob){

        var li=document.createElement('li');
        li.appendChild(document.createTextNode(`${ob.cname} : ${ob.description} : ${ob.cprice}: ${ob.qty}`) );
        // li.id=ob.id;
        //console.log(li);        
        var b1=document.createElement('button');
        b1.className=' btn btn-info btn-sm m-1 float-right';
        b1.appendChild(document.createTextNode('Buy 1'));
        b1.id='b1';

        var b2=document.createElement('button');
        b2.className=' btn btn-info btn-sm m-1 float-right';
        b2.appendChild(document.createTextNode('Buy 2'));
        b2.id='b2';

        var b3=document.createElement('button');
        b3.className=' btn btn-info btn-sm m-1 float-right';
        b3.appendChild(document.createTextNode('Buy 3'));
        b3.id='b3';

        if (ob.qty>=1)
        {   li.appendChild(b1)
            b1.addEventListener("click", ()=>
            {       
                    if(ob.qty>1)
                    {   if(confirm('Buy 1?'))
                        {   

                            axios.put(`http://localhost:3000/shop/update-candy-1/${ob.id}`)
                            // .then(result=>axios.get(`http://localhost:3000/shop/get-candy/${ob.id}`))
                            // .then(val=>UIelement(val))
                            // .catch(e=>console.log(e))

                            location.reload()
                        }

                    }
                    else if(confirm('Buy last candy?')){
                        ul.removeChild(li);
                        axios.delete(`http://localhost:3000/shop/delete-candy/${ob.id}`)
                        .then(val=>console.log(val.data))
                        }
            });
        }
        if (ob.qty>=2)
        {   li.appendChild(b2)
            b2.addEventListener("click", ()=>
            {       
                    if(ob.qty>2)
                    {   if(confirm('Buy 2?'))
                        {   

                            axios.put(`http://localhost:3000/shop/update-candy-2/${ob.id}`)
                            // .then(result=>axios.get(`http://localhost:3000/shop/get-candy/${ob.id}`))
                            // .then(val=>UIelement(val))
                            // .catch(e=>console.log(e))
                            location.reload()
                        }
                    }
                    else if(confirm('Buy last 2 candies?')){
                        ul.removeChild(li);
                        axios.delete(`http://localhost:3000/shop/delete-candy/${ob.id}`)
                        .then(val=>console.log(val.data))
                        }
            });
        }

        if (ob.qty>=3)
        {   li.appendChild(b3)
            b3.addEventListener("click", ()=>
            {       
                    if(ob.qty>3)
                    {   if (confirm('Buy 3?'))
                        {   

                            axios.put(`http://localhost:3000/shop/update-candy-3/${ob.id}`)
                            // .then(result=>axios.get(`http://localhost:3000/shop/get-candy/${ob.id}`))
                            // .then(val=>UIelement(val))
                            // .catch(e=>console.log(e))
                            location.reload()
                        }
                    }
                    else if(confirm('Buy last 3 candies?')){
                        ul.removeChild(li);
                        axios.delete(`http://localhost:3000/shop/delete-candy/${ob.id}`)
                        .then(val=>console.log(val.data))
                        }
            });
        }
        ul.appendChild(li);
    }







