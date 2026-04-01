
CREATE TABLE public.defects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resident_id UUID REFERENCES public.residents(id) ON DELETE CASCADE,
  receipt_no TEXT NOT NULL,
  location TEXT NOT NULL,
  mid_category TEXT,
  guide_items TEXT[] NOT NULL DEFAULT '{}',
  photo_count INTEGER NOT NULL DEFAULT 0,
  photo_data JSONB DEFAULT '[]',
  is_urgent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT '미배정',
  assigned_company TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.defects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read defects" ON public.defects FOR SELECT USING (true);
CREATE POLICY "Anyone can insert defects" ON public.defects FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update defects" ON public.defects FOR UPDATE USING (true);

CREATE TRIGGER update_defects_updated_at
  BEFORE UPDATE ON public.defects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_defects_resident ON public.defects(resident_id);
CREATE INDEX idx_defects_status ON public.defects(status);
CREATE INDEX idx_defects_receipt ON public.defects(receipt_no);
