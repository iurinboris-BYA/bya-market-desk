const MARKET_API_URL = "/api/coingecko/markets";
const PAPRIKA_TICKERS_API_URL = "/api/coinpaprika/tickers";
const GLOBAL_API_URL = "https://api.coingecko.com/api/v3/global";
const FEAR_GREED_API_URL = "https://api.alternative.me/fng/";
const INVESTING_CRYPTO_RSS_URL = "https://ru.investing.com/rss/news_301.rss";
const BYACADEMY_LESSONS_URL = "https://t.me/+jFFzjj0SLDIxZWQy";
const BYACADEMY_CHANNEL_URL = "https://t.me/BYAcadem";
const MARKET_REFRESH_MS = 30000;
const NEWS_REFRESH_MS = 12 * 60 * 60 * 1000;
const LIVE_RENDER_MS = 900;
const DEFAULT_MARKET_LIMIT = 2000;
const DEFAULT_MOVER_LIMIT = 100;
const NEWS_VISIBLE_COUNT = 12;
const ADMIN_EMAIL = "razor332437666@mail.ru";
const ALTSEASON_SAMPLE_LIMIT = 100;
const VOLUME_ACCUMULATION_LIMIT = 200;
const VOLUME_ACCUMULATION_VISIBLE_COUNT = 20;
const MARKET_PAGE_SIZE = 250;
const MARKET_PAGE_DELAY_MS = 650;
const MARKET_PAGE_RETRY_DELAY_MS = 1800;
const MOVERS_VISIBLE_COUNT = 30;
const MARKET_RENDER_CHUNK_SIZE = 250;
const STABLE_OR_WRAPPED_SYMBOLS = new Set([
  "usdt",
  "usdc",
  "dai",
  "fdusd",
  "usde",
  "busd",
  "tusd",
  "usdd",
  "usdp",
  "usds",
  "rlusd",
  "pyusd",
  "frax",
  "wbtc",
  "steth",
]);
const INVESTOR_SIGNALS = {
  solana: { funds: ["a16z", "Multicoin", "Polychain"], roi: 89, portfolio: 94, liquidity: 96 },
  sui: { funds: ["a16z", "Jump Crypto", "Binance Labs"], roi: 76, portfolio: 88, liquidity: 83 },
  aptos: { funds: ["a16z", "Jump Crypto", "Multicoin"], roi: 72, portfolio: 86, liquidity: 82 },
  arbitrum: { funds: ["Lightspeed", "Pantera", "Polychain"], roi: 68, portfolio: 84, liquidity: 88 },
  optimism: { funds: ["a16z", "Paradigm", "IDEO CoLab"], roi: 66, portfolio: 82, liquidity: 86 },
  avalanche: { funds: ["Polychain", "Three Arrows", "Dragonfly"], roi: 64, portfolio: 79, liquidity: 90 },
  chainlink: { funds: ["Framework", "Digital Currency Group"], roi: 70, portfolio: 75, liquidity: 92 },
  near: { funds: ["a16z", "Tiger Global", "Dragonfly"], roi: 62, portfolio: 81, liquidity: 78 },
  celestia: { funds: ["Bain Capital Crypto", "Polychain", "Placeholder"], roi: 74, portfolio: 83, liquidity: 72 },
  sei: { funds: ["Multicoin", "Jump Crypto", "Coinbase Ventures"], roi: 69, portfolio: 78, liquidity: 70 },
  render: { funds: ["Multicoin", "Solana Ventures", "Alameda Research"], roi: 71, portfolio: 77, liquidity: 79 },
};

const BYACADEMY_FEED_ITEMS = [
  {
    time: "Мини-уроки",
    title: "5 мини-уроков по крипте",
    description: "Открыть меню уроков BYAcademy и пройти базу по криптовалютам.",
    link: BYACADEMY_LESSONS_URL,
  },
  {
    time: "Канал",
    title: "BYAcademy: свежие посты",
    description: "Разборы рынка, наблюдения по крипте и обновления экосистемы.",
    link: BYACADEMY_CHANNEL_URL,
  },
  {
    time: "Канал",
    title: "Рыночные идеи и сценарии",
    description: "Переходи в канал, чтобы смотреть актуальные публикации BYAcademy.",
    link: BYACADEMY_CHANNEL_URL,
  },
  {
    time: "Канал",
    title: "Практика и обучение",
    description: "Материалы по входам, выходам, объему, риску и портфельной дисциплине.",
    link: BYACADEMY_CHANNEL_URL,
  },
  {
    time: "Канал",
    title: "Экосистема BYAcademy",
    description: "Канал с постами, обновлениями и переходами в продукты экосистемы.",
    link: BYACADEMY_CHANNEL_URL,
  },
];

const STORAGE_KEYS = {
  portfolio: "bya.compare.portfolio.v1",
  closedPositions: "bya.compare.closed.positions.v1",
  portfolioChartHistory: "bya.compare.portfolio.chart.history.v1",
  portfolioValueHistory: "bya.compare.portfolio.value.history.v1",
  portfolioBooks: "bya.compare.portfolio.books.v1",
  activePortfolioBookId: "bya.compare.portfolio.active.book.v1",
  cookieConsent: "bya.marketdesk.cookie.consent.v1",
  watchlist: "bya.compare.watchlist.v1",
  watchlistNotes: "bya.compare.watchlist.notes.v1",
  user: "bya.marketdesk.user.v1",
};

const PORTFOLIO_WALLETS = [
  { id: "all", label: "Общий", description: "Все активные позиции" },
  { id: "investment", label: "Инвестиционный", description: "Долгий срок" },
  { id: "speculative", label: "Спекулятивный", description: "Активные идеи" },
];

const POSITION_WALLETS = PORTFOLIO_WALLETS.filter((wallet) => wallet.id !== "all");
const DEFAULT_POSITION_WALLET = "general";
const LEGACY_COIN_IDS = {
  "btc-bitcoin": "bitcoin",
  "eth-ethereum": "ethereum",
  "sol-solana": "solana",
  "xrp-ripple": "ripple",
};

const fallbackCoins = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 104500,
    high_24h: 106100,
    low_24h: 101900,
    market_cap: 2070000000000,
    market_cap_rank: 1,
    total_volume: 38500000000,
    price_change_percentage_1h_in_currency: 0.2,
    price_change_percentage_24h: 1.8,
    price_change_percentage_7d_in_currency: 4.1,
    price_change_percentage_30d_in_currency: 12.4,
    ath_change_percentage: -5.2,
    atl_change_percentage: 154000,
    circulating_supply: 19800000,
    total_supply: 21000000,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3480,
    high_24h: 3540,
    low_24h: 3390,
    market_cap: 420000000000,
    market_cap_rank: 2,
    total_volume: 22100000000,
    price_change_percentage_1h_in_currency: -0.1,
    price_change_percentage_24h: -0.7,
    price_change_percentage_7d_in_currency: 2.9,
    price_change_percentage_30d_in_currency: 8.7,
    ath_change_percentage: -28.8,
    atl_change_percentage: 720000,
    circulating_supply: 120000000,
    total_supply: 120000000,
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 168,
    high_24h: 172,
    low_24h: 158,
    market_cap: 76000000000,
    market_cap_rank: 5,
    total_volume: 5900000000,
    price_change_percentage_1h_in_currency: 0.9,
    price_change_percentage_24h: 3.4,
    price_change_percentage_7d_in_currency: 8.2,
    price_change_percentage_30d_in_currency: 17.1,
    ath_change_percentage: -35.1,
    atl_change_percentage: 34000,
    circulating_supply: 450000000,
    total_supply: 570000000,
  },
  {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 0.61,
    high_24h: 0.63,
    low_24h: 0.59,
    market_cap: 34500000000,
    market_cap_rank: 7,
    total_volume: 1900000000,
    price_change_percentage_1h_in_currency: -0.2,
    price_change_percentage_24h: -1.1,
    price_change_percentage_7d_in_currency: -3.6,
    price_change_percentage_30d_in_currency: 6.9,
    ath_change_percentage: -84.1,
    atl_change_percentage: 10400,
    circulating_supply: 56000000000,
    total_supply: 100000000000,
  },
];

const state = {
  coins: [],
  filteredCoins: [],
  portfolio: readStorage(STORAGE_KEYS.portfolio, []),
  closedPositions: readStorage(STORAGE_KEYS.closedPositions, []),
  portfolioChartHistory: readStorage(STORAGE_KEYS.portfolioChartHistory, []),
  portfolioValueHistory: readStorage(STORAGE_KEYS.portfolioValueHistory, []),
  portfolioBooks: readStorage(STORAGE_KEYS.portfolioBooks, []),
  activePortfolioBookId: localStorage.getItem(STORAGE_KEYS.activePortfolioBookId) || "",
  watchlist: readStorage(STORAGE_KEYS.watchlist, []),
  watchlistNotes: readStorage(STORAGE_KEYS.watchlistNotes, {}),
  user: readStorage(STORAGE_KEYS.user, null),
  quickPortfolioCoinId: "",
  currency: "usd",
  sortKey: "market_cap_rank",
  sortDirection: "asc",
  marketLimit: DEFAULT_MARKET_LIMIT,
  visibleMarketRows: MARKET_RENDER_CHUNK_SIZE,
  moverLimit: DEFAULT_MOVER_LIMIT,
  global: null,
  fearGreed: null,
  altseason: null,
  refreshTimer: null,
  countdownTimer: null,
  liveSocket: null,
  liveSocketKey: "",
  liveRenderTimer: null,
  news: [],
  byaNews: [],
  newsSource: "market",
  newsTimer: null,
  portfolioCollapsed: false,
  groupedPortfolioCoins: new Set(),
  portfolioReportPeriod: "day",
  activePortfolioWallet: "all",
  pendingClosePositionIds: [],
  openMovePositionId: "",
  portfolioChartMode: "line",
  portfolioChartPeriod: "1d",
  portfolioChartWindowOffset: 0,
  portfolioChartPointTimes: [],
  portfolioChartTimeRange: null,
  portfolioChartRenderedPoints: [],
  portfolioChartLastEntries: [],
  portfolioChartHoverIndex: null,
  isRefreshing: false,
  accountSyncTimer: null,
  isApplyingAccountPortfolio: false,
  isSyncingAccountPortfolio: false,
  passwordReset: null,
  nextRefreshAt: null,
  lastUpdated: null,
  usingFallback: false,
};

const elements = {
  dataStatus: document.querySelector("#dataStatus"),
  updateCadence: document.querySelector("#updateCadence"),
  liveStreamStatus: document.querySelector("#liveStreamStatus"),
  searchInput: document.querySelector("#searchInput"),
  currencySelect: document.querySelector("#currencySelect"),
  refreshBtn: document.querySelector("#refreshBtn"),
  marketTable: document.querySelector("#marketTable"),
  coinSearchInput: document.querySelector("#coinSearchInput"),
  coinSearchDropdown: document.querySelector("#coinSearchDropdown"),
  portfolioForm: document.querySelector("#portfolioForm"),
  amountInput: document.querySelector("#amountInput"),
  costInput: document.querySelector("#costInput"),
  useQuickMarketPriceBtn: document.querySelector("#useQuickMarketPriceBtn"),
  portfolioList: document.querySelector("#portfolioList"),
  portfolioPageForm: document.querySelector("#portfolioPageForm"),
  portfolioPageCoinSelect: document.querySelector("#portfolioPageCoinSelect"),
  portfolioPageAmountInput: document.querySelector("#portfolioPageAmountInput"),
  portfolioPageTotalInput: document.querySelector("#portfolioPageTotalInput"),
  portfolioPageCostInput: document.querySelector("#portfolioPageCostInput"),
  portfolioPageDateInput: document.querySelector("#portfolioPageDateInput"),
  portfolioPageWalletSelect: document.querySelector("#portfolioPageWalletSelect"),
  portfolioPageNoteInput: document.querySelector("#portfolioPageNoteInput"),
  portfolioCoinModal: document.querySelector("#portfolioCoinModal"),
  portfolioCloseModal: document.querySelector("#portfolioCloseModal"),
  portfolioCloseForm: document.querySelector("#portfolioCloseForm"),
  closePortfolioCloseBtn: document.querySelector("#closePortfolioCloseBtn"),
  closePositionAsset: document.querySelector("#closePositionAsset"),
  closePositionPrice: document.querySelector("#closePositionPrice"),
  closePositionAmount: document.querySelector("#closePositionAmount"),
  closePositionPercentInput: document.querySelector("#closePositionPercentInput"),
  closePositionAmountInput: document.querySelector("#closePositionAmountInput"),
  closePercentButtons: document.querySelectorAll("[data-close-percent]"),
  closePositionPreview: document.querySelector("#closePositionPreview"),
  closePositionHint: document.querySelector("#closePositionHint"),
  closePortfolioCoinBtn: document.querySelector("#closePortfolioCoinBtn"),
  useMarketPriceBtn: document.querySelector("#useMarketPriceBtn"),
  portfolioMarketPriceHint: document.querySelector("#portfolioMarketPriceHint"),
  portfolioAddPreview: document.querySelector("#portfolioAddPreview"),
  portfolioNoteCounter: document.querySelector("#portfolioNoteCounter"),
  portfolioPageTable: document.querySelector("#portfolioPageTable"),
  closedPositionsTable: document.querySelector("#closedPositionsTable"),
  closedPositionsSummary: document.querySelector("#closedPositionsSummary"),
  closedPositionsOverview: document.querySelector("#closedPositionsOverview"),
  toastContainer: document.querySelector("#toastContainer"),
  portfolioChart: document.querySelector("#portfolioChart"),
  portfolioChartStats: document.querySelector("#portfolioChartStats"),
  portfolioCurrencySelect: document.querySelector("#portfolioCurrencySelect"),
  collapsePortfolioBtn: document.querySelector("#collapsePortfolioBtn"),
  focusPortfolioFormBtn: document.querySelector("#focusPortfolioFormBtn"),
  portfolioReportBtn: document.querySelector("#portfolioReportBtn"),
  portfolioReportPanel: document.querySelector("#portfolioReportPanel"),
  portfolioReportContent: document.querySelector("#portfolioReportContent"),
  reportPeriodButtons: document.querySelectorAll("[data-report-period]"),
  portfolioBookSelect: document.querySelector("#portfolioBookSelect"),
  portfolioBookTabs: document.querySelector("#portfolioBookTabs"),
  createPortfolioBookBtn: document.querySelector("#createPortfolioBookBtn"),
  deletePortfolioBookBtn: document.querySelector("#deletePortfolioBookBtn"),
  portfolioWalletButtons: document.querySelectorAll("[data-portfolio-wallet]"),
  portfolioTableAddBtn: document.querySelector("#portfolioTableAddBtn"),
  portfolioPageCost: document.querySelector("#portfolioPageCost"),
  portfolioPageRealized: document.querySelector("#portfolioPageRealized"),
  portfolioPagePnl: document.querySelector("#portfolioPagePnl"),
  portfolioPagePnlPct: document.querySelector("#portfolioPagePnlPct"),
  portfolioPageHoldings: document.querySelector("#portfolioPageHoldings"),
  portfolioPageDayPnl: document.querySelector("#portfolioPageDayPnl"),
  portfolioPageDayPct: document.querySelector("#portfolioPageDayPct"),
  portfolioPageChange: document.querySelector("#portfolioPageChange"),
  portfolioPageOverview: document.querySelector("#portfolioPageOverview"),
  portfolioChartModeButtons: document.querySelectorAll("[data-portfolio-chart-mode]"),
  portfolioChartPeriodButtons: document.querySelectorAll("[data-portfolio-chart-period]"),
  watchlistList: document.querySelector("#watchlistList"),
  watchlistPageList: document.querySelector("#watchlistPageList"),
  watchlistPageSummary: document.querySelector("#watchlistPageSummary"),
  athList: document.querySelector("#athList"),
  moversList: document.querySelector("#moversList"),
  moverLimitButtons: document.querySelectorAll("[data-mover-limit]"),
  investorSignalBadge: document.querySelector("#investorSignalBadge"),
  investorSignalList: document.querySelector("#investorSignalList"),
  investorScoreValue: document.querySelector("#investorScoreValue"),
  investorScoreHint: document.querySelector("#investorScoreHint"),
  newsList: document.querySelector("#newsList"),
  newsSourceButtons: document.querySelectorAll("[data-news-source]"),
  exportBtn: document.querySelector("#exportBtn"),
  clearWatchlistBtn: document.querySelector("#clearWatchlistBtn"),
  authBtn: document.querySelector("#authBtn"),
  adminTopbarLink: document.querySelector("#adminTopbarLink"),
  sidebarAuthBtn: document.querySelector("#sidebarAuthBtn"),
  authModal: document.querySelector("#authModal"),
  closeAuthBtn: document.querySelector("#closeAuthBtn"),
  authForm: document.querySelector("#authForm"),
  authLoginBtn: document.querySelector("#authLoginBtn"),
  authResetBtn: document.querySelector("#authResetBtn"),
  authNameInput: document.querySelector("#authNameInput"),
  authEmailInput: document.querySelector("#authEmailInput"),
  authPasswordInput: document.querySelector("#authPasswordInput"),
  authNewPasswordLabel: document.querySelector("#authNewPasswordLabel"),
  authNewPasswordInput: document.querySelector("#authNewPasswordInput"),
  authTelegramInput: document.querySelector("#authTelegramInput"),
  authRoleInput: document.querySelector("#authRoleInput"),
  authLegalConsent: document.querySelector("#authLegalConsent"),
  cookieConsent: document.querySelector("#cookieConsent"),
  acceptCookieConsentBtn: document.querySelector("#acceptCookieConsentBtn"),
  accountName: document.querySelector("#accountName"),
  accountEmail: document.querySelector("#accountEmail"),
  accountCard: document.querySelector("#accountCard"),
  btcLivePrice: document.querySelector("#btcLivePrice"),
  marketLiveChange: document.querySelector("#marketLiveChange"),
  altseasonLive: document.querySelector("#altseasonLive"),
  refreshCountdown: document.querySelector("#refreshCountdown"),
  altseasonBadge: document.querySelector("#altseasonBadge"),
  altseasonValue: document.querySelector("#altseasonValue"),
  altseasonLabel: document.querySelector("#altseasonLabel"),
  altseasonHint: document.querySelector("#altseasonHint"),
  altseasonFill: document.querySelector("#altseasonFill"),
  altseasonNeedle: document.querySelector("#altseasonNeedle"),
  marketCapMetric: document.querySelector("#marketCapMetric"),
  marketCapHint: document.querySelector("#marketCapHint"),
  volumeMetric: document.querySelector("#volumeMetric"),
  portfolioValueMetric: document.querySelector("#portfolioValueMetric"),
  portfolioPnlMetric: document.querySelector("#portfolioPnlMetric"),
  fearGreedMetric: document.querySelector("#fearGreedMetric"),
  fearGreedHint: document.querySelector("#fearGreedHint"),
  fearGreedBadge: document.querySelector("#fearGreedBadge"),
  fearGreedValue: document.querySelector("#fearGreedValue"),
  fearGreedClassification: document.querySelector("#fearGreedClassification"),
  fearGreedUpdated: document.querySelector("#fearGreedUpdated"),
  fearGreedNeedle: document.querySelector("#fearGreedNeedle"),
  btcDominanceMetric: document.querySelector("#btcDominanceMetric"),
  activeMarketsMetric: document.querySelector("#activeMarketsMetric"),
  watchlistMetric: document.querySelector("#watchlistMetric"),
  closedPositionsMetric: document.querySelector("#closedPositionsMetric"),
  segmentButtons: document.querySelectorAll(".segment"),
  sortHeaderButtons: document.querySelectorAll(".sort-header"),
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  applyMobilePreviewMode();
  renderLegalDocuments();
  migrateLegacyStorage();
  resetPortfolioFromUrl();
  readPasswordResetFromUrl();
  ensurePortfolioBooks();
  elements.portfolioPageDateInput.valueAsDate = new Date();
  if (elements.portfolioPageWalletSelect) {
    elements.portfolioPageWalletSelect.value = DEFAULT_POSITION_WALLET;
  }
  elements.portfolioCurrencySelect.value = state.currency;
  bindEvents();
  setupPortfolioChartTimelineControls();
  handleHashNavigation();
  renderUser();
  loadAccountPortfolioData();
  renderSortHeaders();
  renderLoadingRows();
  renderClosedPositions();
  renderCookieConsent();
  loadDashboard();
  loadCryptoNews();
  state.refreshTimer = window.setInterval(() => loadDashboard({ silent: true }), MARKET_REFRESH_MS);
  state.countdownTimer = window.setInterval(renderRefreshCountdown, 1000);
  state.newsTimer = window.setInterval(loadCryptoNews, NEWS_REFRESH_MS);
}

function applyMobilePreviewMode() {
  const url = new URL(window.location.href);
  document.body.classList.toggle("mobile-preview", url.searchParams.get("mobile") === "1");
  if (document.body.classList.contains("mobile-preview")) {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    resetMobilePreviewScroll();
  }
}

function resetMobilePreviewScroll() {
  [0, 80, 260, 700].forEach((delay) => {
    window.setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }), delay);
  });
}

function bindEvents() {
  ensureDeletePortfolioBookButton();
  elements.searchInput.addEventListener("input", () => {
    state.visibleMarketRows = MARKET_RENDER_CHUNK_SIZE;
    applyFilters();
    renderMarket();
  });

  elements.currencySelect.addEventListener("change", (event) => {
    state.currency = event.target.value;
    loadDashboard();
  });

  elements.refreshBtn.addEventListener("click", loadDashboard);

  elements.coinSearchInput.addEventListener("focus", () => renderCoinSearchDropdown());
  elements.coinSearchInput.addEventListener("input", () => {
    state.quickPortfolioCoinId = "";
    renderCoinSearchDropdown();
  });
  elements.coinSearchInput.addEventListener("keydown", handleCoinSearchKeydown);
  document.addEventListener("click", handleExternalLinkClick);
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".coin-picker")) {
      hideCoinSearchDropdown();
    }
  });

  elements.segmentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      elements.segmentButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.sortKey = button.dataset.sort;
      state.sortDirection = button.dataset.sort === "market_cap_rank" ? "asc" : "desc";
      state.visibleMarketRows = MARKET_RENDER_CHUNK_SIZE;
      applyFilters();
      renderMarket();
      renderSortHeaders();
    });
  });

  elements.sortHeaderButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const sortKey = button.dataset.sort;
      const isSameSort = state.sortKey === sortKey;
      state.sortKey = sortKey;
      state.sortDirection =
        sortKey === "market_cap_rank" ? (isSameSort && state.sortDirection === "asc" ? "desc" : "asc") : isSameSort && state.sortDirection === "desc" ? "asc" : "desc";
      elements.segmentButtons.forEach((item) => item.classList.toggle("active", item.dataset.sort === sortKey));
      state.visibleMarketRows = MARKET_RENDER_CHUNK_SIZE;
      applyFilters();
      renderMarket();
      renderSortHeaders();
    });
  });

  elements.moverLimitButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const limit = Number(button.dataset.moverLimit) || 100;
      if (state.moverLimit === limit) return;
      state.moverLimit = limit;
      renderMovers();
    });
  });
  elements.moversList.addEventListener("wheel", handleMoversWheel, { passive: false });
  elements.athList.addEventListener("wheel", handleAthWheel, { passive: false });

  setupRussianValidation();

  elements.portfolioForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!requireUserForPortfolioAction()) return;
    if (!validatePortfolioForm("quick")) return;
    addPortfolioPosition("quick");
  });
  elements.useQuickMarketPriceBtn.addEventListener("click", useQuickMarketPrice);

  elements.portfolioPageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!requireUserForPortfolioAction()) return;
    if (!validatePortfolioForm("page")) return;
    addPortfolioPosition("page");
  });

  elements.portfolioPageCoinSelect.addEventListener("change", () => {
    useCurrentMarketPrice();
    updatePortfolioMarketPriceHint();
  });
  elements.portfolioPageAmountInput.addEventListener("input", () => recalculatePortfolioAmount("amount"));
  elements.portfolioPageTotalInput.addEventListener("input", () => recalculatePortfolioAmount("total"));
  elements.portfolioPageCostInput.addEventListener("input", () => recalculatePortfolioAmount("price"));
  elements.portfolioPageNoteInput.addEventListener("input", updatePortfolioNoteCounter);
  elements.useMarketPriceBtn.addEventListener("click", useCurrentMarketPrice);
  elements.closePortfolioCoinBtn.addEventListener("click", closePortfolioCoinModal);
  elements.portfolioCoinModal.addEventListener("click", (event) => {
    if (event.target === elements.portfolioCoinModal) {
      closePortfolioCoinModal();
    }
  });
  elements.closePortfolioCloseBtn.addEventListener("click", closePortfolioCloseModal);
  elements.portfolioCloseModal.addEventListener("click", (event) => {
    if (event.target === elements.portfolioCloseModal) {
      closePortfolioCloseModal();
    }
  });
  elements.closePositionPercentInput.addEventListener("input", () => syncCloseInputs("percent"));
  elements.closePositionAmountInput.addEventListener("input", () => syncCloseInputs("amount"));
  elements.closePercentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      elements.closePositionPercentInput.value = button.dataset.closePercent;
      syncCloseInputs("percent");
    });
  });
  elements.portfolioCloseForm.addEventListener("submit", (event) => {
    event.preventDefault();
    confirmClosePortfolioPosition();
  });

  elements.portfolioCurrencySelect.addEventListener("change", (event) => {
    state.currency = event.target.value;
    elements.currencySelect.value = state.currency;
    loadDashboard();
  });

  elements.collapsePortfolioBtn?.addEventListener("click", togglePortfolioGrouping);

  elements.portfolioChartModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.portfolioChartMode = button.dataset.portfolioChartMode;
      state.portfolioChartHoverIndex = null;
      renderPortfolioPage();
    });
  });

  elements.portfolioChartPeriodButtons.forEach((button) => {
    if (!getPortfolioChartPeriods().includes(button.dataset.portfolioChartPeriod)) {
      button.hidden = true;
    }
    button.addEventListener("click", () => {
      if (!getPortfolioChartPeriods().includes(button.dataset.portfolioChartPeriod)) return;
      state.portfolioChartPeriod = button.dataset.portfolioChartPeriod;
      state.portfolioChartWindowOffset = 0;
      renderPortfolioPage();
    });
  });

  elements.portfolioChart?.addEventListener("mousemove", handlePortfolioChartHover);
  elements.portfolioChart?.addEventListener("mouseleave", () => {
    state.portfolioChartHoverIndex = null;
    safeDrawPortfolioChart(state.portfolioChartLastEntries || [], getPortfolioTotals(getPortfolioScopePositions(state.activePortfolioWallet)));
  });

  elements.focusPortfolioFormBtn.addEventListener("click", () => {
    if (!requireUserForPortfolioAction()) return;
    openPortfolioCoinModal();
  });
  elements.portfolioReportBtn?.addEventListener("click", () => {
    elements.portfolioReportPanel.hidden = !elements.portfolioReportPanel.hidden;
    renderPortfolioReport();
  });
  elements.portfolioBookSelect?.addEventListener("change", (event) => {
    switchPortfolioBook(event.target.value);
  });
  elements.portfolioBookTabs?.addEventListener("click", handlePortfolioBookTabClick);
  elements.createPortfolioBookBtn?.addEventListener("click", () => {
    if (!requireUserForPortfolioAction()) return;
    createPortfolioBook();
  });
  elements.deletePortfolioBookBtn?.addEventListener("click", deleteActivePortfolioBook);
  elements.reportPeriodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.portfolioReportPeriod = button.dataset.reportPeriod || "day";
      renderPortfolioReport();
    });
  });
  elements.portfolioWalletButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.activePortfolioWallet = button.dataset.portfolioWallet || "all";
      renderPortfolioPage();
    });
  });
  elements.portfolioTableAddBtn.addEventListener("click", () => {
    openPortfolioCoinModal();
  });
  elements.portfolioPageTable.addEventListener("click", handlePortfolioTableAction);
  elements.portfolioPageTable.addEventListener("change", handlePortfolioTableChange);

  elements.exportBtn.addEventListener("click", exportPortfolio);
  elements.clearWatchlistBtn?.addEventListener("click", () => {
    state.watchlist = [];
    state.watchlistNotes = {};
    persistWatchlist();
    persistWatchlistNotes();
    renderAll();
  });

  elements.newsSourceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.newsSource = button.dataset.newsSource || "market";
      renderNews();
    });
  });

  elements.authBtn.addEventListener("click", handleAuthButton);
  elements.sidebarAuthBtn.addEventListener("click", handleAuthButton);
  elements.closeAuthBtn.addEventListener("click", closeAuthModal);
  elements.authModal.addEventListener("click", (event) => {
    if (event.target === elements.authModal) {
      closeAuthModal();
    }
  });
  elements.authForm.addEventListener("submit", saveUserProfile);
  elements.authLoginBtn?.addEventListener("click", loginUserProfile);
  elements.authResetBtn?.addEventListener("click", requestPasswordReset);
  elements.acceptCookieConsentBtn?.addEventListener("click", acceptCookieConsent);
  elements.acceptCookieConsentBtn?.addEventListener("pointerup", acceptCookieConsent);
  elements.acceptCookieConsentBtn?.addEventListener("touchend", acceptCookieConsent, { passive: true });
  document.addEventListener("click", handleCookieConsentAction);
  document.addEventListener("pointerup", handleCookieConsentAction);
  document.addEventListener("touchend", handleCookieConsentAction, { passive: true });
  window.addEventListener("hashchange", handleHashNavigation);
}

function handleCookieConsentAction(event) {
  const button = event.target?.closest?.("#acceptCookieConsentBtn");
  if (!button) return;
  acceptCookieConsent();
}

function handleExternalLinkClick(event) {
  const link = event.target.closest?.('a[href^="http"]');
  if (!link) return;

  const href = link.href;
  if (!href) return;

  event.preventDefault();
  openExternalLink(href);
}

function openExternalLink(href) {
  const telegramApp = window.Telegram?.WebApp;

  try {
    if (telegramApp && href.includes("t.me/") && typeof telegramApp.openTelegramLink === "function") {
      telegramApp.openTelegramLink(href);
      return;
    }

    if (telegramApp && typeof telegramApp.openLink === "function") {
      telegramApp.openLink(href);
      return;
    }
  } catch (error) {
    console.warn("Telegram external link fallback", error);
  }

  const externalWindow = window.open(href, "_blank", "noopener,noreferrer");
  if (!externalWindow) {
    window.location.assign(href);
  }
}

function handleHashNavigation() {
  const hash = window.location.hash || "#market";
  const isLegalRoute = hash.startsWith("#legal-");
  const isUtilityRoute = hash === "#portfolio-page" || hash === "#closed-positions" || hash === "#watchlist-page" || isLegalRoute;
  document.body.classList.toggle("portfolio-route", isUtilityRoute);
  document.body.classList.toggle("closed-route", hash === "#closed-positions");
  document.body.classList.toggle("watchlist-route", hash === "#watchlist-page");
  document.body.classList.toggle("legal-route", isLegalRoute);
  document.querySelectorAll(".nav-list a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === hash);
  });
  document.querySelectorAll(".legal-links a").forEach((link) => {
    link.classList.toggle("active", isLegalRoute);
  });

  const target = document.querySelector(hash);
  if (target) {
    if (document.body.classList.contains("mobile-preview")) {
      resetMobilePreviewScroll();
      return;
    }
    window.setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }
}

