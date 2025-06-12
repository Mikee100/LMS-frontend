import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiX, FiLink, FiYoutube, FiFileText } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AddCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    level: 'beginner',
    thumbnail: null,
    materials: []
  });
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const MAX_FILE_SIZE_MB = 100;

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
  
    for (const file of files) {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > MAX_FILE_SIZE_MB) {
        toast.error(`${file.name} exceeds the 100MB limit.`);
        continue;
      }
      validFiles.push({
        type: file.type.includes('video') ? 'video' : 
              file.type === 'application/pdf' ? 'pdf' : 'other',
        file,
        name: file.name,
        size: sizeMB.toFixed(2) + 'MB',
        id: Date.now() + Math.random().toString(36).substr(2, 9)
      });
    }
  
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, ...validFiles]
    }));
  };
  

  const removeMaterial = (id) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m.id !== id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formPayload = new FormData();
      formPayload.append('title', formData.title);
      formPayload.append('description', formData.description);
      formPayload.append('subject', formData.subject);
      formPayload.append('level', formData.level);
      
      if (formData.thumbnail) {
        formPayload.append('thumbnail', formData.thumbnail);

      }
      
      // In your handleSubmit function, change how you append materials:
formData.materials.forEach((material) => {
  formPayload.append('materials', material.file);
  // Add brackets to field name
  });
      

      const response = await fetch('https://lms-backend-4b82.onrender.com/api/courses', {
        method: 'POST',
        body: formPayload,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      toast.success('Course created successfully!');
      navigate('/tutor/courses');
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error(error.message || 'Failed to create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMaterialIcon = (type) => {
    switch(type) {
      case 'video': return <FiYoutube className="text-red-500" />;
      case 'pdf': return <FiFileText className="text-blue-500" />;
      default: return <FiLink className="text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Create New Course</h2>
          <p className="text-gray-600 mt-1">Fill in the details to create a new learning experience</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Course Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail</label>
            <div className="flex items-center space-x-4">
              {formData.thumbnail ? (
                <div className="relative">
                  <img 
                    src={URL.createObjectURL(formData.thumbnail)} 
                    alt="Course thumbnail" 
                    className="h-32 w-56 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, thumbnail: null})}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg h-32 w-56 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors"
                  onClick={() => document.getElementById('thumbnail-upload').click()}
                >
                  <FiUpload className="text-gray-400 text-xl mb-2" />
                  <span className="text-sm text-gray-500">Upload thumbnail</span>
                  <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFormData({...formData, thumbnail: e.target.files[0]})}
                  />
                </div>
              )}
              <div className="text-sm text-gray-500">
                <p>Recommended size: 800x450px</p>
                <p>Formats: JPG, PNG, or GIF</p>
                <p>Max size: 5MB</p>
              </div>
            </div>
          </div>

          {/* Course Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Course Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Introduction to React"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Web Development"
                required
              />
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level *
              </label>
              <select
                id="level"
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Course Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Course Description *
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe what students will learn in this course..."
              required
            />
          </div>

          {/* Learning Materials */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Learning Materials
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                <FiUpload className="mr-1" /> Upload Files
              </button>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleFileUpload}
                accept=".pdf,.mp4,.mov,.avi,.doc,.docx,.ppt,.pptx"
                className="hidden"
              />
            </div>

            {formData.materials.length > 0 ? (
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                {formData.materials.map((material) => (
                  <div key={material.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        {getMaterialIcon(material.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate max-w-xs">
                          {material.name}
                        </p>
                        <p className="text-xs text-gray-500">{material.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMaterial(material.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FiUpload className="mx-auto text-gray-400 text-2xl mb-2" />
                <p className="text-sm text-gray-500">
                  Upload PDFs, videos, or other learning materials
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supported formats: PDF, MP4, DOC, PPT (Max 100MB each)
                </p>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/tutor/courses')}
              className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 rounded-lg font-medium text-white ${
                isSubmitting 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } transition-colors`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;