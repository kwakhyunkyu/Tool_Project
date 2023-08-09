const boardEl = document.querySelector('.board');

const getData = async () => {
  const response = await fetch('/api/boards');
  const { data } = await response.json();
  console.log(data);
  const temp = data.map((data) => {
    let color;
    if (data.color === 'WHITE') {
      color = '#F5F5DC';
    } else if (data.color === 'RED') {
      color = '#DC143C';
    } else {
      color = '#32CD32';
    }
    return `
      <li style="background-color: ${color};">
        <a href=/boards/${data.boardId}>
          <h3 class="board-title">${data.name}</h3>
          <p class="board-desc">${data.description}</p>
        </a>
      </li>
      `;
  });
  const joinTemp = temp.join(' ');
  boardEl.innerHTML = joinTemp;
};

getData();

const nameInput = document.querySelector('.name-input');
const descInput = document.querySelector('.desc-input');
const boardCreateBtn = document.querySelector('.board-create-btn');

boardCreateBtn.addEventListener('click', async () => {
  const response = await fetch('/api/boards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: nameInput.value,
      description: descInput.value,
      color: 'WHITE',
    }),
  });
  const data = await response.json();
  console.log(data);
  if (data.message === '보드가 성공적으로 생성되었습니다.') {
    window.location.reload();
  } else {
    return alert(data.errorMessage);
  }
});
