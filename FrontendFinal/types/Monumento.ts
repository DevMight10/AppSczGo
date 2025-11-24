export interface Monumento {
  _id: string;
  nombre: string;
  categoria: string;
  descripcion?: string;
  coordenadas: {
    latitud: number;
    longitud: number;
  };
  radioGeofence: number;
  imagenes: string[];
  distancia?: number;

  // Nuevos campos agregados para el detalle del monumento:
  aspectosPositivos?: string[];
  aspectosNegativos?: string[];
}

