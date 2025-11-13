async function api(path, opts={}){
  const res = await fetch(path, { credentials:'include', headers:{'Content-Type':'application/json'}, ...opts });
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
  return res.json();
}
const loginForm = document.getElementById('loginForm');
const btnRegister = document.getElementById('btnRegister');
const loginMsg = document.getElementById('loginMsg');
btnRegister?.addEventListener('click', ()=> location.href='/registration.html');

loginForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  loginMsg.textContent='';
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const data = await api('/api/auth/login', { method:'POST', body: JSON.stringify({ email, password }) });
    if (data.user.role === 'parent') location.href='/parent.html';
    else location.href='/child.html';
  } catch (err) {
    loginMsg.textContent = err.message;
  }
});
