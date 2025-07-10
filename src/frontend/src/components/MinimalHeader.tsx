import { useNavigate } from "react-router";
import { Outlet } from "react-router";

export const MinimalHeader: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div
            onClick={() => navigate("/")}
            className="font-bold cursor-pointer text-blue-600 text-2xl sm:text-xl sm:leading-tight"
          >
            <span className="hidden sm:inline">📚 Book Shelf</span>
            <span className="inline sm:hidden leading-tight">
              Book
              <br />
              Shelf
            </span>
          </div>
        </div>
        <main>
          <Outlet />
        </main>
      </header>
    </>
  );
};
