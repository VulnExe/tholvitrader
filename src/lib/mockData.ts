import { User, Course, Blog, Payment, AdminStats, CourseProgress, Notification } from './types';

// ============ MOCK USERS ============
export const mockUsers: User[] = [
    {
        id: '1',
        email: 'admin@tholvitrader.com',
        name: 'Admin',
        tier: 'tier2',
        role: 'admin',
        telegramUsername: '@tholvi_admin',
        telegramAccess: true,
        banned: false,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
    },
    {
        id: '2',
        email: 'john@example.com',
        name: 'John Doe',
        tier: 'free',
        role: 'user',
        telegramAccess: false,
        banned: false,
        createdAt: '2025-02-01T00:00:00Z',
        updatedAt: '2025-02-01T00:00:00Z',
    },
    {
        id: '3',
        email: 'jane@example.com',
        name: 'Jane Smith',
        tier: 'tier1',
        role: 'user',
        telegramUsername: '@janesmith',
        telegramAccess: true,
        banned: false,
        createdAt: '2025-02-10T00:00:00Z',
        updatedAt: '2025-02-10T00:00:00Z',
    },
    {
        id: '4',
        email: 'mike@example.com',
        name: 'Mike Johnson',
        tier: 'tier2',
        role: 'user',
        telegramUsername: '@mikej',
        telegramAccess: true,
        banned: false,
        createdAt: '2025-03-01T00:00:00Z',
        updatedAt: '2025-03-01T00:00:00Z',
    },
    {
        id: '5',
        email: 'sarah@example.com',
        name: 'Sarah Williams',
        tier: 'free',
        role: 'user',
        telegramAccess: false,
        banned: false,
        createdAt: '2025-03-15T00:00:00Z',
        updatedAt: '2025-03-15T00:00:00Z',
    },
];

// Passwords: all mock users have password "password123"
export const mockPasswords: Record<string, string> = {
    'admin@tholvitrader.com': 'password123',
    'john@example.com': 'password123',
    'jane@example.com': 'password123',
    'mike@example.com': 'password123',
    'sarah@example.com': 'password123',
};

