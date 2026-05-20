export const cloudinaryService = {
  async uploadImage(file) {
    // Variables de entorno de Vite. Deben empezar por VITE_ para estar disponibles en el frontend.
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || cloudName === 'placeholder_cloud_name') {
      console.warn('Cloudinary no está configurado. Simulando subida de imagen.');
      // En desarrollo devolvemos una imagen local para poder probar el flujo sin cuenta de Cloudinary.
      return new Promise((resolve) => {
        setTimeout(() => resolve('/images/city.png'), 1000);
      });
    }

    // FormData permite enviar archivos binarios en una petición HTTP.
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Error al subir la imagen a Cloudinary');
      }

      const data = await response.json();
      return data.secure_url; // URL HTTPS de la imagen alojada.
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      throw new Error('No se pudo completar la subida de la imagen');
    }
  }
};
