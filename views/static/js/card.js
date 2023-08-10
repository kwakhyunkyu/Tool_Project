document.addEventListener('DOMContentLoaded', function () {
  const deleteButtons = document.querySelectorAll('.btn-delete-card');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      deleteCard(event);
    });
  });
});

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
