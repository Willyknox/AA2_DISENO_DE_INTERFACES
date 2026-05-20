import React, { useEffect, useState } from 'react';
import { bikeService } from '../../services/bikeService';
import { cloudinaryService } from '../../services/cloudinaryService';
import DataTable from '../../components/ui/DataTable';

const AdminBikesPage = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado del modal
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    model: '',
    brand: '',
    price: '',
    type: 'road',
    ebike: false,
    description: '',
    imageFile: null
  });

  const fetchBikes = async () => {
    try {
      const data = await bikeService.getAllBikes();
      setBikes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carga inicial de la tabla al abrir la página de administración.
    fetchBikes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, imageFile: files[0] }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddBike = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = '/images/city.png'; // Imagen por defecto
      
      // Si el usuario seleccionó un archivo, subir a Cloudinary
      if (formData.imageFile) {
        imageUrl = await cloudinaryService.uploadImage(formData.imageFile);
      }

      // Preparar objeto de bicicleta
      const newBike = {
        model: formData.model,
        brand: formData.brand,
        price: Number(formData.price),
        type: formData.type,
        ebike: formData.ebike,
        description: formData.description,
        image: imageUrl,
        year: new Date().getFullYear(),
        // ID de marca mockeado por simplicidad
        brandId: "1" 
      };

      await bikeService.addBike(newBike);
      await fetchBikes(); // Actualizar tabla
      
      setShowModal(false);
      setFormData({ model: '', brand: '', price: '', type: 'road', ebike: false, description: '', imageFile: null });
    } catch (err) {
      alert("Error al añadir bicicleta: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'model', label: 'Modelo' },
    { key: 'brand', label: 'Marca' },
    { key: 'type', label: 'Tipo' },
    { 
      key: 'price', 
      label: 'Precio',
      render: (val) => `${val} €` 
    },
    {
      key: 'ebike',
      label: 'E-Bike',
      render: (val) => val ? 'Sí' : 'No'
    }
  ];

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" /></div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Bicicletas</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Añadir Bicicleta
        </button>
      </div>
      <DataTable columns={columns} data={bikes} />

      {/* Modal Añadir Bicicleta */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Añadir Nueva Bicicleta</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddBike}>
                  <div className="mb-3">
                    <label className="form-label">Modelo</label>
                    <input type="text" className="form-control" name="model" value={formData.model} onChange={handleInputChange} required />
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Marca</label>
                      <input type="text" className="form-control" name="brand" value={formData.brand} onChange={handleInputChange} required />
                    </div>
                    <div className="col">
                      <label className="form-label">Precio (€)</label>
                      <input type="number" className="form-control" name="price" value={formData.price} onChange={handleInputChange} required min="0" />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Tipo</label>
                      <select className="form-select" name="type" value={formData.type} onChange={handleInputChange}>
                        <option value="road">Carretera</option>
                        <option value="mountain">Montaña</option>
                        <option value="city">Ciudad</option>
                        <option value="gravel">Gravel</option>
                        <option value="fitness">Fitness</option>
                      </select>
                    </div>
                    <div className="col d-flex align-items-end">
                      <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" name="ebike" id="ebikeCheck" checked={formData.ebike} onChange={handleInputChange} />
                        <label className="form-check-label" htmlFor="ebikeCheck">Es E-Bike</label>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" name="description" rows="2" value={formData.description} onChange={handleInputChange}></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Imagen (Cloudinary)</label>
                    <input type="file" className="form-control" name="imageFile" accept="image/*" onChange={handleInputChange} />
                    <small className="text-muted">Si no has configurado Cloudinary, se usará una imagen simulada.</small>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary" disabled={uploading}>
                      {uploading ? 'Subiendo...' : 'Guardar Bicicleta'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBikesPage;
