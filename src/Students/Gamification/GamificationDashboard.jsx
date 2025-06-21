import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiAward, 
  FiTarget, 
  FiZap, 
  FiStar, 
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiBarChart,
  FiGift
} from 'react-icons/fi';

const GamificationDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchLeaderboard();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/gamification/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data.data);
    } catch (err) {
      setError('Failed to load gamification data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gamification/leaderboard/total?limit=10');
      setLeaderboard(response.data.data);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { profile, achievementsProgress, dailyChallenges, ranks, levelInfo } = dashboardData;

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'uncommon': return 'text-green-600 bg-green-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRarityBorder = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-200';
      case 'uncommon': return 'border-green-200';
      case 'rare': return 'border-blue-200';
      case 'epic': return 'border-purple-200';
      case 'legendary': return 'border-yellow-200';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gamification Center</h1>
          <p className="text-gray-600">Track your progress, earn achievements, and compete with others!</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FiStar className="text-indigo-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Level</p>
                <p className="text-2xl font-bold text-gray-900">{profile.level}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round(levelInfo.progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${levelInfo.progress}%` }}
                ></div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiZap className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Points</p>
                <p className="text-2xl font-bold text-gray-900">{profile.points.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Total earned: {profile.totalPointsEarned.toLocaleString()}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiTarget className="text-orange-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Streak</p>
                <p className="text-2xl font-bold text-gray-900">{profile.streaks.currentStreak} days</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Best: {profile.streaks.longestStreak} days</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiAward className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Achievements</p>
                <p className="text-2xl font-bold text-gray-900">{profile.achievements.length}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Keep going!</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: <FiBarChart /> },
                { id: 'achievements', label: 'Achievements', icon: <FiAward /> },
                { id: 'leaderboard', label: 'Leaderboard', icon: <FiGift /> },
                { id: 'challenges', label: 'Daily Challenges', icon: <FiTarget /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Learning Stats</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lectures Completed</span>
                          <span className="font-medium">{profile.statistics.lecturesCompleted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Courses Completed</span>
                          <span className="font-medium">{profile.statistics.coursesCompleted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Assignments Submitted</span>
                          <span className="font-medium">{profile.statistics.assignmentsSubmitted}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Performance</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Perfect Scores</span>
                          <span className="font-medium">{profile.statistics.perfectScores}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Social Interactions</span>
                          <span className="font-medium">{profile.statistics.socialInteractions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Days Active</span>
                          <span className="font-medium">{profile.statistics.daysActive}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Rankings</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Rank</span>
                          <span className="font-medium">#{ranks.total || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Weekly Rank</span>
                          <span className="font-medium">#{ranks.weekly || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'achievements' && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievementsProgress.map((achievement, index) => (
                      <motion.div
                        key={achievement.achievement._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white rounded-lg p-4 border-2 ${getRarityBorder(achievement.achievement.rarity)} ${
                          achievement.earned ? 'ring-2 ring-yellow-400' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-3xl">{achievement.achievement.icon}</div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.achievement.rarity)}`}>
                            {achievement.achievement.rarity}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{achievement.achievement.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{achievement.achievement.description}</p>
                        
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.threshold}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                achievement.earned ? 'bg-yellow-500' : 'bg-indigo-600'
                              }`}
                              style={{ width: `${achievement.percentage}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {achievement.achievement.pointsReward} points
                          </span>
                          {achievement.earned && (
                            <div className="flex items-center text-yellow-600">
                              <FiCheckCircle className="mr-1" />
                              <span className="text-sm font-medium">Earned</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'leaderboard' && (
                <motion.div
                  key="leaderboard"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {leaderboard && (
                    <div className="space-y-4">
                      {leaderboard.entries.map((entry, index) => (
                        <motion.div
                          key={entry.student._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold mr-4">
                              {index + 1}
                            </div>
                            <div className="flex items-center">
                              <img
                                src={entry.student.avatar || `https://ui-avatars.com/api/?name=${entry.student.firstName}+${entry.student.lastName}&background=random`}
                                alt={`${entry.student.firstName} ${entry.student.lastName}`}
                                className="w-10 h-10 rounded-full mr-3"
                              />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {entry.student.firstName} {entry.student.lastName}
                                </p>
                                <p className="text-sm text-gray-500">Level {entry.level}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{entry.points.toLocaleString()} pts</p>
                            <p className="text-sm text-gray-500">{entry.achievements} achievements</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'challenges' && (
                <motion.div
                  key="challenges"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dailyChallenges.map((challenge, index) => (
                      <motion.div
                        key={challenge.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white rounded-lg p-6 border-2 ${
                          challenge.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                          {challenge.completed && (
                            <div className="text-green-600">
                              <FiCheckCircle size={20} />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{challenge.description}</p>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{challenge.progress}/{challenge.target}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                challenge.completed ? 'bg-green-500' : 'bg-indigo-600'
                              }`}
                              style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {challenge.reward} points
                          </span>
                          <span className="text-xs text-gray-500">
                            {challenge.completed ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationDashboard; 