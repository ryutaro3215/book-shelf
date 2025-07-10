import Home from "@/pages/Home";
import { Mypage } from "@/pages/MyPage";
import LoginForm from "@/components/LoginForm";
import { NotFound } from "@/pages/NotFound";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SignUpForm from "@/components/SignUpForm";
import { MinimalHeader } from "@/components/MinimalHeader";
import { SearchBook } from "@/components/SearchBook";
import { BrowserRouter, Routes, Route } from "react-router";
import useAuth from "@/hooks/useAuth";

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          {/* Define your routes here */}
          <Route path="/" element={<Home />} />
          <Route path="/:username" element={<Mypage />} />
          <Route path="/search-book" element={<SearchBook />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<MinimalHeader />}>
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
