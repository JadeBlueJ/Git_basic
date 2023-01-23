var addForm =document.getElementById('addForm');
var itemlist = document.getElementById('items');
var listlist=document.querySelector('#items');




addForm.addEventListener('submit',addItem);
itemlist.addEventListener('click',remove);

function addItem(e)
{
    e.preventDefault();
    var newitem=document.getElementById('item');
    var it2 = document.getElementById('item2');
    
    var li = document.createElement('li');

    li.classList.add('list-group-item')
    //console.log(li);

    li.appendChild(document.createTextNode(`${newitem.value } ${it2.value}`));

    var btn = document.createElement('button')
    //or we can add:
    //btn.classList.add('btn', 'btn-danger', 'btn-sm', 'float-right' ,'delete');
    //btn.innerText='X';
    var newele=document.createElement('button');
    newele.className=' btn btn-primary btn-sm float-right';
    newele.appendChild(document.createTextNode('Edit'));
    //itemlist.children[i].appendChild(newele);
    
    btn.className = ' btn btn-danger btn-sm float-right delete'
    btn.appendChild(document.createTextNode('X'));

    li.appendChild(btn);
    li.appendChild(newele)

    itemlist.appendChild(li);


    
}

function remove(e)
    {
    if(e.target.classList.contains('delete'))
        if(confirm('Are you sure'))
        {
            {
                var li = e.target.parentElement;
                itemlist.removeChild(li);
            } 
        }
        
    }

    //var items= document.getElementsByTagName('li');
    
    //console.log(listlist.children.length)
    
    for(i=0; i<listlist.children.length;i++)
    {   
        var newele=document.createElement('button');
        newele.className=' btn btn-primary btn-sm float-right';
        newele.appendChild(document.createTextNode('Edit'));
        itemlist.children[i].appendChild(newele);
        
    }

var filt = document.getElementById('filter');

//add event grabber
filt.addEventListener('keyup',filter)
function filter(e)
{   //console.log(Array.from(itemlist.children))
    var text= e.target.value.toLowerCase();
    Array.from(itemlist.children).forEach(function(item){ 
            var itemname = item.firstChild.textContent;
            

            if(itemname.toLowerCase().indexOf(text)!=-1)
            {
            item.style.display='block'
            }
            else 
            {
            item.style.display='none'
            }
    
})
    
}