function setupRussianValidation() {
  [
    elements.coinSearchInput,
    elements.amountInput,
    elements.costInput,
    elements.portfolioPageCoinSelect,
    elements.portfolioPageAmountInput,
    elements.portfolioPageTotalInput,
    elements.portfolioPageCostInput,
    elements.authNameInput,
    elements.authEmailInput,
    elements.authPasswordInput,
    elements.authNewPasswordInput,
    elements.authTelegramInput,
    elements.authLegalConsent,
  ].forEach((input) => {
    if (!input) return;
    input.addEventListener("input", () => input.setCustomValidity(""));
    input.addEventListener("change", () => input.setCustomValidity(""));
    input.addEventListener("invalid", () => setRussianValidityMessage(input));
  });
}

function setupPortfolioChartTimelineControls() {
  const periods = document.querySelector(".portfolio-chart-periods");
  if (!periods || periods.dataset.timelineControls === "ready") return;

  const previous = document.createElement("button");
  previous.type = "button";
  previous.textContent = "‹";
  previous.dataset.portfolioChartShift = "-1";

  const reset = document.createElement("button");
  reset.type = "button";
  reset.textContent = "Сегодня";
  reset.dataset.portfolioChartShift = "0";

  const next = document.createElement("button");
  next.type = "button";
  next.textContent = "›";
  next.dataset.portfolioChartShift = "1";

  const label = document.createElement("span");
  label.className = "portfolio-chart-window-label";
  label.dataset.portfolioChartWindowLabel = "true";

  periods.prepend(previous);
  periods.append(reset, next, label);
  periods.dataset.timelineControls = "ready";

  periods.addEventListener("click", (event) => {
    const button = event.target.closest("[data-portfolio-chart-shift]");
    if (!button) return;
    shiftPortfolioChartWindow(Number(button.dataset.portfolioChartShift) || 0);
  });
}

function shiftPortfolioChartWindow(shift) {
  if (shift === 0) {
    state.portfolioChartWindowOffset = 0;
  } else {
    state.portfolioChartWindowOffset = Math.min(0, state.portfolioChartWindowOffset + shift);
  }
  state.portfolioChartHoverIndex = null;
  renderPortfolioPage();
}

function getPortfolioChartPeriods() {
  return ["1d", "1m", "1y"];
}

function shiftPortfolioChartPeriod(direction) {
  const periods = getPortfolioChartPeriods();
  const currentIndex = Math.max(0, periods.indexOf(state.portfolioChartPeriod));
  const nextIndex = Math.max(0, Math.min(periods.length - 1, currentIndex + direction));
  state.portfolioChartPeriod = periods[nextIndex];
  state.portfolioChartWindowOffset = 0;
  state.portfolioChartHoverIndex = null;
  renderPortfolioPage();
}

function handlePortfolioChartHover(event) {
  const times = state.portfolioChartPointTimes || [];
  const range = state.portfolioChartTimeRange;
  if (!times.length || !range || !elements.portfolioChart) return;

  const rect = elements.portfolioChart.getBoundingClientRect();
  const plotLeft = 48;
  const plotRight = rect.width - 104;
  const x = Math.max(plotLeft, Math.min(plotRight, event.clientX - rect.left));
  const progress = (x - plotLeft) / Math.max(plotRight - plotLeft, 1);
  const targetTime = range.start + (range.end - range.start) * progress;
  let nearestIndex = 0;
  let nearestDistance = Infinity;
  times.forEach((time, index) => {
    const distance = Math.abs(time - targetTime);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  if (state.portfolioChartHoverIndex !== nearestIndex) {
    state.portfolioChartHoverIndex = nearestIndex;
    safeDrawPortfolioChart(state.portfolioChartLastEntries || [], getPortfolioTotals(getPortfolioScopePositions(state.activePortfolioWallet)));
  }
}

function setRussianValidityMessage(input) {
  if ((input.id === "coinSearchInput" || input.id === "portfolioPageCoinSelect") && input.validity.valueMissing) {
    input.setCustomValidity("Выберите монету из списка.");
    return;
  }

  if ((input.id === "amountInput" || input.id === "portfolioPageAmountInput") && input.validity.valueMissing) {
    input.setCustomValidity("Укажите количество монет.");
    return;
  }

  if ((input.id === "costInput" || input.id === "portfolioPageCostInput") && input.validity.valueMissing) {
    input.setCustomValidity("Укажите цену покупки больше нуля.");
    return;
  }

  if (input.validity.valueMissing) {
    input.setCustomValidity("Заполните это поле.");
    return;
  }

  if (input.validity.typeMismatch && input.type === "email") {
    input.setCustomValidity("Введите корректный email.");
    return;
  }

  if (input.validity.rangeUnderflow || input.validity.badInput) {
    input.setCustomValidity("Введите положительное число.");
    return;
  }

  input.setCustomValidity("");
}

function validatePortfolioForm(source) {
  const isPage = source === "page";
  const form = isPage ? elements.portfolioPageForm : elements.portfolioForm;
  const amountInput = isPage ? elements.portfolioPageAmountInput : elements.amountInput;
  const totalInput = isPage ? elements.portfolioPageTotalInput : null;
  const costInput = isPage ? elements.portfolioPageCostInput : elements.costInput;
  const coinInput = isPage ? elements.portfolioPageCoinSelect : elements.coinSearchInput;

  [coinInput, amountInput, totalInput, costInput].filter(Boolean).forEach((input) => input.setCustomValidity(""));

  const coinId = normalizeCoinId(isPage ? elements.portfolioPageCoinSelect.value : getCoinIdFromPortfolioSearch());
  const coin = findCoin(coinId);
  const marketPrice = getCoinMarketPrice(coin);
  const amount = Number(amountInput.value);
  const total = totalInput ? Number(totalInput.value) : 0;
  const cost = marketPrice || Number(costInput.value);

  if (marketPrice > 0) {
    costInput.value = formatPriceInputValue(marketPrice);
  }

  if (!coinId) {
    coinInput.setCustomValidity("Выберите монету из списка.");
  }

  if (isPage) {
    if (amount <= 0 && total <= 0) {
      amountInput.setCustomValidity("Укажите количество монет или сумму покупки.");
    }
  } else if (amount <= 0) {
    amountInput.setCustomValidity("Укажите количество монет.");
  }

  if (cost <= 0) {
    costInput.setCustomValidity("Рыночная цена ещё не определилась. Обновите котировки или выберите актив заново.");
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }

  return true;
}

async function loadDashboard(options = {}) {
  if (state.isRefreshing) {
    return;
  }

  state.isRefreshing = true;

  if (!options.silent) {
    setStatus("Загружаю market-data...");
    renderLoadingRows(state.marketLimit);
    if (!state.coins.length) {
      state.coins = fallbackCoins;
      state.usingFallback = true;
      applyFilters();
      renderAll();
    }
  }

  const [marketResult, globalResult, fearGreedResult] = await Promise.allSettled([
    fetchMarket(),
    fetchGlobalMarket(),
    fetchFearGreed(),
  ]);

  if (marketResult.status === "fulfilled") {
    state.coins = marketResult.value;
    state.usingFallback = false;
  } else {
    console.warn(marketResult.reason);
    state.coins = fallbackCoins;
    state.usingFallback = true;
  }

  state.global = globalResult.status === "fulfilled" ? globalResult.value : null;
  state.fearGreed = fearGreedResult.status === "fulfilled" ? fearGreedResult.value : null;
  updateAltseasonFromTopSample(state.coins);
  state.lastUpdated = new Date();
  state.nextRefreshAt = Date.now() + MARKET_REFRESH_MS;
  state.isRefreshing = false;

  applyFilters();
  repairFallbackPortfolioEntryPrices();
  seedPortfolioValueHistoryFromEvents();
  prunePassivePortfolioValueHistory();
  renderAll();
  setupLiveTickerStream();
}

async function fetchMarket() {
  const pages = Math.ceil(state.marketLimit / MARKET_PAGE_SIZE);
  const pagesData = [];

  for (let index = 0; index < pages; index += 1) {
    try {
      const pageData = await fetchMarketPage(index + 1);
      pagesData.push(pageData);

      if (index === 0) {
        updateAltseasonFromTopSample(pageData, true);
      }

      if (!Array.isArray(pageData) || pageData.length < MARKET_PAGE_SIZE) {
        break;
      }
    } catch (error) {
      console.warn(error);
    }

    if (index < pages - 1) {
      await sleep(MARKET_PAGE_DELAY_MS);
    }
  }

  const geckoCoins = pagesData.flat().slice(0, state.marketLimit);

  if (geckoCoins.length >= state.marketLimit) {
    return geckoCoins;
  }

  const paprikaCoins = await fetchPaprikaMarket();
  const mergedCoins = mergeMarketSources(geckoCoins, paprikaCoins).slice(0, state.marketLimit);

  if (!mergedCoins.length) {
    throw new Error("Market data unavailable");
  }

  return mergedCoins;
}

async function fetchMarketPage(page) {
  const url = new URL(MARKET_API_URL, window.location.origin);
  url.search = new URLSearchParams({
    vs_currency: state.currency,
    order: "market_cap_desc",
    per_page: String(MARKET_PAGE_SIZE),
    page: String(page),
    sparkline: "true",
    price_change_percentage: "1h,7d,30d,1y",
  });

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetchWithTimeout(url, {}, 6500);

    if (response.ok) {
      return response.json();
    }

    if (attempt === 0 && (response.status === 429 || response.status >= 500)) {
      await sleep(MARKET_PAGE_RETRY_DELAY_MS);
      continue;
    }

    throw new Error(`CoinGecko markets page ${page} responded with ${response.status}`);
  }

  throw new Error(`CoinGecko markets page ${page} unavailable`);
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function fetchPaprikaMarket() {
  const url = new URL(PAPRIKA_TICKERS_API_URL, window.location.origin);
  url.search = new URLSearchParams({
    quotes: state.currency.toUpperCase(),
    limit: String(state.marketLimit),
  });

  const response = await fetchWithTimeout(url, {}, 6500);

  if (!response.ok) {
    throw new Error(`CoinPaprika tickers responded with ${response.status}`);
  }

  const payload = await response.json();
  return payload.map(normalizePaprikaCoin).filter(Boolean);
}

function normalizePaprikaCoin(asset) {
  const quote = asset.quotes?.[state.currency.toUpperCase()] || asset.quotes?.USD;

  if (!quote || !Number.isFinite(Number(quote.price))) {
    return null;
  }

  return {
    id: asset.id,
    paprikaId: asset.id,
    symbol: String(asset.symbol || "").toLowerCase(),
    name: asset.name,
    image: `https://static.coinpaprika.com/coin/${asset.id}/logo.png`,
    current_price: Number(quote.price),
    high_24h: Number(quote.price) * (1 + Math.max(Number(quote.percent_change_24h) || 0, 0) / 100),
    low_24h: Number(quote.price) * (1 + Math.min(Number(quote.percent_change_24h) || 0, 0) / 100),
    market_cap: Number(quote.market_cap) || 0,
    market_cap_rank: Number(asset.rank) || 9999,
    total_volume: Number(quote.volume_24h) || 0,
    price_change_percentage_1h_in_currency: Number(quote.percent_change_1h) || 0,
    price_change_percentage_24h: Number(quote.percent_change_24h) || 0,
    price_change_percentage_7d_in_currency: Number(quote.percent_change_7d) || 0,
    price_change_percentage_30d_in_currency: Number(quote.percent_change_30d) || 0,
    price_change_percentage_1y_in_currency: Number(quote.percent_change_1y) || 0,
    ath_change_percentage: 0,
    atl_change_percentage: 0,
    circulating_supply: Number(asset.circulating_supply) || 0,
    total_supply: Number(asset.total_supply) || 0,
    sparkline_in_7d: {
      price: buildFallbackSparkline(Number(quote.price), Number(quote.percent_change_7d) || 0, asset.id),
    },
  };
}

function mergeMarketSources(primaryCoins, secondaryCoins) {
  const result = [...primaryCoins];
  const used = new Set(primaryCoins.map((coin) => `${coin.symbol}-${coin.name}`.toLowerCase()));

  secondaryCoins.forEach((coin) => {
    const key = `${coin.symbol}-${coin.name}`.toLowerCase();
    if (!used.has(key)) {
      used.add(key);
      result.push(coin);
    }
  });

  return result.sort((a, b) => Number(a.market_cap_rank || 9999) - Number(b.market_cap_rank || 9999));
}

async function fetchGlobalMarket() {
  const response = await fetchWithTimeout(GLOBAL_API_URL, {}, 6500);
  if (!response.ok) {
    throw new Error(`CoinGecko global responded with ${response.status}`);
  }

  const payload = await response.json();
  return payload.data;
}

async function fetchFearGreed() {
  const url = new URL(FEAR_GREED_API_URL);
  url.search = new URLSearchParams({ limit: "1", format: "json" });

  const response = await fetchWithTimeout(url, {}, 6500);
  if (!response.ok) {
    throw new Error(`Fear & Greed responded with ${response.status}`);
  }

  const payload = await response.json();
  return payload.data?.[0] || null;
}

function applyFilters() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const sorted = [...state.coins].sort((a, b) => {
    const first = getSortValue(a, state.sortKey);
    const second = getSortValue(b, state.sortKey);
    const direction = state.sortDirection === "asc" ? 1 : -1;
    return (first - second) * direction;
  });

  state.filteredCoins = query
    ? sorted.filter((coin) => coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query))
    : sorted;
}

function getSortValue(coin, sortKey) {
  if (sortKey === "market_cap_rank") {
    return Number(coin.market_cap_rank) || 9999;
  }

  if (sortKey === "estimated_total_volume") {
    return getEstimatedTotalVolume(coin);
  }

  return Number(coin[sortKey]) || 0;
}

function renderSortHeaders() {
  elements.sortHeaderButtons.forEach((button) => {
    const isActive = button.dataset.sort === state.sortKey;
    const icon = button.querySelector("span");
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-sort", isActive ? (state.sortDirection === "asc" ? "ascending" : "descending") : "none");

    if (icon) {
      icon.textContent = isActive ? (state.sortDirection === "asc" ? "↑" : "↓") : "↕";
    }
  });
}

function renderAll() {
  renderUser();
  renderPortfolioBooks();
  renderMarket();
  renderCoinSelect();
  renderPortfolio();
  renderPortfolioPage();
  renderClosedPositions();
  renderWatchlist();
  renderMetrics();
  renderFearGreed();
  renderAltseason();
  renderLiveStrip();
  renderMovers();
  renderInvestorSignals();
  renderPortfolioInsights();
  renderStatus();
}

function renderUser() {
  updateAdminLink();

  if (!state.user) {
    document.body.classList.add("guest-user");
    document.body.classList.remove("registered-user");
    elements.accountCard.classList.remove("is-authenticated");
    elements.accountName.textContent = "Гость BYA";
    elements.accountEmail.textContent = "Регистрация откроет сохранение профиля";
    elements.authBtn.textContent = "Войти / регистрация";
    elements.sidebarAuthBtn.textContent = "Регистрация";
    if (elements.focusPortfolioFormBtn) {
      elements.focusPortfolioFormBtn.textContent = "Войти / добавить";
    }
    return;
  }

  document.body.classList.remove("guest-user");
  document.body.classList.add("registered-user");
  updateRegisteredPortfolioActionLabel();
  elements.accountCard.classList.add("is-authenticated");
  elements.accountName.textContent = state.user.name;
  elements.accountEmail.textContent = `${state.user.email} · ${state.user.role}`;
  elements.authBtn.textContent = "Выйти";
  elements.sidebarAuthBtn.textContent = "Редактировать профиль";
}

function updateAdminLink() {
  if (!elements.adminTopbarLink) return;

  const isAdmin = state.user?.email === ADMIN_EMAIL && Boolean(state.user?.authToken);
  elements.adminTopbarLink.hidden = !isAdmin;
  if (isAdmin) {
    const params = new URLSearchParams({
      email: state.user.email,
      token: state.user.authToken,
    });
    elements.adminTopbarLink.href = `/admin.html?${params.toString()}`;
  } else {
    elements.adminTopbarLink.href = "/admin.html";
  }
}

function updateRegisteredPortfolioActionLabel() {
  if (state.user && elements.focusPortfolioFormBtn) {
    elements.focusPortfolioFormBtn.textContent = "+ Добавить";
  }
}

function requireUserForPortfolioAction() {
  if (state.user) return true;
  openAuthModal();
  showToast("Нужна регистрация", "После регистрации портфель будет сохраняться в аккаунте.", 1);
  return false;
}

function handleAuthButton(event) {
  if (state.user && event.currentTarget === elements.authBtn) {
    state.user = null;
    localStorage.removeItem(STORAGE_KEYS.user);
    renderUser();
    return;
  }

  openAuthModal();
}

function openAuthModal() {
  setPasswordResetMode(Boolean(state.passwordReset));
  if (state.user) {
    elements.authNameInput.value = state.user.name;
    elements.authEmailInput.value = state.user.email;
    if (elements.authTelegramInput) {
      elements.authTelegramInput.value = state.user.telegram || "";
    }
    elements.authRoleInput.value = state.user.role;
  } else {
    elements.authForm.reset();
    if (state.passwordReset?.email) {
      elements.authEmailInput.value = state.passwordReset.email;
    }
  }

  elements.authModal.hidden = false;
  document.body.classList.add("modal-open");
  (state.passwordReset ? elements.authNewPasswordInput : elements.authNameInput).focus();
}

function closeAuthModal() {
  elements.authModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function setPasswordResetMode(enabled) {
  elements.authForm?.classList.toggle("password-reset-mode", enabled);
  elements.authNewPasswordLabel.hidden = !enabled;
  elements.authNewPasswordInput.required = enabled;
  elements.authPasswordInput.required = !enabled;
  elements.authPasswordInput.closest("label").hidden = enabled;
  elements.authTelegramInput.closest("label").hidden = enabled;
  elements.authRoleInput.closest("label").hidden = enabled;
  elements.authLegalConsent.closest("label").hidden = enabled;
  elements.authLoginBtn.hidden = enabled;
  elements.authResetBtn.hidden = enabled;
  document.querySelector("#authTitle").textContent = enabled ? "Новый пароль BYA MarketDesk" : "Регистрация в BYA MarketDesk";
  elements.authForm.querySelector(".primary-button").textContent = enabled ? "Сохранить новый пароль" : "Зарегистрироваться";
}

function readPasswordResetFromUrl() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("resetToken");
  const email = url.searchParams.get("email");
  if (!token || !email) return;

  state.passwordReset = {
    token,
    email: email.trim().toLowerCase(),
  };
  window.setTimeout(() => openAuthModal(), 200);
}

function renderCookieConsent() {
  if (!elements.cookieConsent) return;
  let isAccepted = false;
  try {
    isAccepted = localStorage.getItem(STORAGE_KEYS.cookieConsent) === "accepted";
  } catch (error) {
    isAccepted = false;
  }
  elements.cookieConsent.hidden = isAccepted;
  if (isAccepted) {
    elements.cookieConsent.style.display = "none";
  } else {
    elements.cookieConsent.style.removeProperty("display");
  }
}

function acceptCookieConsent() {
  try {
    localStorage.setItem(STORAGE_KEYS.cookieConsent, "accepted");
  } catch (error) {
    // Safari can block storage in some embedded/private contexts; still close the banner.
  }
  if (elements.cookieConsent) {
    elements.cookieConsent.hidden = true;
    elements.cookieConsent.setAttribute("hidden", "");
    elements.cookieConsent.style.display = "none";
  }
  renderCookieConsent();
}

