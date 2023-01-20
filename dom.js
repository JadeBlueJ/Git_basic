 
(document.getElementById('main-header').style.border='solid 3px #000')  
document.getElementById('title').innerHTML='<b> Add Items </b>'
document.getElementById('title').style.color='green'

let items = document.getElementsByClassName('list-group-item');

items[2].style.backgroundColor='green';

for(var i=0;i<items.length;i++)
items[i].style.fontWeight='bold'



