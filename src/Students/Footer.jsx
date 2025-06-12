import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { IoMdSchool } from 'react-icons/io';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <IoMdSchool className="text-3xl text-indigo-300" />
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                LMS Pro
              </h2>
            </div>
            <p className="text-indigo-200 text-sm leading-relaxed">
              Empowering your learning journey with world-class courses and expert instructors.
            </p>
            <div className="flex space-x-4 pt-2">
              {[
                { icon: <FaFacebookF />, label: "Facebook", url: "https://facebook.com" },
                { icon: <FaTwitter />, label: "Twitter", url: "https://twitter.com" },
                { icon: <FaInstagram />, label: "Instagram", url: "https://instagram.com" },
                { icon: <FaLinkedinIn />, label: "LinkedIn", url: "https://linkedin.com" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2 bg-indigo-800 hover:bg-indigo-600 rounded-full transition-all duration-300 transform hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-indigo-500 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", url: "/" },
                { name: "Courses", url: "/courses" },
                { name: "Pricing", url: "/pricing" },
                { name: "Blog", url: "/blog" },
                { name: "Success Stories", url: "/success-stories" },
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="text-indigo-200 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-indigo-400 rounded-full mr-2 group-hover:bg-white transition-colors"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-indigo-500 pb-2">Support</h3>
            <ul className="space-y-2">
              {[
                { name: "Help Center", url: "/help" },
                { name: "Terms of Service", url: "/terms" },
                { name: "Privacy Policy", url: "/privacy" },
                { name: "FAQ", url: "/faq" },
                { name: "Feedback", url: "/feedback" },
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="text-indigo-200 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-indigo-400 rounded-full mr-2 group-hover:bg-white transition-colors"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-indigo-500 pb-2">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaEnvelope className="mt-1 text-indigo-300" />
                <div>
                  <p className="text-indigo-200 text-sm">Email</p>
                  <a href="mailto:support@lmspro.com" className="text-white hover:underline">support@lmspro.com</a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FaPhoneAlt className="mt-1 text-indigo-300" />
                <div>
                  <p className="text-indigo-200 text-sm">Phone</p>
                  <a href="tel:+1234567890" className="text-white hover:underline">+1 (234) 567-890</a>
                </div>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="pt-4">
              <h4 className="text-sm font-medium mb-2">Subscribe to our newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 text-sm text-gray-900 bg-white rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-r transition-colors duration-200 text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-indigo-800 mt-12 pt-6 text-center text-indigo-300 text-sm">
          <p>
            &copy; {currentYear} LMS Pro. All rights reserved. | Designed with ❤️ for learners worldwide
          </p>
         
        </div>
      </div>
    </footer>
  );
};

export default Footer;