const prisma = require('../config/database');

async function seedFriends() {
  try {
    console.log('🌱 Sembrando amistades...');
    
    // Obtener los usuarios
    const guillermo = await prisma.user.findUnique({
      where: { email: 'guillermo@test.com' }
    });
    
    const maria = await prisma.user.findUnique({
      where: { email: 'maria@test.com' }
    });
    
    const juan = await prisma.user.findUnique({
      where: { email: 'juan@test.com' }
    });

    if (!guillermo || !maria || !juan) {
      throw new Error('Usuarios no encontrados');
    }

    // Crear amistad entre Guillermo y María
    await prisma.friend.upsert({
      where: {
        userId_friendId: {
          userId: guillermo.id,
          friendId: maria.id
        }
      },
      update: {
        status: 'accepted'
      },
      create: {
        userId: guillermo.id,
        friendId: maria.id,
        status: 'accepted'
      }
    });

    // Crear amistad recíproca (María -> Guillermo)
    await prisma.friend.upsert({
      where: {
        userId_friendId: {
          userId: maria.id,
          friendId: guillermo.id
        }
      },
      update: {
        status: 'accepted'
      },
      create: {
        userId: maria.id,
        friendId: guillermo.id,
        status: 'accepted'
      }
    });

    console.log('✅ Amistades sembradas exitosamente');
    console.log('👥 Guillermo y María son amigos');
    console.log('👤 Juan no tiene amigos (como se solicitó)');
    
  } catch (error) {
    console.error('❌ Error sembrando amistades:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedFriends()
    .then(() => {
      console.log('🎉 Seed de amistades completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en seed de amistades:', error);
      process.exit(1);
    });
}

module.exports = { seedFriends };
