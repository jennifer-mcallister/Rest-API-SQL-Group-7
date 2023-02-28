const express = require('express')
const router = express.Router()
const { isAuthenticated } = require('../middleware/authenticationMiddleware')
const { getAllWalkingtrails, getWalkingtrailById, createNewWalkingtrail, deleteWalkingtrailById } = require('../controllers/walkingtrailController')
const { createNewReview } = require('../controllers/reviewController')

router.get('/', isAuthenticated, getAllWalkingtrails)
router.get('/:listId', isAuthenticated, getWalkingtrailById)

router.post('/', isAuthenticated, createNewWalkingtrail)
router.post('/:listId/todos', isAuthenticated, createNewReview)

router.delete('/:listId', isAuthenticated, deleteWalkingtrailById)

module.exports = router
