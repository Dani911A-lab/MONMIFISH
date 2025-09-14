// Datos de ejemplo
const sampleData = [
  {guia: 'G-001', vin: 'VIN1001', lote: 'L-01', peso: 2.8, has_head:true, processed_weight:1.9, machine_class: 'A', status:'descabezado'},
  {guia: 'G-001', vin: 'VIN1002', lote: 'L-01', peso: 2.5, has_head:false, processed_weight:2.4, machine_class: 'A', status:'maquina'},
  {guia: 'G-002', vin: 'VIN2001', lote: 'L-02', peso: 3.1, has_head:true, processed_weight:2.0, machine_class: 'B', status:'descabezado'},
  {guia: 'G-002', vin: 'VIN2002', lote: 'L-02', peso: 2.9, has_head:true, processed_weight:2.1, machine_class: 'A', status:'descabezado'},
  {guia: 'G-003', vin: 'VIN3001', lote: 'L-03', peso: 3.0, has_head:true, processed_weight:2.0, machine_class: 'A', status:'descabezado'},
  {guia: 'G-003', vin: 'VIN3002', lote: 'L-03', peso: 2.7, has_head:false, processed_weight:2.6, machine_class: 'B', status:'maquina'},
  {guia: 'G-004', vin: 'VIN4001', lote: 'L-04', peso: 3.5, has_head:true, processed_weight:2.4, machine_class: 'B', status:'descabezado'},
  {guia: 'G-004', vin: 'VIN4002', lote: 'L-04', peso: 2.9, has_head:true, processed_weight:1.9, machine_class: 'C', status:'descabezado'}
];

const $ = sel => document.querySelector(sel);

// Inicialización
document.addEventListener('DOMContentLoaded', ()=>{
  window.data = sampleData;
  renderMeta();
  renderSteps();
  renderAggregates();
  initCharts();
  setupTabs();
});

// Tabs
function setupTabs(){
  const buttons = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  buttons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      buttons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.target;
      contents.forEach(c=>c.classList.remove('active'));
      document.getElementById(target).classList.add('active');
    });
  });

  // Activar la primera
  document.querySelector('.tab-btn.active').click();
}

// Filtrado de datos
function getFilteredData(){
  return window.data; // solo lectura, no filtros implementados todavía
}

// Meta
function renderMeta(){
  $('#totalGuides').textContent = [...new Set(window.data.map(d=>d.guia))].length;
  $('#totalItems').textContent = window.data.length;
}

// Steps
function renderSteps(){
  const container = document.querySelector('.steps');
  container.innerHTML = '';
  const fd = getFilteredData();
  const order = [
    {key:'ingreso', title:'Ingreso', desc:'Camaron recibido con guía'},
    {key:'control', title:'Control Calidad', desc:'Inspección por VIN/lote'},
    {key:'recepcion', title:'Recepción Peso', desc:'Pesaje promedio'},
    {key:'merma', title:'Verificación Merma', desc:'Cantidad real para proceso'},
    {key:'descabezado', title:'Descabezado', desc:'Solo los que tienen cabeza'},
    {key:'maquina', title:'Clasificación Máquina', desc:'Clase A/B/C'},
    {key:'empaque', title:'Empaque', desc:'Cada clase a su empaque'},
  ];

  const counts = {
    ingreso: fd.length,
    control: fd.length,
    recepcion: fd.length,
    merma: Math.round(fd.length*0.95),
    descabezado: fd.filter(d=>d.has_head).length,
    maquina: fd.filter(d=>d.status==='maquina'||d.status==='descabezado').length,
    empaque: fd.filter(d=>!!d.machine_class).length,
  };

  order.forEach((s,i)=>{
    const el = document.createElement('div'); 
    el.className='step';
    el.innerHTML=`
      <div class="step-info">
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </div>
      <div class="badge">${counts[s.key] ?? '-'}</div>
    `;
    container.appendChild(el);
  });
}

// Aggregates
function renderAggregates(){
  const fd = getFilteredData();
  const avgWeight = fd.length ? (fd.reduce((a,b)=>a+b.peso,0)/fd.length).toFixed(2) : '-';
  $('#avgWeight').textContent = avgWeight;
  const totalEntrada = fd.reduce((a,b)=>a+b.peso,0);
  const totalProcesado = fd.reduce((a,b)=>a+b.processed_weight,0);
  const mermaPct = totalEntrada ? (((totalEntrada-totalProcesado)/totalEntrada)*100).toFixed(1) : '-';
  $('#mermaPct').textContent = mermaPct;
  const withHead = fd.filter(d=>d.has_head);
  const rendimiento = withHead.length ? ((withHead.reduce((a,b)=>a+b.processed_weight,0)/withHead.reduce((a,b)=>a+b.peso,0))*100).toFixed(1) : '-';
  $('#rendimiento').textContent = rendimiento;
}

// Charts
let classChart, statusChart;
function initCharts(){
  const ctx1 = document.getElementById('classChart').getContext('2d');
  classChart = new Chart(ctx1,{
    type:'bar',
    data:{
      labels:['A','B','C'],
      datasets:[{
        label:'Cantidad por Clase',
        data:[
          window.data.filter(d=>d.machine_class==='A').length,
          window.data.filter(d=>d.machine_class==='B').length,
          window.data.filter(d=>d.machine_class==='C').length
        ],
        backgroundColor:['#2563eb','#10b981','#f59e0b']
      }]
    },
    options:{
      responsive:true,
      plugins:{legend:{display:false}},
      scales:{y:{beginAtZero:true,stepSize:1}}
    }
  });

  const ctx2 = document.getElementById('statusChart').getContext('2d');
  statusChart = new Chart(ctx2,{
    type:'doughnut',
    data:{
      labels:['Descabezado','Maquina'],
      datasets:[{
        data:[
          window.data.filter(d=>d.status==='descabezado').length,
          window.data.filter(d=>d.status==='maquina').length
        ],
        backgroundColor:['#2563eb','#10b981']
      }]
    },
    options:{
      responsive:true,
      plugins:{legend:{position:'bottom'}}
    }
  });
}
