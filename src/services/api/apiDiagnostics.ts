// ✅ Diagnóstico completo de APIs
export const runApiDiagnostics = async () => {  
  
  // 2. Probar API Ninja con diferentes configuraciones
  const apiKey = import.meta.env.VITE_NINJA_API_KEY;
  const baseUrl = import.meta.env.VITE_NINJA_API_URL || 'https://api.api-ninjas.com/v1/cars';
  
  if (!apiKey) {
    console.error('❌ VITE_NINJA_API_KEY no está configurada');
    return { success: false, error: 'API Key missing' };
  }
  
  // ✅ Pruebas progresivas con tipos correctos
  const tests = [
    {
      name: 'Test básico sin parámetros',
      url: baseUrl,
      params: {} as Record<string, string>,
      headers: { 'X-Api-Key': apiKey }
    },
    {
      name: 'Test con marca solamente',
      url: baseUrl,
      params: { make: 'toyota' } as Record<string, string>,
      headers: { 'X-Api-Key': apiKey }
    },
    {
      name: 'Test con límite bajo',
      url: baseUrl,
      params: { limit: '1' } as Record<string, string>, // ✅ Convertir número a string
      headers: { 'X-Api-Key': apiKey }
    }
  ];
  
  for (const test of tests) {
    try {      
      // ✅ Crear URL con parámetros correctamente tipados
      const url = new URL(test.url);
      Object.entries(test.params).forEach(([key, value]) => {
        if (value) { // Solo agregar parámetros que tengan valor
          url.searchParams.append(key, value);
        }
      });
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: test.headers
      });      
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      }
    } catch (error) {
      console.error(`💥 ${test.name} falló:`, error);
    }
  }
  
  return { success: false, error: 'Todas las pruebas fallaron' };
};

