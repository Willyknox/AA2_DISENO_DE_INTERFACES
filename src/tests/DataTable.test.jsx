import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DataTable from '../components/ui/DataTable';

describe('DataTable Component', () => {
  const columns = [
    { key: 'model', label: 'Modelo' },
    { key: 'brand', label: 'Marca' },
    { key: 'price', label: 'Precio', render: (val) => `${val} €` }
  ];

  const data = [
    { id: 1, model: 'Tarmac SL8', brand: 'Specialized', price: 5500 },
    { id: 2, model: 'Madone SLR', brand: 'Trek', price: 6200 },
    { id: 3, model: 'SuperSix EVO', brand: 'Cannondale', price: 4800 },
    { id: 4, model: 'Ultimate CF SLX', brand: 'Canyon', price: 4200 },
    { id: 5, model: 'Oltre RC', brand: 'Bianchi', price: 7500 },
    { id: 6, model: 'Orca M20', brand: 'Orbea', price: 3400 }
  ];

  it('debería renderizar la cabecera de las columnas y las primeras filas respetando la paginación por defecto (5 filas)', () => {
    render(<DataTable columns={columns} data={data} showSearch={false} />);

    // Verificar cabeceras
    expect(screen.getByText('Modelo')).toBeDefined();
    expect(screen.getByText('Marca')).toBeDefined();
    expect(screen.getByText('Precio')).toBeDefined();

    // Verificar las primeras 5 filas (según paginación)
    expect(screen.getByText('Tarmac SL8')).toBeDefined();
    expect(screen.getByText('Madone SLR')).toBeDefined();
    expect(screen.getByText('SuperSix EVO')).toBeDefined();
    expect(screen.getByText('Ultimate CF SLX')).toBeDefined();
    expect(screen.getByText('Oltre RC')).toBeDefined();

    // La 6ª fila no debería aparecer todavía
    expect(screen.queryByText('Orca M20')).toBeNull();
  });

  it('debería filtrar las filas cuando se escribe en el buscador general', () => {
    render(<DataTable columns={columns} data={data} showSearch={true} />);

    const searchInput = screen.getByPlaceholderText('Buscar en todos los campos...');
    expect(searchInput).toBeDefined();

    // Filtrar por 'Trek'
    fireEvent.change(searchInput, { target: { value: 'Trek' } });

    // Debería mostrar solo Madone SLR
    expect(screen.getByText('Madone SLR')).toBeDefined();
    expect(screen.queryByText('Tarmac SL8')).toBeNull();
  });

  it('debería ordenar los elementos al hacer clic en las cabeceras', () => {
    render(<DataTable columns={columns} data={data} showSearch={false} />);

    const headerModelo = screen.getByText('Modelo');
    
    // 1er click: Orden Ascendente por Modelo (M -> O -> O -> S -> T)
    fireEvent.click(headerModelo);
    
    let rows = screen.getAllByRole('row');
    // Primera fila de datos es el índice 1 (el índice 0 es la cabecera)
    expect(rows[1].textContent).toContain('Madone SLR');
    expect(rows[2].textContent).toContain('Oltre RC');
    
    // 2do click: Orden Descendente por Modelo (U -> T -> S -> O -> O)
    fireEvent.click(headerModelo);
    
    rows = screen.getAllByRole('row');
    expect(rows[1].textContent).toContain('Ultimate CF SLX');
  });

  it('debería avanzar y retroceder páginas correctamente', () => {
    render(<DataTable columns={columns} data={data} showSearch={false} />);

    // Deberíamos estar en la página 1. El botón "Anterior" debería estar deshabilitado.
    const prevButton = screen.getByText('Anterior');
    const nextButton = screen.getByText('Siguiente');
    
    expect(prevButton.hasAttribute('disabled')).toBe(true);
    expect(nextButton.hasAttribute('disabled')).toBe(false);

    // Avanzar a la página 2
    fireEvent.click(nextButton);

    // Ahora deberíamos ver la 6ª fila "Orca M20"
    expect(screen.getByText('Orca M20')).toBeDefined();
    expect(screen.queryByText('Tarmac SL8')).toBeNull();

    // Y el botón "Siguiente" debería estar deshabilitado al ser la última página
    expect(nextButton.hasAttribute('disabled')).toBe(true);
    expect(prevButton.hasAttribute('disabled')).toBe(false);
  });

  it('debería mostrar mensaje de tabla vacía si no hay registros', () => {
    render(<DataTable columns={columns} data={[]} showSearch={false} />);
    expect(screen.getByText('No se encontraron resultados')).toBeDefined();
  });
});
