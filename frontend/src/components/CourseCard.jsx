import { Link } from 'react-router-dom';

const CourseCard = ({ title, language, level, description, imageUrl }) => {
  return (
    <div className="course-card">
      <img 
        src={imageUrl || '/course-placeholder.jpg'} 
        alt={title}
        className="course-card-image"
      />
      <div className="course-card-content">
        <h3 className="course-card-title">{title}</h3>
        <p className="course-card-description">{description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-gray-600">{language}</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-gray-600">{level}</span>
          </div>
          <Link 
            to={`/courses/${language.toLowerCase()}/${level.toLowerCase()}`}
            className="btn btn-primary"
          >
            Start Course
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard; 