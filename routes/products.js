const { Router } = require('express');
const Course = require('../models/products');
const router = Router();

// GET /courses - отображение списка курсов
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.render('courses', {
      title: 'Курсы',
      isCourses: true,
      courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Search route
// Search route
router.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const category = req.query.category; // Добавляем получение категории из запроса
    if (!searchTerm || typeof searchTerm !== 'string') {
      throw new Error('Invalid search term');
    }
    let query = {
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    };
    // Если указана категория, добавляем ее в поиск
    if (category) {
      query.category = category;
    }
    const courses = await Course.find(query);
    res.render('search', {
      title: '',
      isCourses: true,
      courses
    });
  } catch (error) {
    console.error('Error searching courses:', error);
    res.status(500).send('Internal Server Error');
  }
});



// GET /courses/:id/edit - страница редактирования курса
router.get('/:id/edit', async (req, res) => {
  try {
    if (!req.query.allow) {
      return res.redirect('/');
    }
    const course = await Course.findById(req.params.id);
    res.render('course-edit', {
      title: `Редактировать ${course.title}`,
      course
    });
  } catch (error) {
    console.error('Error fetching course for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST /courses/edit - обновление курса
router.post('/edit', async (req, res) => {
  try {
    const { id } = req.body;
    delete req.body.id;
    await Course.findByIdAndUpdate(id, req.body);
    res.redirect('/courses');
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET /courses/:id - отображение информации о курсе
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render('course', {
      layout: 'empty',
      title: `Курс ${course.title}`,
      course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
