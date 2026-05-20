// Muestra feedback inmediato de cuántos resultados quedan tras buscar y filtrar.
export default function ResultsCount({ count }) {
  return (
    <div className="mb-3 text-muted small fw-bold">
      {/* Ternario para concordancia singular/plural. */}
      {count} {count === 1 ? 'bicicleta encontrada' : 'bicicletas encontradas'}
    </div>
  );
}
