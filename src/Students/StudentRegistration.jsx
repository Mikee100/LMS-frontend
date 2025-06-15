import React, { useState } from 'react';
import { FaUserGraduate, FaEnvelope, FaLock, FaCalendarAlt, FaIdCard, FaCheck } from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { toast } from "react-hot-toast";

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    studentId: '',
    interests: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);


const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const decoded = jwtDecode(credentialResponse.credential);

    // Send token to backend for registration/login
    const res = await axios.post('http://localhost:5000/api/students/google-register', {
      token: credentialResponse.credential,
    });

    // Save JWT token to localStorage
    localStorage.setItem('token', res.data.token);

    // Optionally, save user info if needed
    localStorage.setItem('student', JSON.stringify(res.data.student));

    toast.success("Registration successful! Redirecting...");

    // Redirect to student dashboard or profile
    navigate("/student/dashboard");
  } catch (err) {
    if (err.response && err.response.status === 409) {
      toast.error("This Google account is already registered. Please log in.");
    } else {
      toast.error("Google registration failed. Please try again.");
    }
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Password strength calculation
    if (name === 'password') {
      let strength = 0;
      if (value.length > 0) strength += 1;
      if (value.length >= 8) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => {
      const newInterests = checked
        ? [...prev.interests, name]
        : prev.interests.filter(item => item !== name);
      return { ...prev, interests: newInterests };
    });

    if (errors.interests) {
      setErrors({
        ...errors,
        interests: ''
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (step === 2) {
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.studentId) newErrors.studentId = 'Student ID is required';
    }
    
    if (step === 3 && formData.interests.length === 0) {
      newErrors.interests = 'Select at least one interest';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/students/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setIsSuccess(true);
      setTimeout(() => navigate('/student/dashboard'), 2000);
    } catch (error) {
      setErrors({
        ...errors,
        form: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const interestOptions = [
    'Computer Science',
    'Business',
    'Engineering',
    'Arts',
    'Mathematics',
    'Biology',
    'Physics',
    'Chemistry',
    'Psychology',
    'Economics',
    'Literature',
    'History'
  ];

  const steps = [
    { id: 1, name: 'Personal Information' },
    { id: 2, name: 'Academic Details' },
    { id: 3, name: 'Interests' },
    { id: 4, name: 'Review & Submit' }
  ];

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 0: return 'bg-gray-200';
      case 1: return 'bg-red-400';
      case 2: return 'bg-yellow-400';
      case 3: return 'bg-blue-400';
      case 4: return 'bg-green-400';
      case 5: return 'bg-green-600';
      default: return 'bg-gray-200';
    }
  };

  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Moderate';
      case 3: return 'Good';
      case 4: return 'Strong';
      case 5: return 'Very Strong';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={() => {
    alert('Google Sign Up Failed');
  }}
  text="signup_with"
  shape="circle"
/>
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="flex justify-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center"
          >
            <FaUserGraduate className="h-10 w-10 text-blue-600" />
          </motion.div>
        </div>
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-center text-4xl font-bold text-gray-900"
        >
          Student Registration
        </motion.h2>
        <p className="mt-2 text-center text-lg text-gray-600">
          Join our academic community in just a few steps
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        {/* Progress Steps */}
        <nav aria-label="Progress" className="mb-8">
          <ol className="flex items-center">
            {steps.map((step, index) => (
              <li key={step.id} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                {step.id < currentStep ? (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-blue-600" />
                    </div>
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                      <FaCheck className="h-5 w-5 text-white" aria-hidden="true" />
                      <span className="sr-only">{step.name}</span>
                    </div>
                    <p className="absolute top-12 left-1/2 -translate-x-1/2 text-xs font-medium text-blue-600 whitespace-nowrap">
                      {step.name}
                    </p>
                  </>
                ) : step.id === currentStep ? (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-gray-200" />
                    </div>
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-600 bg-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-600" aria-hidden="true" />
                      <span className="sr-only">{step.name}</span>
                    </div>
                    <p className="absolute top-12 left-1/2 -translate-x-1/2 text-xs font-medium text-blue-600 whitespace-nowrap">
                      {step.name}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-gray-200" />
                    </div>
                    <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400">
                      <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" aria-hidden="true" />
                      <span className="sr-only">{step.name}</span>
                    </div>
                    <p className="absolute top-12 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-500 whitespace-nowrap">
                      {step.name}
                    </p>
                  </>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10"
        >
          {errors.form && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Registration Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errors.form}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isSuccess ? (
            <div className="text-center py-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100"
              >
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <h3 className="mt-6 text-2xl font-bold text-gray-900">
                Registration Successful!
              </h3>
              <p className="mt-3 text-lg text-gray-600">
                Welcome to our academic community, {formData.firstName}!
              </p>
              <p className="mt-1 text-gray-500">
                You'll be redirected to your dashboard shortly.
              </p>
              <div className="mt-6">
                <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
                  <span className="animate-pulse">Redirecting</span>
                  <span className="ml-2 animate-pulse">...</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUserGraduate className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`pl-10 block w-full rounded-md border ${errors.firstName ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm py-2 px-3 focus:outline-none transition`}
                          placeholder="John"
                        />
                      </div>
                      {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUserGraduate className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`pl-10 block w-full rounded-md border ${errors.lastName ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm py-2 px-3 focus:outline-none transition`}
                          placeholder="Doe"
                        />
                      </div>
                      {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pl-10 block w-full rounded-md border ${errors.email ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm py-2 px-3 focus:outline-none transition`}
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`pl-10 block w-full rounded-md border ${errors.password ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm py-2 px-3 focus:outline-none transition`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                      
                      <div className="mt-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Password Strength</span>
                          <span className={`font-medium ${passwordStrength > 3 ? 'text-green-600' : passwordStrength > 1 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`} 
                            style={{ width: `${passwordStrength * 20}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <ul className="mt-2 text-xs text-gray-500 space-y-1">
                        <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                          {formData.password.length >= 8 ? <FaCheck className="mr-1" /> : '•'} At least 8 characters
                        </li>
                        <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                          {/[A-Z]/.test(formData.password) ? <FaCheck className="mr-1" /> : '•'} At least one uppercase
                        </li>
                        <li className={`flex items-center ${/[0-9]/.test(formData.password) ? 'text-green-600' : ''}`}>
                          {/[0-9]/.test(formData.password) ? <FaCheck className="mr-1" /> : '•'} At least one number
                        </li>
                      </ul>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`pl-10 block w-full rounded-md border ${errors.confirmPassword ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm py-2 px-3 focus:outline-none transition`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                      {formData.password && formData.password === formData.confirmPassword && (
                        <p className="mt-1 text-sm text-green-600 flex items-center">
                          <FaCheck className="mr-1" /> Passwords match
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Academic Details */}
              {currentStep === 2 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                    Academic Details
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className={`pl-10 block w-full rounded-md border ${errors.dateOfBirth ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm py-2 px-3 focus:outline-none transition`}
                        />
                      </div>
                      {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
                    </div>

                    <div>
                      <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                        Student ID
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaIdCard className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="studentId"
                          name="studentId"
                          type="text"
                          value={formData.studentId}
                          onChange={handleChange}
                          className={`pl-10 block w-full rounded-md border ${errors.studentId ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm py-2 px-3 focus:outline-none transition`}
                          placeholder="STU123456"
                        />
                      </div>
                      {errors.studentId && <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Interests */}
              {currentStep === 3 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                    Academic Interests
                  </h3>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Select at least one area of interest to help us personalize your experience.
                    </p>
                    
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                      {interestOptions.map((interest) => (
                        <div key={interest} className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id={`interest-${interest}`}
                              name={interest}
                              type="checkbox"
                              checked={formData.interests.includes(interest)}
                              onChange={handleCheckboxChange}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor={`interest-${interest}`} className="font-medium text-gray-700">
                              {interest}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.interests && (
                      <p className="mt-2 text-sm text-red-600">{errors.interests}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                    Review Your Information
                  </h3>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">First Name</p>
                        <p className="text-sm text-gray-900">{formData.firstName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Name</p>
                        <p className="text-sm text-gray-900">{formData.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-sm text-gray-900">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                        <p className="text-sm text-gray-900">
                          {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Academic Details</h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Student ID</p>
                        <p className="text-sm text-gray-900">{formData.studentId || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Interests</h4>
                    {formData.interests.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {formData.interests.map((interest, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {interest}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No interests selected</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Continue
                    <FiChevronRight className="ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : 'Complete Registration'}
                  </button>
                )}
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentRegistration;