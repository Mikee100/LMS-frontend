import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUpload, FiFile, FiImage, FiX, FiArrowLeft, FiCheck, FiEye, FiDownload, FiPlus, FiChevronDown, FiChevronUp, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseStructureEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    title: '',
    description: '',
    subject: '',
    level: '',
    thumbnail: null,
    sections: [], // This will contain our course sections
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/students/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Initialize sections if they don't exist
        const courseData = response.data;
        if (!courseData.sections) {
          courseData.sections = [];
        }
        
        setCourse(courseData);
        
        // Set preview image if thumbnail exists
        if (courseData.thumbnail?.data) {
          const base64String = btoa(
            String.fromCharCode(...new Uint8Array(courseData.thumbnail.data.data || courseData.thumbnail.data)
          ));
          setPreviewImage(`data:image/jpeg;base64,${base64String}`);
        }

        // Initialize expanded state for sections
        const expanded = {};
        courseData.sections.forEach((_, index) => {
          expanded[index] = true;
        });
        setExpandedSections(expanded);
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

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Section management
  const addNewSection = () => {
    setCourse(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: `Section ${prev.sections.length + 1}`,
          description: '',
          materials: [],
          lectures: []
        }
      ]
    }));
    // Expand the new section by default
    setExpandedSections(prev => ({
      ...prev,
      [course.sections.length]: true
    }));
  };

  const updateSection = (index, field, value) => {
    setCourse(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[index] = {
        ...updatedSections[index],
        [field]: value
      };
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  const removeSection = (index) => {
    setCourse(prev => {
      const updatedSections = [...prev.sections];
      updatedSections.splice(index, 1);
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  // Lecture management
  const addNewLecture = (sectionIndex) => {
    setCourse(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex].lectures = [
        ...updatedSections[sectionIndex].lectures,
        {
          title: `Lecture ${updatedSections[sectionIndex].lectures.length + 1}`,
          description: '',
          materials: [],
          videoUrl: ''
        }
      ];
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  const updateLecture = (sectionIndex, lectureIndex, field, value) => {
    setCourse(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex].lectures[lectureIndex] = {
        ...updatedSections[sectionIndex].lectures[lectureIndex],
        [field]: value
      };
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  const removeLecture = (sectionIndex, lectureIndex) => {
    setCourse(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex].lectures.splice(lectureIndex, 1);
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  // Material management
  const handleMaterialsChange = (sectionIndex, lectureIndex, e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (lectureIndex !== undefined) {
      // Adding materials to a lecture
      updateLecture(sectionIndex, lectureIndex, 'materials', [
        ...course.sections[sectionIndex].lectures[lectureIndex].materials,
        ...files
      ]);
    } else {
      // Adding materials to a section
      updateSection(sectionIndex, 'materials', [
        ...course.sections[sectionIndex].materials,
        ...files
      ]);
    }
  };

  const removeMaterial = (sectionIndex, lectureIndex, materialIndex) => {
    if (lectureIndex !== undefined) {
      // Remove from lecture
      setCourse(prev => {
        const updatedSections = [...prev.sections];
        const updatedMaterials = [...updatedSections[sectionIndex].lectures[lectureIndex].materials];
        updatedMaterials.splice(materialIndex, 1);
        updatedSections[sectionIndex].lectures[lectureIndex].materials = updatedMaterials;
        return {
          ...prev,
          sections: updatedSections
        };
      });
    } else {
      // Remove from section
      setCourse(prev => {
        const updatedSections = [...prev.sections];
        const updatedMaterials = [...updatedSections[sectionIndex].materials];
        updatedMaterials.splice(materialIndex, 1);
        updatedSections[sectionIndex].materials = updatedMaterials;
        return {
          ...prev,
          sections: updatedSections
        };
      });
    }
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
      formData.append('sections', JSON.stringify(course.sections));

      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

      // Add all materials to formData
      course.sections.forEach((section, sectionIndex) => {
        section.materials.forEach((material, materialIndex) => {
          if (material instanceof File) {
            formData.append(`section_${sectionIndex}_material`, material);
          }
        });

        section.lectures.forEach((lecture, lectureIndex) => {
          lecture.materials.forEach((material, materialIndex) => {
            if (material instanceof File) {
              formData.append(`section_${sectionIndex}_lecture_${lectureIndex}_material`, material);
            }
          });
        });
      });

      const token = localStorage.getItem('token');

      await axios.put(`http://localhost:5000/api/courses/${id}/structured`, formData, {
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

  const downloadMaterial = async (materialId, filename) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/courses/material/${materialId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob'
        }
      );

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
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = material.originalName || material.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Edit Course Structure</h2>
        <p className="text-gray-600 mb-6">Organize your course into sections and lectures</p>

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

          {/* Course Sections */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Course Sections</h3>
              <button
                type="button"
                onClick={addNewSection}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiPlus className="mr-1" /> Add Section
              </button>
            </div>

            {course.sections.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No sections added yet. Add your first section to organize your course content.</p>
              </div>
            )}

            {course.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => toggleSection(sectionIndex)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedSections[sectionIndex] ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                    </button>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                      className="bg-transparent font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-2 py-1"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => removeSection(sectionIndex)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove section"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                {expandedSections[sectionIndex] && (
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section Description</label>
                      <textarea
                        value={section.description}
                        onChange={(e) => updateSection(sectionIndex, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        rows="3"
                        placeholder="Describe what this section covers..."
                      ></textarea>
                    </div>

                    {/* Section Materials */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-700">Section Materials</h4>
                        <label className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 cursor-pointer">
                          <FiUpload className="mr-1" /> Add Materials
                          <input 
                            type="file" 
                            multiple 
                            onChange={(e) => handleMaterialsChange(sectionIndex, undefined, e)} 
                            className="hidden" 
                          />
                        </label>
                      </div>

                      {section.materials.length === 0 ? (
                        <p className="text-sm text-gray-500">No materials added to this section yet.</p>
                      ) : (
                        <ul className="space-y-2">
                          {section.materials.map((material, materialIndex) => (
                            <li key={materialIndex} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center">
                                <FiFile className="text-indigo-600 mr-2" />
                                <span className="text-sm">
                                  {material.name || material.originalName || material.filename}
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                {material._id ? (
                                  <>
                                    <button
                                      onClick={() => viewMaterial(material)}
                                      className="text-indigo-600 hover:text-indigo-800 p-1"
                                      title={(material.originalName || material.filename)?.endsWith('.pdf') ? "View" : "Download"}
                                    >
                                      {(material.originalName || material.filename)?.endsWith('.pdf') ? (
                                        <FiEye size={16} />
                                      ) : (
                                        <FiDownload size={16} />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => removeMaterial(sectionIndex, undefined, materialIndex)}
                                      className="text-red-500 hover:text-red-700 p-1"
                                      title="Remove"
                                    >
                                      <FiX size={16} />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => removeMaterial(sectionIndex, undefined, materialIndex)}
                                      className="text-red-500 hover:text-red-700 p-1"
                                      title="Remove"
                                    >
                                      <FiX size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Lectures */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-700">Lectures</h4>
                        <button
                          type="button"
                          onClick={() => addNewLecture(sectionIndex)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          <FiPlus className="mr-1" /> Add Lecture
                        </button>
                      </div>

                      {section.lectures.length === 0 ? (
                        <p className="text-sm text-gray-500">No lectures added to this section yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {section.lectures.map((lecture, lectureIndex) => (
                            <div key={lectureIndex} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-3">
                                <input
                                  type="text"
                                  value={lecture.title}
                                  onChange={(e) => updateLecture(sectionIndex, lectureIndex, 'title', e.target.value)}
                                  className="bg-transparent font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-2 py-1"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeLecture(sectionIndex, lectureIndex)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                  title="Remove lecture"
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>

                              <div className="mb-3">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Lecture Description</label>
                                <textarea
                                  value={lecture.description}
                                  onChange={(e) => updateLecture(sectionIndex, lectureIndex, 'description', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                  rows="2"
                                  placeholder="Describe this lecture..."
                                ></textarea>
                              </div>

                              <div className="mb-3">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Video URL (optional)</label>
                                <input
                                  type="text"
                                  value={lecture.videoUrl}
                                  onChange={(e) => updateLecture(sectionIndex, lectureIndex, 'videoUrl', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                  placeholder="https://youtube.com/embed/..."
                                />
                              </div>

                              {/* Lecture Materials */}
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <h5 className="text-xs font-medium text-gray-700">Lecture Materials</h5>
                                  <label className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 cursor-pointer">
                                    <FiUpload className="mr-1" /> Add Materials
                                    <input 
                                      type="file" 
                                      multiple 
                                      onChange={(e) => handleMaterialsChange(sectionIndex, lectureIndex, e)} 
                                      className="hidden" 
                                    />
                                  </label>
                                </div>

                                {lecture.materials.length === 0 ? (
                                  <p className="text-xs text-gray-500">No materials added to this lecture yet.</p>
                                ) : (
                                  <ul className="space-y-1">
                                    {lecture.materials.map((material, materialIndex) => (
                                      <li key={materialIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                                        <div className="flex items-center">
                                          <FiFile className="text-indigo-600 mr-2" size={14} />
                                          <span className="text-xs">
                                            {material.name || material.originalName || material.filename}
                                          </span>
                                        </div>
                                        <div className="flex space-x-2">
                                          {material._id ? (
                                            <>
                                              <button
                                                onClick={() => viewMaterial(material)}
                                                className="text-indigo-600 hover:text-indigo-800 p-1"
                                                title={(material.originalName || material.filename)?.endsWith('.pdf') ? "View" : "Download"}
                                              >
                                                {(material.originalName || material.filename)?.endsWith('.pdf') ? (
                                                  <FiEye size={14} />
                                                ) : (
                                                  <FiDownload size={14} />
                                                )}
                                              </button>
                                              <button
                                                onClick={() => removeMaterial(sectionIndex, lectureIndex, materialIndex)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="Remove"
                                              >
                                                <FiX size={14} />
                                              </button>
                                            </>
                                          ) : (
                                            <>
                                              <button
                                                onClick={() => removeMaterial(sectionIndex, lectureIndex, materialIndex)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="Remove"
                                              >
                                                <FiX size={14} />
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
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
                  Save Course Structure
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseStructureEditor;