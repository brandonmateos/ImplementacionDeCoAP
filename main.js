const coap = require('coap');
const url = require('url');

// Configuración de los nodos
const node1 = 'coap://localhost:5683/node1';
const node2 = 'coap://localhost:5683/node2';
const observer = 'coap://localhost:5683/observer';

// Función para generar datos aleatorios de temperatura y humedad
function generateData() {
  const temperature = Math.floor(Math.random() * 40);
  const humidity = Math.floor(Math.random() * 100);
  return { temperature, humidity };
}

// Función que publica los datos aleatorios de temperatura y humedad en un nodo específico
function publishData(node) {
  setInterval(() => {
    const data = generateData();
    const payload = JSON.stringify(data);
    const { hostname, port, path } = url.parse(node);
    const req = coap.request({
      hostname,
      port,
      pathname: path,
      method: 'POST',
      observe: false,
      confirmable: true,
      payload,
      contentFormat: 'application/json'
    });
    req.end();
    console.log(`Publicando en ${node}: ${payload}`);
  }, 5000);
}

// Función que se suscribe a los nodos que publican datos
function observeData(node) {
  const { hostname, port, path } = url.parse(node);
  const req = coap.request({
    hostname,
    port,
    pathname: path,
    method: 'GET',
    observe: true
  });
  req.on('response', (res) => {
    res.on('data', (chunk) => {
      console.log(`Observando ${node}: ${chunk.toString()}`);
    });
  });
  req.end();
}

// Se crean dos tareas para publicar datos en los nodos
publishData(node1);
publishData(node2);

// Se crea una tarea para observar los datos publicados por los nodos
observeData(observer);
