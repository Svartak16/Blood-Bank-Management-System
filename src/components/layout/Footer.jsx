import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter,
  Mail,
  Phone,
  MapPin,
  Heart,
  ExternalLink
} from 'lucide-react';

const Footer = () => {
  const socialMedia = [
    {
      name: 'Facebook',
      icon: <Facebook className="h-6 w-6" />,
      url: 'https://facebook.com/lifelinkbloodbank',
      color: 'hover:text-blue-600 hover:scale-110'
    },
    {
      name: 'Instagram',
      icon: <Instagram className="h-6 w-6" />,
      url: 'https://instagram.com/lifelinkbloodbank',
      color: 'hover:text-pink-600 hover:scale-110'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="h-6 w-6" />,
      url: 'https://twitter.com/lifelinkbloodbank',
      color: 'hover:text-blue-400 hover:scale-110'
    }
  ];

  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5" />,
      text: '+60 11-123 4567',
      href: 'tel:+60111234567'
    },
    {
      icon: <Mail className="h-5 w-5" />,
      text: 'lifelinkbloodbank.com',
      href: 'mailto:info@lifelinkbloodbank.com'
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      text: 'Johor Bahru, Malaysia',
      href: 'https://maps.google.com'
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50">
    <div className="max-w-7xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      {/* Logo and Description */}
      <div className="mb-12 text-center animate-fade-in-up">
        <Link to="/" className="inline-block group">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-red-600 transition-transform duration-300 group-hover:scale-110 animate-pulse" />
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500
                         transition-all duration-300 group-hover:tracking-wider">
              LifeLink Blood Bank
            </span>
          </div>
        </Link>
        <p className="text-gray-600 max-w-md mx-auto animate-fade-in-up delay-100">
          Connecting donors to save lives. Every drop counts in our mission to ensure blood availability for those in need.
        </p>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* About Us */}
          <div className="animate-fade-in-up delay-200">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              About Us
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  About LifeLink
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/FAQs" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up delay-300">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/register" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  Become a Donor
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  Blood Drives
                </Link>
              </li>
              <li>
                <Link to="/directory" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  Blood Banks
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="animate-fade-in-up delay-400">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in-up delay-500">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Contact Info
            </h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index}>
                  <a href={item.href}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center gap-2 text-gray-600 hover:text-red-600 
                              transition-all duration-300 group hover:translate-x-1">
                    <span className="transition-transform duration-300 group-hover:rotate-12">
                      {item.icon}
                    </span>
                    <span>{item.text}</span>
                    {item.href.startsWith('http') && (
                      <ExternalLink className="h-4 w-4 transition-transform duration-300 
                                           group-hover:translate-x-1 group-hover:-translate-y-1" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media and Copyright */}
        <div className="border-t border-gray-200 pt-8 animate-fade-in-up delay-600">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex space-x-6">
              {socialMedia.map((social) => (
                <a key={social.name}
                   href={social.url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className={`text-gray-400 transition-all duration-300 transform 
                             hover:scale-110 hover:-translate-y-1 ${social.color}`}
                   aria-label={social.name}>
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="text-gray-500 text-center">
              © {new Date().getFullYear()} LifeLink Blood Bank. Made with{' '}
              <Heart className="h-4 w-4 inline text-red-500 animate-pulse" /> in Malaysia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;