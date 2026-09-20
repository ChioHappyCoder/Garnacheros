import { query, initDb } from "./db.js";
import { createTables } from "./schema.js";

const SPOTS = [
  {
    name: "El Califa de León",
    city: "CDMX",
    address: "Calle de las Lanzas 223, Centro",
    colonia: "Centro",
    food_type: "Tacos de Suadero",
    hours: "Mon-Sun 8am-11pm",
    description: "Taquería legendaria con 20+ años de trayectoria, conocida por sus tacos de suadero. Estrella Michelin.",
    image_url: "https://images.unsplash.com/photo-1620384677591-d4e27e1bff8d?w=400&h=300&fit=crop",
  },
  {
    name: "El Tizoncito",
    city: "CDMX",
    address: "Presidente Masaryk 335, Polanco",
    colonia: "Polanco",
    food_type: "Tacos al Pastor",
    hours: "Mon-Sat 12pm-12am",
    description: "Tacos al pastor tradicionales con ingredientes de calidad.",
    image_url: "https://images.unsplash.com/photo-1565050902556-49d882e12b04?w=400&h=300&fit=crop",
  },
  {
    name: "Los Cocuyos",
    city: "CDMX",
    address: "Avenida Paseo de la Reforma 505",
    colonia: "Cuauhtémoc",
    food_type: "Carnitas",
    hours: "Tue-Sun 11am-8pm",
    description: "Carnitas de cerdo recién hecha, acompañadas de tortillas calientitas.",
    image_url: "https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=400&h=300&fit=crop",
  },
  {
    name: "El Huequito",
    city: "CDMX",
    address: "Ayuntamiento 21, Centro Histórico",
    colonia: "Centro",
    food_type: "Tacos de Suadero",
    hours: "Mon-Sun 7am-10pm",
    description: "Puesto icónico en el Centro Histórico, especialista en suadero.",
    image_url: "https://images.unsplash.com/photo-1599599810694-b5ac4dd64b11?w=400&h=300&fit=crop",
  },
  {
    name: "Lechón Rudy",
    city: "Aguascalientes",
    address: "Avenida Aguascalientes 602",
    colonia: "Centro",
    food_type: "Carnitas de Lechón",
    hours: "Mon-Sun 10am-9pm",
    description: "Lechón criollo con todos los condimentos típicos, famoso en toda la ciudad.",
    image_url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop",
  },
  {
    name: "Carnitas Mora",
    city: "Aguascalientes",
    address: "Calle Carrillo Puerto 215",
    colonia: "Centro",
    food_type: "Carnitas",
    hours: "Tue-Sun 9am-8pm",
    description: "Carnitas artesanales cocinadas al adobe desde hace 30 años.",
    image_url: "https://images.unsplash.com/photo-1618164436241-4473940571db?w=400&h=300&fit=crop",
  },
  {
    name: "Las Planchitas",
    city: "Aguascalientes",
    address: "Avenida López de Mateos 400",
    colonia: "La Magdalena",
    food_type: "Quesadillas",
    hours: "Mon-Sun 7am-4pm",
    description: "Quesadillas de queso, flor de calabaza y huitlacoche, recién salidas de la plancha.",
    image_url: "https://images.unsplash.com/photo-1604914175585-fe32a42e8b81?w=400&h=300&fit=crop",
  },
  {
    name: "Lechón Pascualito",
    city: "Aguascalientes",
    address: "Calle Héroe de Nacozari 180",
    colonia: "Centro",
    food_type: "Lechón",
    hours: "Sat-Sun 10am-6pm",
    description: "Lechón criollo de fin de semana, receta tradicional.",
    image_url: "https://images.unsplash.com/photo-1526069089607-490d3f3e2d4f?w=400&h=300&fit=crop",
  },
  {
    name: "Taquería La Gloria",
    city: "Aguascalientes",
    address: "Avenida Zacatecas 520",
    colonia: "Centro",
    food_type: "Tacos de Barbacoa",
    hours: "Mon-Sun 6am-10pm",
    description: "Tacos de barbacoa de res cocinada en horno de tierra.",
    image_url: "https://images.unsplash.com/photo-1565050902556-49d882e12b04?w=400&h=300&fit=crop",
  },
  {
    name: "Orinoco",
    city: "CDMX",
    address: "Orinoco 182, Roma",
    colonia: "Roma",
    food_type: "Tacos Árabes",
    hours: "Mon-Sat 12pm-11pm",
    description: "Famosos tacos árabes con todos los condimentos.",
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561404?w=400&h=300&fit=crop",
  },
];

async function seed() {
  try {
    console.log("🌱 Starting seed...");
    await initDb();
    await createTables();

    for (const spot of SPOTS) {
      const existing = await query(
        `SELECT id FROM spots WHERE name = $1 AND city = $2`,
        [spot.name, spot.city]
      );

      if (existing.rows.length === 0) {
        await query(
          `INSERT INTO spots (name, city, address, colonia, food_type, hours, description, image_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            spot.name,
            spot.city,
            spot.address,
            spot.colonia,
            spot.food_type,
            spot.hours,
            spot.description,
            spot.image_url,
          ]
        );
        console.log(`✓ Seeded: ${spot.name} (${spot.city})`);
      }
    }

    console.log("✓ Seed complete");
    process.exit(0);
  } catch (error) {
    console.error("✗ Seed failed", error);
    process.exit(1);
  }
}

seed();
