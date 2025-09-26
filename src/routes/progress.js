const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Agregar progreso del usuario
router.post('/', authenticateToken, [
  body('weight').optional().isFloat({ min: 0 }),
  body('chest').optional().isFloat({ min: 0 }),
  body('waist').optional().isFloat({ min: 0 }),
  body('biceps').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { weight, chest, waist, biceps } = req.body;

    // Verificar que al menos un campo esté presente
    if (!weight && !chest && !waist && !biceps) {
      return res.status(400).json({ 
        message: 'Al menos un campo de progreso es requerido' 
      });
    }

    const progress = await prisma.userProgress.create({
      data: {
        userId: req.user.id,
        weight: weight || null,
        chest: chest || null,
        waist: waist || null,
        biceps: biceps || null
      }
    });

    res.status(201).json({
      message: 'Progreso guardado exitosamente',
      progress
    });

  } catch (error) {
    console.error('Error guardando progreso:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener historial de progreso
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { limit = 30 } = req.query;

    const progress = await prisma.userProgress.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' },
      take: parseInt(limit)
    });

    res.json({ progress });

  } catch (error) {
    console.error('Error obteniendo progreso:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener progreso actual (más reciente)
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const currentProgress = await prisma.userProgress.findFirst({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' }
    });

    res.json({ progress: currentProgress });

  } catch (error) {
    console.error('Error obteniendo progreso actual:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener estadísticas de progreso
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { period = '30' } = req.query; // días
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    const progress = await prisma.userProgress.findMany({
      where: {
        userId: req.user.id,
        date: { gte: daysAgo }
      },
      orderBy: { date: 'asc' }
    });

    // Calcular estadísticas básicas
    const stats = {
      weight: {
        current: progress[progress.length - 1]?.weight || null,
        change: progress.length > 1 ? 
          (progress[progress.length - 1]?.weight || 0) - (progress[0]?.weight || 0) : 0,
        data: progress.map(p => ({ date: p.date, value: p.weight })).filter(p => p.value)
      },
      chest: {
        current: progress[progress.length - 1]?.chest || null,
        change: progress.length > 1 ? 
          (progress[progress.length - 1]?.chest || 0) - (progress[0]?.chest || 0) : 0,
        data: progress.map(p => ({ date: p.date, value: p.chest })).filter(p => p.value)
      },
      waist: {
        current: progress[progress.length - 1]?.waist || null,
        change: progress.length > 1 ? 
          (progress[progress.length - 1]?.waist || 0) - (progress[0]?.waist || 0) : 0,
        data: progress.map(p => ({ date: p.date, value: p.waist })).filter(p => p.value)
      },
      biceps: {
        current: progress[progress.length - 1]?.biceps || null,
        change: progress.length > 1 ? 
          (progress[progress.length - 1]?.biceps || 0) - (progress[0]?.biceps || 0) : 0,
        data: progress.map(p => ({ date: p.date, value: p.biceps })).filter(p => p.value)
      }
    };

    res.json({ stats });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Eliminar entrada de progreso
router.delete('/:progressId', authenticateToken, async (req, res) => {
  try {
    const { progressId } = req.params;

    const progress = await prisma.userProgress.findFirst({
      where: {
        id: progressId,
        userId: req.user.id
      }
    });

    if (!progress) {
      return res.status(404).json({ message: 'Entrada de progreso no encontrada' });
    }

    await prisma.userProgress.delete({
      where: { id: progressId }
    });

    res.json({ message: 'Entrada de progreso eliminada exitosamente' });

  } catch (error) {
    console.error('Error eliminando progreso:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
