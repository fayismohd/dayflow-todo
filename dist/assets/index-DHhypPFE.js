(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})(),((e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports))((()=>{var e=document.getElementById(`task-list`),t=document.getElementById(`task-modal`),n=document.getElementById(`task-form`),r=document.getElementById(`task-input`),i=document.getElementById(`task-category`),a=document.getElementById(`task-priority`),o=document.getElementById(`new-task-btn`),s=document.getElementById(`cancel-modal`),c=document.getElementById(`search-input`),l=document.querySelectorAll(`.filter-btn`),u=document.getElementById(`total-count`),d=document.getElementById(`completed-count`),f=document.getElementById(`progress-count`),p=document.getElementById(`task-summary`),m=document.getElementById(`clear-completed`),h=document.getElementById(`weekly-text`),g=document.getElementById(`weekly-percent`),_=document.getElementById(`weekly-progress`),v=JSON.parse(localStorage.getItem(`dayflow-tasks`))||[],y=`all`,b=null;function x(){localStorage.setItem(`dayflow-tasks`,JSON.stringify(v))}function S(){t.classList.remove(`hidden`),t.classList.add(`flex`),r.focus()}function C(){t.classList.add(`hidden`),t.classList.remove(`flex`),n.reset(),b=null,document.getElementById(`modal-title`).textContent=`Create new task`,document.getElementById(`save-task-btn`).textContent=`Add task`}o.addEventListener(`click`,S),s.addEventListener(`click`,C),n.addEventListener(`submit`,function(e){e.preventDefault();let t=r.value.trim();if(t){if(b!==null)v=v.map(e=>e.id===b?{...e,title:t,category:i.value,priority:a.value}:e);else{let e={id:Date.now(),title:t,category:i.value,priority:a.value,completed:!1};v.unshift(e)}x(),w(),C()}});function w(){e.innerHTML=``;let t=c.value.toLowerCase(),n=v.filter(e=>{let n=e.title.toLowerCase().includes(t)||e.category.toLowerCase().includes(t),r=y===`all`||y===`active`&&!e.completed||y===`completed`&&e.completed||y===`upcoming`&&!e.completed;return n&&r});n.length===0&&(e.innerHTML=`
      <div class="text-center py-12">
        <p class="text-3xl mb-3">📝</p>
        <p class="text-sm font-medium text-slate-600">
          No tasks found
        </p>
        <p class="text-xs text-slate-400 mt-1">
          Add a new task to get started.
        </p>
      </div>
    `),n.forEach(t=>{let n=document.createElement(`div`);n.className=`flex items-center gap-3 py-4 group`;let o={High:`bg-red-50 text-red-500`,Medium:`bg-orange-50 text-orange-500`,Low:`bg-emerald-50 text-emerald-500`},s=t.completed?`line-through text-slate-400`:`text-slate-700`;n.innerHTML=`
      <input
        type="checkbox"
        class="task-checkbox accent-violet-600 w-4 h-4 cursor-pointer shrink-0"
        ${t.completed?`checked`:``}
      >

      <div class="flex-1 min-w-0">
        <p class="text-xs font-medium ${s} task-title"></p>

        <p class="text-[9px] text-slate-400 mt-1">
          ${t.category}
        </p>
      </div>

      <span class="text-[9px] px-3 py-1 rounded-md ${o[t.priority]||o.Medium}">
        ${t.priority}
      </span>

      <div class="relative">
        <button class="more-btn text-slate-400 px-2 py-1 hover:bg-slate-100 rounded">
          •••
        </button>

        <div class="task-menu hidden absolute right-0 top-8 bg-white shadow-lg border border-slate-100 rounded-lg w-28 z-10">
          <button class="edit-btn block w-full text-left px-3 py-2 text-xs hover:bg-slate-50">
            Edit
          </button>
          <button class="delete-btn block w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-slate-50">
            Delete
          </button>
        </div>
      </div>
    `,n.querySelector(`.task-title`).textContent=t.title;let c=n.querySelector(`.task-checkbox`);c.addEventListener(`change`,function(){t.completed=c.checked,x(),w()});let l=n.querySelector(`.more-btn`),u=n.querySelector(`.task-menu`);l.addEventListener(`click`,function(){u.classList.toggle(`hidden`)}),n.querySelector(`.edit-btn`).addEventListener(`click`,function(){b=t.id,r.value=t.title,i.value=t.category,a.value=t.priority,document.getElementById(`modal-title`).textContent=`Edit task`,document.getElementById(`save-task-btn`).textContent=`Save changes`,S()}),n.querySelector(`.delete-btn`).addEventListener(`click`,function(){v=v.filter(e=>e.id!==t.id),x(),w()}),e.appendChild(n)}),T()}function T(){let e=v.length,t=v.filter(e=>e.completed).length,n=e-t;u.textContent=e,d.textContent=t,f.textContent=n,p.textContent=`Showing ${v.length} tasks`;let r=e===0?0:Math.round(t/e*100);h.textContent=`${t} of ${e} tasks done`,g.textContent=`${r}%`,_.style.width=`${r}%`}l.forEach(e=>{e.addEventListener(`click`,function(){y=e.dataset.filter,l.forEach(e=>{e.classList.remove(`active-filter`)}),e.classList.add(`active-filter`),w()})}),c.addEventListener(`input`,function(){w()}),m.addEventListener(`click`,function(){v=v.filter(e=>!e.completed),x(),w()});var E=new Date;document.getElementById(`current-date`).textContent=E.toLocaleDateString(`en-US`,{weekday:`long`,month:`long`,day:`numeric`,year:`numeric`}),w()}))();