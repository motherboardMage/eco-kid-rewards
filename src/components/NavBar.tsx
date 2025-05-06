
import { useLocation, Link } from "react-router-dom";
import { Home, Camera, Gift, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Camera, label: "Camera", path: "/camera" },
    { icon: Gift, label: "Rewards", path: "/rewards" },
    { icon: Trophy, label: "Progress", path: "/progress" }
  ];

  return (
    <nav className="bg-white shadow-lg rounded-t-2xl">
      <div className="container mx-auto max-w-md">
        <div className="flex justify-around items-center py-3">
          {navItems.map((item) => (
            <NavItem 
              key={item.path}
              Icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={location.pathname === item.path}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};

interface NavItemProps {
  Icon: React.ElementType;
  label: string;
  path: string;
  isActive: boolean;
}

const NavItem = ({ Icon, label, path, isActive }: NavItemProps) => {
  return (
    <Link to={path} className="flex flex-col items-center">
      <div 
        className={cn(
          "p-2 rounded-xl transition-colors flex items-center justify-center",
          isActive 
            ? "bg-eco-green text-white" 
            : "text-gray-500 hover:bg-gray-100"
        )}
      >
        <Icon size={24} />
      </div>
      <span 
        className={cn(
          "text-xs mt-1",
          isActive ? "font-bold text-eco-green" : "text-gray-500"
        )}
      >
        {label}
      </span>
    </Link>
  );
};

export default NavBar;
