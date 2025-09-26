const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Obtener rutinas del usuario
router.get('/', authenticateToken, async (req, res) => {
  try {
    const routines = await prisma.routine.findMany({
      where: { userId: req.user.id },
      include: {
        routineExercises: {
          include: {
            exercise: true
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { type: 'asc' }
    });

    res.json({ routines });

  } catch (error) {
    console.error('Error obteniendo rutinas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Crear nueva rutina
router.post('/', authenticateToken, [
  body('name').trim().isLength({ min: 1 }),
  body('type').isIn(['A', 'B', 'C', 'custom']),
  body('exercises').isArray({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, type, exercises } = req.body;

    // Verificar si ya existe una rutina del mismo tipo
    if (type !== 'custom') {
      const existingRoutine = await prisma.routine.findFirst({
        where: {
          userId: req.user.id,
          type: type
        }
      });

      if (existingRoutine) {
        return res.status(400).json({ 
          message: `Ya tienes una rutina tipo ${type}` 
        });
      }
    }

    // Crear rutina
    const routine = await prisma.routine.create({
      data: {
        userId: req.user.id,
        name,
        type
      }
    });

    // Crear ejercicios de la rutina
    const routineExercises = await Promise.all(
      exercises.map((exercise, index) => 
        prisma.routineExercise.create({
          data: {
            routineId: routine.id,
            exerciseId: exercise.exerciseId,
            order: index + 1,
            sets: exercise.sets || null,
            reps: exercise.reps || null,
            weight: exercise.weight || null
          },
          include: {
            exercise: true
          }
        })
      )
    );

    const createdRoutine = await prisma.routine.findUnique({
      where: { id: routine.id },
      include: {
        routineExercises: {
          include: {
            exercise: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    res.status(201).json({
      message: 'Rutina creada exitosamente',
      routine: createdRoutine
    });

  } catch (error) {
    console.error('Error creando rutina:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Actualizar rutina
router.put('/:routineId', authenticateToken, [
  body('name').optional().trim().isLength({ min: 1 }),
  body('exercises').optional().isArray({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { routineId } = req.params;
    const { name, exercises } = req.body;

    // Verificar que la rutina pertenece al usuario
    const routine = await prisma.routine.findFirst({
      where: {
        id: routineId,
        userId: req.user.id
      }
    });

    if (!routine) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }

    // Actualizar datos básicos de la rutina
    const updateData = {};
    if (name) updateData.name = name;

    if (Object.keys(updateData).length > 0) {
      await prisma.routine.update({
        where: { id: routineId },
        data: updateData
      });
    }

    // Si se proporcionan ejercicios, actualizar la lista
    if (exercises) {
      // Eliminar ejercicios existentes
      await prisma.routineExercise.deleteMany({
        where: { routineId: routineId }
      });

      // Crear nuevos ejercicios
      await Promise.all(
        exercises.map((exercise, index) => 
          prisma.routineExercise.create({
            data: {
              routineId: routineId,
              exerciseId: exercise.exerciseId,
              order: index + 1,
              sets: exercise.sets || null,
              reps: exercise.reps || null,
              weight: exercise.weight || null
            }
          })
        )
      );
    }

    // Obtener rutina actualizada
    const updatedRoutine = await prisma.routine.findUnique({
      where: { id: routineId },
      include: {
        routineExercises: {
          include: {
            exercise: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    res.json({
      message: 'Rutina actualizada exitosamente',
      routine: updatedRoutine
    });

  } catch (error) {
    console.error('Error actualizando rutina:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Eliminar rutina
router.delete('/:routineId', authenticateToken, async (req, res) => {
  try {
    const { routineId } = req.params;

    // Verificar que la rutina pertenece al usuario
    const routine = await prisma.routine.findFirst({
      where: {
        id: routineId,
        userId: req.user.id
      }
    });

    if (!routine) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }

    // Eliminar rutina (los ejercicios se eliminan en cascada)
    await prisma.routine.delete({
      where: { id: routineId }
    });

    res.json({ message: 'Rutina eliminada exitosamente' });

  } catch (error) {
    console.error('Error eliminando rutina:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener rutina específica
router.get('/:routineId', authenticateToken, async (req, res) => {
  try {
    const { routineId } = req.params;

    const routine = await prisma.routine.findFirst({
      where: {
        id: routineId,
        userId: req.user.id
      },
      include: {
        routineExercises: {
          include: {
            exercise: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!routine) {
      return res.status(404).json({ message: 'Rutina no encontrada' });
    }

    res.json({ routine });

  } catch (error) {
    console.error('Error obteniendo rutina:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
