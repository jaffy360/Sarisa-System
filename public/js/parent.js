async function api(path, opts={}){
  const res = await fetch(path, { credentials:'include', headers:{'Content-Type':'application/json'}, ...opts });
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
  return res.json();
}
document.getElementById('btnLogout')?.addEventListener('click', async()=>{
  await api('/api/auth/logout', { method:'POST' }); location.href='/';
});
const childEmail = document.getElementById('childEmail');
document.getElementById('btnLink')?.addEventListener('click', async()=>{
  try {
    await api('/api/parent/link-child', { method:'POST', body: JSON.stringify({ childEmail: childEmail.value }) });
    load();
  } catch (e) { alert(e.message); }
});

function renderChildren(rows){
  const root = document.getElementById('children');
  root.innerHTML='';
  rows.forEach(r=>{
    const div = document.createElement('div'); div.className='card'; div.style.margin='8px 0';
    div.innerHTML = `<strong>${r.name}</strong> (${r.email})<br/>Tasks: ${r.done_tasks}/${r.total_tasks} • Points: ${r.points}`;
    root.appendChild(div);
  });
}

async function load(){
  const me = await api('/api/auth/me');
  if (!me.user || me.user.role !== 'parent') location.href='/';
  const rows = await api('/api/parent/children');
  renderChildren(rows);
}
load();
