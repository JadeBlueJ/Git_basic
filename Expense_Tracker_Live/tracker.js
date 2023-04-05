const ul = document.querySelector('#users');
let sum = 0;
var priceval = document.getElementById('mod')
priceval.innerHTML= `Rs. ${sum}`;
const token = localStorage.getItem('token')
const rzpbtn = document.getElementById('rzpbtn')

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

    axios.post('http://localhost:3000/expense/add-expense',ob,{headers:{"authorization":token}},)
    .then(val =>{
        // console.log(val)
        UIelement(val.data.newExpDetail)
        sum+=parseInt(val.data.newExpDetail.amount)
        priceval.innerHTML= `Rs. ${sum}`
    })
    .catch(err=>console.log(err));
}


//var itemlist = document.querySelector('.users');
window.addEventListener("load",async(e)=>{
    e.preventDefault();

    axios.get('http://localhost:3000/expense/get-expense',{headers:{"authorization":token}})
    .then(val=>{

        val.data.allExp.forEach(item => {
            UIelement(item);
    })

})
.catch(e=>console.log(e))
     axios.get('http://localhost:3000/purchase/premiumStatus',{headers:{"authorization":token}}).then(response=>{
    console.log(response)
    const isPremium = response.data.isPremium
    if(isPremium) rzpbtn.remove()
    })            

})

rzpbtn.onclick = async function (e){ 
    const response = await axios.get('http://localhost:3000/purchase/premiummembership',{headers:{"authorization":token}})
    
    var options = {
        "key":response.data.key_id,
        "order_id":response.data.order.id,
        "handler": async function (response){
        const updateResponse = await axios.post('http://localhost:3000/purchase/updatetxnstatus',{
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id,
                },{headers:{"authorization":token}})
            console.log(updateResponse.data)
                
            alert('You are a premium user now')
            rzpbtn.remove()
            }

    }
    const rzp1 = new Razorpay(options)
    rzp1.open();
    e.preventDefault();
    
    rzp1.on('payment failed', function (response){
        console.log(response)
        alert('Something went wrong')
    })

}

 



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
            {   
                sum-=parseInt(ob.amount)
                priceval.innerHTML= `Rs. ${sum}`
                //Above code resolves the total sum variable
                ul.removeChild(li);
                axios.delete(`http://localhost:3000/expense/delete-expense/${ob.id}`,{headers:{"authorization":token}})
                .then(val=>console.log(val.data))
            }
        }
        );

        // var editele = document.createElement('button');
        // editele.className='btn btn-secondary btn-sm m-1 float-right'
        // editele.appendChild(document.createTextNode('Edit'));
        // editele.onclick=()=>{
        //     sum-=parseInt(ob.amount)
        //     priceval.innerHTML= `Rs. ${sum}`

        //     axios.delete(`http://localhost:3000/expense/delete-expense/${ob.id}`)
        //         .then(val=>console.log(val.data))
        //     document.getElementById('amount').value = ob.amount;
        //     document.getElementById('descr').value = ob.description;
        //     document.getElementById('category').value = ob.category;
        //     ul.removeChild(li)

        // }

        li.appendChild(newele);
        // li.appendChild(editele);
        ul.appendChild(li);
}






