"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, User, Plus, Briefcase } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const pathname = usePathname();
  const { profile } = useAuth();

  // Navigation items
  const navItems = [
    { name: "Home", href: "/Dashboard", icon: Home },
    { name: "Explore", href: "/explore", icon: Search },
    { name: "Project", href: "/projects", icon: Briefcase },
    {
      name: "Profile",
      href: `/home/${profile?.role}/${profile?.username}`,
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-100 shadow-sm z-50">
      <div className="max-w-md mx-auto px-2">
        <div className="flex items-center justify-between h-16 relative">
          {/* Render navigation items */}
          {navItems.map((item, index) => (
            <React.Fragment key={item.name}>
              {/* Insert Create button in the middle */}
              {index === 2 && (
                <Link
                  href="/create"
                  className="absolute left-1/2 -translate-x-1/2 -top-6 bg-black hover:bg-gray-800 text-white rounded-full p-3 shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
                  aria-label="Create new post"
                >
                  <Plus className="h-6 w-6" strokeWidth={2} />
                </Link>
              )}

              {/* Navigation item */}
              <Link
                href={item.href}
                className="flex flex-col items-center justify-center flex-1"
              >
                <item.icon
                  className={pathname === item.href ? "text-black" : "text-gray-500"}
                  strokeWidth={pathname === item.href ? 2 : 1.5}
                  size={24}
                  fill={pathname === item.href ? "black" : "none"}
                />
                <span
                  className={`text-xs mt-1 ${
                    pathname === item.href ? "text-black" : "text-gray-500"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;