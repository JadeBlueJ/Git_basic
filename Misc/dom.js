/*(document.getElementById('main-header').style.border='solid 3px #000')  
document.getElementById('title').innerHTML='<b> Add Items </b>'
document.getElementById('title').style.color='green'


//let items = document.getElementsByTagName('li');

/*items[2].style.backgroundColor='green';

for(var i=0;i<items.length;i++)
{items[i].style.fontWeight='bold'
items[i].style.background='#f4f4f4'}


var item2 = document.querySelectorAll('.list-group-item');


item2[1].style.backgroundColor='green';

item2[2].style.opacity='0.0';*/


//let il = document.querySelector('#items')
//il.parentElement.style.backgroundColor='#f4f4f4'


//console.log(il.firstChild);



//console.log(il.firstElementChild);
//il.firstElementChild.innerHTML='ABC'


//console.log(il.lastChild);

//console.log(il.lastElementChild);
//il.lastElementChild.innerHTML='DEF'



//console.log(il.nextSibling);

//console.log(il.nextElementSibling);
//il.nextElementSibling.innerHTML='DEF'


//console.log(il.previousSibling);

//il.previousElementSibling.style.backgroundColor='#aabbcc';
//il.previousElementSibling.style.color='green';
//il.previousElementSibling.innerHTML='DEF'

//creating a textnode and appending it to new div
let newdiv=document.createElement('div');
let newdivtext= document.createTextNode('Hello world')

newdiv.appendChild(newdivtext);




//finding exact location to add newdiv
let cont = document.querySelector('header .container');
let h1=document.querySelector('header h1')
//console.log(newdiv);
//inserting the newdib element before the h1, after cont.
cont.insertBefore(newdiv,h1);

newdiv.style.fontSize='30px'




//adding a new div after item 1:

let newdiv1=document.createElement('li');
newdiv1.classList.add('list-group-item')
let newdivtext1= document.createTextNode('Hello world')
newdiv1.appendChild(newdivtext1);

let items = document.querySelector('#items');
//console.log(items)
let index=items.firstElementChild;

console.log(index)
items.insertBefore(newdiv1,index);








