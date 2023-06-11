class Question {
    constructor(question, right, wrong1, wrong2, wrong3) {
        this.question = question;
        this.right = right;
        this.wrong1 = wrong1;
        this.wrong2 = wrong2;
        this.wrong3 = wrong3;
    }
}

const quiz = [
    new Question("What is 1/4 of 100?", "25", "24", "23"),
    new Question("What color is blood?", "Red", "White", "Green", "White"),
    new Question("What color is grass?", "Green", "White", "Red", "Orange"),
    new Question("How many legs does a spider have?", "8", "6", "4", "Infinite"),
    new Question("Who is the king of the Netherlands?", "Willem-Alexander", "Willem-Alexzelf", "Willem-Alexniemand", "Willhelm-Defoe"),
    new Question("What is 2-2?", "0", "2", "4", "-1"),
    new Question("What was Vincent van Gogh?", "Artist", "Baker", "Jobless", "CEO of Success"),
    new Question("Which is the largest planet?", "Earth", "Mars", "Jupiter", "Sun"),
    new Question("What element is the most abundant on earth's crust?", "Carbon", "Iron", "Silicon", "Hydrogen"),
    new Question("Who is the fastest man alive?", "Usain Bolt", "Barry Allen", "Reverse-Flash", "Superman"),
    new Question("Which continent is the largest in size?", "Asia", "Australia", "Africa", "North America"),
    new Question("What is the end product of photosynthesis?", "Oxygen", "Carbon dioxide", "Water", "Chlorophyll"),
    new Question("Which eye color is the rarest?", "Green", "Blue", "Brown", "Grey"),
    new Question("What is the name of the most popular 90s rock band?", "LP", "Metallica", "Pendulum", "Crush"),
    new Question("The richest person on the planet is:", "Elon Mush", "Jeff Bezos", "Jack Ma", "Mukesh Ambani"),
    new Question("What is the capital of France?", "Paris", "Madrid", "Rome", "London"),
    new Question("Who wrote the novel 'Pride and Prejudice'?", "Jane Austen", "William Shakespeare", "Charles Dickens", "George Orwell"),
    new Question("What is the chemical symbol for gold?", "Au", "Ag", "Fe", "Cu"),
    new Question("Which planet is known as the 'Red Planet'?", "Mars", "Venus", "Jupiter", "Mercury"),
    new Question("What is the tallest mountain in the world?", "Mount Everest", "K2", "Kangchenjunga", "Makalu"),
    new Question("Who painted the Mona Lisa?", "Leonardo da Vinci", "Vincent van Gogh", "Pablo Picasso", "Michelangelo"),
    new Question("Which animal is known as the 'King of the Jungle'?", "Lion", "Tiger", "Leopard", "Elephant"),
    new Question("What is the largest ocean on Earth?", "Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"),
    new Question("Which country is famous for the Great Wall?", "China", "India", "Mexico", "Egypt"),
    new Question("Who invented the telephone?", "Alexander Graham Bell", "Thomas Edison", "Albert Einstein", "Nikola Tesla"),
    new Question("What is the chemical formula for water?", "H2O", "CO2", "O2", "NaCl"),
    new Question("Which city is known as the 'Eternal City'?", "Rome", "Athens", "Cairo", "Paris"),
    new Question("What is the largest mammal on Earth?", "Blue whale", "Elephant", "Giraffe", "Hippopotamus"),
    new Question("Who painted the Sistine Chapel ceiling?", "Michelangelo", "Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh"),
    new Question("What is the currency of Japan?", "Yen", "Dollar", "Euro", "Pound Sterling"),
];


var personalTime = 0;

const username = localStorage.getItem('username')
const localUsername = document.getElementById('localUsername')
const timer = document.getElementById('timer')
const plTimer = document.getElementById('personalTimer')
const token = localStorage.getItem('token')
const score = document.getElementById('score')
const exitBtn = document.getElementById('exitBtn')
let currentScore = 0

let questionCtr = 0
let ctr = document.getElementById('count')

var timeLeft = 30
const userList = document.getElementById('user_list')
let timerId
let randNum = null
let askedQs = new Set()
let randomQ = null

window.addEventListener('load', async () => {
    plTimer.innerHTML=`Elapsed time: ${personalTime}s `
    score.innerHTML = `Session score: ${currentScore}`
    timer.innerHTML = `Time left:`
    count.innerHTML = `>. ${questionCtr}/10`

    await getLdb()
    quizStart()
    personalTimer(false)

})

if (!username) {
    alert('Logged out')
    window.location.href = '/login'
}

else {
    localUsername.innerHTML = `<h5>Welcome, ${username}</h5>`
}

