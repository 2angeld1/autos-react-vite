// Conectar a la base de datos car_catalog
use('car_catalog');

// Crear usuario de aplicación
db.runCommand({
  createUser: "app_user",
  pwd: "app_password",
  roles: [
    {
      role: "readWrite",
      db: "car_catalog"
    }
  ]
});

// Crear colecciones básicas
db.createCollection("cars");
db.createCollection("users");
db.createCollection("favorites");

// Verificar que se crearon
db.getCollectionNames();