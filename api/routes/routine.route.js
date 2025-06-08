import express from 'express';
import {
  createRoutine,
  getRoutines,
  getUserRoutines,
  getUserActiveRoutines,
  assignUsers,
  removeUsers,
  deleteRoutine,
  updateRoutine
} from '../controllers/routine.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Rutas para rutinas
router.post('/', verifyToken, createRoutine);
router.get('/', verifyToken, getRoutines);
router.get('/user/:userId', verifyToken, getUserRoutines);
router.get('/user/:userId/active', verifyToken, getUserActiveRoutines);
router.post('/:id/assign', verifyToken, assignUsers);
router.post('/:id/remove', verifyToken, removeUsers);
router.delete('/:id', verifyToken, deleteRoutine);
router.put('/:id', verifyToken, updateRoutine);

export default router; 