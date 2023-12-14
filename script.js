var stockData = [];
var currentUser;
var isAdmin = false;

function autenticarUsuario() {
  var firmaDigital = document.getElementById("firmaDigital").value;

  if (firmaDigital === "isAdmin") {
    isAdmin = true;
  }

  currentUser = firmaDigital;
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("planillaContainer").style.display = "block";

  actualizarTabla();
}

function salirUsuario() {
  isAdmin = false;
  currentUser = null;
  document.getElementById("loginContainer").style.display = "block";
  document.getElementById("planillaContainer").style.display = "none";
  document.getElementById("firmaDigital").value = "";
  stockData = [];
}

function agregarMovimiento() {
  var codigoProducto = prompt("Ingrese el código de producto");
  var producto = prompt("Ingrese el nombre del producto");
  var stockInicial = parseInt(prompt("Ingrese el stock inicial"));
  var recepcion = parseInt(prompt("Ingrese la cantidad recibida"));
  var despacho = parseInt(prompt("Ingrese la cantidad despachada"));

  // Buscar si ya existe un movimiento para el producto
  var movimientoExistente = stockData.find(function (movimiento) {
    return movimiento.codigoProducto === codigoProducto;
  });

  if (movimientoExistente) {
    // Si ya existe un movimiento para el producto, acumular recepción y despacho
    movimientoExistente.recepcion += recepcion;
    movimientoExistente.despacho += despacho;
  } else {
    // Si no existe un movimiento para el producto, agregar uno nuevo
    var stockFinal = calcularStockFinal(stockInicial, recepcion, despacho);
    var fecha = new Date().toLocaleDateString();

    var movimiento = {
      codigoProducto: codigoProducto,
      producto: producto,
      stockInicial: stockInicial,
      recepcion: recepcion,
      despacho: despacho,
      stockFinal: stockFinal,
      firmaDigital: currentUser,
      usuario: currentUser,
      fecha: fecha,
      adjunto: null // Nuevo campo para el adjunto
    };

    stockData.push(movimiento);
  }

  actualizarTabla();
}

function buscarProducto() {
  var searchTerm = document.getElementById("searchInput").value.toLowerCase();
  var filteredData = stockData.filter(function (movimiento) {
    return movimiento.producto.toLowerCase().includes(searchTerm);
  });
  actualizarTabla(filteredData);
}

function modificarMovimiento(index) {
  var nuevoCodigoProducto = prompt("Ingrese el nuevo código de producto");
  var nuevoProducto = prompt("Ingrese el nuevo nombre del producto");

  stockData[index].codigoProducto = nuevoCodigoProducto;
  stockData[index].producto = nuevoProducto;
  stockData[index].stockFinal = calcularStockFinal(
    stockData[index].stockInicial,
    stockData[index].recepcion,
    stockData[index].despacho
  );

  actualizarTabla();
}

function modificarCantidad(index) {
  var nuevaRecepcion = parseInt(prompt("Ingrese la nueva cantidad recibida"));
  var nuevaDespacho = parseInt(prompt("Ingrese la nueva cantidad despachada"));

  // Modificar la recepción y el despacho existentes en el movimiento
  stockData[index].recepcion += nuevaRecepcion;
  stockData[index].despacho += nuevaDespacho;
  stockData[index].stockFinal = calcularStockFinal(
    stockData[index].stockInicial,
    stockData[index].recepcion,
    stockData[index].despacho
  );

  actualizarTabla();
}

function eliminarMovimiento(index) {
  var confirmacion = confirm("¿Está seguro de que desea eliminar este movimiento?");
  if (confirmacion) {
    stockData.splice(index, 1);
    actualizarTabla();
  }
}

function expandirAdjunto(index) {
  var adjunto = stockData[index].adjunto;

  if (adjunto) {
    // Si hay un adjunto, mostrarlo de alguna manera (puedes abrir una nueva ventana o ventana modal)
    alert(`Adjunto: ${adjunto}`);
  } else {
    // Si no hay adjunto, permitir al usuario cargar uno
    var archivo = prompt("Adjuntar archivo (imagen o PDF):");

    if (archivo && /\.(jpg|jpeg|png|pdf)$/i.test(archivo)) {
      stockData[index].adjunto = archivo;
      actualizarTabla();
    } else {
      alert("Formato de archivo no válido. Solo se permiten archivos jpg, jpeg, png o pdf.");
    }
  }
}

function calcularStockFinal(stockInicial, recepcion, despacho) {
  return stockInicial + recepcion - despacho;
}

function actualizarTabla(data) {
  var tbody = document.getElementById("stockTableBody");
  tbody.innerHTML = "";

  var dataSet = data || stockData;

  for (var i = 0; i < dataSet.length; i++) {
    var row = `<tr>
                  <td>${dataSet[i].codigoProducto}</td>
                  <td>${dataSet[i].producto}</td>
                  <td>${dataSet[i].stockInicial}</td>
                  <td>${dataSet[i].recepcion}</td>
                  <td>${dataSet[i].despacho}</td>
                  <td>${dataSet[i].stockFinal}</td>
                  <td>${dataSet[i].firmaDigital}</td>
                  <td>${dataSet[i].usuario}</td>
                  <td>${dataSet[i].fecha}</td>
                  <td>
                    <button onclick="modificarMovimiento(${i})"><i class="fas fa-edit"></i></button>
                    <button onclick="modificarCantidad(${i})"><i class="fas fa-edit"></i></button>
                    <button onclick="eliminarMovimiento(${i})"><i class="fas fa-trash-alt"></i></button>
                  </td>
                  <td>
                    <button class="btn-expandir" onclick="expandirAdjunto(${i})"><i class="fas fa-paperclip"></i> Adjuntar</button>
                  </td>
              </tr>`;
    tbody.innerHTML += row;
  }
}