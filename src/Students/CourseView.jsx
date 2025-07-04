import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  FiFile, FiEye, FiDownload, FiCheckCircle, 
  FiAlertCircle, FiChevronRight, FiChevronDown,
  FiPlay, FiClock, FiBookOpen, FiLock, FiUnlock,
  FiDollarSign, FiShoppingCart, FiStar, FiArrowLeft
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import CourseProgressBar from './CourseProgressBar';
import Footer from './Footer';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51P1B7LCXIhVW50LesYpPi6AtOMCuxUu6vIOa9rXOiHshVmgIOR9MRTrS8QgvwOL1Q7W409Y0BwVkwZNwkOwGyKxt00htQVUS9I'); // Replace with your Stripe publishable key



const PaymentForm = ({ enrollmentId, amount, onPaymentSuccess, onPaymentError, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setPaymentError(null);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        'http://localhost:5000/api/payments/create-intent',
        { enrollmentId, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const clientSecret = data.clientSecret;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: "Customer Name"
          }
        }
      });

      if (result.error) {
        throw new Error(result.error.message);
      } else if (result.paymentIntent?.status === 'succeeded') {
        onPaymentSuccess();
        toast.success('Payment successful! You are now enrolled.');
        onClose();
      } else {
        throw new Error('Payment was not successful. Please try again.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Payment failed';
      setPaymentError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '10px 12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Close payment form"
          disabled={processing}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Complete Payment</h2>
          <p className="text-gray-600 mt-1">Secure payment processed by Stripe</p>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Amount:</span>
            <span className="text-2xl font-bold text-indigo-600">${amount.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
            <div className="border border-gray-200 rounded-lg p-3 hover:border-indigo-400 transition-colors bg-white">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          {paymentError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start border border-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{paymentError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!stripe || processing}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
              processing ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white disabled:opacity-70 disabled:cursor-not-allowed shadow-sm`}
          >
            {processing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </button>

          <div className="flex items-center justify-center mt-2 space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-gray-500">Payments are secure and encrypted</span>
          </div>
        </form>
      </div>
    </div>
  );
};
// Components
const CourseHeader = ({ course, enrolled, enrolling, onEnroll, progressPercent, onPaymentSuccess }) => {
  const navigate = useNavigate();
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState(null); // NEW: store enrollmentId

  useEffect(() => {
    if (!course) return;
    const fetchEnrolledStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/courses/${course._id}/enrollments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEnrolledStudents(response.data);
      } catch (err) {
        setError('Failed to load enrolled students');
      }
    };
    fetchEnrolledStudents();
  }, [course?._id]);

  const totalPremiumSections = course?.sections?.filter(s => s.isLocked && !s.isFree).length || 0;
  
  // Fix: parse price correctly if it's an object with $numberInt or $numberDouble
  let coursePrice = 0;
  if (course?.price) {
    if (typeof course.price === 'object') {
      if ('$numberInt' in course.price) {
        coursePrice = parseInt(course.price.$numberInt, 10);
      } else if ('$numberDouble' in course.price) {
        coursePrice = parseFloat(course.price.$numberDouble);
      }
    } else {
      coursePrice = course.price;
    }
  } else if (course?.isFree) {
    coursePrice = 0;
  }

  // NEW: handle paid enroll flow
  const handleEnrollClick = async () => {
    if (coursePrice > 0) {
      try {
        const token = localStorage.getItem('token');
        // Create enrollment and get enrollmentId
        const { data } = await axios.post(
          'http://localhost:5000/api/enroll/students',
          { courseId: course._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.enrollment && data.enrollment._id) {
          setEnrollmentId(data.enrollment._id);
          setShowPayment(true);
        } else {
          toast.error('Failed to create enrollment.');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to create enrollment.');
      }
    } else {
      onEnroll();
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    onPaymentSuccess();
  };

  const handlePaymentError = (message) => {
    toast.error(message);
  };

  return (
    <div className="mb-8 relative rounded-xl overflow-hidden shadow-lg">
      {/* Banner Image */}
      <div className="h-56 md:h-72 w-full relative">
        <img
          src={course.coverImage || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-blue-900/60" />
        {/* Header Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 flex flex-col justify-end p-6 md:p-10"
        >
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 flex items-center space-x-2 bg-indigo-700 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full px-3 py-1 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Go back"
          >
            <FiArrowLeft size={20} />
            <span className="text-sm font-semibold">Back</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow mb-2">{course.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-indigo-100 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
              course.level === 'advanced' ? 'bg-red-600/80' :
              course.level === 'intermediate' ? 'bg-yellow-500/80' :
              'bg-green-600/80'
            }`}>
              {course.level}
            </span>
            <span>{course.subject}</span>
            <span className="flex items-center"><FiStar className="mr-1 text-yellow-300" />{typeof course.rating === 'number' ? course.rating.toFixed(1) : 'N/A'}</span>
            <span>{enrolledStudents.length || 0} students</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {!enrolled ? (
              showPayment ? (
                <Elements stripe={stripePromise}>
                  <PaymentForm 
                    enrollmentId={enrollmentId} // FIXED: use real enrollmentId
                    amount={coursePrice} 
                    onPaymentSuccess={handlePaymentSuccess} 
                    onPaymentError={handlePaymentError} 
                    onClose={() => setShowPayment(false)}
                  />
                </Elements>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  disabled={enrolling}
                  className={`px-8 py-3 rounded-lg text-white font-medium text-lg transition-all shadow-md hover:shadow-lg ${
                    enrolling ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {enrolling ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enrolling...
                    </span>
              ) : coursePrice > 0 ? (
                <span className="flex items-center">
                  <FiShoppingCart className="mr-2" />
                  Enroll for ${coursePrice}
                </span>
              ) : (
                <span className="flex items-center">
                  <FiShoppingCart className="mr-2" />
                  Enroll for Free
                </span>
              )}
            </button>
              )
            ) : (
              <div className="flex items-center text-green-200 font-medium text-lg">
                <FiCheckCircle className="mr-2" size={24} />
                <span>You are enrolled in this course</span>
              </div>
            )}
                  {coursePrice > 0 && !enrolled && (
                    <div className="flex items-center bg-white/80 px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-900 font-semibold">
                      <FiDollarSign className="text-green-500 mr-2" />
                      ${coursePrice}
                    </div>
                  )}
          </div>
          {/* Progress Bar */}
          {enrolled && (
            <div className="mt-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-indigo-100">Course Progress</span>
                <span className="text-sm text-indigo-100">{progressPercent}%</span>
              </div>
              <div className="w-full bg-indigo-200/40 rounded-full h-3">
                <motion.div
                  className="bg-green-400 h-3 rounded-full transition-all"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.7 }}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const SectionItem = ({ section, isEnrolled, onUnlockSection, completedLectures, markLectureComplete, activeLectureId, setActiveLectureId }) => {
  const [expanded, setExpanded] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  const isLocked = section.isLocked && !section.isFree && !isEnrolled;
  const sectionPrice = section.price || 0;

  const handleUnlock = async () => {
    try {
      setUnlocking(true);
      await onUnlockSection(section._id, sectionPrice);
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden mb-4 ${
      isLocked ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
    }`}>
      <button
        onClick={() => !isLocked && setExpanded(!expanded)}
        className={`w-full flex justify-between items-center p-4 transition-colors ${
          isLocked ? 'bg-yellow-50 hover:bg-yellow-100 cursor-pointer' : 'bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center">
          {isLocked && (
            <FiLock className="mr-3 text-yellow-600 flex-shrink-0" />
          )}
          <span className={`font-medium text-lg ${
            isLocked ? 'text-yellow-800' : 'text-gray-800'
          }`}>
            {section.title}
          </span>
          {section.description && (
            <span className="ml-3 text-gray-500 text-sm hidden md:inline">
              {section.description}
            </span>
          )}
        </div>
        <div className="flex items-center">
          {isLocked ? (
            <span className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              <FiDollarSign className="mr-1" /> ${sectionPrice}
            </span>
          ) : (
            <>
              <span className="text-sm text-gray-500 mr-4 hidden sm:inline-flex items-center">
                <FiPlay className="mr-1" /> {section.lectures?.length || 0} lectures
              </span>
              <span className="text-sm text-gray-500 mr-4 hidden sm:inline-flex items-center">
                <FiFile className="mr-1" /> {section.materials?.length || 0} resources
              </span>
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FiChevronDown size={20} className="text-gray-600" />
              </motion.span>
            </>
          )}
        </div>
      </button>
      {/* Animate section content */}
      <AnimatePresence initial={false}>
        {isLocked ? (
          <motion.div
            key="locked"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white border-t border-yellow-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Premium Content</h4>
                  <p className="text-sm text-gray-600">
                    This section contains premium content. Unlock it to access all lectures and materials.
                  </p>
                </div>
                <button
                  onClick={handleUnlock}
                  disabled={unlocking}
                  className={`px-6 py-2 rounded-lg text-white font-medium ${
                    unlocking ? 'bg-yellow-500' : 'bg-yellow-600 hover:bg-yellow-700'
                  } whitespace-nowrap min-w-[120px] text-center`}
                >
                  {unlocking ? 'Processing...' : `Unlock for $${sectionPrice}`}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {expanded && (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-white border-t">
                  {section.description && (
                    <p className="text-gray-700 mb-4">{section.description}</p>
                  )}
                  {/* Section Materials */}
                  {isEnrolled && section.materials?.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <FiFile className="mr-2" /> Section Resources
                      </h4>
                      <div className="space-y-3">
                        {section.materials.map((material, matIndex) => (
                          <MaterialItem key={`section-mat-${matIndex}`} material={material} />
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Lectures */}
                  {section.lectures?.length > 0 ? (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <FiPlay className="mr-2" /> Lectures
                      </h4>
                      <div className="space-y-4">

{section.lectures.map((lecture, lectureIndex) => (
  <LectureItem
    key={`lecture-${lectureIndex}`}
    lecture={lecture}
    isEnrolled={isEnrolled}
    lectureNumber={lectureIndex + 1}
    completedLectures={completedLectures}
    markLectureComplete={markLectureComplete}
    activeLectureId={activeLectureId}
    setActiveLectureId={setActiveLectureId}
    isLocked={
      // Only allow opening if all previous lectures are completed
      lectureIndex > 0 &&
      !completedLectures.includes(section.lectures[lectureIndex - 1]._id)
    }
  />
))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm py-2">No lectures added yet</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </AnimatePresence>
    </div>
  );
};


const LectureItem = ({ lecture, isEnrolled, lectureNumber, completedLectures = [], markLectureComplete, activeLectureId, setActiveLectureId,isLocked }) => {
  const [expanded, setExpanded] = useState(false);
  const isCompleted = completedLectures.includes(lecture._id);
  const isActive = activeLectureId === lecture._id;

  const handleExpand = () => {
    setExpanded(!expanded);
    setActiveLectureId(lecture._id);
  };

 // 0758152148
  return (
    <div className={`border rounded-lg overflow-hidden transition-colors duration-200 mb-4
      ${isActive ? 'ring-2 ring-indigo-400 bg-indigo-50/70' : ''}
    `}>
      <button
        onClick={handleExpand}
        className={`w-full flex justify-between items-center p-4 transition-colors
          ${isActive ? 'bg-indigo-50' : 'bg-blue-50 hover:bg-blue-100'}
        `}
        disabled={isLocked}
      >
         <div className="flex items-center">
          <span className="font-medium text-gray-800">
            Lecture {lectureNumber}: {lecture.title}
          </span>
          {isLocked && (
            <FiLock className="ml-2 text-yellow-600" title="Complete previous lecture to unlock" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {isCompleted && (
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="text-green-600"
            >
              <FiCheckCircle size={18} />
            </motion.span>
          )}
          {expanded ? (
            <FiChevronDown size={18} className="text-gray-600" />
          ) : (
            <FiChevronRight size={18} className="text-gray-600" />
          )}
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-white border-t flex flex-col gap-6">
              {lecture.description && (
                <p className="text-gray-700 mb-2">{lecture.description}</p>
              )}
              {/* Video Content */}
              {lecture.videoUrl && isEnrolled && (
                <div className="w-full flex justify-center">
                  <div className="w-full max-w-3xl aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src={lecture.videoUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={lecture.title}
                    ></iframe>
                  </div>
                </div>
              )}
              {/* Lecture Materials */}
              {isEnrolled && lecture.materials?.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-800 mb-2 flex items-center text-sm">
                    <FiFile className="mr-2" /> Lecture Resources
                  </h5>
                  <div className="space-y-2">
                    {lecture.materials.map((material, matIndex) => (
                      <MaterialItem key={`lecture-mat-${matIndex}`} material={material} />
                    ))}
                  </div>
                </div>
              )}
              {isEnrolled && !isCompleted && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => markLectureComplete(lecture._id)}
                >
                  Mark as Done
                </motion.button>
              )}
              {isEnrolled && isCompleted && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-4 flex items-center text-green-600 font-medium"
                >
                  <FiCheckCircle className="mr-2" /> Completed
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MaterialItem = ({ material }) => {
  const isPDF = material.originalName?.endsWith('.pdf') || material.filename?.endsWith('.pdf');
  // Construct the file URL if not present
  const fileUrl = material.link
    ? material.link
    : material.path
      ? `http://localhost:5000/${material.path.replace(/\\/g, '/')}`
      : '#';

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center min-w-0">
        <FiFile className={`mr-3 ${isPDF ? 'text-red-500' : 'text-indigo-600'}`} size={18} />
        <div className="min-w-0">
          <span className="text-gray-800 block truncate" title={material.originalName || material.filename}>
            {material.originalName || material.filename}
          </span>
          <span className="text-xs text-gray-500">
            {material.contentType} • {Math.round((material.size || 0) / 1024)}KB
          </span>
        </div>
      </div>
      <button
        onClick={() => window.open(fileUrl, '_blank')}
        className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50 flex-shrink-0"
        title={isPDF ? 'View' : 'Download'}
      >
        {isPDF ? <FiEye size={18} /> : <FiDownload size={18} />}
      </button>
    </div>
  );
};

const CourseCurriculum = ({ course, isEnrolled, onUnlockSection, completedLectures, markLectureComplete, activeLectureId, setActiveLectureId }) => {
  const totalSections = course.sections?.length || 0;
  const totalLectures = course.sections?.reduce((sum, section) => sum + (section.lectures?.length || 0), 0) || 0;
  const totalMaterials = course.sections?.reduce((sum, section) => {
    return sum + 
      (section.materials?.length || 0) + 
      (section.lectures?.reduce((lecSum, lecture) => lecSum + (lecture.materials?.length || 0), 0) || 0);
  }, 0) || 0;
  
  const premiumSections = course.sections?.filter(s => s.isLocked && !s.isFree) || [];
  const freeSections = course.sections?.filter(s => !s.isLocked || s.isFree) || [];
const isCourseCompleted = completedLectures === totalLectures && totalLectures > 0;
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Course Curriculum</h2>
        <div className="flex space-x-4 text-sm text-gray-600">
          <span className="flex items-center">
            <FiBookOpen className="mr-1" /> {totalSections} sections
          </span>
          <span className="flex items-center">
            <FiPlay className="mr-1" /> {totalLectures} lectures
          </span>
          <span className="flex items-center">
            <FiFile className="mr-1" /> {totalMaterials} resources
          </span>
          {premiumSections.length > 0 && (
            <span className="flex items-center text-yellow-600">
              <FiLock className="mr-1" /> {premiumSections.length} premium
            </span>
          )}
        </div>
      </div>
      
      {course.sections?.length > 0 ? (
        <div className="space-y-4">
          {/* Free sections first */}
          {freeSections.map((section, index) => (
            <SectionItem 
              key={`section-${index}`} 
              section={section} 
              isEnrolled={isEnrolled}
              onUnlockSection={onUnlockSection}
              completedLectures={completedLectures}
              markLectureComplete={markLectureComplete}
                activeLectureId={activeLectureId}
              setActiveLectureId={setActiveLectureId}
            />
          ))}
          
          {/* Premium sections */}
          {premiumSections.map((section, index) => (
            <SectionItem 
              key={`premium-section-${index}`} 
              section={section} 
              isEnrolled={isEnrolled}
              onUnlockSection={onUnlockSection}
              completedLectures={completedLectures}
              markLectureComplete={markLectureComplete}
               activeLectureId={activeLectureId}
              setActiveLectureId={setActiveLectureId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <p>No curriculum available yet.</p>
        </div>
      )}
      {isCourseCompleted && (
  <div className="flex justify-center mt-8">
    <button
      className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
      onClick={() => {
        // Replace with your navigation logic to the next course
        window.location.href = "/courses"; // or use navigate("/courses/nextCourseId")
      }}
    >
      Go to Next Course
    </button>
  </div>
)}
    </div>
  );
};

const CourseDetails = ({ course }) => {
  const premiumSections = course.sections?.filter(s => s.isLocked && !s.isFree) || [];
  const coursePrice = course.isFree ? 0 : course.price || 0;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Course Details</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-xl text-indigo-800 mb-4 flex items-center">
            <FiBookOpen className="mr-2" /> About This Course
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {course.description || 'No additional description provided.'}
          </p>
          
          {premiumSections.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                <FiLock className="mr-2 text-yellow-600" /> Premium Content
              </h4>
              <p className="text-sm text-gray-600">
                This course contains {premiumSections.length} premium {premiumSections.length === 1 ? 'section' : 'sections'} 
                  {coursePrice > 0 ? ' included with your enrollment.' : ' available for free.'}
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-xl text-indigo-800 mb-4 flex items-center">
            <FiClock className="mr-2" /> Course Structure
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2 mt-1">•</span>
              <span className="text-gray-700">
                <span className="font-medium">{course.sections?.length || 0} Sections</span> covering key topics
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2 mt-1">•</span>
              <span className="text-gray-700">
                <span className="font-medium">
                  {course.sections?.reduce((sum, section) => sum + (section.lectures?.length || 0), 0) || 0} Lectures
                </span> with detailed explanations
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2 mt-1">•</span>
              <span className="text-gray-700">
                <span className="font-medium">
                  {course.sections?.reduce((sum, section) => sum + (section.materials?.length || 0), 0) || 0} Resources
                </span> for additional learning
              </span>
            </li>
            {premiumSections.length > 0 && (
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2 mt-1">•</span>
                <span className="text-gray-700">
                  <span className="font-medium">{premiumSections.length} Premium sections</span> with exclusive content
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

const InstructorSection = ({ instructor }) => {
  return (
    <div className="mb-12 bg-indigo-50 p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-indigo-900">About the Instructor</h2>
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-2xl font-bold">
          {instructor?.name?.charAt(0) || 'I'}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{instructor?.name || 'Instructor'}</h3>
          <p className="text-gray-600 mb-4">{instructor?.bio || 'No bio available'}</p>
          <div className="flex flex-wrap gap-2">
            {instructor?.expertise?.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-white text-indigo-700 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-12 bg-gray-200 rounded w-40 mt-6"></div>
        
        <div className="mt-12 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-start text-red-500">
        <FiAlertCircle className="mr-2 mt-1" size={20} />
        <div>
          <span className="font-medium">{error}</span>
          <button 
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 block"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const CourseView = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [unlockingSection, setUnlockingSection] = useState(false);
  const [error, setError] = useState(null);
   const [progress, setProgress] = useState({ completedLectures: [] });
  const [activeLectureId, setActiveLectureId] = useState(null);

  // Add handlePaymentSuccess handler to update enrollment state and refresh course data
  const handlePaymentSuccess = async () => {
    try {
      setEnrolled(true);
      const token = localStorage.getItem('token');
      const courseResponse = await axios.get(
        `http://localhost:5000/api/students/courses/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourse(courseResponse.data);
      toast.success('Payment successful! You are now enrolled.');
    } catch (err) {
      console.error('Error refreshing course after payment:', err);
      toast.error('Failed to refresh course data after payment.');
    }
  };

useEffect(() => {
  if (!course || !enrolled) return;
  const fetchProgress = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`http://localhost:5000/api/progress/${course._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProgress(res.data || { completedLectures: [] });
  };
  fetchProgress();
}, [course, enrolled]);




  const totalLectures = course?.sections?.reduce(
  (sum, section) => sum + (section.lectures?.length || 0), 0
) || 0;
const completedLectures = progress.completedLectures?.length || 0;
const progressPercent = totalLectures > 0
  ? Math.round((completedLectures / totalLectures) * 100)
  : 0;

  // Fetch course details and enrollment status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        const [courseResponse, enrollmentResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/students/courses/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:5000/api/enroll/students/status/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!courseResponse.data) {
          throw new Error('Course not found');
        }

        setCourse(courseResponse.data);
        setEnrolled(enrollmentResponse.data?.enrolled || false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);
const handleEnroll = async () => {
  try {
    setEnrolling(true);
    const token = localStorage.getItem('token');

    const response = await axios.post(
      `http://localhost:5000/api/enroll/students`,
      { courseId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.enrolled) {
      setEnrolled(true);
      // Refresh course data
      const courseResponse = await axios.get(
        `http://localhost:5000/api/students/courses/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourse(courseResponse.data);
      toast.success('Enrolled successfully!');
    }
  } catch (err) {
    console.error('Enrollment error:', err);
    setError(err.response?.data?.message || 'Failed to enroll in course');
    toast.error('Failed to enroll in course');
  } finally {
    setEnrolling(false);
  }
};

const handleUnlockSection = async (sectionId, price) => {
  try {
    setUnlockingSection(true);
    const token = localStorage.getItem('token');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setEnrolled(true);
    const courseResponse = await axios.get(
      `http://localhost:5000/api/students/courses/${courseId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCourse(courseResponse.data);
    setError(null);
    toast.success('Section unlocked!');
  } catch (err) {
    console.error('Unlock error:', err);
    setError(err.response?.data?.message || 'Failed to unlock section');
    toast.error('Failed to unlock section');
  } finally {
    setUnlockingSection(false);
  }
};

  const handleRetry = () => {
    window.location.reload();
  };

  

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  // Course not found state
  if (!course) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md text-center py-12">
        <p className="text-xl text-gray-500">Course not found</p>
      </div>
    );
  }

  // Main render
  return (
    <>
     <CourseProgressBar percent={progressPercent} />
    <div className="max-w-6xl mx-auto px-4 py-8">
      <CourseHeader 
        course={course} 
        enrolled={enrolled} 
        enrolling={enrolling} 
        onEnroll={handleEnroll} 
        progressPercent={progressPercent}
        onPaymentSuccess={handlePaymentSuccess} 
      />
      
      <div className="max-w-4xl mx-auto">
        <CourseDetails course={course} />
        
        {course.sections && (
          <CourseCurriculum 
  course={course} 
  isEnrolled={enrolled}
  onUnlockSection={handleUnlockSection}
  completedLectures={progress.completedLectures}
 markLectureComplete={async (lectureId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:5000/api/progress/complete', {
        courseId: course._id,
        lectureId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Show gamification feedback if available
      if (response.data.gamification) {
        const { pointsEarned, newAchievements, levelUp } = response.data.gamification;
        
        console.log('Gamification response:', response.data.gamification);
        console.log('New achievements:', newAchievements);
        
        if (pointsEarned > 0) {
          toast.success(`🎉 +${pointsEarned} points earned!`, {
            position: 'top-center',
            style: {
              background: '#4BB543',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold'
            }
          });
        }
        
        if (newAchievements && newAchievements.length > 0) {
          newAchievements.forEach(achievement => {
            console.log('Achievement object:', achievement);
            const achievementName = achievement.name || achievement.title || 'Unknown Achievement';
            toast.success(`🏆 Achievement Unlocked: ${achievementName}!`, {
              position: 'top-center',
              style: {
                background: '#FFD700',
                color: '#000',
                fontSize: '16px',
                fontWeight: 'bold'
              }
            });
          });
        }
        
        if (levelUp) {
          toast.success(`🚀 Level Up! You're now level ${levelUp.newLevel}!`, {
            position: 'top-center',
            style: {
              background: '#FF6B35',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold'
            }
          });
        }
      }
      
      // Refetch progress
      const res = await axios.get(`http://localhost:5000/api/progress/${course._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgress(res.data || { completedLectures: [] });
      toast.success('Lecture marked as complete!');
    } catch (error) {
      console.error('Error marking lecture complete:', error);
      toast.error('Failed to mark lecture as complete');
    }
  }}
    activeLectureId={activeLectureId}
            setActiveLectureId={setActiveLectureId}
/>
        )}
        
        {course.tutor && (
          <InstructorSection instructor={course.tutor} />
        )}
      </div>
     </div>

      <Footer />

     </>
  );
};

export default CourseView;