
-- 입주자 프로필 테이블
CREATE TABLE public.residents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL DEFAULT '101동 0102호',
  area TEXT NOT NULL DEFAULT '59㎡',
  complex_name TEXT NOT NULL DEFAULT 'oo아파트 101현장',
  phone TEXT NOT NULL DEFAULT '010-9876-5432',
  car_number TEXT DEFAULT '34나5678',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기/쓰기 가능 (데모용, 인증 추가 시 auth.uid() 기반으로 변경)
CREATE POLICY "Anyone can read residents" ON public.residents FOR SELECT USING (true);
CREATE POLICY "Anyone can update residents" ON public.residents FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert residents" ON public.residents FOR INSERT WITH CHECK (true);

-- 알림 설정 테이블
CREATE TABLE public.notification_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resident_id UUID REFERENCES public.residents(id) ON DELETE CASCADE NOT NULL,
  defect_status BOOLEAN NOT NULL DEFAULT true,
  payment BOOLEAN NOT NULL DEFAULT true,
  move_in BOOLEAN NOT NULL DEFAULT true,
  notice BOOLEAN NOT NULL DEFAULT false,
  event BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read notification_settings" ON public.notification_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can update notification_settings" ON public.notification_settings FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert notification_settings" ON public.notification_settings FOR INSERT WITH CHECK (true);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_residents_updated_at
  BEFORE UPDATE ON public.residents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at
  BEFORE UPDATE ON public.notification_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
