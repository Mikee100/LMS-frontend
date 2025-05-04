import React from "react";
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



function App() {
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
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
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
    
         
        </Route>

        {/* Role-based redirect after login */}
        <Route path="/redirect-by-role" element={<RoleRedirect />} />
        <Route path="/student/dashboard" element={<StudentDashboard />}  />
      </Routes>
    </BrowserRouter>
  );
}

export default App;