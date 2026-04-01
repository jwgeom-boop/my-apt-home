import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LoginPage = () => {
  const navigate = useNavigate();
  const [unitNumber, setUnitNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = () => {
    if (phone) setCodeSent(true);
  };

  const handleLogin = () => {
    navigate("/");
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
          {/* 세대번호 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">세대번호</label>
            <Input
              placeholder="예) 101동 0102호"
              value={unitNumber}
              onChange={(e) => setUnitNumber(e.target.value)}
              className="h-12 rounded-xl border-border bg-muted/30"
            />
          </div>

          {/* 연락처 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">연락처 (본인 명의)</label>
            <Input
              placeholder="010-0000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 rounded-xl border-border bg-muted/30"
            />
          </div>

          {/* 인증번호 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">인증번호</label>
            <div className="flex gap-2">
              <Input
                placeholder="6자리 입력"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="h-12 rounded-xl border-border bg-muted/30 flex-1"
              />
              <Button
                onClick={handleSendCode}
                className="h-12 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium whitespace-nowrap"
              >
                인증번호 발송
              </Button>
            </div>
            {codeSent && (
              <p className="text-xs text-primary">인증번호가 발송되었습니다.</p>
            )}
          </div>

          {/* 로그인 버튼 */}
          <Button
            onClick={handleLogin}
            className="w-full h-14 rounded-xl bg-navy hover:bg-navy/90 text-white text-base font-bold mt-2"
          >
            로그인
          </Button>
        </div>

        {/* 안내 카드 */}
        <div className="mt-6 bg-primary/10 border border-primary/20 rounded-xl p-4">
          <h3 className="text-sm font-bold text-navy mb-2">입주자 본인 인증 안내</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>· 세대주 명의 연락처로만 인증 가능</li>
            <li>· 최초 1회 가입 후 자동 로그인 유지</li>
            <li>· 세대 정보는 시행사에서 등록한 기준 적용</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
