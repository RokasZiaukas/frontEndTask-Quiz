let questions = [];
let currentQ = 0;
let score = 0;
let totalQ = 10;

async function startQuiz() {
    totalQ = document.getElementById('numQuestions').value;
    try {
        const response = await fetch(`https://opentdb.com/api.php?amount=${totalQ}&type=multiple`);

        const data = await response.json();
        questions = data.results.map(q => ({
            question: decodeHtml(q.question),
            correct: decodeHtml(q.correct_answer),
            answers: formQuestions([decodeHtml(q.correct_answer), ...q.incorrect_answers.map(decodeHtml)])
        }));

        currentQ = 0;
        score = 0;

        show('quiz');
        
        displayQuestion();

    } catch (error) {
        alert('Error has occured. Try again.');
    }
}

function displayQuestion() {
    if (currentQ >= questions.length) {
        showResults();
        return;
    }
    const q = questions[currentQ];

    document.getElementById('progress').textContent = `Question ${currentQ + 1} of ${totalQ}`;
    document.getElementById('question').textContent = q.question;
    
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';

    q.answers.forEach(answer => {
        const btn = document.createElement('button');
        btn.className = 'answer';
        btn.textContent = answer;
        btn.onclick = () => selectAnswer(btn, answer);
        answersDiv.appendChild(btn);
    });

    document.getElementById('nextBtn').disabled = true;
}

function selectAnswer(btn, answer) {
    const correct = questions[currentQ].correct;
    document.querySelectorAll('.answer').forEach(b => {
        b.disabled = true;
        if (b.textContent === correct) b.className = 'answer correct';
        else if (b === btn && answer !== correct) b.className = 'answer incorrect';
    });
    if (answer === correct) score++;
    document.getElementById('nextBtn').disabled = false;
}

function nextQuestion() {
    currentQ++;
    displayQuestion();
}

function showResults() {
    document.getElementById('score').textContent = `Your Score: ${score}/${totalQ}`;
    show('results');
}

function restart() {
    show('setup');
}

function show(screen) {
    ['setup', 'quiz', 'results'].forEach(s => 
        document.getElementById(s).style.display = s === screen ? 'block' : 'none'
    );
}

function formQuestions(array) {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}
