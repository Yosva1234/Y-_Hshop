// Función para mostrar las bebidas en la página
function mostrarPlatos(bebidas) {
  const platosContainer = document.getElementById("platos-container");

  // Limpia el contenedor antes de agregar las bebidas
  platosContainer.innerHTML = "";

  // Recorre la lista de bebidas y crea un elemento para cada una
  bebidas.forEach((plato) => {
    const platoElement = document.createElement("div");
    platoElement.classList.add("plato");

    // Construye el contenido HTML para cada bebida
    platoElement.innerHTML = `
      <img src="${plato.imagen}" alt="${plato.nombre}" class="plato-imagen">
      <h3>${plato.nombre} - $${plato.precio.toFixed(2)}</h3>
      ${plato.info ? `<h4>${plato.info}</h4>` : ''}
    `;

    // Agrega el elemento al contenedor
    platosContainer.appendChild(platoElement);
  });
}

// Función para obtener las bebidas desde el servidor
function obtenerBebidas() {
  fetch('/bebidas') // Hace una solicitud GET a la ruta /bebidas
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      return response.json(); // Convierte la respuesta a JSON
    })
    .then(data => {
      // Llama a la función para mostrar las bebidas con los datos obtenidos
      mostrarPlatos(data);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Hubo un error al cargar los datos de las bebidas');
    });
}

// Llama a la función para obtener las bebidas cuando la página se cargue
window.onload = obtenerBebidas;