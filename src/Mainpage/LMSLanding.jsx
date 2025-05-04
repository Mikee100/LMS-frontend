import React from 'react';
import { FaChalkboardTeacher, FaUserGraduate, FaLaptopCode, FaChartLine, FaComments, FaMobileAlt } from 'react-icons/fa';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function LMSLanding() {
  const navigate = useNavigate();
  const handeLogin = () => {
    navigate("/login");
    console.log("Login button clicked");
  };
  return (
    <div className="font-sans antialiased text-gray-900">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-24">
          <nav className="flex items-center justify-between mb-16">
            <div className="text-2xl font-bold">EduMaster</div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="hover:underline">Features</a>
              <a href="#how-it-works" className="hover:underline">How It Works</a>
              <a href="#testimonials" className="hover:underline">Testimonials</a>
              <a href="#pricing" className="hover:underline">Pricing</a>
            </div>
            <div className="space-x-4" onClick={handeLogin}>
              <button className="px-4 py-2 rounded-md border border-white hover:bg-white hover:text-indigo-600 transition">
                Login
              </button>
              <button className="px-4 py-2 rounded-md bg-white text-indigo-600 font-medium hover:bg-gray-100 transition">
                Sign Up
              </button>
            </div>
          </nav>

          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Learn Without Limits, Teach Without Boundaries
              </h1>
              <p className="text-xl mb-8 text-indigo-100">
                The modern learning platform that empowers both students and instructors to achieve more.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-md hover:bg-gray-100 transition flex items-center justify-center">
                  Start Learning <FiArrowRight className="ml-2" />
                </button>
                <button className="px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-indigo-700 transition flex items-center justify-center">
                  Teach With Us <FiArrowRight className="ml-2" />
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1581726707445-75cbe4efc586?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" 
                alt="Happy students learning" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Trusted By Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-500 mb-8">Trusted by leading institutions worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            <div className="text-2xl font-bold text-gray-700">Harvard</div>
            <div className="text-2xl font-bold text-gray-700">Stanford</div>
            <div className="text-2xl font-bold text-gray-700">MIT</div>
            <div className="text-2xl font-bold text-gray-700">Oxford</div>
            <div className="text-2xl font-bold text-gray-700">Google</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Designed for Everyone</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're a student hungry for knowledge or an instructor passionate about teaching, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Student Features */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <FaUserGraduate className="text-indigo-600 text-2xl" />
                </div>
                <h3 className="text-2xl font-bold">For Students</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Interactive courses with video, quizzes, and hands-on projects</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Personalized learning paths based on your goals</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Mobile app for learning on the go</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Community forums and peer support</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Certificates for completed courses</span>
                </li>
              </ul>
            </div>

            {/* Instructor Features */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <FaChalkboardTeacher className="text-purple-600 text-2xl" />
                </div>
                <h3 className="text-2xl font-bold">For Instructors</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Easy course creation tools with templates</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Student progress tracking and analytics</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Flexible monetization options</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Automated grading for assignments</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <span>Dedicated instructor support team</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started is simple, whether you want to learn or teach.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl text-center">
              <div className="bg-indigo-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <span className="text-indigo-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Sign Up</h3>
              <p className="text-gray-600">
                Create your free account as a student or instructor in just a few clicks.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl text-center">
              <div className="bg-indigo-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <span className="text-indigo-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Set Up Your Profile</h3>
              <p className="text-gray-600">
                Tell us about your learning goals or teaching expertise.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl text-center">
              <div className="bg-indigo-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <span className="text-indigo-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Start Learning or Teaching</h3>
              <p className="text-gray-600">
                Browse courses or create your first lesson immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Powerful Platform Features</h2>
              <div className="space-y-8">
                <div className="flex">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4 flex-shrink-0">
                    <FaLaptopCode className="text-indigo-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Interactive Learning</h3>
                    <p className="text-gray-600">
                      Engage with interactive coding exercises, quizzes, and projects that make learning stick.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="bg-purple-100 p-3 rounded-full mr-4 flex-shrink-0">
                    <FaChartLine className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
                    <p className="text-gray-600">
                      Visual dashboards show your learning progress and areas for improvement.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0">
                    <FaComments className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Community Support</h3>
                    <p className="text-gray-600">
                      Get help from instructors and peers in dedicated discussion forums.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="bg-blue-100 p-3 rounded-full mr-4 flex-shrink-0">
                    <FaMobileAlt className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Mobile Friendly</h3>
                    <p className="text-gray-600">
                      Learn anywhere with our iOS and Android apps that sync with the web platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <img 
                src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" 
                alt="Platform features" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 p-8 rounded-xl backdrop-filter backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-400 mr-4"></div>
                <div>
                  <h4 className="font-bold">Sarah Johnson</h4>
                  <p className="text-indigo-200">Computer Science Student</p>
                </div>
              </div>
              <p className="text-indigo-50">
                "I've completed 3 courses on this platform and the quality is outstanding. The interactive exercises helped me learn faster than any textbook."
              </p>
            </div>
            <div className="bg-white bg-opacity-10 p-8 rounded-xl backdrop-filter backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-400 mr-4"></div>
                <div>
                  <h4 className="font-bold">Michael Chen</h4>
                  <p className="text-indigo-200">Data Science Instructor</p>
                </div>
              </div>
              <p className="text-indigo-50">
                "Creating courses is so intuitive. The analytics help me understand where students struggle so I can improve my teaching."
              </p>
            </div>
            <div className="bg-white bg-opacity-10 p-8 rounded-xl backdrop-filter backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-400 mr-4"></div>
                <div>
                  <h4 className="font-bold">Emily Rodriguez</h4>
                  <p className="text-indigo-200">UX Design Student</p>
                </div>
              </div>
              <p className="text-indigo-50">
                "The mobile app lets me learn during my commute. I've gone from beginner to confident designer in just 6 months!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Learning Experience?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Join thousands of students and instructors already achieving their goals with our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition">
              Start Learning Free
            </button>
            <button className="px-8 py-4 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white hover:text-gray-900 transition">
              Teach With Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white text-lg font-bold mb-4">EduMaster</h4>
              <p className="mb-4">
                The modern learning platform for students and instructors.
              </p>
            </div>
            <div>
              <h4 className="text-white text-lg font-bold mb-4">For Students</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Browse Courses</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Mobile App</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-bold mb-4">For Instructors</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Teach on EduMaster</a></li>
                <li><a href="#" className="hover:text-white">Instructor Resources</a></li>
                <li><a href="#" className="hover:text-white">Teacher Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-700 text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} EduMaster. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}