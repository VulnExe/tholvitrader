-- ============================================================
-- TholviTrader — Seed Data
-- Run AFTER supabase-schema.sql
-- ============================================================
-- NOTE: The admin user must be created through Supabase Auth first.
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" > Create New User
--    Email: admin@tholvitrader.com
--    Password: Admin@123456
--    (Make sure "Auto Confirm User" is checked)
-- 3. Copy the user's UUID and replace <ADMIN_UUID> below
-- 4. Then run this seed script in the SQL Editor.

-- ============================================================
-- STEP 1: Promote the admin user
-- Replace <ADMIN_UUID> with the actual UUID from Auth > Users
-- ============================================================
-- UPDATE public.profiles
-- SET role = 'admin', tier = 'tier2', name = 'Admin'
-- WHERE id = '<ADMIN_UUID>';


-- ============================================================
-- STEP 2: Sample Courses
-- ============================================================
INSERT INTO public.courses (title, description, tier_required, video_count, published) VALUES
  ('Introduction to Trading', 'Learn the fundamentals of financial markets, how orders work, and the basic terminology every trader needs to know.', 'free', 3, true),
  ('Technical Analysis Mastery', 'Master chart patterns, indicators, and technical analysis tools used by professional traders to identify high-probability setups.', 'tier1', 8, true),
  ('Advanced Risk Management', 'Deep dive into position sizing, portfolio risk, drawdown management, and the mathematical frameworks behind professional risk management.', 'tier2', 6, true),
  ('Price Action Trading', 'Learn to read price charts without indicators. Understand candlestick patterns, support/resistance, and market structure.', 'tier1', 5, true),
  ('Options Trading Fundamentals', 'Understand options Greeks, strategies, and how to use options for hedging and speculation.', 'tier2', 7, true);

-- Course Sections (for "Introduction to Trading")
INSERT INTO public.course_sections (course_id, title, content, video_url, order_index)
SELECT c.id, s.title, s.content, s.video_url, s.order_index
FROM public.courses c
CROSS JOIN (VALUES
  ('What is Trading?', E'Trading is the act of buying and selling financial instruments.\n\n## Types of Markets\n- **Stock Market** — shares of companies\n- **Forex** — currency pairs\n- **Crypto** — digital assets\n- **Commodities** — gold, oil, etc.\n\n## Key Concepts\n- **Bulls vs Bears** — optimistic vs pessimistic outlook\n- **Bid/Ask Spread** — the difference between buy and sell prices\n- **Volume** — the number of shares traded', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 0),
  ('Understanding Orders', E'Orders are instructions to buy or sell a security.\n\n## Order Types\n- **Market Order** — execute immediately at current price\n- **Limit Order** — execute only at a specified price or better\n- **Stop Order** — triggers when price reaches a level\n- **Stop-Limit** — combination of stop and limit\n\n## Best Practices\n- Always use limit orders for entries\n- Use stop-loss orders to manage risk\n- Understand slippage in volatile markets', NULL, 1),
  ('Your First Trade', E'Setting up your first trade step by step.\n\n## Before You Trade\n- Choose a reputable broker\n- Start with a demo account\n- Define your risk tolerance\n\n## Making Your Trade\n1. Analyze the market\n2. Identify your entry point\n3. Set your stop-loss\n4. Determine position size\n5. Execute and monitor', NULL, 2)
) AS s(title, content, video_url, order_index)
WHERE c.title = 'Introduction to Trading';

