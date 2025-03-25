import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const links = {
    product: [
      { name: 'Features', href: '#' },
      { name: 'FAQ', href: '#' },
      { name: 'Pricing', href: '#' },
      { name: 'Coming Soon', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
    ],
    books: [
      { name: '1984', href: '/book/1' },
      { name: 'Coming Soon', href: '#' },
    ],
  };
  
  return (
    <footer className="border-t border-[#1a3a5f]/10 bg-[#1a3a5f]/5">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Logo and info */}
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold text-[#1a3a5f]">
              <img 
                src="/images/Book Buddy Logo.svg" 
                alt="Book Buddy Logo" 
                className="h-8 w-auto" 
              />
            </Link>
            <p className="mt-4 text-sm text-gray-600 max-w-xs">
              Transforming how readers experience literature through meaningful conversations with characters and literary experts.
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="text-sm font-medium text-[#1a3a5f] uppercase tracking-wider">Product</h3>
            <ul className="mt-4 space-y-2">
              {links.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-600 hover:text-[#8b2439]">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-sm font-medium text-[#1a3a5f] uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              {links.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-600 hover:text-[#8b2439]">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-sm font-medium text-[#1a3a5f] uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-600 hover:text-[#8b2439]">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-[#1a3a5f]/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} BookBuddy. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-4 md:mt-0">
            Made with ❤️ for literary conversations
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
