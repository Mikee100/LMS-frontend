import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

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
          interests: data.interests || data.user?.interests || [],
          bio: data.bio || '',
          avatar: data.avatar || '',
          socialLinks: data.socialLinks || {},
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
console.log('Profile data:', profile);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put('/api/student-profile/me', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!profile) return <div className="p-8 text-center text-red-600">Profile not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      {editing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">First Name</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Last Name</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded p-2" disabled />
          </div>
          <div>
            <label className="block font-medium mb-1">Date of Birth</label>
            <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Student ID</label>
            <input name="studentId" value={form.studentId} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Interests (comma separated)</label>
            <input name="interests" value={form.interests.join(', ')} onChange={e => setForm({ ...form, interests: e.target.value.split(',').map(i => i.trim()) })} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Avatar URL</label>
            <input name="avatar" value={form.avatar} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">LinkedIn</label>
            <input name="linkedin" value={form.socialLinks.linkedin || ''} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: e.target.value } })} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">GitHub</label>
            <input name="github" value={form.socialLinks.github || ''} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, github: e.target.value } })} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Phone</label>
            <input name="phone" value={form.contact.phone || ''} onChange={e => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">Address</label>
            <input name="address" value={form.contact.address || ''} onChange={e => setForm({ ...form, contact: { ...form.contact, address: e.target.value } })} className="w-full border rounded p-2" />
          </div>
          <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded">Save</button>
          <button type="button" className="ml-4 px-6 py-2 bg-gray-300 rounded" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <div className="flex items-center mb-4">
            <img src={profile.avatar || 'https://ui-avatars.com/api/?name=Student'} alt="Avatar" className="w-16 h-16 rounded-full mr-4" />
            <div>
              <div className="font-bold text-lg">{form.firstName} {form.lastName}</div>
              <div className="text-gray-500 text-sm">{form.email}</div>
            </div>
          </div>
          <div className="mb-2"><span className="font-medium">Date of Birth:</span> {form.dateOfBirth || <span className="text-gray-400">N/A</span>}</div>
          <div className="mb-2"><span className="font-medium">Student ID:</span> {form.studentId || <span className="text-gray-400">N/A</span>}</div>
          <div className="mb-2"><span className="font-medium">Bio:</span> {form.bio || <span className="text-gray-400">No bio</span>}</div>
          <div className="mb-2"><span className="font-medium">Interests:</span> {form.interests?.join(', ') || <span className="text-gray-400">None</span>}</div>
          <div className="mb-2"><span className="font-medium">LinkedIn:</span> {form.socialLinks?.linkedin || <span className="text-gray-400">None</span>}</div>
          <div className="mb-2"><span className="font-medium">GitHub:</span> {form.socialLinks?.github || <span className="text-gray-400">None</span>}</div>
          <div className="mb-2"><span className="font-medium">Phone:</span> {form.contact?.phone || <span className="text-gray-400">None</span>}</div>
          <div className="mb-2"><span className="font-medium">Address:</span> {form.contact?.address || <span className="text-gray-400">None</span>}</div>
          <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded" onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
