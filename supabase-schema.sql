-- ============================================================
-- TholviTrader — Supabase Database Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ============================================================
-- 1. PROFILES  (extends auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free','tier1','tier2')),
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  telegram_username TEXT,
  telegram_access BOOLEAN DEFAULT false,
  banned BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. HELPER FUNCTIONS
-- ============================================================

-- Helper function: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. POLICIES FOR PROFILES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- ============================================================
-- 4. COURSES
-- ============================================================
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tier_required TEXT NOT NULL DEFAULT 'free' CHECK (tier_required IN ('free','tier1','tier2')),
  thumbnail_url TEXT,
  video_count INT DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published courses"
  ON public.courses FOR SELECT
  USING (published = true OR public.is_admin());

CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Course Sections
CREATE TABLE public.course_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  video_url TEXT,
  order_index INT NOT NULL DEFAULT 0
);

ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view course sections"
  ON public.course_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_sections.course_id
        AND (courses.published = true OR public.is_admin())
    )
  );

CREATE POLICY "Admins can manage course sections"
  ON public.course_sections FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- 5. TOOLS
-- ============================================================
CREATE TABLE public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tier_required TEXT NOT NULL DEFAULT 'free' CHECK (tier_required IN ('free','tier1','tier2')),
  thumbnail_url TEXT,
  video_count INT DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published tools"
  ON public.tools FOR SELECT
  USING (published = true OR public.is_admin());

CREATE POLICY "Admins can manage tools"
  ON public.tools FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Tool Sections
CREATE TABLE public.tool_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  video_url TEXT,
  order_index INT NOT NULL DEFAULT 0
);

ALTER TABLE public.tool_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tool sections"
  ON public.tool_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tools
      WHERE tools.id = tool_sections.tool_id
        AND (tools.published = true OR public.is_admin())
    )
  );

CREATE POLICY "Admins can manage tool sections"
  ON public.tool_sections FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- 6. BLOGS
-- ============================================================
CREATE TABLE public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  preview TEXT NOT NULL DEFAULT '',
  tier_required TEXT NOT NULL DEFAULT 'free' CHECK (tier_required IN ('free','tier1','tier2')),
  author TEXT NOT NULL DEFAULT 'TholviTrader',
  read_time INT DEFAULT 5,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blogs"
  ON public.blogs FOR SELECT
  USING (published = true OR public.is_admin());

CREATE POLICY "Admins can manage blogs"
  ON public.blogs FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- 7. PAYMENTS
-- ============================================================
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tier_requested TEXT NOT NULL CHECK (tier_requested IN ('free','tier1','tier2')),
  transaction_id TEXT NOT NULL,
  screenshot_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  rejection_reason TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can submit payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage payments"
  ON public.payments FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- 8. NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info','success','warning','payment')),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage notifications"
  ON public.notifications FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- 9. STORAGE BUCKET
-- ============================================================
-- Note: Some environments might require running these separately
-- or checking if the bucket exists.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- ============================================================
-- 10. SITE SETTINGS (Admin controllable)
-- ============================================================
CREATE TABLE public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  binance_qr_url TEXT,
  binance_id TEXT,
  telegram_bot_link TEXT,
  telegram_channel_link TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Insert default settings row
INSERT INTO public.site_settings (id, usdt_address) 
VALUES ('main', 'TQxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
ON CONFLICT (id) DO NOTHING;
