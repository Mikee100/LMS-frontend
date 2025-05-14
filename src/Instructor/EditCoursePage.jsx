import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUpload, FiFile, FiImage, FiX, FiArrowLeft, FiCheck, FiEye, FiDownload } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    title: '',
    description: '',
    subject: '',
    level: '',
    thumbnail: null,
    materials: [],
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [materialFiles, setMaterialFiles] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  


  // Add these imports at the top


// Add these functions inside your component
const downloadMaterial = async (materialId, filename) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `http://localhost:5000/api/courses/material/${materialId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob' // Important for file downloads
      }
    );

    // Create a download link and trigger it
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error('Error downloading material:', err);
    toast.error('Failed to download material');
  }
};

const viewMaterial = (material) => {
  const token = localStorage.getItem('token');
  const fileUrl = `http://localhost:5000/api/courses/material/${material.filename}?token=${token}`;

  if ((material.originalName || material.filename)?.endsWith('.pdf')) {
    window.open(fileUrl, '_blank');
  } else {
    // Optional: for download
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = material.originalName || material.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};




  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/students/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setCourse(response.data);
        
        // Set preview image if thumbnail exists
        if (response.data.thumbnail?.data) {
          const base64String = btoa(
            String.fromCharCode(...new Uint8Array(response.data.thumbnail.data.data || response.data.thumbnail.data)
          ));
          setPreviewImage(`data:image/jpeg;base64,${base64String}`);
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
        toast.error('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleMaterialsChange = (e) => {
    setMaterialFiles([...e.target.files]);
  };

  const removeMaterial = (index) => {
    const newFiles = [...materialFiles];
    newFiles.splice(index, 1);
    setMaterialFiles(newFiles);
  };

  const removeExistingMaterial = (materialId) => {
    setCourse(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m._id !== materialId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', course.title);
      formData.append('description', course.description);
      formData.append('subject', course.subject);
      formData.append('level', course.level);

      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
      materialFiles.forEach(file => formData.append('materials', file));

      const token = localStorage.getItem('token');

      await axios.put(`http://localhost:5000/api/courses/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Course updated successfully!');
      setTimeout(() => navigate('/tutor/courses'), 1500);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error updating course');
    } finally {
      setSubmitting(false);
    }
  };

  

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
      >
        <FiArrowLeft className="mr-2" /> Back to Courses
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Edit Course</h2>
        <p className="text-gray-600 mb-6">Update your course information</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
              <input
                type="text"
                name="title"
                value={course.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. Introduction to React"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={course.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. Web Development"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              name="level"
              value={course.level}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select difficulty level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={course.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              rows="4"
              placeholder="Detailed course description..."
            ></textarea>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Course Thumbnail</label>
            
            <div className="flex items-center space-x-6">
              {previewImage ? (
                <div className="relative">
                  <img 
                    src={previewImage} 
                    alt="Course thumbnail preview" 
                    className="h-32 w-32 rounded-lg object-cover border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setThumbnailFile(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <div className="h-32 w-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  <FiImage size={32} />
                </div>
              )}
              
              <label className="flex flex-col items-center px-4 py-3 bg-white rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                <FiUpload className="text-indigo-600 mb-2" />
                <span className="text-sm text-gray-600">Upload new thumbnail</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleThumbnailChange} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Learning Materials</label>
            
            {course.materials.map((material) => (
  <li key={material._id || material.filename} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
    <div className="flex items-center">
      <FiFile className="text-indigo-600 mr-2" />
      <span className="text-sm">{material.originalName || material.filename}</span>
    </div>
    <div className="flex space-x-2">
      <button
        onClick={() => viewMaterial(material)}
        className="text-indigo-600 hover:text-indigo-800 p-1"
        title={(material.originalName || material.filename)?.endsWith('.pdf') ? "View" : "Download"}
      >
        {(material.originalName || material.filename)?.endsWith('.pdf') ? (
          <FiEye size={18} />
        ) : (
          <FiDownload size={18} />
        )}
      </button>
      <button
        onClick={() => removeExistingMaterial(material._id)}
        className="text-red-500 hover:text-red-700 p-1"
        title="Remove"
      >
        <FiX size={18} />
      </button>
    </div>
  </li>
))}


            {materialFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">New Materials to Upload</h4>
                <ul className="space-y-2">
                  {Array.from(materialFiles).map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FiFile className="text-blue-600 mr-2" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMaterial(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiX size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
              <FiUpload className="text-indigo-600 mb-2" />
              <span className="text-sm text-gray-600">
                {materialFiles.length > 0 ? 'Add more files' : 'Upload learning materials (PDF, videos)'}
              </span>
              <input 
                type="file" 
                multiple 
                onChange={handleMaterialsChange} 
                className="hidden" 
              />
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {submitting ? (
                'Saving...'
              ) : (
                <>
                  <FiCheck className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCoursePage;