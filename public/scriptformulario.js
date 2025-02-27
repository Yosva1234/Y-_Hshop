document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Mostrar el spinner
  document.getElementById('loading').style.display = 'block';

  const nombre = document.getElementById('nombre').value;
  const precio = document.getElementById('precio').value;
  const info = document.getElementById('info').value;
  const fileInput = document.getElementById('imageInput');
  const file = fileInput.files[0];

  if (!nombre || !precio || !info || !file) {
      alert('Por favor, completa todos los campos.');
      document.getElementById('loading').style.display = 'none'; // Ocultar spinner si hay error
      return;
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
      // Subir la imagen a ImgBB
      const imgbbResponse = await fetch('https://api.imgbb.com/1/upload?key=9ad2a8dc2c1923e1ec594fe14155d409', {
          method: 'POST',
          body: formData,
      });

      const imgbbData = await imgbbResponse.json();
      if (!imgbbData.success) {
          throw new Error('Error al subir la imagen.');
      }

      const imageUrl = imgbbData.data.url;

      // Enviar los datos del producto al backend
      const producto = {
          nombre,
          precio: parseFloat(precio),
          info,
          imagen: imageUrl,
      };

      const saveResponse = await fetch('/bebidas', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(producto),
      });

      const saveData = await saveResponse.json();
      if (saveResponse.ok) {
          document.getElementById('message').innerText = 'Producto guardado correctamente.';
          console.log('Producto guardado:', saveData);
          window.location.href = "bienvenido.html";
          
      } else {
          throw new Error('Error al guardar el producto.');
      }
  } catch (error) {
      console.error('Error:', error);
      document.getElementById('message').innerText = 'Hubo un error. Inténtalo de nuevo.';
  } finally {
      // Ocultar el spinner cuando termine todo (éxito o error)
      document.getElementById('loading').style.display = 'none';
  }
});