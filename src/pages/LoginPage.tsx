import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-navy flex flex-col">
      {/* Logo Area */}
      <div className="flex flex-col items-center pt-16 pb-8">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-3">
          <span className="text-white text-2xl font-bold">ON</span>
        </div>
        <h1 className="text-white text-xl font-bold">입주ON</h1>
      </div>

      {/* Form Area */}
      <div className="flex-1 bg-background rounded-t-3xl px-6 pt-8 pb-6 flex flex-col">
        <div className="space-y-5 flex-1">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">아이디</label>
            <Input
              placeholder="아이디를 입력하세요"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="h-12 rounded-xl border-border bg-muted/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">비밀번호</label>
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="h-12 rounded-xl border-border bg-muted/30"
            />
          </div>

          <Button
            onClick={handleLogin}
            className="w-full h-14 rounded-xl bg-navy hover:bg-navy/90 text-white text-base font-bold mt-2"
          >
            로그인
          </Button>
        </div>

        <div className="mt-6 bg-primary/10 border border-primary/20 rounded-xl p-4">
          <h3 className="text-sm font-bold text-navy mb-2">입주자 본인 인증 안내</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>· 초기 아이디: 132 / 비밀번호: 1234</li>
            <li>· 최초 1회 가입 후 자동 로그인 유지</li>
            <li>· 세대 정보는 시행사에서 등록한 기준 적용</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
