const prisma = require('../config/database');

const exercises = [
  // PECHO - Ejercicios realistas y populares
  {
    name: "Press de banca",
    description: "Ejercicio fundamental para el desarrollo del pecho, hombros y tríceps. Acuéstate en un banco plano y baja la barra hasta el pecho, luego empuja hacia arriba.",
    category: "Pecho",
    youtubeUrl: "https://www.youtube.com/watch?v=4Y2EjHC8e1I"
  },
  {
    name: "Press inclinado con mancuernas",
    description: "Variación del press de banca que enfatiza la parte superior del pecho. Usa un banco inclinado a 30-45 grados.",
    category: "Pecho",
    youtubeUrl: "https://www.youtube.com/watch?v=8iPEnov-lmU"
  },
  {
    name: "Flexiones",
    description: "Ejercicio de peso corporal para fortalecer pecho, hombros y tríceps. Perfecto para principiantes y avanzados.",
    category: "Pecho",
    youtubeUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4"
  },
  {
    name: "Aperturas con mancuernas",
    description: "Ejercicio de aislamiento para el pecho que mejora la definición y el estiramiento muscular.",
    category: "Pecho",
    youtubeUrl: "https://www.youtube.com/watch?v=Z57kTJhW0N8"
  },

  // ESPALDA - Ejercicios completos
  {
    name: "Dominadas",
    description: "Ejercicio fundamental para el desarrollo de la espalda y bíceps. Cuelga de una barra y eleva tu cuerpo hasta que el mentón pase la barra.",
    category: "Espalda",
    youtubeUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g"
  },
  {
    name: "Remo con barra",
    description: "Ejercicio compuesto para el desarrollo de la espalda. Inclínate hacia adelante y tira la barra hacia tu abdomen.",
    category: "Espalda",
    youtubeUrl: "https://www.youtube.com/watch?v=PAVfL6yJjqE"
  },
  {
    name: "Jalón al pecho",
    description: "Ejercicio de máquina para el desarrollo de la espalda. Tira la barra hacia tu pecho manteniendo la espalda recta.",
    category: "Espalda",
    youtubeUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc"
  },
  {
    name: "Peso muerto",
    description: "Ejercicio fundamental que trabaja toda la cadena posterior. Levanta la barra desde el suelo manteniendo la espalda recta.",
    category: "Espalda",
    youtubeUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q"
  },

  // PIERNAS - Ejercicios esenciales
  {
    name: "Sentadillas",
    description: "El rey de los ejercicios para piernas. Baja hasta que los muslos estén paralelos al suelo y vuelve a subir.",
    category: "Piernas",
    youtubeUrl: "https://www.youtube.com/watch?v=YaXPRqUwItQ"
  },
  {
    name: "Prensa de piernas",
    description: "Ejercicio de máquina para fortalecer cuádriceps, glúteos y femorales de forma segura.",
    category: "Piernas",
    youtubeUrl: "https://www.youtube.com/watch?v=IZxyjW7MPJQ"
  },
  {
    name: "Zancadas",
    description: "Ejercicio unilateral que mejora el equilibrio y fortalece cada pierna individualmente.",
    category: "Piernas",
    youtubeUrl: "https://www.youtube.com/watch?v=QOVaHwm-Q6U"
  },
  {
    name: "Elevaciones de talón",
    description: "Ejercicio específico para fortalecer los músculos de la pantorrilla.",
    category: "Piernas",
    youtubeUrl: "https://www.youtube.com/watch?v=YyvSfVjQeL0"
  },

  // HOMBROS - Ejercicios completos
  {
    name: "Press militar",
    description: "Ejercicio fundamental para hombros. Levanta la barra desde el pecho hasta arriba de la cabeza.",
    category: "Hombros",
    youtubeUrl: "https://www.youtube.com/watch?v=0JfYxMRsUCQ"
  },
  {
    name: "Elevaciones laterales",
    description: "Ejercicio de aislamiento para los deltoides laterales. Eleva las mancuernas hasta la altura de los hombros.",
    category: "Hombros",
    youtubeUrl: "https://www.youtube.com/watch?v=3VcKaXpzqRo"
  },
  {
    name: "Elevaciones frontales",
    description: "Ejercicio para los deltoides anteriores. Eleva las mancuernas hacia adelante hasta la altura de los hombros.",
    category: "Hombros",
    youtubeUrl: "https://www.youtube.com/watch?v=WJ4G8ZQ0eMI"
  },

  // BÍCEPS Y TRÍCEPS
  {
    name: "Curl de bíceps",
    description: "Ejercicio clásico para bíceps. Flexiona los brazos llevando las mancuernas hacia los hombros.",
    category: "Brazos",
    youtubeUrl: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo"
  },
  {
    name: "Curl martillo",
    description: "Variación del curl que trabaja bíceps y antebrazos. Mantén las palmas enfrentadas durante todo el movimiento.",
    category: "Brazos",
    youtubeUrl: "https://www.youtube.com/watch?v=zC3nLlEvin4"
  },
  {
    name: "Extensiones de tríceps",
    description: "Ejercicio efectivo para tríceps. Extiende los brazos por encima de la cabeza con una mancuerna.",
    category: "Brazos",
    youtubeUrl: "https://www.youtube.com/watch?v=Wz4YUr3UxRk"
  },
  {
    name: "Fondos en paralelas",
    description: "Ejercicio de peso corporal para tríceps y pecho. Baja el cuerpo entre las barras paralelas.",
    category: "Brazos",
    youtubeUrl: "https://www.youtube.com/watch?v=2g8EkFb8Jho"
  },

  // CORE Y ABDOMINALES
  {
    name: "Plancha",
    description: "Ejercicio isométrico que fortalece todo el core. Mantén la posición de flexión sin moverse.",
    category: "Core",
    youtubeUrl: "https://www.youtube.com/watch?v=pSHjTRCQxIw"
  },
  {
    name: "Crunches",
    description: "Ejercicio clásico para abdominales. Levanta los hombros del suelo contrayendo el abdomen.",
    category: "Core",
    youtubeUrl: "https://www.youtube.com/watch?v=Xyd_faZzoIE"
  },
  {
    name: "Mountain climbers",
    description: "Ejercicio dinámico que combina cardio y core. Alterna las rodillas hacia el pecho en posición de plancha.",
    category: "Core",
    youtubeUrl: "https://www.youtube.com/watch?v=nmwgirgXLYM"
  },
  {
    name: "Russian twists",
    description: "Ejercicio para oblicuos. Siéntate y rota el torso de lado a lado con las piernas elevadas.",
    category: "Core",
    youtubeUrl: "https://www.youtube.com/watch?v=wkD8rjkodUI"
  }
];

async function seedExercises() {
  try {
    console.log('🌱 Sembrando ejercicios...');

    for (const exercise of exercises) {
      await prisma.exercise.upsert({
        where: { name: exercise.name },
        update: {
          ...exercise
        },
        create: {
          ...exercise
        }
      });
    }

    console.log('✅ Ejercicios sembrados exitosamente');
    console.log(`📊 Total de ejercicios: ${exercises.length}`);
    console.log('🏋️ Categorías incluidas: Pecho, Espalda, Piernas, Hombros, Brazos, Core');
  } catch (error) {
    console.error('❌ Error sembrando ejercicios:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedExercises()
    .then(() => {
      console.log('🎉 Seed de ejercicios completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en seed de ejercicios:', error);
      process.exit(1);
    });
}

module.exports = { seedExercises };