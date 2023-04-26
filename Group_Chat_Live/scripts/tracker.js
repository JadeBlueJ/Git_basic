let sum=0
var priceval = document.getElementById('mod')
priceval.innerHTML= `Rs. ${0}`;
const token = localStorage.getItem('token')
const rzpbtn = document.getElementById('rzpbtn')
const leaderbtn= document.getElementById('leaderbtn')
const leadercard= document.getElementById('leaderboard_card')
const leaderlist = document.getElementById('leaderboard')
const reportbtn = document.getElementById('reportbtn')
const report_card = document.getElementById('report_card')
const report_card_month = document.getElementById('report_card_month')
const report_card_year = document.getElementById('report_card_year')
const downbtn = document.getElementById('downbtn')
const usertable = document.getElementById('usertable')
const leadertable = document.getElementById('leadertable')
const report_table = document.getElementById('report-table')
const report_table_month = document.getElementById('report-table-month')
const report_table_year = document.getElementById('report-table-year')
const reportbtn1 = document.getElementById('reportbtn1')
const reportbtn2 = document.getElementById('reportbtn2')
const archive_card = document.getElementById('archive_card')
const tableBody = document.querySelector('#usertable tbody');
const ul=document.getElementById('archives')

let itemsPerPage = 5;
const itemsPerPageSelect = document.getElementById('items-per-page');
const storedItemsPerPage = localStorage.getItem('itemsPerPage');
if (storedItemsPerPage) {
  itemsPerPageSelect.value = storedItemsPerPage;
  itemsPerPage = parseInt(storedItemsPerPage);
}


itemsPerPageSelect.addEventListener('change', (event) => {
    // Set the itemsPerPage variable and store it in localStorage
    itemsPerPage = parseInt(event.target.value);
    localStorage.setItem('itemsPerPage', event.target.value);
    window.location.reload()
  });

let currentPage = 1;

function displayTableItems(items, page) {

  tableBody.innerHTML = '';

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = items.slice(startIndex, endIndex);
  itemsToShow.forEach((item) => {
    UIelement(item);
    // tableBody.appendChild(row);
  });
}

function setupPagination(items) {
  const paginationContainer = document.querySelector('.pagination');
  paginationContainer.innerHTML = '';

  const pageCount = Math.ceil(items.length / itemsPerPage);
  for (let i = 1; i <= pageCount; i++) {
    const li = document.createElement('li');
    li.classList.add('page-item');
    if (i === currentPage) {
      li.classList.add('active');
    }

    const link = document.createElement('a');
    link.classList.add('page-link');
    link.setAttribute('href', '#');
    link.innerText = i;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      currentPage = i;
      displayTableItems(items, currentPage);
      const activeLink = paginationContainer.querySelector('.active');
      activeLink.classList.remove('active');
      li.classList.add('active');
    });

    li.appendChild(link);
    paginationContainer.appendChild(li);
  }
}

function getval(event){
    alert("The form has been submitted");
    var amount = event.target.amt.value;
    var description = event.target.descr.value;
    var category = event.target.cat.value;
    let ob = {amount,description,category};
    axios.post('http://localhost:3000/expense/add-expense',ob,{headers:{"authorization":token}})
    .then(val =>{
        priceval.innerHTML= `Rs. ${val.data.user.totalExp}`
        console.log(val.data.user)
        UIelement(val.data.newExpDetail)
    })
    .catch(err=>console.log(err));
}

window.addEventListener("DOMContentLoaded",async(e)=>{
    e.preventDefault();

    axios.get('http://localhost:3000/expense/get-expense',{headers:{"authorization":token}})
    .then(val=>{
        const expenses = val.data.allExp;
        priceval.innerHTML= `Rs. ${val.data.user.totalExp}`
        // console.log(val.data.user)
        setupPagination(expenses);
        displayTableItems(expenses, currentPage);
    //     val.data.allExp.forEach(item => {
    //         UIelement(item);
    // })

})
.catch(e=>console.log(e))
     axios.get('http://localhost:3000/purchase/premiumStatus',{headers:{"authorization":token}}).then(response=>{
    // console.log(response)
    const isPremium = response.data.isPremium
    if(isPremium) 
    {   
        rzpbtn.innerHTML="Premium Membership Active"
        rzpbtn.classList="btn btn-info btn-lg shadow"
        rzpbtn.onclick = null
        leaderbtn.classList="btn btn-outline-primary btn-lg shadow text-bg-warning"
        reportbtn.classList="btn btn-outline-primary btn-lg shadow text-bg-warning"
        
    }
    })
    axios.get('http://localhost:3000/user/archive',{headers:{"authorization":token}}).then(archives=>{
        // console.log(archives)
        archives.data.allDl.forEach(archive=>{
            DL_List(archive)
        })
        })          
})

