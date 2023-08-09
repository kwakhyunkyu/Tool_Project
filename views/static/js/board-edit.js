const boardId = window.location.pathname.split('/')[2];

console.log(boardId);
const colorEl = document.querySelector('.color');
const titleInputEl = document.querySelector('.title-input');
const descInputEl = document.querySelector('.desc-input');
const editBtnEl = document.querySelector('.edit-btn');

let colorValue;
const getData = async () => {
  const response = await fetch(`/api/boards/${boardId}`);
  const { data } = await response.json();
  console.log(data);
  titleInputEl.value = data.name;
  descInputEl.value = data.description;
  colorValue = data.color;
  const selectChange = () => {
    colorValue = colorEl.options[colorEl.selectedIndex].value;
  };
  colorEl.addEventListener('change', selectChange);
};
getData();

editBtnEl.addEventListener('click', async () => {
  const response = await fetch(`/api/boards/${boardId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: titleInputEl.value,
      description: descInputEl.value,
      color: colorValue,
    }),
  });
  const data = await response.json();
  console.log(data);
  if (data.message === '수정이 완료되었습니다.') {
    window.location.href = '/boards-admin';
  }
});
