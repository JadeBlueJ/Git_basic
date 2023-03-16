
function getval(event){
    event.preventDefault();
    alert("The form has been submitted");
    var amt = event.target.amount.value;
    var descr = event.target.descr.value;
    var cat = event.target.cat.value;
   
let ob = {
    amt,
    descr,
    cat
};
console.log(ob.amt)
localStorage.setItem(amt, JSON.stringify(ob))
UIelement(ob);

}
const ul = document.querySelector('#users');
//var itemlist = document.querySelector('.users');

function UIelement(ob){

        var li=document.createElement('li');
        li.appendChild(document.createTextNode(`${ob.amt} : ${ob.cat} : ${ob.descr}`) );
        li.id=ob.amt;
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
                localStorage.removeItem(ob.amt)
                ul.removeChild(li);

            }
        }
        );

        var editele = document.createElement('button');
        editele.className='btn btn-secondary btn-sm m-1 float-right'
        editele.appendChild(document.createTextNode('Edit'));
        editele.onclick=()=>{
            localStorage.removeItem(ob.amt);
            document.getElementById('amount').value = ob.amt;
            document.getElementById('descr').value = ob.descr;
            document.getElementById('category').value = ob.cat;
            
            ul.removeChild(li)
        }

        li.appendChild(newele);
        li.appendChild(editele);
        ul.appendChild(li);
}






