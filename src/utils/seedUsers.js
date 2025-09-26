const prisma = require('../config/database');
const bcrypt = require('bcryptjs');

const users = [
  {
    name: "Guillermo Torres",
    email: "guillermo@test.com",
    password: "123456",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "María García",
    email: "maria@test.com", 
    password: "123456",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Juan Pérez",
    email: "juan@test.com",
    password: "123456", 
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  }
];

async function seedUsers() {
  try {
    console.log('🌱 Sembrando usuarios de prueba...');
    
    for (const userData of users) {
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          ...userData,
          password: hashedPassword
        },
        create: {
          ...userData,
          password: hashedPassword
        }
      });
    }
    
    console.log('✅ Usuarios sembrados exitosamente');
    console.log('📧 Emails de prueba:');
    users.forEach(user => {
      console.log(`   - ${user.email} (contraseña: ${user.password})`);
    });
  } catch (error) {
    console.error('❌ Error sembrando usuarios:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log('🎉 Seed de usuarios completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en seed de usuarios:', error);
      process.exit(1);
    });
}

module.exports = { seedUsers };
