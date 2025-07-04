

import React, { useState, useEffect } from 'react';
import { 
    FaBrain, 
    FaLightbulb, 
    FaChartLine, 
    FaBookOpen, 
    FaUsers, 
    FaStar,
    FaArrowRight,
    FaClock,
    FaBullseye,
    FaRocket,
    FaPlay,
    FaFire,
    FaCode,
    FaPalette,
    FaBriefcase,
    FaBullhorn,
    FaMusic,
    FaCamera,
    FaDumbbell,
    FaUtensils
} from 'react-icons/fa';
import { MdTrendingUp } from 'react-icons/md';
import { BiBrain } from 'react-icons/bi';
import { GiBrain } from 'react-icons/gi';

const AILearningAssistant = () => {
    const [activeTab, setActiveTab] = useState('recommendations');
    const [recommendations, setRecommendations] = useState([]);
    const [trendingCourses, setTrendingCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       
        setTimeout(() => {
            setRecommendations([
                {
                    _id: '1',
                    title: 'Advanced React Development',
                    description: 'Master React hooks, context, and advanced patterns',
                    category: 'Programming',
                    difficulty: 'intermediate',
                    duration: '6-8 hours',
                    rating: 4.8,
                    enrolledStudents: 1247
                },
                {
                    _id: '2',
                    title: 'UI/UX Design Fundamentals',
                    description: 'Learn the principles of modern design',
                    category: 'Design',
                    difficulty: 'beginner',
                    duration: '4-6 hours',
                    rating: 4.6,
                    enrolledStudents: 892
                },
                {
                    _id: '3',
                    title: 'Machine Learning Basics',
                    description: 'Introduction to AI and ML concepts',
                    category: 'Programming',
                    difficulty: 'intermediate',
                    duration: '8-10 hours',
                    rating: 4.9,
                    enrolledStudents: 2156
                },
                {
                    _id: '4',
                    title: 'Digital Marketing Mastery',
                    description: 'Complete guide to modern marketing strategies',
                    category: 'Marketing',
                    difficulty: 'beginner',
                    duration: '5-7 hours',
                    rating: 4.7,
                    enrolledStudents: 1834
                }
            ]);
            
            setTrendingCourses([
                {
                    _id: '5',
                    title: 'AI and Machine Learning Basics',
                    description: 'Introduction to AI concepts and applications',
                    category: 'Programming',
                    rating: 4.9,
                    enrolledStudents: 2156
                },
                {
                    _id: '6',
                    title: 'Digital Marketing Mastery',
                    description: 'Complete guide to modern marketing strategies',
                    category: 'Marketing',
                    rating: 4.7,
                    enrolledStudents: 1834
                },
                {
                    _id: '7',
                    title: 'Web Development Bootcamp',
                    description: 'Full-stack development from scratch',
                    category: 'Programming',
                    rating: 4.8,
                    enrolledStudents: 3421
                },
                {
                    _id: '8',
                    title: 'Graphic Design Masterclass',
                    description: 'Professional design techniques and tools',
                    category: 'Design',
                    rating: 4.6,
                    enrolledStudents: 1567
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const getSkillLevelColor = (level) => {
        const colors = {
            beginner: 'bg-green-100 text-green-800',
            intermediate: 'bg-blue-100 text-blue-800',
            advanced: 'bg-purple-100 text-purple-800'
        };
        return colors[level] || colors.intermediate;
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Programming': <FaCode className="text-blue-500" />,
            'Design': <FaPalette className="text-purple-500" />,
            'Business': <FaBriefcase className="text-green-500" />,
            'Marketing': <FaBullhorn className="text-orange-500" />,
            'Music': <FaMusic className="text-pink-500" />,
            'Photography': <FaCamera className="text-indigo-500" />,
            'Fitness': <FaDumbbell className="text-red-500" />,
            'Cooking': <FaUtensils className="text-yellow-500" />
        };
        return icons[category] || <FaBookOpen className="text-gray-500" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="h-96 bg-gray-300 rounded"></div>
                            <div className="h-96 bg-gray-300 rounded"></div>
                            <div className="h-96 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                            <GiBrain className="text-white text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">AI Learning Assistant</h1>
                            <p className="text-gray-600">Your personalized learning companion powered by AI</p>
                        </div>
                    </div>
                    
                    {/* Tab Navigation */}
                    <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
                        {[
                            { id: 'recommendations', label: 'Smart Recommendations', icon: <FaBrain /> },
                            { id: 'trending', label: 'Trending Courses', icon: <MdTrendingUp /> },
                            { id: 'insights', label: 'Learning Insights', icon: <FaChartLine /> }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {tab.icon}
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {activeTab === 'recommendations' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <FaLightbulb className="text-yellow-500 text-xl" />
                                    <h2 className="text-xl font-semibold text-gray-800">Personalized Recommendations</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {recommendations.map((course, index) => (
                                        <div key={course._id || index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 hover:shadow-md transition-all">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    {getCategoryIcon(course.category)}
                                                    <span className="text-sm font-medium text-gray-700">{course.category}</span>
                                                </div>
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(course.difficulty)}`}>
                                                    {course.difficulty}
                                                </div>
                                            </div>
                                            <h3 className="font-semibold text-gray-800 mb-2">{course.title}</h3>
                                            <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                                            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <FaClock />
                                                    {course.duration}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FaUsers />
                                                    {course.enrolledStudents}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FaStar className="text-yellow-400" />
                                                    {course.rating}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                    Based on your interests
                                                </span>
                                                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-md text-sm hover:shadow-md transition-all">
                                                    <FaPlay className="inline mr-1" />
                                                    Start Learning
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'trending' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <MdTrendingUp className="text-green-500 text-xl" />
                                    <h2 className="text-xl font-semibold text-gray-800">Trending Courses</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {trendingCourses.map((course, index) => (
                                        <div key={course._id || index} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100 hover:shadow-md transition-all">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <FaFire className="text-orange-500" />
                                                    <span className="text-sm font-medium text-gray-700">Trending</span>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    #{index + 1} in {course.category}
                                                </div>
                                            </div>
                                            <h3 className="font-semibold text-gray-800 mb-2">{course.title}</h3>
                                            <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>{course.enrolledStudents} students</span>
                                                <span className="flex items-center gap-1">
                                                    <FaStar className="text-yellow-400" />
                                                    {course.rating}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'insights' && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <FaChartLine className="text-purple-500 text-xl" />
                                    <h2 className="text-xl font-semibold text-gray-800">Learning Insights</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-800 mb-2">Learning Patterns</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Peak learning time:</span>
                                                <span className="font-medium">Evening (7-9 PM)</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Preferred duration:</span>
                                                <span className="font-medium">30-45 minutes</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Completion rate:</span>
                                                <span className="font-medium text-green-600">78%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-800 mb-2">Skill Progress</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Programming:</span>
                                                <span className="font-medium text-blue-600">Intermediate</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Design:</span>
                                                <span className="font-medium text-green-600">Advanced</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Business:</span>
                                                <span className="font-medium text-yellow-600">Beginner</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* AI Assistant Stats */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <BiBrain className="text-blue-500 text-xl" />
                                <h3 className="font-semibold text-gray-800">AI Assistant Stats</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Courses Analyzed</span>
                                    <span className="font-semibold text-blue-600">1,247</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Recommendations</span>
                                    <span className="font-semibold text-green-600">89%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Learning Paths</span>
                                    <span className="font-semibold text-purple-600">12</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <button className="w-full flex items-center gap-2 p-3 text-left bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition-all">
                                    <FaRocket className="text-blue-500" />
                                    <span className="text-sm">Generate Learning Path</span>
                                </button>
                                <button className="w-full flex items-center gap-2 p-3 text-left bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all">
                                   <FaBullseye className="text-green-500" />
                                    <span className="text-sm">Set Learning Goals</span>
                                </button>
                                <button className="w-full flex items-center gap-2 p-3 text-left bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-all">
                                    <FaChartLine className="text-purple-500" />
                                    <span className="text-sm">View Progress Report</span>
                                </button>
                            </div>
                        </div>

                        {/* Learning Tips */}
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                            <div className="flex items-center gap-2 mb-3">
                                <FaLightbulb className="text-yellow-600" />
                                <h3 className="font-semibold text-gray-800">AI Learning Tip</h3>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">
                                Based on your learning patterns, try studying in shorter 25-minute sessions with 5-minute breaks. This matches your optimal attention span!
                            </p>
                            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                Learn More <FaArrowRight className="inline ml-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AILearningAssistant; 

