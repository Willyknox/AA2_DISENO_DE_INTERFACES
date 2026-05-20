import React from 'react';

// Tarjeta de estadística premium para dashboards.
// bgClass permite cambiar el color/gradiente de fondo.
const StatsCard = ({ title, value, description, bgClass = 'bg-primary', icon }) => {
  return (
    <div className={`card border-0 text-white ${bgClass} shadow-sm h-100 stats-card-interactive`}>
      <div className="card-body p-4 d-flex align-items-center justify-content-between">
        <div>
          <span className="text-white-50 text-uppercase fw-bold small tracking-wider">{title}</span>
          <h3 className="display-6 fw-bold my-2 text-white">{value}</h3>
          <p className="card-text text-white-50 mb-0 small">{description}</p>
        </div>
        {icon && (
          <div className="bg-white bg-opacity-20 rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
