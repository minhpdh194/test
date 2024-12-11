import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

const links = [
  { name: "Bonus", link: "/bonus", image: "/images/menu/bonus.png" },
  { name: "Daily Tasks", link: "/earn", image: "/images/menu/daily-task.png" },
  { name: "Home", link: "/", image: "/images/menu/home.png" },
  { name: "Rating", link: "/rating", image: "/images/menu/rating.png" },
  { name: "Friends", link: "/friends", image: "/images/menu/friend.png" },
];

export default function AppBar() {
  const { pathname } = useLocation();
  return (
    <div className="fixed left-0 z-10 w-full px-0 py-0 bottom-0">
      <div className="flex items-center w-full p-2 gap-2 max-w-lg mx-auto bg-[#2B3969]">
        {links.map((link, key) => (
          link.name === 'Home' ? (
            <Link
              key={key}
              to={link.link}
              className={cn(
                "relative flex items-center rounded-xl flex-col justify-center font-bold text-xs gap-1 select-none flex-1 text-white",
                pathname === link.link && " text-white"
              )}
            >
              {link.image && (
                <img
                  src={link.image}
                  alt={link.name}
                  className={cn(
                    "w-18 h-18 object-contain filter absolute bottom-2",
                    pathname === link.link && "filter-none"
                  )}
                />
              )}
             
            </Link>
          ) : (
            <Link
              key={key}
              to={link.link}
              className={cn(
                "relative flex items-center rounded-xl flex-col justify-center font-bold text-xs py-1.5 gap-1 select-none flex-1 text-white",
                pathname === link.link && " text-white"
              )}
            >
              {link.image && (
                <img
                  src={link.image}
                  alt={link.name}
                  className={cn(
                    "w-7 h-7 object-contain filter",
                    pathname === link.link && "filter-none"
                  )}
                />
              )}
              <span>{link.name}</span>
            </Link>
          )
        ))}
      </div>
    </div>
  );
}
