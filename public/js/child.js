async function api(path, opts={}){
  const res = await fetch(path, { credentials:'include', headers:{'Content-Type':'application/json'}, ...opts });
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
  return res.json();
}
document.getElementById('btnLogout')?.addEventListener('click', async()=>{
  await api('/api/auth/logout', { method:'POST' }); location.href='/';
});
const list = document.getElementById('taskList');
function renderTasks(rows){
  list.innerHTML='';
  rows.forEach(t=>{
    const li = document.createElement('li');
    li.innerHTML = `<span class="${t.status==='done'?'muted':''}">${t.title}</span> <div><button data-id="${t.id}" class="done">Done</button></div>`;
    list.appendChild(li);
  });
  list.querySelectorAll('.done').forEach(btn=> btn.addEventListener('click', async (e)=>{
    const id = e.target.getAttribute('data-id');
    await api('/api/child/tasks/'+id, { method:'PATCH', body: JSON.stringify({ status:'done' }) });
    load();
  }));
}
document.getElementById('taskForm')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const title = document.getElementById('taskTitle').value;
  const priority = Number(document.getElementById('taskPriority').value||0);
  await api('/api/child/tasks', { method:'POST', body: JSON.stringify({ title, priority }) });
  e.target.reset();
  load();
});

async function load(){
  const me = await api('/api/auth/me');
  if (!me.user || me.user.role !== 'child') location.href='/';
  const tasks = await api('/api/child/tasks');
  renderTasks(tasks);
}
load();
