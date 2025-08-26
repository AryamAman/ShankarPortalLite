'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Menu, Transition } from '@headlessui/react';
import { 
  LayoutDashboard, User, LogOut, ChevronDown, 
  Loader2, ShieldCheck, Droplets 
} from 'lucide-react';

// Avatar component with fallback to user's initial
const Avatar = ({ user }) => {
  if (user?.image) {
    return (
      <img
        src={user.image}
        alt="User Avatar"
        className="w-9 h-9 rounded-full border-2 border-gray-200"
      />
    );
  }
  
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';
  return (
    <div className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center bg-gray-200 text-black font-bold">
      {initial}
    </div>
  );
};

// Main Navbar Component
export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <nav className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo and Branding */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <LayoutDashboard className="w-7 h-7 text-black" />
            <h1 className="text-xl font-bold text-black">Hostel Complaints</h1>
          </Link>
        </div>

        {/* Main Navigation Links & User Menu */}
        <div className="flex items-center gap-4">
          {/* These links appear only when the user is logged in */}
          {status === 'authenticated' && (
            <div className="hidden md:flex items-center gap-4">
              {/* --- MODIFIED LINKS --- */}
              <Link 
                href="/watercoolers" 
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                Water Cooler Stats
              </Link>
              <Link 
                href="/student-profile" 
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                My Profile
              </Link>
            </div>
          )}

          {/* User Authentication Section */}
          <div>
            {status === 'loading' && <Loader2 className="w-6 h-6 animate-spin text-black" />}
            
            {status === 'unauthenticated' && (
              <button
                onClick={() => signIn('google')}
                className="px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Sign In
              </button>
            )}

            {status === 'authenticated' && (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-1 transition-colors">
                  <Avatar user={session.user} />
                  <ChevronDown className="w-4 h-4 text-black" />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-20">
                    <div className="px-4 py-2 border-b md:hidden">
                        <p className="font-bold text-sm truncate text-black">{session.user.name}</p>
                        <p className="text-xs truncate text-black">{session.user.email}</p>
                    </div>

                    {/* Links for mobile view */}
                    <div className="md:hidden">
                      <Menu.Item>
                          <Link href="/watercoolers" className="flex items-center gap-3 px-4 py-2 text-sm text-black hover:bg-gray-100">
                              <Droplets className="w-4 h-4" />
                              <span>Water Cooler Stats</span>
                          </Link>
                      </Menu.Item>
                      <Menu.Item>
                          <Link href="/student-profile" className="flex items-center gap-3 px-4 py-2 text-sm text-black hover:bg-gray-100">
                              <User className="w-4 h-4" />
                              <span>My Profile</span>
                          </Link>
                      </Menu.Item>
                    </div>
                    
                    {session.user.role === 'admin' && (
                      <>
                        <Menu.Item>
                          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-black hover:bg-gray-100">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link href="/admin/watercoolers" className="flex items-center gap-3 px-4 py-2 text-sm text-black hover:bg-gray-100">
                            <Droplets className="w-4 h-4" />
                            <span>Manage Coolers</span>
                          </Link>
                        </Menu.Item>
                      </>
                    )}
                    
                    <Menu.Item>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-black hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}