function normalizeTelegramHandle(value = "") {
  const handle = String(value || "")
    .trim()
    .replace(/^https?:\/\/t\.me\//i, "")
    .replace(/^t\.me\//i, "")
    .replace(/^@+/, "")
    .replace(/[^\w]/g, "")
    .slice(0, 64);
  return handle ? `@${handle}` : "";
}

function renderLegalDocuments() {
  const legalPage = document.querySelector("#legal-page");
  if (!legalPage) return;

  legalPage.innerHTML = `
    <div class="legal-hero">
      <p class="eyebrow">BYA legal</p>
      <h2>Юридическая информация</h2>
      <p>
        Правила использования BYA MarketDesk применяются совместно с публичными документами экосистемы BYAcademy:
        публичной офертой и политикой в отношении обработки персональных данных, размещёнными на официальном сайте
        академии и связанных ресурсах.
      </p>
      <p class="legal-owner">
        Оператор: Индивидуальный предприниматель Минеев Андрей Владимирович · ИНН 027315905288 · ОГРНИП
        322028000175440 · Республика Башкортостан, город Уфа, улица Октябрьской революции.
      </p>
    </div>

    <div class="legal-document-grid">
      <article id="legal-terms" class="legal-document">
        <span>Документ</span>
        <h3>Пользовательское соглашение</h3>
        <p>
          BYA MarketDesk является информационно-аналитическим инструментом экосистемы BYAcademy. Пользователь получает
          доступ к рыночным данным, watchlist, портфелям, отчётам, графикам, новостям и учебно-аналитическим материалам.
          Использование сервиса означает согласие с настоящими правилами и с документами BYAcademy, опубликованными на
          официальных ресурсах.
        </p>
        <p>
          Пользователь обязуется указывать достоверные данные аккаунта, не передавать доступ третьим лицам, не нарушать
          работу сервиса, не копировать интерфейс и материалы без разрешения правообладателя, не использовать сервис для
          противоправных операций, обхода ограничений, автоматизированного сбора данных или распространения материалов от
          имени BYAcademy без согласования.
        </p>
        <p>
          Рыночные данные поступают от внешних поставщиков и могут отличаться от биржевых котировок, задерживаться или
          временно быть недоступными. Сервис может обновляться, ограничиваться или приостанавливаться для технического
          обслуживания, безопасности, соблюдения закона и стабильности работы.
        </p>
      </article>

      <article id="legal-offer" class="legal-document">
        <span>Документ</span>
        <h3>Публичная оферта</h3>
        <p>
          Публичная оферта BYAcademy применяется к доступу к образовательным материалам, сервисам, инструментам и
          продуктам экосистемы, включая BYA MarketDesk, если такой доступ предоставляется через сайт, личный кабинет,
          Telegram-боты, каналы, партнёрские страницы или иные официальные точки входа BYAcademy.
        </p>
        <p>
          Акцептом оферты считается регистрация, оплата, получение доступа к материалам, начало использования сервиса или
          иное действие, подтверждающее намерение пользоваться продуктами BYAcademy. Состав услуг, тариф, срок доступа,
          формат поддержки, порядок возврата и иные существенные условия определяются страницей продукта, условиями
          оплаты и официальной публичной офертой.
        </p>
        <p>
          Если отдельная функция BYA MarketDesk предоставляется бесплатно, она используется в текущем виде. Бесплатный
          доступ не создаёт обязанности обеспечивать непрерывность работы, персональное сопровождение, торговый результат,
          доходность или сохранность внешних рыночных данных.
        </p>
        <p>
          Официальная страница публичной оферты: <a href="https://investecosystem.ru/offer" target="_blank" rel="noopener noreferrer">investecosystem.ru/offer</a>.
        </p>
      </article>

      <article id="legal-privacy" class="legal-document">
        <span>Документ</span>
        <h3>Политика конфиденциальности и cookies</h3>
        <p>
          BYA MarketDesk может обрабатывать имя, email, роль пользователя, данные портфелей, закрытые позиции, заметки,
          избранные активы, технические параметры браузера, cookie и localStorage. Эти данные используются для
          регистрации, восстановления профиля, сохранения настроек, синхронизации портфеля, отображения расчётов и
          стабильной работы интерфейса.
        </p>
        <p>
          Данные портфеля используются внутри аккаунта пользователя и не являются поручением на сделку. Персональные
          данные не передаются третьим лицам для рекламы без согласия пользователя, за исключением случаев, необходимых
          для исполнения закона, защиты прав оператора, технической работы сервиса или выполнения пользовательского
          запроса.
        </p>
        <p>
          Cookie и localStorage сохраняют выбранную валюту, активный портфель, историю графика, статус согласия,
          пользовательский профиль и технические настройки. Продолжая пользоваться сервисом или нажимая «Принять»,
          пользователь соглашается с таким использованием.
        </p>
        <p>
          Официальная политика обработки персональных данных: <a href="https://investecosystem.ru/politica" target="_blank" rel="noopener noreferrer">investecosystem.ru/politica</a>.
        </p>
      </article>

      <article id="legal-risk" class="legal-document legal-risk">
        <span>Важное предупреждение</span>
        <h3>Не инвестиционная рекомендация</h3>
        <p>
          BYA MarketDesk является информационно-аналитическим и образовательным инструментом. Графики, метрики, рейтинги,
          новости, сигналы, отчёты, расчёты PnL и любые материалы сервиса не являются индивидуальной инвестиционной
          рекомендацией, финансовой консультацией, поручением на сделку или гарантией доходности.
        </p>
        <p>
          Криптоактивы волатильны и могут привести к полной или частичной потере капитала. Пользователь самостоятельно
          принимает решения о сделках, налогах, соблюдении законодательства своей юрисдикции, выборе бирж, кошельков,
          платёжных инструментов и уровне риска.
        </p>
      </article>
    </div>
  `;
}

function openPortfolioCoinModal() {
  elements.portfolioCoinModal.hidden = false;
  document.body.classList.add("modal-open");
  elements.portfolioPageAmountInput.value = "";
  elements.portfolioPageTotalInput.value = "";
  elements.portfolioPageCostInput.value = "";
  elements.portfolioPageNoteInput.value = "";
  elements.portfolioPageDateInput.valueAsDate = new Date();
  if (elements.portfolioPageWalletSelect) {
    elements.portfolioPageWalletSelect.value =
      state.activePortfolioWallet === "investment" || state.activePortfolioWallet === "speculative"
        ? state.activePortfolioWallet
        : DEFAULT_POSITION_WALLET;
  }
  updatePortfolioMarketPriceHint();
  updatePortfolioNoteCounter();
  recalculatePortfolioAmount("open");
  elements.portfolioPageCoinSelect.focus();
}

function closePortfolioCoinModal() {
  elements.portfolioCoinModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function createPortfolioBookSnapshot(book = {}) {
  return {
    id: book.id || createPortfolioBookId(),
    name: String(book.name || "Основной портфель").trim() || "Основной портфель",
    createdAt: book.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    portfolio: Array.isArray(book.portfolio) ? book.portfolio : [],
    closedPositions: Array.isArray(book.closedPositions) ? book.closedPositions : [],
    portfolioChartHistory: Array.isArray(book.portfolioChartHistory) ? book.portfolioChartHistory : [],
    portfolioValueHistory: Array.isArray(book.portfolioValueHistory) ? book.portfolioValueHistory : [],
  };
}

function createPortfolioBookId() {
  return `portfolio-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function ensurePortfolioBooks() {
  state.portfolioBooks = Array.isArray(state.portfolioBooks) ? state.portfolioBooks.map(createPortfolioBookSnapshot) : [];

  if (!state.portfolioBooks.length) {
    const defaultBook = createPortfolioBookSnapshot({
      id: state.activePortfolioBookId || "portfolio-default",
      name: "Основной портфель",
      portfolio: state.portfolio,
      closedPositions: state.closedPositions,
      portfolioChartHistory: state.portfolioChartHistory,
      portfolioValueHistory: state.portfolioValueHistory,
    });
    state.portfolioBooks = [defaultBook];
    state.activePortfolioBookId = defaultBook.id;
    persistPortfolioBooks({ sync: false });
  }

  if (!state.portfolioBooks.some((book) => book.id === state.activePortfolioBookId)) {
    state.activePortfolioBookId = state.portfolioBooks[0].id;
  }

  loadActivePortfolioBook();
}

function getActivePortfolioBook() {
  return state.portfolioBooks.find((book) => book.id === state.activePortfolioBookId) || state.portfolioBooks[0] || null;
}

function saveActivePortfolioBook() {
  const activeBook = getActivePortfolioBook();
  if (!activeBook) return;

  Object.assign(activeBook, {
    portfolio: state.portfolio,
    closedPositions: state.closedPositions,
    portfolioChartHistory: state.portfolioChartHistory,
    portfolioValueHistory: state.portfolioValueHistory,
    updatedAt: new Date().toISOString(),
  });
}

function loadActivePortfolioBook() {
  const activeBook = getActivePortfolioBook();
  if (!activeBook) return;

  state.portfolio = normalizePortfolioCoinReferences(Array.isArray(activeBook.portfolio) ? activeBook.portfolio : []);
  state.closedPositions = normalizePortfolioCoinReferences(Array.isArray(activeBook.closedPositions) ? activeBook.closedPositions : []);
  state.portfolioChartHistory = normalizePortfolioCoinReferences(Array.isArray(activeBook.portfolioChartHistory) ? activeBook.portfolioChartHistory : []);
  state.portfolioValueHistory = Array.isArray(activeBook.portfolioValueHistory) ? activeBook.portfolioValueHistory : [];
  state.groupedPortfolioCoins = new Set();
  state.portfolioCollapsed = false;
  state.pendingClosePositionIds = [];
  state.openMovePositionId = "";
}

function normalizeCoinId(coinId) {
  const value = String(coinId || "");
  return LEGACY_COIN_IDS[value] || value;
}

function normalizePortfolioCoinReferences(items) {
  return items.map((item) => ({ ...item, coinId: normalizeCoinId(item.coinId) }));
}

function repairFallbackPortfolioEntryPrices() {
  if (state.usingFallback || !state.portfolio.length) {
    return;
  }

  let changed = false;
  state.portfolio = state.portfolio.map((position) => {
    const coin = findCoin(position.coinId);
    const marketPrice = getCoinMarketPrice(coin);
    const fallbackCoin = fallbackCoins.find(
      (item) =>
        item.id === normalizeCoinId(position.coinId) ||
        String(item.symbol).toLowerCase() === String(coin?.symbol || "").toLowerCase(),
    );
    const fallbackPrice = Number(fallbackCoin?.current_price) || 0;
    const entryPrice = Number(position.cost) || 0;

    if (
      marketPrice > 0 &&
      fallbackPrice > 0 &&
      Math.abs(entryPrice - fallbackPrice) <= Math.max(1, fallbackPrice * 0.000001) &&
      Math.abs(marketPrice - fallbackPrice) / fallbackPrice > 0.02
    ) {
      changed = true;
      return { ...position, cost: marketPrice };
    }

    return position;
  });

  if (changed) {
    persistPortfolio();
  }
}

function persistPortfolioBooks(options = {}) {
  localStorage.setItem(STORAGE_KEYS.portfolioBooks, JSON.stringify(state.portfolioBooks));
  localStorage.setItem(STORAGE_KEYS.activePortfolioBookId, state.activePortfolioBookId);
  if (options.sync !== false) {
    scheduleAccountPortfolioSync();
  }
}

function persistActivePortfolioData() {
  localStorage.setItem(STORAGE_KEYS.portfolio, JSON.stringify(state.portfolio));
  localStorage.setItem(STORAGE_KEYS.closedPositions, JSON.stringify(state.closedPositions));
  localStorage.setItem(STORAGE_KEYS.portfolioChartHistory, JSON.stringify(state.portfolioChartHistory));
  localStorage.setItem(STORAGE_KEYS.portfolioValueHistory, JSON.stringify(state.portfolioValueHistory));
}

function ensureDeletePortfolioBookButton() {
  if (elements.deletePortfolioBookBtn || !elements.createPortfolioBookBtn) return;
  const button = document.createElement("button");
  button.id = "deletePortfolioBookBtn";
  button.className = "subtle-button delete-book-button";
  button.type = "button";
  button.textContent = "Удалить";
  button.hidden = true;
  elements.createPortfolioBookBtn.insertAdjacentElement("afterend", button);
  elements.deletePortfolioBookBtn = button;
}

function renderPortfolioBooks() {
  if (!elements.portfolioBookSelect) return;

  elements.portfolioBookSelect.innerHTML = state.portfolioBooks
    .map((book) => `<option value="${escapeAttribute(book.id)}">${escapeHtml(book.name)}</option>`)
    .join("");
  elements.portfolioBookSelect.value = state.activePortfolioBookId;
  renderPortfolioBookTabs();
}

function renderPortfolioBookTabs() {
  if (!elements.portfolioBookTabs) return;
  const primaryBookId = state.portfolioBooks[0]?.id;
  elements.portfolioBookTabs.innerHTML = state.portfolioBooks
    .map((book) => {
      const isActive = book.id === state.activePortfolioBookId;
      const isPrimary = book.id === primaryBookId;
      return `
        <span class="portfolio-book-tab ${isActive ? "active" : ""}" data-book-tab="${escapeAttribute(book.id)}">
          <button class="portfolio-book-tab-main" type="button" data-book-switch="${escapeAttribute(book.id)}">${escapeHtml(book.name)}</button>
          ${
            isPrimary
              ? ""
              : `<button class="portfolio-book-tab-delete" type="button" data-book-delete="${escapeAttribute(book.id)}" aria-label="Удалить портфель ${escapeAttribute(book.name)}">×</button>`
          }
        </span>
      `;
    })
    .join("");
}

function handlePortfolioBookTabClick(event) {
  const deleteButton = event.target.closest?.("[data-book-delete]");
  if (deleteButton) {
    deletePortfolioBookById(deleteButton.dataset.bookDelete);
    return;
  }

  const switchButton = event.target.closest?.("[data-book-switch]");
  if (switchButton) {
    switchPortfolioBook(switchButton.dataset.bookSwitch);
  }
}

function createPortfolioBook() {
  createPortfolioBookImmediately();
  return;
  const name = window.prompt("Название нового портфеля", `Портфель ${state.portfolioBooks.length + 1}`);
  if (name === null) return;

  const trimmedName = name.trim() || `Портфель ${state.portfolioBooks.length + 1}`;
  saveActivePortfolioBook();
  state.portfolioBooks.push(
    createPortfolioBookSnapshot({
      name: trimmedName,
      portfolio: [],
      closedPositions: [],
      portfolioChartHistory: [],
      portfolioValueHistory: [],
    }),
  );
  state.activePortfolioBookId = state.portfolioBooks.at(-1).id;
  loadActivePortfolioBook();
  persistPortfolioBooks();
  persistActivePortfolioData();
  renderAll();
  showToast("Портфель создан", `${trimmedName}: можно добавлять первые позиции.`, 1);
}

function createPortfolioBookImmediately() {
  const trimmedName = getNextPortfolioBookName();
  saveActivePortfolioBook();
  state.portfolioBooks.push(
    createPortfolioBookSnapshot({
      name: trimmedName,
      portfolio: [],
      closedPositions: [],
      portfolioChartHistory: [],
      portfolioValueHistory: [],
    }),
  );
  state.activePortfolioBookId = state.portfolioBooks.at(-1).id;
  loadActivePortfolioBook();
  persistPortfolioBooks();
  persistActivePortfolioData();
  renderAll();
  showToast("Портфель создан", `${trimmedName}: можно добавлять первые позиции.`, 1);
}

function getNextPortfolioBookName() {
  const existingNames = new Set(state.portfolioBooks.map((book) => String(book.name || "").trim()));
  let index = state.portfolioBooks.length + 1;
  let name = `Портфель ${index}`;
  while (existingNames.has(name)) {
    index += 1;
    name = `Портфель ${index}`;
  }
  return name;
}

function canDeleteActivePortfolioBook() {
  return state.portfolioBooks.length > 1 && state.activePortfolioBookId !== state.portfolioBooks[0]?.id;
}

function renderDeletePortfolioBookButton() {
  if (!elements.deletePortfolioBookBtn) return;
  elements.deletePortfolioBookBtn.hidden = !canDeleteActivePortfolioBook();
}

function deleteActivePortfolioBook() {
  if (!canDeleteActivePortfolioBook()) return;
  const activeBook = getActivePortfolioBook();
  deletePortfolioBookById(activeBook?.id);
}

function deletePortfolioBookById(bookId) {
  if (!bookId || bookId === state.portfolioBooks[0]?.id || state.portfolioBooks.length <= 1) return;
  const activeBook = state.portfolioBooks.find((book) => book.id === bookId);
  if (!activeBook) return;
  const confirmed = window.confirm(`Точно хотите удалить портфель "${activeBook.name}"?`);
  if (!confirmed) return;

  state.portfolioBooks = state.portfolioBooks.filter((book) => book.id !== activeBook.id);
  if (state.activePortfolioBookId === activeBook.id) {
    state.activePortfolioBookId = state.portfolioBooks[0]?.id || "";
  }
  loadActivePortfolioBook();
  persistPortfolioBooks();
  persistActivePortfolioData();
  renderAll();
  showToast("Портфель удалён", `${activeBook.name} удалён. Основной портфель оставлен.`, 1);
}

function switchPortfolioBook(bookId) {
  if (!bookId || bookId === state.activePortfolioBookId) return;
  const nextBook = state.portfolioBooks.find((book) => book.id === bookId);
  if (!nextBook) return;

  saveActivePortfolioBook();
  state.activePortfolioBookId = nextBook.id;
  loadActivePortfolioBook();
  persistPortfolioBooks();
  persistActivePortfolioData();
  renderAll();
}

function openPortfolioCloseModal(positionIds) {
  const ids = Array.isArray(positionIds) ? positionIds : [positionIds];
  const positions = ids.map((id) => state.portfolio.find((position) => position.id === id)).filter(Boolean);
  if (!positions.length) return;

  state.pendingClosePositionIds = positions.map((position) => position.id);
  elements.portfolioCloseForm.dataset.closeMode = "percent";
  elements.closePositionPercentInput.value = "100";
  elements.closePositionAmountInput.value = "";
  elements.portfolioCloseModal.hidden = false;
  document.body.classList.add("modal-open");
  updateClosePositionPreview();
  elements.closePositionPercentInput.focus();
}

function closePortfolioCloseModal() {
  elements.portfolioCloseModal.hidden = true;
  state.pendingClosePositionIds = [];
  document.body.classList.remove("modal-open");
}

function getPendingClosePositions() {
  return state.pendingClosePositionIds.map((id) => state.portfolio.find((position) => position.id === id)).filter(Boolean);
}

function updateClosePositionPreview() {
  const positions = getPendingClosePositions();
  if (!positions.length) return;

  const closeRequest = getCloseRequest(positions);
  const percent = closeRequest.percent;
  const firstCoin = findCoin(positions[0].coinId);
  const totalAmount = closeRequest.totalAmount;
  const closeAmount = closeRequest.amount;
  const closeValue = positions.reduce((sum, position) => {
    const coin = findCoin(position.coinId);
    return sum + (Number(coin?.current_price) || Number(position.cost) || 0) * (Number(position.amount) || 0) * (percent / 100);
  }, 0);
  const entryValue = positions.reduce((sum, position) => sum + (Number(position.cost) || 0) * (Number(position.amount) || 0) * (percent / 100), 0);
  const pnl = closeValue - entryValue;
  const symbol = firstCoin?.symbol?.toUpperCase() || "";
  const name = positions.length > 1 ? `${firstCoin?.name || "Позиция"} · ${positions.length} входа` : firstCoin?.name || "Позиция";

  elements.closePositionAsset.textContent = name;
  elements.closePositionPrice.textContent = `Цена закрытия: ${formatMoney(Number(firstCoin?.current_price) || Number(positions[0].cost) || 0)}`;
  elements.closePositionAmount.textContent = `${formatAmount(closeAmount)} ${symbol} из ${formatAmount(totalAmount)} ${symbol}`;
  elements.closePositionPreview.textContent = `${formatMoney(closeValue)} · ${formatPortfolioDeltaMoney(pnl)} (${formatPercent(entryValue > 0 ? (pnl / entryValue) * 100 : 0)})`;
  elements.closePositionPreview.className = changeClass(pnl);
  elements.closePositionHint.textContent = percent >= 100 ? "Позиция будет полностью перенесена в закрытые." : `В портфеле останется ${formatPlainPercent(100 - percent)} позиции.`;
}

function syncCloseInputs(source) {
  const positions = getPendingClosePositions();
  if (!positions.length) return;

  if (source === "amount") {
    elements.portfolioCloseForm.dataset.closeMode = "amount";
    elements.closePositionPercentInput.value = "";
  } else {
    elements.portfolioCloseForm.dataset.closeMode = "percent";
    elements.closePositionAmountInput.value = "";
  }

  updateClosePositionPreview();
}

function getCloseRequest(positions) {
  const totalAmount = getCloseTotalAmount(positions);
  const mode = elements.portfolioCloseForm.dataset.closeMode === "amount" ? "amount" : "percent";

  if (mode === "amount") {
    const amount = clampCloseAmount(elements.closePositionAmountInput.value, totalAmount);
    const percent = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
    return { mode, amount, percent, totalAmount };
  }

  const percent = clampClosePercent(elements.closePositionPercentInput.value);
  return {
    mode,
    amount: totalAmount * (percent / 100),
    percent,
    totalAmount,
  };
}

function getCloseTotalAmount(positions) {
  return positions.reduce((sum, position) => sum + (Number(position.amount) || 0), 0);
}

function clampCloseAmount(value, totalAmount) {
  const amount = parseCloseNumber(value);
  if (!Number.isFinite(amount)) return 0;
  return Math.max(0, Math.min(totalAmount, amount));
}

function clampClosePercent(value) {
  const percent = parseCloseNumber(value);
  if (!Number.isFinite(percent)) return 100;
  return Math.max(0, Math.min(100, percent));
}

function parseCloseNumber(value) {
  if (typeof value === "number") return value;
  const normalized = String(value ?? "").trim().replace(",", ".");
  if (!normalized) return Number.NaN;
  return Number(normalized);
}

function formatPlainPercent(value) {
  const percent = Number(value);
  if (!Number.isFinite(percent)) return "0%";
  return `${percent.toFixed(percent % 1 === 0 ? 0 : 1)}%`;
}

function confirmClosePortfolioPosition() {
  const positions = getPendingClosePositions();
  if (!positions.length) return;

  const { percent } = getCloseRequest(positions);
  if (percent <= 0) return;
  const result = closePortfolioPositions(positions, percent);
  closePortfolioCloseModal();
  if (result) {
    showToast(result.title, result.message, result.pnl);
  }
}

function showToast(title, message, value = 0) {
  if (!elements.toastContainer) return;

  const toast = document.createElement("div");
  toast.className = `toast-message ${changeClass(value)}`;
  toast.innerHTML = `
    <strong>${escapeHtml(title)}</strong>
    <span>${escapeHtml(message)}</span>
  `;
  elements.toastContainer.append(toast);
  window.setTimeout(() => toast.classList.add("visible"), 20);
  window.setTimeout(() => {
    toast.classList.remove("visible");
    window.setTimeout(() => toast.remove(), 260);
  }, 4200);
}

window.showToast = showToast;

function useCurrentMarketPrice() {
  const coin = findCoin(elements.portfolioPageCoinSelect.value);
  const marketPrice = getCoinMarketPrice(coin);
  if (!marketPrice) {
    elements.portfolioPageCostInput.value = "";
    return;
  }

  elements.portfolioPageCostInput.value = formatPriceInputValue(marketPrice);
  recalculatePortfolioAmount("price");
}

function useQuickMarketPrice() {
  const coinId = getCoinIdFromPortfolioSearch();
  const coin = findCoin(coinId);
  const marketPrice = getCoinMarketPrice(coin);

  if (!marketPrice) {
    elements.coinSearchInput.setCustomValidity("Выберите монету, чтобы подставить рыночную цену.");
    elements.coinSearchInput.reportValidity();
    return;
  }

  elements.costInput.value = formatPriceInputValue(marketPrice);
  elements.costInput.setCustomValidity("");
  elements.costInput.focus();
}

function updatePortfolioMarketPriceHint() {
  const coin = findCoin(elements.portfolioPageCoinSelect.value);
  const marketPrice = getCoinMarketPrice(coin);
  if (!coin) {
    elements.portfolioMarketPriceHint.textContent = "Текущая цена: ...";
    return;
  }

  elements.portfolioMarketPriceHint.textContent = marketPrice
    ? `Текущая цена: ${formatMoney(marketPrice)} · ${coin.symbol.toUpperCase()}`
    : "Текущая цена: ждём live-рынок";
}

function updatePortfolioNoteCounter() {
  elements.portfolioNoteCounter.textContent = String(elements.portfolioPageNoteInput.value.length);
}

function recalculatePortfolioAmount(source) {
  const amount = Number(elements.portfolioPageAmountInput.value);
  const total = Number(elements.portfolioPageTotalInput.value);
  const price = Number(elements.portfolioPageCostInput.value);

  if (source === "total" && total > 0 && price > 0) {
    elements.portfolioPageAmountInput.value = trimNumber(total / price, 8);
  }

  if ((source === "amount" || source === "price") && amount > 0 && price > 0) {
    elements.portfolioPageTotalInput.value = trimNumber(amount * price, 2);
  }

  if (source === "coin" || source === "open") {
    useCurrentMarketPrice();
    return;
  }

  const finalAmount = Number(elements.portfolioPageAmountInput.value);
  const finalTotal = Number(elements.portfolioPageTotalInput.value);
  const coin = findCoin(elements.portfolioPageCoinSelect.value);

  elements.portfolioAddPreview.textContent =
    finalAmount > 0 && price > 0
      ? `${formatAmount(finalAmount)} ${coin?.symbol?.toUpperCase() || ""} на ${formatMoney(finalTotal || finalAmount * price)}`
      : "Укажи сумму или количество";
}

async function saveUserProfile(event) {
  event.preventDefault();

  if (state.passwordReset) {
    await confirmPasswordReset();
    return;
  }

  const password = elements.authPasswordInput.value;
  if (password.length < 8) {
    elements.authPasswordInput.focus();
    showToast("Пароль слишком короткий", "Минимум 8 символов.", -1);
    return;
  }

  state.user = {
    name: elements.authNameInput.value.trim(),
    email: elements.authEmailInput.value.trim().toLowerCase(),
    telegram: normalizeTelegramHandle(elements.authTelegramInput?.value || ""),
    role: elements.authRoleInput.value,
    createdAt: state.user?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const registration = await registerUserOnServer(state.user, password);
  if (!registration?.ok) {
    state.user = readStorage(STORAGE_KEYS.user, null);
    renderUser();
    return;
  }
  if (registration.user) {
    state.user = {
      ...state.user,
      ...registration.user,
    };
  }
  if (registration.authToken) {
    state.user.authToken = registration.authToken;
  }
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(state.user));
  await offerTelegramLink();
  await loadAccountPortfolioData();
  closeAuthModal();
  renderUser();
  showToast("Профиль сохранён", "Регистрация появилась в админ-панели.", 1);
}

async function loginUserProfile() {
  const email = elements.authEmailInput.value.trim().toLowerCase();
  const password = elements.authPasswordInput.value;
  if (!email) {
    elements.authEmailInput.focus();
    showToast("Укажи email", "Для входа нужен email существующего аккаунта.", -1);
    return;
  }
  if (!password) {
    elements.authPasswordInput.focus();
    showToast("Укажи пароль", "Для входа нужен пароль от аккаунта.", -1);
    return;
  }

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok || !data.user) {
      showToast("Аккаунт не найден", "Проверь email или зарегистрируй новый профиль.", -1);
      return;
    }

    state.user = {
      ...data.user,
      email: data.user.email || email,
      authToken: data.authToken || "",
    };
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(state.user));
    await offerTelegramLink();
    await loadAccountPortfolioData();
    closeAuthModal();
    renderUser();
    renderAll();
    showToast("Вход выполнен", "Профиль и портфель загружены.", 1);
  } catch (error) {
    showToast("Не удалось войти", "Проверь подключение и попробуй ещё раз.", -1);
  }
}

async function registerUserOnServer(user, password) {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ ...user, password }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      const message = response.status === 409 ? "Такой email уже зарегистрирован. Войди с паролем или восстанови доступ." : "Проверь данные и попробуй ещё раз.";
      showToast("Регистрация не прошла", message, -1);
      return { ok: false };
    }
    return data;
  } catch (error) {
    console.warn("Registration sync failed", error);
    showToast("Профиль сохранён локально", "Сервер регистрации временно недоступен.", -1);
    return { ok: false };
  }
}

async function requestPasswordReset() {
  const email = elements.authEmailInput.value.trim().toLowerCase();
  if (!email) {
    elements.authEmailInput.focus();
    showToast("Укажи email", "Мы отправим ссылку восстановления на почту аккаунта.", -1);
    return;
  }

  try {
    await fetch("/api/password-reset/request", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    showToast("Проверь почту", "Если аккаунт есть, письмо со ссылкой восстановления уже отправлено.", 1);
  } catch (error) {
    showToast("Не удалось отправить письмо", "Попробуй ещё раз или напиши администратору.", -1);
  }
}

async function offerTelegramLink() {
  if (!state.user?.email || !state.user?.authToken || !state.user?.telegram || state.user?.telegramLinked) return;

  try {
    const response = await fetch("/api/telegram/link/start", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: state.user.email,
        token: state.user.authToken,
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) return;

    if (data.linkUrl) {
      window.open(data.linkUrl, "_blank", "noopener,noreferrer");
      showToast("Привяжи Telegram", "В открывшемся боте нажми Start. После этого сброс пароля будет приходить в Telegram.", 1);
    } else if (data.code) {
      showToast("Telegram-бот почти готов", `Отправь боту команду /start ${data.code}`, 1);
    }
  } catch (error) {
    console.warn("Telegram link start failed", error);
  }
}

async function confirmPasswordReset() {
  const password = elements.authNewPasswordInput.value;
  if (password.length < 8) {
    elements.authNewPasswordInput.focus();
    showToast("Пароль слишком короткий", "Минимум 8 символов.", -1);
    return;
  }

  try {
    const response = await fetch("/api/password-reset/confirm", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: state.passwordReset.email,
        token: state.passwordReset.token,
        password,
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      showToast("Ссылка не сработала", "Запроси новое письмо восстановления.", -1);
      return;
    }

    state.passwordReset = null;
    state.user = {
      ...data.user,
      authToken: data.authToken || "",
    };
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(state.user));
    clearPasswordResetUrl();
    await loadAccountPortfolioData();
    closeAuthModal();
    renderUser();
    renderAll();
    showToast("Пароль обновлён", "Ты снова в аккаунте BYA MarketDesk.", 1);
  } catch (error) {
    showToast("Не удалось обновить пароль", "Проверь подключение и попробуй ещё раз.", -1);
  }
}

function clearPasswordResetUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("resetToken");
  url.searchParams.delete("email");
  window.history.replaceState({}, "", url.toString());
}

async function loadAccountPortfolioData() {
  if (!state.user?.email) return;

  try {
    const response = await fetch(`/api/user/portfolio?email=${encodeURIComponent(state.user.email)}&token=${encodeURIComponent(state.user.authToken || "")}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Portfolio load ${response.status}`);
    }

    const data = await response.json();
    const remote = data.portfolioData;
    if (!hasAccountPortfolioData(remote)) {
      scheduleAccountPortfolioSync(0);
      return;
    }

    state.isApplyingAccountPortfolio = true;
    if (Array.isArray(remote.portfolioBooks) && remote.portfolioBooks.length) {
      saveActivePortfolioBook();
      state.portfolioBooks = mergeByKey(state.portfolioBooks, remote.portfolioBooks.map(createPortfolioBookSnapshot), (item) => item.id);
      state.activePortfolioBookId = remote.activePortfolioBookId || state.activePortfolioBookId || state.portfolioBooks[0]?.id || "";
      ensurePortfolioBooks();
    } else {
      state.portfolio = mergeByKey(state.portfolio, remote.portfolio, (item) => item.id);
      state.closedPositions = mergeByKey(state.closedPositions, remote.closedPositions, (item) => item.sourceId || `${item.coinId}-${item.closedAt}-${item.amount}`);
      state.portfolioChartHistory = mergeByKey(state.portfolioChartHistory, remote.portfolioChartHistory, (item) => item.sourceId || `${item.coinId}-${item.closedAt || item.removedAt}`);
      state.portfolioValueHistory = mergeByKey(state.portfolioValueHistory, remote.portfolioValueHistory, (item) => `${item.at}-${item.reason}-${item.value}`);
      saveActivePortfolioBook();
    }
    persistPortfolio();
    persistClosedPositions();
    persistPortfolioChartHistory();
    persistPortfolioValueHistory();
    persistPortfolioBooks({ sync: false });
    state.isApplyingAccountPortfolio = false;
    renderAll();
    scheduleAccountPortfolioSync(0);
  } catch (error) {
    state.isApplyingAccountPortfolio = false;
    console.warn("Account portfolio load failed", error);
  }
}

function hasAccountPortfolioData(data) {
  return Boolean(
    data &&
      ((Array.isArray(data.portfolio) && data.portfolio.length) ||
        (Array.isArray(data.portfolioBooks) && data.portfolioBooks.length) ||
        (Array.isArray(data.closedPositions) && data.closedPositions.length) ||
        (Array.isArray(data.portfolioChartHistory) && data.portfolioChartHistory.length) ||
        (Array.isArray(data.portfolioValueHistory) && data.portfolioValueHistory.length)),
  );
}

function mergeByKey(localItems = [], remoteItems = [], getKey) {
  const items = new Map();
  [...localItems, ...remoteItems].forEach((item) => {
    if (!item || typeof item !== "object") return;
    const key = getKey(item);
    if (!key) return;
    items.set(key, { ...items.get(key), ...item });
  });
  return [...items.values()];
}

function getAccountPortfolioData() {
  saveActivePortfolioBook();
  return {
    portfolio: state.portfolio,
    closedPositions: state.closedPositions,
    portfolioChartHistory: state.portfolioChartHistory,
    portfolioValueHistory: state.portfolioValueHistory,
    portfolioBooks: state.portfolioBooks,
    activePortfolioBookId: state.activePortfolioBookId,
  };
}

function scheduleAccountPortfolioSync(delay = 900) {
  if (!state.user?.email || state.isApplyingAccountPortfolio) return;

  window.clearTimeout(state.accountSyncTimer);
  state.accountSyncTimer = window.setTimeout(syncAccountPortfolioData, delay);
}

async function syncAccountPortfolioData() {
  if (!state.user?.email || state.isApplyingAccountPortfolio || state.isSyncingAccountPortfolio) return;

  state.isSyncingAccountPortfolio = true;
  try {
    await fetch("/api/user/portfolio", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: state.user.email,
        token: state.user.authToken || "",
        portfolioData: getAccountPortfolioData(),
      }),
    });
  } catch (error) {
    console.warn("Account portfolio sync failed", error);
  } finally {
    state.isSyncingAccountPortfolio = false;
  }
}

function renderLoadingRows(count = state.marketLimit) {
  elements.marketTable.innerHTML = Array.from({ length: Math.min(count, MARKET_RENDER_CHUNK_SIZE) })
    .map(
      () => `
        <tr class="skeleton">
          <td>...</td>
          <td>Загрузка актива...</td>
          <td>...</td>
          <td>...</td>
          <td>...</td>
          <td>...</td>
          <td>...</td>
          <td>...</td>
          <td></td>
        </tr>
      `,
    )
    .join("");
}

function renderMarket() {
  const template = document.querySelector("#coinRowTemplate");
  elements.marketTable.innerHTML = "";

  if (!state.filteredCoins.length) {
    elements.marketTable.innerHTML = `<tr><td colspan="9" class="empty-state">Ничего не найдено</td></tr>`;
    return;
  }

  const visibleCoins = state.filteredCoins.slice(0, state.visibleMarketRows);

  visibleCoins.forEach((coin) => {
    const row = template.content.firstElementChild.cloneNode(true);
    const watchButton = row.querySelector(".watch-button");
    const inlineTradingViewLink = row.querySelector(".tv-inline-link");
    row.dataset.coinId = coin.id;

    row.querySelector("img").src = coin.image;
    row.querySelector("img").alt = coin.name;
    row.querySelector(".rank-cell").textContent = coin.market_cap_rank || "-";
    row.querySelector(".coin-name").textContent = coin.name;
    row.querySelector(".coin-symbol").textContent = coin.symbol.toUpperCase();
    row.querySelector(".price-cell").textContent = formatMoney(coin.current_price);
    row.querySelector(".direct-volume-cell").textContent = formatCompact(coin.total_volume);
    row.querySelector(".total-volume-cell").textContent = formatCompact(getEstimatedTotalVolume(coin));
    row.querySelector(".cap-cell").textContent = formatCompact(coin.market_cap);
    setChangeCell(row, ".change-24", coin.price_change_percentage_24h);
    drawSparkline(row.querySelector(".sparkline"), getSparklinePrices(coin), coin.price_change_percentage_7d_in_currency);
    inlineTradingViewLink.href = getTradingViewUrl(coin);
    inlineTradingViewLink.setAttribute("aria-label", `Открыть ${coin.symbol.toUpperCase()} спот в TradingView`);

    if (state.watchlist.includes(coin.id)) {
      watchButton.classList.add("active");
      watchButton.textContent = "★";
    }

    watchButton.addEventListener("click", () => toggleWatchlist(coin.id));
    elements.marketTable.appendChild(row);
  });

  if (state.filteredCoins.length > visibleCoins.length) {
    const row = document.createElement("tr");
    row.className = "load-more-row";
    row.innerHTML = `
      <td colspan="9">
        <button id="loadMoreMarketBtn" type="button">
          Показать ещё ${Math.min(MARKET_RENDER_CHUNK_SIZE, state.filteredCoins.length - visibleCoins.length)} активов
        </button>
        <span>Показано ${visibleCoins.length} из ${state.filteredCoins.length}</span>
      </td>
    `;
    elements.marketTable.appendChild(row);
    row.querySelector("button").addEventListener("click", () => {
      state.visibleMarketRows = Math.min(state.visibleMarketRows + MARKET_RENDER_CHUNK_SIZE, state.filteredCoins.length);
      renderMarket();
    });
  }
}

function setChangeCell(row, selector, value) {
  const cell = row.querySelector(selector);
  cell.textContent = formatPercent(value);
  cell.className = `${selector.slice(1)} ${changeClass(value)}`;
}

function renderCoinSelect() {
  const currentSearchValue = elements.coinSearchInput.value;
  const currentPageValue = elements.portfolioPageCoinSelect.value;
  const options = state.coins
    .map((coin) => `<option value="${coin.id}">${coin.name} (${coin.symbol.toUpperCase()})</option>`)
    .join("");
  elements.portfolioPageCoinSelect.innerHTML = options;

  if (currentSearchValue) {
    elements.coinSearchInput.value = currentSearchValue;
  }

  if (currentPageValue && state.coins.some((coin) => coin.id === currentPageValue)) {
    elements.portfolioPageCoinSelect.value = currentPageValue;
  }

  updatePortfolioMarketPriceHint();
  recalculatePortfolioAmount("coin");
  renderCoinSearchDropdown(false);
}

function renderCoinSearchDropdown(shouldOpen = true) {
  const dropdown = elements.coinSearchDropdown;
  const input = elements.coinSearchInput;

  if (!dropdown || !input) {
    return;
  }

  const query = input.value.trim().toLowerCase();
  const matches = state.coins
    .filter((coin) => {
      if (!query) return true;
      return (
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query) ||
        `${coin.name} ${coin.symbol}`.toLowerCase().includes(query)
      );
    })
    .slice(0, 80);

  if (!shouldOpen) {
    dropdown.hidden = true;
    input.setAttribute("aria-expanded", "false");
    return;
  }

  if (!matches.length) {
    dropdown.hidden = false;
    input.setAttribute("aria-expanded", "true");
    dropdown.innerHTML = `<div class="coin-search-empty">Монета не найдена</div>`;
    return;
  }

  dropdown.innerHTML = matches
    .map(
      (coin, index) => `
        <button
          class="coin-search-option"
          data-coin-id="${coin.id}"
          role="option"
          type="button"
          ${index === 0 ? 'data-active="true"' : ""}
        >
          <span>${coin.name}</span>
          <small>${coin.symbol.toUpperCase()} · rank #${coin.market_cap_rank || "-"}</small>
        </button>
      `,
    )
    .join("");

  dropdown.hidden = false;
  input.setAttribute("aria-expanded", "true");
  dropdown.querySelectorAll("[data-coin-id]").forEach((button) => {
    button.addEventListener("click", () => selectPortfolioCoin(button.dataset.coinId));
  });
}

function hideCoinSearchDropdown() {
  if (!elements.coinSearchDropdown) {
    return;
  }

  elements.coinSearchDropdown.hidden = true;
  elements.coinSearchInput.setAttribute("aria-expanded", "false");
}

function selectPortfolioCoin(coinId) {
  const coin = findCoin(coinId);
  if (!coin) {
    return;
  }
  const marketPrice = getCoinMarketPrice(coin);

  state.quickPortfolioCoinId = coin.id;
  elements.coinSearchInput.value = `${coin.name} (${coin.symbol.toUpperCase()})`;
  elements.coinSearchInput.setCustomValidity("");
  elements.costInput.value = formatPriceInputValue(marketPrice);
  elements.costInput.setCustomValidity("");
  hideCoinSearchDropdown();
}

function handleCoinSearchKeydown(event) {
  const dropdown = elements.coinSearchDropdown;
  if (!dropdown || dropdown.hidden) {
    if (event.key === "ArrowDown") {
      renderCoinSearchDropdown();
      event.preventDefault();
    }
    return;
  }

  const options = [...dropdown.querySelectorAll(".coin-search-option")];
  const activeIndex = Math.max(0, options.findIndex((option) => option.dataset.active === "true"));

  if (event.key === "Escape") {
    hideCoinSearchDropdown();
    event.preventDefault();
    return;
  }

  if (event.key === "Enter") {
    const activeOption = options[activeIndex];
    if (activeOption) {
      selectPortfolioCoin(activeOption.dataset.coinId);
      event.preventDefault();
    }
    return;
  }

  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
    return;
  }

  const nextIndex =
    event.key === "ArrowDown" ? Math.min(activeIndex + 1, options.length - 1) : Math.max(activeIndex - 1, 0);

  options.forEach((option, index) => {
    option.dataset.active = String(index === nextIndex);
  });
  options[nextIndex]?.scrollIntoView({ block: "nearest" });
  event.preventDefault();
}

function renderPortfolio() {
  if (!elements.portfolioList) {
    return;
  }

  if (!getActivePortfolioPositions().length) {
    elements.portfolioList.innerHTML = `<div class="empty-state">Добавь первую позицию, чтобы видеть стоимость, P/L и долю в портфеле.</div>`;
    return;
  }

  const totals = getPortfolioTotals();
  elements.portfolioList.innerHTML = state.portfolio
    .map((position) => {
      const coin = findCoin(position.coinId);
      const currentValue = coin ? coin.current_price * position.amount : 0;
      const costValue = position.cost * position.amount;
      const pnl = currentValue - costValue;
      const pnlPercent = costValue > 0 ? (pnl / costValue) * 100 : 0;
      const dayMove = currentValue * ((coin?.price_change_percentage_24h || 0) / 100);
      const share = totals.value > 0 ? (currentValue / totals.value) * 100 : 0;
      const name = coin?.name || position.coinId;
      const symbol = coin?.symbol?.toUpperCase() || "";
      const image = coin?.image || "";

      return `
        <article class="asset-card">
          <div class="asset-card-header">
            <strong>${image ? `<img src="${image}" alt="${name}" />` : ""}${name}</strong>
            <button class="remove-button" type="button" data-remove="${position.id}" title="Удалить">×</button>
          </div>
          <div class="asset-card-row">
            <small>${formatAmount(position.amount)} ${symbol} @ ${formatMoney(position.cost)}</small>
            <strong>${formatMoney(currentValue)}</strong>
          </div>
          <div class="asset-card-row">
            <small>P/L all time</small>
            <strong class="${changeClass(pnl)}">${formatMoney(pnl)} (${formatPercent(pnlPercent)})</strong>
          </div>
          <div class="asset-card-row">
            <small>24h вклад</small>
            <strong class="${changeClass(dayMove)}">${formatMoney(dayMove)}</strong>
          </div>
          <a class="trading-link" href="${getTradingViewUrl(coin)}" target="_blank" rel="noopener noreferrer">
            Спот-график TradingView
          </a>
          <div class="allocation-bar" aria-label="Доля ${share.toFixed(1)}%">
            <i style="width: ${Math.min(share, 100).toFixed(2)}%"></i>
          </div>
        </article>
      `;
    })
    .join("");

  elements.portfolioList.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removePortfolioPosition(button.dataset.remove));
  });
}

function renderPortfolioPage() {
  const overviewTitle = document.querySelector(".portfolio-overview-card > span");
  if (overviewTitle) {
    overviewTitle.textContent = "P/L активных позиций";
  }
  const totals = getPortfolioTotals();
  const closedTotals = getClosedPositionsTotals();
  const scopePositions = getPortfolioScopePositions();
  const scopeTotals = getPortfolioTotals(scopePositions);
  const activeWalletLabel = getPortfolioWalletLabel(state.activePortfolioWallet);
  const canGroup = hasGroupablePortfolioPositions();
  if (!canGroup && (state.portfolioCollapsed || state.groupedPortfolioCoins.size)) {
    state.portfolioCollapsed = false;
    state.groupedPortfolioCoins = new Set();
  }
  const groupableCoinIds = getGroupablePortfolioCoinIds();
  const allGrouped = groupableCoinIds.length > 0 && groupableCoinIds.every((coinId) => state.groupedPortfolioCoins.has(coinId));
  const entries = getPortfolioEntries(scopePositions);
  const enriched = entries.map(enrichPortfolioEntry).filter(Boolean);
  const chartEntries = getPortfolioChartEntries(state.activePortfolioWallet);
  const dayPnl = chartEntries.reduce((sum, item) => sum + item.dayMove, 0);
  const dayPct = scopeTotals.value > 0 ? (dayPnl / scopeTotals.value) * 100 : 0;

  elements.portfolioCurrencySelect.value = state.currency;
  elements.portfolioWalletButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.portfolioWallet === state.activePortfolioWallet);
    const count = getPortfolioScopePositions(button.dataset.portfolioWallet).length;
    button.dataset.count = count;
  });
  if (elements.collapsePortfolioBtn) {
    elements.collapsePortfolioBtn.textContent = allGrouped ? "Показать покупки" : "Группировать";
    elements.collapsePortfolioBtn.disabled = !canGroup;
    elements.collapsePortfolioBtn.classList.toggle("active", state.groupedPortfolioCoins.size > 0 && canGroup);
    elements.collapsePortfolioBtn.title = canGroup
      ? "Собрать повторные покупки одной монеты в одну позицию"
      : "Группировка появится, когда есть несколько покупок одной монеты";
  }
  elements.portfolioPageCost.textContent = formatMoney(scopeTotals.cost);
  if (elements.portfolioPageRealized?.previousElementSibling) {
    elements.portfolioPageRealized.previousElementSibling.textContent = "PnL закрытых";
  }
  elements.portfolioPageRealized.textContent = formatPortfolioDeltaMoney(closedTotals.pnl);
  elements.portfolioPageRealized.className = changeClass(closedTotals.pnl);
  elements.portfolioPagePnl.textContent = formatPortfolioDeltaMoney(scopeTotals.pnl);
  elements.portfolioPagePnl.className = changeClass(scopeTotals.pnl);
  elements.portfolioPagePnlPct.textContent = formatPercent(scopeTotals.pnlPercent);
  elements.portfolioPageHoldings.textContent = formatMoney(scopeTotals.value);
  elements.portfolioPageDayPnl.textContent = formatPortfolioDeltaMoney(dayPnl);
  elements.portfolioPageDayPnl.className = changeClass(dayPnl);
  elements.portfolioPageDayPct.textContent = formatPercent(dayPct);
  elements.portfolioPageDayPct.className = changeClass(dayPct);
  elements.portfolioPageChange.textContent = `${formatPortfolioDeltaMoney(scopeTotals.pnl)} ${formatPercent(scopeTotals.pnlPercent)}`;
  elements.portfolioPageChange.className = changeClass(scopeTotals.pnl);

  if (!getActivePortfolioPositions().length) {
    elements.portfolioPageOverview.innerHTML = `
      <div><span>Всего вложено</span><strong>...</strong></div>
      <div><span>Сейчас в портфеле</span><strong>...</strong></div>
      <div><span>За 24ч</span><strong>...</strong></div>
      <p>Добавь первую покупку, чтобы увидеть аналитику, график и объединение позиций.</p>
    `;
    elements.portfolioPageTable.innerHTML = `<tr><td colspan="8" class="empty-state">Портфолио пока пустое. Добавь актив через форму выше.</td></tr>`;
    safeDrawPortfolioChart(chartEntries, scopeTotals);
    safeRenderPortfolioChartStats(chartEntries, scopeTotals, dayPnl, dayPct);
    renderPortfolioReport();
    return;
  }

  if (!scopePositions.length) {
    elements.portfolioPageOverview.innerHTML = `
      <div><span>Раздел</span><strong>${activeWalletLabel}</strong></div>
      <div><span>Сейчас в разделе</span><strong>${formatMoney(0)}</strong></div>
      <div><span>Позиций</span><strong>0</strong></div>
    `;
    elements.portfolioPageTable.innerHTML = `<tr><td colspan="8" class="empty-state">В этом разделе пока нет позиций. Переведи актив из общего списка через колонку «Кошелёк».</td></tr>`;
    safeDrawPortfolioChart(chartEntries, scopeTotals);
    safeRenderPortfolioChartStats(chartEntries, scopeTotals, dayPnl, dayPct);
    renderPortfolioReport();
    return;
  }

  elements.portfolioPageOverview.innerHTML = `
    <div><span>${activeWalletLabel}</span><strong>${scopePositions.length} поз.</strong></div>
    <div><span>Всего вложено</span><strong>${formatMoney(scopeTotals.cost)}</strong></div>
    <div><span>Сейчас в портфеле</span><strong>${formatMoney(scopeTotals.value)}</strong></div>
    <div><span>За 24ч</span><strong class="${changeClass(dayPnl)}">${formatPortfolioDeltaMoney(dayPnl)} ${formatPercent(dayPct)}</strong></div>
  `;

  elements.portfolioPageTable.innerHTML = enriched
    .map((item, index) => portfolioPageRow(item, index))
    .join("");

  safeDrawPortfolioChart(chartEntries, scopeTotals);
  safeRenderPortfolioChartStats(chartEntries, scopeTotals, dayPnl, dayPct);
  renderPortfolioReport();
}

function safeDrawPortfolioChart(entries, scopeTotals = getPortfolioTotals()) {
  try {
    drawPortfolioChart(entries);
  } catch (error) {
    console.warn("Portfolio chart render failed", error);
    drawPortfolioChartFallback(scopeTotals.value || getPortfolioCurrentValue());
  }
}

function drawPortfolioChartFallback(value = 0) {
  const canvas = elements.portfolioChart;
  if (!canvas) return;
  const context = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(560, Math.round(rect.width || canvas.clientWidth || canvas.width));
  const height = Math.max(240, Math.round(rect.height || canvas.clientHeight || canvas.height));
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);
  drawChartBackground(context, width, height);
  const plot = { left: 48, right: width - 104, top: 34, bottom: height - 42 };
  const max = Math.max(Number(value) || 0, 1);
  const scaleY = (amount) => plot.bottom - (amount / max) * (plot.bottom - plot.top - 14);
  const endY = scaleY(max);
  const stepX = plot.left + (plot.right - plot.left) * 0.34;
  context.strokeStyle = "#006dac";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(plot.left, plot.bottom);
  context.lineTo(stepX, plot.bottom);
  context.lineTo(stepX, endY);
  context.lineTo(plot.right, endY);
  context.stroke();
  context.fillStyle = "rgba(0, 109, 172, 0.12)";
  context.beginPath();
  context.moveTo(plot.left, plot.bottom);
  context.lineTo(stepX, plot.bottom);
  context.lineTo(stepX, endY);
  context.lineTo(plot.right, endY);
  context.lineTo(plot.right, plot.bottom);
  context.closePath();
  context.fill();
  context.fillStyle = "#12b981";
  context.fillRect(plot.right + 8, endY - 11, 72, 22);
  context.fillStyle = "#ffffff";
  context.font = "12px Inter, sans-serif";
  context.textAlign = "center";
  context.fillText(formatMoney(max), plot.right + 44, endY + 4);
}

function safeRenderPortfolioChartStats(entries, scopeTotals, dayPnl, dayPct) {
  try {
    renderPortfolioChartStats(entries, scopeTotals, dayPnl, dayPct);
  } catch (error) {
    console.warn("Portfolio chart stats render failed", error);
    if (elements.portfolioChartStats) {
      elements.portfolioChartStats.innerHTML = "";
    }
  }
}

function renderPortfolioChartStats(entries, scopeTotals, dayPnl, dayPct) {
  return renderPortfolioChartStatsV2(entries, scopeTotals, dayPnl, dayPct);
  if (!elements.portfolioChartStats) return;

  const points = state.portfolioChartRenderedPoints || [];
  const hasActivePositions = getPortfolioScopePositions(state.activePortfolioWallet).length > 0;
  const first = points[0] || 0;
  const latest = hasActivePositions ? points.at(-1) || scopeTotals.value || 0 : 0;
  const change = hasActivePositions ? latest - first : 0;
  const changePct = first > 0 ? (change / first) * 100 : 0;
  const activeEntries = entries.filter((entry) => !entry.isExitedChartLot);
  const best = [...activeEntries].sort((a, b) => (Number(b.pnl) || 0) - (Number(a.pnl) || 0))[0];
  const riskShare = scopeTotals.value > 0 && best ? ((Number(best.currentValue) || 0) / scopeTotals.value) * 100 : 0;

  elements.portfolioChartStats.innerHTML = `
    <article>
      <span>Сейчас</span>
      <strong>${formatMoney(currentValue)}</strong>
      <small>${activeEntries.length} активных позиций</small>
    </article>
    <article>
      <span>Старт периода</span>
      <strong>${eventValue > 0 ? formatMoney(eventValue) : "..."}</strong>
      <small>добавление / фиксация</small>
    </article>
    <article>
      <span>Движение графика</span>
      <strong class="${changeClass(change)}">${formatPortfolioDeltaMoney(change)}</strong>
      <small class="${changeClass(changePct)}">${formatPercent(changePct)}</small>
    </article>
    <article>
      <span>Лидер портфеля</span>
      <strong>${best?.coin?.symbol?.toUpperCase() || "..."}</strong>
      <small>${best ? `${formatPortfolioDeltaMoney(best.pnl)} · доля ${formatPercent(riskShare)}` : "нет активных позиций"}</small>
    </article>
  `;
  const chartStatArticles = elements.portfolioChartStats.querySelectorAll("article");
  chartStatArticles[0]?.querySelector("span")?.replaceChildren("Сейчас в портфеле");
  chartStatArticles[1]?.querySelector("span")?.replaceChildren("Вложено по событиям");
}

function renderPortfolioChartStatsV2(entries, scopeTotals, dayPnl, dayPct) {
  if (!elements.portfolioChartStats) return;

  const points = state.portfolioChartRenderedPoints || [];
  const hasActivePositions = getPortfolioScopePositions(state.activePortfolioWallet).length > 0;
  const currentValue = hasActivePositions ? scopeTotals.value || 0 : 0;
  const shouldShowSyntheticStart = hasActivePositions && currentValue > 0 && (points.length < 2 || points.every((point) => point === points[0]));
  const first = shouldShowSyntheticStart ? 0 : points[0] || 0;
  const eventValue = shouldShowSyntheticStart ? currentValue : points.at(-1) || 0;
  const liquidityDelta = hasActivePositions && (points.length > 1 || shouldShowSyntheticStart) ? eventValue - first : 0;
  const liquidityAmount = Math.abs(liquidityDelta);
  const liquidityPct = first > 0 ? (liquidityAmount / first) * 100 : 0;
  const activeEntries = entries.filter((entry) => !entry.isExitedChartLot);
  const closedTotals = getClosedPositionsTotals();
  const closedCount = state.closedPositions.length;
  const liquidityLabel =
    liquidityDelta < 0
      ? "Выведено / зафиксировано"
      : liquidityDelta > 0
        ? "Добавлено ликвидности"
        : "Движение ликвидности";

  elements.portfolioChartStats.innerHTML = `
    <article>
      <span>Сейчас</span>
      <strong>${formatMoney(currentValue)}</strong>
      <small>${activeEntries.length} активных позиций</small>
    </article>
    <article>
      <span>Старт периода</span>
      <strong>${first > 0 ? formatMoney(first) : "..."}</strong>
      <small>${getPortfolioChartPeriodLabel()}</small>
    </article>
    <article>
      <span>${liquidityLabel}</span>
      <strong>${formatMoney(liquidityAmount)}</strong>
      <small>${first > 0 ? `${formatPercent(liquidityPct).replace("+", "")} от старта периода` : "без изменения объёма"}</small>
    </article>
    <article>
      <span>PnL закрытых</span>
      <strong class="${changeClass(closedTotals.pnl)}">${formatPortfolioDeltaMoney(closedTotals.pnl)}</strong>
      <small>${closedCount} закрытых позиций</small>
    </article>
  `;
}

function getPortfolioChartPeriodLabel() {
  if (state.portfolioChartPeriod === "1d") return "за 1 день";
  if (state.portfolioChartPeriod === "1w") return "за 1 неделю";
  if (state.portfolioChartPeriod === "1m") return "за 1 месяц";
  if (state.portfolioChartPeriod === "1y") return "за 1 год";
  return "выбранный период";
}

function renderPortfolioReport() {
  if (!elements.portfolioReportContent) return;

  elements.reportPeriodButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.reportPeriod === state.portfolioReportPeriod);
  });

  const periodStart = getReportPeriodStart(state.portfolioReportPeriod);
  const addedPositions = getPortfolioScopePositions().filter((position) => new Date(position.createdAt || position.date || 0).getTime() >= periodStart);
  const closedPositions = state.closedPositions.filter(
    (position) =>
      (state.activePortfolioWallet === "all" || getPortfolioWalletId(position) === state.activePortfolioWallet) &&
      new Date(position.closedAt || 0).getTime() >= periodStart,
  );
  const closedPnl = closedPositions.reduce((sum, position) => sum + (Number(position.pnl) || 0), 0);
  const closedValue = closedPositions.reduce((sum, position) => sum + (Number(position.closeValue) || 0), 0);
  const totals = getPortfolioTotals(getPortfolioScopePositions());
  const activeRows = getPortfolioEntries(getPortfolioScopePositions()).map(enrichPortfolioEntry).filter(Boolean);
  const bestClosed = [...closedPositions].sort((a, b) => (Number(b.pnl) || 0) - (Number(a.pnl) || 0))[0];
  const worstClosed = [...closedPositions].sort((a, b) => (Number(a.pnl) || 0) - (Number(b.pnl) || 0))[0];
  const bestActive = [...activeRows].sort((a, b) => b.pnl - a.pnl)[0];
  const worstActive = [...activeRows].sort((a, b) => a.pnl - b.pnl)[0];

  elements.portfolioReportContent.innerHTML = `
    <div class="report-stat-grid">
      <article><span>Добавлено</span><strong>${addedPositions.length}</strong><small>${formatMoney(getAddedPositionsValue(addedPositions))}</small></article>
      <article><span>Закрыто</span><strong>${closedPositions.length}</strong><small>${formatMoney(closedValue)}</small></article>
      <article><span>P/L закрытых</span><strong class="${changeClass(closedPnl)}">${formatPortfolioDeltaMoney(closedPnl)}</strong><small>${getReportPeriodLabel(state.portfolioReportPeriod)}</small></article>
      <article><span>Сейчас в портфеле</span><strong>${formatMoney(totals.value)}</strong><small>${formatPercent(totals.pnlPercent)}</small></article>
    </div>
    <div class="report-detail-grid">
      ${reportDealCard("Лучшая закрытая", bestClosed)}
      ${reportDealCard("Худшая закрытая", worstClosed)}
      ${reportActiveCard("Лучшая активная", bestActive)}
      ${reportActiveCard("Худшая активная", worstActive)}
    </div>
  `;
}

function getReportPeriodStart(period) {
  const now = new Date();
  if (period === "month") return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  if (period === "week") {
    const start = new Date(now);
    const day = start.getDay() || 7;
    start.setDate(start.getDate() - day + 1);
    start.setHours(0, 0, 0, 0);
    return start.getTime();
  }
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return start.getTime();
}

function getReportPeriodLabel(period) {
  if (period === "month") return "за месяц";
  if (period === "week") return "за неделю";
  return "за день";
}

function getAddedPositionsValue(positions) {
  return positions.reduce((sum, position) => sum + (Number(position.amount) || 0) * (Number(position.cost) || 0), 0);
}

function reportDealCard(title, position) {
  if (!position) {
    return `<article><span>${title}</span><strong>нет сделок</strong><small>за выбранный период</small></article>`;
  }
  return `
    <article>
      <span>${title}</span>
      <strong class="${changeClass(position.pnl)}">${formatPortfolioDeltaMoney(position.pnl)}</strong>
      <small>${position.coinName || position.symbol || "Позиция"} · ${formatAmount(position.amount)} ${position.symbol || ""}</small>
    </article>
  `;
}

function reportActiveCard(title, item) {
  if (!item) {
    return `<article><span>${title}</span><strong>нет позиций</strong><small>портфель пуст</small></article>`;
  }
  return `
    <article>
      <span>${title}</span>
      <strong class="${changeClass(item.pnl)}">${formatPortfolioDeltaMoney(item.pnl)}</strong>
      <small>${item.coin.name} · ${formatAmount(item.amount)} ${item.coin.symbol.toUpperCase()}</small>
    </article>
  `;
}

function getPortfolioWalletId(position) {
  const wallet = position?.wallet || DEFAULT_POSITION_WALLET;
  return wallet === "investment" || wallet === "speculative" ? wallet : DEFAULT_POSITION_WALLET;
}

function getPortfolioWalletLabel(walletId) {
  if (walletId === "investment") return "Инвестиционный";
  if (walletId === "speculative") return "Спекулятивный";
  if (walletId === "general") return "Общий";
  return "Общий портфель";
}

function getPortfolioScopePositions(walletId = state.activePortfolioWallet) {
  const activePositions = getActivePortfolioPositions();
  if (!walletId || walletId === "all") {
    return activePositions;
  }
  return activePositions.filter((position) => getPortfolioWalletId(position) === walletId);
}

function getActivePortfolioPositions(positions = state.portfolio) {
  const closedSourceIds = new Set(state.closedPositions.map((position) => position.sourceId).filter(Boolean));
  const removedSourceIds = new Set(state.portfolioChartHistory.map((position) => position.sourceId).filter(Boolean));
  return positions.filter(
    (position) =>
      Number(position.amount) > 0 &&
      !position.closedAt &&
      !position.removedAt &&
      !closedSourceIds.has(position.id) &&
      !removedSourceIds.has(position.id) &&
      !isPositionClosedByHistory(position),
  );
}

function isPositionClosedByHistory(position) {
  const openedAt = new Date(position.createdAt || position.date || 0).getTime();
  const amount = Number(position.amount) || 0;
  if (!position.coinId || amount <= 0) return false;

  return state.closedPositions.some((closed) => {
    const closedAt = new Date(closed.closedAt || closed.removedAt || 0).getTime();
    const closedAmount = Number(closed.amount) || 0;
    return (
      closed.coinId === position.coinId &&
      Number.isFinite(closedAt) &&
      (!Number.isFinite(openedAt) || closedAt >= openedAt) &&
      closedAmount >= amount * 0.999
    );
  });
}

function getPortfolioWalletOptions(selectedWallet) {
  const selected = getPortfolioWalletId({ wallet: selectedWallet });
  return [
    { id: "general", label: "Общий" },
    ...POSITION_WALLETS,
  ]
    .map((wallet) => `<option value="${wallet.id}" ${wallet.id === selected ? "selected" : ""}>${wallet.label}</option>`)
    .join("");
}

function getPortfolioMoveMenu(positionId, selectedWallet) {
  const selected = getPortfolioWalletId({ wallet: selectedWallet });
  return [
    { id: "general", label: "Общий" },
    { id: "investment", label: "Инвест" },
    { id: "speculative", label: "Спекул" },
  ]
    .filter((wallet) => wallet.id !== "general" && wallet.id !== selected)
    .map(
      (wallet) =>
        `<button class="${wallet.id === selected ? "active" : ""}" type="button" data-move-position="${positionId}" data-move-wallet="${wallet.id}">${wallet.label}</button>`,
    )
    .join("");
}

function getPortfolioWalletBadge(walletId) {
  return `<span class="portfolio-wallet-badge">${getPortfolioWalletLabel(walletId)}</span>`;
}

function handlePortfolioTableAction(event) {
  const moveWalletButton = event.target.closest("[data-move-wallet]");
  if (moveWalletButton) {
    state.openMovePositionId = "";
    movePortfolioPositionToWallet(moveWalletButton.dataset.movePosition, moveWalletButton.dataset.moveWallet);
    return;
  }

  const moveMenuButton = event.target.closest("[data-move-menu]");
  if (moveMenuButton) {
    const menu = moveMenuButton.closest(".portfolio-move-wrap")?.querySelector(".portfolio-move-menu");
    if (menu) {
      const willOpen = menu.hidden;
      elements.portfolioPageTable.querySelectorAll(".portfolio-move-menu").forEach((item) => {
        item.hidden = true;
      });
      menu.hidden = !menu.hidden;
      state.openMovePositionId = willOpen ? moveMenuButton.dataset.moveMenu : "";
    }
    return;
  }

  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    removePortfolioPosition(removeButton.dataset.remove);
    return;
  }

  const removeGroupButton = event.target.closest("[data-remove-group]");
  if (removeGroupButton) {
    removePortfolioGroup(removeGroupButton.dataset.removeGroup, state.activePortfolioWallet);
    return;
  }

  const closeButton = event.target.closest("[data-close]");
  if (closeButton) {
    openPortfolioCloseModal(closeButton.dataset.close);
    return;
  }

  const closeGroupButton = event.target.closest("[data-close-group]");
  if (closeGroupButton) {
    const positions = getPortfolioScopePositions().filter((position) => position.coinId === closeGroupButton.dataset.closeGroup);
    openPortfolioCloseModal(positions.map((position) => position.id));
    return;
  }

  const groupButton = event.target.closest("[data-group-coin]");
  if (groupButton) {
    groupPortfolioCoin(groupButton.dataset.groupCoin);
    return;
  }

  const ungroupButton = event.target.closest("[data-ungroup-coin]");
  if (ungroupButton) {
    ungroupPortfolioCoin(ungroupButton.dataset.ungroupCoin);
  }
}

function handlePortfolioTableChange(event) {
  const walletSelect = event.target.closest("[data-position-wallet]");
  if (!walletSelect) return;
  movePortfolioPositionToWallet(walletSelect.dataset.positionWallet, walletSelect.value);
}

function movePortfolioPositionToWallet(positionId, walletId) {
  const normalizedWallet = walletId === "investment" || walletId === "speculative" ? walletId : DEFAULT_POSITION_WALLET;
  const position = state.portfolio.find((item) => item.id === positionId);
  if (!position) return;
  if (getPortfolioWalletId(position) === normalizedWallet) return;

  position.wallet = normalizedWallet;
  persistPortfolio();
  renderPortfolio();
  renderPortfolioPage();
  renderPortfolioInsights();
  showToast("Позиция перемещена", `${findCoin(position.coinId)?.name || "Актив"} · ${getPortfolioWalletLabel(normalizedWallet)}`, 1);
}

function togglePortfolioGrouping() {
  if (!hasGroupablePortfolioPositions()) return;
  const groupableCoinIds = getGroupablePortfolioCoinIds();
  const allGrouped = groupableCoinIds.every((coinId) => state.groupedPortfolioCoins.has(coinId));
  state.groupedPortfolioCoins = allGrouped ? new Set() : new Set(groupableCoinIds);
  state.portfolioCollapsed = state.groupedPortfolioCoins.size > 0;
  renderPortfolioPage();
}

function groupPortfolioCoin(coinId) {
  if (!coinId) return;
  state.groupedPortfolioCoins.add(coinId);
  state.portfolioCollapsed = state.groupedPortfolioCoins.size > 0;
  renderPortfolioPage();
}

function ungroupPortfolioCoin(coinId) {
  if (!coinId) return;
  state.groupedPortfolioCoins.delete(coinId);
  state.portfolioCollapsed = state.groupedPortfolioCoins.size > 0;
  renderPortfolioPage();
}

window.togglePortfolioGrouping = togglePortfolioGrouping;
window.groupPortfolioCoin = groupPortfolioCoin;
window.ungroupPortfolioCoin = ungroupPortfolioCoin;

function portfolioPageRow(item, index) {
  const symbol = (item.coin.symbol || "").toUpperCase();
  const hasRepeats = getPortfolioCoinCount(item.coinId, getPortfolioScopePositions()) > 1;
  const coinIdAttribute = escapeHtml(item.coinId);
  const entryDetail = item.collapsed
    ? `${formatAmount(item.amount)} ${symbol} · средняя ${formatMoney(item.cost)} · ${formatEntryCount(item.lots)}`
    : `${formatAmount(item.amount)} ${symbol} · вход ${formatMoney(item.cost)}`;
  const noteDetail = item.note ? `<span class="position-note">${escapeHtml(item.note)}</span>` : "";
  const groupAction = item.collapsed
    ? `<button class="group-position-action ungroup" type="button" data-ungroup-coin="${coinIdAttribute}" onclick="ungroupPortfolioCoin('${coinIdAttribute}')" title="Разъединить" aria-label="Разъединить">↺</button>`
    : hasRepeats
      ? `<button class="group-position-action" type="button" data-group-coin="${coinIdAttribute}" onclick="groupPortfolioCoin('${coinIdAttribute}')" title="Сгруппировать" aria-label="Сгруппировать">⟳</button>`
      : "";
  const removeAttribute = item.collapsed ? `data-remove-group="${item.coin.id}"` : `data-remove="${item.id}"`;
  const closeAttribute = item.collapsed ? `data-close-group="${item.coin.id}"` : `data-close="${item.id}"`;
  const moveAction = item.collapsed
    ? ""
    : `<span class="portfolio-move-wrap">
        <button class="move-position-button" type="button" data-move-menu="${item.id}">Переместить</button>
        <span class="portfolio-move-menu" ${state.openMovePositionId === item.id ? "" : "hidden"}>${getPortfolioMoveMenu(item.id, item.wallet)}</span>
      </span>`;
  const walletCell = item.collapsed
    ? `<span class="portfolio-wallet-badge">${getPortfolioWalletLabel(item.wallet || state.activePortfolioWallet)}</span>`
    : `<select class="portfolio-wallet-select" data-position-wallet="${item.id}" aria-label="Кошелёк позиции">${getPortfolioWalletOptions(item.wallet)}</select>`;

  return `
    <tr>
      <td class="portfolio-row-number"><span>${index + 1}</span></td>
      <td class="portfolio-coin-cell">
        <div class="portfolio-coin-content">
          <img src="${item.coin.image}" alt="${item.coin.name}" />
          <div class="portfolio-coin-copy">
            <strong>${item.coin.name}</strong>
            <span>${entryDetail}</span>
            ${noteDetail}
          </div>
        </div>
      </td>
      <td>${walletCell}</td>
      <td>
        <strong class="portfolio-price-pill">${formatMoney(item.coin.current_price)}</strong>
        <small>рыночная сейчас</small>
      </td>
      <td><strong>${formatMoney(item.cost)}</strong></td>
      <td><strong class="${changeClass(item.pnl)}">${formatPortfolioDeltaMoney(item.pnl)}</strong></td>
      <td><strong class="${changeClass(item.pnlPercent)}">${formatPercent(item.pnlPercent)}</strong></td>
      <td class="portfolio-row-actions">
        <a class="tv-inline-link" href="${getTradingViewUrl(item.coin)}" target="_blank" rel="noopener noreferrer" title="Открыть спот в TradingView">TV</a>
        <button class="close-position-button" type="button" ${closeAttribute}>Закрыть</button>
        ${moveAction}
        <span class="portfolio-icon-actions">
          ${groupAction}
          <button class="remove-button" type="button" ${removeAttribute} title="Удалить">×</button>
        </span>
      </td>
    </tr>
  `;
}

function getPortfolioEntries(positions = getPortfolioScopePositions()) {
  if (!state.groupedPortfolioCoins.size) {
    return positions.map((position) => ({ ...position, lots: 1, collapsed: false }));
  }

  const grouped = new Map();
  positions.forEach((position) => {
    if (!state.groupedPortfolioCoins.has(position.coinId)) {
      grouped.set(position.id, { ...position, amount: Number(position.amount) || 0, lots: 1, collapsed: false });
      return;
    }

    const existing = grouped.get(position.coinId) || {
      id: position.coinId,
      coinId: position.coinId,
      amount: 0,
      costValue: 0,
      lots: 0,
      date: position.date,
      note: "",
      notes: [],
      wallet: getPortfolioWalletId(position),
      positions: [],
      createdAt: position.createdAt,
      collapsed: true,
    };
    existing.amount += Number(position.amount) || 0;
    existing.costValue += (Number(position.cost) || 0) * (Number(position.amount) || 0);
    existing.lots += 1;
    existing.positions.push(position);
    existing.date = existing.date && position.date && existing.date < position.date ? existing.date : position.date || existing.date;
    if (position.note && !existing.notes.includes(position.note)) {
      existing.notes.push(position.note);
      existing.note = existing.notes.join(" · ");
    }
    existing.createdAt =
      existing.createdAt && position.createdAt && existing.createdAt < position.createdAt
        ? existing.createdAt
        : position.createdAt || existing.createdAt;
    grouped.set(position.coinId, existing);
  });

  return [...grouped.values()].map((entry) => {
    if (entry.lots <= 1) {
      return entry.positions ? { ...entry.positions[0], lots: 1, collapsed: false } : entry;
    }

    return {
      ...entry,
      cost: entry.amount > 0 ? entry.costValue / entry.amount : 0,
    };
  });
}

function getPortfolioCoinCount(coinId, positions = state.portfolio) {
  return positions.filter((position) => position.coinId === coinId).length;
}

function hasGroupablePortfolioPositions() {
  return getGroupablePortfolioCoinIds().length > 0;
}

function getGroupablePortfolioCoinIds(positions = getPortfolioScopePositions()) {
  const counts = new Map();
  positions.forEach((position) => {
    const count = (counts.get(position.coinId) || 0) + 1;
    counts.set(position.coinId, count);
  });

  return [...counts.entries()].filter(([, count]) => count > 1).map(([coinId]) => coinId);
}

function formatEntryCount(value) {
  const count = Number(value) || 0;
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} вход`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} входа`;
  return `${count} входов`;
}

function enrichPortfolioEntry(entry) {
  const coin = findCoin(entry.coinId);
  if (!coin) return null;
  const currentValue = coin.current_price * entry.amount;
  const costValue = entry.cost * entry.amount;
  const pnl = currentValue - costValue;
  const pnlPercent = costValue > 0 ? (pnl / costValue) * 100 : 0;
  const dayMove = currentValue * ((coin.price_change_percentage_24h || 0) / 100);
  return { ...entry, coin, currentValue, costValue, pnl, pnlPercent, dayMove };
}

function getPortfolioChartEntries(walletId = "all") {
  const activePositions = getPortfolioScopePositions(walletId);
  const activeEntries = activePositions
    .map((position) => ({ ...position, lots: 1, collapsed: false }))
    .map(enrichPortfolioChartEntry)
    .filter(Boolean);
  const closedEntries = state.closedPositions
    .filter((position) => walletId === "all" || getPortfolioWalletId(position) === walletId)
    .map(getExitedPositionChartEntry)
    .filter(Boolean);
  const removedEntries = state.portfolioChartHistory
    .filter((position) => walletId === "all" || getPortfolioWalletId(position) === walletId)
    .map(getExitedPositionChartEntry)
    .filter(Boolean);
  return [...activeEntries, ...closedEntries, ...removedEntries];
}

function enrichPortfolioChartEntry(entry) {
  const amount = Number(entry.amount) || 0;
  const cost = Number(entry.cost) || 0;
  if (amount <= 0) return null;

  const coin = findCoin(entry.coinId);
  const currentPrice = Number(coin?.current_price) || cost;
  const currentValue = currentPrice * amount;
  const costValue = cost * amount;
  const pnl = currentValue - costValue;
  const pnlPercent = costValue > 0 ? (pnl / costValue) * 100 : 0;
  const dayMove = currentValue * ((Number(coin?.price_change_percentage_24h) || 0) / 100);

  return {
    ...entry,
    coin,
    currentValue,
    costValue,
    pnl,
    pnlPercent,
    dayMove,
  };
}

function getExitedPositionChartEntry(position) {
  const coin = findCoin(position.coinId);
  const amount = Number(position.amount) || 0;
  const entryPrice = Number(position.entryPrice) || 0;
  const closePrice = Number(position.closePrice) || entryPrice;
  if (amount <= 0) return null;

  return {
    id: `history-${position.id}`,
    sourceId: position.sourceId,
    coinId: position.coinId,
    wallet: getPortfolioWalletId(position),
    amount,
    cost: entryPrice,
    coin,
    createdAt: position.openedAt,
    date: position.openedAt,
    closedAt: position.closedAt || position.removedAt,
    costValue: Number(position.entryValue) || entryPrice * amount,
    currentValue: Number(position.closeValue) || closePrice * amount,
    pnl: Number(position.pnl) || (closePrice - entryPrice) * amount,
    pnlPercent: Number(position.pnlPercent) || 0,
    dayMove: 0,
    isExitedChartLot: true,
  };
}

function drawPortfolioChartV2(entries) {
  const canvas = elements.portfolioChart;
  if (!canvas) return;
  state.portfolioChartLastEntries = entries;

  const context = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(560, Math.round(rect.width || canvas.clientWidth || canvas.width));
  const height = Math.max(240, Math.round(rect.height || canvas.clientHeight || canvas.height));
  const pixelWidth = Math.round(width * dpr);
  const pixelHeight = Math.round(height * dpr);

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);
  syncPortfolioChartControls();
  drawChartBackground(context, width, height);

  if (!entries.length) {
    const fallbackValue = getPortfolioCurrentValue();
    if (fallbackValue > 0) {
      drawPortfolioChartFallback(fallbackValue);
      state.portfolioChartRenderedPoints = [0, fallbackValue];
      state.portfolioChartPointTimes = [Date.now() - 1, Date.now()];
      return;
    }
    state.portfolioChartRenderedPoints = [];
    drawEmptyPortfolioChart(context, width, height);
    return;
  }

  const rawPoints = getPortfolioChartPoints(entries);
  const finitePoints = rawPoints.map((point) => (Number.isFinite(point) ? point : 0));
  let points = finitePoints.map((point) => Math.max(0, point)).filter((point) => Number.isFinite(point));
  const fallbackCurrentValue = getPortfolioCurrentValue();
  if ((points.length < 2 || points.every((point) => point === points[0])) && fallbackCurrentValue > 0) {
    points = [0, fallbackCurrentValue];
    const fallbackTimes = createFirstDepositDisplayPoints(fallbackCurrentValue, state.portfolioChartTimeRange?.start || Date.now() - 1, state.portfolioChartTimeRange?.end || Date.now());
    state.portfolioChartPointTimes = fallbackTimes.map((point) => point.time);
  }
  if (!points.length) {
    const fallbackValue = fallbackCurrentValue;
    if (fallbackValue > 0) {
      drawPortfolioChartFallback(fallbackValue);
      state.portfolioChartRenderedPoints = [0, fallbackValue];
      state.portfolioChartPointTimes = [Date.now() - 1, Date.now()];
      return;
    }
    state.portfolioChartRenderedPoints = [];
    drawEmptyPortfolioChart(context, width, height);
    return;
  }
  state.portfolioChartRenderedPoints = points;

  const { min, max } = getPortfolioChartBounds(points);
  const range = Math.max(max - min, 1);
  const plot = { left: 48, right: width - 104, top: 34, bottom: height - 42 };
  const scaleY = (value) => plot.bottom - ((value - min) / range) * (plot.bottom - plot.top);
  const scaleX = (index, count) => {
    const pointTime = state.portfolioChartPointTimes[index];
    const timeRange = state.portfolioChartTimeRange;
    if (Number.isFinite(pointTime) && timeRange && Number.isFinite(timeRange.start) && Number.isFinite(timeRange.end) && timeRange.end > timeRange.start) {
      const progress = Math.max(0, Math.min(1, (pointTime - timeRange.start) / (timeRange.end - timeRange.start)));
      const x = plot.left + progress * (plot.right - plot.left);
      return count <= 1 ? clamp(x, plot.left + 16, plot.right - 16) : x;
    }
    return plot.left + (index / Math.max(count - 1, 1)) * (plot.right - plot.left);
  };
  const trend = points.at(-1) - points[0];
  const chartChange = getPortfolioChartChange(points);

  drawChartGrid(context, plot, min, max, scaleY);
  drawChartTimeAxis(context, plot);

  if (state.portfolioChartMode === "line") {
    drawPortfolioLineChart(context, points, plot, scaleX, scaleY, trend);
  } else if (state.portfolioChartMode === "candles") {
    drawPortfolioCandles(context, points, plot, scaleX, scaleY);
  } else {
    drawPortfolioBarChart(context, points, plot, scaleX, scaleY);
  }

  drawChartPriceLabels(context, points, plot, scaleY, trend);
  drawPortfolioChartHover(context, points, plot, scaleX, scaleY);
  drawPortfolioChartHeader(context, plot, points, chartChange);
}

function drawPortfolioChart(entries) {
  return drawPortfolioChartV2(entries);
  const canvas = elements.portfolioChart;
  if (!canvas) return;
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);
  {
  syncPortfolioChartControls();
  drawChartBackground(context, width, height);

  if (!entries.length) {
    context.fillStyle = "#8ea7b3";
    context.font = "18px Inter, sans-serif";
    context.fillText("Добавьте активы, чтобы построить график портфеля", 32, height / 2);
    return;
  }

  const rawPoints = getPortfolioChartPoints(entries);
  const finitePoints = rawPoints.map((point) => (Number.isFinite(point) ? point : 0));
  const stablePoints = stabilizePortfolioChartPoints(finitePoints);
  const points = smoothPortfolioChartPoints(stablePoints).map((point) => Math.max(0, point));
  let min = 0;
  let max = Math.max(...points, 1);

  if (max <= 0) {
    max = 1;
  }

  const range = max - min;
  const plot = { left: 42, right: width - 86, top: 18, bottom: height - 34 };
  const scaleY = (value) => plot.bottom - ((value - min) / range) * (plot.bottom - plot.top);
  const scaleX = (index, count) => {
    const pointTime = state.portfolioChartPointTimes[index];
    const timeRange = state.portfolioChartTimeRange;
    if (Number.isFinite(pointTime) && timeRange && Number.isFinite(timeRange.start) && Number.isFinite(timeRange.end) && timeRange.end > timeRange.start) {
      const progress = Math.max(0, Math.min(1, (pointTime - timeRange.start) / (timeRange.end - timeRange.start)));
      return plot.left + progress * (plot.right - plot.left);
    }
    return plot.left + (index / Math.max(count - 1, 1)) * (plot.right - plot.left);
  };
  const trend = points.at(-1) - points[0];

  drawChartGrid(context, plot, min, max, scaleY);

  if (state.portfolioChartMode === "line") {
    drawPortfolioLineChart(context, points, plot, scaleX, scaleY, trend);
  } else if (state.portfolioChartMode === "bars") {
    drawPortfolioBarChart(context, points, plot, scaleX, scaleY);
  } else {
    drawPortfolioCandles(context, points, plot, scaleX, scaleY);
  }

  drawChartPriceLabels(context, points, plot, scaleY, trend);
  return;
  }

  if (!entries.length) {
    context.fillStyle = "#647582";
    context.font = "18px Inter, sans-serif";
    context.fillText("Добавь активы, чтобы построить график портфеля", 32, height / 2);
    return;
  }

  const maxLength = Math.max(...entries.map((entry) => getSparklinePrices(entry.coin).length), 0);
  const points = Array.from({ length: maxLength || 24 }, (_, index) =>
    entries.reduce((sum, entry) => {
      const prices = getSparklinePrices(entry.coin);
      const price = prices[index] || prices.at(-1) || entry.coin.current_price;
      return sum + price * entry.amount;
    }, 0),
  );
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const padding = 26;

  context.beginPath();
  points.forEach((value, index) => {
    const x = padding + (index / Math.max(points.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.strokeStyle = "#0e79b8";
  context.lineWidth = 2;
  context.stroke();

  context.lineTo(width - padding, height - padding);
  context.lineTo(padding, height - padding);
  context.closePath();
  context.fillStyle = "rgba(14, 121, 184, 0.12)";
  context.fill();

  context.fillStyle = "#0f8a5f";
  context.font = "15px Inter, sans-serif";
  context.fillText(formatMoney(max), width - 150, 28);
  context.fillStyle = "#be3f46";
  context.fillText(formatMoney(min), width - 150, height - 18);
}

function syncPortfolioChartControls() {
  if (!getPortfolioChartPeriods().includes(state.portfolioChartPeriod)) {
    state.portfolioChartPeriod = "1d";
  }
  elements.portfolioChartModeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.portfolioChartMode === state.portfolioChartMode);
  });
  elements.portfolioChartPeriodButtons.forEach((button) => {
    button.hidden = !getPortfolioChartPeriods().includes(button.dataset.portfolioChartPeriod);
    button.classList.toggle("active", button.dataset.portfolioChartPeriod === state.portfolioChartPeriod);
  });
  document.querySelectorAll("[data-portfolio-chart-shift]").forEach((button) => {
    const shift = Number(button.dataset.portfolioChartShift) || 0;
    button.disabled = shift > 0 && state.portfolioChartWindowOffset >= 0;
    button.classList.toggle("active", (shift === 0 && state.portfolioChartWindowOffset === 0) || (shift < 0 && state.portfolioChartWindowOffset < 0));
  });
  const label = document.querySelector("[data-portfolio-chart-window-label]");
  if (label) {
    label.textContent = getPortfolioChartWindowLabel();
  }
}

function getPortfolioChartPoints(entries) {
  const windowRange = getPortfolioChartWindow();
  const now = windowRange.end;
  const periodStart = windowRange.start;
  state.portfolioChartTimeRange = { start: periodStart, end: now, isCurrent: windowRange.isCurrent };
  const configs = {
    "1d": { targetLength: 144, periodMs: 24 * 60 * 60 * 1000 },
    "1w": { targetLength: 168, periodMs: 7 * 24 * 60 * 60 * 1000 },
    "1m": { targetLength: 180, periodMs: 30 * 24 * 60 * 60 * 1000 },
    "1y": { targetLength: 220, periodMs: 365 * 24 * 60 * 60 * 1000 },
  };
  const config = configs[state.portfolioChartPeriod] || configs["1d"];
  if (!entries.length) {
    state.portfolioChartPointTimes = [];
    state.portfolioChartTimeRange = null;
    return [];
  }

  const visiblePeriodMs = Math.max(now - periodStart, 1);
  const transitionMs = getChartTransitionMs(visiblePeriodMs);
  const valueHistory = getPortfolioValueHistoryInRange(periodStart, now);
  if (valueHistory.length >= 2) {
    const displayHistory = getPortfolioDisplayHistory(valueHistory, now, windowRange.isCurrent);
    state.portfolioChartPointTimes = displayHistory.map((point) => point.time);
    return displayHistory.map((point) => point.value);
  }

  const eventHistory = getPortfolioEventHistory(entries, periodStart, now);
  if (eventHistory.length >= 1) {
    const displayHistory = getPortfolioDisplayHistory(eventHistory, now, windowRange.isCurrent);
    state.portfolioChartPointTimes = displayHistory.map((point) => point.time);
    return displayHistory.map((point) => point.value);
  }

  const timestamps = getPortfolioChartTimestamps(entries, periodStart, now, config.targetLength, transitionMs);
  const reconstructedPoints = timestamps.map((timestamp) =>
    entries.reduce((sum, entry) => sum + getLiquidityValueAt(entry, timestamp, now, periodStart), 0),
  );
  state.portfolioChartPointTimes = timestamps;

  return reconstructedPoints;
}

function choosePortfolioChartEventPoints(historyPoints, liquidityPoints) {
  state.portfolioChartPointSource = "history";
  if (!historyPoints.length) return liquidityPoints;
  if (!liquidityPoints.length) return historyPoints;

  const historyScore = getPortfolioChartStepScore(historyPoints);
  const liquidityScore = getPortfolioChartStepScore(liquidityPoints);
  if (historyScore.distinctValues >= 2) {
    const historyCurrentFit = getPortfolioChartCurrentFit(historyPoints);
    const liquidityCurrentFit = getPortfolioChartCurrentFit(liquidityPoints);
    const historyHasExit = historyPoints.some((point) => /close|remove/i.test(String(point.reason || "")));
    const historyMax = Math.max(...historyPoints.map((point) => Number(point.value) || 0));
    const currentValue = getPortfolioCurrentValue();
    const hasStalePeak = !historyHasExit && Number.isFinite(currentValue) && historyMax > currentValue + Math.max(currentValue * 0.06, 1000);
    if (hasStalePeak) {
      state.portfolioChartPointSource = "liquidity-stale-history";
      return liquidityPoints;
    }
    if (historyCurrentFit.fits || historyHasExit || !liquidityCurrentFit.fits) return historyPoints;
    state.portfolioChartPointSource = "liquidity-current-fit";
    return liquidityPoints;
  }
  if (liquidityScore.distinctValues > historyScore.distinctValues) {
    state.portfolioChartPointSource = "liquidity-distinct";
    return liquidityPoints;
  }
  if (liquidityScore.visibleMoves > historyScore.visibleMoves) {
    state.portfolioChartPointSource = "liquidity-visible";
    return liquidityPoints;
  }
  return historyPoints;
}

function getPortfolioChartCurrentFit(points) {
  const currentValue = getPortfolioCurrentValue();
  const lastValue = Number(points.at(-1)?.value);
  if (!Number.isFinite(currentValue) || !Number.isFinite(lastValue)) return { fits: false, difference: Number.POSITIVE_INFINITY };
  const difference = Math.abs(Math.max(0, currentValue) - Math.max(0, lastValue));
  const threshold = Math.max(Math.max(Math.abs(currentValue), Math.abs(lastValue)) * 0.04, 1000);
  return { fits: difference <= threshold, difference };
}

function getPortfolioChartStepScore(points) {
  const values = points.map((point) => Number(point.value)).filter((value) => Number.isFinite(value));
  const distinctValues = new Set(values.map((value) => Math.round(value * 100) / 100)).size;
  const visibleMoves = values.reduce((count, value, index) => {
    if (index === 0) return count;
    const previous = values[index - 1];
    return Math.abs(value - previous) >= getPortfolioChartVisibleMoveThreshold(Math.max(previous, value)) ? count + 1 : count;
  }, 0);
  return { distinctValues, visibleMoves };
}

function appendCurrentPortfolioChartPoint(points, now) {
  const currentValue = getPortfolioCurrentValue();
  if (!Number.isFinite(currentValue) || currentValue < 0) return points;
  const last = points.at(-1);
  if (!last) {
    return getActivePortfolioPositions().length ? [{ time: now, value: currentValue }] : points;
  }

  const normalizedCurrent = Math.max(0, currentValue);
  const lastValue = Number(last.value) || 0;
  const lastTime = Number(last.time) || now;
  const hasActivePositions = getActivePortfolioPositions().length > 0;
  const lastWasExit = /close|remove|exit/i.test(String(last.reason || ""));
  if (!hasActivePositions && lastWasExit && now > lastTime) {
    return [...points, { time: Math.max(lastTime + 1, now), value: normalizedCurrent, reason: "display-after-exit" }];
  }

  if (!hasActivePositions) return points;

  const moveThreshold = getPortfolioChartNoiseThreshold(Math.max(lastValue, normalizedCurrent));
  if (Math.abs(lastValue - normalizedCurrent) <= moveThreshold) return points;

  const currentTime = Math.max(lastTime + 1, now);
  return [...points, { time: currentTime, value: normalizedCurrent, reason: "display-current" }];
}

function spreadCompressedPortfolioChartPoints(points, periodStart, now) {
  if (state.portfolioChartPeriod !== "1d" || points.length < 3) return points;
  const validPoints = points.filter((point) => Number.isFinite(point.time) && Number.isFinite(point.value));
  if (validPoints.length < 3) return points;

  const range = Math.max(now - periodStart, 1);
  const firstTime = validPoints[0].time;
  const lastTime = validPoints.at(-1).time;
  const eventSpan = Math.max(lastTime - firstTime, 0);
  const distinctValues = new Set(validPoints.map((point) => Math.round(Number(point.value) * 100) / 100)).size;
  if (distinctValues < 2 || eventSpan > range * 0.16) {
    return widenPortfolioExitTransitions(points, periodStart, now);
  }

  const start = periodStart + range * 0.12;
  const end = periodStart + range * 0.9;
  const step = (end - start) / Math.max(validPoints.length - 1, 1);
  const spreadPoints = validPoints.map((point, index) => ({
    ...point,
    time: Math.min(now, start + step * index),
  }));
  return widenPortfolioExitTransitions(spreadPoints, periodStart, now);
}

function widenPortfolioExitTransitions(points, periodStart, now) {
  if (state.portfolioChartPeriod !== "1d" || points.length < 3) return points;
  const range = Math.max(now - periodStart, 1);
  const exitGap = range * 0.035;
  const tailGap = range * 0.02;
  const adjusted = points.map((point) => ({ ...point }));

  for (let index = 1; index < adjusted.length; index += 1) {
    const point = adjusted[index];
    const previous = adjusted[index - 1];
    const next = adjusted[index + 1];
    const isExit = /close|remove|exit/i.test(String(point.reason || ""));
    if (!isExit || !previous) continue;

    const needsExitTail = next && /display-after-exit/i.test(String(next.reason || ""));
    const latestExitTime = needsExitTail ? now - tailGap : now;
    point.time = Math.min(latestExitTime, Math.max(point.time, previous.time + exitGap));

    if (needsExitTail) {
      next.time = Math.min(now, Math.max(next.time, point.time + tailGap));
    }
  }

  for (let index = 1; index < adjusted.length; index += 1) {
    if (adjusted[index].time <= adjusted[index - 1].time) {
      adjusted[index].time = adjusted[index - 1].time + 1;
    }
    adjusted[index].time = Math.min(adjusted[index].time, now);
  }

  return adjusted;
}

function getPortfolioValueStepPoints(periodStart, now) {
  const history = getPortfolioValueHistoryInRange(periodStart, now)
    .map((point) => ({
      reason: point.reason || "history",
      time: point.time,
      value: Math.max(0, Number(point.value) || 0),
    }))
    .filter((point) => Number.isFinite(point.time) && Number.isFinite(point.value));

  if (!history.length) return [];

  const points = [];
  history.forEach((point, index) => {
    const previous = history[index - 1];
    if (!previous && point.time >= periodStart && point.value > 0) {
      points.push({ time: getPortfolioStepLeadTime(point.time, periodStart, now), value: 0 });
    }
    if (previous && previous.value !== point.value && point.time >= periodStart) {
      points.push({ time: getPortfolioStepLeadTime(point.time, periodStart, now), value: previous.value });
    }
    points.push(point);
  });

  return points.filter((point, index, list) => {
    const previous = list[index - 1];
    if (!previous) return true;
    if (previous.time === point.time && previous.value === point.value) return false;
    if (previous.time === point.time) {
      point.time += 1;
    }
    return true;
  });
}

function getPortfolioLiquidityStepPoints(entries, periodStart, now) {
  const events = getPortfolioLiquidityEvents(entries, now);
  if (!events.length) {
    const currentValue = getPortfolioCurrentValue();
    return currentValue > 0 ? createFirstDepositDisplayPoints(currentValue, periodStart, now) : [];
  }

  let runningValue = 0;
  const points = [];
  let carriedValue = 0;
  let previousVisibleValue = 0;
  events.forEach((event) => {
    const beforeValue = runningValue;
    runningValue = Math.max(0, runningValue + event.delta);

    if (event.time < periodStart) {
      carriedValue = runningValue;
      previousVisibleValue = runningValue;
      return;
    }

    if (event.time > now) {
      return;
    }

    if (!points.length) {
      points.push({ time: getPortfolioStepLeadTime(event.time, periodStart, now), value: carriedValue || beforeValue || 0 });
    } else if (previousVisibleValue !== beforeValue) {
      points.push({ time: getPortfolioStepLeadTime(event.time, periodStart, now), value: beforeValue });
    }

    points.push({ time: event.time, value: runningValue });
    previousVisibleValue = runningValue;
  });

  if (carriedValue > 0 && (!points.length || points[0].time > periodStart)) {
    points.unshift({ time: periodStart, value: carriedValue });
  }

  const visiblePoints = points.filter((point, index, list) => {
    const previous = list[index - 1];
    return !previous || previous.time !== point.time || previous.value !== point.value;
  });
  const hasPositivePoint = visiblePoints.some((point) => point.value > 0);
  if (!hasPositivePoint) {
    const currentValue = getPortfolioCurrentValue();
    return currentValue > 0 ? createFirstDepositDisplayPoints(currentValue, periodStart, now) : [];
  }
  if (visiblePoints.length < 2) {
    const currentValue = getPortfolioCurrentValue();
    return currentValue > 0 ? createFirstDepositDisplayPoints(currentValue, periodStart, now) : visiblePoints;
  }
  return visiblePoints;
}

function getPortfolioStepLeadTime(eventTime, periodStart, now) {
  const range = Math.max(now - periodStart, 1);
  const visibleLead = clamp(range * 0.055, 4 * 60 * 1000, 45 * 60 * 1000);
  return Math.max(periodStart, eventTime - visibleLead);
}

function clamp(value, min, max) {
  return Math.min(Math.max(Number(value) || 0, min), max);
}

function createFirstDepositDisplayPoints(value, periodStart, now) {
  const endTime = Math.max(periodStart + 1, now);
  const startTime = periodStart + Math.max(endTime - periodStart, 1) * 0.12;
  const finishTime = periodStart + Math.max(endTime - periodStart, 1) * 0.88;
  return [
    { time: startTime, value: 0 },
    { time: finishTime, value: Math.max(0, Number(value) || 0) },
  ];
}

function getPortfolioLiquidityEvents(entries, now = Date.now()) {
  const grouped = new Map();
  const addDelta = (time, delta, reason) => {
    if (!Number.isFinite(time) || time > now || !Number.isFinite(delta) || delta === 0) return;
    const existing = grouped.get(time) || { time, delta: 0, reason };
    existing.delta += delta;
    grouped.set(time, existing);
  };

  entries.forEach((entry) => {
    const createdAt = getEntryCreatedAt(entry);
    const closedAt = getEntryClosedAt(entry);
    const entryValue = Number(entry.costValue) || (Number(entry.cost) || 0) * (Number(entry.amount) || 0);
    const exitValue = Number(entry.currentValue) || entryValue;

    addDelta(createdAt, entryValue, "liquidity-open");
    if (Number.isFinite(closedAt)) {
      addDelta(closedAt, -exitValue, "liquidity-exit");
    }
  });

  return [...grouped.values()].sort((a, b) => a.time - b.time);
}

function getCryptoComparePortfolioValueAt(entries, timestamp, now, periodStart) {
  return entries.reduce((sum, entry) => sum + getLiquidityValueAt(entry, timestamp, now, periodStart), 0);
}

function getPortfolioChartWindow() {
  const current = new Date();
  const offset = Number(state.portfolioChartWindowOffset) || 0;
  let start;
  let end;

  if (state.portfolioChartPeriod === "1w") {
    start = startOfWeek(current);
    start.setDate(start.getDate() + offset * 7);
    end = new Date(start);
    end.setDate(end.getDate() + 7);
  } else if (state.portfolioChartPeriod === "1m") {
    start = new Date(current.getFullYear(), current.getMonth() + offset, 1);
    end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
  } else if (state.portfolioChartPeriod === "1y") {
    start = new Date(current.getFullYear() + offset, 0, 1);
    end = new Date(start.getFullYear() + 1, 0, 1);
  } else {
    start = new Date(current.getFullYear(), current.getMonth(), current.getDate() + offset);
    end = new Date(start);
    end.setDate(end.getDate() + 1);
  }

  const isCurrent = offset === 0;
  return {
    start: start.getTime(),
    end: isCurrent ? Math.min(end.getTime(), Date.now()) : end.getTime(),
    isCurrent,
  };
}

function getPortfolioChartWindowLabel() {
  const range = getPortfolioChartWindow();
  const start = new Date(range.start);
  const end = new Date(range.end);
  const endInclusive = new Date(end.getTime() - 1);

  if (state.portfolioChartPeriod === "1d") {
    return `${start.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" })} · ${start.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}-${end.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`;
  }

  if (state.portfolioChartPeriod === "1w" || state.portfolioChartPeriod === "1m") {
    return `${start.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" })} - ${endInclusive.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" })}`;
  }

  return `${start.toLocaleDateString("ru-RU", { month: "short", year: "numeric" })} - ${endInclusive.toLocaleDateString("ru-RU", { month: "short", year: "numeric" })}`;
}

function startOfWeek(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = start.getDay() || 7;
  start.setDate(start.getDate() - day + 1);
  return start;
}

function getPortfolioEventHistory(entries, periodStart, now) {
  const deltas = [];
  entries.forEach((entry) => {
    const createdAt = getEntryCreatedAt(entry);
    const closedAt = getEntryClosedAt(entry);
    const entryValue = Number(entry.costValue) || (Number(entry.cost) || 0) * (Number(entry.amount) || 0);
    const exitValue = Number(entry.currentValue) || entryValue;

    if (Number.isFinite(createdAt) && createdAt <= now && entryValue > 0) {
      deltas.push({ time: createdAt, delta: entryValue, reason: "event-open" });
    }

    if (Number.isFinite(closedAt) && closedAt <= now && exitValue > 0) {
      deltas.push({ time: closedAt, delta: -exitValue, reason: "event-exit" });
    }
  });

  if (!deltas.length) return [];

  const grouped = new Map();
  deltas.forEach((event) => {
    const existing = grouped.get(event.time) || { time: event.time, delta: 0, reason: event.reason };
    existing.delta += event.delta;
    grouped.set(event.time, existing);
  });

  let runningValue = 0;
  let beforePeriod = null;
  const points = [];
  [...grouped.values()]
    .sort((a, b) => a.time - b.time)
    .forEach((event) => {
      runningValue = Math.max(0, runningValue + event.delta);
      const point = {
        at: new Date(event.time).toISOString(),
        time: event.time,
        value: runningValue,
        reason: event.reason,
      };
      if (event.time < periodStart) {
        beforePeriod = point;
      } else if (event.time <= now) {
        points.push(point);
      }
    });

  return [beforePeriod, ...points].filter(Boolean);
}

function getPortfolioValueHistoryInRange(periodStart, now) {
  const parsed = state.portfolioValueHistory
    .map((point) => ({ ...point, time: new Date(point.at).getTime(), value: Number(point.value) }))
    .filter((point) => Number.isFinite(point.time) && Number.isFinite(point.value))
    .sort((a, b) => a.time - b.time);
  const before = [...parsed].reverse().find((point) => point.time < periodStart);
  const within = parsed.filter((point) => point.time >= periodStart && point.time <= now);
  return [before, ...within].filter(Boolean);
}

function getPortfolioDisplayHistory(valueHistory, now = Date.now(), includeCurrent = true) {
  const history = valueHistory.filter((point) => Number.isFinite(point.time) && Number.isFinite(point.value));
  const last = history.at(-1);
  if (!last) return history;
  if (!includeCurrent) return history;

  const currentValue = getPortfolioCurrentValue();
  if (!getActivePortfolioPositions().length || !Number.isFinite(currentValue)) {
    return history;
  }

  const currentPoint = {
    at: new Date(now).toISOString(),
    time: now,
    value: currentValue,
    reason: "display-current",
  };

  if (now > last.time) {
    return [...history, currentPoint];
  }

  if (now === last.time) {
    return history.map((point, index) => (index === history.length - 1 ? currentPoint : point));
  }

  return history;
}

function getPortfolioValueFromHistory(points, timestamp) {
  if (!points.length) return Number.NaN;
  if (timestamp < points[0].time) return 0;
  if (timestamp === points[0].time) return points[0].value;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const next = points[index];
    if (timestamp <= next.time) {
      if (next.time === previous.time) return next.value;
      const mix = (timestamp - previous.time) / (next.time - previous.time);
      return previous.value * (1 - mix) + next.value * mix;
    }
  }

  return points.at(-1).value;
}

function getPortfolioChartTimestamps(entries, periodStart, now, targetLength, transitionMs) {
  const timestamps = new Set(
    Array.from({ length: targetLength }, (_, index) => {
      const progress = index / Math.max(targetLength - 1, 1);
      return Math.round(periodStart + (now - periodStart) * progress);
    }),
  );

  entries.forEach((entry) => {
    [getEntryCreatedAt(entry), getEntryClosedAt(entry)].forEach((eventTime) => {
      if (!Number.isFinite(eventTime)) return;
      [-1, -0.5, 0, 0.5, 1].forEach((step) => {
        const timestamp = Math.round(eventTime + transitionMs * step);
        if (timestamp >= periodStart && timestamp <= now) {
          timestamps.add(timestamp);
        }
      });
    });
  });

  getPortfolioValueHistoryInRange(periodStart, now).forEach((point) => {
    const time = Number(point.time) || new Date(point.at).getTime();
    if (Number.isFinite(time)) {
      timestamps.add(time);
    }
  });

  return [...timestamps].sort((a, b) => a - b);
}

function getLiquidityValueAt(entry, timestamp, now, periodStart) {
  const createdAt = getEntryCreatedAt(entry);
  const periodMs = Math.max(now - periodStart, 1);
  const transitionMs = getChartTransitionMs(periodMs);
  if (timestamp < createdAt) {
    return 0;
  }

  const closedAt = getEntryClosedAt(entry);
  if (Number.isFinite(closedAt) && timestamp >= closedAt) {
    return 0;
  }

  const costValue = Number(entry.costValue) || (Number(entry.cost) || 0) * (Number(entry.amount) || 0);
  const currentValue = Number(entry.currentValue) || (Number(entry.coin?.current_price) || Number(entry.cost) || 0) * (Number(entry.amount) || 0);
  const activeEnd = Number.isFinite(closedAt) ? Math.min(closedAt, now) : now;

  if (getSparklinePrices(entry.coin).length) {
    return getEntryValueAt(entry, timestamp, now, periodStart, activeEnd) * getChartLifecycleWeight(timestamp, createdAt, closedAt, transitionMs);
  }

  if (activeEnd <= createdAt) {
    return currentValue * getChartLifecycleWeight(timestamp, createdAt, closedAt, transitionMs);
  }

  const activeStart = Math.max(createdAt, periodStart);
  const progress = Math.max(0, Math.min(1, (timestamp - activeStart) / Math.max(activeEnd - activeStart, 1)));
  const easedProgress = progress * progress * (3 - 2 * progress);
  const value = costValue + (currentValue - costValue) * easedProgress;
  return value * getChartLifecycleWeight(timestamp, createdAt, closedAt, transitionMs);
}

function getEntryValueAt(entry, timestamp, now, periodStart, activeEnd = now) {
  const createdAt = getEntryCreatedAt(entry);
  const startAt = Math.max(createdAt, periodStart);
  const endAt = Math.max(activeEnd, startAt + 1);

  if (timestamp < startAt) {
    return 0;
  }

  const prices = getSparklinePrices(entry.coin);
  const fallbackPrice = Number(entry.coin?.current_price) || Number(entry.cost) || 0;
  const startValue = entry.cost > 0 ? entry.cost : fallbackPrice;
  const endPrice = Number(entry.currentValue) && Number(entry.amount)
    ? Number(entry.currentValue) / Number(entry.amount)
    : fallbackPrice;

  if (!prices.length || endAt <= startAt) {
    return endPrice * entry.amount;
  }

  const progress = Math.max(0, Math.min(1, (timestamp - startAt) / Math.max(endAt - startAt, 1)));
  const sourceIndex = progress * Math.max(prices.length - 1, 1);
  const left = Math.floor(sourceIndex);
  const right = Math.min(prices.length - 1, left + 1);
  const mix = sourceIndex - left;
  const marketPrice = (prices[left] || endPrice) * (1 - mix) + (prices[right] || endPrice) * mix;
  const price = startValue * (1 - progress) + marketPrice * progress;

  return price * entry.amount;
}

function getEntryCreatedAt(entry) {
  if (entry.createdAt) {
    const createdTime = new Date(entry.createdAt).getTime();
    if (Number.isFinite(createdTime)) {
      return createdTime;
    }
  }

  if (entry.date) {
    const dateTime = new Date(`${entry.date}T00:00:00`).getTime();
    if (Number.isFinite(dateTime)) {
      return dateTime;
    }
  }

  return Date.now();
}

function getEntryClosedAt(entry) {
  if (!entry.closedAt) {
    return Number.NaN;
  }

  const closedTime = new Date(entry.closedAt).getTime();
  return Number.isFinite(closedTime) ? closedTime : Number.NaN;
}

function getChartTransitionMs(periodMs) {
  return Math.min(Math.max(periodMs * 0.035, 8 * 60 * 1000), 18 * 60 * 60 * 1000);
}

function getChartLifecycleWeight(timestamp, createdAt, closedAt, transitionMs) {
  if (timestamp < createdAt) return 0;
  if (Number.isFinite(closedAt) && timestamp >= closedAt) return 0;
  return 1;
}

function smoothStep(value) {
  return value * value * (3 - 2 * value);
}

function stabilizePortfolioChartPoints(points) {
  if (points.length < 2) return points;

  let anchor = points[0];
  return points.map((value, index) => {
    if (index === 0 || index === points.length - 1) {
      anchor = value;
      return value;
    }

    const threshold = getPortfolioChartNoiseThreshold(anchor);
    const previous = points[index - 1];
    const next = points[index + 1] ?? value;
    const localMove = Math.max(Math.abs(value - previous), Math.abs(next - value));
    const eventThreshold = Math.max(Math.abs(anchor), Math.abs(value), 1) * 0.018;

    if (Math.abs(value - anchor) <= threshold && localMove <= eventThreshold) {
      return anchor;
    }

    anchor = value;
    return value;
  });
}

function smoothPortfolioChartPoints(points) {
  if (points.length < 5) return points;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(max - min, 1);

  const smoothed = points.map((value, index) => {
    if (index === 0 || index === points.length - 1) return value;

    const previous = points[index - 1];
    const next = points[index + 1] ?? value;
    const incomingMove = Math.abs(value - previous);
    const outgoingMove = Math.abs(next - value);
    const eventMove = Math.max(incomingMove, outgoingMove);
    const relativeMove = eventMove / Math.max(Math.abs(value), Math.abs(previous), Math.abs(next), 1);
    if (eventMove > range * 0.08 || relativeMove > 0.18) {
      return value;
    }

    const previous2 = points[Math.max(0, index - 2)];
    const next2 = points[Math.min(points.length - 1, index + 2)];
    return previous2 * 0.08 + previous * 0.22 + value * 0.4 + next * 0.22 + next2 * 0.08;
  });

  smoothed[0] = points[0];
  smoothed[smoothed.length - 1] = points[points.length - 1];
  return smoothed;
}

function getPortfolioChartChange(points) {
  const activePoints = points.filter((point) => point > 0);
  const first = activePoints[0] || 0;
  const latest = activePoints.at(-1) || 0;
  const value = latest - first;

  return {
    value,
    percent: first > 0 ? (value / first) * 100 : 0,
  };
}

function resamplePoints(points, targetLength) {
  if (!points.length || points.length === targetLength) return points;
  return Array.from({ length: targetLength }, (_, index) => {
    const sourceIndex = (index / Math.max(targetLength - 1, 1)) * Math.max(points.length - 1, 1);
    const left = Math.floor(sourceIndex);
    const right = Math.min(points.length - 1, left + 1);
    const mix = sourceIndex - left;
    return points[left] * (1 - mix) + points[right] * mix;
  });
}

function extendPortfolioSeries(points, targetLength, startFactor) {
  const sampled = resamplePoints(points, Math.min(points.length, 72));
  const first = sampled[0] || 1;
  const prefixLength = Math.max(targetLength - sampled.length, 0);
  const prefix = Array.from({ length: prefixLength }, (_, index) => {
    const progress = index / Math.max(prefixLength - 1, 1);
    const wave = Math.sin(progress * Math.PI * 4) * first * 0.018;
    return first * startFactor + (first - first * startFactor) * progress + wave;
  });
  return [...prefix, ...sampled].slice(-targetLength);
}

function getPortfolioChartBounds(points) {
  const minPoint = Math.min(...points);
  const maxPoint = Math.max(...points);
  if (maxPoint <= 0) {
    return { min: 0, max: 1 };
  }
  const baseRange = Math.max(maxPoint - minPoint, Math.abs(maxPoint) * 0.018, 1);
  const padding = baseRange * 0.18;
  return {
    min: Math.max(0, minPoint - padding),
    max: maxPoint + padding,
  };
}

function drawEmptyPortfolioChart(context, width, height) {
  context.fillStyle = "rgba(142, 167, 179, 0.14)";
  context.fillRect(28, 28, width - 56, height - 56);
  context.strokeStyle = "rgba(151, 184, 195, 0.18)";
  context.lineWidth = 1;
  context.strokeRect(28, 28, width - 56, height - 56);
  context.fillStyle = "#d6e6ec";
  context.font = "700 17px Inter, sans-serif";
  context.textAlign = "left";
  context.fillText("Добавьте активы, чтобы построить график портфеля", 42, height / 2 - 4);
  context.fillStyle = "#8ea7b3";
  context.font = "12px Inter, sans-serif";
  context.fillText("История стоимости появится после первой позиции и будет сохраняться в аккаунте.", 42, height / 2 + 22);
}

function drawChartTimeAxis(context, plot) {
  const timeRange = state.portfolioChartTimeRange;
  if (!timeRange || !Number.isFinite(timeRange.start) || !Number.isFinite(timeRange.end)) return;

  context.fillStyle = "#152536";
  context.font = "12px Inter, sans-serif";
  context.textAlign = "center";

  for (let index = 0; index <= 4; index += 1) {
    const progress = index / 4;
    const time = timeRange.start + (timeRange.end - timeRange.start) * progress;
    const x = plot.left + (plot.right - plot.left) * progress;
    const label = formatPortfolioChartTimeLabel(time);
    context.fillText(label, x, plot.bottom + 24);
  }
}

function formatPortfolioChartTimeLabel(time) {
  const date = new Date(time);
  if (state.portfolioChartPeriod === "1d") {
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  }
  if (state.portfolioChartPeriod === "1y") {
    return date.toLocaleDateString("ru-RU", { month: "short", year: "2-digit" });
  }
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
}

function drawPortfolioChartHeader(context, plot, points, chartChange) {
  const hasActivePositions = getPortfolioScopePositions(state.activePortfolioWallet).length > 0;
  const headerTotals = getPortfolioTotals(getPortfolioScopePositions(state.activePortfolioWallet));
  const latest = hasActivePositions ? headerTotals.value || 0 : 0;
  const headerChange = hasActivePositions ? headerTotals.pnl || 0 : 0;
  const headerChangePct = hasActivePositions ? headerTotals.pnlPercent || 0 : 0;
  const trendColor = headerChange >= 0 ? "#138a3d" : "#c31d1d";
  if (!hasActivePositions) {
    context.textAlign = "left";
    context.fillStyle = "#152536";
    context.font = "700 13px Inter, sans-serif";
    context.fillText(`Активный портфель: ${formatMoney(0)}`, plot.left, 20);
    context.fillStyle = "#68798a";
    context.font = "800 12px Inter, sans-serif";
    context.fillText("все позиции закрыты", plot.left + 190, 20);
    return;
  }
  context.textAlign = "left";
  context.fillStyle = "#152536";
  context.font = "700 13px Inter, sans-serif";
  context.fillText(`Стоимость: ${formatMoney(latest)}`, plot.left, 20);
  context.fillStyle = trendColor;
  context.font = "800 12px Inter, sans-serif";
  context.fillText(`${formatPortfolioDeltaMoney(headerChange)} · ${formatPercent(headerChangePct)}`, plot.left + 172, 20);
}

function drawChartBackground(context, width, height) {
  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(1, "#f8fbfd");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
}

function drawChartGrid(context, plot, min, max, scaleY) {
  context.strokeStyle = "rgba(32, 75, 100, 0.12)";
  context.lineWidth = 1;

  for (let i = 0; i <= 4; i += 1) {
    const y = plot.top + ((plot.bottom - plot.top) / 4) * i;
    context.beginPath();
    context.moveTo(plot.left, y);
    context.lineTo(plot.right, y);
    context.stroke();
  }

  context.strokeStyle = "rgba(8, 18, 26, 0.6)";
  context.beginPath();
  context.moveTo(plot.left, plot.bottom);
  context.lineTo(plot.right, plot.bottom);
  context.stroke();

  context.fillStyle = "#152536";
  context.font = "12px Inter, sans-serif";
  context.textAlign = "left";
  [max, (max + min) / 2, min].forEach((value) => {
    context.fillText(formatMoney(value), plot.left + 8, scaleY(value) + 4);
  });
}

function drawPortfolioLineChart(context, points, plot, scaleX, scaleY, trend) {
  const stroke = trend >= 0 ? "#12b981" : "#ef4444";
  const fill = context.createLinearGradient(0, plot.top, 0, plot.bottom);
  fill.addColorStop(0, trend >= 0 ? "rgba(18, 185, 129, 0.28)" : "rgba(239, 68, 68, 0.26)");
  fill.addColorStop(1, "rgba(10, 25, 35, 0.02)");
  const pathPoints = points.map((value, index) => ({
    x: scaleX(index, points.length),
    y: scaleY(value),
  }));

  context.beginPath();
  traceClassicChartPath(context, pathPoints);
  context.lineTo(pathPoints.at(-1).x, plot.bottom);
  context.lineTo(plot.left, plot.bottom);
  context.closePath();
  context.fillStyle = fill;
  context.fill();

  context.save();
  context.shadowColor = trend >= 0 ? "rgba(18, 185, 129, 0.35)" : "rgba(239, 68, 68, 0.32)";
  context.shadowBlur = 12;
  context.beginPath();
  traceClassicChartPath(context, pathPoints);
  context.strokeStyle = stroke;
  context.lineWidth = 2.6;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.stroke();
  context.restore();
}

function drawFirstPortfolioDepositGraph(context, points, plot, scaleY, stroke, fill) {
  const value = Math.max(0, Number(points[1]) || 0);
  const stepX = plot.left + (plot.right - plot.left) * 0.34;
  const endY = scaleY(value);
  const bottomY = plot.bottom;
  const rightX = plot.right;
  const leftX = plot.left;

  context.beginPath();
  context.moveTo(leftX, bottomY);
  context.lineTo(stepX, bottomY);
  context.lineTo(stepX, endY);
  context.lineTo(rightX, endY);
  context.lineTo(rightX, bottomY);
  context.closePath();
  context.fillStyle = fill;
  context.fill();

  context.save();
  context.shadowColor = "rgba(0, 109, 172, 0.18)";
  context.shadowBlur = 4;
  context.beginPath();
  context.moveTo(leftX, bottomY);
  context.lineTo(stepX, bottomY);
  context.lineTo(stepX, endY);
  context.lineTo(rightX, endY);
  context.strokeStyle = stroke;
  context.lineWidth = 2.6;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.stroke();
  context.restore();

  context.setLineDash([5, 5]);
  context.strokeStyle = "rgba(18, 185, 129, 0.38)";
  context.beginPath();
  context.moveTo(leftX, endY);
  context.lineTo(rightX, endY);
  context.stroke();
  context.setLineDash([]);

  drawPortfolioChartMarkers(
    context,
    [
      { x: stepX, y: bottomY },
      { x: stepX, y: endY },
      { x: rightX, y: endY },
    ],
    stroke,
  );
}

function isFirstPortfolioDepositSeries(points) {
  return points.length === 2 && points[0] <= 0 && points[1] > 0;
}

function tracePortfolioStepPath(context, pathPoints) {
  if (!pathPoints.length) return;
  context.moveTo(pathPoints[0].x, pathPoints[0].y);
  for (let index = 1; index < pathPoints.length; index += 1) {
    const previous = pathPoints[index - 1];
    const current = pathPoints[index];
    const midX = Math.max(previous.x, Math.min(current.x, current.x - 2));
    context.lineTo(midX, previous.y);
    context.lineTo(midX, current.y);
    context.lineTo(current.x, current.y);
  }
}

function tracePortfolioLifecyclePath(context, pathPoints) {
  if (!pathPoints.length) return;
  const reasons = state.portfolioChartPointReasons || [];
  context.moveTo(pathPoints[0].x, pathPoints[0].y);
  for (let index = 1; index < pathPoints.length; index += 1) {
    const previous = pathPoints[index - 1];
    const current = pathPoints[index];
    const reason = String(reasons[index] || "");
    if (/close|remove|exit/i.test(reason)) {
      context.lineTo(current.x, current.y);
      continue;
    }

    const midX = Math.max(previous.x, Math.min(current.x, current.x - 2));
    context.lineTo(midX, previous.y);
    context.lineTo(midX, current.y);
    context.lineTo(current.x, current.y);
  }
}

function drawSinglePortfolioEventPoint(context, point, value, color, plot) {
  if (!point) return;
  context.save();
  const segmentEnd = plot ? Math.min(plot.right, Math.max(point.x + 80, plot.right - 18)) : point.x + 96;
  if (plot) {
    context.beginPath();
    context.moveTo(point.x, plot.bottom);
    context.lineTo(point.x, point.y);
    context.strokeStyle = "rgba(0, 109, 172, 0.55)";
    context.lineWidth = 2.2;
    context.setLineDash([6, 5]);
    context.stroke();
    context.setLineDash([]);
  }
  context.beginPath();
  context.moveTo(point.x, point.y);
  context.lineTo(segmentEnd, point.y);
  context.strokeStyle = color;
  context.lineWidth = 2.4;
  context.lineCap = "round";
  context.stroke();
  context.strokeStyle = color;
  context.fillStyle = "rgba(0, 109, 172, 0.12)";
  context.lineWidth = 2;
  context.beginPath();
  context.arc(point.x, point.y, 9.5, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  context.beginPath();
  context.arc(point.x, point.y, 4.4, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
  context.fillStyle = "#152536";
  context.font = "700 12px Inter, sans-serif";
  context.textAlign = "center";
  context.fillText(formatMoney(value), point.x, point.y - 14);
  context.restore();
}

function drawPortfolioChartMarkers(context, points, color) {
  if (!points.length) return;
  const markers = points.length <= 8 ? points : [points[0], points.at(-1)];
  markers.forEach((point) => {
    context.beginPath();
    context.arc(point.x, point.y, 4.2, 0, Math.PI * 2);
    context.fillStyle = "#f8ffff";
    context.fill();
    context.lineWidth = 2.4;
    context.strokeStyle = color;
    context.stroke();
  });
}

function traceSafeSmoothChartPath(context, pathPoints) {
  if (!pathPoints.length) return;
  if (pathPoints.length < 3) {
    traceClassicChartPath(context, pathPoints);
    return;
  }

  context.moveTo(pathPoints[0].x, pathPoints[0].y);
  for (let index = 0; index < pathPoints.length - 1; index += 1) {
    const current = pathPoints[index];
    const next = pathPoints[index + 1];
    const previous = pathPoints[index - 1] || current;
    const afterNext = pathPoints[index + 2] || next;
    const distance = Math.max(next.x - current.x, 1);
    const cp1x = current.x + distance * 0.32;
    const cp2x = next.x - distance * 0.32;
    const slopeIn = clampChartSlope((next.y - previous.y) / Math.max(next.x - previous.x, 1));
    const slopeOut = clampChartSlope((afterNext.y - current.y) / Math.max(afterNext.x - current.x, 1));
    const cp1y = current.y + slopeIn * (cp1x - current.x);
    const cp2y = next.y - slopeOut * (next.x - cp2x);
    const minY = Math.min(current.y, next.y);
    const maxY = Math.max(current.y, next.y);
    context.bezierCurveTo(cp1x, clamp(cp1y, minY, maxY), cp2x, clamp(cp2y, minY, maxY), next.x, next.y);
  }
}

function clampChartSlope(value) {
  if (!Number.isFinite(value)) return 0;
  return clamp(value, -3, 3);
}

function normalizeChartPathPoints(pathPoints) {
  const normalized = [];
  pathPoints.forEach((point) => {
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return;
    const previous = normalized.at(-1);
    if (previous && Math.abs(previous.x - point.x) < 0.5) {
      previous.y = point.y;
      return;
    }
    normalized.push(point);
  });
  return normalized.length ? normalized : [{ x: 0, y: 0 }];
}

function traceClassicChartPath(context, pathPoints) {
  if (!pathPoints.length) return;
  context.moveTo(pathPoints[0].x, pathPoints[0].y);
  for (let index = 1; index < pathPoints.length; index += 1) {
    context.lineTo(pathPoints[index].x, pathPoints[index].y);
  }
}

function traceSmoothChartPath(context, pathPoints) {
  if (!pathPoints.length) return;
  context.moveTo(pathPoints[0].x, pathPoints[0].y);

  for (let index = 0; index < pathPoints.length - 1; index += 1) {
    const current = pathPoints[index];
    const next = pathPoints[index + 1];
    const previous = pathPoints[index - 1] || current;
    const afterNext = pathPoints[index + 2] || next;
    const tension = 0.18;
    const cp1x = current.x + (next.x - previous.x) * tension;
    const cp1y = current.y + (next.y - previous.y) * tension;
    const cp2x = next.x - (afterNext.x - current.x) * tension;
    const cp2y = next.y - (afterNext.y - current.y) * tension;
    context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y);
  }
}

function drawPortfolioBarChart(context, points, plot, scaleX, scaleY) {
  const zero = points[0];
  const zeroY = scaleY(zero);
  const barWidth = Math.max(2, (plot.right - plot.left) / points.length - 2);

  points.forEach((value, index) => {
    const previous = points[index - 1] ?? value;
    const x = scaleX(index, points.length) - barWidth / 2;
    const y = scaleY(value);
    context.fillStyle = value >= previous ? "#12b981" : "#ef4444";
    context.fillRect(x, Math.min(y, zeroY), barWidth, Math.max(2, Math.abs(zeroY - y)));
  });
}

function drawPortfolioCandles(context, points, plot, scaleX, scaleY) {
  if (isFirstPortfolioDepositSeries(points)) {
    drawFirstPortfolioDepositCandle(context, points, plot, scaleY);
    return;
  }

  const candleCount = Math.max(1, points.length - 1);
  const candleWidth = Math.max(7, Math.min(28, (plot.right - plot.left) / Math.max(candleCount, 1) * 0.42));

  for (let index = 0; index < candleCount; index += 1) {
    const open = points[index];
    const close = points[index + 1] ?? open;
    const spread = Math.max(Math.abs(close - open), Math.abs(open) * 0.003);
    const high = Math.max(open, close) + spread * 0.65;
    const low = Math.min(open, close) - spread * 0.65;
    const x1 = scaleX(index, points.length);
    const x2 = scaleX(index + 1, points.length);
    const x = (x1 + x2) / 2;
    const openY = scaleY(open);
    const closeY = scaleY(close);
    const highY = scaleY(high);
    const lowY = scaleY(low);
    const gain = close >= open;

    context.strokeStyle = gain ? "#12b981" : "#ef4444";
    context.fillStyle = gain ? "rgba(18, 185, 129, 0.82)" : "rgba(239, 68, 68, 0.82)";
    context.lineWidth = 1.4;
    context.beginPath();
    context.moveTo(x, highY);
    context.lineTo(x, lowY);
    context.stroke();
    context.fillRect(x - candleWidth / 2, Math.min(openY, closeY), candleWidth, Math.max(3, Math.abs(openY - closeY)));
  }
}

function drawFirstPortfolioDepositCandle(context, points, plot, scaleY) {
  const open = points[0];
  const close = points[1];
  const spread = Math.max(Math.abs(close - open), close * 0.02, 1);
  const highY = scaleY(close + spread * 0.18);
  const lowY = scaleY(Math.max(0, open - spread * 0.08));
  const openY = scaleY(open);
  const closeY = scaleY(close);
  const x = plot.left + (plot.right - plot.left) * 0.52;
  const candleWidth = Math.min(72, Math.max(34, (plot.right - plot.left) * 0.08));

  context.save();
  context.strokeStyle = "#12b981";
  context.fillStyle = "rgba(18, 185, 129, 0.86)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(x, highY);
  context.lineTo(x, lowY);
  context.stroke();
  context.fillRect(x - candleWidth / 2, Math.min(openY, closeY), candleWidth, Math.max(10, Math.abs(openY - closeY)));
  context.restore();
}

function drawChartPriceLabels(context, points, plot, scaleY, trend) {
  const latest = points.at(-1);
  const latestY = scaleY(latest);
  const color = trend >= 0 ? "#12b981" : "#ef4444";

  context.strokeStyle = `${color}99`;
  context.setLineDash([5, 5]);
  context.beginPath();
  context.moveTo(plot.left, latestY);
  context.lineTo(plot.right, latestY);
  context.stroke();
  context.setLineDash([]);

  context.fillStyle = color;
  context.fillRect(plot.right + 8, latestY - 11, 72, 22);
  context.fillStyle = "#ffffff";
  context.font = "12px Inter, sans-serif";
  context.textAlign = "center";
  context.fillText(formatMoney(latest), plot.right + 44, latestY + 4);
}

function drawPortfolioChartHover(context, points, plot, scaleX, scaleY) {
  const index = state.portfolioChartHoverIndex;
  if (index === null || index === undefined || !Number.isFinite(points[index])) return;

  const x = scaleX(index, points.length);
  const y = scaleY(points[index]);
  const time = state.portfolioChartPointTimes[index];
  const label = `${formatPortfolioChartHoverLabel(time)} · ${formatMoney(points[index])}`;
  const boxWidth = Math.min(Math.max(context.measureText(label).width + 22, 156), 260);
  const boxX = Math.min(Math.max(x - boxWidth / 2, plot.left), plot.right - boxWidth);
  const boxY = y < plot.top + 44 ? y + 16 : y - 42;

  context.save();
  context.strokeStyle = "rgba(214, 230, 236, 0.48)";
  context.setLineDash([4, 5]);
  context.beginPath();
  context.moveTo(x, plot.top);
  context.lineTo(x, plot.bottom);
  context.stroke();
  context.setLineDash([]);

  context.fillStyle = "rgba(8, 18, 26, 0.92)";
  context.strokeStyle = "rgba(40, 220, 200, 0.42)";
  context.lineWidth = 1;
  context.fillRect(boxX, boxY, boxWidth, 28);
  context.strokeRect(boxX, boxY, boxWidth, 28);
  context.fillStyle = "#d6e6ec";
  context.font = "800 12px Inter, sans-serif";
  context.textAlign = "center";
  context.fillText(label, boxX + boxWidth / 2, boxY + 18);

  context.beginPath();
  context.arc(x, y, 4, 0, Math.PI * 2);
  context.fillStyle = "#28dcc8";
  context.fill();
  context.strokeStyle = "#ffffff";
  context.stroke();
  context.restore();
}

function formatPortfolioChartHoverLabel(time) {
  const date = new Date(time);
  if (state.portfolioChartPeriod === "1d") {
    return date.toLocaleString("ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  }
  if (state.portfolioChartPeriod === "1y") {
    return date.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
  }
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" });
}

function renderWatchlist() {
  if (!elements.watchlistList) {
    if (elements.watchlistMetric) {
      elements.watchlistMetric.textContent = state.watchlist.length;
    }
    renderWatchlistPage();
    return;
  }

  if (elements.watchlistMetric) {
    elements.watchlistMetric.textContent = state.watchlist.length;
  }

  if (!state.watchlist.length) {
    elements.watchlistList.innerHTML = `<div class="empty-state">Отмечай монеты звездой в таблице рынка.</div>`;
    renderWatchlistPage();
    return;
  }

  elements.watchlistList.innerHTML = state.watchlist
    .map((coinId) => findCoin(coinId))
    .filter(Boolean)
    .map(
      (coin) => `
        <article class="asset-card">
          <div class="asset-card-header">
            <a class="watchlist-coin-link" href="${getTradingViewUrl(coin)}" target="_blank" rel="noopener noreferrer" title="Открыть ${coin.symbol.toUpperCase()} в TradingView">
              <img src="${coin.image}" alt="${coin.name}" />
              <strong>${coin.name}</strong>
            </a>
            <button class="remove-button" type="button" data-watch="${coin.id}" title="Убрать">×</button>
          </div>
          <div class="asset-card-row">
            <small>${coin.symbol.toUpperCase()} · rank #${coin.market_cap_rank || "-"}</small>
            <strong>${formatMoney(coin.current_price)}</strong>
          </div>
          <div class="asset-card-row">
            <small>1h / 24h / 30d</small>
            <strong>${formatPercent(coin.price_change_percentage_1h_in_currency)} · ${formatPercent(
              coin.price_change_percentage_24h,
            )} · ${formatPercent(coin.price_change_percentage_30d_in_currency)}</strong>
          </div>
        </article>
      `,
    )
    .join("");

  elements.watchlistList.querySelectorAll("[data-watch]").forEach((button) => {
    button.addEventListener("click", () => toggleWatchlist(button.dataset.watch));
  });

  renderWatchlistPage();
}

function renderWatchlistPage() {
  if (!elements.watchlistPageList) return;

  const coins = state.watchlist.map((coinId) => findCoin(coinId)).filter(Boolean);
  if (elements.watchlistPageSummary) {
    elements.watchlistPageSummary.textContent = `${coins.length} активов`;
  }

  if (!coins.length) {
    elements.watchlistPageList.innerHTML = `<div class="empty-state">Отмечай монеты звездой в таблице рынка, и они появятся здесь.</div>`;
    return;
  }

  elements.watchlistPageList.innerHTML = coins
    .map(
      (coin) => `
        <article class="watchlist-page-card">
          <div class="watchlist-card-main">
            <img src="${coin.image}" alt="${coin.name}" />
            <div>
              <strong>${coin.name}</strong>
              <span>${coin.symbol.toUpperCase()} · rank #${coin.market_cap_rank || "-"}</span>
            </div>
          </div>
          <div class="watchlist-card-metrics">
            <div><span>Цена</span><strong>${formatMoney(coin.current_price)}</strong></div>
            <div><span>24ч</span><strong class="${changeClass(coin.price_change_percentage_24h)}">${formatPercent(coin.price_change_percentage_24h)}</strong></div>
            <div><span>Объём</span><strong>${formatCompact(coin.total_volume)}</strong></div>
          </div>
          <canvas class="watchlist-page-sparkline" width="280" height="76" data-watch-spark="${coin.id}"></canvas>
          <label class="watchlist-note-field">
            <span>Заметка</span>
            <textarea data-watch-note="${coin.id}" rows="2" placeholder="Уровень, идея, план...">${escapeHtml(state.watchlistNotes[coin.id] || "")}</textarea>
          </label>
          <div class="watchlist-card-actions">
            <a class="tv-inline-link" href="${getTradingViewUrl(coin)}" target="_blank" rel="noopener noreferrer">TV</a>
            <button class="remove-button" type="button" data-watch-page="${coin.id}" title="Убрать">×</button>
          </div>
        </article>
      `,
    )
    .join("");

  elements.watchlistPageList.querySelectorAll("[data-watch-spark]").forEach((canvas) => {
    const coin = findCoin(canvas.dataset.watchSpark);
    drawSparkline(canvas, getSparklinePrices(coin), coin?.price_change_percentage_7d_in_currency);
  });
  elements.watchlistPageList.querySelectorAll("[data-watch-page]").forEach((button) => {
    button.addEventListener("click", () => toggleWatchlist(button.dataset.watchPage));
  });
  elements.watchlistPageList.querySelectorAll("[data-watch-note]").forEach((input) => {
    input.addEventListener("input", () => {
      state.watchlistNotes[input.dataset.watchNote] = input.value;
      persistWatchlistNotes();
    });
  });
}

function renderClosedPositions() {
  if (elements.closedPositionsMetric) {
    elements.closedPositionsMetric.textContent = String(state.closedPositions.length);
  }

  if (!elements.closedPositionsTable) return;

  const totals = getClosedPositionsTotals();
  const summary = `${state.closedPositions.length} закрытых · зафиксировано ${formatPortfolioDeltaMoney(totals.pnl)}`;
  if (elements.closedPositionsSummary) {
    elements.closedPositionsSummary.textContent = `За всё время: ${summary}`;
    elements.closedPositionsSummary.className = changeClass(totals.pnl);
  }

  if (!state.closedPositions.length) {
    if (elements.closedPositionsOverview) {
      elements.closedPositionsOverview.innerHTML = "";
    }
    elements.closedPositionsTable.innerHTML = `<tr><td colspan="7" class="empty-state">Закрытых позиций пока нет.</td></tr>`;
    return;
  }

  const monthlyGroups = getClosedPositionsMonthlyGroups();
  renderClosedPositionsOverview(monthlyGroups, totals);
  elements.closedPositionsTable.innerHTML = monthlyGroups
    .map((group) => closedPositionsMonthGroupRows(group))
    .join("");
}

function renderClosedPositionsOverview(monthlyGroups, totals) {
  if (!elements.closedPositionsOverview) return;

  const currentGroup = monthlyGroups[0];
  const currentPct = currentGroup?.totals.entryValue > 0 ? (currentGroup.totals.pnl / currentGroup.totals.entryValue) * 100 : 0;
  const totalPct = totals.entryValue > 0 ? (totals.pnl / totals.entryValue) * 100 : 0;

  elements.closedPositionsOverview.innerHTML = `
    <article>
      <span>${currentGroup ? capitalizeFirstLetter(currentGroup.label) : "Текущий месяц"}</span>
      <strong class="${changeClass(currentGroup?.totals.pnl || 0)}">${formatPortfolioDeltaMoney(currentGroup?.totals.pnl || 0)}</strong>
      <small>${currentGroup?.positions.length || 0} закрытых · ${formatMoney(currentGroup?.totals.closeValue || 0)} · ${formatPercent(currentPct)}</small>
    </article>
    <article>
      <span>За всё время</span>
      <strong class="${changeClass(totals.pnl)}">${formatPortfolioDeltaMoney(totals.pnl)}</strong>
      <small>${state.closedPositions.length} закрытых · ${formatMoney(totals.closeValue)} · ${formatPercent(totalPct)}</small>
    </article>
  `;
}

function getClosedPositionsMonthlyGroups() {
  const groups = new Map();

  state.closedPositions.forEach((position) => {
    const closedDate = new Date(position.closedAt || position.createdAt || Date.now());
    const key = `${closedDate.getFullYear()}-${String(closedDate.getMonth() + 1).padStart(2, "0")}`;
    const label = closedDate.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        label,
        positions: [],
        totals: {
          closeValue: 0,
          entryValue: 0,
          pnl: 0,
        },
      });
    }

    const group = groups.get(key);
    group.positions.push(position);
    group.totals.closeValue += Number(position.closeValue) || 0;
    group.totals.entryValue += Number(position.entryValue) || 0;
    group.totals.pnl += Number(position.pnl) || 0;
  });

  return Array.from(groups.values()).sort((a, b) => b.key.localeCompare(a.key));
}

function closedPositionsMonthGroupRows(group) {
  const pnlPercent = group.totals.entryValue > 0 ? (group.totals.pnl / group.totals.entryValue) * 100 : 0;
  const resultClass = changeClass(group.totals.pnl);
  const rows = group.positions.map((position, index) => closedPositionRow(position, index)).join("");

  return `
    <tr class="closed-month-row">
      <td colspan="7">
        <div class="closed-month-summary">
          <div>
            <strong>${capitalizeFirstLetter(group.label)}</strong>
            <span>${group.positions.length} закрытых позиций</span>
          </div>
          <div>
            <span>Зафиксировано</span>
            <strong>${formatMoney(group.totals.closeValue)}</strong>
          </div>
          <div>
            <span>P/L месяца</span>
            <strong class="${resultClass}">${formatPortfolioDeltaMoney(group.totals.pnl)}</strong>
          </div>
          <div>
            <span>Результат</span>
            <strong class="${resultClass}">${formatPercent(pnlPercent)}</strong>
          </div>
        </div>
      </td>
    </tr>
    ${rows}
  `;
}

function closedPositionRow(position, index) {
  const symbol = position.symbol || "";
  const resultClass = changeClass(position.pnl);
  return `
    <tr>
      <td>${index + 1}</td>
      <td class="portfolio-coin-cell">
        <div class="portfolio-coin-content">
          ${position.image ? `<img src="${position.image}" alt="${position.coinName}" />` : ""}
          <div class="portfolio-coin-copy">
            <strong>${position.coinName}</strong>
            <span>${formatAmount(position.amount)} ${symbol}</span>
            ${position.note ? `<small>${escapeHtml(position.note)}</small>` : ""}
          </div>
        </div>
      </td>
      <td>
        <strong>${formatMoney(position.entryPrice)}</strong>
        <small>${formatDate(position.openedAt)}</small>
      </td>
      <td>
        <strong>${formatMoney(position.closePrice)}</strong>
        <small>${formatDate(position.closedAt)}</small>
      </td>
      <td><strong>${formatMoney(position.closeValue)}</strong></td>
      <td><strong class="${resultClass}">${formatPortfolioDeltaMoney(position.pnl)}</strong></td>
      <td><strong class="${resultClass}">${formatPercent(position.pnlPercent)}</strong></td>
    </tr>
  `;
}

function renderMetrics() {
  const marketCap = state.coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
  const volume = state.coins.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);
  const portfolio = getPortfolioTotals();
  const btcDominance = state.global?.market_cap_percentage?.btc;

  elements.marketCapMetric.textContent = formatCompact(marketCap);
  elements.volumeMetric.textContent = formatCompact(volume);
  elements.marketCapHint.textContent = `по top-${state.coins.length || state.marketLimit}`;
  elements.portfolioValueMetric.textContent = formatMoney(portfolio.value);
  elements.portfolioPnlMetric.textContent = `P/L: ${formatMoney(portfolio.pnl)} (${formatPercent(portfolio.pnlPercent)})`;
  elements.portfolioPnlMetric.className = changeClass(portfolio.pnl);
  elements.btcDominanceMetric.textContent = btcDominance ? `${btcDominance.toFixed(1)}%` : "...";
  if (elements.closedPositionsMetric) {
    elements.closedPositionsMetric.textContent = String(state.closedPositions.length);
  }
  elements.activeMarketsMetric.textContent = state.global
    ? `${formatNumber(state.global.markets)} рынков · ${formatNumber(state.global.active_cryptocurrencies)} активов`
    : "глобальный рынок";
}

