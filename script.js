// Datos de ejemplo por guía (Resumen Mensual)
const sampleData = [
  {guia:'G-001', fecha:'2025-09-14', proveedor:'Proveedor A', peso:120, lote:'L-01', 
    kavetas:[{num:1,cantidad:12},{num:2,cantidad:10},{num:3,cantidad:8},{num:4,cantidad:15},{num:5,cantidad:11},{num:6,cantidad:9},{num:7,cantidad:13},{num:8,cantidad:7},{num:9,cantidad:14},{num:10,cantidad:10}]
  },
  {guia:'G-002', fecha:'2025-09-14', proveedor:'Proveedor B', peso:95, lote:'L-02', 
    kavetas:[{num:1,cantidad:8},{num:2,cantidad:9},{num:3,cantidad:7},{num:4,cantidad:10},{num:5,cantidad:6},{num:6,cantidad:12},{num:7,cantidad:11},{num:8,cantidad:9},{num:9,cantidad:8},{num:10,cantidad:7}]
  },
  {guia:'G-003', fecha:'2025-08-20', proveedor:'Proveedor C', peso:102, lote:'L-03', 
    kavetas:[{num:1,cantidad:10},{num:2,cantidad:9},{num:3,cantidad:11},{num:4,cantidad:8},{num:5,cantidad:12},{num:6,cantidad:9},{num:7,cantidad:10},{num:8,cantidad:7},{num:9,cantidad:10},{num:10,cantidad:11}]
  }
];

// Ejemplo VINs para Control Calidad
const vinData = [
  {lote:'L-01', vins:['VIN001','VIN002','VIN003','VIN004','VIN005']},
  {lote:'L-02', vins:['VIN006','VIN007','VIN008','VIN009']},
  {lote:'L-03', vins:['VIN010','VIN011','VIN012','VIN013']}
];

const $ = sel => document.querySelector(sel);

document.addEventListener('DOMContentLoaded',()=>{
  setupTabs();
  populateMesSelect();
  renderSteps();
  renderAggregates();
  initCharts();
  renderCalidad();
});

// Tabs
function setupTabs(){
  const buttons=document.querySelectorAll('.tab-btn');
  const contents=document.querySelectorAll('.tab-content');
  buttons.forEach(btn=>{
    btn.addEventListener('click',()=>{
      buttons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const target=btn.dataset.target;
      contents.forEach(c=>c.classList.remove('active'));
      const tab=document.getElementById(target);
      if(tab) tab.classList.add('active');
    });
  });
  const activeBtn=document.querySelector('.tab-btn.active');
  if(activeBtn) activeBtn.click();
}

// Populate Mes Select
function populateMesSelect(){
  const select = $('#select-mes');
  if(!select) return;
  const months = [...new Set(sampleData.map(d=>d.fecha.slice(0,7)))];
  months.forEach(m=>{
    const opt = document.createElement('option');
    opt.value=m;
    opt.textContent=m;
    select.appendChild(opt);
  });
  select.addEventListener('change',()=>renderResumenMes(select.value));
  renderResumenMes(months[0]);
}

// Render Resumen Mensual
function renderResumenMes(mes){
  const container = $('#resumen-list');
  if(!container) return;
  container.innerHTML='';
  const datosMes = sampleData.filter(d=>d.fecha.startsWith(mes));
  datosMes.forEach(g=>{
    const div = document.createElement('div');
    div.className='resumen-card';
    div.innerHTML = `<h4>Guía: ${g.guia} | ${g.fecha}</h4>
                     <p>Proveedor: ${g.proveedor} | Peso: ${g.peso} lb | Lote: ${g.lote}</p>`;
    const kavetasDiv = document.createElement('div');
    kavetasDiv.className='resumen-kavetas';
    g.kavetas.forEach(k=>{
      const kdiv = document.createElement('div');
      kdiv.textContent = `#${k.num} (${k.cantidad} lb)`;
      kavetasDiv.appendChild(kdiv);
    });
    div.appendChild(kavetasDiv);
    container.appendChild(div);
  });
}