-- Sections for "Technical Analysis Mastery"
INSERT INTO public.course_sections (course_id, title, content, video_url, order_index)
SELECT c.id, s.title, s.content, s.video_url, s.order_index
FROM public.courses c
CROSS JOIN (VALUES
  ('Chart Patterns', E'Understanding the most common chart patterns.\n\n## Reversal Patterns\n- **Head and Shoulders** — indicates trend reversal\n- **Double Top/Bottom** — strong reversal signal\n- **Triple Top/Bottom** — confirmation of reversal\n\n## Continuation Patterns\n- **Flags and Pennants** — short-term continuation\n- **Triangles** — ascending, descending, symmetrical\n- **Wedges** — rising and falling', NULL, 0),
  ('Moving Averages', E'How to use moving averages effectively.\n\n## Types\n- **SMA** — Simple Moving Average\n- **EMA** — Exponential Moving Average\n- **WMA** — Weighted Moving Average\n\n## Key Strategies\n- Golden Cross (50 SMA > 200 SMA)\n- Death Cross (50 SMA < 200 SMA)\n- Dynamic support/resistance levels', NULL, 1),
  ('RSI & MACD', E'Momentum indicators for timing entries.\n\n## RSI (Relative Strength Index)\n- Overbought above 70\n- Oversold below 30\n- Divergence signals\n\n## MACD\n- Signal line crossovers\n- Histogram analysis\n- Zero line crosses', NULL, 2)
) AS s(title, content, video_url, order_index)
WHERE c.title = 'Technical Analysis Mastery';


-- ============================================================
-- STEP 3: Sample Tools
-- ============================================================
INSERT INTO public.tools (title, description, tier_required, video_count, published) VALUES
  ('Position Size Calculator', 'Calculate the optimal position size for any trade based on your account size, risk percentage, and stop-loss distance.', 'free', 1, true),
  ('Risk/Reward Analyzer', 'Analyze your trade setups with precise risk-to-reward calculations. Input your entry, stop-loss, and take-profit to visualize potential outcomes.', 'tier1', 2, true),
  ('Trading Journal', 'Track all your trades, analyze your performance, identify patterns in your trading, and continuously improve your strategy.', 'tier1', 3, true),
  ('Market Scanner Pro', 'Scan markets for high-probability setups using custom filters based on technical indicators, volume, and price action patterns.', 'tier2', 4, true),
  ('Backtesting Engine', 'Test your trading strategies against historical data. Analyze win rates, drawdowns, and optimize your approach before risking real capital.', 'tier2', 5, true);

-- Tool Sections (for "Position Size Calculator")
INSERT INTO public.tool_sections (tool_id, title, content, video_url, order_index)
SELECT t.id, s.title, s.content, s.video_url, s.order_index
FROM public.tools t
CROSS JOIN (VALUES
  ('How Position Sizing Works', E'Position sizing is the most important aspect of risk management.\n\n## The Formula\n**Position Size = (Account Risk) / (Trade Risk per Share)**\n\n- **Account Risk** = Account Balance × Risk Percentage (usually 1-2%)\n- **Trade Risk** = Entry Price - Stop Loss Price\n\n## Example\n- Account: $10,000\n- Risk: 1% = $100\n- Entry: $50, Stop Loss: $48\n- Trade Risk: $2 per share\n- Position Size: $100 / $2 = 50 shares', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 0),
  ('Using the Calculator', E'Step-by-step guide to using our position size calculator.\n\n## Steps\n1. Enter your account balance\n2. Set your risk percentage (recommended: 1-2%)\n3. Enter your entry price\n4. Enter your stop-loss price\n5. The calculator shows your position size\n\n## Advanced Features\n- Multiple take-profit levels\n- Trailing stop calculations\n- Portfolio heat tracking', NULL, 1)
) AS s(title, content, video_url, order_index)
WHERE t.title = 'Position Size Calculator';

-- Tool Sections (for "Risk/Reward Analyzer")
INSERT INTO public.tool_sections (tool_id, title, content, video_url, order_index)
SELECT t.id, s.title, s.content, s.video_url, s.order_index
FROM public.tools t
CROSS JOIN (VALUES
  ('Understanding Risk/Reward', E'The risk-to-reward ratio is fundamental to profitable trading.\n\n## Why It Matters\n- A 1:2 R/R means you risk $1 to make $2\n- With 1:2 R/R, you only need 34% win rate to break even\n- Professional traders aim for minimum 1:2 R/R\n\n## Calculating R/R\n- **Risk** = Entry - Stop Loss\n- **Reward** = Take Profit - Entry\n- **R/R Ratio** = Reward / Risk', NULL, 0),
  ('Using the Analyzer', E'How to use our risk/reward analysis tool.\n\n## Features\n- Visual chart overlay\n- Multiple TP levels with partial exits\n- Expected value calculation\n- Kelly Criterion position sizing\n- Win rate sensitivity analysis', NULL, 1)
) AS s(title, content, video_url, order_index)
WHERE t.title = 'Risk/Reward Analyzer';