function renderLiveStrip() {
  const bitcoin = findCoin("bitcoin");
  const globalChange = Number(state.global?.market_cap_change_percentage_24h_usd);

  setAnimatedText(elements.btcLivePrice, `BTC ${bitcoin ? formatMoney(bitcoin.current_price) : "..."}`);
  setAnimatedText(
    elements.marketLiveChange,
    `Market 24h ${Number.isFinite(globalChange) ? formatPercent(globalChange) : "..."}`,
    globalChange,
  );
  setAnimatedText(
    elements.altseasonLive,
    state.altseason ? `${state.altseason.label} ${state.altseason.score}/100` : "Altseason proxy ...",
    state.altseason?.score,
  );
  renderRefreshCountdown();
}

function renderFearGreed() {
  if (!state.fearGreed) {
    elements.fearGreedMetric.textContent = "...";
  elements.fearGreedHint.textContent = "индекс недоступен";
    elements.fearGreedValue.textContent = "...";
    elements.fearGreedClassification.textContent = "нет данных";
    elements.fearGreedBadge.textContent = "offline";
    elements.fearGreedNeedle.style.transform = "translateX(-50%) rotate(-90deg)";
    return;
  }

  const value = Number(state.fearGreed.value) || 0;
  const classification = state.fearGreed.value_classification || classifyFearGreed(value);
  const angle = -90 + value * 1.8;
  const date = state.fearGreed.timestamp
    ? new Date(Number(state.fearGreed.timestamp) * 1000).toLocaleDateString("ru-RU")
    : "сегодня";

  elements.fearGreedMetric.textContent = value;
  elements.fearGreedHint.textContent = classification;
  elements.fearGreedValue.textContent = value;
  elements.fearGreedClassification.textContent = classification;
  elements.fearGreedBadge.textContent = classifyFearGreed(value);
  elements.fearGreedUpdated.textContent = `Daily index · Alternative.me · обновлено ${date}`;
  elements.fearGreedNeedle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
}

