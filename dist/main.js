(()=>{const t="span.checkin",e="span.checkout",n="__meckano__script_globals";let r=JSON.parse(localStorage.getItem(n))||{times:{start:{min:"09:00",max:"09:30"},end:{min:"18:00",max:"18:30"},interval:10}};async function i(){const{start:n,end:s,interval:l}=r.times,m=document.querySelector("#li-monthly-employee-report");return m?(m.click(),0===await async function(){let n=await u();return o(n,t).concat(o(n,e)).filter((t=>p(new c(t[0].textContent)))).length}()?"Success!":(await a(t,n,l),await a(e,s,l),i())):"no times tab"}function o(t,e){return t.filter(h).map((t=>[t.querySelector(e),t.querySelector(`${e} + input`)]))}async function a(t,e,n){let r=await u();const i=o(r,t).length;for(let o=0;o<i;o++){r=await u();const i=r.filter(h).map((e=>[e.querySelector(t),e.querySelector(`${t} + input`)]));await s(i[o],l(e,n).getTime())}}async function s(t,e){const[n,r]=t;p(new c(n.textContent))&&(n.click(),r.value=e,r.dispatchEvent(new Event("blur")),await m(500))}localStorage.setItem(n,JSON.stringify(r));class c{hours;minutes;constructor(t){const[e=0,n=0]=t.split(":");this.hours=+e,this.minutes=+n}addTime(t){const[e,n]=t.split(":");let r=parseInt(this.minutes)+parseInt(n),i=parseInt(this.hours)+parseInt(e);r>59&&(r-=60,i++),this.minutes=r,this.hours=i}compareTime(t){const{hours:e,minutes:n}=t;return this.hours===e?this.minutes===n?0:this.minutes>n?1:-1:this.hours>e?1:-1}getTime(){const[t,e]=[this.hours.toString(),this.minutes.toString()].map((t=>t.padStart(2,"0")));return`${t}:${e}`}static isEmptyTime(t){return!t||"00:00"===t.getTime()}}function l(t,e=10){const n=new c(t.min),r=new c(t.max),i=[];for(;n.compareTime(r)<=0;)i.push(new c(n.getTime())),n.addTime(`00:${e}`);return i[(o=0,a=i.length,o=Math.ceil(o),a=Math.floor(a),Math.floor(Math.random()*(a-o))+o)];var o,a}async function u(t=1){const e=document.querySelectorAll("[data-report_data_id]");return e&&e.length?Array.from(e):(await m(1e3),u(t+1))}function m(t=1e3){return new Promise((e=>setTimeout(e,t)))}function h(t){return!(t.textContent.includes("ו")||t.textContent.includes("ש"))}function p(t){return false!==c.isEmptyTime(t)}function d(){!function(t){const e=document.createElement("textarea");e.value=t,document.body.appendChild(e),e.select(),document.execCommand("copy"),document.body.removeChild(e)}(JSON.stringify(r)),alert("Copied to clipboard! \n Feel free to edit it and paste it in the next alert");const t=prompt("Paste the new globals here");try{const e=JSON.parse(t);r=e,localStorage.setItem(n,JSON.stringify(r))}catch(t){return alert("Invalid JSON! (Retrying)"),d()}}!async function(){if(alert("Meckano-me script"),!confirm("Skip all, and start?")){alert(`here's your config: \n${JSON.stringify(r,null,2)}`);const t=confirm("wanna change any of that?");if(t&&d(),!confirm((t?"Saved, ":" ")+"would you like to start?"))return alert("Ok, see you soon")}alert("ok, let's go (Please let the browser work until you see another message like this)");var t=await i();alert(t)}()})();