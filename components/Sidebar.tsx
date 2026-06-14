"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  ArrowLeftRight,
  Wallet,
  Package,
  FileText,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Farmers",
      href: "/farmers",
      icon: Users,
    },
    {
      name: "Buyers",
      href: "/buyers",
      icon: ShoppingCart,
    },
    {
      name: "Transactions",
      href: "/transactions",
      icon: ArrowLeftRight,
    },
    {
      name: "Payments",
      href: "/payments",
      icon: Wallet,
    },
    {
      name: "Inventory",
      href: "/inventory",
      icon: Package,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: FileText,
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <aside className="w-80 min-h-screen bg-white border-r shadow-lg flex flex-col">
      
      {/* Logo Section */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={65}
            height={65}
            className="rounded-full"
          />

          <div>
            <h1 className="text-2xl font-bold text-[#1F5E3B]">
              AgriLedger ERP
            </h1>

            <p className="text-sm text-gray-500">
              Agricultural Trading ERP
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-5 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
                active
                  ? "bg-[#1F5E3B] text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={24} />

              <span className="text-lg font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-5">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl flex items-center justify-center gap-2 text-lg font-semibold"
        >
          <LogOut size={20} />
          Logout
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          © {new Date().getFullYear()} AgriLedger ERP
        </p>
      </div>
    </aside>
  );
}