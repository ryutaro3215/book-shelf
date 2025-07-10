import "@/Base.css";
import { useNavigate } from "react-router";
import { BookOpen, Search, Users } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-white">
      {/* Hero Section */}
      <section className="flex-grow flex flex-col justify-center items-center text-center py-20 px-4">
        <h2 className="text-5xl font-extrabold text-gray-800 mb-6">
          あなたの本棚を、どこでも管理
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl">
          BookShelfは、読みたい本・読んだ本を簡単に登録・整理できるオンライン本棚アプリです。
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-500 transition"
        >
          今すぐはじめる
        </button>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          <div>
            <Search className="mx-auto text-blue-600 w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">かんたん検索</h3>
            <p className="text-gray-600">
              Google Books API連携で、タイトルや著者名から瞬時に本を検索。
            </p>
          </div>
          <div>
            <BookOpen className="mx-auto text-blue-600 w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">本棚に追加</h3>
            <p className="text-gray-600">
              気になる本はワンクリックであなたの本棚に登録。
            </p>
          </div>
          <div>
            <Users className="mx-auto text-blue-600 w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">共有・管理</h3>
            <p className="text-gray-600">
              友人との本棚共有や、読書履歴の可視化も簡単に。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
