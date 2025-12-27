const express = require('express');
const router = express.Router();
const {
  getPopulation,
  getPerson,
  createPerson,
  updatePerson,
  markAsDeceased,
  markAsMovedOut,
  deletePerson
} = require('../controllers/populationController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, getPopulation);
router.get('/:id', auth, getPerson);
router.post('/', auth, authorize('admin', 'team_leader', 'deputy_leader', 'staff'), createPerson);
router.put('/:id', auth, authorize('admin', 'team_leader', 'deputy_leader', 'staff'), updatePerson);
router.post('/:id/death', auth, authorize('admin', 'team_leader', 'deputy_leader'), markAsDeceased);
router.post('/:id/moveout', auth, authorize('admin', 'team_leader', 'deputy_leader'), markAsMovedOut);
router.delete('/:id', auth, authorize('admin', 'team_leader'), deletePerson);

module.exports = router;
