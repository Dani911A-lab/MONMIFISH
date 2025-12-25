// ================= TABS VENTAS =================
const tabsVentas = document.querySelectorAll(".ventas-tab");
const vistasVentas = document.querySelectorAll(".ventas-vista");

tabsVentas.forEach(tab => {
  tab.addEventListener("click", () => {
    tabsVentas.forEach(t => t.classList.remove("active"));
    vistasVentas.forEach(v => v.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// ================= DIRECTORIO =================
const clientes = [];
let editIndex = null;
const tablaClientes = document.getElementById("tablaClientes");
const guardarClienteBtn = document.getElementById("guardarCliente");

function renderClientes() {
  tablaClientes.innerHTML = "";
  clientes.forEach((c, i) => {
    tablaClientes.innerHTML += `
      <tr>
        <td>${c.razon}</td>
        <td>${c.ruc}</td>
        <td>${c.personal}</td>
        <td>${c.cargo}</td>
        <td>${c.telefono}</td>
        <td>${c.email}</td>
        <td>
          <button class="btn-editar" onclick="editarCliente(${i})">Editar</button>
          <button class="btn-eliminar" onclick="eliminarCliente(${i})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

function renderClientes() {
  tablaClientes.innerHTML = "";
  clientes.forEach((c, i) => {
    tablaClientes.innerHTML += `
      <tr>
        <td>${c.razon}</td>
        <td>${c.ruc}</td>
        <td>${c.personal}</td>
        <td>${c.cargo}</td>
        <td>${c.telefono}</td>
        <td>${c.email}</td>
        <td>
          <button class="btn-editar" onclick="editarCliente(${i})">Editar</button>
          <button class="btn-eliminar" onclick="eliminarCliente(${i})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

/* ================= SELECT RAZON SOCIAL ================= */
function actualizarSelectRazon() {
  document.querySelectorAll(".aut-razon").forEach(select => {
    const selected = select.value;
    select.innerHTML = `<option value="">Seleccione</option>`;
    clientes.forEach(c => {
      select.innerHTML += `<option value="${c.razon}">${c.razon}</option>`;
    });
    select.value = selected;
  });
}

/* ================= SELECT ORIGEN ================= */
function actualizarSelectOrigen() {
  const origenes = ["MIRELYA", "ONAHOUSE"];

  document.querySelectorAll(".aut-origen").forEach(select => {
    const selected = select.value;
    select.innerHTML = `<option value="">Seleccione</option>`;
    origenes.forEach(o => {
      select.innerHTML += `<option value="${o}">${o}</option>`;
    });
    select.value = selected;
  });
}

/* ================= SELECT UNIDAD ================= */
function actualizarSelectUnidad() {
  document.querySelectorAll(".aut-unidad").forEach(select => {
    const selected = select.value;
    select.innerHTML = `
      <option value="QUINTAL">QUINTAL</option>
      <option value="KILO">KILO</option>
    `;
    select.value = selected || "QUINTAL";
  });
}

guardarClienteBtn.addEventListener("click", () => {
  const cliente = {
    razon: document.getElementById("razonSocial").value,
    ruc: document.getElementById("ruc").value,
    personal: document.getElementById("personal").value,
    cargo: document.getElementById("cargo").value,
    telefono: document.getElementById("telefono").value,
    email: document.getElementById("email").value
  };

  if (editIndex !== null) {
    clientes[editIndex] = cliente;
    editIndex = null;
  } else {
    clientes.push(cliente);
  }

  renderClientes();
  actualizarSelectRazon();
  actualizarSelectOrigen();
  actualizarSelectUnidad();
  guardarDirectorio();

  document.getElementById("razonSocial").value = "";
  document.getElementById("ruc").value = "";
  document.getElementById("personal").value = "";
  document.getElementById("cargo").value = "";
  document.getElementById("telefono").value = "";
  document.getElementById("email").value = "";
});

function editarCliente(i) {
  const c = clientes[i];
  document.getElementById("razonSocial").value = c.razon;
  document.getElementById("ruc").value = c.ruc;
  document.getElementById("personal").value = c.personal;
  document.getElementById("cargo").value = c.cargo;
  document.getElementById("telefono").value = c.telefono;
  document.getElementById("email").value = c.email;
  editIndex = i;
}

function eliminarCliente(i) {
  if (editIndex === i) editIndex = null;
  clientes.splice(i, 1);
  renderClientes();
  actualizarSelectRazon();
  actualizarSelectOrigen();
  actualizarSelectUnidad();
  guardarDirectorio();
}

function guardarDirectorio() {
  localStorage.setItem("directorio", JSON.stringify(clientes));
}

function cargarDirectorio() {
  const data = JSON.parse(localStorage.getItem("directorio") || "[]");
  clientes.length = 0;
  data.forEach(c => clientes.push(c));
  renderClientes();
  actualizarSelectRazon();
  actualizarSelectOrigen();
  actualizarSelectUnidad();
}

document.querySelectorAll("#directorio .directorio-form input").forEach(input => {
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      guardarClienteBtn.click();
    }
  });
});

/* === inicialización segura === */
cargarDirectorio();
actualizarSelectOrigen();
actualizarSelectUnidad();




// ================= AUTORIZACION =================
const btnNuevoRegistro = document.getElementById("nuevoRegistro");
const btnGenerarOrden = document.getElementById("generarOrden");

// Función para agregar una nueva fila de autorización
function agregarFilaAutorizacion(inicial = false) {
  const fila = document.createElement("div");
  fila.className = "autorizacion-inputs";

  fila.innerHTML = `
    <select class="aut-razon"></select>
    <select class="aut-origen"></select>
    <input type="number" class="aut-cant">
    <select class="aut-unidad">
      <option>KILO</option>
      <option>QUINTAL</option>
      <option>LIBRA</option>
    </select>
    <input class="aut-precio">
    <input class="aut-subtotal" readonly>
    <input class="aut-retencion" readonly>
    <input class="aut-pago" readonly>
    <input class="aut-sem" readonly>
    <input class="aut-fecha" readonly>
    <button class="btn-eliminar-fila">X</button>
  `;

  const selectOrigen = fila.querySelector(".aut-origen");
  selectOrigen.innerHTML = `
    <option value="">Seleccione</option>
    <option value="MIRELYA">MIRELYA</option>
    <option value="ONAHOUSE">ONAHOUSE</option>
  `;

  const contenedor = document.querySelector(".autorizacion-registro");
  const filaTotal = contenedor.querySelector(".autorizacion-totales");
  if (filaTotal) contenedor.insertBefore(fila, filaTotal);
  else contenedor.appendChild(fila);

  actualizarSelectRazon(); 

  const cant = fila.querySelector(".aut-cant");
  const precio = fila.querySelector(".aut-precio");
  const subtotal = fila.querySelector(".aut-subtotal");
  const retencion = fila.querySelector(".aut-retencion");
  const pago = fila.querySelector(".aut-pago");
  const sem = fila.querySelector(".aut-sem");
  const fecha = fila.querySelector(".aut-fecha");
  const btnEliminar = fila.querySelector(".btn-eliminar-fila");

  function calcular() {
    const c = parseFloat(cant.value) || 0;
    const p = parseFloat(precio.value) || 0;
    const s = c * p;
    subtotal.value = s.toFixed(2);
    retencion.value = (s * 0.01).toFixed(2);
    pago.value = (s - s * 0.01).toFixed(2);

    const hoy = new Date();
    const start = new Date(hoy.getFullYear(), 0, 1);
    const diff = hoy - start + (start.getDay() + 1) * 86400000;
    const week = Math.ceil(diff / (7 * 86400000));
    sem.value = week;
    fecha.value = hoy.toISOString().split("T")[0];

    actualizarTotales();
  }

  cant.addEventListener("input", calcular);
  precio.addEventListener("input", calcular);
  fila.querySelector(".aut-razon").addEventListener("input", actualizarTotales);
  selectOrigen.addEventListener("input", actualizarTotales);

  // Eliminar fila del contenedor de Autorización
  btnEliminar.onclick = () => {
    fila.remove();
    actualizarTotales();
  };

  if (inicial) calcular();
}

// Función para actualizar la fila de totales
function actualizarTotales() {
  const filas = document.querySelectorAll(".autorizacion-inputs");
  let totalCant = 0, totalPrecio = 0, totalSubtotal = 0, totalRetencion = 0, totalPago = 0;

  filas.forEach(fila => {
    const cant = parseFloat(fila.querySelector(".aut-cant").value) || 0;
    const precio = parseFloat(fila.querySelector(".aut-precio").value) || 0;
    const subtotal = parseFloat(fila.querySelector(".aut-subtotal").value) || 0;
    const retencion = parseFloat(fila.querySelector(".aut-retencion").value) || 0;
    const pago = parseFloat(fila.querySelector(".aut-pago").value) || 0;

    totalCant += cant;
    totalPrecio += precio;
    totalSubtotal += subtotal;
    totalRetencion += retencion;
    totalPago += pago;
  });

  const filaTotal = document.querySelector(".autorizacion-totales");
  if (!filaTotal) return;

  filaTotal.querySelector(".total-cant").textContent = totalCant;
  filaTotal.querySelector(".total-precio").textContent = totalPrecio.toFixed(2);
  filaTotal.querySelector(".total-subtotal").textContent = totalSubtotal.toFixed(2);
  filaTotal.querySelector(".total-retencion").textContent = totalRetencion.toFixed(2);
  filaTotal.querySelector(".total-pago").textContent = totalPago.toFixed(2);

  const totalEliminar = filaTotal.querySelector(".total-eliminar");
  if (totalEliminar) totalEliminar.textContent = "-";
}

// Botón “Nuevo Registro”
btnNuevoRegistro.addEventListener("click", () => agregarFilaAutorizacion());

// Crear fila inicial al cargar la pestaña
agregarFilaAutorizacion(true);

// ================= BOTÓN GENERAR ORDEN =================
btnGenerarOrden.addEventListener("click", () => {
  const filasAut = document.querySelectorAll(".autorizacion-inputs");
  if (!filasAut.length) return;

  let ultimaFila = null;

  filasAut.forEach(fila => {
    const razon = fila.querySelector(".aut-razon").value;
    const origen = fila.querySelector(".aut-origen").value;
    const cant = fila.querySelector(".aut-cant").value;
    const unidad = fila.querySelector(".aut-unidad").value;
    const precio = fila.querySelector(".aut-precio").value;
    const subtotal = fila.querySelector(".aut-subtotal").value;
    const retencion = fila.querySelector(".aut-retencion").value;
    const pago = fila.querySelector(".aut-pago").value;

    const row = document.createElement("div");
    row.className = "fact-hist-row";
    row.dataset.archivos = "[]";
    row.innerHTML = `
      <div><input type="checkbox" class="fact-check"></div>
      <div class="fact-cell">${razon}</div>
      <div class="fact-cell">${origen}</div>
      <div class="fact-cell">${cant}</div>
      <div class="fact-cell">${unidad}</div>
      <div class="fact-cell">${precio}</div>
      <div class="fact-cell">${subtotal}</div>
      <div class="fact-cell">${retencion}</div>
      <div class="fact-cell">${pago}</div>
      <div class="fact-acciones">
        <button class="btn-editar" title="Editar">✏️</button>
        <button class="btn-eliminar" title="Eliminar">🗑️</button>
      </div>
    `;
    factHistBody.appendChild(row);
    agregarEventosFila(row);
    ultimaFila = row;
  });

  guardarFacturacion();

  // LIMPIAR AUTORIZACION
  const contenedor = document.querySelector(".autorizacion-registro");
  contenedor.querySelectorAll(".autorizacion-inputs").forEach(fila => fila.remove());
  actualizarTotales();

  // CAMBIAR A PESTAÑA FACTURACION
  const tabVentas = document.querySelector(".ventas-tab[data-tab='facturacion']");
  if (tabVentas) tabVentas.click();

  // PARPADEO SUAVE DE LA NUEVA FILA
  if (ultimaFila) {
    ultimaFila.style.transition = "background 0.6s ease";
    let parpadeos = 0;
    const maxParpadeos = 3;

    const interval = setInterval(() => {
      if (parpadeos >= maxParpadeos) {
        ultimaFila.style.background = ""; // Restablece color original
        clearInterval(interval);
        return;
      }
      ultimaFila.style.background = ultimaFila.style.background === "rgba(255, 249, 157, 0.6)" ? "" : "rgba(255, 249, 157, 0.6)";
      parpadeos += 0.5; // cada cambio cuenta como medio parpadeo
    }, 400);
  }
});











// ================= FACTURACION =================
const factHistBody = document.getElementById("fact-historial-body");
const factAprobadasBody = document.getElementById("fact-aprobadas-body");
const btnAprobar = document.getElementById("aprobarFacturacion");

// Crear contenedor para botones en cabecera
const headerBotonesContainer = document.createElement("div");
headerBotonesContainer.style.display = "flex";
headerBotonesContainer.style.gap = "10px";
headerBotonesContainer.style.marginBottom = "10px";
btnAprobar.parentNode.insertBefore(headerBotonesContainer, btnAprobar);
headerBotonesContainer.appendChild(btnAprobar);

// ================= BOTÓN APROBAR =================
btnAprobar.textContent = "Aprobar facturación";
btnAprobar.style.background = "#4caf50";
btnAprobar.style.color = "#fff";
btnAprobar.style.border = "none";
btnAprobar.style.borderRadius = "6px";
btnAprobar.style.padding = "6px 14px";
btnAprobar.style.cursor = "pointer";
btnAprobar.style.fontWeight = "600";
btnAprobar.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
btnAprobar.onmouseover = () => btnAprobar.style.background = "#45a049";
btnAprobar.onmouseout  = () => btnAprobar.style.background = "#4caf50";

// ================= BOTÓN IMPRIMIR =================
const btnImprimirGlobal = document.createElement("button");
btnImprimirGlobal.textContent = "Imprimir seleccionadas";
btnImprimirGlobal.title = "Imprimir órdenes seleccionadas";
btnImprimirGlobal.style.background = "#1e88e5";
btnImprimirGlobal.style.color = "#fff";
btnImprimirGlobal.style.border = "none";
btnImprimirGlobal.style.borderRadius = "6px";
btnImprimirGlobal.style.padding = "6px 14px";
btnImprimirGlobal.style.cursor = "pointer";
btnImprimirGlobal.style.fontWeight = "600";
btnImprimirGlobal.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
btnImprimirGlobal.onmouseover = () => btnImprimirGlobal.style.background = "#1976d2";
btnImprimirGlobal.onmouseout  = () => btnImprimirGlobal.style.background = "#1e88e5";

headerBotonesContainer.appendChild(btnImprimirGlobal);

// 👉 evento de impresión (restaurado)
btnImprimirGlobal.onclick = imprimirOrdenesSeleccionadas;


// ================= IMPRESION =================
function imprimirOrdenesSeleccionadas() {
  const filas = factHistBody.querySelectorAll(".fact-hist-row");

  let contenido = "";
  let totalCant = 0;
  let totalSubtotal = 0;
  let totalRetencion = 0;
  let totalPago = 0;

  filas.forEach(row => {
    const check = row.querySelector(".fact-check");
    if (check && check.checked) {
      const c = row.querySelectorAll(".fact-cell");

      const cant = parseFloat(c[2].textContent) || 0;
      const subtotal = parseFloat(c[5].textContent) || 0;
      const retencion = parseFloat(c[6].textContent) || 0;
      const pago = parseFloat(c[7].textContent) || 0;

      totalCant += cant;
      totalSubtotal += subtotal;
      totalRetencion += retencion;
      totalPago += pago;

      contenido += `
        <tr>
          <td>${c[0].textContent}</td>
          <td>${c[1].textContent}</td>
          <td>${c[2].textContent}</td>
          <td>${c[3].textContent}</td>
          <td>${c[4].textContent}</td>
          <td>${c[5].textContent}</td>
          <td>${c[6].textContent}</td>
          <td>${c[7].textContent}</td>
        </tr>
      `;
    }
  });

  if (!contenido) {
    alert("Seleccione al menos una orden para imprimir.");
    return;
  }

const ventana = window.open("", "_blank");

ventana.document.write(`
  <html>
  <head>
    <title>Reporte de Órdenes</title>
    <style>
      body { font-family: Arial; padding: 20px; color: #333; }
      h2 { text-align: center; color: #1e88e5; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #ccc; padding: 6px; text-align: center; }
      th { background: #f3f4f6; }
      tfoot td { font-weight: bold; background: #f3f4f6; }
      .firmas { margin-top: 60px; display: flex; justify-content: space-between; }
      .firma { text-align: center; width: 45%; }
      .cargo { color: #777; font-size: 12px; margin-top: 4px; }
    </style>
  </head>
  <body>
    <h2>Órdenes de Venta</h2>

    <table>
      <thead>
        <tr>
          <th>Razón Social</th>
          <th>Origen</th>
          <th>Cantidad</th>
          <th>Unidad</th>
          <th>Precio</th>
          <th>Subtotal</th>
          <th>Retención</th>
          <th>Pago</th>
        </tr>
      </thead>

      <tbody>
        ${contenido}
      </tbody>

      <tfoot>
        <tr>
          <td colspan="2">TOTALES</td>
          <td>${totalCant}</td>
          <td></td>
          <td></td>
          <td>${totalSubtotal.toFixed(2)}</td>
          <td>${totalRetencion.toFixed(2)}</td>
          <td>${totalPago.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>

    <div class="firmas">
      <div class="firma">
        ELABORADO POR<br>
        <strong>ING. CLAUDIA LEÓN</strong><br>
        <span class="cargo">Responsable de Venta</span>
      </div>
      <div class="firma">
        AUTORIZACIÓN<br>
        <strong>ING. MANUEL BLACIO</strong><br>
        <span class="cargo">Director General</span>
      </div>
    </div>

    <script>
      window.onload = () => {
        window.print();
      };

      window.onafterprint = () => {
        window.close();
      };
    </script>

  </body>
  </html>
`);

ventana.document.close();

  ventana.print();
}



// ================= MODAL ARCHIVOS =================
const modal = document.createElement("div");
modal.id = "modalArchivos";
modal.style.display = "none";
modal.style.position = "fixed";
modal.style.top = "0";
modal.style.left = "0";
modal.style.width = "100%";
modal.style.height = "100%";
modal.style.background = "rgba(0,0,0,0.5)";
modal.style.justifyContent = "center";
modal.style.alignItems = "center";
modal.style.zIndex = "1000";

const modalContent = document.createElement("div");
modalContent.style.background = "#fff";
modalContent.style.width = "60%";
modalContent.style.height = "60%";
modalContent.style.display = "flex";
modalContent.style.flexDirection = "row";
modalContent.style.borderRadius = "8px";
modalContent.style.padding = "10px";
modalContent.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
modalContent.style.position = "relative";

// Botón cerrar
const closeModal = document.createElement("span");
closeModal.textContent = "✖";
closeModal.style.position = "absolute";
closeModal.style.top = "10px";
closeModal.style.right = "15px";
closeModal.style.cursor = "pointer";
closeModal.style.fontSize = "18px";
closeModal.onclick = () => { modal.style.display = "none"; };
modalContent.appendChild(closeModal);

// Sección lista de archivos
const leftSection = document.createElement("div");
leftSection.style.flex = "1";
leftSection.style.marginRight = "5px";
leftSection.style.display = "flex";
leftSection.style.flexDirection = "column";

const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.multiple = true;
fileInput.style.marginBottom = "10px";
leftSection.appendChild(fileInput);

const archivosContainer = document.createElement("div");
archivosContainer.style.flex = "1";
archivosContainer.style.overflowY = "auto";
leftSection.appendChild(archivosContainer);

// Sección preview
const previewContainer = document.createElement("div");
previewContainer.style.flex = "1";
previewContainer.style.marginLeft = "5px";
previewContainer.style.background = "#f9f9f9";
previewContainer.style.border = "1px solid #ddd";
previewContainer.style.borderRadius = "4px";
previewContainer.style.display = "flex";
previewContainer.style.justifyContent = "center";
previewContainer.style.alignItems = "center";
previewContainer.style.overflow = "auto";

modalContent.appendChild(leftSection);
modalContent.appendChild(previewContainer);
modal.appendChild(modalContent);
document.body.appendChild(modal);

// ================= FUNCIONES MODAL ARCHIVOS =================
let filaActual = null;

function abrirModal(fila) {
  filaActual = fila;
  modal.style.display = "flex";
  archivosContainer.innerHTML = "";
  previewContainer.innerHTML = "";

  // 👉 CONTENEDOR IZQUIERDO CON BORDE GRIS
  archivosContainer.style.border = "1px solid #d1d5db";
  archivosContainer.style.borderRadius = "6px";
  archivosContainer.style.padding = "8px";
  archivosContainer.style.background = "#fafafa";
  archivosContainer.style.maxHeight = "100%";
  archivosContainer.style.overflowY = "auto";

  // Recuperar archivos guardados
  let archivosGuardados = JSON.parse(fila.dataset.archivos || "[]");

  if (!fila.archivosObj) fila.archivosObj = [];

  archivosGuardados.forEach(nombre => {
    if (!fila.archivosObj.some(a => a.name === nombre)) {
      fila.archivosObj.push({ name: nombre, file: null });
    }
  });

  filaActual.archivosObj.forEach(a => agregarArchivoLista(a));

  fileInput.onchange = () => {
    const nuevosArchivos = Array.from(fileInput.files);
    nuevosArchivos.forEach(f => {
      filaActual.archivosObj.push({ name: f.name, file: f });
    });

    filaActual.dataset.archivos = JSON.stringify(
      filaActual.archivosObj.map(a => a.name)
    );

    archivosContainer.innerHTML = "";
    filaActual.archivosObj.forEach(a => agregarArchivoLista(a));

    fileInput.value = "";
    guardarFacturacion();
  };
}

function obtenerIconoArchivo(nombre) {
  const ext = nombre.split(".").pop().toLowerCase();

  if (ext === "pdf") return "📄";
  if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "🖼️";
  if (["doc", "docx"].includes(ext)) return "📝";
  if (["xls", "xlsx"].includes(ext)) return "📊";

  return "📁";
}

function agregarArchivoLista(archivoObj) {
  const fila = document.createElement("div");
  fila.style.display = "flex";
  fila.style.alignItems = "center";
  fila.style.justifyContent = "space-between";
  fila.style.padding = "6px 8px";
  fila.style.border = "1px solid #e5e7eb";
  fila.style.borderRadius = "4px";
  fila.style.marginBottom = "6px";
  fila.style.background = "#fff";

  // Icono + nombre
  const info = document.createElement("div");
  info.style.display = "flex";
  info.style.alignItems = "center";
  info.style.gap = "6px";
  info.style.cursor = "pointer";
  info.style.flex = "1";

  const icono = document.createElement("span");
  icono.textContent = obtenerIconoArchivo(archivoObj.name);

  const nombre = document.createElement("span");
  nombre.textContent = archivoObj.name;
  nombre.style.fontSize = "13px";

  info.onclick = () => mostrarPreview(archivoObj);

  info.appendChild(icono);
  info.appendChild(nombre);

  // Botón eliminar
  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "✕";
  btnEliminar.style.border = "none";
  btnEliminar.style.background = "transparent";
  btnEliminar.style.cursor = "pointer";
  btnEliminar.style.fontSize = "14px";
  btnEliminar.style.color = "#6b7280";

  btnEliminar.onclick = () => {
    filaActual.archivosObj = filaActual.archivosObj.filter(
      a => a.name !== archivoObj.name
    );
    filaActual.dataset.archivos = JSON.stringify(
      filaActual.archivosObj.map(a => a.name)
    );

    archivosContainer.innerHTML = "";
    filaActual.archivosObj.forEach(a => agregarArchivoLista(a));
    previewContainer.innerHTML = "";

    guardarFacturacion();
  };

  fila.appendChild(info);
  fila.appendChild(btnEliminar);
  archivosContainer.appendChild(fila);
}

// ================= PREVIEW =================
function mostrarPreview(archivoObj) {
  previewContainer.innerHTML = "";

  if (!archivoObj.file) {
    previewContainer.textContent =
      "No se puede previsualizar este archivo (guardado previamente).";
    return;
  }

  const file = archivoObj.file;
  const url = URL.createObjectURL(file);

  if (file.type === "application/pdf") {
    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    previewContainer.appendChild(iframe);
  } else if (file.type.startsWith("image/")) {
    const img = document.createElement("img");
    img.src = url;
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    img.style.objectFit = "contain";
    previewContainer.appendChild(img);
  } else {
    previewContainer.textContent =
      "Vista previa no disponible para este tipo de archivo.";
  }
}


// ================= FUNCIONES FILA =================
function agregarEventosFila(row) {
  const btnEditar = row.querySelector(".btn-editar");
  const btnEliminar = row.querySelector(".btn-eliminar");

  // === ESTILO MINIMALISTA BASE ===
  const estiloAccion = btn => {
    btn.style.background = "#fff";
    btn.style.border = "1px solid #ccc";
    btn.style.borderRadius = "4px";
    btn.style.width = "28px";
    btn.style.height = "28px";
    btn.style.cursor = "pointer";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.padding = "0";
  };

  estiloAccion(btnEditar);
  estiloAccion(btnEliminar);

  // Inicializar iconos SVG (adaptables al tamaño del botón)
  btnEditar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:1em;height:1em;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5h6m2 2v6m0 4H5a2 2 0 01-2-2V5a2 2 0 012-2h6"/></svg>`;
  btnEditar.title = "Editar";

  btnEliminar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:1em;height:1em;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"/></svg>`;
  btnEliminar.title = "Eliminar";

  // Editar
  btnEditar.addEventListener("click", () => {
    const celdas = row.querySelectorAll(".fact-cell");
    const editable = celdas[0].isContentEditable;

    if (!editable) {
      celdas.forEach(c => {
        c.contentEditable = true;
        c.style.background = "#fff";
        c.style.border = "1px solid #d1d5db";
        c.style.borderRadius = "4px";
        c.style.padding = "2px 4px";
      });
      btnEditar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:1em;height:1em;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`; // check guardar
      btnEditar.title = "Guardar";
    } else {
      celdas.forEach(c => {
        c.contentEditable = false;
        c.style.background = "#f9fafb";
        c.style.border = "none";
        c.style.padding = "0";
      });
      btnEditar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:1em;height:1em;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5h6m2 2v6m0 4H5a2 2 0 01-2-2V5a2 2 0 012-2h6"/></svg>`; // lápiz editar
      btnEditar.title = "Editar";
      guardarFacturacion();
    }
  });

  // Eliminar / Restaurar
  btnEliminar.addEventListener("click", () => {
    if (btnEliminar.title === "Eliminar") {
      row.remove();
    } else if (btnEliminar.title === "Restaurar") {
      factHistBody.appendChild(row);
      btnEliminar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:1em;height:1em;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"/></svg>`; // papelera
      btnEliminar.title = "Eliminar";
    }
    guardarFacturacion();
  });

  // Botón cargar documentos (minimalista)
  let btnCargar = row.querySelector(".btn-cargar-doc");
  if (!btnCargar) {
    btnCargar = document.createElement("button");
    btnCargar.className = "btn-cargar-doc";
    btnCargar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:1em;height:1em;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>`; // icono adjuntar
    estiloAccion(btnCargar);
    btnCargar.title = "Adjuntar documentos";
    btnCargar.onclick = () => abrirModal(row);
    row.querySelector(".fact-acciones").appendChild(btnCargar);
  }
}






// ================= APROBAR =================
btnAprobar.addEventListener("click", () => {
  const filas = factHistBody.querySelectorAll(".fact-hist-row");
  filas.forEach(fila => {
    const check = fila.querySelector(".fact-check");
    if (check && check.checked) {
      check.checked = false;
      factAprobadasBody.appendChild(fila);
      const btnEliminar = fila.querySelector(".btn-eliminar");
      btnEliminar.textContent = "↩️";
      btnEliminar.title = "Restaurar";
      btnEliminar.onclick = () => {
        factHistBody.appendChild(fila);
        btnEliminar.textContent = "🗑️";
        btnEliminar.title = "Eliminar";
        guardarFacturacion();
      };
    }
  });
  guardarFacturacion();
});

// ================= GUARDAR =================
function guardarFacturacion() {
  const historial = [];
  const aprobadas = [];

  function guardarFilas(filas, arr) {
    filas.forEach(row => {
      const c = row.querySelectorAll(".fact-cell");
      arr.push({
        razon: c[0]?.textContent || "",
        origen: c[1]?.textContent || "",
        cant: c[2]?.textContent || "",
        unidad: c[3]?.textContent || "",
        precio: c[4]?.textContent || "",
        subtotal: c[5]?.textContent || "",
        retencion: c[6]?.textContent || "",
        pago: c[7]?.textContent || "",
        archivos: row.dataset.archivos || "[]"
      });
    });
  }

  guardarFilas(factHistBody.querySelectorAll(".fact-hist-row"), historial);
  guardarFilas(factAprobadasBody.querySelectorAll(".fact-hist-row"), aprobadas);

  localStorage.setItem("factHistorial", JSON.stringify(historial));
  localStorage.setItem("factAprobadas", JSON.stringify(aprobadas));
}

// ================= CARGAR =================
function cargarFacturacion() {
  const historial = JSON.parse(localStorage.getItem("factHistorial") || "[]");
  const aprobadas = JSON.parse(localStorage.getItem("factAprobadas") || "[]");

  function crearFila(d, contenedor) {
    const row = document.createElement("div");
    row.className = "fact-hist-row";
    row.dataset.archivos = d.archivos || "[]";
    row.innerHTML = `
      <div><input type="checkbox" class="fact-check"></div>
      <div class="fact-cell">${d.razon}</div>
      <div class="fact-cell">${d.origen}</div>
      <div class="fact-cell">${d.cant}</div>
      <div class="fact-cell">${d.unidad}</div>
      <div class="fact-cell">${d.precio}</div>
      <div class="fact-cell">${d.subtotal}</div>
      <div class="fact-cell">${d.retencion}</div>
      <div class="fact-cell">${d.pago}</div>
      <div class="fact-acciones">
        <button class="btn-editar" title="Editar">✏️</button>
        <button class="btn-eliminar" title="Eliminar">🗑️</button>
      </div>
    `;
    contenedor.appendChild(row);
    agregarEventosFila(row);
  }

  historial.forEach(d => crearFila(d, factHistBody));
  aprobadas.forEach(d => crearFila(d, factAprobadasBody));
}

// ================= INICIALIZACION =================
document.addEventListener("DOMContentLoaded", () => {
  cargarDirectorio();
  cargarFacturacion();
});





