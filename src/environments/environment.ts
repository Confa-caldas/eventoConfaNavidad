// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// ng build --configuration=production
// ng build --prod=true

export const environment = {
  production: false,
  portalWeb: "https://confa.co/",
  personas: "https://confa.co/",
  empresas: "https://confa.co/empresas/",
  facebook: "https://www.facebook.com/Confacaldas/",
  twitter: "https://twitter.com/confacaldas",
  instagram: "https://www.instagram.com/confacaldas/",
  youtube: "https://www.youtube.com/user/Confamiliares",
  pagoDeAportes: "https://www.enlace-apb.com/interssi/.plus",
  acercaDeConfa: "https://confa.co/personas/acerca-de-confa/",
  servicios: [
    {
      nombreServicio: "Subsidios",
      linkServicio: "https://confa.co/personas/subsidios/",
    },
    {
      nombreServicio: "Vivienda",
      linkServicio: "https://confa.co/personas/vivienda/",
    },
    {
      nombreServicio: "Educación",
      linkServicio: "https://confa.co/personas/educacion/",
    },
    {
      nombreServicio: "Recreación",
      linkServicio: "https://confa.co/personas/recreacion/",
    },
    {
      nombreServicio: "Creditos",
      linkServicio: "https://confa.co/personas/creditos/",
    },
    {
      nombreServicio: "Alojamiento",
      linkServicio: "https://app.confa.co:8321/alojamiento",
    },
    {
      nombreServicio: "Salud",
      linkServicio: "https://app.confa.co:8321/salud",
    },
    {
      nombreServicio: "Boletines",
      linkServicio: "https://app.confa.co:8324/login",
    },
  ],
  contacto: "https://confa.co/personas/contacto/",
  viveConfa: "https://confa.co/personas/vive-confa/",
  // Development
  apiUrl: "",

  // Ruta Local
  apiAlojamientoRecreacion:
    "https://app.confa.co:8687/recreacionWS/rest/alojamientoRecreacion/",
  apiEventoNavidad:
    "https://alojamiento.confa.co/eventoNavidadWsBonoRegalo/rest/evento/", //PARA ENTREGA DE BONO REGALO COLABORADORES
  // apiEventoNavidad:
  //   "https://app.confa.co:8687/eventoNavidadWsRegaloNino/rest/evento/", //PARA ENTREGA DE REGALOS

  // apiEventoNavidad: "http://localhost:8081/eventoNavidadWs/rest/evento/",

  //RutaServidorPruebas
  /* apiAlojamientoRecreacion: 'https://app.confa.co:8687/recreacionWS/rest/alojamientoRecreacion/ ', */

  apiIngresoConfa: "https://app.confa.co:8687/ingresoConfaWSSpruebas/rest/",
  parametro1: "hlZTM4ZDcwNDRlODcyNzZDX1BPUlQqMjAxOCQ=",
  parametro2: "UG9ydGFsX0NvbmZhODRkZGZiMzQxMjZmYzNhND",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
