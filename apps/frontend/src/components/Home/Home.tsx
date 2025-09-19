import Menu from './Menu'
import PostSection from './PostSection'
import Trending from './Trending'
import { useState } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [showTrending, setShowTrending] = useState(false);

  return (
    <>
      <div className="flex h-screen">
        {/* Menu (hidden on mobile) */}
        <div className="hidden lg:block lg:w-1/5 border-r border-gray-200">
          <Menu />
        </div>

        {/* Mobile Menu Drawer */}
        {showMenu && (
          <div className="fixed inset-0 bg-white z-50 p-4">
            <button onClick={() => setShowMenu(false)} className="mb-4">
              <X size={24} />
            </button>
            <Menu />
          </div>
        )}

        {/* Post Section */}
        <div className="flex-1 lg:w-3/5">
          <Routes>
              <Route path="/" element={<PostSection />} />
              <Route path="/trending" element={<Trending />} />
            </Routes>
        </div>

        {/* Trending (hidden on mobile, full overlay when button clicked) */}
        <div className="hidden lg:block lg:w-1/5 border-l border-gray-200">
          <Trending />
        </div>

        {showTrending && (
          <div className="fixed inset-0 bg-white z-50 p-4">
            <button onClick={() => setShowTrending(false)} className="mb-4">
              <X size={24} />
            </button>
            <Trending />
          </div>
        )}

        {/* Mobile Bottom Buttons */}
        <div className="fixed top-4 right-4 flex gap-2 lg:hidden">
          <button
            className="p-3 bg-gray-800 text-white rounded-full shadow-lg"
            onClick={() => setShowMenu(true)}
          >
            <MenuIcon size={20} />
          </button>
          <button
            className="p-3 bg-blue-600 text-white rounded-full shadow-lg"
            onClick={() => setShowTrending(true)}
          >
            Trending
          </button>
        </div>
      </div>
    </>
  );
}
