import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Mainpage/ProtectedRoute";
import RoleRedirect from "./Mainpage/RoleRedirect"; // New component

// Layouts
import AdminLayout from "./Admin/AdminLayout";
import TutorLayout from "./Instructor/TutorLayout"; // New layout

// Pages
import LMSLanding from "./Mainpage/LMSLanding";
import InstructorRegistration from "./Instructor/InstructorRegistration";
import StudentRegistration from "./Students/StudentRegistration";
import LoginPage from "./Login/LoginPage";

// Admin Pages
import AdminDashboard from "./Admin/AdminDashboard";
import ManageCourses from "./Admin/ManageCourses";
import ManageUsers from "./Admin/ManageUsers";

// Tutor Pages
import TutorDashboard from "./Instructor/TutorDashboard";
import CourseList from "./Instructor/CourseList";
import AddCourse from "./Instructor/AddCourse";
import StudentDashboard from "./Students/StudentDashboard";
import CourseView from "./Students/CourseView";
import EditCoursePage from "./Instructor/EditCoursePage";
import TutorSchedulePage from "./Instructor/TutorScheduleCalendar";
import CourseStructureEditor from "./Instructor/CourseStructureEditor";
import TutorNotificationCenter from "./Instructor/TutorNotificationCenter";
import TutorStudentsPage from "./Instructor/TutorStudentsPage";
import TutorMessagingCenter from "./Instructor/Message/TutorMessagingCenter";



function App() {


  useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('user');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-token', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  checkAuth();
}, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LMSLanding />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/instregistration" element={<InstructorRegistration />} />
        <Route path="/studentregistration" element={<StudentRegistration />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
          
              <AdminLayout />
           
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<ManageCourses />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>

        {/* Tutor Routes */}
        <Route
          path="/tutor"
          element={
            
              <TutorLayout />
          
          }
        >
          <Route index element={<TutorDashboard />} />
          <Route path="courses" element={<CourseList />} />
          <Route path="courses/add" element={<AddCourse />} />
          <Route path='courses/edit/:id' element={<CourseStructureEditor />} />
          <Route  path="schedule" element={<TutorSchedulePage />}  />
          <Route  path="notification" element={<TutorNotificationCenter /> }/>
          <Route path="students" element={<TutorStudentsPage />} />
          <Route path="messages" element={<TutorMessagingCenter />} />  
         
        </Route>

        {/* Role-based redirect after login */}
        <Route path="/redirect-by-role" element={<RoleRedirect />} />
        <Route path="/student/dashboard" element={<StudentDashboard />}  />
        <Route path="/courses/:id" element={<CourseView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;