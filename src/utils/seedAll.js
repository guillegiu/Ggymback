const { seedExercises } = require('./seedExercises');
const { seedUsers } = require('./seedUsers');
const { seedFriends } = require('./seedFriends');
const { seedRoutines } = require('./seedRoutines');

async function seedAll() {
  try {
    console.log('🚀 Iniciando seed completo...\n');
    
    // Sembrar ejercicios
    await seedExercises();
    console.log('');
    
    // Sembrar usuarios
    await seedUsers();
    console.log('');
    
    // Sembrar amistades
    await seedFriends();
    console.log('');
    
    // Sembrar rutinas
    await seedRoutines();
    console.log('');
    
    console.log('🎉 Seed completo finalizado exitosamente');
    console.log('👥 Usuarios: Guillermo, María, Juan');
    console.log('🤝 Amistades: Guillermo ↔ María');
    console.log('🏋️ Rutinas: 6 rutinas (A, B, C) para Guillermo y María');
    console.log('💪 Ejercicios: 20+ ejercicios realistas');
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