function renderAltseason() {
  if (!state.altseason) {
    elements.altseasonBadge.textContent = "offline";
    elements.altseasonValue.textContent = "...";
    elements.altseasonLabel.textContent = "нет данных";
    elements.altseasonHint.textContent = "Недостаточно данных для расчета";
    elements.altseasonFill.style.width = "0%";
    elements.altseasonNeedle.style.left = "0%";
    return;
  }

  const { score, label, outperformers, sampleSize, btcChange } = state.altseason;
  elements.altseasonBadge.textContent = label;
  elements.altseasonValue.textContent = score;
  elements.altseasonLabel.textContent = label;
  elements.altseasonHint.textContent = `${outperformers}/${sampleSize} топ-альтов обгоняют BTC за 30д · BTC ${formatPercent(btcChange)}`;
  elements.altseasonFill.style.width = `${score}%`;
  elements.altseasonNeedle.style.left = `${score}%`;
}

function renderMovers() {
  const by24h = [...state.coins]
    .filter((coin) => Number(coin.market_cap_rank || 0) <= state.moverLimit)
    .filter((coin) => Number(coin.price_change_percentage_24h) > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);

  elements.moverLimitButtons.forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.moverLimit) === state.moverLimit);
  });

  const rows = by24h.slice(0, MOVERS_VISIBLE_COUNT);

  if (!rows.length) {
    elements.moversList.innerHTML = `<div class="empty-state">Нет положительных движений в выбранном топе рынка.</div>`;
    return;
  }

  elements.moversList.innerHTML = rows
    .map(
      (coin, index) => `
        <a class="mover-row" href="${getTradingViewUrl(coin)}" target="_blank" rel="noopener noreferrer" title="Открыть ${coin.symbol.toUpperCase()} в TradingView">
          <span class="mover-rank">${index + 1}</span>
          <img src="${coin.image}" alt="${coin.name}" />
          <div class="mover-title">
            <strong>${coin.name}</strong>
            <span>${coin.symbol.toUpperCase()} · rank #${coin.market_cap_rank || "-"} · ${formatMoney(coin.current_price)}</span>
          </div>
          <canvas class="mover-sparkline" width="94" height="32" data-mover-id="${coin.id}"></canvas>
          <strong class="${changeClass(coin.price_change_percentage_24h)}">${formatPercent(coin.price_change_percentage_24h)}</strong>
        </a>
      `,
    )
    .join("");

  elements.moversList.querySelectorAll(".mover-sparkline").forEach((canvas) => {
    const coin = findCoin(canvas.dataset.moverId);
    drawSparkline(canvas, getMoverSparklinePrices(coin), coin?.price_change_percentage_7d_in_currency);
  });
}

