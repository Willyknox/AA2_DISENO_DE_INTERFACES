import { useState, useEffect, useMemo } from 'react';
import { bikeService } from '../services/bikeService';
import BikeCard from '../components/BikeCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import ResultsCount from '../components/ResultsCount';

export default function BikesPage() {
  // Datos que vienen del API.
  const [bikes, setBikes] = useState([]);
  const [brands, setBrands] = useState([]);
  // Estados de interfaz: cargando y posibles errores.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para búsqueda, filtro y ordenación. Cambiar cualquiera recalcula la lista visible.
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortOrder, setSortOrder] = useState(''); // 'asc' o 'desc'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Promise.all lanza ambas peticiones a la vez; es más rápido que esperar una y luego la otra.
        const [bikesData, brandsData] = await Promise.all([
          bikeService.getAllBikes(),
          bikeService.getAllBrands()
        ]);
        setBikes(bikesData);
        setBrands(brandsData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        // finally se ejecuta tanto si hubo éxito como si hubo error: ideal para quitar el spinner.
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // useMemo memoriza el resultado: solo recalcula si cambian datos, búsqueda, marca u orden.
  const filteredAndSortedBikes = useMemo(() => {
    // Copiamos el array para no modificar el estado original al ordenar con sort().
    let result = [...bikes];

    // 1. Filtrar por búsqueda de texto (modelo o marca).
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(bike => 
        bike.model.toLowerCase().includes(lowercasedTerm) || 
        bike.brand.toLowerCase().includes(lowercasedTerm)
      );
    }

    // 2. Filtrar por marca seleccionada.
    if (selectedBrand) {
      result = result.filter(bike => bike.brand === selectedBrand);
    }

    // 3. Ordenar por precio.
    if (sortOrder === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [bikes, searchTerm, selectedBrand, sortOrder]);

  const handleClearFilters = () => {
    // Reset simultáneo de todos los controles de filtrado.
    setSearchTerm('');
    setSelectedBrand('');
    setSortOrder('');
  };

  // Renderizado condicional: mostramos una pantalla distinta según el estado actual.
  if (loading) return <LoadingSpinner message="Cargando catálogo..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Catálogo de Bicicletas</h2>
      
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      <FilterBar 
        brands={brands} 
        selectedBrand={selectedBrand} 
        onBrandChange={setSelectedBrand}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />
      
      <ResultsCount count={filteredAndSortedBikes.length} />

      {filteredAndSortedBikes.length === 0 ? (
        <EmptyState onClearFilters={handleClearFilters} />
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {/* Cada BikeCard recibe una bici concreta; así separas lógica de listado y presentación. */}
          {filteredAndSortedBikes.map(bike => (
            <div className="col" key={bike.id}>
              <BikeCard bike={bike} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