// ============ MOCK COURSES ============
export const mockCourses: Course[] = [
    {
        id: 'c1',
        title: 'Introduction to Trading',
        description: 'Master the fundamentals of trading with comprehensive lessons covering market basics, chart reading, and risk management strategies.',
        content: [
            { id: 's1', title: 'What is Trading?', type: 'text', content: 'Trading is the process of buying and selling financial instruments such as stocks, currencies, commodities, and derivatives. Unlike investing, which focuses on long-term growth, trading typically involves shorter timeframes and more frequent transactions.\n\nThe goal of trading is to profit from price movements in the market. Traders use various strategies, tools, and analysis methods to identify profitable opportunities.\n\n## Key Concepts\n\n- **Bull Market**: A market condition where prices are rising\n- **Bear Market**: A market condition where prices are falling\n- **Volatility**: The degree of price variation over time\n- **Liquidity**: How easily an asset can be bought or sold\n\nUnderstanding these fundamentals is crucial before diving into more advanced trading strategies.', orderIndex: 1 },
            { id: 's2', title: 'Understanding Charts', type: 'text', content: 'Charts are the primary tool for analyzing price movements. There are several types of charts:\n\n## Candlestick Charts\nThe most popular chart type, showing open, high, low, and close prices for each time period. Each "candle" tells a story about buyer and seller activity.\n\n## Line Charts\nSimplest form, connecting closing prices over time. Good for identifying overall trends.\n\n## Bar Charts\nSimilar to candlestick charts but using vertical bars instead of candle bodies.\n\n## Key Patterns\n- **Support Levels**: Price levels where buying pressure tends to overcome selling\n- **Resistance Levels**: Price levels where selling pressure tends to overcome buying\n- **Trend Lines**: Lines drawn to identify the direction of price movement', orderIndex: 2 },
            { id: 's3', title: 'Risk Management Basics', type: 'text', content: 'Risk management is the most important skill for any trader. Without proper risk management, even the best strategy will fail.\n\n## The 1% Rule\nNever risk more than 1% of your trading capital on a single trade. This ensures that a string of losses won\'t wipe out your account.\n\n## Stop-Loss Orders\nAlways use stop-loss orders to limit potential losses. A stop-loss automatically closes your position when the price reaches a predetermined level.\n\n## Position Sizing\nCalculate your position size based on:\n- Account size\n- Risk percentage\n- Distance to stop-loss\n\n**Formula**: Position Size = (Account × Risk%) / Stop Distance\n\n## Risk-Reward Ratio\nAim for at least a 1:2 risk-reward ratio. This means for every dollar you risk, you should aim to make at least two dollars.', orderIndex: 3 },
        ],
        tierRequired: 'free',
        published: true,
        thumbnailUrl: '/images/course-trading-101.jpg',
        videoCount: 0,
        createdAt: '2025-01-15T00:00:00Z',
        updatedAt: '2025-01-15T00:00:00Z',
    },
    {
        id: 'c2',
        title: 'Technical Analysis Mastery',
        description: 'Deep dive into candlestick patterns, indicators, support/resistance levels, and advanced charting techniques used by professional traders.',
        content: [
            { id: 's4', title: 'Candlestick Patterns', type: 'text', content: 'Candlestick patterns are powerful tools for predicting future price movements based on historical patterns.\n\n## Single Candle Patterns\n- **Doji**: Indicates indecision in the market\n- **Hammer**: Bullish reversal signal at the bottom of a downtrend\n- **Shooting Star**: Bearish reversal signal at the top of an uptrend\n- **Marubozu**: Strong directional candle with no wicks\n\n## Multi-Candle Patterns\n- **Engulfing**: A large candle that completely engulfs the previous candle\n- **Morning/Evening Star**: Three-candle reversal patterns\n- **Three White Soldiers/Black Crows**: Strong continuation patterns\n\nAlways confirm candlestick patterns with volume and other indicators.', orderIndex: 1 },
            { id: 's5', title: 'Moving Averages & Indicators', type: 'text', content: 'Indicators help traders quantify market conditions and identify trading opportunities.\n\n## Moving Averages\n- **SMA (Simple Moving Average)**: Average of closing prices over N periods\n- **EMA (Exponential Moving Average)**: Gives more weight to recent prices\n- **Golden Cross**: 50-day MA crosses above 200-day MA (bullish)\n- **Death Cross**: 50-day MA crosses below 200-day MA (bearish)\n\n## Popular Indicators\n- **RSI (Relative Strength Index)**: Measures overbought/oversold conditions (0-100)\n- **MACD**: Shows relationship between two moving averages\n- **Bollinger Bands**: Measures volatility using standard deviations\n- **Volume**: Confirms price movements and breakouts', orderIndex: 2 },
            { id: 's6', title: 'Support & Resistance', type: 'text', content: 'Support and resistance are among the most important concepts in technical analysis.\n\n## Identifying Levels\n- Look for areas where price has previously bounced\n- The more times a level is tested, the stronger it becomes\n- Round numbers often act as psychological support/resistance\n\n## Trading with S/R\n1. **Buy at support**: Enter long positions when price reaches a support level\n2. **Sell at resistance**: Take profits or enter short positions at resistance\n3. **Breakout trading**: When price breaks through a level, it often continues in that direction\n\n## Role Reversal\nWhen support breaks, it often becomes resistance, and vice versa. This is a key concept for planning entries and exits.', orderIndex: 3 },
        ],
        tierRequired: 'tier1',
        published: true,
        thumbnailUrl: '/images/course-ta.jpg',
        videoCount: 3,
        createdAt: '2025-02-01T00:00:00Z',
        updatedAt: '2025-02-01T00:00:00Z',
    },
    {
        id: 'c3',
        title: 'Advanced Algorithmic Trading',
        description: 'Learn to build automated trading systems, backtest strategies, and deploy algorithms with Python. Includes real-world strategy templates.',
        content: [
            { id: 's7', title: 'Introduction to Algo Trading', type: 'text', content: 'Algorithmic trading uses computer programs to execute trades based on predefined rules and strategies.\n\n## Why Algo Trading?\n- **Speed**: Execute trades in milliseconds\n- **Discipline**: Remove emotional decision-making\n- **Backtesting**: Test strategies on historical data\n- **Scalability**: Monitor and trade multiple markets simultaneously\n\n## Getting Started\n1. Learn Python or another programming language\n2. Understand API integration with brokers\n3. Build your first simple strategy\n4. Backtest on historical data\n5. Paper trade before going live\n\n## Common Strategies\n- Mean Reversion\n- Momentum/Trend Following\n- Statistical Arbitrage\n- Market Making', orderIndex: 1 },
            { id: 's8', title: 'Backtesting Strategies', type: 'text', content: 'Backtesting is the process of testing a trading strategy on historical data to evaluate its performance.\n\n## Key Metrics\n- **Total Return**: Overall profit/loss percentage\n- **Sharpe Ratio**: Risk-adjusted return (higher is better)\n- **Max Drawdown**: Largest peak-to-trough decline\n- **Win Rate**: Percentage of profitable trades\n- **Profit Factor**: Gross profit / Gross loss\n\n## Backtesting Pitfalls\n- **Overfitting**: Strategy works on historical data but fails live\n- **Survivorship Bias**: Only testing on assets that still exist\n- **Look-Ahead Bias**: Using future information in decisions\n- **Slippage & Fees**: Ignoring real-world trading costs\n\nAlways use out-of-sample data to validate your results.', orderIndex: 2 },
        ],
        tierRequired: 'tier2',
        published: true,
        thumbnailUrl: '/images/course-algo.jpg',
        videoCount: 8,
        createdAt: '2025-03-01T00:00:00Z',
        updatedAt: '2025-03-01T00:00:00Z',
    },
    {
        id: 'c4',
        title: 'Crypto Trading Fundamentals',
        description: 'Navigate the cryptocurrency markets with confidence. Cover blockchain basics, DeFi, and proven crypto trading strategies.',
        content: [
            { id: 's9', title: 'Blockchain & Crypto Basics', type: 'text', content: 'Cryptocurrency is a digital or virtual form of currency that uses cryptography for security.\n\n## What is Blockchain?\nA decentralized, distributed ledger technology that records all transactions in a secure and transparent manner.\n\n## Major Cryptocurrencies\n- **Bitcoin (BTC)**: The original cryptocurrency, digital gold\n- **Ethereum (ETH)**: Smart contract platform\n- **Stablecoins**: Pegged to fiat currencies (USDT, USDC)\n\n## Why Trade Crypto?\n- 24/7 market access\n- High volatility = more opportunities\n- Low barrier to entry\n- Decentralized and global', orderIndex: 1 },
        ],
        tierRequired: 'tier1',
        published: true,
        thumbnailUrl: '/images/course-crypto.jpg',
        videoCount: 5,
        createdAt: '2025-03-10T00:00:00Z',
        updatedAt: '2025-03-10T00:00:00Z',
    },
    {
        id: 'c5',
        title: 'Options Trading Deep Dive',
        description: 'Master options from basics to advanced strategies including covered calls, iron condors, straddles, and Greek analysis.',
        content: [
            { id: 's10', title: 'Options Basics', type: 'text', content: 'Options are financial derivatives that give the buyer the right, but not the obligation, to buy or sell an underlying asset at a predetermined price within a specified timeframe.\n\n## Call Options\nGive the right to BUY at the strike price. Profitable when the underlying asset rises above the strike price.\n\n## Put Options\nGive the right to SELL at the strike price. Profitable when the underlying asset falls below the strike price.\n\n## Key Terms\n- **Strike Price**: The price at which the option can be exercised\n- **Premium**: The price paid for the option\n- **Expiration Date**: When the option contract expires\n- **In/Out/At the Money**: Relationship between current price and strike price', orderIndex: 1 },
        ],
        tierRequired: 'tier2',
        published: true,
        thumbnailUrl: '/images/course-options.jpg',
        videoCount: 12,
        createdAt: '2025-03-20T00:00:00Z',
        updatedAt: '2025-03-20T00:00:00Z',
    },
];