// Render Control Calidad
function renderCalidad(){
  const container = $('#calidad-list');
  container.innerHTML='';
  vinData.forEach(lote=>{
    const loteDiv = document.createElement('div');
    loteDiv.className='calidad-lote';
    const h4 = document.createElement('h4');
    h4.textContent = `Lote: ${lote.lote}`;
    loteDiv.appendChild(h4);
    lote.vins.forEach(v=>{
      const div = document.createElement('div');
      div.className='calidad-vin';
      const chk = document.createElement('input');
      chk.type='checkbox';
      chk.addEventListener('change',updateContador);
      div.appendChild(chk);
      const span = document.createElement('span');
      span.textContent=v;
      div.appendChild(span);
      loteDiv.appendChild(div);
    });
    container.appendChild(loteDiv);
  });
  updateContador();
}

// Contador de checks
function updateContador(){
  const checks = document.querySelectorAll('#calidad-list input[type=checkbox]');
  const marked = Array.from(checks).filter(c=>c.checked).length;
  const unmarked = checks.length - marked;
  $('#check-marked').textContent = marked;
  $('#check-unmarked').textContent = unmarked;
}

// Steps, Aggregates y Charts (igual que antes)
function renderSteps(){
  const container=document.querySelector('.steps');
  if(!container) return;
  container.innerHTML='';
  const order=[
    {key:'ingreso',title:'Ingreso',desc:'Camarón recibido con guía'},
    {key:'control',title:'Control Calidad',desc:'Inspección por VIN/lote'},
    {key:'recepcion',title:'Recepción Peso',desc:'Pesaje promedio'},
    {key:'merma',title:'Verificación Merma',desc:'Cantidad real para proceso'},
    {key:'descabezado',title:'Descabezado',desc:'Solo los que tienen cabeza'},
    {key:'maquina',title:'Clasificación Máquina',desc:'Clase A/B/C'},
    {key:'empaque',title:'Empaque',desc:'Cada clase a su empaque'},
  ];
  const counts={
    ingreso:sampleData.length,
    control:sampleData.length,
    recepcion:sampleData.length,
    merma:Math.round(sampleData.length*0.95),
    descabezado:sampleData.length,
    maquina:sampleData.length,
    empaque:sampleData.length
  };
  order.forEach(s=>{
    const el=document.createElement('div');
    el.className='step';
    el.innerHTML=`<div class="step-info"><h3>${s.title}</h3><p>${s.desc}</p></div>
                    <div class="badge">${counts[s.key]}</div>`;
    container.appendChild(el);
  });
}

function renderAggregates(){
  const totalPeso = sampleData.reduce((a,b)=>a+b.peso,0);
  const avgWeight = (totalPeso / sampleData.length).toFixed(2);
  const avgEl = $('#avgWeight'); if(avgEl) avgEl.textContent=avgWeight;

  const totalProcesado = totalPeso * 0.95;
  const mermaPct = (((totalPeso - totalProcesado)/totalPeso)*100).toFixed(1);
  const mermaEl = $('#mermaPct'); if(mermaEl) mermaEl.textContent=mermaPct;

  const rendimiento = 33;
  const rendEl = $('#rendimiento'); if(rendEl) rendEl.textContent=rendimiento;
}

function initCharts(){
  const classCanvas = document.getElementById('classChart');
  const statusCanvas = document.getElementById('statusChart');
  if(classCanvas){
    const ctx = classCanvas.getContext('2d');
    new Chart(ctx,{
      type:'bar',
      data:{labels:['A','B','C'],datasets:[{label:'Cantidad por Clase',data:[3,2,1],backgroundColor:['#2563eb','#10b981','#f59e0b']}]},
      options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,stepSize:1}}}
    });
  }
  if(statusCanvas){
    const ctx2 = statusCanvas.getContext('2d');
    new Chart(ctx2,{
      type:'doughnut',
      data:{labels:['Descabezado','Máquina'],datasets:[{data:[4,6],backgroundColor:['#2563eb','#10b981']}]},
      options:{responsive:true,plugins:{legend:{position:'bottom'}}}
    });
  }
}
