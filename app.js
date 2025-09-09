const questions = [
  {
    q: 'Какова оптимальная температура воды для эспрессо?',
    a: ['80-85°C', '86-89°C', '90-96°C', '97-100°C'],
    correct: 2
  },
  {
    q: 'До какой температуры взбивают молоко для латте?',
    a: ['45-50°C', '55-60°C', '60-65°C', '70-75°C'],
    correct: 2
  },
  {
    q: 'Что НЕ относится к санитарии на баре?',
    a: ['Дезинфекция поверхностей', 'Хранение молока без охлаждения', 'Очистка кофемашины', 'Смена полотенец'],
    correct: 1
  }
];

let current = 0;
const selections = new Array(questions.length).fill(null);

const quiz = document.getElementById('quiz');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const finishBtn = document.getElementById('finish');
const result = document.getElementById('result');

function render() {
  const q = questions[current];
  quiz.innerHTML = '';

  const qEl = document.createElement('div');
  qEl.className = 'question';
  qEl.textContent = `${current + 1}. ${q.q}`;
  quiz.appendChild(qEl);

  const list = document.createElement('div');
  list.className = 'answers';
  q.a.forEach((text, idx) => {
    const btn = document.createElement('button');
    btn.className = 'answer' + (selections[current] === idx ? ' selected' : '');
    btn.textContent = text;
    btn.onclick = () => {
      selections[current] = idx;
      render();
    };
    list.appendChild(btn);
  });
  quiz.appendChild(list);

  prevBtn.disabled = current === 0;
  nextBtn.style.display = current < questions.length - 1 ? 'inline-block' : 'none';
  finishBtn.style.display = current === questions.length - 1 ? 'inline-block' : 'none';
}

prevBtn.onclick = () => {
  if (current > 0) {
    current--;
    render();
  }
};

nextBtn.onclick = () => {
  if (selections[current] === null) {
    alert('Пожалуйста, выберите ответ перед тем, как продолжить.');
    return;
  }
  if (current < questions.length - 1) {
    current++;
    render();
  }
};

finishBtn.onclick = () => {
  if (selections.includes(null)) {
    alert('Пожалуйста, ответьте на все вопросы перед завершением.');
    return;
  }

  const score = selections.reduce((acc, sel, i) => acc + (sel === questions[i].correct ? 1 : 0), 0);
  result.className = '';
  result.textContent = `Ваш результат: ${score} из ${questions.length}`;

  prevBtn.style.display = 'none';
  nextBtn.style.display = 'none';
  finishBtn.style.display = 'none';

  const restartBtn = document.createElement('button');
  restartBtn.className = 'primary';
  restartBtn.textContent = 'Начать заново';
  restartBtn.onclick = () => {
    current = 0;
    selections.fill(null);
    result.textContent = '';
    result.className = 'hidden';
    render();
  };
  document.getElementById('controls').appendChild(restartBtn);

  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.sendData(JSON.stringify({
      score: score,
      total: questions.length,
      answers: selections
    }));
    setTimeout(() => {
      window.Telegram.WebApp.close();
    }, 2000);
  } else {
    console.warn('Telegram Web App недоступен.');
    alert('Результаты сохранены. Вернитесь в Telegram.');
  }
};

if (window.Telegram && window.Telegram.WebApp) {
  window.Telegram.WebApp.ready();
}
render();
