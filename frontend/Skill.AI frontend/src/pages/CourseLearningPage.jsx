import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./CourseLearningPage.css";

const CourseLearningPage = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchCourseContent();
    fetchLiveClasses();
  }, [courseId]);

  // ==========================
  // FETCH COURSE CONTENT
  // ==========================

  const fetchCourseContent = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        courseResponse,
        lessonResponse,
        progressResponse,
      ] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/lessons/${courseId}`),
        api.get(`/lessons/progress/${courseId}`),
      ]);

      const courseData =
        courseResponse?.data?.course || null;

      const lessonList = (
        lessonResponse?.data?.lessons || []
      )
        .slice()
        .sort((a, b) => {
          const aModuleOrder =
            Number(a.module?.order) || 0;

          const bModuleOrder =
            Number(b.module?.order) || 0;

          if (aModuleOrder !== bModuleOrder) {
            return aModuleOrder - bModuleOrder;
          }

          return (
            (Number(a.order) || 0) -
            (Number(b.order) || 0)
          );
        });

      const completedLessonIds =
        progressResponse?.data?.completedLessonIds || [];

      const completedFacultyVideoIds =
        progressResponse?.data
          ?.completedFacultyVideoIds || [];

      const allCompletedIds = [
        ...completedLessonIds,
        ...completedFacultyVideoIds,
      ];

      const firstIncompleteIndex =
        lessonList.findIndex(
          (lesson) =>
            !allCompletedIds.includes(
              lesson._id
            )
        );

      const initialLessonIndex =
        firstIncompleteIndex === -1
          ? 0
          : firstIncompleteIndex;

      setCourse(courseData);
      setLessons(lessonList);
      setCompletedLessons(allCompletedIds);

      setProgress(
        progressResponse?.data?.progress || 0
      );

      if (lessonList.length > 0) {
        setCurrentLesson(
          lessonList[initialLessonIndex]
        );

        setCurrentLessonIndex(
          initialLessonIndex
        );
      } else {
        setCurrentLesson(null);
        setCurrentLessonIndex(0);
      }
    } catch (err) {
      console.error(
        "Error fetching course content:",
        err
      );

      setCourse(null);
      setLessons([]);
      setCurrentLesson(null);
      setCurrentLessonIndex(0);
      setCompletedLessons([]);
      setProgress(0);

      setError(
        "Unable to load the course content right now. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // FETCH LIVE CLASSES
  // ==========================

  const fetchLiveClasses = async () => {
    try {
      const response = await api.get(
        `/live-classes/course/${courseId}`
      );

      setLiveClasses(
        response?.data?.liveClasses || []
      );
    } catch (error) {
      console.error(
        "Error fetching live classes:",
        error
      );

      setLiveClasses([]);
    }
  };

  // ==========================
  // VIDEO URL
  // ==========================

  const getVideoUrl = (lesson) => {
    if (!lesson?.videoUrl) {
      return "";
    }

    // Existing Admin lessons
    if (lesson.type !== "faculty-video") {
      return lesson.videoUrl;
    }

    // Faculty uploaded videos
    const backendBaseUrl =
      api.defaults.baseURL.replace(
        /\/api\/?$/,
        ""
      );

    return `${backendBaseUrl}${lesson.videoUrl}`;
  };

  // ==========================
  // SELECT LESSON
  // ==========================

  const handleSelectLesson = (
    lesson,
    index
  ) => {
    setCurrentLesson(lesson);
    setCurrentLessonIndex(index);
  };

  // ==========================
  // NEXT / PREVIOUS
  // ==========================

  const handleNavigateLesson = (
    direction
  ) => {
    if (lessons.length === 0) {
      return;
    }

    const nextIndex =
      currentLessonIndex + direction;

    if (
      nextIndex < 0 ||
      nextIndex >= lessons.length
    ) {
      return;
    }

    setCurrentLesson(
      lessons[nextIndex]
    );

    setCurrentLessonIndex(nextIndex);
  };

  // ==========================
  // MARK LESSON COMPLETE
  // ==========================

  const handleCompleteLesson = async () => {
    if (!currentLesson || completing) {
      return;
    }

    try {
      setCompleting(true);

      // Faculty video
      if (
        currentLesson.type ===
        "faculty-video"
      ) {
        await api.post(
          `/lessons/faculty-video/${currentLesson._id}/complete`
        );
      }

      // Admin lesson
      else {
        await api.post(
          "/lessons/complete",
          {
            lessonId:
              currentLesson._id,
          }
        );
      }

      // Update completed IDs immediately
      const updatedCompletedLessons = [
        ...new Set([
          ...completedLessons,
          currentLesson._id,
        ]),
      ];

      setCompletedLessons(
        updatedCompletedLessons
      );

      // Update progress immediately
      const newProgress =
        lessons.length === 0
          ? 0
          : Math.round(
              (updatedCompletedLessons.length /
                lessons.length) *
                100
            );

      setProgress(newProgress);

      // Automatically move to next item
      if (
        currentLessonIndex <
        lessons.length - 1
      ) {
        const nextIndex =
          currentLessonIndex + 1;

        setCurrentLesson(
          lessons[nextIndex]
        );

        setCurrentLessonIndex(
          nextIndex
        );
      }
    } catch (error) {
      console.error(
        "Error completing lesson:",
        error
      );
    } finally {
      setCompleting(false);
    }
  };

  // ==========================
  // GROUP LESSONS BY MODULE
  // ==========================

  const lessonGroups = lessons.reduce(
    (groups, lesson) => {
      const groupId =
        lesson.module?._id ||
        "ungrouped";

      let group = groups.find(
        (item) =>
          item.id === groupId
      );

      if (!group) {
        group = {
          id: groupId,
          title:
            lesson.module?.title ||
            "Other Lessons",
          description:
            lesson.module?.description ||
            "",
          lessons: [],
        };

        groups.push(group);
      }

      group.lessons.push(lesson);

      return groups;
    },
    []
  );

  // ==========================
  // LOADING
  // ==========================

  if (loading) {
    return (
      <div className="course-learning-page">
        <Navbar />

        <main className="course-learning-main">
          <div className="container">
            <div className="spinner"></div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ==========================
  // PAGE
  // ==========================

  return (
    <div className="course-learning-page">
      <Navbar />

      <main className="course-learning-main">
        <div className="container">

          {/* ==========================
              PREMIUM COURSE HERO
          ========================== */}

          {course && (
            <div className="course-hero-card">

              <div className="course-hero-content">

                <div className="course-hero-badge">
                  <span className="hero-badge-dot"></span>
                  PREMIUM COURSE
                </div>

                <h1>
                  {course.name}
                </h1>

                <p className="course-hero-description">
                  {course.description}
                </p>

                <div className="course-hero-info">

                  <div className="hero-info-card">
                    <span className="hero-info-icon">
                      💰
                    </span>

                    <div>
                      <small>
                        Course Price
                      </small>

                      <strong>
                        ₹{course.price}
                      </strong>
                    </div>
                  </div>

                  <div className="hero-info-card">
                    <span className="hero-info-icon">
                      👨‍🏫
                    </span>

                    <div>
                      <small>
                        Learning Support
                      </small>

                      <strong>
                        Instructor Available
                      </strong>
                    </div>
                  </div>

                </div>
              </div>

              <div className="course-hero-visual">

                <div className="hero-orb hero-orb-one"></div>

                <div className="hero-orb hero-orb-two"></div>

                <div className="ai-cube">

                  <div className="cube-face cube-front">
                    AI
                  </div>

                  <div className="cube-face cube-back">
                    ML
                  </div>

                  <div className="cube-face cube-right">
                    ∞
                  </div>

                  <div className="cube-face cube-left">
                    +
                  </div>

                  <div className="cube-face cube-top">
                    ✦
                  </div>

                  <div className="cube-face cube-bottom">
                    ◆
                  </div>

                </div>

                <div className="hero-floating-card hero-card-one">
                  ✦ AI
                </div>

                <div className="hero-floating-card hero-card-two">
                  ⚡ Learn
                </div>

              </div>
            </div>
          )}

          {/* ==========================
              ERROR
          ========================== */}

          {error && (
            <div className="error-card">
              <p>{error}</p>
            </div>
          )}

          {/* ==========================
              COURSE OVERVIEW
          ========================== */}

          <div className="course-overview-row">

            {/* ==========================
                COURSE PROGRESS
            ========================== */}

            <div className="progress-card premium-progress-card">

              <div className="progress-card-header">

                <div>
                  <span className="progress-label">
                    YOUR PROGRESS
                  </span>

                  <h3>
                    Course Progress
                  </h3>
                </div>

                <div className="progress-percentage">
                  {progress}%
                </div>

              </div>

              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                ></div>

              </div>

              <div className="progress-footer">

                <span>
                  🚀 Keep learning
                </span>

                <span>
                  {completedLessons.length} of{" "}
                  {lessons.length} completed
                </span>

              </div>

            </div>

            {/* ==========================
                LIVE CLASSES
            ========================== */}

            <div className="live-classes-section premium-live-section">

              <div className="live-classes-heading premium-live-heading">

                <div className="live-heading-left">

                  <div className="live-icon">
                    🔴
                  </div>

                  <div>
                    <span className="live-label">
                      LIVE LEARNING
                    </span>

                    <h2>
                      Live Classes
                    </h2>

                    <p>
                      Join your upcoming live sessions
                      for this course.
                    </p>
                  </div>

                </div>

                {liveClasses.length > 0 && (
                  <span className="live-count">
                    {liveClasses.length}{" "}
                    {liveClasses.length === 1
                      ? "Session"
                      : "Sessions"}
                  </span>
                )}

              </div>

              {liveClasses.length === 0 ? (

                <div className="no-live-classes premium-live-empty">

                  <div className="live-empty-visual">

                    <div className="live-calendar">
                      📅
                    </div>

                    <div className="live-glow"></div>

                  </div>

                  <div className="live-empty-content">

                    <span className="empty-live-badge">
                      COMING SOON
                    </span>

                    <h3>
                      No live classes scheduled yet
                    </h3>

                    <p>
                      New live sessions will appear here
                      when your instructor schedules them.
                    </p>

                  </div>

                  <div className="live-empty-decoration">
                    ✦
                  </div>

                </div>

              ) : (

                <div className="student-live-classes-grid premium-live-grid">

                  {liveClasses.map(
                    (liveClass) => (

                      <div
                        key={liveClass._id}
                        className="student-live-class-card premium-live-card"
                      >

                        <div className="live-card-top">

                          <span className="live-status-badge">
                            🔴{" "}
                            {liveClass.status ||
                              "upcoming"}
                          </span>

                          <span className="live-duration">
                            ⏱{" "}
                            {liveClass.duration} min
                          </span>

                        </div>

                        <h3>
                          {liveClass.title}
                        </h3>

                        {liveClass.description && (
                          <p className="live-class-description">
                            {
                              liveClass.description
                            }
                          </p>
                        )}

                        <div className="live-class-details">

                          <div>
                            <span>📅</span>

                            <div>
                              <small>
                                Date
                              </small>

                              <strong>
                                {new Date(
                                  liveClass.scheduledAt
                                ).toLocaleDateString()}
                              </strong>
                            </div>
                          </div>

                          <div>
                            <span>🕒</span>

                            <div>
                              <small>
                                Time
                              </small>

                              <strong>
                                {new Date(
                                  liveClass.scheduledAt
                                ).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </strong>
                            </div>
                          </div>

                        </div>

                        {liveClass.meetingLink && (
                          <a
                            href={
                              liveClass.meetingLink
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="join-live-class-btn premium-join-btn"
                          >
                            🎥 Join Live Class
                            <span>→</span>
                          </a>
                        )}

                      </div>

                    )
                  )}

                </div>

              )}

            </div>
          </div>

          {/* ==========================
              LEARNING AREA
          ========================== */}

          <div className="learning-layout">

            {/* ==========================
                MODULE SIDEBAR
            ========================== */}

            <div className="modules-sidebar">

              <h3>
                Course Modules
              </h3>

              <div className="modules-list">

                {lessons.length === 0 ? (

                  <p className="no-content">
                    No lessons available for this
                    course yet.
                  </p>

                ) : (

                  lessonGroups.map(
                    (group) => (

                      <section
                        className="learning-module"
                        key={group.id}
                      >

                        <h4>
                          {group.title}
                        </h4>

                        {group.description && (
                          <p>
                            {group.description}
                          </p>
                        )}

                        {group.lessons.map(
                          (lesson) => {

                            const index =
                              lessons.findIndex(
                                (item) =>
                                  item._id ===
                                  lesson._id
                              );

                            const isCompleted =
                              completedLessons.includes(
                                lesson._id
                              );

                            const isActive =
                              currentLesson?._id ===
                              lesson._id;

                            return (
                              <button
                                key={lesson._id}
                                type="button"
                                className={`module-item ${
                                  isActive
                                    ? "active"
                                    : ""
                                } ${
                                  isCompleted
                                    ? "completed"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleSelectLesson(
                                    lesson,
                                    index
                                  )
                                }
                              >

                                <span className="module-number">
                                  {index + 1}
                                </span>

                                <span className="module-title">

                                  <span className="lesson-type">
                                    {lesson.type ===
                                    "faculty-video"
                                      ? "🎥 Video"
                                      : "📘 Lesson"}
                                  </span>

                                  <span className="lesson-name">
                                    {lesson.title}
                                  </span>

                                </span>

                                {isCompleted && (
                                  <span className="completion-status">
                                    Completed
                                  </span>
                                )}

                              </button>
                            );
                          }
                        )}

                      </section>
                    )
                  )
                )}

              </div>
            </div>

            {/* ==========================
                LEARNING CONTENT
            ========================== */}

            <div className="learning-content">

              {!currentLesson ? (

                <div className="no-content">
                  <p>
                    Select a module to start learning
                  </p>
                </div>

              ) : (

                <>

                  {currentLesson.module?.title && (
                    <p className="current-module-title">
                      {
                        currentLesson.module.title
                      }
                    </p>
                  )}

                  <h2 className="module-title">
                    {currentLesson.title}
                  </h2>

                  <p className="module-description">
                    {currentLesson.description ||
                      "No description available for this lesson."}
                  </p>

                  <div className="lesson-meta">

                    <span>
                      ⏱ Duration:{" "}
                      {currentLesson.duration
                        ? `${currentLesson.duration} min`
                        : "Not specified"}
                    </span>

                    <span>
                      📚 Lesson{" "}
                      {currentLessonIndex + 1} of{" "}
                      {lessons.length}
                    </span>

                  </div>

                  {/* VIDEO */}

                  {currentLesson.videoUrl && (
                    <div className="video-container">

                      <video
                        controls
                        src={getVideoUrl(
                          currentLesson
                        )}
                      >
                        Your browser does not support
                        the video tag.
                      </video>

                    </div>
                  )}

                  {/* PDF */}

                  {currentLesson.pdfUrl && (
                    <div className="lesson-resource">

                      <a
                        href={
                          currentLesson.pdfUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        📄 Open PDF Resource
                      </a>

                    </div>
                  )}

                  {/* ACTION BUTTONS */}

                  <div className="learning-actions">

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        handleNavigateLesson(-1)
                      }
                      disabled={
                        currentLessonIndex === 0
                      }
                    >
                      ← Previous Lesson
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        handleNavigateLesson(1)
                      }
                      disabled={
                        currentLessonIndex ===
                        lessons.length - 1
                      }
                    >
                      Next Lesson →
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={
                        handleCompleteLesson
                      }
                      disabled={
                        completedLessons.includes(
                          currentLesson._id
                        ) || completing
                      }
                    >
                      {completedLessons.includes(
                        currentLesson._id
                      )
                        ? "Completed"
                        : completing
                        ? "Saving..."
                        : "Mark as Complete"}
                    </button>

                    <Link
                      to="/my-courses"
                      className="btn btn-secondary"
                    >
                      Back to My Courses
                    </Link>

                    {progress >= 100 && (
                      <Link
                        to={`/certificate/${courseId}`}
                        className="btn btn-primary"
                      >
                        🏆 View Certificate
                      </Link>
                    )}

                  </div>

                </>
              )}

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseLearningPage;