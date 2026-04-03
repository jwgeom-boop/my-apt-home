import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Info } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (userId === "132" && password === "1234") {
      localStorage.setItem("isLoggedIn", "true");
      toast.success("로그인 성공!");
      const onboarded = localStorage.getItem("onboarding_done");
      navigate(onboarded ? "/" : "/onboarding");
    } else {
      toast.error("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  // Window lit/unlit pattern (true = lit)
  const windowPattern = [
    true, false, true, true,
    false, true, false, true,
    true, true, false, false,
  ];

  return (
    <div className="bg-gradient-to-b from-[#0f1923] to-[#1a3c5e] flex flex-col items-center justify-between min-h-screen px-6">
      {/* Top Section */}
      <div className="flex-1 flex flex-col items-center justify-center pt-16 pb-8">
        {/* Building illustration */}
        <div className="w-32 h-32 bg-white/10 rounded-3xl flex items-center justify-center mb-8 border border-white/20 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-1.5">
            <div className="grid grid-cols-4 gap-1.5">
              {windowPattern.map((lit, i) => (
                <div
                  key={i}
                  className={`w-4 h-3 rounded-sm ${lit ? "bg-yellow-300/80" : "bg-white/20"}`}
                />
              ))}
            </div>
            <div className="w-5 h-6 bg-white/30 rounded-t-md mt-1" />
          </div>
        </div>

        {/* Brand text */}
        <h1 className="text-4xl font-black text-white tracking-tight">입주ON</h1>
        <p className="text-sm text-white/60 mt-2">아파트 입주 관리 플랫폼</p>
      </div>

      {/* Bottom Section */}
      <div className="w-full max-w-[390px] bg-white rounded-t-3xl px-6 pt-8 pb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-6">세대주 로그인</h2>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">아이디</label>
            <Input
              placeholder="아이디를 입력하세요"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="h-14 rounded-2xl border-gray-200 bg-gray-50 px-4 text-base focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">비밀번호</label>
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="h-14 rounded-2xl border-gray-200 bg-gray-50 px-4 text-base focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <Button
          onClick={handleLogin}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#0f1923] to-[#2e86c1] text-white font-bold text-base shadow-lg shadow-blue-900/30 active:scale-[0.98] transition-transform mt-6"
        >
          로그인
        </Button>

        <div className="bg-blue-50 rounded-2xl p-4 mt-6">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-blue-700">입주자 인증 안내</span>
          </div>
          <p className="text-xs text-blue-500 mt-1">
            세대주 휴대폰 번호로 등록된 아이디로 로그인하세요.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            데모 아이디: 132 / 비밀번호: 1234
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
