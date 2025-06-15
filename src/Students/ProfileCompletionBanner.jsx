import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const ProfileCompletionBanner = ({ profile }) => {
  const [visible, setVisible] = useState(true);
  const localStorageKey = 'profileCompletionBannerDismissed';

  useEffect(() => {
    const dismissed = localStorage.getItem(localStorageKey);
    if (dismissed === 'true') {
      setVisible(false);
    }
  }, []);

  if (!profile) return null;

  // Define the fields to check for completion
  const fieldsToCheck = [
    'firstName',
    'lastName',
    'email',
    'dateOfBirth',
    'studentId',
    'bio',
    'avatar',
  ];

  // socialLinks and contact are objects, check if they have any non-empty values
  const hasSocialLinks = profile.socialLinks && Object.values(profile.socialLinks).some(val => val && val.trim() !== '');
  const hasContact = profile.contact && Object.values(profile.contact).some(val => val && val.trim() !== '');

  // Count filled fields
  let filledCount = 0;
  fieldsToCheck.forEach(field => {
    if (profile[field] && profile[field].toString().trim() !== '') {
      filledCount++;
    }
  });
  if (hasSocialLinks) filledCount++;
  if (hasContact) filledCount++;

  const totalFields = fieldsToCheck.length + 2; // +2 for socialLinks and contact
  const completionPercent = Math.round((filledCount / totalFields) * 100);

  // If profile is fully complete or banner dismissed, do not show
  if (!visible || completionPercent === 100) return null;

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(localStorageKey, 'true');
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-100 border-yellow-400 border-b shadow-md z-50 flex items-center justify-between px-6 py-3">
      <div className="text-yellow-800 font-semibold">
        Your profile is {completionPercent}% complete. Please complete your profile for a better experience.
      </div>
      <button 
        onClick={handleDismiss} 
        aria-label="Dismiss profile completion banner"
        className="text-yellow-800 hover:text-yellow-900 focus:outline-none"
      >
        <FiX size={20} />
      </button>
    </div>
  );
};

export default ProfileCompletionBanner;
