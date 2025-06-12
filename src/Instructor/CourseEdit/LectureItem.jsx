import React, { useEffect, useState } from 'react';
import { FiTrash2, FiVideo } from 'react-icons/fi';
import MaterialItem from './MaterialItem';
import axios from 'axios';
import { toast } from 'react-toastify';

const LectureItem = ({
  lecture,
  lectureIndex,
  sectionIndex,
  onUpdateLecture,
  onRemoveLecture,
  onMaterialsChange,
  onRemoveMaterial,
  onViewMaterial,
  sectionId,
  courseId,
  token
}) => {
  const [assignments, setAssignments] = useState([]);

  // Fetch assignments for this lecture
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!courseId || !sectionId || !lecture.id) return;
      try {
        const res = await axios.get('https://lms-backend-4b82.onrender.com/api/assignments', {
          params: {
            courseId,
            sectionId,
            lectureId: lecture.id,
          },
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(res.data);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchAssignments();
  }, [courseId, sectionId, lecture.id, token]);

  // Handler for generating assignment from lecture PDF
  const handleGenerateAssignment = async () => {
    const pdfMaterial = lecture.materials.find(mat => {
      const name = (mat.originalName || mat.filename || mat.name || '').toLowerCase();
      return name.endsWith('.pdf');
    });
    if (!pdfMaterial) {
      toast.error('No PDF material found in this lecture.');
      return;
    }
    if (pdfMaterial instanceof File) {
      toast.error('Please save the course first before generating assignments from newly uploaded PDFs.');
      return;
    }
    try {
      await axios.post(
        'https://lms-backend-4b82.onrender.com/api/assignments/generate',
        {
          materialFilename: pdfMaterial.filename,
          sectionId: sectionId,
          lectureId: lecture.id,
          courseId: courseId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Assignment generated from lecture PDF!');
      // Refresh assignments after generation
      const res = await axios.get('https://lms-backend-4b82.onrender.com/api/assignments', {
        params: {
          courseId,
          sectionId,
          lectureId: lecture.id,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to generate assignment from lecture PDF.'
      );
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-3 bg-white">
      <div className="flex justify-between items-center mb-3">
        <input
          type="text"
          value={lecture.title}
          onChange={(e) => onUpdateLecture(sectionIndex, lectureIndex, 'title', e.target.value)}
          className="bg-transparent font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-2 py-1 w-full max-w-md"
          placeholder="Lecture title"
        />
        <button
          type="button"
          onClick={() => onRemoveLecture(sectionIndex, lectureIndex)}
          className="text-red-500 hover:text-red-700 p-1 ml-2"
          title="Remove lecture"
        >
          <FiTrash2 size={16} />
        </button>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">Lecture Description</label>
        <textarea
          value={lecture.description}
          onChange={(e) => onUpdateLecture(sectionIndex, lectureIndex, 'description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          rows="2"
          placeholder="Describe this lecture..."
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
          <FiVideo className="mr-1" /> Video URL (optional)
        </label>
        <input
          type="text"
          value={lecture.videoUrl}
          onChange={(e) => onUpdateLecture(sectionIndex, lectureIndex, 'videoUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          placeholder="https://youtube.com/embed/..."
        />
      </div>

      {/* Lecture Materials */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h5 className="text-xs font-medium text-gray-700">Lecture Materials</h5>
          <label className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 cursor-pointer">
            <input 
              type="file" 
              multiple 
              onChange={(e) => onMaterialsChange(sectionIndex, lectureIndex, e)} 
              className="hidden" 
            />
            Add Materials
          </label>
        </div>

        {lecture.materials.length === 0 ? (
          <p className="text-xs text-gray-500">No materials added to this lecture yet.</p>
        ) : (
          <ul className="space-y-1">
            {lecture.materials.map((material, materialIndex) => (
              <MaterialItem
                key={materialIndex}
                material={material}
                onRemove={() => onRemoveMaterial(sectionIndex, lectureIndex, materialIndex)}
                onView={() => onViewMaterial(material)}
                isLectureMaterial
              />
            ))}
          </ul>
        )}
        {/* Generate Assignment Button */}
        <button
          type="button"
          className="inline-flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs mt-2"
          onClick={handleGenerateAssignment}
        >
          Generate Assignment from Lecture PDFs
        </button>
        {/* Show generated assignments for this lecture */}
        {assignments.length > 0 && (
          <div className="mt-3 bg-green-50 p-3 rounded">
            <h5 className="text-xs font-semibold text-green-700 mb-1">Generated Assignments</h5>
            {assignments.map((assignment, idx) => (
              <ol key={assignment._id || idx} className="list-decimal ml-5 text-green-900 mb-2">
                {assignment.questions?.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LectureItem;