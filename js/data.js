// DATOS DE EJEMPLO. Las coordenadas son aproximadas y los negocios son ficticios,
// excepto los mercados y puntos de referencia. Reemplazar por datos reales.

const LUGARES = [
  { id: 1, nombre: "Mercado 10 de Agosto", tipo: "mercado", lat: -2.8997, lng: -79.0072,
    desc: "Mercado tradicional: mote pillo, hornado, jugos y frutas.",
    platos: ["Hornado", "Mote pillo", "Jugos naturales"] },
  { id: 2, nombre: "Mercado 9 de Octubre", tipo: "mercado", lat: -2.8995, lng: -79.0033,
    desc: "Comida típica cuencana en pleno centro histórico.",
    platos: ["Cuy asado", "Tamales", "Humitas"] },
  { id: 3, nombre: "Picantería La Cuencana (ejemplo)", tipo: "picanteria", lat: -2.9021, lng: -79.0058,
    desc: "Platos de la casa con receta de la abuela.",
    platos: ["Cuy asado", "Fritada", "Llapingachos"] },
  { id: 4, nombre: "Café Calderón (ejemplo)", tipo: "cafeteria", lat: -2.8974, lng: -79.0045,
    desc: "Café de altura, empanadas y postres frente al parque.",
    platos: ["Empanadas de viento", "Café pasado", "Quesadillas"] },
  { id: 5, nombre: "Restaurante Tomebamba (ejemplo)", tipo: "restaurante", lat: -2.9043, lng: -79.0010,
    desc: "Cocina ecuatoriana con vista al río Tomebamba.",
    platos: ["Locro de papas", "Trucha al ajillo", "Seco de chivo"] },
  { id: 6, nombre: "Sabor de Turi (ejemplo)", tipo: "restaurante", lat: -2.9266, lng: -79.0030,
    desc: "Platos típicos junto al mirador de Turi.",
    platos: ["Cuy asado", "Canelazo", "Mote con chicharrón"] },
  { id: 7, nombre: "Dulces de la Calle Larga (ejemplo)", tipo: "cafeteria", lat: -2.9050, lng: -79.0030,
    desc: "Helados de paila, dulces y bebidas calientes.",
    platos: ["Helado de paila", "Dulce de higos", "Canelazo"] }
];

const TIPOS = {
  restaurante: { etiqueta: "Restaurantes", icono: "🍽️" },
  picanteria:  { etiqueta: "Picanterías",  icono: "🌶️" },
  mercado:     { etiqueta: "Mercados",     icono: "🧺" },
  cafeteria:   { etiqueta: "Cafés y dulces", icono: "☕" }
};

const EVENTOS = [
  { id: 1, titulo: "Feria del Mote y el Cuy (ejemplo)", fecha: "Sáb 15 nov, 10:00", lugarId: 2,
    desc: "Degustación de platos típicos y música en vivo." },
  { id: 2, titulo: "Noche de Canelazo (ejemplo)", fecha: "Vie 21 nov, 19:00", lugarId: 6,
    desc: "Bebidas calientes y mirador iluminado." }
];

const PROMOCIONES = [
  { id: 1, titulo: "2x1 en empanadas de viento (ejemplo)", lugarId: 4, vence: "Hasta el 30 nov",
    desc: "Presenta la app en caja." },
  { id: 2, titulo: "Cuy asado + bebida a $18 (ejemplo)", lugarId: 3, vence: "Fines de semana",
    desc: "Porción para dos personas." },
  { id: 3, titulo: "Helado de paila gratis con tu postre (ejemplo)", lugarId: 7, vence: "Esta semana",
    desc: "Válido en consumo local." }
];

const NOTIFICACIONES = [
  { id: 1, icono: "🎉", titulo: "Nuevo evento cerca de ti", texto: "Feria del Mote y el Cuy este sábado.", hora: "Hace 1 h" },
  { id: 2, icono: "🏷️", titulo: "Nueva promoción", texto: "2x1 en empanadas de viento en Café Calderón.", hora: "Hace 3 h" },
  { id: 3, icono: "📍", titulo: "Lugar añadido", texto: "Sabor de Turi ya está en el mapa.", hora: "Ayer" }
];

const RUTAS = [
  { id: 1, nombre: "Ruta del centro histórico", duracion: "2 h a pie", lugares: [4, 2, 1, 3],
    desc: "Parque Calderón, mercados y picantería." },
  { id: 2, nombre: "Ruta del río Tomebamba", duracion: "1 h 30 min", lugares: [7, 5],
    desc: "Dulces en Calle Larga y almuerzo frente al río." },
  { id: 3, nombre: "Ruta del mirador de Turi", duracion: "3 h (en auto)", lugares: [4, 5, 6],
    desc: "Café, almuerzo y atardecer en Turi." }
];

const RECETAS = [
  { id: 1, nombre: "Mote pillo", tiempo: "30 min",
    ingredientes: ["Mote cocido", "Huevos", "Cebolla blanca", "Ajo", "Cilantro", "Sal y comino"],
    pasos: ["Sofríe cebolla y ajo.", "Añade el mote y mezcla.", "Agrega los huevos batidos y revuelve.", "Sirve con cilantro."] },
  { id: 2, nombre: "Canelazo", tiempo: "15 min",
    ingredientes: ["Agua", "Canela en rama", "Panela", "Naranjilla o limón", "Aguardiente (opcional)"],
    pasos: ["Hierve el agua con canela y panela.", "Añade jugo de naranjilla o limón.", "Sirve caliente, con aguardiente si quieres."] },
  { id: 3, nombre: "Llapingachos", tiempo: "45 min",
    ingredientes: ["Papas", "Queso fresco", "Cebolla", "Achiote", "Sal"],
    pasos: ["Cocina y machaca las papas con achiote.", "Rellena bolitas con queso y cebolla.", "Aplánalas y dóralas en sartén.", "Sirve con huevo y salsa de maní."] }
];
