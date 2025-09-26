const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurar multer para subir archivos
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Subir selfie al muro
router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Imagen requerida' });
    }

    // Subir imagen a Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'ggym/posts',
          transformation: [
            { width: 500, height: 500, crop: 'fill', gravity: 'face' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Crear post en la base de datos
    const post = await prisma.post.create({
      data: {
        userId: req.user.id,
        imageUrl: result.secure_url
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        likes: {
          select: {
            id: true,
            userId: true
          }
        }
      }
    });

    // Registrar asistencia al gym
    await prisma.gymAttendance.create({
      data: {
        userId: req.user.id,
        postId: post.id
      }
    });

    res.status(201).json({
      message: 'Selfie subida exitosamente',
      post
    });

  } catch (error) {
    console.error('Error subiendo selfie:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener muro de amigos
router.get('/feed', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Obtener IDs de amigos
    const friendships = await prisma.friend.findMany({
      where: {
        OR: [
          { userId: req.user.id, status: 'accepted' },
          { friendId: req.user.id, status: 'accepted' }
        ]
      }
    });

    const friendIds = friendships.map(friendship => 
      friendship.userId === req.user.id ? friendship.friendId : friendship.userId
    );

    // Incluir también los posts del usuario actual
    friendIds.push(req.user.id);

    const posts = await prisma.post.findMany({
      where: {
        userId: { in: friendIds }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        likes: {
          select: {
            id: true,
            userId: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    res.json({ posts });

  } catch (error) {
    console.error('Error obteniendo feed:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Dar like a un post
router.post('/:postId/like', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;

    // Verificar si el post existe
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Verificar si ya le dio like
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: req.user.id,
          postId: postId
        }
      }
    });

    if (existingLike) {
      return res.status(400).json({ message: 'Ya le diste like a este post' });
    }

    // Crear like
    await prisma.like.create({
      data: {
        userId: req.user.id,
        postId: postId
      }
    });

    // Actualizar contador de likes
    await prisma.post.update({
      where: { id: postId },
      data: {
        likesCount: { increment: 1 }
      }
    });

    res.json({ message: 'Like agregado exitosamente' });

  } catch (error) {
    console.error('Error dando like:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Quitar like de un post
router.delete('/:postId/like', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;

    // Verificar si el like existe
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: req.user.id,
          postId: postId
        }
      }
    });

    if (!existingLike) {
      return res.status(400).json({ message: 'No le diste like a este post' });
    }

    // Eliminar like
    await prisma.like.delete({
      where: { id: existingLike.id }
    });

    // Actualizar contador de likes
    await prisma.post.update({
      where: { id: postId },
      data: {
        likesCount: { decrement: 1 }
      }
    });

    res.json({ message: 'Like eliminado exitosamente' });

  } catch (error) {
    console.error('Error quitando like:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener estadísticas de asistencia semanal
router.get('/attendance/weekly', authenticateToken, async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const attendance = await prisma.gymAttendance.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: startOfWeek,
          lte: endOfWeek
        }
      },
      orderBy: { date: 'asc' }
    });

    res.json({
      weeklyCount: attendance.length,
      attendance: attendance.map(a => ({
        date: a.date,
        day: a.date.toLocaleDateString('es-ES', { weekday: 'long' })
      }))
    });

  } catch (error) {
    console.error('Error obteniendo asistencia:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
