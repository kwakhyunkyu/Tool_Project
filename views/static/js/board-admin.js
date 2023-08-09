const boardEl = document.querySelector('.board');
const getData = async () => {
  const response = await fetch('/api/boards-admin');
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
      <li data-id=${data.boardId} style="background-color: ${color};">
          <h3 class="board-title">${data.name}</h3>
          <p class="board-desc">${data.description}</p>
          <button class="board-edit-btn">수정하기</button>
          <button class="board-delete-btn">삭제하기</button>
      </li>
      `;
  });
  const joinTemp = temp.join(' ');
  boardEl.innerHTML = joinTemp;
};
getData();

boardEl.addEventListener('click', async function (e) {
  if (
    !e.target.classList.contains('board-edit-btn') &&
    !e.target.classList.contains('board-delete-btn')
  )
    return;
  const boardId = e.target.parentNode.getAttribute('data-id');
  if (e.target.classList.contains('board-edit-btn')) {
    window.location.href = `/boards-edit/${boardId}`;
  }
  console.log(boardId);
  if (e.target.classList.contains('board-delete-btn')) {
    if (!confirm('정말로 삭제하시겠습니까?')) return;

    const response = await fetch(`/api/boards/${boardId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data);
    if (data.message === '삭제가 완료되었습니다.') {
      window.location.reload();
    } else {
      alert(data.message);
    }
  }
});
