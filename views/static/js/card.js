document.addEventListener('DOMContentLoaded', function () {
  const addCardButton = document.querySelector('#add-card-button');
  addCardButton.addEventListener('click', function (event) {
    addCard(event);
  });

  const editButtons = document.querySelectorAll('.btn-edit-card');
  editButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      editCard(event);
    });
  });

  const deleteButtons = document.querySelectorAll('.btn-delete-card');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      deleteCard(event);
    });
  });

  const moveButtons = document.querySelectorAll('.btn-move-card');
  moveButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      moveCard(event);
    });
  });
});

function getCards() {}

function addCard(event) {
  const button = event.target;
  const columnId = button.getAttribute('columnId');
  const cardName = prompt('카드 제목을 입력하세요:');

  if (cardName) {
    $.ajax({
      type: 'POST',
      url: `/api/card`,
      data: { columnId, name: cardName },
      success: (data) => {
        console.log(data);
        alert('카드가 추가되었습니다.');
      },
      error: (error) => {
        alert(error.responseJSON.error);
      },
    });
  }
}

function deleteCard(event) {
  const button = event.target;
  const cardId = button.getAttribute('deleteCardId');

  $.ajax({
    type: 'DELETE',
    url: `/api/card/${cardId}`,
    success: (data) => {
      console.log(data);
      alert(data.message);
      getCards();
    },
    error: (error) => {
      alert(error.responseJSON.error);
    },
  });
}

function editCard(event) {
  const button = event.target;
  const cardId = button.getAttribute('editCardId');
}

function moveCard(event) {
  const button = event.target;
  const cardId = button.getAttribute('moveCardId');
}
