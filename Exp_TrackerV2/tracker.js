const ul = document.querySelector('#users');
let sum = 0;
var priceval = document.getElementById('mod')
priceval.innerHTML= `Rs. ${sum}`;

function getval(event){
    alert("The form has been submitted");
    var amount = event.target.amt.value;
    var description = event.target.descr.value;
    var category = event.target.cat.value;
   
let ob = {
    amount,
    description,
    category
};

axios.post('http://localhost:3000/expense/add-expense',ob)
.then(val =>{
    // console.log(val)
    UIelement(val.data.newExpDetail)
    sum+=parseInt(val.data.newExpDetail.amount)
    priceval.innerHTML= `Rs. ${sum}`
})
.catch(err=>console.log(err));
}


//var itemlist = document.querySelector('.users');
window.addEventListener("load",(e)=>{
    e.preventDefault();
axios.get('http://localhost:3000/expense/get-expense')
.then(val=>{

    val.data.allExp.forEach(item => {
         UIelement(item);
         
    // });
})
})
.catch(e=>console.log(e))
   
})


function UIelement(ob){

        var li=document.createElement('li');
        li.appendChild(document.createTextNode(`${ob.amount} : ${ob.category} : ${ob.description}`) );
        // li.id=ob.id;
        //console.log(li);
        sum+=parseInt(ob.amount)
         priceval.innerHTML= `Rs. ${sum}`

        
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
                sum-=parseInt(ob.amount)
                priceval.innerHTML= `Rs. ${sum}`
                //Above code resolves the total sum variable
                ul.removeChild(li);
                axios.delete(`http://localhost:3000/expense/delete-expense/${ob.id}`)
                .then(val=>console.log(val.data))
                

            }
        }
        );

        var editele = document.createElement('button');
        editele.className='btn btn-secondary btn-sm m-1 float-right'
        editele.appendChild(document.createTextNode('Edit'));
        editele.onclick=()=>{
            sum-=parseInt(ob.amount)
            priceval.innerHTML= `Rs. ${sum}`

            axios.delete(`http://localhost:3000/expense/delete-expense/${ob.id}`)
                .then(val=>console.log(val.data))
            document.getElementById('amount').value = ob.amount;
            document.getElementById('descr').value = ob.description;
            document.getElementById('category').value = ob.category;
            ul.removeChild(li)

        }

        li.appendChild(newele);
        li.appendChild(editele);
        ul.appendChild(li);
}






