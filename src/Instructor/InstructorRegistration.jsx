import React, { useState } from 'react';
import { FaChalkboardTeacher, FaUniversity, FaGraduationCap, FaLinkedin, FaGithub } from 'react-icons/fa';
import { FiUpload, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function InstructorRegistration() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 2
    expertise: '',
    institution: '',
    experience: '',
    bio: '',
    
    // Step 3
    profilePhoto: null,
    resume: null,
    linkedin: '',
    github: '',
    
    // Step 4
    availability: [],
    teachingMethod: '',
    hourlyRate: '',
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [IsSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate(); // Assuming you're using react-router-dom for navigation
  const validateForm = () => {
    console.log('[Validation] Starting validation with formData:', formData);
    const newErrors = {};
    
    // Required fields validation with detailed logging
    const requiredFields = [
      'firstName', 'lastName', 'email', 'password', 'confirmPassword',
      'expertise', 'institution', 'experience', 'bio'
    ];
    
    requiredFields.forEach(field => {
      console.log(`[Validation] Checking field: ${field}`);
      const value = formData[field]?.toString().trim();
      
      if (!value) {
        console.warn(`[Validation] Missing required field: ${field}`);
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      } else {
        console.log(`[Validation] Field ${field} is valid`);
      }
    });
  
    // Email validation
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      console.warn('[Validation] Invalid email format');
      newErrors.email = 'Invalid email format';
    }
  
    // Password validation
    if (formData.password) {
      if (formData.password.length < 8) {
        console.warn('[Validation] Password too short');
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(formData.password)) {
        console.warn('[Validation] Password lacks complexity');
        newErrors.password = 'Password must contain uppercase, lowercase, and number';
      }
    }
  
    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      console.warn('[Validation] Passwords do not match');
      newErrors.confirmPassword = 'Passwords do not match';
    }
  
    // Bio length validation
    if (formData.bio && formData.bio.length < 50) {
      console.warn('[Validation] Bio too short');
      newErrors.bio = 'Bio must be at least 50 characters';
    }
  
    console.log('[Validation] Final errors:', newErrors);
    setErrors(newErrors);
    
    const isValid = Object.keys(newErrors).length === 0;
    console.log(`[Validation] Form is ${isValid ? 'valid' : 'invalid'}`);
    return isValid;
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'profilePhoto' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
      setFormData({...formData, [name]: files[0]});
    } else if (name === 'resume' && files && files[0]) {
      setFormData({...formData, [name]: files[0]});
    } else {
      setFormData({...formData, [name]: value});
    }
  };

  const handleAvailabilityChange = (day) => {
    const updatedAvailability = formData.availability.includes(day)
      ? formData.availability.filter(d => d !== day)
      : [...formData.availability, day];
    setFormData({...formData, availability: updatedAvailability});
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
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
      if (!formData.expertise.trim()) newErrors.expertise = 'Expertise is required';
      if (!formData.institution.trim()) newErrors.institution = 'Education is required';
      if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
      if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
      else if (formData.bio.length < 50) newErrors.bio = 'Bio should be at least 50 characters';
    }
    
    if (step === 3) {
      if (!formData.profilePhoto) newErrors.profilePhoto = 'Profile photo is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  // Add this to your tutor registration component
  const API_BASE_URL = 'http://localhost:5000'; // Your Express server URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[Submit] Form submission initiated');
    
    // Validate form
    console.log('[Validation] Starting form validation');
    if (!validateForm()) {
      console.warn('[Validation] Form validation failed', errors);
      return;
    }
    console.log('[Validation] Form validation passed');
  
   
    setErrors({});
    console.log('[State] Set isSubmitting to true and cleared errors');
  
    try {
      // Prepare data
      console.log('[Data Prep] Preparing submission data');
      const submissionData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        expertise: formData.expertise.split(',').map(item => item.trim()),
        institution:formData.institution,
        experience: formData.experience,
        bio: formData.bio,
        availability: formData.availability,
        teachingMethod: formData.teachingMethod || undefined,
        hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : undefined
      };
      console.log('[Data Prep] Submission data prepared:', submissionData);
  
      // File uploads would go here
      console.log('[File Upload] Starting file upload process (placeholder)');
      // const profilePhotoUrl = await uploadFile(formData.profilePhoto);
      // submissionData.profilePhoto = profilePhotoUrl;
      console.log('[File Upload] File upload completed (simulated)');
  
      // API Request
      console.log('[API] Making POST request to /api/tutors/register');
      const response = await fetch(`${API_BASE_URL}/api/tutors/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
      console.log('[API] Received response, status:', response.status);
  
      const data = await response.json();
      console.log('[API] Response data:', data);
  
      if (!response.ok) {
        console.error('[API] Server responded with error:', data);
        throw new Error(data.message || 'Registration failed');
      }
  
      // Success
      console.log('[Success] Registration successful, updating UI');
      setIsSuccess(true);
      console.log('[State] Set isSuccess to true');
  
      // Redirect
      console.log('[Navigation] Preparing to redirect to dashboard');
      setTimeout(() => {
        console.log('[Navigation] Redirecting to /instructor/dashboard');
        navigate('/tutor/dashboard');
      }, 2000);
  
    } catch (error) {
      console.error('[Error] Registration failed:', error);
      console.error('[Error] Full error object:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      
      setErrors(prev => ({
        ...prev,
        form: error.message || 'An error occurred during registration'
      }));
      console.log('[State] Updated errors state:', errors);
    } finally {
   
      console.log('[State] Set isSubmitting to false');
    }
  };
  
  const handleFileUpload = async (file, endpoint) => {
    const formData = new FormData();
    formData.append(endpoint === 'profile-photo' ? 'profilePhoto' : 'resume', file);
  
    const response = await fetch(`${API_BASE_URL}/api/upload/${endpoint}`, {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'File upload failed');
    }
  
    return await response.json();
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
            <FaChalkboardTeacher className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Become an Instructor
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Share your knowledge and inspire the next generation of learners
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center w-1/4">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= stepNumber ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  {stepNumber}
                </div>
                <div className={`mt-2 text-sm font-medium ${step >= stepNumber ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {stepNumber === 1 && 'Account'}
                  {stepNumber === 2 && 'Profile'}
                  {stepNumber === 3 && 'Documents'}
                  {stepNumber === 4 && 'Availability'}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 h-1 bg-gray-200 rounded-full">
            <div 
              className="h-1 bg-indigo-600 rounded-full transition-all duration-300" 
              style={{ width: `${(step - 1) * 33.33}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form className="mb-0 space-y-6" onSubmit={handleSubmit}>
            {/* Step 1: Account Information */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full border ${errors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full border ${errors.lastName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Professional Information */}
            {step === 2 && (
              <>
                <div>
                  <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
                    Areas of Expertise (e.g., Mathematics, Computer Science)
                  </label>
                  <div className="mt-1">
                    <input
                      id="expertise"
                      name="expertise"
                      type="text"
                      value={formData.expertise}
                      onChange={handleChange}
                      className={`w-full border ${errors.expertise ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.expertise && <p className="mt-1 text-sm text-red-600">{errors.expertise}</p>}
                  </div>
                </div>

                
                <div className="mb-4">
  <div className="flex items-center">
    <FaUniversity className="h-5 w-5 text-gray-400 mr-2" />
    <input
      id="institution"
      name="institution"
      type="text"
      value={formData.institution}
      onChange={handleChange}
      placeholder="Institution"
      className={`flex-1 border ${errors.institution ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
    />
  </div>
  {errors.institution && <p className="mt-1 text-sm text-red-600">{errors.institution}</p>}
</div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Teaching/Professional Experience
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="experience"
                      name="experience"
                      rows={3}
                      value={formData.experience}
                      onChange={handleChange}
                      className={`w-full border ${errors.experience ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      placeholder="Describe your teaching or professional experience relevant to the subjects you want to teach"
                    />
                    {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Professional Bio
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      className={`w-full border ${errors.bio ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      placeholder="Tell students about yourself, your teaching philosophy, and why they should learn from you"
                    />
                    <p className="mt-1 text-sm text-gray-500">Minimum 50 characters</p>
                    {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Documents & Links */}
            {step === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Photo
                  </label>
                  <div className="mt-1 flex items-center">
                    {previewImage ? (
                      <div className="relative">
                        <img src={previewImage} alt="Preview" className="h-24 w-24 rounded-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(null);
                            setFormData({...formData, profilePhoto: null});
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaChalkboardTeacher className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="ml-4">
                      <label
                        htmlFor="profilePhoto"
                        className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <input
                          id="profilePhoto"
                          name="profilePhoto"
                          type="file"
                          accept="image/*"
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="flex items-center">
                          <FiUpload className="mr-2" />
                          {formData.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                        </div>
                      </label>
                    </div>
                  </div>
                  {errors.profilePhoto && <p className="mt-1 text-sm text-red-600">{errors.profilePhoto}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Resume/CV (PDF)
                  </label>
                  <div className="mt-1 flex items-center">
                    <label
                      htmlFor="resume"
                      className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <input
                        id="resume"
                        name="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <FiUpload className="mr-2" />
                        {formData.resume ? formData.resume.name : 'Upload Resume'}
                      </div>
                    </label>
                    {formData.resume && (
                      <span className="ml-4 text-sm text-gray-500">{formData.resume.name}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                    LinkedIn Profile (Optional)
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <FaLinkedin className="h-5 w-5" />
                    </span>
                    <input
                      id="linkedin"
                      name="linkedin"
                      type="url"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                    GitHub Profile (Optional - for technical instructors)
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      <FaGithub className="h-5 w-5" />
                    </span>
                    <input
                      id="github"
                      name="github"
                      type="url"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="https://github.com/yourusername"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Availability & Preferences */}
            {step === 4 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {daysOfWeek.map(day => (
                      <div key={day} className="flex items-center">
                        <input
                          id={`day-${day}`}
                          type="checkbox"
                          checked={formData.availability.includes(day)}
                          onChange={() => handleAvailabilityChange(day)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`day-${day}`} className="ml-2 block text-sm text-gray-700">
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="teachingMethod" className="block text-sm font-medium text-gray-700">
                    Preferred Teaching Method
                  </label>
                  <div className="mt-1">
                    <select
                      id="teachingMethod"
                      name="teachingMethod"
                      value={formData.teachingMethod}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select preferred method</option>
                      <option value="lecture">Lecture-based</option>
                      <option value="interactive">Interactive/Hands-on</option>
                      <option value="project">Project-based</option>
                      <option value="flipped">Flipped Classroom</option>
                      <option value="hybrid">Hybrid Approach</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
                    Hourly Rate (USD)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      id="hourlyRate"
                      name="hourlyRate"
                      type="number"
                      min="0"
                      step="5"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                      className="w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">/hr</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                      I agree to the terms and conditions
                    </label>
                    <p className="text-gray-500">
                      By registering as an instructor, you agree to our Instructor Agreement and Privacy Policy.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit Application
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Already have an account */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}