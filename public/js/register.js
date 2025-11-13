async function api(path, opts={}){
  const res = await fetch(path, { credentials:'include', headers:{'Content-Type':'application/json'}, ...opts });
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
  return res.json();
}
const form = document.getElementById('registerForm');
const msg = document.getElementById('registerMsg');
document.getElementById('btnBack')?.addEventListener('click', ()=> location.href='/');

form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  msg.textContent='';
  const name = document.getElementById('name').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const role = document.getElementById('role').value;
  try {
    await api('/api/auth/register', { method:'POST', body: JSON.stringify({ name, email, password, role }) });
    msg.textContent = 'Account created. You can log in now.';
  } catch (err) {
    msg.textContent = err.message;
  }
});
