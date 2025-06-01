import React, {useState, useEffect, useRef } from 'react';
import { FaChalkboardTeacher, FaUserGraduate, FaLaptopCode, FaChartLine, FaComments, FaMobileAlt } from 'react-icons/fa';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import AOS from 'aos';
import 'aos/dist/aos.css';
export default function LMSLanding() {
    const [navOpen, setNavOpen] = useState(false);
  const [students, setStudents] = useState(0);
  const [courses, setCourses] = useState(0);
  const [instructors, setInstructors] = useState(0);
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
const [highContrast, setHighContrast] = useState(false);
const [largeFont, setLargeFont] = useState(false);

  const navigate = useNavigate();

   useEffect(() => {
    function handleScroll() {
      if (!statsRef.current || hasAnimated) return;
      const rect = statsRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        setHasAnimated(true);
        animateValue(setStudents, 0, 10000, 1000);
        animateValue(setCourses, 0, 500, 1000);
        animateValue(setInstructors, 0, 100, 1000);
      }
    }
    window.addEventListener('scroll', handleScroll);
    // Run once in case already in view
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAnimated]);

  function animateValue(setter, start, end, duration) {
    let startTimestamp = null;
    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setter(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setter(end);
      }
    }
    window.requestAnimationFrame(step);
  }
    useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);
  const handeLogin = () => {
    navigate("/login");
    console.log("Login button clicked");
  };

  const courseStructuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Introduction to React",
    "description": "Learn the basics of React, including components, hooks, and state management.",
    "provider": {
      "@type": "Organization",
      "name": "EduMaster",
      "sameAs": "https://edumaster.example.com"
    }
  };

  return (
    <div className="font-sans antialiased text-gray-900">
      <Helmet>
        <title>EduMaster - Learn Without Limits, Teach Without Boundaries</title>
        <meta name="description" content="EduMaster is a modern learning platform for students and instructors. Explore interactive courses, instructor tools, and a vibrant community." />
        <meta name="keywords" content="online learning, courses, education, teaching, students, instructors, edumaster" />
        <meta property="og:title" content="EduMaster - Learn Without Limits, Teach Without Boundaries" />
        <meta property="og:description" content="EduMaster is a modern learning platform for students and instructors." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://edumaster.example.com" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1581726707445-75cbe4efc586?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" />
        <script type="application/ld+json">{JSON.stringify(courseStructuredData)}</script>
      </Helmet>
      {/* ...existing
      {/* Hero Section */}
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden">
        {/* Subtle background illustration */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg width="100%" height="100%" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
            <circle cx="700" cy="100" r="200" fill="#a5b4fc" />
            <circle cx="100" cy="300" r="150" fill="#c4b5fd" />
          </svg>
        </div>
        <div className="container mx-auto px-6 py-8 relative z-10">
          {/* Sticky Navbar */}
          <nav className="flex items-center justify-between mb-18 sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 z-20 py-4 px-2 rounded-b-lg shadow-lg">
            <div className="text-2xl font-bold">EduMaster</div>
            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="hover:underline">Features</a>
              <a href="#how-it-works" className="hover:underline">How It Works</a>
              <a href="#testimonials" className="hover:underline">Testimonials</a>
              <a href="#pricing" className="hover:underline">Pricing</a>
            </div>
            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                className="focus:outline-none"
                onClick={() => setNavOpen(!navOpen)}
                aria-label="Toggle navigation"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={navOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
    <div className="hidden md:flex flex-row items-center gap-4 ml-4">
  <button
    className="px-4 py-2 rounded-md border border-white hover:bg-white hover:text-indigo-600 transition"
    onClick={() => navigate("/login")}
    type="button"
  >
    Login
  </button>
  <button
    className="px-4 py-2 rounded-md bg-white text-indigo-600 font-medium hover:bg-gray-100 transition"
    onClick={() => navigate("/studentregistration")}
    type="button"
  >
    Sign Up
  </button>
</div>
          </nav>
          {/* Mobile Nav Dropdown */}
          {navOpen && (
            <div className="md:hidden bg-indigo-700 rounded-lg shadow-lg py-4 px-6 mb-4 z-30 relative">
              <a href="#features" className="block py-2 hover:underline" onClick={() => setNavOpen(false)}>Features</a>
              <a href="#how-it-works" className="block py-2 hover:underline" onClick={() => setNavOpen(false)}>How It Works</a>
              <a href="#testimonials" className="block py-2 hover:underline" onClick={() => setNavOpen(false)}>Testimonials</a>
              <a href="#pricing" className="block py-2 hover:underline" onClick={() => setNavOpen(false)}>Pricing</a>
              <div className="mt-4 flex space-x-2">
                <button
                  className="px-4 py-2 rounded-md border border-white hover:bg-white hover:text-indigo-600 transition w-full"
                  onClick={() => { setNavOpen(false); navigate("/login"); }}
                >
                  Login
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-white text-indigo-600 font-medium hover:bg-gray-100 transition w-full"
                  onClick={() => { setNavOpen(false); navigate("/studentregistration"); }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

          {/* Main Hero Content */}
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Learn Without Limits, Teach Without Boundaries
              </h1>
              {/* Tagline */}
              <p className="text-lg md:text-xl mb-8 text-indigo-100 italic">
                Empowering you to achieve more, wherever you are.
              </p>
              <button
                className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-md hover:bg-gray-100 transition flex items-center justify-center"
                onClick={() => navigate("/studentregistration")}
              >
                Start Learning <FiArrowRight className="ml-2" />
              </button>
              <button
                className="px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-indigo-700 transition flex items-center justify-center ml-4 mt-4 md:mt-0"
                onClick={() => navigate("/instregistration")}
              >
                Teach With Us <FiArrowRight className="ml-2" />
              </button>
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
      <section className="py-20 bg-white">
  <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
    <div className="md:w-1/2" data-aos="fade-right">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">See EduMaster in Action</h2>
      <p className="text-lg text-gray-600 mb-6">
        Watch this quick demo to discover how easy it is to learn and teach on our platform. Explore interactive courses, instructor tools, and our vibrant community!
      </p>
      <ul className="space-y-3 text-gray-700">
        <li className="flex items-center"><FiCheckCircle className="text-indigo-600 mr-2" /> Intuitive course navigation</li>
        <li className="flex items-center"><FiCheckCircle className="text-indigo-600 mr-2" /> Real-time progress tracking</li>
        <li className="flex items-center"><FiCheckCircle className="text-indigo-600 mr-2" /> Seamless instructor dashboard</li>
      </ul>
    </div>
    <div className="md:w-1/2 flex justify-center" data-aos="fade-left">
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg max-w-xl">
       <iframe
  width="100%"
  height="100%"
  src="https://www.youtube.com/embed/ezbJwaLmOeM?si=WntHquDwWB2-IiD9"
  title="EduMaster Platform Demo"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
  className="w-full h-full"
/>
      </div>
    </div>
  </div>
</section>

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
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Designed for Everyone</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're a student hungry for knowledge or an instructor passionate about teaching, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Student Features */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100" data-aos="fade-right">
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
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100" data-aos="fade-left">
              <div className="flex items-center mb-6" >
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

      
<section className="py-12 bg-white" ref={statsRef}>
        <div className="container mx-auto px-6 flex flex-wrap justify-center gap-12 text-center">
          <div>
            <div className="text-4xl font-bold text-indigo-600">
              {students.toLocaleString()}+
            </div>
            <div className="text-gray-600">Students</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-600">
              {courses.toLocaleString()}+
            </div>
            <div className="text-gray-600">Courses</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-600">
              {instructors.toLocaleString()}+
            </div>
            <div className="text-gray-600">Instructors</div>
          </div>
        </div>
      </section>
      {/* ...rest of 
      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started is simple, whether you want to learn or teach.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl text-center"data-aos="zoom-in" data-aos-delay="100">
              <div className="bg-indigo-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <span className="text-indigo-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Sign Up</h3>
              <p className="text-gray-600">
                Create your free account as a student or instructor in just a few clicks.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl text-center" data-aos="zoom-in" data-aos-delay="200">
              <div className="bg-indigo-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <span className="text-indigo-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Set Up Your Profile</h3>
              <p className="text-gray-600">
                Tell us about your learning goals or teaching expertise.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl text-center" data-aos="zoom-in" data-aos-delay="300">
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

{/* Featured Courses Section */}
<section className="py-20 bg-gray-50">
  <div className="container mx-auto px-6">
    <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center" data-aos="fade-up">
      Featured Courses
    </h2>
    <div className="grid md:grid-cols-3 gap-8">
      {/* Example featured course cards */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden" data-aos="fade-up" data-aos-delay="100">
        <img
          src="https://images.unsplash.com/photo-1517520287167-4bbf64a00d66?auto=format&fit=crop&w=400&q=80"
          alt="React for Beginners"
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="p-6">
          <h3 className="font-bold text-lg mb-2">React for Beginners</h3>
          <p className="text-gray-600 mb-4">Kickstart your web development journey with hands-on React projects and real-world examples.</p>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            onClick={() => navigate("/courses/1")}
          >
            View Course
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden" data-aos="fade-up" data-aos-delay="200">
        <img
          src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
          alt="Data Science Essentials"
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="p-6">
          <h3 className="font-bold text-lg mb-2">Data Science Essentials</h3>
          <p className="text-gray-600 mb-4">Master Python, statistics, and machine learning with this comprehensive data science course.</p>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            onClick={() => navigate("/courses/2")}
          >
            View Course
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden" data-aos="fade-up" data-aos-delay="300">
        <img
          src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80"
          alt="UX/UI Design Fundamentals"
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="p-6">
          <h3 className="font-bold text-lg mb-2">UX/UI Design Fundamentals</h3>
          <p className="text-gray-600 mb-4">Learn the principles of great design and create beautiful, user-friendly interfaces.</p>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            onClick={() => navigate("/courses/3")}
          >
            View Course
          </button>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Blog/Resources Preview Section */}
<section className="py-20 bg-white">
  <div className="container mx-auto px-6">
    <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center" data-aos="fade-up">
      Latest from Our Blog
    </h2>
    <div className="grid md:grid-cols-3 gap-8">
      {/* Example blog/resource cards */}
      <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden" data-aos="fade-up" data-aos-delay="100">
        <img
          src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80"
          alt="How to Stay Motivated While Learning Online"
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="p-6">
          <h3 className="font-bold text-lg mb-2">How to Stay Motivated While Learning Online</h3>
          <p className="text-gray-600 mb-4">Tips and tricks to keep your learning journey on track and enjoyable.</p>
          <a href="#" className="text-indigo-600 font-medium hover:underline">Read More</a>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden" data-aos="fade-up" data-aos-delay="200">
        <img
          src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80"
          alt="Top 5 Skills Employers Want in 2025"
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="p-6">
          <h3 className="font-bold text-lg mb-2">Top 5 Skills Employers Want in 2025</h3>
          <p className="text-gray-600 mb-4">Discover the most in-demand skills and how you can learn them on EduMaster.</p>
          <a href="#" className="text-indigo-600 font-medium hover:underline">Read More</a>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden" data-aos="fade-up" data-aos-delay="300">
        <img
          src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80"
          alt="Free Resources for Instructors"
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="p-6">
          <h3 className="font-bold text-lg mb-2">Free Resources for Instructors</h3>
          <p className="text-gray-600 mb-4">Access templates, guides, and tools to help you create amazing courses.</p>
          <a href="#" className="text-indigo-600 font-medium hover:underline">Read More</a>
        </div>
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
      <section className="py-12 bg-indigo-50">
  <div className="container mx-auto px-6 text-center">
    <h3 className="text-2xl font-bold mb-4">Stay Updated!</h3>
    <p className="mb-6 text-gray-600">Get the latest courses and platform updates in your inbox.</p>
    <form className="flex flex-col sm:flex-row justify-center gap-4">
      <input type="email" placeholder="Your email" className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none"/>
      <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Subscribe</button>
    </form>
  </div>
</section>

<section className="py-20 bg-gray-50">
  <div className="container mx-auto px-6">
    <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h4 className="font-semibold">How do I enroll in a course?</h4>
        <p className="text-gray-600">Simply sign up, browse courses, and click "Enroll".</p>
      </div>
      <div>
        <h4 className="font-semibold">Can I teach my own course?</h4>
        <p className="text-gray-600">Yes! Register as an instructor and start creating courses.</p>
      </div>
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