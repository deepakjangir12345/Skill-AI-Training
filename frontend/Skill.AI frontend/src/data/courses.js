// Frontend course data - matches the courses mentioned in LandingPage
export const COURSES_DATA = [
  {
    id: 1,
    name: 'English & Personality Development',
    description: 'Master English communication and develop your personality for professional success',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    category: 'Soft Skills',
    duration: '3 months',
    level: 'Beginner',
    price: 4999
  },
  {
    id: 2,
    name: 'Basic Computer',
    description: 'Learn fundamental computer skills and essential software applications',
    image: 'https://images.unsplash.com/photo-1517077304085-9e8c515f8b5c?w=600&h=400&fit=crop',
    category: 'Computer Skills',
    duration: '2 months',
    level: 'Beginner',
    price: 3999
  },
  {
    id: 3,
    name: 'AI Technology',
    description: 'Explore artificial intelligence concepts and modern AI technologies',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    category: 'Technology',
    duration: '6 months',
    level: 'Intermediate',
    price: 9999
  },
  {
    id: 4,
    name: 'Digital Marketing',
    description: 'Master digital marketing strategies, SEO, social media, and online advertising',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    category: 'Marketing',
    duration: '4 months',
    level: 'Intermediate',
    price: 6999
  },
  {
    id: 5,
    name: 'Full Stack Development',
    description: 'Become a full stack developer with modern web technologies',
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop',
    category: 'Programming',
    duration: '8 months',
    level: 'Advanced',
    price: 14999
  }
]

// Helper function to get course by ID
export const getCourseById = (courseId) => {
  return COURSES_DATA.find(course => course.id === parseInt(courseId))
}

// Helper function to get course by name
export const getCourseByName = (courseName) => {
  return COURSES_DATA.find(course => course.name.toLowerCase() === courseName.toLowerCase())
}
