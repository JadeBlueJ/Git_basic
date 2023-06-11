const username = localStorage.getItem('username')
const localUsername = document.getElementById('localUsername')
const startBtn = document.getElementById('startBtn')
const token = localStorage.getItem('token')
const userList = document.getElementById('user_list') 
document.addEventListener('DOMContentLoaded', async() => {
    await getLdb()
    if (!username) {
        alert('Logged out')
        window.location.href = '/login'
    }

    else {

        localUsername.innerHTML = `<h5>Welcome, ${username}</h5>`
    }

})
startBtn.addEventListener('click', () => {
    window.location.href = '../quiz.html'
})

function logout(e) {
    e.preventDefault()
    localStorage.clear();
    alert('Logged out successfully')
    window.location.href = 'login.html'
}
async function getLdb() {
    const response = await axios.get(`http://localhost:3000/getLdb/`, {
        headers: {
            "authorization": token
        }
    })
    if (response.status == 200) {
        const topUsers = response.data.topUsers
        topUsers.forEach(user => {
            popLdb(user)
        })
    }
}
function popLdb(user) {
    var row = document.createElement('tr');
    row.id = user.id
    var scoreCell = document.createElement('td');
    scoreCell.innerText = user.bestScore;
    scoreCell.className = 'text-center text-white'
    row.appendChild(scoreCell);

    var name_cell = document.createElement('td');
    name_cell.innerText = user.fname;
    name_cell.className = 'text-center text-white'
    row.appendChild(name_cell);

    var time_cell = document.createElement('td');
    time_cell.innerText = user.bestTime;
    time_cell.className = 'text-center text-white'
    row.appendChild(time_cell);

    userList.appendChild(row);
}