// ============ MOCK BLOGS ============
export const mockBlogs: Blog[] = [
    {
        id: 'b1',
        title: 'Why 90% of Traders Fail — And How to Be in the 10%',
        content: `The statistics are brutal: approximately 90% of retail traders lose money. But what separates the successful 10% from the rest? After years of market analysis and working with hundreds of traders, the answer is clear — and it's probably not what you think.

## The Root Cause: Psychology, Not Strategy

Most failing traders blame their strategies, their tools, or their timing. But the real culprit is almost always psychological. The most common psychological traps include:

### 1. Revenge Trading
After a loss, the urge to "make it back" immediately is overwhelming. This leads to larger positions, more risk, and typically more losses. The cycle perpetuates itself.

### 2. Fear of Missing Out (FOMO)
Seeing others profit from a trade you didn't take triggers impulsive entries. By the time FOMO kicks in, the best part of the move is usually over.

### 3. Overconfidence After Wins
A string of profitable trades creates a false sense of invincibility. This leads to increased position sizes and abandonment of risk management rules.

## The Framework of the 10%

Successful traders share common habits:

- **They follow a written trading plan** — not just in their heads, but documented and reviewed regularly
- **They accept losses as business expenses** — the cost of doing business in the markets
- **They focus on process over profit** — executing their strategy correctly matters more than any single trade's outcome
- **They continuously learn and adapt** — markets evolve, and so must their strategies

## Practical Steps to Join the 10%

1. **Start with a demo account** — Practice without risking real money
2. **Define your risk parameters** — Before you enter any trade
3. **Keep a trading journal** — Record every trade, including your emotional state
4. **Review and reflect weekly** — What worked? What didn't? Why?
5. **Stay away from social media trading signals** — Develop your own edge

The path to consistent profitability is not about finding a magic indicator or a secret strategy. It's about building discipline, managing risk, and staying consistent over time.`,
        preview: 'The statistics are brutal: approximately 90% of retail traders lose money. But what separates the successful 10%...',
        tierRequired: 'free',
        thumbnailUrl: '/images/blog-traders.jpg',
        published: true,
        author: 'TholviTrader',
        readTime: 8,
        createdAt: '2025-02-15T00:00:00Z',
    },
    {
        id: 'b2',
        title: 'The Ultimate Guide to Price Action Trading',
        content: `Price action trading is the practice of making all trading decisions from a stripped-down price chart. No indicators, no oscillators — just pure price movement analysis.

## Why Price Action?

Price is the ultimate indicator. All other indicators are derivatives of price, meaning they lag behind. By reading price directly, you get the fastest possible signal.

## Core Price Action Concepts

### Market Structure
Understanding market structure is fundamental. Markets move in three ways:
- **Uptrend**: Series of higher highs and higher lows
- **Downtrend**: Series of lower highs and lower lows
- **Range**: Price oscillating between support and resistance

### Key Patterns

**Pin Bar**: A candle with a long wick and small body, signaling rejection of a price level.

**Inside Bar**: A candle that forms entirely within the range of the previous candle. Indicates consolidation before a breakout.

**Engulfing Pattern**: When one candle completely engulfs the body of the previous candle. Strong reversal signal.

## Advanced Concepts

### Order Flow
Understanding who is buying and who is selling at each price level gives you an edge over other traders.

### Confluence Zones
Areas where multiple support/resistance levels align create high-probability trading zones.

### Time-Based Patterns
Certain times of day see more volatility and volume. London and New York session overlaps, for example, create excellent trading opportunities.

## Building Your Price Action Strategy

1. Identify the trend on a higher timeframe
2. Find key support/resistance levels
3. Wait for a price action signal at these levels
4. Enter with a clear stop-loss and target
5. Manage the trade according to your plan`,
        preview: 'Price action trading is the practice of making all trading decisions from a stripped-down price chart...',
        tierRequired: 'tier1',
        thumbnailUrl: '/images/blog-price-action.jpg',
        published: true,
        author: 'TholviTrader',
        readTime: 12,
        createdAt: '2025-03-01T00:00:00Z',
    },
    {
        id: 'b3',
        title: 'Building a Quantitative Edge: Statistical Analysis for Traders',
        content: `In the age of algorithmic trading, having a statistical edge is no longer optional — it's essential. This guide covers how to apply quantitative methods to improve your trading.

## What is a Trading Edge?

A trading edge is a statistical advantage that, over many trades, puts the odds in your favor. Think of it like a casino: they don't win every hand, but mathematically, they come out ahead over time.

## Key Statistical Concepts

### Expected Value (EV)
EV = (Win Rate × Average Win) - (Loss Rate × Average Loss)

If your EV is positive, your strategy is profitable over time. If negative, you're slowly bleeding money.

### Standard Deviation
Measures the variability of your returns. Lower standard deviation means more consistent results.

### Variance and Drawdown
Understanding the variance of your strategy helps you prepare for inevitable losing streaks and drawdowns.

## Practical Applications

### Monte Carlo Simulation
Run thousands of simulated trade sequences to understand the range of possible outcomes for your strategy.

### Correlation Analysis
Ensure your positions aren't all correlated. Diversification only works when positions are truly independent.

### Regime Detection
Markets cycle between different "regimes" (trending, ranging, volatile, calm). Different strategies work in different regimes.

## Tools and Resources
- Python with pandas, numpy, and scipy
- R for statistical analysis
- Excel for quick calculations
- Backtrader or Zipline for backtesting`,
        preview: 'In the age of algorithmic trading, having a statistical edge is no longer optional — it\'s essential...',
        tierRequired: 'tier2',
        thumbnailUrl: '/images/blog-quant.jpg',
        published: true,
        author: 'TholviTrader',
        readTime: 15,
        createdAt: '2025-03-15T00:00:00Z',
    },
    {
        id: 'b4',
        title: 'Market Psychology: Understanding Fear and Greed Cycles',
        content: `Markets are driven by two fundamental emotions: fear and greed. Understanding these cycles gives you a massive advantage in timing your entries and exits.

## The Fear-Greed Cycle

Markets move in predictable emotional cycles:

1. **Optimism** → 2. **Excitement** → 3. **Thrill** → 4. **Euphoria** (Maximum Risk Point)
5. **Anxiety** → 6. **Denial** → 7. **Fear** → 8. **Desperation**
9. **Panic** → 10. **Capitulation** → 11. **Despondency** (Maximum Opportunity)
12. **Depression** → 13. **Hope** → 14. **Relief** → Back to 1.

## How to Use This

### Contrarian Approach
Buy when there is maximum fear (capitulation phase) and sell into euphoria. Simple in theory, extremely difficult in practice.

### Sentiment Indicators
- **Put/Call Ratio**: High ratio = fear, Low ratio = greed
- **VIX (Volatility Index)**: Spikes in VIX indicate fear
- **Social Media Sentiment**: Extreme positive or negative sentiment signals potential reversals`,
        preview: 'Markets are driven by two fundamental emotions: fear and greed. Understanding these cycles gives you a massive advantage...',
        tierRequired: 'free',
        thumbnailUrl: '/images/blog-psychology.jpg',
        published: true,
        author: 'TholviTrader',
        readTime: 6,
        createdAt: '2025-03-20T00:00:00Z',
    },
    {
        id: 'b5',
        title: 'Advanced Order Flow Analysis: Reading the Tape Like a Pro',
        content: `Order flow analysis is the study of actual buying and selling activity in the market. It reveals what big players are doing in real-time.

## What is Order Flow?

Every trade in the market involves a buyer and a seller. Order flow analysis examines the volume, size, and timing of these trades to identify patterns.

## Key Concepts

### Market Depth (Level 2)
Shows all pending buy and sell orders at different price levels. Large orders at specific levels can act as support or resistance.

### Time & Sales
The "tape" — a chronological list of every executed trade. Large prints often signal institutional activity.

### Volume Profile
Shows the distribution of volume at each price level over a specific period. Identifies areas of high and low activity.

## Practical Application

1. **Look for absorption**: Large limit orders absorbing aggressive sellers/buyers signal potential reversals
2. **Follow institutional prints**: Large isolated trades often precede significant moves
3. **Volume imbalances**: When buying volume significantly exceeds selling volume at a level, price is likely to push higher

This is the kind of analysis that separates amateurs from professionals. While most traders stare at lagging indicators, order flow readers see what's happening in real-time.`,
        preview: 'Order flow analysis is the study of actual buying and selling activity in the market. It reveals what big players are doing...',
        tierRequired: 'tier2',
        thumbnailUrl: '/images/blog-orderflow.jpg',
        published: true,
        author: 'TholviTrader',
        readTime: 10,
        createdAt: '2025-04-01T00:00:00Z',
    },
];