// ✅ Función para obtener datos de respaldo con marcas chinas incluidas
export const getFallbackCarData = () => {
  return [
    {
      id: 'fallback-1',
      make: 'Toyota',
      model: 'Camry',
      year: 2024,
      class: 'midsize car',
      cylinders: 4,
      displacement: 2.5,
      drive: 'fwd',
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 32,
      city_mpg: 28,
      combination_mpg: 30,
      price: 28500,
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Toyota Camry 2024 with gas engine of 4 cylinders and automatic transmission.'
    },
    {
      id: 'fallback-2',
      make: 'Honda',
      model: 'Civic',
      year: 2024,
      class: 'compact car',
      cylinders: 4,
      displacement: 2.0,
      drive: 'fwd',
      fuel_type: 'gas',
      highway_mpg: 36,
      city_mpg: 31,
      combination_mpg: 33,
      price: 24200,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Honda Civic 2024 with gas engine of 4 cylinders.'
    },
    {
      id: 'fallback-3',
      make: 'Tesla',
      model: 'Model 3',
      year: 2024,
      class: 'compact car',
      cylinders: 0,
      displacement: '',
      drive: 'rwd',
      fuel_type: 'electricity',
      highway_mpg: 134,
      city_mpg: 141,
      combination_mpg: 138,
      price: 42500,
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Tesla Model 3 2024 with electric motor.'
    },
    {
      id: 'fallback-4',
      make: 'BMW',
      model: '3 Series',
      year: 2024,
      class: 'compact car',
      cylinders: 4,
      displacement: 2.0,
      drive: 'rwd',
      fuel_type: 'gas',
      highway_mpg: 33,
      city_mpg: 26,
      combination_mpg: 29,
      price: 45800,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'BMW 3 Series 2024 with gas engine of 4 cylinders.'
    },
    {
      id: 'fallback-5',
      make: 'Audi',
      model: 'A4',
      year: 2024,
      class: 'compact car',
      cylinders: 4,
      displacement: 2.0,
      drive: 'awd',
      fuel_type: 'gas',
      highway_mpg: 34,
      city_mpg: 24,
      combination_mpg: 28,
      price: 43900,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Audi A4 2024 with gas engine of 4 cylinders.'
    },
    {
      id: 'fallback-6',
      make: 'Kia',
      model: 'Sportage',
      year: 2024,
      class: 'suv',
      cylinders: 4,
      displacement: 2.4,
      drive: 'awd',
      fuel_type: 'gas',
      highway_mpg: 28,
      city_mpg: 23,
      combination_mpg: 25,
      price: 32900,
      image: 'https://images.unsplash.com/photo-1558383817-dd10c33e799f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Kia Sportage 2024 SUV with gas engine of 4 cylinders.'
    },
    {
      id: 'fallback-7',
      make: 'Hyundai',
      model: 'Tucson',
      year: 2024,
      class: 'suv',
      cylinders: 4,
      displacement: 2.5,
      drive: 'awd',
      fuel_type: 'gas',
      highway_mpg: 29,
      city_mpg: 24,
      combination_mpg: 26,
      price: 35400,
      image: 'https://images.unsplash.com/photo-1629293363663-08de80df7b5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Hyundai Tucson 2024 SUV with gas engine of 4 cylinders.'
    },
    {
      id: 'fallback-8',
      make: 'Ford',
      model: 'F-150',
      year: 2024,
      class: 'pickup truck',
      cylinders: 6,
      displacement: 3.5,
      drive: '4wd',
      fuel_type: 'gas',
      highway_mpg: 24,
      city_mpg: 18,
      combination_mpg: 21,
      price: 55200,
      image: 'https://images.unsplash.com/photo-1551830820-330a71b99659?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Ford F-150 2024 pickup truck with gas engine of 6 cylinders.'
    },
    {
      id: 'fallback-9',
      make: 'BYD',
      model: 'Han EV',
      year: 2024,
      class: 'luxury sedan',
      cylinders: 0,
      displacement: 0,
      drive: 'awd',
      fuel_type: 'electricity',
      transmission: 'a',
      highway_mpg: 125,
      city_mpg: 135,
      combination_mpg: 130,
      price: 38900,
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'BYD Han EV 2024 luxury electric sedan with advanced autonomous features.'
    },
    {
      id: 'fallback-10',
      make: 'NIO',
      model: 'ET7',
      year: 2024,
      class: 'luxury sedan',
      cylinders: 0,
      displacement: 0,
      drive: 'awd',
      fuel_type: 'electricity',
      transmission: 'a',
      highway_mpg: 120,
      city_mpg: 140,
      combination_mpg: 130,
      price: 52900,
      image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'NIO ET7 2024 luxury electric sedan with battery swapping technology.'
    },
    {
      id: 'fallback-11',
      make: 'Geely',
      model: 'Coolray',
      year: 2024,
      class: 'compact suv',
      cylinders: 3,
      displacement: 1.5,
      drive: 'fwd',
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 35,
      city_mpg: 28,
      combination_mpg: 31,
      price: 22900,
      image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Geely Coolray 2024 compact SUV with turbocharged engine and modern features.'
    },
    {
      id: 'fallback-12',
      make: 'XPeng',
      model: 'P7',
      year: 2024,
      class: 'sports sedan',
      cylinders: 0,
      displacement: 0,
      drive: 'rwd',
      fuel_type: 'electricity',
      transmission: 'a',
      highway_mpg: 118,
      city_mpg: 142,
      combination_mpg: 130,
      price: 45900,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'XPeng P7 2024 electric sports sedan with advanced AI driving capabilities.'
    },
    {
      id: 'fallback-13',
      make: 'Great Wall',
      model: 'Haval H6',
      year: 2024,
      class: 'compact suv',
      cylinders: 4,
      displacement: 2.0,
      drive: 'awd',
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 30,
      city_mpg: 25,
      combination_mpg: 27,
      price: 26900,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Great Wall Haval H6 2024 compact SUV with advanced safety features.'
    },
    {
      id: 'fallback-14',
      make: 'Chery',
      model: 'Tiggo 8',
      year: 2024,
      class: 'midsize suv',
      cylinders: 4,
      displacement: 1.6,
      drive: 'fwd',
      fuel_type: 'gas',
      transmission: 'a',
      highway_mpg: 32,
      city_mpg: 26,
      combination_mpg: 29,
      price: 24900,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Chery Tiggo 8 2024 midsize SUV with excellent value and reliability.'
    }
  ];
};