const express = require('express');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Enviar solicitud de amistad
router.post('/request', authenticateToken, async (req, res) => {
  try {
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({ message: 'ID de amigo requerido' });
    }

    if (friendId === req.user.id) {
      return res.status(400).json({ message: 'No puedes agregarte a ti mismo' });
    }

    // Verificar si ya existe una relación
    const existingRelation = await prisma.friend.findFirst({
      where: {
        OR: [
          { userId: req.user.id, friendId },
          { userId: friendId, friendId: req.user.id }
        ]
      }
    });

    if (existingRelation) {
      return res.status(400).json({ message: 'Ya existe una relación entre estos usuarios' });
    }

    // Crear solicitud de amistad
    const friendRequest = await prisma.friend.create({
      data: {
        userId: req.user.id,
        friendId,
        status: 'pending'
      },
      include: {
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Solicitud de amistad enviada',
      friendRequest
    });

  } catch (error) {
    console.error('Error enviando solicitud:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Aceptar solicitud de amistad
router.put('/accept/:requestId', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;

    const friendRequest = await prisma.friend.findUnique({
      where: { id: requestId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    if (!friendRequest) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    if (friendRequest.friendId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permisos para aceptar esta solicitud' });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Esta solicitud ya fue procesada' });
    }

    // Actualizar estado a aceptado
    const updatedRequest = await prisma.friend.update({
      where: { id: requestId },
      data: { status: 'accepted' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    res.json({
      message: 'Solicitud de amistad aceptada',
      friend: updatedRequest.user
    });

  } catch (error) {
    console.error('Error aceptando solicitud:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Rechazar solicitud de amistad
router.delete('/reject/:requestId', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;

    const friendRequest = await prisma.friend.findUnique({
      where: { id: requestId }
    });

    if (!friendRequest) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    if (friendRequest.friendId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permisos para rechazar esta solicitud' });
    }

    await prisma.friend.delete({
      where: { id: requestId }
    });

    res.json({ message: 'Solicitud de amistad rechazada' });

  } catch (error) {
    console.error('Error rechazando solicitud:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener lista de amigos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const friends = await prisma.friend.findMany({
      where: {
        OR: [
          { userId: req.user.id, status: 'accepted' },
          { friendId: req.user.id, status: 'accepted' }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    // Formatear la respuesta para mostrar solo la información del amigo
    const formattedFriends = friends.map(friend => ({
      id: friend.userId === req.user.id ? friend.friend.id : friend.user.id,
      name: friend.userId === req.user.id ? friend.friend.name : friend.user.name,
      email: friend.userId === req.user.id ? friend.friend.email : friend.user.email,
      avatar: friend.userId === req.user.id ? friend.friend.avatar : friend.user.avatar
    }));

    res.json({ friends: formattedFriends });

  } catch (error) {
    console.error('Error obteniendo amigos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener solicitudes pendientes
router.get('/requests', authenticateToken, async (req, res) => {
  try {
    const requests = await prisma.friend.findMany({
      where: {
        friendId: req.user.id,
        status: 'pending'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ requests });

  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Eliminar amigo
router.delete('/:friendId', authenticateToken, async (req, res) => {
  try {
    const { friendId } = req.params;

    const friendship = await prisma.friend.findFirst({
      where: {
        OR: [
          { userId: req.user.id, friendId },
          { userId: friendId, friendId: req.user.id }
        ],
        status: 'accepted'
      }
    });

    if (!friendship) {
      return res.status(404).json({ message: 'Amistad no encontrada' });
    }

    await prisma.friend.delete({
      where: { id: friendship.id }
    });

    res.json({ message: 'Amigo eliminado exitosamente' });

  } catch (error) {
    console.error('Error eliminando amigo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