// ============ MOCK PAYMENTS ============
export const mockPayments: Payment[] = [
    {
        id: 'p1',
        userId: '2',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        tierRequested: 'tier1',
        transactionId: '0xabc123def456',
        screenshotUrl: '/images/payment-ss.jpg',
        notes: 'Payment from Binance wallet',
        status: 'pending',
        createdAt: '2025-03-25T00:00:00Z',
    },
    {
        id: 'p2',
        userId: '5',
        userName: 'Sarah Williams',
        userEmail: 'sarah@example.com',
        tierRequested: 'tier2',
        transactionId: '0xdef789ghi012',
        screenshotUrl: '/images/payment-ss2.jpg',
        status: 'pending',
        createdAt: '2025-03-26T00:00:00Z',
    },
    {
        id: 'p3',
        userId: '3',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        tierRequested: 'tier1',
        transactionId: '0x111222333444',
        status: 'approved',
        createdAt: '2025-02-10T00:00:00Z',
        reviewedAt: '2025-02-11T00:00:00Z',
        reviewedBy: '1',
    },
];

// ============ MOCK COURSE PROGRESS ============
export const mockCourseProgress: CourseProgress[] = [
    {
        courseId: 'c1',
        userId: '2',
        completedSections: ['s1'],
        percentage: 33,
        lastAccessedAt: '2025-03-20T00:00:00Z',
    },
    {
        courseId: 'c1',
        userId: '3',
        completedSections: ['s1', 's2', 's3'],
        percentage: 100,
        lastAccessedAt: '2025-03-18T00:00:00Z',
    },
    {
        courseId: 'c2',
        userId: '3',
        completedSections: ['s4'],
        percentage: 33,
        lastAccessedAt: '2025-03-22T00:00:00Z',
    },
];