-- ============================================================
-- STEP 4: Sample Blogs
-- ============================================================
INSERT INTO public.blogs (title, content, preview, tier_required, author, read_time, published) VALUES
  (
    'Top 5 Mistakes New Traders Make',
    E'## Introduction\nEvery trader begins their journey with enthusiasm, but many fall into common traps that can be avoided.\n\n## 1. Trading Without a Plan\nThe most common mistake is entering trades without a clear strategy. A trading plan should include:\n- Entry and exit criteria\n- Risk management rules\n- Position sizing guidelines\n\n## 2. Over-Leveraging\nUsing too much leverage amplifies both gains and losses. Start small and increase position sizes gradually.\n\n## 3. Ignoring Risk Management\nNever risk more than 1-2% of your account on a single trade. This ensures survival through inevitable losing streaks.\n\n## 4. Revenge Trading\nAfter a loss, the urge to immediately recover can lead to poor decisions. Take a break and stick to your plan.\n\n## 5. Not Keeping a Journal\nWithout tracking your trades, you cannot learn from mistakes or identify what works.',
    'Every trader begins their journey with enthusiasm, but many fall into common traps that can be avoided with the right knowledge.',
    'free', 'TholviTrader', 5, true
  ),
  (
    'Understanding Market Structure',
    E'## What is Market Structure?\nMarket structure refers to the pattern of highs and lows that price creates as it moves.\n\n## Bullish Structure\n- Higher Highs (HH)\n- Higher Lows (HL)\n- Indicates upward momentum\n\n## Bearish Structure\n- Lower Highs (LH)\n- Lower Lows (LL)\n- Indicates downward momentum\n\n## Break of Structure (BOS)\nA BOS occurs when price breaks a significant swing point, signaling a potential trend change.\n\n## Key Concepts\n- **Order Blocks** — institutional supply/demand zones\n- **Fair Value Gaps** — inefficiencies in price\n- **Liquidity Pools** — areas where stop losses cluster',
    'Market structure is the foundation of price action trading. Understanding how highs and lows form gives you an edge.',
    'tier1', 'TholviTrader', 8, true
  ),
  (
    'Advanced Order Flow Analysis',
    E'## What is Order Flow?\nOrder flow analysis examines the actual buy and sell orders in the market to understand institutional activity.\n\n## Key Metrics\n- **Volume Profile** — shows where most trading occurs\n- **Delta** — difference between buying and selling volume\n- **Cumulative Delta** — running total of delta\n- **Footprint Charts** — granular order flow visualization\n\n## How Institutions Trade\nLarge players accumulate positions over time, often leaving footprints in the order flow data.\n\n## Practical Application\n1. Identify absorption at key levels\n2. Monitor aggressive buying/selling\n3. Track institutional positioning\n4. Combine with technical analysis',
    'Order flow analysis gives you a window into what institutional traders are doing. This advanced technique separates pros from amateurs.',
    'tier2', 'TholviTrader', 12, true
  ),
  (
    'Building a Profitable Trading Routine',
    E'## Morning Routine\n- Review overnight markets\n- Check economic calendar\n- Identify key levels on daily charts\n- Set alerts for potential setups\n\n## During Market Hours\n- Focus on 2-3 setups maximum\n- No trades in first 15 minutes\n- Follow your trading plan strictly\n\n## End of Day Review\n- Record all trades in journal\n- Screenshot charts with notes\n- Calculate daily P&L\n- Identify what went well and what needs improvement',
    'A consistent daily routine is what separates successful traders from those who burn out. Here is a proven framework.',
    'free', 'TholviTrader', 6, true
  );
