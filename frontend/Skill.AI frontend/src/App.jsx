import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { FirstVisitProvider } from './context/FirstVisitContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import FacultyProtectedRoute from './components/FacultyProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import EnrollmentPage from './pages/EnrollmentPage'
import PaymentPage from './pages/PaymentPage'
import MyCoursesPage from './pages/MyCoursesPage'
import CourseLearningPage from './pages/CourseLearningPage'
import CertificatePage from './pages/CertificatePage'
import ContactPage from './pages/ContactPage'
import AdminSupportPage from './pages/AdminSupportPage'
import PromotionalPopup from './components/PromotionalPopup'
import NotFound from "./pages/NotFound";
import LoadingSpinner from "./components/LoadingSpinner";
import DashboardPage from "./pages/DashboardPage";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProfilePage from "./pages/dashboard/ProfilePage";
import MyCoursesDashboard from "./pages/dashboard/MyCoursesDashboard";
import SettingsPage from "./pages/dashboard/SettingsPage";
// Admin imports
import AdminPlaceholder from './pages/AdminPlaceholder'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminCourses from './pages/AdminCourses'
import AdminUsers from './pages/AdminUsers'
import AdminEnrollments from './pages/AdminEnrollments'
import AdminPayments from './pages/AdminPayments'
import AdminLessons from "./pages/AdminLessons";
// Faculty imports
import FacultyLayout from './components/FacultyLayout'
import FacultyDashboard from './pages/FacultyDashboard'
import FacultyCourses from './pages/FacultyCourses'
import FacultyUpload from './pages/FacultyUpload'
import FacultyManage from './pages/FacultyManage'
import UserTypeSelection from './components/UserTypeSelection'
import GoogleAuthSuccess from './pages/GoogleAuthSuccess'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <FirstVisitProvider>
        <Router>
          <div className="app">
            <Toaster position="top-right" />
            <Routes>

              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
              <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
>
  <Route index element={<DashboardHome />} />

  <Route path="profile" element={<ProfilePage />} />

  <Route path="courses" element={<MyCoursesDashboard />} />

  <Route path="settings" element={<SettingsPage />} />
</Route>
              <Route 
  path="/admin" 
  element={
    <AdminProtectedRoute>
      <AdminDashboard />
    </AdminProtectedRoute>
  } 
/>
              <Route
                path="/admin/support"
                element={
                  <ProtectedRoute>
                    <AdminSupportPage />
                  </ProtectedRoute>
                }
              />

              <Route
  path="/admin/courses"
  element={
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminCourses />
      </AdminLayout>
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/users"
  element={
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminUsers />
      </AdminLayout>
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin/enrollments"
  element={
    <AdminProtectedRoute>
      <AdminLayout>
        <AdminEnrollments />
      </AdminLayout>
    </AdminProtectedRoute>
  }
/>
              <Route
  path="/admin/lessons"
  element={
    <ProtectedRoute>
      <AdminLessons />
    </ProtectedRoute>
  }
/>
              <Route
                path="/enroll/:courseId"
                element={
                  <ProtectedRoute>
                    <EnrollmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/:courseId"
                element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-courses"
                element={
                  <ProtectedRoute>
                    <MyCoursesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learn/:courseId"
                element={
                  <ProtectedRoute>
                    <CourseLearningPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/certificate/:courseId"
                element={
                  <ProtectedRoute>
                    <CertificatePage />
                  </ProtectedRoute>
                }
              />
              
              {/* Faculty Routes */}
              <Route
                path="/faculty"
                element={
                  <FacultyProtectedRoute>
                    <FacultyLayout>
                      <FacultyDashboard />
                    </FacultyLayout>
                  </FacultyProtectedRoute>
                }
              />
              <Route
                path="/faculty/dashboard"
                element={
                  <FacultyProtectedRoute>
                    <FacultyLayout>
                      <FacultyDashboard />
                    </FacultyLayout>
                  </FacultyProtectedRoute>
                }
              />
              <Route
                path="/faculty/courses"
                element={
                  <FacultyProtectedRoute>
                    <FacultyLayout>
                      <FacultyCourses />
                    </FacultyLayout>
                  </FacultyProtectedRoute>
                }
              />
              <Route
                path="/faculty/upload"
                element={
                  <FacultyProtectedRoute>
                    <FacultyLayout>
                      <FacultyUpload />
                    </FacultyLayout>
                  </FacultyProtectedRoute>
                }
              />
              <Route
                path="/faculty/manage"
                element={
                  <FacultyProtectedRoute>
                    <FacultyLayout>
                      <FacultyManage />
                    </FacultyLayout>
                  </FacultyProtectedRoute>
                }
              />
            </Routes>
            <PromotionalPopup />
            <UserTypeSelection />
          </div>
        </Router>
      </FirstVisitProvider>
    </AuthProvider>
  )
}

export default App


