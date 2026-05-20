import { apiClient } from './apiClient';

// Servicio específico del dominio “bicicletas”.
// Ventaja: las páginas no necesitan saber las URLs exactas del backend.
export const bikeService = {
  async getAllBikes() {
    try {
      return await apiClient.get('/bikes');
    } catch (error) {
      throw new Error(error.message || 'Error al obtener las bicicletas');
    }
  },

  async getBikeById(id) {
    try {
      return await apiClient.get(`/bikes/${id}`);
    } catch (error) {
      throw new Error(error.message || 'Error al obtener la bicicleta');
    }
  },

  async getAllBrands() {
    try {
      return await apiClient.get('/brands');
    } catch (error) {
      throw new Error(error.message || 'Error al obtener las marcas');
    }
  },

  async addBike(bikeData) {
    try {
      return await apiClient.post('/bikes', bikeData);
    } catch (error) {
      throw new Error(error.message || 'Error al crear la bicicleta');
    }
  }
};
