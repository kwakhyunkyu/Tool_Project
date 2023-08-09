const authEmailEl = document.querySelector('.auth-email');
const authPasswordEl = document.querySelector('.auth-password');
const authConfirmPasswordEl = document.querySelector('.auth-confirm-password');
const authNameEl = document.querySelector('.auth-name');
const authBtnEl = document.querySelector('.auth-btn');

authBtnEl.addEventListener('click', async () => {
  if (authEmailEl.value === '' || authPasswordEl.value === '' || authNameEl.value === '')
    return alert('id를 입력해주세요');

  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: authEmailEl.value,
      password: authPasswordEl.value,
      confirmPassword: authConfirmPasswordEl.value,
      name: authNameEl.value,
    }),
  });

  const data = await response.json();
  console.log(data);
  if (data.message === '회원가입이 완료되었습니다.') {
    window.location.href = '/login';
  } else {
    return alert(data.errorMessage);
  }
});
