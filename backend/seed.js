const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config();

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Sample courses
    const courses = [
      {
        name: 'English & Personality Development',
        description: 'Improve your English communication skills and develop a strong personality. This course covers grammar, vocabulary, speaking, writing, and personality development techniques.'
      },
      {
        name: 'Basic Computer',
        description: 'Learn the fundamentals of computer usage, Microsoft Office, internet basics, and essential computer skills for everyday use.'
      },
      {
        name: 'AI Technology',
        description: 'Explore the world of Artificial Intelligence, machine learning, deep learning, and AI applications in real-world scenarios.'
      },
      {
        name: 'Digital Marketing',
        description: 'Master digital marketing strategies including SEO, SEM, social media marketing, content marketing, and analytics.'
      },
      {
        name: 'Full Stack Development',
        description: 'Become a full stack developer by learning frontend (React), backend (Node.js), databases, and deployment strategies.'
      }
    ];

    // Insert courses
    await Course.insertMany(courses);
    console.log('Sample courses created successfully');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses();
