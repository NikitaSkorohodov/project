const { Router } = require('express');
const Card = require('../models/card');
const Course = require('../models/products');
const router = Router();

// Добавление курса в корзину
router.post('/add', async (req, res) => {
  try {
    const course = await Course.findById(req.body.id);
    await Card.add(course); // Сохраняем курс в корзину
    res.redirect('/card');
  } catch (error) {
    console.error('Error adding course to card:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Удаление курса из корзины
router.delete('/remove/:id', async (req, res) => {
  try {
    const card = await Card.remove(req.params.id); 
    res.status(200).json(card);
  } catch (error) {
    console.error('Error removing course from card:', error);
    res.status(500).json({ error: 'Failed to remove course from card' });
  }
});

router.get('/', async (req, res) => {
  try {
    const card = await Card.fetch(); // Получаем данные корзины из базы данных
    let totalPrice = 0; // Initialize totalPrice variable

    // Calculate total price if card exists
    if (card && card.courses.length > 0) {
      totalPrice = card.courses.reduce((acc, course) => acc + course.price, 0);
    }

    res.render('card', {
      title: 'Корзина',
      isCard: true,
      courses: card ? card.courses : [], // Добавляем проверку на существование корзины
      totalPrice: totalPrice // Pass the total price to the template
    });
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;

