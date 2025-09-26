const { seedExercises } = require('./seedExercises');
const { seedUsers } = require('./seedUsers');

async function seedAll() {
  try {
    console.log('🚀 Iniciando seed completo...\n');
    
    // Sembrar ejercicios
    await seedExercises();
    console.log('');
    
    // Sembrar usuarios
    await seedUsers();
    console.log('');
    
    console.log('🎉 Seed completo finalizado exitosamente');
  } catch (error) {
    console.error('💥 Error en seed completo:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedAll()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}

module.exports = { seedAll };