function getMoverSparklinePrices(coin) {
  const prices = getSparklinePrices(coin);

  if (prices.length) {
    return prices;
  }

  return buildFallbackSparkline(coin?.current_price, coin?.price_change_percentage_7d_in_currency, coin?.id);
}

function handleMoversWheel(event) {
  if (!elements.moversList || elements.moversList.scrollHeight <= elements.moversList.clientHeight) {
    return;
  }

  event.preventDefault();
  const firstRow = elements.moversList.querySelector(".mover-row");
  const rowHeight = firstRow ? firstRow.getBoundingClientRect().height : 29;
  const styles = window.getComputedStyle(elements.moversList);
  const gap = Number.parseFloat(styles.rowGap || styles.gap) || 0;
  const step = (rowHeight + gap) * 5;
  elements.moversList.scrollBy({
    top: event.deltaY > 0 ? step : -step,
    behavior: "smooth",
  });
}

function renderInvestorSignals() {
  if (!elements.investorSignalList) {
    return;
  }

  const selectedIds = new Set([
    ...state.portfolio.map((position) => position.coinId),
    ...state.watchlist,
  ]);
  const selectedCoins = state.coins.filter((coin) => selectedIds.has(coin.id) && INVESTOR_SIGNALS[coin.id]);
  const sourceCoins = selectedCoins.length
    ? selectedCoins
    : state.coins.filter((coin) => INVESTOR_SIGNALS[coin.id]).slice(0, 4);

  if (!sourceCoins.length) {
    elements.investorSignalBadge.textContent = "нет данных";
    elements.investorScoreValue.textContent = "...";
    elements.investorScoreHint.textContent = "Добавь венчурный актив в избранное или портфель";
    elements.investorSignalList.innerHTML = `<div class="empty-state">Для точного ROI нужен DropsTab API. Сейчас блок готов к подключению внешнего источника.</div>`;
    return;
  }

  const enriched = sourceCoins
    .map((coin) => ({ coin, signal: INVESTOR_SIGNALS[coin.id], score: getInvestorScore(INVESTOR_SIGNALS[coin.id]) }))
    .sort((a, b) => b.score - a.score);
  const averageScore = Math.round(enriched.reduce((sum, item) => sum + item.score, 0) / enriched.length);

  elements.investorSignalBadge.textContent = selectedCoins.length ? "portfolio" : "market scan";
  elements.investorScoreValue.textContent = averageScore;
  elements.investorScoreHint.textContent = selectedCoins.length
    ? "сигнал по твоим активам"
    : "лучшие VC-сигналы из топа рынка";
  elements.investorSignalList.innerHTML = enriched
    .map(({ coin, signal, score }) => {
      return `
        <article class="investor-card">
          <div>
            <strong>${coin.name}</strong>
            <span>${signal.funds.slice(0, 3).join(" · ")}</span>
          </div>
          <div class="investor-score-pill">${score}/100</div>
          <div class="mini-metrics">
            <small>ROI ${signal.roi}</small>
            <small>Portfolio ${signal.portfolio}</small>
            <small>Liquidity ${signal.liquidity}</small>
          </div>
        </article>
      `;
    })
    .join("");
}

