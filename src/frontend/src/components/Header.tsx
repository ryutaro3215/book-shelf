import "@/Base.css";
import useAuth from "@/hooks/useAuth";
import { useNavigate, Outlet } from "react-router";
import { Search } from "lucide-react";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div
            onClick={() => navigate("/")}
            className="font-bold cursor-pointer text-blue-600 text-2xl lg:text-3xl sm:text-xl sm:leading-tight"
          >
            <span className="hidden sm:inline">📚 Book Shelf</span>
            <span className="inline sm:hidden leading-tight">
              Book
              <br />
              Shelf
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div
              onClick={() => navigate("/search-book")}
              className="cursor-pointer"
            >
              <Search size={20} className="lg:w-6 lg:h-6" />
            </div>
            {!user ? (
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white px-4 py-2 text-sm lg:px-6 lg:py-3 lg:text-base rounded-full hover:bg-blue-500 transition"
              >
                Login
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate(`/${user.name}`)}
                  className="bg-gray-100 text-gray-800 px-4 py-2 text-sm lg:px-6 lg:py-3 lg:text-base rounded-full hover:bg-gray-200 transition"
                >
                  {user.name}
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 text-sm lg:px-6 lg:py-3 lg:text-base rounded-full hover:bg-red-500 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Header;
