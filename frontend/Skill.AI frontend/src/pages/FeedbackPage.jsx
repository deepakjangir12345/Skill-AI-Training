import React, { useEffect, useState } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./FeedbackPage.css";
import { Link } from "react-router-dom";

const FeedbackPage = () => {
  const [courses, setCourses] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    courseId: "",
    rating: "",
    teachingQuality: "",
    understandingLevel: "",
    problems: "",
    suggestions: "",
    needsSession: false,
  });

  useEffect(() => {
    fetchEnrolledCourses();
    fetchMyFeedback();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await api.get("/enrollments/my");

      const enrollments = response.data.enrollments || [];

      const enrolledCourses = enrollments
        .map(
          (enrollment) =>
            enrollment.course || enrollment.courseId
        )
        .filter(Boolean);

      setCourses(enrolledCourses);
    } catch (error) {
      console.error(
        "Error fetching enrolled courses:",
        error
      );

      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchMyFeedback = async () => {
    try {
      setLoadingFeedbacks(true);

      const response = await api.get("/feedback/my");

      setFeedbacks(response.data.feedbacks || []);
    } catch (error) {
      console.error(
        "Error fetching feedback:",
        error
      );

      setFeedbacks([]);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);

      await api.post("/feedback", {
        ...formData,

        rating: Number(formData.rating),

        teachingQuality:
          formData.teachingQuality
            ? Number(formData.teachingQuality)
            : undefined,

        understandingLevel:
          formData.understandingLevel
            ? Number(formData.understandingLevel)
            : undefined,
      });

      alert(
        "Thank you! Your feedback has been submitted successfully."
      );

      setFormData({
        courseId: "",
        rating: "",
        teachingQuality: "",
        understandingLevel: "",
        problems: "",
        suggestions: "",
        needsSession: false,
      });

      fetchMyFeedback();
    } catch (error) {
      console.error(
        "Feedback submit error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to submit feedback"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinSession = (meetingLink) => {
    if (!meetingLink) {
      alert(
        "Meeting link is not available yet."
      );
      return;
    }

    window.open(
      meetingLink,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const scheduledSessions = feedbacks.filter(
    (feedback) =>
      feedback.status === "session-scheduled" &&
      feedback.sessionScheduledAt
  );

  return (
    <div className="feedback-page">
      <Navbar />

      <main className="feedback-main">
        <div className="container">

          {/* PAGE HEADER */}

          <div className="feedback-header">
            <p className="feedback-eyebrow">
              YOUR VOICE MATTERS
            </p>

            <h1>Course Feedback</h1>

            <p>
              Share your learning experience and
              help us improve our classes.
            </p>

            <Link to="/my-feedback" className="my-feedback-btn">
  📋 View My Feedback
</Link>
          </div>

          {/* COMMON CENTER WRAPPER */}

          <div className="feedback-content-wrapper">

            {/* SCHEDULED DISCUSSION SESSIONS */}

            {!loadingFeedbacks &&
              scheduledSessions.length > 0 && (
                <div className="student-sessions-section">

                  <div className="student-sessions-heading">
                    <h2>
                      📅 Your Discussion Sessions
                    </h2>

                    <p className="student-sessions-subtitle">
                      Your faculty has scheduled the
                      following discussion session.
                    </p>
                  </div>

                  <div className="student-sessions-grid">

                    {scheduledSessions.map(
                      (feedback) => (
                        <div
                          key={feedback._id}
                          className="student-session-card"
                        >

                          <div className="student-session-header">

                            <div>
                              <h3>
                                {feedback.course?.name ||
                                  "Discussion Session"}
                              </h3>

                              <span className="session-scheduled-badge">
                                Session Scheduled
                              </span>
                            </div>

                          </div>

                          <div className="student-session-details">

                            <p>
                              🕒{" "}
                              <strong>
                                Date & Time:
                              </strong>{" "}
                              {new Date(
                                feedback.sessionScheduledAt
                              ).toLocaleString()}
                            </p>

                            {feedback.sessionNote && (
                              <p>
                                📝{" "}
                                <strong>
                                  Admin Note:
                                </strong>{" "}
                                {feedback.sessionNote}
                              </p>
                            )}

                          </div>

                          <button
                            type="button"
                            className="join-discussion-btn"
                            onClick={() =>
                              handleJoinSession(
                                feedback.sessionMeetingLink
                              )
                            }
                          >
                            Join Discussion Session →
                          </button>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

            {/* DISCUSSION SESSION LOADING */}

            {loadingFeedbacks && (
              <div className="student-sessions-loading">
                Checking your discussion sessions...
              </div>
            )}

            {/* FEEDBACK FORM */}

            {loadingCourses ? (

              <div className="feedback-card">
                <h2>
                  Loading your courses...
                </h2>
              </div>

            ) : courses.length === 0 ? (

              <div className="feedback-card">

                <h2>
                  No Enrolled Courses
                </h2>

                <p>
                  You need to enroll in a course
                  before submitting feedback.
                </p>

              </div>

            ) : (

              <div className="feedback-card">

                <form
                  className="feedback-form"
                  onSubmit={handleSubmit}
                >

                  {/* SELECT COURSE */}

                  <div className="form-group">

                    <label>
                      Select Course *
                    </label>

                    <select
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleChange}
                      required
                    >

                      <option value="">
                        Select your course
                      </option>

                      {courses.map((course) => (
                        <option
                          key={course._id}
                          value={course._id}
                        >
                          {course.name}
                        </option>
                      ))}

                    </select>

                  </div>

                  {/* OVERALL RATING */}

                  <div className="form-group">

                    <label>
                      Overall Rating *
                    </label>

                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      required
                    >

                      <option value="">
                        Select rating
                      </option>

                      <option value="5">
                        ⭐⭐⭐⭐⭐ Excellent
                      </option>

                      <option value="4">
                        ⭐⭐⭐⭐ Very Good
                      </option>

                      <option value="3">
                        ⭐⭐⭐ Good
                      </option>

                      <option value="2">
                        ⭐⭐ Needs Improvement
                      </option>

                      <option value="1">
                        ⭐ Poor
                      </option>

                    </select>

                  </div>

                  {/* TEACHING QUALITY */}

                  <div className="form-group">

                    <label>
                      Teaching Quality
                    </label>

                    <select
                      name="teachingQuality"
                      value={
                        formData.teachingQuality
                      }
                      onChange={handleChange}
                    >

                      <option value="">
                        Select rating
                      </option>

                      <option value="5">
                        5 - Excellent
                      </option>

                      <option value="4">
                        4 - Very Good
                      </option>

                      <option value="3">
                        3 - Good
                      </option>

                      <option value="2">
                        2 - Average
                      </option>

                      <option value="1">
                        1 - Poor
                      </option>

                    </select>

                  </div>

                  {/* UNDERSTANDING LEVEL */}

                  <div className="form-group">

                    <label>
                      How much are you understanding?
                    </label>

                    <select
                      name="understandingLevel"
                      value={
                        formData.understandingLevel
                      }
                      onChange={handleChange}
                    >

                      <option value="">
                        Select level
                      </option>

                      <option value="5">
                        Completely Understanding
                      </option>

                      <option value="4">
                        Mostly Understanding
                      </option>

                      <option value="3">
                        Partially Understanding
                      </option>

                      <option value="2">
                        Understanding Very Little
                      </option>

                      <option value="1">
                        Not Understanding
                      </option>

                    </select>

                  </div>

                  {/* PROBLEMS */}

                  <div className="form-group">

                    <label>
                      Are you facing any problems?
                    </label>

                    <textarea
                      name="problems"
                      value={formData.problems}
                      onChange={handleChange}
                      placeholder="Tell us about any problems you are facing..."
                      rows="4"
                    />

                  </div>

                  {/* SUGGESTIONS */}

                  <div className="form-group">

                    <label>
                      Your Suggestions
                    </label>

                    <textarea
                      name="suggestions"
                      value={formData.suggestions}
                      onChange={handleChange}
                      placeholder="How can we improve?"
                      rows="4"
                    />

                  </div>

                  {/* DISCUSSION SESSION REQUEST */}

                  <label className="session-checkbox">

                    <input
                      type="checkbox"
                      name="needsSession"
                      checked={
                        formData.needsSession
                      }
                      onChange={handleChange}
                    />

                    <span>
                      I would like a discussion session
                      with faculty to share my learning
                      experience or problems.
                    </span>

                  </label>

                  {/* SUBMIT BUTTON */}

                  <button
                    type="submit"
                    className="feedback-submit-btn"
                    disabled={submitting}
                  >

                    {submitting
                      ? "Submitting..."
                      : "Submit Feedback"}

                  </button>

                </form>

              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FeedbackPage;