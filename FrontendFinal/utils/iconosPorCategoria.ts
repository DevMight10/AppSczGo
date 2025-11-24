export function obtenerIconoPorCategoria(categoria?: string): any {
  if (!categoria) {
    return require('../app/img/icons/IconAcademico.png');
  }

  const key = categoria.toLowerCase();

  switch (key) {
    case 'gastronomicos':
      return require('../app/img/icons/IconGastronomico.png');

    case 'monumentos':
      return require('../app/img/icons/IconMonumento.png');

    case 'museos':
      return require('../app/img/icons/IconMuseo.png');

    case 'recreativos':
      return require('../app/img/icons/IconParque.png');

    case 'iglesias':
      return require('../app/img/icons/IconIglesia.png');


    default:
      return require('../app/img/icons/IconAcademico.png');
  }
}
