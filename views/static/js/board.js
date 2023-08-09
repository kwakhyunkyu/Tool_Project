// path의 보드ID를 가져오기
const boardId = window.location.pathname.split('/')[2];
window.onload = async function () {
  await columnView();
};

// 새 컬럼추가 버튼
const addBtn = document.getElementById('add-btn');
// 새컬럼 추가
const addColumn = async () => {
  const columnName = document.getElementById('column-name').value;

  await fetch(`/api/${boardId}/column`, {
    method: 'POST',
    body: JSON.stringify({
      name: columnName,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((result) => {
      alert(result.message);
    });
};
// 컬럼 추가하기 버튼
addBtn.addEventListener('click', addColumn);

// 컬럼데이터 가져오기
const getColumns = async () => {
  const datas = await fetch(`/api/${boardId}/column/`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data.datas);
      return data.datas;
    })
    .catch((err) => {
      console.log(err);
    });

  return datas;
};

// 컬럼데이터 뿌려주기
const columnView = async () => {
  // 컬럼의 데이터들
  const columns = await getColumns();
  // HTML상의 컬럼리스트document에 접근
  const columnList = document.getElementById('column-list');

  columns.forEach(async (el) => {
    const column = document.createElement('div');
    column.innerHTML = `<div id="${el.columnId}" class="column">
                          <div>
                            <h2>${el.name}</h2>
                            <input id="new-name" type="text">
                            <button id="edit-name-btn" class="edit-name-btn">이름수정</button>
                            <input id="new-order" type="text">
                            <button id="edit-order-btn" class="add-btn">순서수정</button>
                          </div>
                        </div>`;
    columnList.append(column);
  });
  // 컬럼에 포함된 카드들을 뿌려주기
  cardView();
};

// 카드데이터 가져오기
const getCards = async (columnId) => {
  const datas = await fetch(`/api/${columnId}/card`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });

  return datas;
};

// 카드데이터 뿌려주기
const cardView = async () => {
  // 컬럼의 태그정보들을 거져온다
  const columns = document.querySelectorAll('.column');
  columns.forEach(async (el) => {
    // 컬럼의 태드정보에 있는 컬럼id값을 보낸다.
    const cards = await getCards(el.id);
    // 해당 컬럼에 카드들이 있으면
    if (cards.datas) {
      cards.datas.forEach((el2) => {
        const card = document.createElement('div');
        card.innerHTML = `<div id="${el2.cardId}" class="card" style="background-color:${el2.color}">
                            ${el2.name}
                            <div>${el2.content}</div>
                          </div>`;
        el.append(card);
      });
    }
    // 해당 컬럼에 카드들이 없으면
    if (cards.message) {
      const card = document.createElement('div');
      card.innerHTML = `<div>${cards.message}</div>`;
      el.append(card);
    }
  });
};

// 컬럼 이름변경
const editBtn = document.getElementsByClassName('edit-name-btn');
editBtn.addEventListener('click', editName);
const editName = async ($event) => {
  console.log('왜 안됨?');
};
// 카드를 눌렀을 때 카드 상세페이지로 이동하기