function DL_List(ob)
{
    var li = document.createElement('li')
    var a = document.createElement('a');
    li.id=ob.id
    a.href = ob.fileUrl
    a.textContent = ob.createdAt 
    li.appendChild(a);
    ul.appendChild(li);
}

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
            localStorage.setItem('userDetails',JSON.stringify(updateResponse.data.user))
            alert('You are a premium user now')
            window.location.reload()
            // rzpbtn.innerHTML="Premium Member"
            // rzpbtn.classList="btn btn-info btn-lg "
            // rzpbtn.onclick = null
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
reportbtn.addEventListener('click', async() => {
  // Your report generation code here
    report_card.classList="card border-info rounded-5 p-1 m-1 border-4 px-4 py-4"
    report_card_month.classList="card border-info rounded-5 p-1 m-1 border-4 px-4 py-4 visually-hidden"
    report_card_year.classList="card border-info rounded-5 p-1 m-1 border-4 px-4 py-4 visually-hidden"
    downbtn.classList="btn btn-outline-primary btn-lg shadow text-bg-warning"
    reportbtn1.classList="btn btn-outline-primary btn-lg shadow text-bg-warning"
    reportbtn2.classList="btn btn-outline-primary btn-lg shadow text-bg-warning"
    archive_card.classList="card border-info rounded-5 p-1 m-1 border-4 px-4 py-4"
    axios.get('http://localhost:3000/expense/get-expense',{headers:{"authorization":token}})
    .then(val=>{

        val.data.allExp.forEach(item => {
            dailyReport(item);
            })
        });
    })

reportbtn1.addEventListener('click', async() => {
    const expensesByMonth = {};
    
    report_card.classList="card border-info rounded-5 p-1 m-1 border-4 px-4 py-4 visually-hidden"
    report_card_month.classList="card border-info rounded-5 p-1 m-1 border-4 px-4 py-4 "
    report_card_year.classList="card border-info rounded-5 p-1 m-1 border-4 px-4 py-4 visually-hidden"
    downbtn.classList="btn btn-outline-primary btn-lg shadow text-bg-warning"
    reportbtn1.classList="btn btn-outline-primary btn-lg shadow text-bg-warning visually-hidden"
    reportbtn2.classList="btn btn-outline-primary btn-lg shadow text-bg-warning"
    
    axios.get('http://localhost:3000/expense/get-expense',{headers:{"authorization":token}})
        .then(val=>{
        val.data.allExp.forEach(item => {
            const date = new Date(item.createdAt);
            const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
            if (!expensesByMonth[yearMonth]) {
            expensesByMonth[yearMonth] = {
                month: yearMonth,
                total: 0,
                expenses: []
            };
            }
            expensesByMonth[yearMonth].total += item.amount;
            expensesByMonth[yearMonth].expenses.push(item);
        });
    
        for (const month in expensesByMonth) {
            const monthExpenses = expensesByMonth[month];
            const table = document.createElement('table');
            table.classList="table-bordered"
    
            // Create the table header and add it to the table
            const headerRow = document.createElement('tr');
            const headers = ['Date', 'Description', 'Category', 'Expense Amount'];
            headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.innerText = headerText;
            headerRow.appendChild(headerCell);
            });
            table.appendChild(headerRow);
    
            // Create a row for each expense and add it to the table
            monthExpenses.expenses.forEach(expense => {
            const row = document.createElement('tr');
            const dateCell = document.createElement('td');
            const date = new Date(expense.createdAt);
            dateCell.innerText = date.toLocaleDateString('en-GB');
            row.appendChild(dateCell);
    
            const descriptionCell = document.createElement('td');
            descriptionCell.innerText = expense.description;
            row.appendChild(descriptionCell);
    
            const categoryCell = document.createElement('td');
            categoryCell.innerText = expense.category;
            row.appendChild(categoryCell);
    
            const amountCell = document.createElement('td');
            amountCell.innerText = expense.amount;
            row.appendChild(amountCell);
    
            table.appendChild(row);
            });
    
            // Add a row for the total expenses for the month
            const totalRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 3;
            totalRow.appendChild(emptyCell);
    
            const totalCell = document.createElement('td');
            totalCell.innerText = monthExpenses.total;
            totalRow.appendChild(totalCell);
            table.appendChild(totalRow);
    
            // Add the table to the page
            report_card_month.appendChild(table);
        }
        });
    });
      
