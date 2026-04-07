import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Info } from "lucide-react";

const formatPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const maskPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 11) return phone;
  return `${digits.slice(0, 3)}-****-${digits.slice(7)}`;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(180);
  const [timerActive, setTimerActive] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = phone.replace(/\D/g, "");
  const isPhoneValid = digits.length === 11 && digits.startsWith("010");

  // Timer countdown
  useEffect(() => {
    if (!timerActive || timer <= 0) return;
    const id = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(id);
  }, [timerActive, timer]);

  useEffect(() => {
    if (timer <= 0 && timerActive) {
      setTimerActive(false);
    }
  }, [timer, timerActive]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setPhoneError("");
  };

  const handleSendOtp = () => {
    if (!digits.startsWith("010")) {
      setPhoneError("올바른 전화번호를 입력해주세요");
      return;
    }
    if (digits.length !== 11) return;
    setStep(2);
    setTimer(180);
    setTimerActive(true);
    setOtp(["", "", "", "", "", ""]);
    toast.success("인증번호가 발송되었습니다.");
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = useCallback((index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    setOtp(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleOtpKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handleVerify = () => {
    localStorage.setItem("isLoggedIn", "true");
    toast.success("인증이 완료되었습니다.");
    const onboarded = localStorage.getItem("onboarding_done");
    navigate(onboarded ? "/" : "/onboarding");
  };

  const handleResend = () => {
    setTimer(180);
    setTimerActive(true);
    setOtp(["", "", "", "", "", ""]);
    toast.success("인증번호가 재발송되었습니다.");
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const otpFilled = otp.every(d => d !== "");
  const timerText = `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`;

  const windowPattern = [
    true, false, true, true,
    false, true, false, true,
    true, true, false, false,
  ];

  return (
    <div className="bg-gradient-to-b from-[#0f1923] to-[#1a3c5e] flex flex-col items-center justify-between min-h-screen px-6">
      {/* Top Section */}
      <div className="flex-1 flex flex-col items-center justify-center pt-16 pb-8">
        <div className="w-32 h-32 bg-white/10 rounded-3xl flex items-center justify-center mb-8 border border-white/20 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-1.5">
            <div className="grid grid-cols-4 gap-1.5">
              {windowPattern.map((lit, i) => (
                <div key={i} className={`w-4 h-3 rounded-sm ${lit ? "bg-yellow-300/80" : "bg-white/20"}`} />
              ))}
            </div>
            <div className="w-5 h-6 bg-white/30 rounded-t-md mt-1" />
          </div>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">입주ON</h1>
        <p className="text-sm text-white/60 mt-2">아파트 입주 관리 플랫폼</p>
      </div>

      {/* Bottom Section */}
      <div className="w-full max-w-[390px] bg-white rounded-t-3xl px-6 pt-8 pb-12">
        {step === 1 ? (
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-6">전화번호 인증</h2>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">전화번호</label>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="010-0000-0000"
                value={phone}
                onChange={handlePhoneChange}
                onKeyDown={(e) => e.key === "Enter" && isPhoneValid && handleSendOtp()}
                className={`w-full h-14 rounded-2xl border bg-gray-50 px-4 text-base outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-blue-100 ${
                  phoneError ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                }`}
              />
              {phoneError && <p className="text-xs text-red-500 mt-1.5 px-1">{phoneError}</p>}
            </div>
            <Button
              onClick={handleSendOtp}
              disabled={!isPhoneValid}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#0f1923] to-[#2e86c1] text-white font-bold text-base shadow-lg shadow-blue-900/30 active:scale-[0.98] transition-transform mt-6 disabled:opacity-40"
            >
              인증번호 받기
            </Button>
            <div className="bg-blue-50 rounded-2xl p-4 mt-6">
              <div className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-blue-700">입주자 인증 안내</span>
              </div>
              <p className="text-xs text-blue-500 mt-1">
                등록된 세대주 휴대폰 번호로 인증번호가 발송됩니다.
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-2">인증번호 입력</h2>
            <p className="text-sm text-gray-500 mb-6">
              {maskPhone(phone)}로 인증번호를 발송했습니다
            </p>

            {/* OTP inputs */}
            <div className="flex gap-2 justify-center mb-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-colors"
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center mb-6">
              {timer > 0 ? (
                <span className="text-sm font-semibold text-blue-600">{timerText}</span>
              ) : (
                <span className="text-sm font-semibold text-red-500">인증 시간이 만료되었습니다. 재발송해주세요.</span>
              )}
            </div>

            <Button
              onClick={handleVerify}
              disabled={!otpFilled || timer <= 0}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#0f1923] to-[#2e86c1] text-white font-bold text-base shadow-lg shadow-blue-900/30 active:scale-[0.98] transition-transform disabled:opacity-40"
            >
              인증 확인
            </Button>

            <div className="flex items-center justify-center gap-4 mt-5">
              <button
                onClick={handleResend}
                disabled={timer > 0}
                className={`text-sm font-medium ${timer > 0 ? "text-gray-300 cursor-not-allowed" : "text-blue-600"}`}
              >
                인증번호 재발송
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => { setStep(1); setPhoneError(""); }}
                className="text-sm font-medium text-gray-500"
              >
                전화번호 변경
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
