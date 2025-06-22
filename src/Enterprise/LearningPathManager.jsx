import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LearningPathManager = () => {
  const [learningPaths, setLearningPaths] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical',
    level: 'beginner',
    estimatedDuration: { hours: 0, weeks: 0 },
    courses: [],
    requirements: { skills: [], experience: '', certifications: [] },
    outcomes: { skills: [], certifications: [], competencies: [] },
    assessment: { type: 'none', passingScore: 70, maxAttempts: 3 },
    visibility: 'organization',
    tags: []
  });

  const organizationId = localStorage.getItem('organizationId') || 'demo-org';

  useEffect(() => {
    fetchLearningPaths();
    fetchCourses();
  }, []);

  const fetchLearningPaths = async () => {
    try {
      const response = await axios.get(`/api/enterprise/organizations/${organizationId}/learning-paths`);
      setLearningPaths(response.data.data.learningPaths);
    } catch (error) {
      console.error('Error fetching learning paths:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`/api/courses?organization=${organizationId}`);
      setCourses(response.data.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value.split(',').map(item => item.trim()).filter(item => item)
      }
    }));
  };

  const addCourseToPath = (courseId) => {
    const course = courses.find(c => c._id === courseId);
    if (course) {
      setFormData(prev => ({
        ...prev,
        courses: [...prev.courses, {
          course: courseId,
          order: prev.courses.length + 1,
          isRequired: true,
          prerequisites: []
        }]
      }));
    }
  };

  const removeCourseFromPath = (index) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/enterprise/learning-paths', {
        ...formData,
        organization: organizationId
      });
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'technical',
        level: 'beginner',
        estimatedDuration: { hours: 0, weeks: 0 },
        courses: [],
        requirements: { skills: [], experience: '', certifications: [] },
        outcomes: { skills: [], certifications: [], competencies: [] },
        assessment: { type: 'none', passingScore: 70, maxAttempts: 3 },
        visibility: 'organization',
        tags: []
      });
      fetchLearningPaths();
    } catch (error) {
      console.error('Error creating learning path:', error);
    }
  };

  const renderCreateForm = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create Learning Path</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="technical">Technical</option>
                  <option value="leadership">Leadership</option>
                  <option value="soft-skills">Soft Skills</option>
                  <option value="compliance">Compliance</option>
                  <option value="onboarding">Onboarding</option>
                  <option value="product-training">Product Training</option>
                  <option value="sales">Sales</option>
                  <option value="customer-service">Customer Service</option>
                  <option value="management">Management</option>
                  <option value="certification">Certification</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Level</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estimated Hours</label>
                <input
                  type="number"
                  value={formData.estimatedDuration.hours}
                  onChange={(e) => handleNestedInputChange('estimatedDuration', 'hours', parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estimated Weeks</label>
                <input
                  type="number"
                  value={formData.estimatedDuration.weeks}
                  onChange={(e) => handleNestedInputChange('estimatedDuration', 'weeks', parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>

            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Add Courses</label>
              <select
                onChange={(e) => addCourseToPath(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select a course...</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Courses */}
            {formData.courses.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Selected Courses</label>
                <div className="mt-2 space-y-2">
                  {formData.courses.map((courseItem, index) => {
                    const course = courses.find(c => c._id === courseItem.course);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="font-medium">{course?.title}</span>
                        <button
                          type="button"
                          onClick={() => removeCourseFromPath(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Required Skills (comma-separated)</label>
              <input
                type="text"
                value={formData.requirements.skills.join(', ')}
                onChange={(e) => handleArrayInputChange('requirements', 'skills', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="JavaScript, React, Node.js"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Experience Level</label>
              <input
                type="text"
                value={formData.requirements.experience}
                onChange={(e) => handleNestedInputChange('requirements', 'experience', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="1-2 years of web development"
              />
            </div>

            {/* Outcomes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Learning Outcomes (comma-separated)</label>
              <input
                type="text"
                value={formData.outcomes.skills.join(', ')}
                onChange={(e) => handleArrayInputChange('outcomes', 'skills', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Advanced React development, State management, API integration"
              />
            </div>

            {/* Assessment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Assessment Type</label>
                <select
                  value={formData.assessment.type}
                  onChange={(e) => handleNestedInputChange('assessment', 'type', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="none">None</option>
                  <option value="quiz">Quiz</option>
                  <option value="project">Project</option>
                  <option value="presentation">Presentation</option>
                  <option value="certification">Certification</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Passing Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.assessment.passingScore}
                  onChange={(e) => handleNestedInputChange('assessment', 'passingScore', parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Attempts</label>
                <input
                  type="number"
                  min="1"
                  value={formData.assessment.maxAttempts}
                  onChange={(e) => handleNestedInputChange('assessment', 'maxAttempts', parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Learning Path
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderLearningPathCard = (path) => (
    <div key={path._id} className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{path.title}</h3>
          <p className="text-gray-600 mt-1">{path.description}</p>
        </div>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            path.status === 'active' ? 'bg-green-100 text-green-800' :
            path.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {path.status}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {path.category}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Level</p>
          <p className="font-medium">{path.level}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Duration</p>
          <p className="font-medium">{path.estimatedDuration.hours}h / {path.estimatedDuration.weeks}w</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Courses</p>
          <p className="font-medium">{path.courses.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Assessment</p>
          <p className="font-medium">{path.assessment.type}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Created by {path.createdBy?.firstName} {path.createdBy?.lastName}
        </div>
        <button
          onClick={() => setSelectedPath(path)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          View Details
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Learning Paths</h1>
            <p className="mt-2 text-gray-600">
              Create and manage structured learning paths for your organization
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Learning Path
          </button>
        </div>

        {/* Learning Paths Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {learningPaths.map(renderLearningPathCard)}
        </div>

        {learningPaths.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No learning paths created yet.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Your First Learning Path
            </button>
          </div>
        )}

        {/* Create Form Modal */}
        {showCreateForm && renderCreateForm()}
      </div>
    </div>
  );
};

export default LearningPathManager; 