// ============ MOCK NOTIFICATIONS ============
export const mockNotifications: Notification[] = [
    {
        id: 'n1',
        userId: '2',
        title: 'Welcome to TholviTrader!',
        message: 'Start your trading journey with our free courses.',
        read: true,
        createdAt: '2025-02-01T00:00:00Z',
    },
    {
        id: 'n2',
        userId: '2',
        title: 'New Course Available',
        message: 'Check out our new Crypto Trading Fundamentals course.',
        read: false,
        createdAt: '2025-03-10T00:00:00Z',
    },
];

// ============ MOCK ADMIN STATS ============
export const mockAdminStats: AdminStats = {
    totalUsers: 5,
    freeUsers: 2,
    tier1Users: 1,
    tier2Users: 2,
    pendingPayments: 2,
    totalRevenue: 247,
    conversionRate: 40,
    userGrowth: [
        { date: '2025-01', count: 1 },
        { date: '2025-02', count: 3 },
        { date: '2025-03', count: 5 },
        { date: '2025-04', count: 7 },
        { date: '2025-05', count: 11 },
        { date: '2025-06', count: 14 },
        { date: '2025-07', count: 19 },
        { date: '2025-08', count: 24 },
        { date: '2025-09', count: 31 },
        { date: '2025-10', count: 38 },
        { date: '2025-11', count: 47 },
        { date: '2025-12', count: 58 },
    ],
};
