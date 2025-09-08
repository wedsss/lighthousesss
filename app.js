
const questions = [
  {
    q: 'Какова оптимальная температура воды для эспрессо?',
    a: ['80-85C', '86-89C', '90-96C', '97-100C'],
    correct: 2
  },
  {
    q: 'До какой температуры взбивают молоко для латте?',
    a: ['45-50C', '55-60C', '60-65C', '70-75C'],
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
const shareBtn = document.getElementById('share');

function render() {
  const q = questions[current];
  quiz.innerHTML = '';

  const qEl = document.createElement('div');
  qEl.className = 'question';
  qEl.textContent = ${current + 1}. ;
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
  if (current > 0) { current--; render(); }
};
nextBtn.onclick = () => {
  if (current < questions.length - 1) { current++; render(); }
};
finishBtn.onclick = () => {
  const score = selections.reduce((acc, sel, i) => acc + (sel === questions[i].correct ? 1 : 0), 0);
  result.classList.remove('hidden');
  result.textContent = Ваш результат:  из ;
  shareBtn.classList.remove('hidden');

  // Отправляем результат в Telegram Web App
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.sendData(JSON.stringify({
      score: score,
      total: questions.length,
      answers: selections
    }));
  }
};

shareBtn.onclick = () => {
  const score = (result.textContent.match(/(\d+) из/) || [])[1] || '';
  if (navigator.share) {
    navigator.share({ title: 'Тест стажера', text: Мой результат:  });
  } else {
    alert('Скопируйте результат и отправьте в чат.');
  }
};

render();