function logout(e) {
    e.preventDefault()
    localStorage.clear();
    alert('Logged out successfully')
    window.location.href = 'login.html'
}
exitBtn.addEventListener('click',()=>{
    if(confirm('Sure to cancel?')){
        postResult(currentScore,personalTime)
        window.location.href = "../result.html"
    }

})

async function getLdb() {
    const response = await axios.get(`http://localhost:3000/getLdb/`, {
        headers: {
            "authorization": token
        }
    })
    if (response.status == 200) {
        const topUsers = response.data.topUsers
        topUsers.forEach(user => {
            populateLdb(user)
        })
    }
}

function populateLdb(user) {
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

function aClicked() {
    timeLeft = 30;
    var answerA = document.getElementById('optionA').textContent
    console.log('selected ans: ', answerA)
    if (checkAnswer(answerA)) {
        //correct 
        document.getElementById('optionA').classList.remove('bg-info')
        document.getElementById('optionA').classList.add('bg-success')
        document.getElementById('optionA').classList.add('text-white')
        setTimeout(() => {
            document.getElementById('optionA').classList.remove('bg-success')
            document.getElementById('optionA').classList.add('bg-info')
            document.getElementById('optionA').classList.remove('text-white')
            nextQ()
        }, 500)
    }
    else {
        document.getElementById('optionA').classList.remove('bg-info')
        document.getElementById('optionA').classList.add('bg-danger')
        document.getElementById('optionA').classList.add('text-white')
        setTimeout(() => {
            document.getElementById('optionA').classList.remove('bg-danger')
            document.getElementById('optionA').classList.add('bg-info')
            document.getElementById('optionA').classList.remove('text-white')
            postResult(currentScore, personalTime)
            window.location.href = "../result.html"
        }, 500)

    }
}
function bClicked() {
    timeLeft = 30;
    var answerB = document.getElementById('optionB').textContent
    if (checkAnswer(answerB)) {
        //correct 
        document.getElementById('optionB').classList.remove('bg-info')
        document.getElementById('optionB').classList.add('bg-success')
        document.getElementById('optionB').classList.add('text-white')
        setTimeout(() => {
            document.getElementById('optionB').classList.remove('bg-success')
            document.getElementById('optionB').classList.add('bg-info')
            document.getElementById('optionB').classList.remove('text-white')
            nextQ()
        }, 500)
    }
    else {
        document.getElementById('optionB').classList.remove('bg-info')
        document.getElementById('optionB').classList.add('bg-danger')
        document.getElementById('optionB').classList.add('text-white')
        setTimeout(() => {
            document.getElementById('optionB').classList.remove('bg-danger')
            document.getElementById('optionB').classList.add('bg-info')
            document.getElementById('optionB').classList.remove('text-white')
            postResult(currentScore, personalTime)
            window.location.href = "../result.html"
        }, 500)

    }
}
function cClicked() {
    timeLeft = 30;
    var answerC = document.getElementById('optionC').textContent
    if (checkAnswer(answerC)) {
        //correct 
        document.getElementById('optionC').classList.remove('bg-info')
        document.getElementById('optionC').classList.add('bg-success')
        document.getElementById('optionC').classList.add('text-white')
        setTimeout(() => {
            document.getElementById('optionC').classList.remove('bg-success')
            document.getElementById('optionC').classList.add('bg-info')
            document.getElementById('optionC').classList.remove('text-white')
            nextQ()
        }, 500)
    }
    else {
        document.getElementById('optionC').classList.remove('bg-info')
        document.getElementById('optionC').classList.add('bg-danger')
        document.getElementById('optionC').classList.add('text-white')
        setTimeout(() => {
            document.getElementById('optionC').classList.remove('bg-danger')
            document.getElementById('optionC').classList.add('bg-info')
            document.getElementById('optionC').classList.remove('text-white')
            postResult(currentScore, personalTime)
            window.location.href = "../result.html"
        }, 500)

    }

    //wrong
}
function dClicked() {
    timeLeft = 30;
    var answerD = document.getElementById('optionD').textContent
    if (checkAnswer(answerD)) {
        //correct 
        document.getElementById('optionD').classList.add('bg-success')

        document.getElementById('optionD').classList.remove('bg-info')
        document.getElementById('optionD').classList.add('bg-success')
        document.getElementById('optionD').classList.add('text-white')
        setTimeout(() => {
            document.getElementById('optionD').classList.remove('bg-success')
            document.getElementById('optionD').classList.add('bg-info')
            document.getElementById('optionD').classList.remove('text-white')
            nextQ()
        }, 500)
    }
    else {
        document.getElementById('optionD').classList.remove('bg-info')
        document.getElementById('optionD').classList.add('bg-danger')
        document.getElementById('optionD').classList.add('text-white')
        setTimeout(() => {
            document.getElementById('optionD').classList.remove('bg-danger')
            document.getElementById('optionD').classList.add('bg-info')
            document.getElementById('optionD').classList.remove('text-white')
            postResult(currentScore, personalTime)
            window.location.href = "../result.html"
        }, 500)

    }
}

function generateRandomInteger(maxValue) {
    return Math.floor(Math.random() * maxValue);
}
const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        // Swap
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

function personalTimer() {
    function incrementSeconds() {
        personalTime += 1;
        plTimer.innerHTML=`Elapsed time: ${personalTime}s`
        if (personalTime > 300) {
            clearTimeout(cancel)
        }
    }
    var cancel = setInterval(incrementSeconds, 1000);
}

function countdown() {
    if (timeLeft == -1) {
        clearTimeout(timerId);
        timer.innerHTML = ''
        console.log('Time ended')
        timeLeft = 30;
        nextQ()
        //next question or end
        // quizFlow()
    } else {
        timer.innerHTML = `Time left: ${timeLeft} s`
        timeLeft--;
    }
}

function quizStart() {
    questionCtr = questionCtr + 1
    count.innerHTML = `>. ${questionCtr}/10`
    askedQs.add(randNum)
    randNum = generateRandomInteger(quiz.length)
    randomQ = quiz[randNum]

    let ansArray = [randomQ.right, randomQ.wrong1, randomQ.wrong2, randomQ.wrong3]
    ansArray = shuffle(ansArray)

    document.getElementById('quesSplash').innerHTML = `<h5>${randomQ.question}</h5>`
    document.getElementById('optionA').innerHTML = `<b>A: ${ansArray[0]}</b>`
    document.getElementById('optionB').innerHTML = `<b>B: ${ansArray[1]}</b>`
    document.getElementById('optionC').innerHTML = `<b>C: ${ansArray[2]}</b>`
    document.getElementById('optionD').innerHTML = `<b>D: ${ansArray[3]}</b>`

    timerId = setInterval(countdown, 1000);
}

function nextQ() {
    clearTimeout(timerId)
    if (questionCtr == 10) {
        console.log('Final score:', currentScore)
        console.log('Time elapsed:', personalTime)

        //update score to server, update leaderboard
        postResult(currentScore, personalTime)
        window.location.href = "../result.html"
    }
    else {
        questionCtr = questionCtr + 1
        count.innerHTML = `>. ${questionCtr}/10`

        randNum = generateRandomInteger(quiz.length)
        randomQ = quiz[randNum]

        if (!askedQs.has(randNum)) {

            askedQs.add(randNum)

            let ansArray = [randomQ.right, randomQ.wrong1, randomQ.wrong2, randomQ.wrong3]
            ansArray = shuffle(ansArray)

            document.getElementById('quesSplash').innerHTML = `<h5>${randomQ.question}</h5>`
            document.getElementById('optionA').innerHTML = `<b>A: ${ansArray[0]}</b>`
            document.getElementById('optionB').innerHTML = `<b>B: ${ansArray[1]}</b>`
            document.getElementById('optionC').innerHTML = `<b>C: ${ansArray[2]}</b>`
            document.getElementById('optionD').innerHTML = `<b>D: ${ansArray[3]}</b>`
        
            timerId = setInterval(countdown, 1000)
        }
        else {
            console.log('Already added this question, generate new one')
            questionCtr--
            nextQ()
            // newTimer(true)
            // quizFlow()
            return
        }
    }
}
function checkAnswer(ans) {
    const correctAnswer = ans.split(': ')[1];
    console.log('Checking answer', correctAnswer, 'with console ans:', randomQ.right)
    if (correctAnswer == randomQ.right) {
        adjustScore(true)
        return true
    }
    else {
        adjustScore(false)

        return false
    }
}

function adjustScore(correct) {
    if (correct) {
        score.innerHTML = `Session score: ${currentScore}+20`
        currentScore = currentScore + 20
        setTimeout(()=>{
            score.innerHTML = `Session score: ${currentScore}` 
        },500)
        return
    }
    else {
        currentScore = currentScore - 5
        score.innerHTML = `Session score: ${currentScore}`
        return
    }
}

async function postResult(score, time) {
    try {
        const response = await axios.post(`http://localhost:3000/postResult/`, { score: score, time: time }, {
            headers: {
                "authorization": token
            }
        })
        if (response.status == 200) {
            console.log('Result posted')
            return
        }
    }
    catch (err) {
        console.log(err)
    }
}