// Tipos para las estructuras de datos
export interface BrandImages {
    [brandName: string]: string;
  }
  
  export interface ModelImages {
    [modelName: string]: string;
  }
  
  export interface CarModelImages {
    [brandName: string]: ModelImages;
  }
  
  // Función para obtener una imagen predeterminada por marca
  export const getDefaultCarImage = (make: string): string => {
  
  // ✅ MEJORADO: Imágenes más específicas por marca
  const brandImages: BrandImages = {
    'toyota': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80', // Toyota Camry
    'kia': 'https://images.unsplash.com/photo-1558383817-dd10c33e799f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80', // Kia
    'hyundai': 'https://images.unsplash.com/photo-1629293363663-08de80df7b5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80', // Hyundai
    'tesla': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80', // Tesla
    'nissan': 'https://images.unsplash.com/photo-1606016829667-c9f7ff88b8c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80', // Nissan
    'chevrolet': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80', // Chevrolet
    'mitsubishi': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80', // Mitsubishi
    'geely': 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80', // Auto genérico moderno
    'bmw': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80', // BMW
    'audi': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80', // Audi
    'mercedes': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80', // Mercedes
    'ford': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80', // Ford
    'honda': 'https://images.unsplash.com/photo-1606220588913-b3aad8d29eb8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80' // Honda
  };
  return brandImages[make.toLowerCase()] || DEFAULT_CAR_IMAGE;
};
  
  // Catálogo ampliado de imágenes por marca y modelo
  export const carModelImages: CarModelImages = {
    // ✅ Agregar marcas nuevas al catálogo
    
    // Mitsubishi
    'mitsubishi': {
      'outlander': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2023-mitsubishi-outlander.jpg',
      'eclipse cross': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2023-mitsubishi-eclipse-cross.jpg',
      'mirage': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2023-mitsubishi-mirage.jpg',
      'outlander sport': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2023-mitsubishi-outlander-sport.jpg',
      'default': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2023-mitsubishi-outlander.jpg'
    },
    
    // Geely
    'geely': {
      'emgrand': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'coolray': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // ✅ NUEVA IMAGEN
      'atlas': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // ✅ NUEVA IMAGEN
      'default': 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    
    // Chery
    'chery': {
      'tiggo': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'arrizo': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'omoda': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'default': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    
    // Great Wall
    'great wall': {
      'wey': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'poer': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'default': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    
    // MG
    'mg': {
      'zs': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'hs': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'rx5': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'default': 'https://images.unsplash.com/photo-1549399850-2a2c494e0aca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    
    // Haval
    'haval': {
      'h6': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'jolion': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'default': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },

    // Toyota
    'toyota': {
      'corolla': 'https://cdn.motor1.com/images/mgl/mrz1e/s1/2020-toyota-corolla-sedan.jpg',
      'camry': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-toyota-camry-trd-first-drive.jpg',
      'rav4': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2019-toyota-rav4-adventure-first-drive.jpg',
      'highlander': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2020-toyota-highlander-platinum-exterior.jpg',
      'tacoma': 'https://cdn.motor1.com/images/mgl/kPjKL/s1/2020-toyota-tacoma-trd-pro-drivers-notes.jpg',
      'tundra': 'https://cdn.motor1.com/images/mgl/Y8mVA/s1/2022-toyota-tundra-platinum.jpg',
      'gr 86': 'https://cdn.motor1.com/images/mgl/BkWoZ/s1/2022-toyota-gr-86.jpg',
      'supra': 'https://cdn.motor1.com/images/mgl/P3MJE/s1/2020-toyota-supra.jpg',
      'prius': 'https://cdn.motor1.com/images/mgl/3jlKj/s1/2022-toyota-prius-le.jpg',
      'sienna': 'https://cdn.motor1.com/images/mgl/4nKVG/s1/2021-toyota-sienna.jpg',
      'avalon': 'https://cdn.motor1.com/images/mgl/2oqzj/s1/2019-toyota-avalon-touring.jpg',
      'default': 'https://cdn.motor1.com/images/mgl/mrz1e/s1/2020-toyota-corolla-sedan.jpg'
    },
  
    // Honda
    'honda': {
      'civic': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2022-honda-civic-hatchback.jpg',
      'accord': 'https://cdn.motor1.com/images/mgl/YAokE/s1/2020-honda-accord-hybrid-touring.jpg',
      'cr-v': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2020-honda-cr-v-hybrid.jpg',
      'pilot': 'https://cdn.motor1.com/images/mgl/oqzpV/s1/2019-honda-pilot-elite.jpg',
      'ridgeline': 'https://cdn.motor1.com/images/mgl/kPjKL/s1/2020-honda-ridgeline-rtl-e.jpg',
      'odyssey': 'https://cdn.motor1.com/images/mgl/4nKVG/s1/2021-honda-odyssey.jpg',
      'hr-v': 'https://cdn.motor1.com/images/mgl/zxEKO/s1/2020-honda-hr-v-sport.jpg',
      'passport': 'https://cdn.motor1.com/images/mgl/YAokE/s1/2020-honda-passport-elite.jpg',
      'default': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2022-honda-civic-hatchboard.jpg'
    },
  
    // Ford
    'ford': {
      'f-150': 'https://cdn.motor1.com/images/mgl/Y8mVA/s1/2021-ford-f-150.jpg',
      'mustang': 'https://cdn.motor1.com/images/mgl/P3MJE/s1/2020-ford-mustang-gt.jpg',
      'explorer': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2020-ford-explorer-st.jpg',
      'escape': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2020-ford-escape.jpg',
      'edge': 'https://cdn.motor1.com/images/mgl/oqzpV/s1/2019-ford-edge-st.jpg',
      'expedition': 'https://cdn.motor1.com/images/mgl/4nKVG/s1/2021-ford-expedition.jpg',
      'ranger': 'https://cdn.motor1.com/images/mgl/kPjKL/s1/2020-ford-ranger.jpg',
      'bronco': 'https://cdn.motor1.com/images/mgl/BkWoZ/s1/2021-ford-bronco.jpg',
      'fusion': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-ford-fusion.jpg',
      'default': 'https://cdn.motor1.com/images/mgl/Y8mVA/s1/2021-ford-f-150.jpg'
    },
  
    // Chevrolet
    'chevrolet': {
      'silverado': 'https://cdn.motor1.com/images/mgl/Y8mVA/s1/2022-chevrolet-silverado.jpg',
      'corvette': 'https://cdn.motor1.com/images/mgl/P3MJE/s1/2020-chevrolet-corvette.jpg',
      'camaro': 'https://cdn.motor1.com/images/mgl/BkWoZ/s1/2022-chevrolet-camaro.jpg',
      'equinox': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2020-chevrolet-equinox.jpg',
      'tahoe': 'https://cdn.motor1.com/images/mgl/4nKVG/s1/2021-chevrolet-tahoe.jpg',
      'suburban': 'https://cdn.motor1.com/images/mgl/oqzpV/s1/2021-chevrolet-suburban.jpg',
      'traverse': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2020-chevrolet-traverse.jpg',
      'malibu': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-chevrolet-malibu.jpg',
      'impala': 'https://cdn.motor1.com/images/mgl/mrz1e/s1/2020-chevrolet-impala.jpg',
      'default': 'https://cdn.motor1.com/images/mgl/P3MJE/s1/2020-chevrolet-corvette.jpg'
    },
  
    // BMW
    'bmw': {
      '3 series': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2022-bmw-3-series.jpg',
      '5 series': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-bmw-5-series.jpg',
      '7 series': 'https://cdn.motor1.com/images/mgl/mrz1e/s1/2020-bmw-7-series.jpg',
      'x3': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2020-bmw-x3.jpg',
      'x5': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2020-bmw-x5.jpg',
      'x7': 'https://cdn.motor1.com/images/mgl/4nKVG/s1/2021-bmw-x7.jpg',
      'z4': 'https://cdn.motor1.com/images/mgl/P3MJE/s1/2020-bmw-z4.jpg',
      'i3': 'https://cdn.motor1.com/images/mgl/BkWoZ/s1/2020-bmw-i3.jpg',
      'i8': 'https://cdn.motor1.com/images/mgl/oqzpV/s1/2020-bmw-i8.jpg',
      'default': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2022-bmw-3-series.jpg'
    },
  
    // Mercedes-Benz
    'mercedes': {
      'c-class': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2022-mercedes-c-class.jpg',
      'e-class': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-mercedes-e-class.jpg',
      's-class': 'https://cdn.motor1.com/images/mgl/mrz1e/s1/2021-mercedes-s-class.jpg',
      'glc': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2020-mercedes-glc.jpg',
      'gle': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2020-mercedes-gle.jpg',
      'gls': 'https://cdn.motor1.com/images/mgl/4nKVG/s1/2021-mercedes-gls.jpg',
      'g-class': 'https://cdn.motor1.com/images/mgl/oqzpV/s1/2020-mercedes-g-class.jpg',
      'amg gt': 'https://cdn.motor1.com/images/mgl/P3MJE/s1/2020-mercedes-amg-gt.jpg',
      'default': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2022-mercedes-c-class.jpg'
    },
  
    // Audi
    'audi': {
      'a3': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2022-audi-a3.jpg',
      'a4': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-audi-a4.jpg',
      'a6': 'https://cdn.motor1.com/images/mgl/mrz1e/s1/2020-audi-a6.jpg',
      'a8': 'https://cdn.motor1.com/images/mgl/2oqzj/s1/2019-audi-a8.jpg',
      'q3': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2020-audi-q3.jpg',
      'q5': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2020-audi-q5.jpg',
      'q7': 'https://cdn.motor1.com/images/mgl/4nKVG/s1/2021-audi-q7.jpg',
      'q8': 'https://cdn.motor1.com/images/mgl/oqzpV/s1/2020-audi-q8.jpg',
      'tt': 'https://cdn.motor1.com/images/mgl/P3MJE/s1/2020-audi-tt.jpg',
      'r8': 'https://cdn.motor1.com/images/mgl/BkWoZ/s1/2020-audi-r8.jpg',
      'default': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-audi-a4.jpg'
    },
  
    // Nissan
    'nissan': {
      'altima': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-nissan-altima.jpg',
      'sentra': 'https://cdn.motor1.com/images/mgl/mrz1e/s1/2020-nissan-sentra.jpg',
      'maxima': 'https://cdn.motor1.com/images/mgl/2oqzj/s1/2019-nissan-maxima.jpg',
      'rogue': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2020-nissan-rogue.jpg',
      'murano': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2020-nissan-murano.jpg',
      'pathfinder': 'https://cdn.motor1.com/images/mgl/oqzpV/s1/2021-nissan-pathfinder.jpg',
      'armada': 'https://cdn.motor1.com/images/mgl/4nKVG/s1/2021-nissan-armada.jpg',
      'frontier': 'https://cdn.motor1.com/images/mgl/kPjKL/s1/2020-nissan-frontier.jpg',
      'titan': 'https://cdn.motor1.com/images/mgl/Y8mVA/s1/2020-nissan-titan.jpg',
      '370z': 'https://cdn.motor1.com/images/mgl/P3MJE/s1/2020-nissan-370z.jpg',
      'gt-r': 'https://cdn.motor1.com/images/mgl/BkWoZ/s1/2020-nissan-gt-r.jpg',
      'default': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2020-nissan-rogue.jpg'
    },
  
    // Volkswagen
    'volkswagen': {
      'jetta': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2022-volkswagen-jetta.jpg',
      'passat': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-volkswagen-passat.jpg',
      'golf': 'https://cdn.motor1.com/images/mgl/mrz1e/s1/2021-volkswagen-golf.jpg',
      'tiguan': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2020-volkswagen-tiguan.jpg',
      'atlas': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2020-volkswagen-atlas.jpg',
      'touareg': 'https://cdn.motor1.com/images/mgl/oqzpV/s1/2020-volkswagen-touareg.jpg',
      'beetle': 'https://cdn.motor1.com/images/mgl/3jlKj/s1/2019-volkswagen-beetle.jpg',
      'arteon': 'https://cdn.motor1.com/images/mgl/2oqzj/s1/2019-volkswagen-arteon.jpg',
      'default': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2022-volkswagen-jetta.jpg'
    },
  
    // Hyundai
    'hyundai': {
      'elantra': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2022-hyundai-elantra.jpg',
      'sonata': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-hyundai-sonata.jpg',
      'tucson': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2020-hyundai-tucson.jpg',
      'santa fe': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2020-hyundai-santa-fe.jpg',
      'palisade': 'https://cdn.motor1.com/images/mgl/4nKVG/s1/2021-hyundai-palisade.jpg',
      'santa cruz': 'https://cdn.motor1.com/images/mgl/kPjKL/s1/2022-hyundai-santa-cruz.jpg',
      'veloster': 'https://cdn.motor1.com/images/mgl/BkWoZ/s1/2020-hyundai-veloster.jpg',
      'genesis': 'https://cdn.motor1.com/images/mgl/P3MJE/s1/2020-hyundai-genesis.jpg',
      'default': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2022-hyundai-elantra.jpg'
    },
  
    // Kia
    'kia': {
      'forte': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2022-kia-forte.jpg',
      'optima': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-kia-optima.jpg',
      'k5': 'https://cdn.motor1.com/images/mgl/mrz1e/s1/2021-kia-k5.jpg',
      'sportage': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2020-kia-sportage.jpg',
      'sorento': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2020-kia-sorento.jpg',
      'telluride': 'https://cdn.motor1.com/images/mgl/4nKVG/s1/2021-kia-telluride.jpg',
      'soul': 'https://cdn.motor1.com/images/mgl/3jlKj/s1/2020-kia-soul.jpg',
      'stinger': 'https://cdn.motor1.com/images/mgl/P3MJE/s1/2020-kia-stinger.jpg',
      'default': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2020-kia-sorento.jpg'
    },
  
    // Tesla
    'tesla': {
      'model s': 'https://cdn.motor1.com/images/mgl/P3MJE/s1/2021-tesla-model-s.jpg',
      'model 3': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2022-tesla-model-3.jpg',
      'model x': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2021-tesla-model-x.jpg',
      'model y': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2020-tesla-model-y.jpg',
      'cybertruck': 'https://cdn.motor1.com/images/mgl/Y8mVA/s1/tesla-cybertruck.jpg',
      'roadster': 'https://cdn.motor1.com/images/mgl/BkWoZ/s1/tesla-roadster.jpg',
      'default': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2022-tesla-model-3.jpg'
    },
  
    // Lexus
    'lexus': {
      'es': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-lexus-es.jpg',
      'is': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2022-lexus-is.jpg',
      'gs': 'https://cdn.motor1.com/images/mgl/mrz1e/s1/2020-lexus-gs.jpg',
      'ls': 'https://cdn.motor1.com/images/mgl/2oqzj/s1/2019-lexus-ls.jpg',
      'nx': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2020-lexus-nx.jpg',
      'rx': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2020-lexus-rx.jpg',
      'gx': 'https://cdn.motor1.com/images/mgl/oqzpV/s1/2020-lexus-gx.jpg',
      'lx': 'https://cdn.motor1.com/images/mgl/4nKVG/s1/2021-lexus-lx.jpg',
      'lc': 'https://cdn.motor1.com/images/mgl/P3MJE/s1/2020-lexus-lc.jpg',
      'rc': 'https://cdn.motor1.com/images/mgl/BkWoZ/s1/2020-lexus-rc.jpg',
      'default': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2020-lexus-rx.jpg'
    },
  
    // Porsche
    'porsche': {
      '911': 'https://cdn.motor1.com/images/mgl/P3MJE/s1/2020-porsche-911.jpg',
      'cayenne': 'https://cdn.motor1.com/images/mgl/2NMlE/s1/2020-porsche-cayenne.jpg',
      'macan': 'https://cdn.motor1.com/images/mgl/2NMmE/s1/2020-porsche-macan.jpg',
      'panamera': 'https://cdn.motor1.com/images/mgl/ZnMNP/s1/2020-porsche-panamera.jpg',
      'taycan': 'https://cdn.motor1.com/images/mgl/G3MbX/s1/2020-porsche-taycan.jpg',
      'boxster': 'https://cdn.motor1.com/images/mgl/BkWoZ/s1/2020-porsche-boxster.jpg',
      'cayman': 'https://cdn.motor1.com/images/mgl/oqzpV/s1/2020-porsche-cayman.jpg',
      'default': 'https://cdn.motor1.com/images/mgl/P3MJE/s1/2020-porsche-911.jpg'
    },
  };
  export const DEFAULT_CAR_IMAGE = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80';

  // Función para obtener una imagen específica por marca y modelo
  export const getCarModelImage = (make: string, model: string): string => {
    const makeLower = make ? make.toLowerCase().trim() : '';
    const modelLower = model ? model.toLowerCase().trim() : '';
    
    // Verificar si existe la marca en nuestro catálogo
    if (carModelImages[makeLower]) {
      const brandModels = carModelImages[makeLower];
      
      // Verificar si existe el modelo específico
      if (brandModels[modelLower]) {
        return brandModels[modelLower];
      }
      
      // Si no existe el modelo, devolver la imagen por defecto de la marca
      if (brandModels['default']) {
        return brandModels['default'];
      }
    }
    
    // Si no existe ni la marca ni el modelo, usar la imagen por defecto de la marca
    return getDefaultCarImage(make);
  };
  
  // Función para obtener todas las marcas disponibles
  export const getAvailableBrands = (): string[] => {
    return Object.keys(carModelImages);
  };
  
  // Función para obtener todos los modelos de una marca específica
  export const getModelsForBrand = (make: string): string[] => {
    const makeLower = make ? make.toLowerCase().trim() : '';
    
    if (carModelImages[makeLower]) {
      return Object.keys(carModelImages[makeLower]).filter(model => model !== 'default');
    }
    
    return [];
  };
  
  // Función para verificar si una marca está en nuestro catálogo
  export const isBrandSupported = (make: string): boolean => {
    const makeLower = make ? make.toLowerCase().trim() : '';
    return makeLower in carModelImages && makeLower !== 'default';
  };
  
  // Función para verificar si un modelo está soportado para una marca específica
  export const isModelSupported = (make: string, model: string): boolean => {
    const makeLower = make ? make.toLowerCase().trim() : '';
    const modelLower = model ? model.toLowerCase().trim() : '';
    
    if (carModelImages[makeLower]) {
      return modelLower in carModelImages[makeLower] && modelLower !== 'default';
    }
    
    return false;
  };
  
  // Función para generar una URL de placeholder como fallback
  export const generatePlaceholderUrl = (make: string, model: string): string => {
    const carText = encodeURIComponent(`${make || 'Auto'} ${model || ''}`).trim();
    return `https://placehold.co/800x450/1a1a1a/ffffff?text=${carText}`;
  };