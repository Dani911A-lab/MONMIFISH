// Datos de ejemplo por guía (Kavetas en libras, 10 ejemplos)
const sampleData = [
  {guia:'G-001', fecha:'2025-09-14', proveedor:'Proveedor A', peso:120, lote:'L-01', 
    kavetas:[
      {num:1,cantidad:12},{num:2,cantidad:10},{num:3,cantidad:8},{num:4,cantidad:15},
      {num:5,cantidad:11},{num:6,cantidad:9},{num:7,cantidad:13},{num:8,cantidad:7},
      {num:9,cantidad:14},{num:10,cantidad:10}
    ]
  },
  {guia:'G-002', fecha:'2025-09-14', proveedor:'Proveedor B', peso:95, lote:'L-02', 
    kavetas:[
      {num:1,cantidad:8},{num:2,cantidad:9},{num:3,cantidad:7},{num:4,cantidad:10},
      {num:5,cantidad:6},{num:6,cantidad:12},{num:7,cantidad:11},{num:8,cantidad:9},
      {num:9,cantidad:8},{num:10,cantidad:7}
    ]
  }
];

const $ = sel => document.querySelector(sel);

document.addEventListener('DOMContentLoaded',()=>{
  setupTabs();
  populateGuiaSelect();
  renderSteps();
  renderAggregates();
  initCharts();
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

// Populate select
function populateGuiaSelect(){
  const select = $('#select-guia');
  if(!select) return;
  sampleData.forEach((g,idx)=>{
    const opt = document.createElement('option');
    opt.value=idx;
    opt.textContent=g.guia;
    select.appendChild(opt);
  });
  select.addEventListener('change',()=>{
    renderGuiaDetails(select.value);
  });
  renderGuiaDetails(0);
}

// Render detalles de guía
function renderGuiaDetails(idx){
  const g = sampleData[idx];
  if(!g) return;
  $('#detalle-fecha').textContent=g.fecha;
  $('#detalle-proveedor').textContent=g.proveedor;
  $('#detalle-peso').textContent=g.peso + ' lb';
  $('#detalle-lote').textContent=g.lote;

  // Kavetas
  const container = $('#kaveta-list');
  container.innerHTML='';
  g.kavetas.forEach(k=>{
    const div = document.createElement('div');
    div.className='kaveta-item';
    div.textContent=`#${k.num} (${k.cantidad} lb)`;
    container.appendChild(div);
  });
}

// Steps
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

// Aggregates
function renderAggregates(){
  const totalPeso = sampleData.reduce((a,b)=>a+b.peso,0);
  const avgWeight = (totalPeso / sampleData.length).toFixed(2);
  const avgEl = $('#avgWeight'); if(avgEl) avgEl.textContent=avgWeight;

  const totalProcesado = totalPeso * 0.95; // ejemplo
  const mermaPct = (((totalPeso - totalProcesado)/totalPeso)*100).toFixed(1);
  const mermaEl = $('#mermaPct'); if(mermaEl) mermaEl.textContent=mermaPct;

  const rendimiento = 33; // ejemplo
  const rendEl = $('#rendimiento'); if(rendEl) rendEl.textContent=rendimiento;
}

// Charts placeholder
function initCharts(){
  const classCanvas = document.getElementById('classChart');
  const statusCanvas = document.getElementById('statusChart');

  if(classCanvas){
    const ctx = classCanvas.getContext('2d');
    new Chart(ctx,{
      type:'bar',
      data:{
        labels:['A','B','C'],
        datasets:[{
          label:'Cantidad por Clase',
          data:[3,2,1],
          backgroundColor:['#2563eb','#10b981','#f59e0b']
        }]
      },
      options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,stepSize:1}}}
    });
  }

  if(statusCanvas){
    const ctx2 = statusCanvas.getContext('2d');
    new Chart(ctx2,{
      type:'doughnut',
      data:{
        labels:['Descabezado','Máquina'],
        datasets:[{
          data:[4,6],
          backgroundColor:['#2563eb','#10b981']
        }]
      },
      options:{responsive:true,plugins:{legend:{position:'bottom'}}}
    });
  }
}
