const express = require('express');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los ejercicios
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, search } = req.query;
    
    const where = {};
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    res.json({ exercises });

  } catch (error) {
    console.error('Error obteniendo ejercicios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener ejercicio por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const exercise = await prisma.exercise.findUnique({
      where: { id }
    });

    if (!exercise) {
      return res.status(404).json({ message: 'Ejercicio no encontrado' });
    }

    res.json({ exercise });

  } catch (error) {
    console.error('Error obteniendo ejercicio:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener categorías de ejercicios
router.get('/categories/list', authenticateToken, async (req, res) => {
  try {
    const categories = await prisma.exercise.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' }
    });

    res.json({ 
      categories: categories.map(c => c.category) 
    });

  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Crear ejercicio personalizado
router.post('/custom', authenticateToken, async (req, res) => {
  try {
    const { name, description, imageUrl, youtubeUrl, category } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({ 
        message: 'Nombre, descripción y categoría son requeridos' 
      });
    }

    const exercise = await prisma.exercise.create({
      data: {
        name,
        description,
        imageUrl: imageUrl || null,
        youtubeUrl: youtubeUrl || null,
        category
      }
    });

    res.status(201).json({
      message: 'Ejercicio personalizado creado exitosamente',
      exercise
    });

  } catch (error) {
    console.error('Error creando ejercicio:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
