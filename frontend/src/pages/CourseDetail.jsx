import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseDetails } from '../utils/api';

const CourseDetail = () => {
  const { language, level } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCourseDetails = async () => {
      try {
        setIsLoading(true);
        const data = await getCourseDetails(language, level);
        setCourse(data);
      } catch (err) {
        setError('Failed to load course details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [language, level, navigate]);

  if (isLoading) {
    return (
      <>
        <header>
          <h1>Polyglot Practice</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/courses" className="active">Courses</a>
            <a href="/login">Login</a>
          </nav>
        </header>
        <main>
          <section id="courses-section">
            <p>Loading course details...</p>
          </section>
        </main>
        <footer>
          <p>&copy; 2025 Polyglot Practice. All rights reserved.</p>
        </footer>
      </>
    );
  }

  if (error) {
    return (
      <>
        <header>
          <h1>Polyglot Practice</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/courses" className="active">Courses</a>
            <a href="/login">Login</a>
          </nav>
        </header>
        <main>
          <section id="courses-section">
            <div className="error-messages">{error}</div>
          </section>
        </main>
        <footer>
          <p>&copy; 2025 Polyglot Practice. All rights reserved.</p>
        </footer>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <header>
          <h1>Polyglot Practice</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/courses" className="active">Courses</a>
            <a href="/login">Login</a>
          </nav>
        </header>
        <main>
          <section id="courses-section">
            <p>Course not found</p>
          </section>
        </main>
        <footer>
          <p>&copy; 2025 Polyglot Practice. All rights reserved.</p>
        </footer>
      </>
    );
  }

  return (
    <>
      <header>
        <h1>Polyglot Practice</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/courses" className="active">Courses</a>
          <a href="/login">Login</a>
        </nav>
      </header>
      <main>
        <section id="courses-section">
          <h2>{course.title}</h2>
          <div className="course-card">
            <div className="course-info">
              <div className="course-badges">
                <span className="badge">{course.language}</span>
                <span className="badge">{course.level}</span>
              </div>
              <p>{course.description}</p>
            </div>

            <div className="course-content">
              <h3>Quiz Questions</h3>
              {course.questions && course.questions.length > 0 ? (
                <ul>
                  {course.questions.map((q, idx) => (
                    <li key={q.id} style={{ marginBottom: '1.5em' }}>
                      <strong>Q{idx + 1} ({q.question_type.toUpperCase()}):</strong> {q.question_text}
                      {q.question_type === 'mcq' && q.options && (
                        <ul>
                          {q.options.map((opt, i) => (
                            <li key={i}>{opt}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No questions found for this quiz.</p>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2025 Polyglot Practice. All rights reserved.</p>
      </footer>
    </>
  );
};

export default CourseDetail; 