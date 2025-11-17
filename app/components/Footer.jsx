import { Instagram } from "lucide-react";

const Footer = () => {
  const links = [
    { name: "PRIVACY POLICY", href: "/privacy" },
    { name: "COOKIE POLICY", href: "/cookies" },
  ];

  const socialIcons = [
    { icon: Instagram, href: "https://www.instagram.com/georgeyachts" },
  ];

  return (
    // CHANGED: Added fixed bottom-0 left-0 w-full z-40 to make the footer fixed
    <footer className=" w-full bg-black text-white py-8 px-4 sm:px-6 lg:px-8 z-40">
      <div className="max-w-[1530px] mx-auto flex flex-col md:flex-row md:justify-between items-center space-y-6 md:space-y-0">
        {/* 1. Social Icons (Left or Center on Mobile) */}
        <div className="flex space-x-6">
          {socialIcons.map((Social, index) => (
            <a
              key={index}
              href={Social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#CEA681] transition duration-200"
              aria-label={Social.name}
            >
              <Social.icon className="w-6 h-6" />
            </a>
          ))}
        </div>

        {/* 2. Policy Links (Center or Right on Mobile) */}
        <div className="flex space-x-6 text-xs font-bold">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="hover:text-[#CEA681] transition duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* 3. Copyright (Far Right on Desktop) */}
        <div className="text-xs text-white font-bold">
          &copy; {new Date().getFullYear()} GEORGE YACHTS. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
