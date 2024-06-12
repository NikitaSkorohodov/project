const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  courses: [
    {
      title: String,
      price: Number,
      img: String
    }
  ],
  totalPrice: {
    type: Number,
    default: 0
  }
});

cardSchema.statics.fetch = async function() {
  return this.findOne();
};

cardSchema.statics.add = async function(course) {
  let card = await this.findOne();
  if (!card) {
    card = new this();
  }
  card.courses.push(course);
  card.totalPrice += course.price;
  await card.save();
  return card;
};

cardSchema.statics.remove = async function(courseId) {
  let card = await this.findOne();
  if (!card) {
    throw new Error("Card not found");
  }
  const index = card.courses.findIndex(course => course._id.toString() === courseId);
  if (index === -1) {
    throw new Error("Course not found in card");
  }
  const removedCourse = card.courses.splice(index, 1)[0];
  card.totalPrice -= removedCourse.price;
  await card.save();
  return card;
};

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;