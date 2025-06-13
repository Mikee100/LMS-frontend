import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEdit, FiSave, FiX, FiLink, FiMail, FiPhone, FiMapPin, FiCalendar, FiUser, FiAward } from 'react-icons/fi';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    studentId: '',
    interests: [],
    bio: '',
    avatar: '',
    socialLinks: {},
    contact: {}
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/students/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(data);
        setForm({
          firstName: data.user?.firstName || '',
          lastName: data.user?.lastName || '',
          email: data.user?.email || '',
          dateOfBirth: data.user?.dateOfBirth ? new Date(data.user.dateOfBirth).toISOString().split('T')[0] : '',
          studentId: data.user?.studentId || '',
          interests: data.user.interests || data.user?.interests || [],
          bio: data.user.bio || '',
          avatar: data.user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.user?.firstName + ' ' + data.user?.lastName) + '&background=random',
          socialLinks: data.user.socialLinks || {},
          contact: data.contact || {}
        });
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
console.log('Profile:', profile);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put('http://localhost:5000/api/students/me', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(data);
      setEditing(false);
      toast.success('Profile updated successfully!', {
        position: 'top-center',
        style: {
          background: '#4BB543',
          color: '#fff',
        }
      });
    } catch (err) {
      toast.error('Failed to update profile', {
        position: 'top-center',
        style: {
          background: '#FF3333',
          color: '#fff',
        }
      });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        <h2 className="text-xl font-bold text-red-600 mb-4">Profile Not Found</h2>
        <p className="text-gray-600">We couldn't load your profile information. Please try again later.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative mb-4 sm:mb-0 sm:mr-6">
                <img 
                  src={form.avatar} 
                  alt="Profile" 
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover" 
                />
                {editing && (
                  <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <FiEdit className="text-indigo-600" />
                      <input 
                        id="avatar-upload" 
                        type="text" 
                        name="avatar" 
                        value={form.avatar} 
                        onChange={handleChange} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {form.firstName} {form.lastName}
                </h1>
                <p className="text-indigo-100">{form.email}</p>
                <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                  {form.studentId && (
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm flex items-center">
                      <FiAward className="mr-1" /> {form.studentId}
                    </span>
                  )}
                  {form.dateOfBirth && (
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm flex items-center">
                      <FiCalendar className="mr-1" /> {new Date(form.dateOfBirth).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {editing ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input 
                      name="firstName" 
                      value={form.firstName} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input 
                      name="lastName" 
                      value={form.lastName} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      name="email" 
                      type="email" 
                      value={form.email} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      disabled 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input 
                      name="dateOfBirth" 
                      type="date" 
                      value={form.dateOfBirth} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                    <input 
                      name="studentId" 
                      value={form.studentId} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interests (comma separated)</label>
                    <input 
                      name="interests" 
                      value={form.interests.join(', ')} 
                      onChange={e => setForm({ ...form, interests: e.target.value.split(',').map(i => i.trim()) })} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea 
                    name="bio" 
                    value={form.bio} 
                    onChange={handleChange} 
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                    <input 
                      name="avatar" 
                      value={form.avatar} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLink className="text-gray-400" />
                      </div>
                      <input 
                        name="linkedin" 
                        value={form.socialLinks.linkedin || ''} 
                        onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: e.target.value } })} 
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLink className="text-gray-400" />
                      </div>
                      <input 
                        name="github" 
                        value={form.socialLinks.github || ''} 
                        onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, github: e.target.value } })} 
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-400" />
                      </div>
                      <input 
                        name="phone" 
                        value={form.contact.phone || ''} 
                        onChange={e => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })} 
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className="text-gray-400" />
                      </div>
                      <input 
                        name="address" 
                        value={form.contact.address || ''} 
                        onChange={e => setForm({ ...form, contact: { ...form.contact, address: e.target.value } })} 
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setEditing(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center"
                  >
                    <FiX className="mr-2" /> Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shadow-md hover:shadow-lg"
                  >
                    <FiSave className="mr-2" /> Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Bio Section */}
                {form.bio && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">About Me</h3>
                    <p className="text-gray-700">{form.bio}</p>
                  </div>
                )}

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <FiUser className="mr-2 text-indigo-600" /> Personal Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="text-gray-500 w-32">Date of Birth</span>
                        <span className="text-gray-900">{form.dateOfBirth ? new Date(form.dateOfBirth).toLocaleDateString() : 'Not specified'}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-32">Student ID</span>
                        <span className="text-gray-900">{form.studentId || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <FiLink className="mr-2 text-indigo-600" /> Social Links
                    </h3>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="text-gray-500 w-32">LinkedIn</span>
                        {form.socialLinks?.linkedin ? (
                          <a href={form.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                            {form.socialLinks.linkedin.replace(/^https?:\/\//, '')}
                          </a>
                        ) : (
                          <span className="text-gray-400">Not specified</span>
                        )}
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-32">GitHub</span>
                        {form.socialLinks?.github ? (
                          <a href={form.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                            {form.socialLinks.github.replace(/^https?:\/\//, '')}
                          </a>
                        ) : (
                          <span className="text-gray-400">Not specified</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <FiMail className="mr-2 text-indigo-600" /> Contact Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="text-gray-500 w-32">Email</span>
                        <a href={`mailto:${form.email}`} className="text-indigo-600 hover:underline">{form.email}</a>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-32">Phone</span>
                        {form.contact?.phone ? (
                          <a href={`tel:${form.contact.phone}`} className="text-gray-900">{form.contact.phone}</a>
                        ) : (
                          <span className="text-gray-400">Not specified</span>
                        )}
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-32">Address</span>
                        <span className="text-gray-900">{form.contact?.address || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  {form.interests?.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {form.interests.map((interest, index) => (
                          <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => setEditing(true)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center shadow-md hover:shadow-lg"
                  >
                    <FiEdit className="mr-2" /> Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;