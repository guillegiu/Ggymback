const prisma = require('../config/database');

const exercises = [
  // PECHO
  {
    name: "Press de banca",
    description: "Ejercicio fundamental para el desarrollo del pecho, hombros y tríceps",
    category: "Pecho",
    youtubeUrl: "https://www.youtube.com/watch?v=4Y2EjHC8e1I"
  },
  {
    name: "Press inclinado con mancuernas",
    description: "Variación del press de banca que enfatiza la parte superior del pecho",
    category: "Pecho",
    youtubeUrl: "https://www.youtube.com/watch?v=8iPEnov-lmU"
  },
  {
    name: "Flexiones",
    description: "Ejercicio de peso corporal para fortalecer pecho, hombros y tríceps",
    category: "Pecho",
    youtubeUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4"
  },
  {
    name: "Aperturas con mancuernas",
    description: "Ejercicio de aislamiento para el pecho que mejora la definición",
    category: "Pecho",
    youtubeUrl: "https://www.youtube.com/watch?v=Z57kTJhW0N8"
  },

  // ESPALDA
  {
    name: "Dominadas",
    description: "Ejercicio fundamental para el desarrollo de la espalda y bíceps",
    category: "Espalda",
    youtubeUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g"
  },
  {
    name: "Remo con barra",
    description: "Ejercicio compuesto para el desarrollo de la espalda",
    category: "Espalda",
    youtubeUrl: "https://www.youtube.com/watch?v=PAVfL6yJjqE"
  },
  {
    name: "Jalón al pecho",
    description: "Ejercicio de máquina para el desarrollo de la espalda",
    category: "Espalda",
    youtubeUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc"
  },
  {
    name: "Peso muerto",
    description: "Ejercicio fundamental que trabaja toda la cadena posterior",
    category: "Espalda",
    youtubeUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q"
  },

  // HOMBROS
  {
    name: "Press militar",
    description: "Ejercicio fundamental para el desarrollo de los hombros",
    category: "Hombros",
    youtubeUrl: "https://www.youtube.com/watch?v=0JfYxMRsUCQ"
  },
  {
    name: "Elevaciones laterales",
    description: "Ejercicio de aislamiento para los deltoides laterales",
    category: "Hombros",
    youtubeUrl: "https://www.youtube.com/watch?v=3VcKXNN1lVw"
  },
  {
    name: "Elevaciones frontales",
    description: "Ejercicio para el desarrollo de los deltoides anteriores",
    category: "Hombros",
    youtubeUrl: "https://www.youtube.com/watch?v=Yp3Zw5XHcW4"
  },

  // PIERNAS
  {
    name: "Sentadillas",
    description: "Ejercicio fundamental para el desarrollo de las piernas",
    category: "Piernas",
    youtubeUrl: "https://www.youtube.com/watch?v=YaXPRqUwItQ"
  },
  {
    name: "Peso muerto rumano",
    description: "Ejercicio para el desarrollo de los isquiotibiales y glúteos",
    category: "Piernas",
    youtubeUrl: "https://www.youtube.com/watch?v=1ED09ZV5wvU"
  },
  {
    name: "Zancadas",
    description: "Ejercicio unilateral para el desarrollo de las piernas",
    category: "Piernas",
    youtubeUrl: "https://www.youtube.com/watch?v=QOVaHwm-Q6U"
  },
  {
    name: "Prensa de piernas",
    description: "Ejercicio de máquina para el desarrollo de las piernas",
    category: "Piernas",
    youtubeUrl: "https://www.youtube.com/watch?v=IZxyjW7MPJQ"
  },

  // BÍCEPS
  {
    name: "Curl de bíceps con barra",
    description: "Ejercicio fundamental para el desarrollo de los bíceps",
    category: "Bíceps",
    youtubeUrl: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo"
  },
  {
    name: "Curl de bíceps con mancuernas",
    description: "Variación del curl de bíceps con mayor rango de movimiento",
    category: "Bíceps",
    youtubeUrl: "https://www.youtube.com/watch?v=TwD-YGVP4Bk"
  },
  {
    name: "Curl martillo",
    description: "Ejercicio que trabaja bíceps y antebrazos",
    category: "Bíceps",
    youtubeUrl: "https://www.youtube.com/watch?v=zC3nLlEvin4"
  },

  // TRÍCEPS
  {
    name: "Fondos en paralelas",
    description: "Ejercicio de peso corporal para el desarrollo de los tríceps",
    category: "Tríceps",
    youtubeUrl: "https://www.youtube.com/watch?v=2JD8uD0XJp4"
  },
  {
    name: "Press francés",
    description: "Ejercicio de aislamiento para los tríceps",
    category: "Tríceps",
    youtubeUrl: "https://www.youtube.com/watch?v=_gsUck-7M74"
  },
  {
    name: "Extensión de tríceps con mancuerna",
    description: "Ejercicio unilateral para el desarrollo de los tríceps",
    category: "Tríceps",
    youtubeUrl: "https://www.youtube.com/watch?v=6SS6K3lAwZ8"
  },

  // CORE
  {
    name: "Plancha",
    description: "Ejercicio isométrico para el fortalecimiento del core",
    category: "Core",
    youtubeUrl: "https://www.youtube.com/watch?v=pSHjTRCQxIw"
  },
  {
    name: "Crunches",
    description: "Ejercicio clásico para el desarrollo de los abdominales",
    category: "Core",
    youtubeUrl: "https://www.youtube.com/watch?v=Xyd_fa5zoEU"
  },
  {
    name: "Mountain climbers",
    description: "Ejercicio dinámico para el core y cardio",
    category: "Core",
    youtubeUrl: "https://www.youtube.com/watch?v=nmwgDgXJZb8"
  },
  {
    name: "Russian twists",
    description: "Ejercicio para el desarrollo de los oblicuos",
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
        update: exercise,
        create: exercise
      });
    }
    
    console.log('✅ Ejercicios sembrados exitosamente');
  } catch (error) {
    console.error('❌ Error sembrando ejercicios:', error);
  }
}

module.exports = { seedExercises };