async function loadCryptoNews() {
  if (!state.news.length) {
    state.news = getFallbackNews();
    state.byaNews = getFallbackByacademyNews();
    renderNews();
  }

  await Promise.all([loadInvestingNews(), loadByacademyNews()]);

  renderNews();
}

async function loadInvestingNews() {
  try {
    const rssText = await fetchRssText(INVESTING_CRYPTO_RSS_URL);
    state.news = curateNewsItems(parseInvestingNews(rssText));
  } catch (error) {
    console.warn(error);
    try {
      state.news = curateNewsItems(await fetchRssJson(INVESTING_CRYPTO_RSS_URL));
    } catch (jsonError) {
      console.warn(jsonError);
      state.news = getFallbackNews();
    }
  }
}

async function loadByacademyNews() {
  try {
    const response = await fetchWithTimeout("/api/bya-news", {}, 5000);
    if (!response.ok) {
      throw new Error(`BYAcademy news unavailable: ${response.status}`);
    }

    const payload = await response.json();
    const items = Array.isArray(payload.items) ? payload.items : [];
    state.byaNews = curateNewsItems(items, NEWS_VISIBLE_COUNT);
    if (!state.byaNews.length) {
      state.byaNews = getFallbackByacademyNews();
    }
  } catch (error) {
    console.warn(error);
    state.byaNews = getFallbackByacademyNews();
  }
}

async function fetchRssText(url) {
  try {
    const localProxyResponse = await fetchWithTimeout("/api/investing-news", {}, 4000);
    if (localProxyResponse.ok) {
      return localProxyResponse.text();
    }
  } catch {
    // The static Python server has no API route. Node server.mjs provides this endpoint.
  }

  try {
    const directResponse = await fetchWithTimeout(url, {}, 4000);
    if (directResponse.ok) {
      return directResponse.text();
    }
  } catch {
    // Browser CORS often blocks direct RSS reads; fallback proxy keeps the widget usable.
  }

  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  const proxyResponse = await fetchWithTimeout(proxyUrl, {}, 5000);
  if (!proxyResponse.ok) {
    throw new Error(`Investing RSS unavailable: ${proxyResponse.status}`);
  }
  return proxyResponse.text();
}

async function fetchRssJson(url) {
  const response = await fetchWithTimeout(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`,
    {},
    5000,
  );
  if (!response.ok) {
    throw new Error(`RSS JSON unavailable: ${response.status}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload.items)) {
    throw new Error("RSS JSON response has no items");
  }

  return payload.items.map((item) => ({
    title: item.title || "Новость Investing.com",
    link: item.link || "https://ru.investing.com/news/cryptocurrency-news",
    description: stripHtml(item.description || ""),
    time: item.pubDate
      ? new Date(item.pubDate).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
      : "сейчас",
  }));
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
}

function parseInvestingNews(rssText) {
  const doc = new DOMParser().parseFromString(rssText, "application/xml");
  const items = [...doc.querySelectorAll("item")];

  return items.map((item) => {
    const title = item.querySelector("title")?.textContent?.trim() || "Новость Investing.com";
    const link = item.querySelector("link")?.textContent?.trim() || "https://ru.investing.com/news/cryptocurrency-news";
    const pubDate = item.querySelector("pubDate")?.textContent;
    const description = stripHtml(item.querySelector("description")?.textContent || "");

    return {
      title,
      link,
      description,
      time: pubDate ? new Date(pubDate).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) : "сейчас",
    };
  });
}

function curateNewsItems(items, limit = NEWS_VISIBLE_COUNT) {
  const seenLinks = new Set();
  const seenTitles = new Set();
  const topicCounts = new Map();
  const curated = [];

  items.forEach((item) => {
    if (!item?.title || curated.length >= limit) {
      return;
    }

    const linkKey = normalizeNewsLink(item.link);
    const titleKey = normalizeNewsTitle(item.title);
    const topicKey = getNewsTopicKey(item.title);
    const topicLimit = topicKey.endsWith("-price-action") ? 1 : 2;

    if (seenLinks.has(linkKey) || seenTitles.has(titleKey)) {
      return;
    }

    if ((topicCounts.get(topicKey) || 0) >= topicLimit) {
      return;
    }

    seenLinks.add(linkKey);
    seenTitles.add(titleKey);
    topicCounts.set(topicKey, (topicCounts.get(topicKey) || 0) + 1);
    curated.push(item);
  });

  return curated;
}

function normalizeNewsLink(link = "") {
  try {
    const url = new URL(link, "https://ru.investing.com");
    url.hash = "";
    [...url.searchParams.keys()].forEach((key) => {
      if (key.startsWith("utm_") || key === "ref" || key === "source") {
        url.searchParams.delete(key);
      }
    });
    return `${url.origin}${url.pathname}${url.search}`;
  } catch {
    return String(link).trim().toLowerCase();
  }
}

function normalizeNewsTitle(title = "") {
  return String(title)
    .toLowerCase()
    .replace(/&[a-z]+;/g, " ")
    .replace(/\b\d+([.,]\d+)?\s*(тыс\.?|тысяч|k|млн|million|billion|%|доллар[а-я]*|\$)?\b/gi, " ")
    .replace(/\b(до|к|около|выше|ниже|уровня|цены|цена|курс|растет|растёт|снижается|падает|поднимается|движется)\b/gi, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getNewsTopicKey(title = "") {
  const normalized = String(title).toLowerCase();
  const hasBtc = /(bitcoin|биткоин|btc|биткойн)/i.test(normalized);
  const hasEth = /(ethereum|эфир|eth)/i.test(normalized);
  const hasPriceLevel = /(\$?\s*\d+([.,]\d+)?\s*(тыс\.?|тысяч|k)\b|\b\d{2,3}\s?000\b)/i.test(normalized);
  const hasPriceAction = /(раст|сниж|пад|упал|стабил|выше|ниже|уровн|курс|цена|у\s+\$?\d)/i.test(normalized);

  if (hasBtc && (hasPriceLevel || hasPriceAction)) {
    return "btc-price-action";
  }

  if (hasEth && (hasPriceLevel || hasPriceAction)) {
    return "eth-price-action";
  }

  if (/(etf|фонды|spot|спотов)/i.test(normalized)) return "etf-flows";
  if (/(sec|регулятор|регулирован|суд|закон|санкци)/i.test(normalized)) return "regulation";
  if (/(бирж|binance|coinbase|kraken|okx|bybit)/i.test(normalized)) return "exchanges";
  if (/(хак|взлом|мошен|эксплойт|security|безопас)/i.test(normalized)) return "security";
  if (/(altcoin|альткоин|solana|sol|xrp|doge|ton|sui|meme|мем)/i.test(normalized)) return "altcoins";
  if (/(defi|стейкинг|staking|yield|ликвидн)/i.test(normalized)) return "defi";
  if (/(фрс|инфляц|ставк|макро|доллар|treasury|fed)/i.test(normalized)) return "macro";

  return normalizeNewsTitle(title).split(" ").slice(0, 4).join("-");
}

function renderNews() {
  elements.newsSourceButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.newsSource === state.newsSource);
  });

  if (state.newsSource === "bya") {
    const byaItems = state.byaNews.length ? state.byaNews : getFallbackByacademyNews();
    elements.newsList.innerHTML = byaItems.map(
      (item) => `
        <a class="news-item bya-news-item" href="${item.link}" target="_blank" rel="noopener noreferrer">
          <span>${item.time} · BYAcademy</span>
          <strong>${escapeHtml(item.title)}</strong>
          <small>${escapeHtml(item.description)}</small>
        </a>
      `,
    ).join("");
    return;
  }

  if (!state.news.length) {
    elements.newsList.innerHTML = `<div class="empty-state">Новости Investing.com пока недоступны.</div>`;
    return;
  }

  elements.newsList.innerHTML = state.news
    .map(
      (item) => `
        <a class="news-item" href="${item.link}" target="_blank" rel="noopener noreferrer">
          <span>${item.time} · Investing.com</span>
          <strong>${escapeHtml(item.title)}</strong>
          <small>${escapeHtml(item.description)}</small>
        </a>
      `,
    )
    .join("");
}

