// CourseStructureEditor.js
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';

import axios from 'axios';
import { 
  FiUpload, 
  FiFile, 
  FiImage, 
  FiX, 
  FiArrowLeft, 
  FiCheck, 
  FiPlus, 
  FiChevronDown, 
  FiChevronUp, 
  FiTrash2 
} from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SectionLockControl from './CourseEdit/SectionLockControl';
import LectureItem from './CourseEdit/LectureItem';
import MaterialItem from './CourseEdit/MaterialItem';

const CourseStructureEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
// Add this array at the top of your file or import from a constants file
const SUBJECT_OPTIONS = [
  { value: "Engineering", label: "Engineering" },
  { value: "Computer Science", label: "Computer Science" },
  { value: "Business", label: "Business" },
  { value: "Design", label: "Design" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "Marketing", label: "Marketing" },
  { value: "Science", label: "Science" },
  { value: "Arts", label: "Arts" },
  { value: "Other", label: "Other" }
];
  const [course, setCourse] = useState({
    title: '',
    description: '',
    subjects: '',
    level: '',
    thumbnail: null,
    price: 0,
    isFree: false,
    sections: [],
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

 const onDragEnd = (result) => {
  if (!result.destination) return;

  // Section drag
  if (result.type === 'SECTION') {
    setCourse(prev => {
      const sections = Array.from(prev.sections);
      const [removed] = sections.splice(result.source.index, 1);
      sections.splice(result.destination.index, 0, removed);
      return { ...prev, sections };
    });
  }

  // Lecture drag
  if (result.type === 'LECTURE') {
    const sectionId = result.source.droppableId;
    setCourse(prev => {
      const sections = prev.sections.map(section => {
        if (section.id !== sectionId) return section;
        const lectures = Array.from(section.lectures);
        const [removed] = lectures.splice(result.source.index, 1);
        lectures.splice(result.destination.index, 0, removed);
        return { ...section, lectures };
      });
      return { ...prev, sections };
    });
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

      let courseData = response.data;
     // Set preview image if thumbnail path exists
if (courseData.thumbnail?.path) {
  setPreviewImage(`http://localhost:5000/${courseData.thumbnail.path.replace(/\\/g, '/')}`);
}
console.log('Fetched course data:', courseData.thumbnail);
      // Normalize IDs and structure for sections and lectures
      courseData.sections = (courseData.sections || []).map(section => ({
        ...section,
        id: section.id && String(section.id).trim() ? String(section.id) : `${Date.now()}_${Math.random()}`,
        lectures: (section.lectures || []).map(lecture => ({
          ...lecture,
          id: lecture.id && String(lecture.id).trim() ? String(lecture.id) : `${Date.now()}_${Math.random()}`,
        })),
        isLocked: !!section.isLocked,
        price: section.price || 0,
        isFree: !!section.isFree,
        materials: section.materials || [],
      }));

      setCourse(courseData);

     

      // Expand all sections by default
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



  function normalizeSections(sections) {
  return (sections || []).map(section => ({
    ...section,
    id: section.id && String(section.id).trim() ? String(section.id) : `${Date.now()}_${Math.random()}`,
    lectures: (section.lectures || []).map(lecture => ({
      ...lecture,
      id: lecture.id && String(lecture.id).trim() ? String(lecture.id) : `${Date.now()}_${Math.random()}`,
    })),
    isLocked: !!section.isLocked,
    price: section.price || 0,
    isFree: !!section.isFree
  }));
}


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

  const toggleSectionLock = (sectionIndex) => {
    setCourse(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        isLocked: !updatedSections[sectionIndex].isLocked
      };
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  const toggleSectionFree = (sectionIndex) => {
    setCourse(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        isFree: !updatedSections[sectionIndex].isFree,
        // Reset price if making free
        price: updatedSections[sectionIndex].isFree ? updatedSections[sectionIndex].price : 0
      };
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  const updateSectionPrice = (sectionIndex, value) => {
    setCourse(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        price: parseFloat(value) || 0
      };
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

const addNewSection = () => {
  setCourse(prev => ({
    ...prev,
    sections: [
      ...prev.sections,
      {
        id: Date.now().toString(), // <-- unique id
        title: `Section ${prev.sections.length + 1}`,
        description: '',
        materials: [],
        lectures: [],
        isLocked: false,
        price: 0,
        isFree: true
      }
    ]
  }));
  setExpandedSections(prev => ({
    ...prev,
    [course.sections.length]: true
  }));
};

const addNewLecture = (sectionIndex) => {
  setCourse(prev => {
    const updatedSections = [...prev.sections];
    updatedSections[sectionIndex].lectures = [
      ...updatedSections[sectionIndex].lectures,
      {
        id: Date.now().toString(), // <-- unique id
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
const updateSection = (index, field, value) => {
  setCourse(prev => {
    const updatedSections = prev.sections.map((section, idx) => {
      if (idx !== index) return section;
      return {
        ...section,
        [field]: value
      };
    });
    return {
      ...prev,
      sections: updatedSections
    };
  });
};

const removeSection = (index) => {
  if (window.confirm('Are you sure you want to delete this section?')) {
    setCourse(prev => {
      const updatedSections = [...prev.sections];
      updatedSections.splice(index, 1);
      return {
        ...prev,
        sections: updatedSections
      };
    });
  }
};


const updateLecture = (sectionIndex, lectureIndex, field, value) => {
  setCourse(prev => {
    const updatedSections = prev.sections.map((section, sIdx) => {
      if (sIdx !== sectionIndex) return section;
      return {
        ...section,
        lectures: section.lectures.map((lecture, lIdx) => {
          if (lIdx !== lectureIndex) return lecture;
          return {
            ...lecture,
            [field]: value
          };
        })
      };
    });
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

const handleMaterialsChange = (sectionIndex, lectureIndex, e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  if (lectureIndex !== undefined) {
    updateLecture(sectionIndex, lectureIndex, 'materials', [
      ...(course.sections[sectionIndex].lectures[lectureIndex].materials || []),
      ...files
    ]);
  } else {
    updateSection(sectionIndex, 'materials', [
      ...(course.sections[sectionIndex].materials || []),
      ...files
    ]);
  }
};




  const removeMaterial = (sectionIndex, lectureIndex, materialIndex) => {
    if (lectureIndex !== undefined) {
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

const viewMaterial = (material) => {
  const token = localStorage.getItem('token');
  const fileUrl = `http://localhost:5000/api/courses/material/${material.filename}?token=${token}`;

  const isPDF = (material.originalName || material.filename)?.endsWith('.pdf');

  // No state updates, just open in a new tab
  setTimeout(() => {
    if (isPDF) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = material.originalName || material.filename;
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, 100);
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', course.title);
      formData.append('description', course.description);
      formData.append('subjects', JSON.stringify(course.subjects || []));
      formData.append('level', course.level);
      formData.append('price', course.price);
      formData.append('isFree', course.isFree);
      formData.append('sections', JSON.stringify(course.sections));

      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
course.sections.forEach((section, sectionIndex) => {
  section.materials.forEach((material) => {
    if (material instanceof File) {
      formData.append(`section_${sectionIndex}_material`, material);
    }
    // Don't append if it's already uploaded (has filename)
  });

         section.lectures.forEach((lecture, lectureIndex) => {
    lecture.materials.forEach((material) => {
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

// ...existing code...
return (
  <div className="max-w-6xl mx-auto p-4 sm:p-6">
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
  <label className="block text-sm font-medium text-gray-700 mb-1">Course Types / Subjects</label>
  <Select
    isMulti
    name="subjects"
    options={SUBJECT_OPTIONS}
    value={SUBJECT_OPTIONS.filter(opt => (course.subjects || []).includes(opt.value))}
    onChange={selected => {
      setCourse(prev => ({
        ...prev,
        subjects: selected.map(opt => opt.value)
      }));
    }}
    className="basic-multi-select"
    classNamePrefix="select"
    placeholder="Select one or more subjects..."
  />
  <p className="text-xs text-gray-500 mt-1">You can select multiple subjects.</p>
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
  <img
    src={previewImage}
    alt="Course thumbnail preview"
    className="h-32 w-32 rounded-lg object-cover border"
  />
) : course.thumbnail?.path ? (
  <img
    src={`http://localhost:5000/${course.thumbnail.path.replace(/\\/g, '/')}`}
    alt="Course thumbnail"
    className="h-32 w-32 rounded-lg object-cover border"
  />
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
        {/* Course Sections with Drag and Drop */}
        <DragDropContext onDragEnd={onDragEnd}>
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

            <Droppable droppableId="sections" type="SECTION" isDropDisabled={false}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-6"
                >
                  {course.sections.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No sections added yet. Add your first section to organize your course content.</p>
                    </div>
                  )}

                  {course.sections.map((section, sectionIndex) => (
                    <Draggable
                      key={section.id}
                      draggableId={section.id}
                      index={sectionIndex}
                      type="SECTION"
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <div
                            {...provided.dragHandleProps}
                            className={`px-4 py-3 flex justify-between items-center cursor-move ${section.isLocked ? 'bg-yellow-50' : 'bg-gray-50'}`}
                          >
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
                                className={`bg-transparent font-medium ${section.isLocked ? 'text-yellow-800' : 'text-gray-800'} focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-2 py-1`}
                              />
                              {section.isLocked && (
                                <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                                  Premium Content
                                </span>
                              )}
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
                              <SectionLockControl
                                isLocked={section.isLocked}
                                price={section.price}
                                isFree={section.isFree}
                                onToggleLock={() => toggleSectionLock(sectionIndex)}
                                onToggleFree={() => toggleSectionFree(sectionIndex)}
                                onPriceChange={(e) => updateSectionPrice(sectionIndex, e.target.value)}
                              />

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
                                    <input 
                                      type="file" 
                                      multiple 
                                      onChange={(e) => handleMaterialsChange(sectionIndex, undefined, e)} 
                                      className="hidden" 
                                    />
                                    Add Materials
                                  </label>
                                </div>

                                {section.materials.length === 0 ? (
                                  <p className="text-sm text-gray-500">No materials added to this section yet.</p>
                                ) : (
                                  <ul className="space-y-2">
                                    {section.materials.map((material, materialIndex) => (
                                      <MaterialItem
                                        key={materialIndex}
                                        material={material}
                                        onRemove={() => removeMaterial(sectionIndex, undefined, materialIndex)}
                                        onView={() => viewMaterial(material)}
                                      />
                                    ))}
                                  </ul>
                                )}
                              </div>

                              {/* Lectures Drag and Drop */}
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

                                <Droppable droppableId={section.id} type="LECTURE" isDropDisabled={false} >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className="space-y-3"
                                    >
                                      {section.lectures.length === 0 ? (
                                        <p className="text-sm text-gray-500">No lectures added to this section yet.</p>
                                      ) : (
                                        section.lectures.map((lecture, lectureIndex) => (
                                          <Draggable
                                            key={lecture.id}
                                            draggableId={lecture.id}
                                            index={lectureIndex}
                                            
                                          >
                                            {(provided) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                              >
                                                <LectureItem
                                                  key={lecture.id}
                                                  lecture={lecture}
                                                  lectureIndex={lectureIndex}
                                                  sectionIndex={sectionIndex}
                                                  onUpdateLecture={updateLecture}
                                                  onRemoveLecture={removeLecture}
                                                  onMaterialsChange={handleMaterialsChange}
                                                  onRemoveMaterial={removeMaterial}
                                                  onViewMaterial={viewMaterial}
                                                />
                                              </div>
                                            )}
                                          </Draggable>
                                        ))
                                      )}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </div>

                                  <div className="flex justify-end pt-4">
  <button
    type="button"
    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
    onClick={async () => {
  // Find the first PDF in section.materials
  const pdfMaterial = section.materials.find(
    (mat) =>
      ((mat.originalName || mat.filename || mat.name || '').toLowerCase().endsWith('.pdf'))
  );
  if (!pdfMaterial) {
    toast.error('No PDF material found in this section.');
    return;
  }
  if (pdfMaterial instanceof File) {
    toast.error('Please save the course first before generating assignments from newly uploaded PDFs.');
    return;
  }
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(
      'http://localhost:5000/api/assignments/generate',
      {
        materialFilename: pdfMaterial.filename,
        sectionId: section.id,
        courseId: id,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    toast.success('Assignment generated!');
    // Optionally, update state with the new assignment
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
        'Failed to generate assignment from PDF.'
    );
  }
}}
  >
    Generate Assignment from Section PDFs
  </button>
</div>

                              {/* End Lectures Drag and Drop */}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
        {/* End Course Sections with Drag and Drop */}

        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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