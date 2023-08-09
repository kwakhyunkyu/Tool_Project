const loginEmailEl = document.querySelector('.login-email');
const loginPasswordEl = document.querySelector('.login-password');
const loginBtnEl = document.querySelector('.login-btn');

loginBtnEl.addEventListener('click', async () => {
  if (loginEmailEl.value === '' || loginPasswordEl.value === '') return alert('id를 입력해주세요');

  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: loginEmailEl.value,
      password: loginPasswordEl.value,
    }),
  });

  const data = await response.json();
  console.log(data);
  if (data.message === '로그인에 성공하였습니다.') {
    window.location.href = '/';
  } else {
    return alert(data.errorMessage);
  }
});
