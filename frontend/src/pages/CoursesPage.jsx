import { useState } from 'react';
import CourseCard from '../components/CourseCard';

// Mock data - replace with API call in production
const mockCourses = [
  {
    id: 1,
    title: 'Spanish for Beginners',
    language: 'Spanish',
    level: 'Beginner',
    description: 'Start your journey into Spanish language with our comprehensive beginner course.',
    imageUrl: '/spanish-course.jpg',
  },
  {
    id: 2,
    title: 'Intermediate French',
    language: 'French',
    level: 'Intermediate',
    description: 'Take your French to the next level with advanced grammar and conversation practice.',
    imageUrl: '/french-course.jpg',
  },
  // Add more mock courses as needed
];

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const languages = [...new Set(mockCourses.map(course => course.language))];
  const levels = [...new Set(mockCourses.map(course => course.level))];

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = !selectedLanguage || course.language === selectedLanguage;
    const matchesLevel = !selectedLevel || course.level === selectedLevel;

    return matchesSearch && matchesLanguage && matchesLevel;
  });

  return (
    <div className="container flex-1 py-8 page-content">
      <h1>Available Courses</h1>
      
      <div className="flex gap-4 mb-8 justify-center">
        <div className="form-group flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="form-group">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-40"
          >
            <option value="">All Languages</option>
            {languages.map(language => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-40"
          >
            <option value="">All Levels</option>
            {levels.map(level => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="course-grid">
        {filteredCourses.map(course => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No courses found matching your criteria.
        </p>
      )}
    </div>
  );
};

export default CoursesPage; 