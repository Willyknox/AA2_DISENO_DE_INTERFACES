import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bikeService } from '../../services/bikeService';
import StatsCard from '../../components/ui/StatsCard';
import DataTable from '../../components/ui/DataTable';
import DashboardFilters from '../../components/ui/DashboardFilters';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [ebikeFilter, setEbikeFilter] = useState(false);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const data = await bikeService.getAllBikes();
      setBikes(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  // Extraer valores únicos de los datos para los selectores de filtros
  const uniqueBrands = useMemo(() => {
    return [...new Set(bikes.map(b => b.brand).filter(Boolean))].sort();
  }, [bikes]);

  const uniqueTypes = useMemo(() => {
    return [...new Set(bikes.map(b => b.type).filter(Boolean))].sort();
  }, [bikes]);

  const uniqueYears = useMemo(() => {
    return [...new Set(bikes.map(b => b.year).filter(Boolean))].sort((a, b) => b - a);
  }, [bikes]);

  // Filtrado reactivo de las bicicletas
  const filteredBikes = useMemo(() => {
    return bikes.filter(bike => {
      // 1. Búsqueda por texto (modelo o marca)
      const matchesSearch = !searchTerm || 
        bike.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bike.brand?.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Filtro de marca
      const matchesBrand = !selectedBrand || bike.brand === selectedBrand;

      // 3. Filtro de tipo
      const matchesType = !selectedType || bike.type === selectedType;

      // 4. Filtro de año
      const matchesYear = !selectedYear || String(bike.year) === selectedYear;

      // 5. Filtro de e-bike
      const matchesEbike = !ebikeFilter || bike.ebike === true;

      return matchesSearch && matchesBrand && matchesType && matchesYear && matchesEbike;
    });
  }, [bikes, searchTerm, selectedBrand, selectedType, selectedYear, ebikeFilter]);

  // Métricas para el usuario
  const stats = useMemo(() => {
    const total = filteredBikes.length;
    
    const prices = filteredBikes.map(b => Number(b.price) || 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    
    const novedadesCount = filteredBikes.filter(b => b.year >= 2025).length;
    
    const distinctTypes = new Set(filteredBikes.map(b => b.type).filter(Boolean)).size;

    return { total, minPrice, maxPrice, novedadesCount, distinctTypes };
  }, [filteredBikes]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedBrand('');
    setSelectedType('');
    setSelectedYear('');
    setEbikeFilter(false);
  };

  const columns = [
    { key: 'model', label: 'Modelo' },
    { key: 'brand', label: 'Marca' },
    { 
      key: 'type', 
      label: 'Tipo',
      render: (val) => {
        const typesMap = { road: 'Carretera', mountain: 'Montaña', city: 'Ciudad', gravel: 'Gravel', fitness: 'Fitness' };
        return typesMap[val] || val;
      }
    },
    { 
      key: 'price', 
      label: 'Precio',
      render: (val) => `${Number(val).toLocaleString('es-ES')} €` 
    },
    { key: 'year', label: 'Año' },
    {
      key: 'ebike',
      label: 'Asistencia ⚡',
      render: (val) => val ? 'E-Bike' : 'Manual'
    }
  ];

  if (loading) return <LoadingSpinner message="Cargando tu panel de usuario..." />;

  if (error) return (
    <div className="container mt-5">
      <ErrorMessage message={error} />
      <div className="text-center mt-3">
        <button onClick={fetchBikes} className="btn btn-primary">Reintentar</button>
      </div>
    </div>
  );

  return (
    <div className="container mt-5 mb-5 dashboard-fade-in">
      {/* Cabecera */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Tu Dashboard de Usuario</h2>
        <p className="text-muted">¡Hola de nuevo, <span className="fw-semibold text-primary">{user?.name}</span>! Explora nuestro catálogo actual y encuentra tu bici perfecta.</p>
      </div>

      {/* Grid de Resúmenes */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-sm-6 col-lg-3">
          <StatsCard 
            title="Bicicletas Encontradas" 
            value={stats.total} 
            description="Coincidentes con tus filtros" 
            bgClass="bg-gradient-primary" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-search-heart" viewBox="0 0 16 16">
                <path d="M6.5 4.482c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.69 0-5.018"/>
                <path d="M13 6.5a6.47 6.47 0 0 1-1.258 3.844q.06.044.115.098l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1-.1-.115h.002A6.5 6.5 0 1 1 13 6.5M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11"/>
              </svg>
            }
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatsCard 
            title="Precio Mínimo" 
            value={`${stats.minPrice.toLocaleString('es-ES')} €`} 
            description="El precio más accesible actual" 
            bgClass="bg-gradient-success" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-graph-down-arrow" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M12.146 11.354a.5.5 0 0 1 0-.708L14.293 8.5H10.5a.5.5 0 0 1 0-1h3.793l-2.147-2.146a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0"/>
                <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm10 11.5a.5.5 0 0 0 .5-.5V4a.5.5 0 0 0-.91-.282L6 8.5 4 6.5a.5.5 0 0 0-.807.034l-2.5 4a.5.5 0 1 0 .848.527L3.75 7.602l1.961 1.961a.5.5 0 0 0 .794-.031l2.995-4.493V11a.5.5 0 0 0 .5.5"/>
              </svg>
            }
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatsCard 
            title="Precio Máximo" 
            value={`${stats.maxPrice.toLocaleString('es-ES')} €`} 
            description="La opción tope de gama" 
            bgClass="bg-gradient-danger" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-graph-up-arrow" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.707l-5.384 5.385a.5.5 0 0 1-.72 0l-1.9-1.9-.777.778a.5.5 0 1 1-.707-.707l1.13-1.13a.5.5 0 0 1 .708 0l1.9 1.9 4.676-4.677H10.5a.5.5 0 0 1-.5-.5"/>
              </svg>
            }
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatsCard 
            title="Modelos Recientes" 
            value={`${stats.novedadesCount} u.`} 
            description="Bicicletas año 2025 o superior" 
            bgClass="bg-gradient-info" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-stars" viewBox="0 0 16 16">
                <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a.287.287 0 0 0 .273.194h2.036c.347 0 .492.448.21.654l-1.647 1.197a.287.287 0 0 0-.104.32l.645 1.938c.11.33-.269.605-.55.4L8.21 11.49a.287.287 0 0 0-.338 0L6.225 12.69c-.281.205-.66-.07-.55-.4l.645-1.938a.287.287 0 0 0-.104-.32L4.57 9.032c-.281-.206-.137-.654.21-.654h2.036a.287.287 0 0 0 .273-.194zm-.9 4.954a.143.143 0 0 1 .087.054l.322.234a.143.143 0 0 1-.055.263l-.113.342c-.055.165-.285.165-.34 0l-.113-.342a.143.143 0 0 1-.055-.263l.322-.234a.143.143 0 0 1 .072-.054"/>
              </svg>
            }
          />
        </div>
      </div>

      {/* Filtros */}
      <DashboardFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedBrand={selectedBrand}
        onBrandChange={setSelectedBrand}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        ebikeFilter={ebikeFilter}
        onEbikeChange={setEbikeFilter}
        onClearFilters={handleClearFilters}
        brands={uniqueBrands}
        types={uniqueTypes}
        years={uniqueYears}
      />

      {/* Tabla de Bicicletas */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 border-0">
          <h5 className="mb-0 fw-semibold text-dark">Explorador de Catálogo</h5>
        </div>
        <div className="card-body p-0">
          <DataTable columns={columns} data={filteredBikes} showSearch={false} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
