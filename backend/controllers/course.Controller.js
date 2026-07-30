const Course = require("../models/Course");

// GET all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

// CREATE course
exports.createCourse = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const course = await Course.create({
      name,
      description,
      price: price || 599,
    });

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: "Course creation failed" });
  }
};

// SEED courses - helper function to seed initial courses
exports.seedCourses = async (req, res) => {
  try {
    const existingCourses = await Course.find();
    if (existingCourses.length === 0) {
      const courses = [
        {
          name: "English & Personality Development",
          description: "Master English communication skills and develop your personality with comprehensive training programs designed for professional success.",
          price: 599
        },
        {
          name: "Basic Computer",
          description: "Learn essential computer skills including operating systems, office applications, and fundamental digital literacy.",
          price: 599
        },
        {
          name: "AI Technology",
          description: "Explore artificial intelligence concepts, machine learning fundamentals, and cutting-edge AI applications in various industries.",
          price: 599
        },
        {
          name: "Digital Marketing",
          description: "Comprehensive digital marketing training covering SEO, social media marketing, content strategy, and online advertising.",
          price: 599
        },
        {
          name: "Full Stack Development",
          description: "Become a full-stack developer with training in frontend, backend, databases, and modern web development technologies.",
          price: 999
        },
        {
          name: "Data Science",
          description: "Master data science fundamentals including statistical analysis, machine learning, data visualization, and practical applications with Python.",
          price: 599
        },
        {
          name: "Python Programming",
          description: "Learn Python programming from basics to advanced concepts, including data structures, algorithms, and real-world application development.",
          price: 599
        }
      ];

      await Course.insertMany(courses);
      console.log("✅ Courses seeded successfully");
      return res.status(201).json({ message: "Courses seeded successfully", count: courses.length });
    } else {
      console.log("ℹ️ Courses already exist");
      return res.json({ message: "Courses already exist", count: existingCourses.length });
    }
  } catch (err) {
    console.error("❌ Error seeding courses:", err);
    return res.status(500).json({ message: "Error seeding courses", error: err.message });
  }
};

// ADD new courses - helper function to add specific new courses
exports.addNewCourses = async (req, res) => {
  try {
    const existingCourses = await Course.find();
    const existingCourseNames = existingCourses.map(course => course.name);
    
    const newCourses = [
      {
        name: "Data Science",
        description: "Master data science fundamentals including statistical analysis, machine learning, data visualization, and practical applications with Python.",
        price: 599
      },
      {
        name: "Python Programming", 
        description: "Learn Python programming from basics to advanced concepts, including data structures, algorithms, and real-world application development.",
        price: 599
      }
    ];

    // Filter out courses that already exist
    const coursesToAdd = newCourses.filter(course => !existingCourseNames.includes(course.name));

    if (coursesToAdd.length === 0) {
      console.log("ℹ️ New courses already exist");
      return res.json({ message: "New courses already exist", count: 0 });
    }

    const addedCourses = await Course.insertMany(coursesToAdd);
    console.log(`✅ ${coursesToAdd.length} new courses added successfully`);
    return res.status(201).json({ 
      message: "New courses added successfully", 
      count: coursesToAdd.length,
      courses: addedCourses 
    });
  } catch (err) {
    console.error("❌ Error adding new courses:", err);
    return res.status(500).json({ message: "Error adding new courses", error: err.message });
  }
};




