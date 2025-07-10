import "@/Base.css";
import useAuth from "@/hooks/useAuth";
import { useNavigate, useParams } from "react-router";
import { LogOut } from "lucide-react";
import { NotFound } from "@/pages/NotFound";

export const Mypage: React.FC = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null); // Clear user state on logout
      navigate("/login"); // Redirect to home page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user || user.name !== username) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-sm w-full bg-white p-8 rounded-2xl shadow-xl text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
            {user?.name?.charAt(0).toUpperCase() || "?"}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          {user?.name || "No Name"}
        </h2>
        <p className="text-sm text-gray-500">{user?.email || "No Email"}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 mt-4 bg-red-600 text-white px-5 py-2.5 rounded-full hover:bg-red-500 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Mypage;