reportbtn2.addEventListener('click', async() => {
    const expensesByYear = {};
    
    report_card.classList="card border-info rounded-5 p-1 m-1 border-4 px-4 py-4 visually-hidden"
    report_card_month.classList="card border-info rounded-5 p-1 m-1 border-4 px-4 py-4 visually-hidden"
    report_card_year.classList="card border-info rounded-5 p-1 m-1 border-4 px-4 py-4 "
    downbtn.classList="btn btn-outline-primary btn-lg shadow text-bg-warning"
    reportbtn1.classList="btn btn-outline-primary btn-lg shadow text-bg-warning"
    reportbtn2.classList="btn btn-outline-primary btn-lg shadow text-bg-warning visually-hidden"
    
    axios.get('http://localhost:3000/expense/get-expense',{headers:{"authorization":token}})
        .then(val=>{
        val.data.allExp.forEach(item => {
            const date = new Date(item.createdAt);
            const year = date.getFullYear();
            if (!expensesByYear[year]) {
            expensesByYear[year] = {
                year: year,
                total: 0
            };
            }
            expensesByYear[year].total += item.amount;
        });
    
        const table = document.createElement('table');
    
        // Create the table header and add it to the table
        const headerRow = document.createElement('tr');
        const headers = ['Year', 'Total Expenses'];
        headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.innerText = headerText;
            headerRow.appendChild(headerCell);
        });
        table.appendChild(headerRow);
    
        // Create a row for each year and add it to the table
        for (const year in expensesByYear) {
            const yearExpenses = expensesByYear[year];
            const row = document.createElement('tr');
    
            const yearCell = document.createElement('td');
            yearCell.innerText = yearExpenses.year;
            row.appendChild(yearCell);
    
            const totalCell = document.createElement('td');
            totalCell.innerText = yearExpenses.total;
            row.appendChild(totalCell);
    
            table.appendChild(row);
        }
        // Add the table to the page
        report_card_year.appendChild(table);
        });
    });

function dailyReport(ob)
{
    // Create a new row element
    var row = document.createElement('tr');
    row.id=ob.id
  
    // Add cells for each property
    var dateCell = document.createElement('td');
    const date = new Date(ob.createdAt);
    dateCell.className = 'text-center'
    dateCell.innerText = date.toLocaleDateString('en-GB')
    row.appendChild(dateCell);
  
    var descriptionCell = document.createElement('td');
    descriptionCell.innerText = ob.description;
    descriptionCell.className = 'text-center'
    row.appendChild(descriptionCell);
  
    var categoryCell = document.createElement('td');
    categoryCell.innerText = ob.category;
    categoryCell.className = 'text-center'
    row.appendChild(categoryCell);

    var amountCell = document.createElement('td');
    amountCell.innerText = ob.amount;
    amountCell.className = 'text-center'
    row.appendChild(amountCell); 
    // Append the row to the table
    report_table.appendChild(row);
  }

leaderbtn.onclick = async function (e){ 

    leadercard.classList="card border-info rounded-5 p-1 m-1 border-4 px-4 py-4"
    const response = await axios.get('http://localhost:3000/premium/getLeaderboard',{headers:{"authorization":token}})
    console.log(response)
    response.data.forEach(entry=>{
        ldb(entry)
    })
}

function ldb(ob)
{
    // var li=document.createElement('li');
    // li.appendChild(document.createTextNode(`Total expense: ${ob.totalExp} , User Name:  ${ob.name}`) );
    // li.id=ob.userid;
    // leaderlist.appendChild(li);
    var row = document.createElement('tr');
    row.id=ob.id
    var totalCell = document.createElement('td');
    totalCell.innerText = ob.totalExp;
    totalCell.className = 'text-center'
    row.appendChild(totalCell);
    var name_cell = document.createElement('td');
    name_cell.innerText = ob.name;
    name_cell.className = 'text-center'
    row.appendChild(name_cell);
    leadertable.appendChild(row);

}

// Define the UIelement function to add a new expense row to the table
function UIelement(ob) {
  // Create a new row element
  var row = document.createElement('tr');
  row.id=ob.id

  // Add cells for each property
  var amountCell = document.createElement('td');
  amountCell.innerText = ob.amount;
  amountCell.className = 'text-center'
  row.appendChild(amountCell);

  var descriptionCell = document.createElement('td');
  descriptionCell.innerText = ob.description;
  descriptionCell.className = 'text-center'
  row.appendChild(descriptionCell);

  var categoryCell = document.createElement('td');
  categoryCell.innerText = ob.category;
  categoryCell.className = 'text-center'
  row.appendChild(categoryCell);

  // Add delete button cell
  var deleteCell = document.createElement('td');
  var deleteButton = document.createElement('button');
  deleteButton.className = 'btn btn-danger btn-sm m-1';
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click', function() {
    if (confirm('delete me?')) {
    //   sum -= parseInt(ob.amount);
      axios.delete(`http://localhost:3000/expense/delete-expense/${ob.id}`, {headers:{"authorization":token}})
        .then(val=>{
            // console.log(val.data)
            row.remove()
            priceval.innerHTML = `Rs. ${val.data.user.totalExp}`;
        });
    }
  });
  deleteCell.appendChild(deleteButton);
  deleteCell.className = 'text-center';
  row.appendChild(deleteCell);
  // Append the row to the table
  tableBody.appendChild(row);
}

function down(){

    axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 201){
            //the bcakend is essentially sending a download link
            //  which if we open in browser, the file would download
            var a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        console.log(err)
    });
}




