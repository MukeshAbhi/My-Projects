import React, { useState, useEffect, MouseEvent } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  content: JSX.Element;
};

const NavBar: React.FC<Props> = ({ content }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
      if (
        !target.closest('#sidebar') &&
        !target.closest('#open-sidebar')
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick as unknown as EventListener);
    return () => {
      document.removeEventListener('click', handleOutsideClick as unknown as EventListener);
    };
  }, []);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed bg-customOrange text-white w-56 h-screen overflow-y-auto transition-transform transform ease-in-out duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <h1 className="text-2xl font-semibold">Connect</h1>
          <ul className="mt-4">
            <li className="mb-2">
              <a href="/home" className="block hover:text-indigo-400">
                Home
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block hover:text-indigo-400">
                About
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block hover:text-indigo-400">
                Services
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="block hover:text-indigo-400">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <div className="bg-white shadow">
          <div className="container mx-auto">
            <div className="flex justify-between items-center py-4 px-4">
              <h1 className="text-xl font-semibold text-customOrange"><Link to={"/home"}>CommuneX</Link> </h1>
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-customOrange px-3">
                  <Link to="/avatars">Avatars</Link>
                </h1>
                <h1 className="text-xl font-semibold text-customOrange px-3">
                  <Link to="/maps">Maps</Link>
                </h1>
                <h1 className="text-xl font-semibold text-customOrange px-3">
                  <Link to="/space">Space</Link>
                </h1>
                <button
                  className="text-gray-500 hover:text-gray-600"
                  id="open-sidebar"
                  onClick={toggleSidebar}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {content}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
