(document.getElementById('main-header').style.border='solid 3px #000')  
document.getElementById('title').innerHTML='<b> Add Items </b>'
document.getElementById('title').style.color='green'


//let items = document.getElementsByTagName('li');

/*items[2].style.backgroundColor='green';

for(var i=0;i<items.length;i++)
{items[i].style.fontWeight='bold'
items[i].style.background='#f4f4f4'}*/


var item2 = document.querySelectorAll('.list-group-item');


item2[1].style.backgroundColor='green';

item2[2].style.opacity='0.0';