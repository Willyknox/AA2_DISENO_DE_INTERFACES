import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bikeService } from '../../services/bikeService';
import StatsCard from '../../components/ui/StatsCard';
import DataTable from '../../components/ui/DataTable';
import DashboardFilters from '../../components/ui/DashboardFilters';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const AdminDashboard = () => {
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
      setError(err.message || 'Error al conectar con la base de datos.');
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
      // 1. Filtro de búsqueda (modelo o marca)
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

  // Métricas de resumen calculadas a partir de los datos filtrados
  const stats = useMemo(() => {
    const total = filteredBikes.length;
    
    const avgPrice = total > 0 
      ? Math.round(filteredBikes.reduce((sum, b) => sum + (Number(b.price) || 0), 0) / total) 
      : 0;
      
    const ebikeCount = filteredBikes.filter(b => b.ebike).length;
    
    const distinctBrands = new Set(filteredBikes.map(b => b.brand).filter(Boolean)).size;

    return { total, avgPrice, ebikeCount, distinctBrands };
  }, [filteredBikes]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedBrand('');
    setSelectedType('');
    setSelectedYear('');
    setEbikeFilter(false);
  };

  const columns = [
    { key: 'id', label: 'ID' },
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
      label: 'E-Bike',
      render: (val) => val ? '⚡ Sí' : '❌ No'
    }
  ];

  if (loading) return <LoadingSpinner message="Cargando panel de administración..." />;
  
  if (error) return (
    <div className="container mt-5">
      <ErrorMessage message={error} />
      <div className="text-center mt-3">
        <button onClick={fetchBikes} className="btn btn-primary">Reintentar conexión</button>
      </div>
    </div>
  );

  return (
    <div className="container mt-5 mb-5 dashboard-fade-in">
      {/* Cabecera del Dashboard */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Panel de Control de Administración</h2>
          <p className="text-muted mb-0">Bienvenido Administrador, <span className="fw-semibold text-primary">{user?.name}</span></p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/bikes" className="btn btn-primary d-flex align-items-center gap-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
              <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.185 1.185l-.16.291a1.873 1.873 0 0 0 1.115 2.693l.319.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.185l-.291-.16a1.873 1.873 0 0 0-2.693 1.115l-.094.319c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.693-1.115l-.291.16c-.764.415-1.6-.42-1.185-1.185l.16-.291a1.873 1.873 0 0 0-1.115-2.693l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094a1.873 1.873 0 0 0 1.115-2.693l-.16-.291c-.415-.764.42-1.6 1.185-1.185l.291.16a1.873 1.873 0 0 0 2.693-1.115l.094-.319z"/>
            </svg>
            Gestionar Catálogo
          </Link>
        </div>
      </div>

      {/* Grid de Resúmenes (StatsCards) */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-sm-6 col-lg-3">
          <StatsCard 
            title="Total Bicicletas" 
            value={stats.total} 
            description="Bicicletas que cumplen los filtros" 
            bgClass="bg-gradient-primary" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-bicycle" viewBox="0 0 16 16">
                <path d="M4 4.5a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1v.5h.5a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5v-.5h-.5a.5.5 0 0 1-.5-.5M8 1a2 2 0 1 0 0 4 2 2 0 0 0 0-4m0 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m-2.5 7.5A1.5 1.5 0 1 0 4.5 8a1.5 1.5 0 0 0 1 1.5M12.3 2H11v1h1.3l.8 2H11v1h1.7l1 2.5h-1.2v1h1.7L16 6.5V6zm-1.8 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-1 1.5a2.5 2.5 0 1 1-5 0v-.5h5zm-6 0a2.5 2.5 0 1 1 5 0h-5z"/>
              </svg>
            }
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatsCard 
            title="Precio Medio" 
            value={`${stats.avgPrice.toLocaleString('es-ES')} €`} 
            description="De las bicicletas mostradas" 
            bgClass="bg-gradient-success" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-cash-stack" viewBox="0 0 16 16">
                <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
                <path d="M2 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5zM3 0h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 3 0"/>
              </svg>
            }
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatsCard 
            title="Modelos E-Bike" 
            value={`${stats.ebikeCount} u.`} 
            description="Bicicletas con asistencia eléctrica" 
            bgClass="bg-gradient-warning" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-lightning-charge" viewBox="0 0 16 16">
                <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41z"/>
              </svg>
            }
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatsCard 
            title="Fabricantes" 
            value={stats.distinctBrands} 
            description="Marcas representadas en el filtro" 
            bgClass="bg-gradient-info" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-tags" viewBox="0 0 16 16">
                <path d="M3 2v4.586l7 7L14.586 9l-7-7zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 7.586z"/>
                <path d="M5.5 5.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1 7.086a1 1 0 0 1 .293-.707L8.75 1.25l-.75-.75a1 1 0 0 0-1.414 0l-7 7A1 1 0 0 0 0 8.914V13a1 1 0 0 0 1 1h4.086a1 1 0 0 0 .707-.293l.75-.75-5.25-5.25A1 1 0 0 1 1 7.086"/>
              </svg>
            }
          />
        </div>
      </div>

      {/* Sección de Filtros */}
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

      {/* Listado en Tabla */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 border-0">
          <h5 className="mb-0 fw-semibold text-dark">Listado de Bicicletas Registradas</h5>
        </div>
        <div className="card-body p-0">
          <DataTable columns={columns} data={filteredBikes} showSearch={false} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
