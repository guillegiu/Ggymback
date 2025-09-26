const prisma = require('../config/database');

async function seedRoutines() {
  try {
    console.log('🌱 Sembrando rutinas...');
    
    // Obtener los usuarios
    const guillermo = await prisma.user.findUnique({
      where: { email: 'guillermo@test.com' }
    });
    
    const maria = await prisma.user.findUnique({
      where: { email: 'maria@test.com' }
    });

    if (!guillermo || !maria) {
      throw new Error('Usuarios no encontrados');
    }

    // Obtener algunos ejercicios
    const exercises = await prisma.exercise.findMany();
    
    if (exercises.length === 0) {
      throw new Error('No hay ejercicios disponibles');
    }

    // Crear rutinas para Guillermo
    const guillermoRoutines = [
      {
        name: "Rutina A - Push",
        type: "A",
        userId: guillermo.id,
        exercises: [
          { name: "Press de banca", sets: 4, reps: 8, weight: 80 },
          { name: "Press inclinado con mancuernas", sets: 3, reps: 10, weight: 30 },
          { name: "Flexiones", sets: 3, reps: 15, weight: null },
          { name: "Press militar", sets: 3, reps: 8, weight: 50 },
          { name: "Elevaciones laterales", sets: 3, reps: 12, weight: 15 },
          { name: "Extensiones de tríceps", sets: 3, reps: 12, weight: 20 }
        ]
      },
      {
        name: "Rutina B - Pull",
        type: "B", 
        userId: guillermo.id,
        exercises: [
          { name: "Dominadas", sets: 4, reps: 6, weight: null },
          { name: "Remo con barra", sets: 4, reps: 8, weight: 60 },
          { name: "Jalón al pecho", sets: 3, reps: 10, weight: 45 },
          { name: "Peso muerto", sets: 4, reps: 5, weight: 100 },
          { name: "Curl de bíceps", sets: 3, reps: 12, weight: 20 },
          { name: "Curl martillo", sets: 3, reps: 12, weight: 18 }
        ]
      },
      {
        name: "Rutina C - Legs & Core",
        type: "C",
        userId: guillermo.id,
        exercises: [
          { name: "Sentadillas", sets: 4, reps: 12, weight: 70 },
          { name: "Prensa de piernas", sets: 3, reps: 15, weight: 120 },
          { name: "Zancadas", sets: 3, reps: 12, weight: 25 },
          { name: "Elevaciones de talón", sets: 4, reps: 20, weight: 40 },
          { name: "Plancha", sets: 3, reps: 60, weight: null },
          { name: "Crunches", sets: 3, reps: 20, weight: null }
        ]
      }
    ];

    // Crear rutinas para María
    const mariaRoutines = [
      {
        name: "Rutina A - Upper Body",
        type: "A",
        userId: maria.id,
        exercises: [
          { name: "Press de banca", sets: 3, reps: 10, weight: 40 },
          { name: "Aperturas con mancuernas", sets: 3, reps: 12, weight: 12 },
          { name: "Flexiones", sets: 3, reps: 10, weight: null },
          { name: "Elevaciones laterales", sets: 3, reps: 15, weight: 8 },
          { name: "Elevaciones frontales", sets: 3, reps: 15, weight: 8 },
          { name: "Curl de bíceps", sets: 3, reps: 15, weight: 12 }
        ]
      },
      {
        name: "Rutina B - Back & Core",
        type: "B",
        userId: maria.id,
        exercises: [
          { name: "Jalón al pecho", sets: 3, reps: 12, weight: 30 },
          { name: "Remo con barra", sets: 3, reps: 10, weight: 35 },
          { name: "Peso muerto", sets: 3, reps: 8, weight: 60 },
          { name: "Plancha", sets: 3, reps: 45, weight: null },
          { name: "Russian twists", sets: 3, reps: 20, weight: null },
          { name: "Mountain climbers", sets: 3, reps: 30, weight: null }
        ]
      },
      {
        name: "Rutina C - Lower Body",
        type: "C",
        userId: maria.id,
        exercises: [
          { name: "Sentadillas", sets: 4, reps: 15, weight: 40 },
          { name: "Prensa de piernas", sets: 3, reps: 20, weight: 80 },
          { name: "Zancadas", sets: 3, reps: 15, weight: 15 },
          { name: "Elevaciones de talón", sets: 3, reps: 25, weight: 25 },
          { name: "Crunches", sets: 3, reps: 25, weight: null },
          { name: "Plancha", sets: 2, reps: 60, weight: null }
        ]
      }
    ];

    // Función para crear rutina y sus ejercicios
    const createRoutineWithExercises = async (routineData) => {
      const routine = await prisma.routine.create({
        data: {
          name: routineData.name,
          type: routineData.type,
          userId: routineData.userId
        }
      });

      for (let i = 0; i < routineData.exercises.length; i++) {
        const exerciseData = routineData.exercises[i];
        const exercise = exercises.find(e => e.name === exerciseData.name);
        
        if (exercise) {
          await prisma.routineExercise.create({
            data: {
              routineId: routine.id,
              exerciseId: exercise.id,
              order: i + 1,
              sets: exerciseData.sets,
              reps: exerciseData.reps,
              weight: exerciseData.weight
            }
          });
        }
      }

      return routine;
    };

    // Crear rutinas para Guillermo
    console.log('💪 Creando rutinas para Guillermo...');
    for (const routineData of guillermoRoutines) {
      await createRoutineWithExercises(routineData);
    }

    // Crear rutinas para María
    console.log('💪 Creando rutinas para María...');
    for (const routineData of mariaRoutines) {
      await createRoutineWithExercises(routineData);
    }

    console.log('✅ Rutinas sembradas exitosamente');
    console.log('🏋️ Guillermo: 3 rutinas (A, B, C) con ejercicios realistas');
    console.log('🏋️ María: 3 rutinas (A, B, C) con ejercicios realistas');
    console.log('📊 Total de rutinas creadas: 6');
    
  } catch (error) {
    console.error('❌ Error sembrando rutinas:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedRoutines()
    .then(() => {
      console.log('🎉 Seed de rutinas completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en seed de rutinas:', error);
      process.exit(1);
    });
}

module.exports = { seedRoutines };
