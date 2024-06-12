const { Router } = require('express');
const Card = require('../models/card');
const Course = require('../models/products');
const router = Router();

// Add course to cart
router.post('/add', async (req, res) => {
  try {
    const course = await Course.findById(req.body.id);
    await Card.add(course);
    res.redirect('/card');
  } catch (error) {
    console.error('Error adding course to card:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Remove course from cart
router.delete('/remove/:id', async (req, res) => {
  try {
    const card = await Card.remove(req.params.id);
    res.status(200).json(card);
  } catch (error) {
    console.error('Error removing course from card:', error);
    res.status(500).json({ error: 'Failed to remove course from card' });
  }
});

// Render cart page
router.get('/', async (req, res) => {
  try {
    const card = await Card.fetch();
    let totalPrice = 0;

    if (card && card.courses.length > 0) {
      totalPrice = card.courses.reduce((acc, course) => acc + course.price, 0);
    }

    res.render('card', {
      title: 'Корзина',
      isCard: true,
      courses: card ? card.courses : [],
      totalPrice: totalPrice
    });
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