function stripHtml(value) {
  const doc = new DOMParser().parseFromString(value, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim().slice(0, 140);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function getFallbackNews() {
  return [
    {
      title: "Крипторынок ожидает свежие данные по ETF и потокам капитала",
      description: "Лента Investing.com будет подключена автоматически, когда RSS доступен из браузера.",
      time: "offline",
      link: "https://ru.investing.com/news/cryptocurrency-news",
    },
    {
      title: "Bitcoin и Ethereum остаются ключевыми ориентирами для риска",
      description: "Следи за доминацией BTC, Fear & Greed и рыночным объемом вместе с новостным фоном.",
      time: "offline",
      link: "https://ru.investing.com/news/cryptocurrency-news",
    },
    {
      title: "Регуляторные новости могут резко менять настроение рынка",
      description: "Новостной блок предназначен для быстрого мониторинга событий по криптоиндустрии.",
      time: "offline",
      link: "https://ru.investing.com/news/cryptocurrency-news",
    },
  ];
}

function getFallbackByacademyNews() {
  return BYACADEMY_FEED_ITEMS.map((item) => ({
    title: item.title,
    description: item.description,
    time: item.time,
    link: item.link,
  }));
}

function getInvestorScore(signal) {
  return Math.round(signal.roi * 0.45 + signal.portfolio * 0.35 + signal.liquidity * 0.2);
}

function renderPortfolioInsights() {
  if (!elements.athList) {
    return;
  }

  const previousScrollTop = elements.athList.scrollTop;
  const accumulation = state.coins
    .filter((coin) => Number(coin.market_cap_rank || 9999) <= VOLUME_ACCUMULATION_LIMIT)
    .filter((coin) => {
      const symbol = String(coin.symbol).toLowerCase();
      const name = String(coin.name || "").toLowerCase();
      const volume = Number(coin.total_volume) || 0;
      const marketCap = Number(coin.market_cap) || 0;
      const change = Number(coin.price_change_percentage_24h) || 0;
      const stableLike = STABLE_OR_WRAPPED_SYMBOLS.has(symbol) || symbol.startsWith("usd") || symbol.endsWith("usd") || name.includes("dollar");
      return coin.id !== "bitcoin" && symbol !== "btc" && !stableLike && volume > 0 && marketCap > 0 && change > -6;
    })
    .map((coin) => {
      const volume = Number(coin.total_volume) || 0;
      const marketCap = Number(coin.market_cap) || 0;
      const volumeToCap = marketCap > 0 ? volume / marketCap : 0;
      const change = Number(coin.price_change_percentage_24h) || 0;
      const calmMove = Math.max(0, 1 - Math.min(Math.abs(change), 18) / 18);
      const positiveBias = change > 0 ? Math.min(change, 12) / 12 : 0;
      const score = volumeToCap * 100 + calmMove * 0.35 + positiveBias * 0.25;
      return { coin, volumeToCap, change, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, VOLUME_ACCUMULATION_VISIBLE_COUNT);

  if (!accumulation.length) {
    elements.athList.innerHTML = `<div class="empty-state">Нет данных по накоплению объема.</div>`;
    return;
  }

  elements.athList.innerHTML = accumulation
    .map(({ coin, volumeToCap, change }) =>
      portfolioInsightRow(
        coin.name,
        `${(volumeToCap * 100).toFixed(volumeToCap >= 1 ? 0 : 1)}% к cap`,
        `${coin.symbol.toUpperCase()} · объем ${formatCompact(coin.total_volume)} · 24ч ${formatPercent(change)}`,
        change,
        getTradingViewUrl(coin),
      ),
    )
    .join("");
  const maxScrollTop = Math.max(0, elements.athList.scrollHeight - elements.athList.clientHeight);
  elements.athList.scrollTop = Math.min(previousScrollTop, maxScrollTop);
}

function handleAthWheel(event) {
  if (!elements.athList || elements.athList.scrollHeight <= elements.athList.clientHeight) {
    return;
  }

  event.preventDefault();
  const firstRow = elements.athList.querySelector(".insight-row");
  const rowHeight = firstRow ? firstRow.getBoundingClientRect().height : 52;
  const styles = window.getComputedStyle(elements.athList);
  const gap = Number.parseFloat(styles.rowGap || styles.gap) || 0;
  const step = Math.round((rowHeight + gap) * 3);
  const targetTop = event.deltaY > 0 ? elements.athList.scrollTop + step : elements.athList.scrollTop - step;

  elements.athList.scrollBy({
    top: Math.round(targetTop / step) * step - elements.athList.scrollTop,
    behavior: "auto",
  });
}

function portfolioInsightRow(label, value, hint, trend, href = "") {
  const trendClass = typeof trend === "number" ? changeClass(trend) : "";
  const tag = href ? "a" : "div";
  const linkAttributes = href ? ` href="${href}" target="_blank" rel="noopener noreferrer" title="Открыть ${label} в TradingView"` : "";
  return `
    <${tag} class="insight-row" ${linkAttributes}>
      <div>
        <strong>${label}</strong>
        <span>${hint}</span>
      </div>
      <span class="insight-value-wrap">
        <strong class="${trendClass}">${value}</strong>
        ${href ? `<small>TV</small>` : ""}
      </span>
    </${tag}>
  `;
}

function renderStatus() {
  const time = state.lastUpdated
    ? state.lastUpdated.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    : "";
  const source = state.usingFallback ? "демо-данные, API недоступен" : "live, обновлено";
  setStatus(`${source} ${time}`.trim());
  elements.updateCadence.textContent = "Quotes 30s · F&G daily · Altseason 30d proxy";
}

function renderRefreshCountdown() {
  if (!state.nextRefreshAt) {
    elements.refreshCountdown.textContent = "Next update ...";
    return;
  }

  const seconds = Math.max(0, Math.ceil((state.nextRefreshAt - Date.now()) / 1000));
  elements.refreshCountdown.textContent = state.isRefreshing ? "Updating..." : `Next update ${seconds}s`;
}

function setupLiveTickerStream() {
  const symbols = getLiveTickerSymbols();
  const socketKey = symbols.join(",");

  if (!symbols.length || socketKey === state.liveSocketKey) {
    return;
  }

  if (state.liveSocket) {
    state.liveSocket.close();
  }

  state.liveSocketKey = socketKey;
  const streams = symbols.map((symbol) => `${symbol.toLowerCase()}usdt@ticker`).join("/");
  const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;

  try {
    state.liveSocket = new WebSocket(url);
    elements.liveStreamStatus.textContent = `Realtime stream · подключение ${symbols.length} пар`;

    state.liveSocket.addEventListener("open", () => {
      elements.liveStreamStatus.textContent = `Realtime stream · Binance ${symbols.length} пар`;
    });

    state.liveSocket.addEventListener("message", (event) => {
      const payload = JSON.parse(event.data);
      const ticker = payload.data;

      if (!ticker?.s || !ticker?.c) {
        return;
      }

      updateCoinFromTicker(ticker.s, Number(ticker.c), Number(ticker.P));
    });

    state.liveSocket.addEventListener("close", () => {
      elements.liveStreamStatus.textContent = "Realtime stream · переподключение...";
      window.setTimeout(() => {
        state.liveSocketKey = "";
        setupLiveTickerStream();
      }, 3500);
    });

    state.liveSocket.addEventListener("error", () => {
      elements.liveStreamStatus.textContent = "Realtime stream · недоступен";
    });
  } catch (error) {
    console.warn(error);
    elements.liveStreamStatus.textContent = "Realtime stream · недоступен";
  }
}

function getLiveTickerSymbols() {
  const important = new Set(["BTC", "ETH"]);
  state.watchlist.forEach((coinId) => {
    const coin = findCoin(coinId);
    if (coin) important.add(coin.symbol.toUpperCase());
  });
  state.portfolio.forEach((position) => {
    const coin = findCoin(position.coinId);
    if (coin) important.add(coin.symbol.toUpperCase());
  });
  state.coins.slice(0, 30).forEach((coin) => important.add(coin.symbol.toUpperCase()));

  return [...important]
    .map((symbol) => symbol.replace(/[^A-Z0-9]/g, ""))
    .filter((symbol) => symbol && !STABLE_OR_WRAPPED_SYMBOLS.has(symbol.toLowerCase()) && symbol !== "USDT")
    .slice(0, 40);
}

function updateCoinFromTicker(pairSymbol, price, change24) {
  if (!Number.isFinite(price)) {
    return;
  }

  const symbol = pairSymbol.replace(/USDT$/i, "").toLowerCase();
  const matchingCoins = state.coins.filter((coin) => coin.symbol.toLowerCase() === symbol);

  matchingCoins.forEach((coin) => {
    coin.current_price = price;

    if (Number.isFinite(change24)) {
      coin.price_change_percentage_24h = change24;
    }

    updateMarketRow(coin);
  });

  const selectedPageCoin = findCoin(elements.portfolioPageCoinSelect?.value);
  if (selectedPageCoin?.symbol?.toLowerCase() === symbol) {
    useCurrentMarketPrice();
    updatePortfolioMarketPriceHint();
  }

  const selectedQuickCoin = findCoin(state.quickPortfolioCoinId);
  if (selectedQuickCoin?.symbol?.toLowerCase() === symbol) {
    elements.costInput.value = formatPriceInputValue(price);
  }

  scheduleLiveRender();
}

function updateMarketRow(coin) {
  const row = elements.marketTable.querySelector(`[data-coin-id="${coin.id}"]`);

  if (!row) {
    return;
  }

  const priceCell = row.querySelector(".price-cell");
  const changeCell = row.querySelector(".change-24");
  const sparkline = row.querySelector(".sparkline");
  setText(priceCell, formatMoney(coin.current_price));
  changeCell.textContent = formatPercent(coin.price_change_percentage_24h);
  changeCell.className = `change-24 ${changeClass(coin.price_change_percentage_24h)}`;
  updateSparklineTail(coin, coin.current_price);
  drawSparkline(sparkline, getSparklinePrices(coin), coin.price_change_percentage_7d_in_currency);
}

function scheduleLiveRender() {
  if (state.liveRenderTimer) {
    return;
  }

  state.liveRenderTimer = window.setTimeout(() => {
    state.liveRenderTimer = null;
    renderMetrics();
    renderLiveStrip();
    renderMovers();
    renderPortfolio();
    renderPortfolioPage();
    renderClosedPositions();
    renderPortfolioInsights();
    renderWatchlist();
    renderInvestorSignals();
  }, LIVE_RENDER_MS);
}

function addPortfolioPosition(source = "quick") {
  const isPage = source === "page";
  const amountInput = isPage ? elements.portfolioPageAmountInput : elements.amountInput;
  const costInput = isPage ? elements.portfolioPageCostInput : elements.costInput;
  const form = isPage ? elements.portfolioPageForm : elements.portfolioForm;
  let amount = Number(amountInput.value);
  const total = isPage ? Number(elements.portfolioPageTotalInput.value) : 0;
  const coinId = isPage ? elements.portfolioPageCoinSelect.value : getCoinIdFromPortfolioSearch();
  const coin = findCoin(coinId);
  const marketPrice = getCoinMarketPrice(coin);
  const cost = marketPrice || Number(costInput.value);

  if (marketPrice > 0) {
    costInput.value = formatPriceInputValue(marketPrice);
  }

  if (isPage && amount <= 0 && total > 0 && cost > 0) {
    amount = total / cost;
    amountInput.value = trimNumber(amount, 8);
  }

  if (!coinId || amount <= 0 || cost < 0) {
    return;
  }

  const openedAt = Date.now();
  recordPortfolioValuePoint("before-add", openedAt - 1);
  state.portfolio.push({
    id: crypto.randomUUID(),
    coinId,
    amount,
    cost,
    wallet: isPage ? elements.portfolioPageWalletSelect?.value || DEFAULT_POSITION_WALLET : DEFAULT_POSITION_WALLET,
    date: isPage ? elements.portfolioPageDateInput.value : new Date().toISOString().slice(0, 10),
    note: isPage ? elements.portfolioPageNoteInput.value.trim() : "",
    createdAt: new Date(openedAt).toISOString(),
  });
  recordPortfolioValuePoint("after-add", openedAt);

  persistPortfolio();
  form.reset();
  state.quickPortfolioCoinId = "";
  hideCoinSearchDropdown();
  elements.portfolioPageDateInput.valueAsDate = new Date();
  if (elements.portfolioPageWalletSelect) {
    elements.portfolioPageWalletSelect.value = DEFAULT_POSITION_WALLET;
  }
  elements.portfolioPageTotalInput.value = "";
  updatePortfolioMarketPriceHint();
  updatePortfolioNoteCounter();
  recalculatePortfolioAmount("open");
  if (isPage) {
    closePortfolioCoinModal();
  }
  renderPortfolio();
  renderPortfolioPage();
  renderMetrics();
  renderPortfolioInsights();
  setupLiveTickerStream();
  showToast(
    `${coin?.name || "Позиция"} добавлена`,
    `${formatAmount(amount)} ${coin?.symbol?.toUpperCase() || ""} · цена покупки ${formatMoney(cost)}`,
    amount * cost,
  );
}

function getCoinIdFromPortfolioSearch() {
  const value = elements.coinSearchInput.value.trim();
  if (!value) return "";

  const selectedCoin = findCoin(state.quickPortfolioCoinId);
  if (selectedCoin && value === `${selectedCoin.name} (${selectedCoin.symbol.toUpperCase()})`) {
    return selectedCoin.id;
  }

  const query = value.toLowerCase();
  return (
    state.coins.find(
      (coin) =>
        coin.id.toLowerCase() === query ||
        coin.name.toLowerCase() === query ||
        coin.symbol.toLowerCase() === query ||
        `${coin.name} (${coin.symbol.toUpperCase()})`.toLowerCase() === query,
    )?.id || ""
  );
}

function removePortfolioPosition(positionId) {
  const removed = state.portfolio.find((position) => position.id === positionId);
  const removedAt = Date.now();
  if (removed) {
    recordPortfolioValuePoint("before-remove", removedAt - 1);
    rememberPortfolioChartExit([removed], "removed", new Date(removedAt).toISOString());
  }
  state.portfolio = state.portfolio.filter((position) => position.id !== positionId);
  if (removed) {
    recordPortfolioValuePoint("after-remove", removedAt);
  }
  if (removed && getPortfolioCoinCount(removed.coinId) < 2) {
    state.groupedPortfolioCoins.delete(removed.coinId);
    state.portfolioCollapsed = state.groupedPortfolioCoins.size > 0;
  }
  persistPortfolio();
  renderPortfolio();
  renderPortfolioPage();
  renderMetrics();
  renderPortfolioInsights();
}

function removePortfolioGroup(coinId, walletId = "all") {
  const removedPositions = state.portfolio.filter(
    (position) => position.coinId === coinId && (walletId === "all" || getPortfolioWalletId(position) === walletId),
  );
  const removedIds = new Set(removedPositions.map((position) => position.id));
  const removedAt = Date.now();
  if (removedPositions.length) {
    recordPortfolioValuePoint("before-remove", removedAt - 1);
  }
  rememberPortfolioChartExit(removedPositions, "removed", new Date(removedAt).toISOString());
  state.portfolio = state.portfolio.filter((position) => !removedIds.has(position.id));
  if (removedPositions.length) {
    recordPortfolioValuePoint("after-remove", removedAt);
  }
  state.groupedPortfolioCoins.delete(coinId);
  state.portfolioCollapsed = state.groupedPortfolioCoins.size > 0;
  persistPortfolio();
  renderPortfolio();
  renderPortfolioPage();
  renderMetrics();
  renderPortfolioInsights();
}

function closePortfolioPosition(positionId) {
  const position = state.portfolio.find((item) => item.id === positionId);
  if (!position) return;

  openPortfolioCloseModal(position.id);
}

function closePortfolioGroup(coinId) {
  const positions = state.portfolio.filter((position) => position.coinId === coinId);
  if (!positions.length) return;

  openPortfolioCloseModal(positions.map((position) => position.id));
}

function rememberPortfolioChartExit(positions, reason = "removed", exitedAt = new Date().toISOString()) {
  if (!positions?.length) return;

  const snapshots = positions.map((position) => createPortfolioChartExitSnapshot(position, exitedAt, reason)).filter(Boolean);
  if (!snapshots.length) return;

  state.portfolioChartHistory = [...snapshots, ...state.portfolioChartHistory].slice(0, 500);
  persistPortfolioChartHistory();
}

function createPortfolioChartExitSnapshot(position, exitedAt, reason = "removed") {
  const coin = findCoin(position.coinId);
  const amount = Number(position.amount) || 0;
  const entryPrice = Number(position.cost) || 0;
  const closePrice = Number(coin?.current_price) || entryPrice;
  const entryValue = entryPrice * amount;
  const closeValue = closePrice * amount;
  if (amount <= 0) return null;

  return {
    id: crypto.randomUUID(),
    sourceId: position.id,
    coinId: position.coinId,
    wallet: getPortfolioWalletId(position),
    amount,
    entryPrice,
    closePrice,
    entryValue,
    closeValue,
    pnl: closeValue - entryValue,
    pnlPercent: entryValue > 0 ? ((closeValue - entryValue) / entryValue) * 100 : 0,
    openedAt: position.createdAt || position.date || exitedAt,
    removedAt: exitedAt,
    reason,
  };
}

function closePortfolioPositions(positions, percent = 100) {
  const closedTime = Date.now();
  const closedAt = new Date(closedTime).toISOString();
  const closeRatio = clampClosePercent(percent) / 100;
  const fullyClosedPositionIds = new Set();
  const toastCoin = findCoin(positions[0]?.coinId);
  let totalCloseValue = 0;
  let totalPnl = 0;
  recordPortfolioValuePoint("before-close", closedTime - 1);
  const snapshots = positions.map((position) => {
    const coin = findCoin(position.coinId);
    const closePrice = Number(coin?.current_price) || Number(position.cost) || 0;
    const entryPrice = Number(position.cost) || 0;
    const originalAmount = Number(position.amount) || 0;
    const amount = originalAmount * closeRatio;
    const pnl = (closePrice - entryPrice) * amount;
    const entryValue = entryPrice * amount;
    const closeValue = closePrice * amount;
    totalCloseValue += closeValue;
    totalPnl += pnl;

    if (closeRatio >= 0.999999) {
      fullyClosedPositionIds.add(position.id);
    } else {
      position.amount = Math.max(originalAmount - amount, 0);
    }

    return {
      id: crypto.randomUUID(),
      sourceId: position.id,
      coinId: position.coinId,
      wallet: getPortfolioWalletId(position),
      coinName: coin?.name || position.coinId,
      symbol: coin?.symbol?.toUpperCase() || "",
      image: coin?.image || "",
      amount,
      entryPrice,
      closePrice,
      entryValue,
      closeValue,
      pnl,
      pnlPercent: entryValue > 0 ? (pnl / entryValue) * 100 : 0,
      openedAt: position.date || position.createdAt || closedAt,
      closedAt,
      note: [position.note, closeRatio < 0.999999 ? `Закрыто ${formatPercent(closeRatio * 100)}` : ""].filter(Boolean).join(" · "),
    };
  });

  state.closedPositions = [...snapshots, ...state.closedPositions];
  state.portfolio = state.portfolio.filter((position) => !fullyClosedPositionIds.has(position.id) && Number(position.amount) > 0);
  recordPortfolioValuePoint("after-close", closedTime);
  positions.forEach((position) => {
    if (getPortfolioCoinCount(position.coinId) < 2) {
      state.groupedPortfolioCoins.delete(position.coinId);
    }
  });
  state.portfolioCollapsed = state.groupedPortfolioCoins.size > 0;
  persistClosedPositions();
  persistPortfolio();
  renderPortfolio();
  renderPortfolioPage();
  renderClosedPositions();
  renderMetrics();
  renderPortfolioInsights();
  return {
    title: `${toastCoin?.name || "Позиция"} ${closeRatio >= 0.999999 ? "закрыта" : "частично закрыта"}`,
    message: `${closeRatio >= 0.999999 ? "Закрыто 100%" : `Закрыто ${formatPlainPercent(closeRatio * 100)}`} · ${formatMoney(totalCloseValue)} · ${formatPortfolioDeltaMoney(totalPnl)}`,
    pnl: totalPnl,
  };
}

function toggleWatchlist(coinId) {
  const isRemoving = state.watchlist.includes(coinId);
  state.watchlist = isRemoving ? state.watchlist.filter((id) => id !== coinId) : [...state.watchlist, coinId];
  if (isRemoving) {
    delete state.watchlistNotes[coinId];
    persistWatchlistNotes();
  }
  persistWatchlist();
  renderMarket();
  renderWatchlist();
  const coin = findCoin(coinId);
  if (coin) {
    showToast(
      isRemoving ? `${coin.name} убрана из избранного` : `${coin.name} добавлена в избранное`,
      isRemoving ? "Позиция больше не отслеживается." : "Позиция появилась в правом блоке.",
      isRemoving ? -1 : 1,
    );
  }
}

function exportPortfolio() {
  const activePortfolio = getActivePortfolioPositions();
  if (!activePortfolio.length) {
    return;
  }

  const headers = ["coin", "symbol", "amount", "entry_price", "current_price", "value", "pnl", "pnl_percent", "share"];
  const totals = getPortfolioTotals();
  const rows = activePortfolio.map((position) => {
    const coin = findCoin(position.coinId);
    const currentPrice = coin?.current_price || 0;
    const value = currentPrice * position.amount;
    const cost = position.cost * position.amount;
    const pnl = value - cost;
    const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0;
    const share = totals.value > 0 ? (value / totals.value) * 100 : 0;
    return [
      coin?.name || position.coinId,
      coin?.symbol?.toUpperCase() || "",
      position.amount,
      position.cost,
      currentPrice,
      value,
      pnl,
      pnlPercent,
      share,
    ];
  });

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "bya-marketdesk-portfolio.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function getPortfolioTotals(positions = state.portfolio) {
  const totals = getActivePortfolioPositions(positions).reduce(
    (result, position) => {
      const coin = findCoin(position.coinId);
      if (!coin) {
        return result;
      }

      const value = coin.current_price * position.amount;
      const cost = position.cost * position.amount;
      result.value += value;
      result.cost += cost;
      return result;
    },
    { value: 0, cost: 0 },
  );

  const pnl = totals.value - totals.cost;
  return {
    value: totals.value,
    cost: totals.cost,
    pnl,
    pnlPercent: totals.cost > 0 ? (pnl / totals.cost) * 100 : 0,
  };
}

function getPortfolioCurrentValue() {
  return getActivePortfolioPositions().reduce((sum, position) => {
    const coin = findCoin(position.coinId);
    return sum + (Number(coin?.current_price) || Number(position.cost) || 0) * (Number(position.amount) || 0);
  }, 0);
}

function recordPortfolioValuePoint(reason = "snapshot", at = Date.now(), value = getPortfolioCurrentValue()) {
  if (!getActivePortfolioPositions().length && value <= 0 && !isPortfolioValueEventReason(reason)) return;
  const time = Number(at);
  const amount = Number(value);
  if (!Number.isFinite(time) || !Number.isFinite(amount)) return;

  const last = state.portfolioValueHistory.at(-1);
  if (last && !isPortfolioValueEventReason(reason)) {
    const lastTime = new Date(last.at).getTime();
    const lastValue = Number(last.value);
    const noiseThreshold = getPortfolioChartNoiseThreshold(lastValue);
    if (Number.isFinite(lastTime) && Number.isFinite(lastValue) && Math.abs(lastValue - amount) <= noiseThreshold) {
      return;
    }

    if (Number.isFinite(lastTime) && time - lastTime < 5 * 60 * 1000 && Math.abs(lastValue - amount) < noiseThreshold * 2) {
      return;
    }
  }

  state.portfolioValueHistory = [
    ...state.portfolioValueHistory,
    {
      at: new Date(time).toISOString(),
      value: amount,
      reason,
    },
  ]
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
    .slice(-2000);
  persistPortfolioValueHistory();
}

function isPortfolioValueEventReason(reason) {
  if (String(reason || "").startsWith("before-seed-")) return true;
  return [
    "before-add",
    "after-add",
    "before-close",
    "after-close",
    "before-remove",
    "after-remove",
    "seed-open",
    "seed-close",
    "seed-remove",
  ].includes(reason);
}

function getPortfolioChartNoiseThreshold(value) {
  const base = Math.abs(Number(value)) || 0;
  return Math.max(base * 0.0005, 10);
}

function getPortfolioChartVisibleMoveThreshold(value) {
  const base = Math.abs(Number(value)) || 0;
  return Math.max(base * 0.01, 250);
}

function seedPortfolioValueHistoryFromEvents() {
  const existingUsefulPoints = state.portfolioValueHistory.filter((point) => {
    const value = Number(point.value);
    return isPortfolioValueEventReason(point.reason) && Number.isFinite(new Date(point.at).getTime()) && Number.isFinite(value);
  });
  const distinctValues = new Set(existingUsefulPoints.map((point) => Math.round(Number(point.value) * 100) / 100));
  if (existingUsefulPoints.length >= 2 && distinctValues.size >= 2) return;

  const events = [];
  const pushEvent = (at, delta, reason, lead = 0) => {
    const time = new Date(at).getTime();
    const value = Number(delta);
    if (Number.isFinite(time) && Number.isFinite(value) && value !== 0) {
      events.push({ time: time + lead, delta: value, reason });
    }
  };

  state.closedPositions.forEach((position) => {
    const entryValue = Number(position.entryValue) || (Number(position.entryPrice) || 0) * (Number(position.amount) || 0);
    const closeValue = Number(position.closeValue) || (Number(position.closePrice) || 0) * (Number(position.amount) || 0);
    pushEvent(position.openedAt, entryValue, "seed-open");
    pushEvent(position.closedAt, -closeValue, "seed-close");
  });

  state.portfolioChartHistory.forEach((position) => {
    const entryValue = Number(position.entryValue) || (Number(position.entryPrice) || 0) * (Number(position.amount) || 0);
    const closeValue = Number(position.closeValue) || (Number(position.closePrice) || 0) * (Number(position.amount) || 0);
    pushEvent(position.openedAt, entryValue, "seed-open");
    pushEvent(position.removedAt || position.closedAt, -closeValue, "seed-remove");
  });

  state.portfolio.forEach((position) => {
    const entryValue = (Number(position.cost) || 0) * (Number(position.amount) || 0);
    pushEvent(position.createdAt || position.date, entryValue, "seed-open");
  });

  if (!events.length) return;

  let runningValue = 0;
  const seededPoints = [];
  events.sort((a, b) => a.time - b.time).forEach((event) => {
      seededPoints.push({
        at: new Date(Math.max(event.time - 1, 0)).toISOString(),
        value: runningValue,
        reason: `before-${event.reason}`,
      });
      runningValue = Math.max(0, runningValue + event.delta);
      seededPoints.push({
        at: new Date(event.time).toISOString(),
        value: runningValue,
        reason: event.reason,
      });
    });

  state.portfolioValueHistory = seededPoints.slice(-2000);
  persistPortfolioValueHistory();
}

function prunePassivePortfolioValueHistory() {
  const eventPoints = state.portfolioValueHistory.filter((point) => isPortfolioValueEventReason(point.reason));
  if (eventPoints.length === state.portfolioValueHistory.length) return;
  state.portfolioValueHistory = eventPoints;
  persistPortfolioValueHistory();
}

function getClosedPositionsTotals() {
  return state.closedPositions.reduce(
    (totals, position) => {
      totals.entryValue += Number(position.entryValue) || 0;
      totals.closeValue += Number(position.closeValue) || 0;
      totals.pnl += Number(position.pnl) || 0;
      return totals;
    },
    { entryValue: 0, closeValue: 0, pnl: 0 },
  );
}

function updateAltseasonFromTopSample(coins, shouldRender = false) {
  state.altseason = calculateAltseason(coins.slice(0, ALTSEASON_SAMPLE_LIMIT));

  if (!shouldRender) {
    return;
  }

  renderAltseason();
  setAnimatedText(
    elements.altseasonLive,
    state.altseason ? `${state.altseason.label} ${state.altseason.score}/100` : "Altseason proxy ...",
    state.altseason?.score,
  );
}

function calculateAltseason(coins) {
  const bitcoin = coins.find((coin) => coin.id === "bitcoin" || String(coin.symbol).toLowerCase() === "btc");
  const btcChange = Number(bitcoin?.price_change_percentage_30d_in_currency);

  if (!Number.isFinite(btcChange)) {
    return null;
  }

  const altcoins = coins
    .filter((coin) => {
      const change = Number(coin.price_change_percentage_30d_in_currency);
      return (
        coin.id !== "bitcoin" &&
        String(coin.symbol).toLowerCase() !== "btc" &&
        Number.isFinite(change) &&
        !STABLE_OR_WRAPPED_SYMBOLS.has(String(coin.symbol).toLowerCase())
      );
    })
    .slice(0, 50);

  if (!altcoins.length) {
    return null;
  }

  const outperformers = altcoins.filter((coin) => Number(coin.price_change_percentage_30d_in_currency) > btcChange).length;
  const score = Math.round((outperformers / altcoins.length) * 100);

  return {
    score,
    outperformers,
    sampleSize: altcoins.length,
    btcChange,
    label: score >= 75 ? "Altseason" : score <= 25 ? "Bitcoin season" : "Neutral",
  };
}

function nearestAthCoin() {
  return [...state.coins]
    .filter((coin) => Number.isFinite(Number(coin.ath_change_percentage)))
    .sort((a, b) => Math.abs(a.ath_change_percentage) - Math.abs(b.ath_change_percentage))[0];
}

function getCoinMarketPrice(coin) {
  if (state.usingFallback) {
    return 0;
  }

  const price = Number(coin?.current_price);
  return Number.isFinite(price) && price > 0 ? price : 0;
}

function findCoin(coinId) {
  const value = String(coinId || "");
  if (!value) return null;

  const normalizedCoinId = normalizeCoinId(value);
  const legacyCoinId = Object.entries(LEGACY_COIN_IDS).find(([, currentId]) => currentId === value)?.[0] || "";
  return state.coins.find(
    (coin) =>
      coin.id === value ||
      coin.paprikaId === value ||
      coin.id === normalizedCoinId ||
      coin.paprikaId === normalizedCoinId ||
      (legacyCoinId && (coin.id === legacyCoinId || coin.paprikaId === legacyCoinId)),
  );
}

function getTradingViewUrl(coin) {
  const symbol = coin?.symbol ? coin.symbol.toUpperCase().replace(/[^A-Z0-9]/g, "") : "BTC";
  const pair = symbol.endsWith("USD") || symbol.endsWith("USDT") ? symbol : `${symbol}USDT`;
  // TradingView spot symbol. Binance futures would use BINANCE:BTCUSDT.P, so we intentionally omit .P.
  return `https://www.tradingview.com/chart/?symbol=BINANCE%3A${encodeURIComponent(pair)}`;
}

function getEstimatedTotalVolume(coin) {
  const volume = Number(coin?.total_volume) || 0;
  const rank = Number(coin?.market_cap_rank) || 80;
  const depthFactor = rank <= 10 ? 1.18 : rank <= 30 ? 1.12 : 1.07;
  return volume * depthFactor;
}

function getEstimatedTopTierVolume(coin) {
  const volume = Number(coin?.total_volume) || 0;
  const rank = Number(coin?.market_cap_rank) || 80;
  const topTierShare = rank <= 10 ? 0.48 : rank <= 30 ? 0.38 : 0.3;
  return volume * topTierShare;
}

function getSparklinePrices(coin) {
  return coin?.sparkline_in_7d?.price || [];
}

function updateSparklineTail(coin, price) {
  if (!coin.sparkline_in_7d?.price?.length || !Number.isFinite(price)) {
    return;
  }

  coin.sparkline_in_7d.price[coin.sparkline_in_7d.price.length - 1] = price;
}

function drawSparkline(canvas, prices, trend) {
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const padding = 4;

  if (!prices?.length) {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(100, 117, 130, 0.32)";
    ctx.lineWidth = 1.4;
    ctx.setLineDash([4, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, height / 2);
    ctx.lineTo(width - padding, height / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    return;
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = Number(trend) >= 0 ? "#0f9f6e" : "#e03f45";
  ctx.beginPath();

  prices.forEach((price, index) => {
    const x = padding + (index / (prices.length - 1)) * (width - padding * 2);
    const y = height - padding - ((price - min) / range) * (height - padding * 2);

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
}

function buildFallbackSparkline(price, changePercent = 0, seed = "asset") {
  const safePrice = Number(price) || 1;
  const change = Number(changePercent) || 0;
  const start = safePrice / (1 + change / 100 || 1);
  const length = 64;
  const random = seededRandom(seed);
  const drift = (safePrice - start) / (length - 1);
  const volatility = safePrice * Math.max(0.0025, Math.min(0.035, Math.abs(change) / 650 + 0.006));
  const points = [start];

  for (let index = 1; index < length - 1; index += 1) {
    const previous = points[index - 1];
    const shock = (random() - 0.5) * volatility;
    const meanReversion = (start + drift * index - previous) * 0.18;
    points.push(Math.max(safePrice * 0.0001, previous + drift + shock + meanReversion));
  }

  points.push(safePrice);
  return points;
}

function seededRandom(seed) {
  let hash = 2166136261;
  String(seed || "asset")
    .split("")
    .forEach((char) => {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    });

  return () => {
    hash += 0x6d2b79f5;
    let value = hash;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function persistPortfolio() {
  saveActivePortfolioBook();
  persistPortfolioBooks({ sync: false });
  localStorage.setItem(STORAGE_KEYS.portfolio, JSON.stringify(state.portfolio));
  scheduleAccountPortfolioSync();
}

function persistClosedPositions() {
  saveActivePortfolioBook();
  persistPortfolioBooks({ sync: false });
  localStorage.setItem(STORAGE_KEYS.closedPositions, JSON.stringify(state.closedPositions));
  scheduleAccountPortfolioSync();
}

function persistPortfolioChartHistory() {
  saveActivePortfolioBook();
  persistPortfolioBooks({ sync: false });
  localStorage.setItem(STORAGE_KEYS.portfolioChartHistory, JSON.stringify(state.portfolioChartHistory));
  scheduleAccountPortfolioSync();
}

function persistPortfolioValueHistory() {
  saveActivePortfolioBook();
  persistPortfolioBooks({ sync: false });
  localStorage.setItem(STORAGE_KEYS.portfolioValueHistory, JSON.stringify(state.portfolioValueHistory));
  scheduleAccountPortfolioSync();
}

function persistWatchlist() {
  localStorage.setItem(STORAGE_KEYS.watchlist, JSON.stringify(state.watchlist));
}

function persistWatchlistNotes() {
  localStorage.setItem(STORAGE_KEYS.watchlistNotes, JSON.stringify(state.watchlistNotes));
}

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function migrateLegacyStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.portfolio) && localStorage.getItem("cryptodesk.portfolio.v1")) {
    localStorage.setItem(STORAGE_KEYS.portfolio, localStorage.getItem("cryptodesk.portfolio.v1"));
    state.portfolio = readStorage(STORAGE_KEYS.portfolio, []);
  }

  if (!localStorage.getItem(STORAGE_KEYS.watchlist) && localStorage.getItem("cryptodesk.watchlist.v1")) {
    localStorage.setItem(STORAGE_KEYS.watchlist, localStorage.getItem("cryptodesk.watchlist.v1"));
    state.watchlist = readStorage(STORAGE_KEYS.watchlist, []);
  }
}

function resetPortfolioFromUrl() {
  const url = new URL(window.location.href);
  if (url.searchParams.get("resetPortfolio") !== "1") {
    return;
  }

  [
    STORAGE_KEYS.portfolio,
    STORAGE_KEYS.closedPositions,
    STORAGE_KEYS.portfolioChartHistory,
    STORAGE_KEYS.portfolioValueHistory,
    STORAGE_KEYS.portfolioBooks,
    STORAGE_KEYS.activePortfolioBookId,
  ].forEach((key) => localStorage.removeItem(key));

  state.portfolio = [];
  state.closedPositions = [];
  state.portfolioChartHistory = [];
  state.portfolioValueHistory = [];
  state.portfolioBooks = [];
  state.activePortfolioBookId = "";
  state.groupedPortfolioCoins = new Set();
  state.portfolioCollapsed = false;
  state.pendingClosePositionIds = [];
  url.searchParams.delete("resetPortfolio");
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash || "#portfolio-page"}`);
}

function setStatus(text) {
  elements.dataStatus.textContent = text;
}

function setAnimatedText(element, text, trend) {
  if (!element || element.textContent === text) {
    return;
  }

  element.textContent = text;
  element.classList.remove("flash-up", "flash-down");

  if (typeof trend === "number") {
    element.classList.add(trend >= 0 ? "flash-up" : "flash-down");
  } else {
    element.classList.add("flash-up");
  }

  window.setTimeout(() => element.classList.remove("flash-up", "flash-down"), 650);
}

function setText(element, text) {
  if (!element || element.textContent === text) {
    return;
  }

  element.textContent = text;
}

function changeClass(value) {
  return Number(value) >= 0 ? "positive" : "negative";
}

function classifyFearGreed(value) {
  if (value <= 24) return "Extreme Fear";
  if (value <= 44) return "Fear";
  if (value <= 55) return "Neutral";
  if (value <= 74) return "Greed";
  return "Extreme Greed";
}

function formatPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "n/a";
  return `${number > 0 ? "+" : ""}${number.toFixed(Math.abs(number) > 1000 ? 0 : 2)}%`;
}

function formatMoney(value) {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: state.currency.toUpperCase(),
    maximumFractionDigits: amount > 100 ? 0 : 4,
  }).format(amount);
}

function formatPortfolioDeltaMoney(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: state.currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function formatCompact(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: state.currency.toUpperCase(),
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function formatNumber(value) {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return new Date().toLocaleDateString("ru-RU");
  return new Date(value).toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" });
}

function capitalizeFirstLetter(value) {
  const text = String(value || "");
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function trimNumber(value, digits) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "";
  return String(Number(number.toFixed(digits)));
}

function formatPriceInputValue(value) {
  const price = Number(value);
  if (!Number.isFinite(price) || price <= 0) return "";
  return price > 100 ? price.toFixed(2) : price.toFixed(6);
}

function formatAmount(value) {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 8 }).format(Number(value) || 0);
}
