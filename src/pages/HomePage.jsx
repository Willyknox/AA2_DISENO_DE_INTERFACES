import { Link } from 'react-router-dom';

// Página de inicio: presenta el valor del sitio y lleva al usuario al catálogo.
export default function HomePage() {
  return (
    <div>
      {/* Hero section: bloque principal de bienvenida, pensado para captar atención rápidamente. */}
      <section className="hero-section text-center">
        <div className="container">
          <h1 className="display-4 fw-bold mb-4">Encuentra tu bicicleta ideal</h1>
          <p className="lead mb-4">
            Explora nuestro catálogo completo de bicicletas de carretera, montaña, ciudad y eléctricas. 
            Calidad garantizada en las mejores marcas.
          </p>
          <Link to="/bikes" className="btn btn-light btn-lg px-5 rounded-pill shadow-sm">
            Ver catálogo completo
          </Link>
        </div>
      </section>

      {/* Tarjetas de beneficios: resumen visual de lo que ofrece la tienda. */}
      <section className="container py-5 text-center">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4">
              <h3 className="h5 fw-bold">Las mejores marcas</h3>
              <p className="text-muted">Trabajamos con Trek, Specialized, Giant, Canyon y Scott.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4">
              <h3 className="h5 fw-bold">Variedad de tipos</h3>
              <p className="text-muted">Carretera, montaña, gravel, ciudad y modelos eléctricos (e-bikes).</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4">
              <h3 className="h5 fw-bold">Diseño usable</h3>
              <p className="text-muted">Filtra, busca y ordena fácilmente para encontrar exactamente lo que necesitas.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
