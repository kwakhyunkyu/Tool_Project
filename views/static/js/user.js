const userEmailEl = document.querySelector('.user-email');
const userPasswordEl = document.querySelector('.user-password');
const userConfirmPasswordEl = document.querySelector('.user-confirm-password');
const userNameEl = document.querySelector('.user-name');
const userBtnEl = document.querySelector('.user-btn');
const userDeleteBtnEl = document.querySelector('.user-delete-btn');

userBtnEl.addEventListener('click', async () => {
  if (userEmailEl.value === '' || userPasswordEl.value === '' || userNameEl.value === '')
    return alert('수정 정보를 입력해주세요');

  const response = await fetch('/api/userInfo_update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: userEmailEl.value,
      password: userPasswordEl.value,
      confirmPassword: userConfirmPasswordEl.value,
      name: userNameEl.value,
    }),
  });

  const data = await response.json();
  console.log(data);
  if (data.message === '회원정보 수정이 완료되었습니다.') {
    window.location.href = '/user';
  } else {
    return alert(data.errorMessage);
  }
});

userDeleteBtnEl.addEventListener('click', async () => {
  alert('삭제 하시겠습니까 ?');

  const response = await fetch('/api/userInfo', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  console.log(data);
  if (data.message === '회원정보 삭제가 완료되었습니다.') {
    window.location.href = '/user';
  } else {
    return alert(data.errorMessage);
  }
});
