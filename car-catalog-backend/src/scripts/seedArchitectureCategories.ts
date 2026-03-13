import mongoose from 'mongoose';
import Category from '../models/Category';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-catalog';

const seedArchitectureCategories = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Limpiar categorías previas de arquitectura para evitar duplicados
    await Category.deleteMany({ type: 'architecture' });

    const categories = [
      {
        name: 'Casas / Residencial',
        slug: 'casas',
        description: 'Todo tipo de diseños residenciales unifamiliares y mansiones',
        subcategories: [
          { name: '1 Piso', slug: 'casas-1-piso' },
          { name: '2 Niveles', slug: 'casas-2-niveles' },
          { name: 'Dúplex', slug: 'casas-duplex' },
          { name: 'Mansiones Lujo', slug: 'mansiones' },
          { name: 'Casas de Playa', slug: 'casas-playa' },
        ]
      },
      {
        name: 'Edificios / Vertical',
        slug: 'edificios',
        description: 'Estructuras de múltiples niveles y conjuntos',
        subcategories: [
          { name: 'Residencial Vertical', slug: 'edificios-residenciales' },
          { name: 'Administrativos', slug: 'edificios-administrativos' },
          { name: 'Corporativos', slug: 'edificios-corporativos' },
          { name: 'Penthouses', slug: 'edificios-penthouses' },
          { name: 'Conjuntos Verticales', slug: 'edificios-conjuntos' },
        ]
      },
      {
        name: 'Comercial / Hospitality',
        slug: 'comercial',
        description: 'Hoteles, resorts y locales comerciales',
        subcategories: [
          { name: 'Hoteles', slug: 'comercial-hoteles' },
          { name: 'Resorts de Lujo', slug: 'comercial-resorts' },
          { name: 'Locales Comerciales', slug: 'comercial-locales' },
          { name: 'Centros Comerciales', slug: 'comercial-mall' },
        ]
      },
      {
        name: 'Industrial / Logística',
        slug: 'industrial',
        description: 'Naves industriales y centros logísticos',
        subcategories: [
          { name: 'Naves Industriales', slug: 'naves-industriales' },
          { name: 'Plantas Producción', slug: 'plantas-produccion' },
          { name: 'Parques Logísticos', slug: 'parques-logisticos' },
        ]
      },
      {
        name: 'Urbanismo / Masterplan',
        slug: 'urbanismo',
        description: 'Planificación de barriadas, condominios y ciudades',
        subcategories: [
          { name: 'Condominios Privados', slug: 'urbanismo-condominios' },
          { name: 'Barriadas Públicas', slug: 'urbanismo-barriadas' },
          { name: 'Desarrollos Macrolote', slug: 'urbanismo-macrolote' },
          { name: 'Ordenamiento Territorial', slug: 'urbanismo-territorial' },
        ]
      },
      {
        name: 'Hospitalario / Institucional',
        slug: 'institucional',
        description: 'Clínicas, hospitales y centros de salud',
        subcategories: [
          { name: 'Hospitales', slug: 'salud-hospitales' },
          { name: 'Clínicas', slug: 'salud-clinicas' },
          { name: 'Centros Dentales', slug: 'salud-dentales' },
        ]
      }
    ];

    for (const catData of categories) {
      const parent = await Category.create({
        name: catData.name,
        slug: catData.slug,
        description: catData.description,
        type: 'architecture',
        status: 'active'
      });
      console.log(`Created parent category: ${parent.name}`);

      for (const sub of catData.subcategories) {
        await Category.create({
          name: sub.name,
          slug: sub.slug,
          parentCategory: parent._id,
          type: 'architecture',
          status: 'active'
        });
        console.log(`  - Created subcategory: ${sub.name}`);
      }
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedArchitectureCategories();
