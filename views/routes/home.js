const {Router} = require('express');
const Course = require('../models/products');
const router = Router()

router.get('/', async (req, res) => {
    try {
      const courses = await Course.find();
      res.render('index', {
        title: 'главная страница',
        isHome: true,
        courses
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router