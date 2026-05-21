import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookOpen,
  Award,
  ShieldAlert,
  TrendingUp,
  BookMarked,
  Cpu,
  Users,
  Layers,
  ArrowRight,
  Quote as QuoteIcon,
  Sparkles,
  Info,
  Lightbulb,
  CheckCircle2,
  XCircle,
  HelpCircle as QuizIcon,
  Maximize2,
  Minimize2,
  ArrowUp,
  X,
  Send,
  RotateCcw,
  Target,
  Eye,
  GitBranch,
  Network,
  Gamepad2,
} from 'lucide-react';
import './App.css';
import bacHoMacLeninImage from './assets/bac-ho-mac-lenin.jpeg';

// ── Game Data ────────────────────────────────────────────────────────────────

const MATCHING_PAIRS = [
  { id: 1, term: 'Giai đoạn THẤP (CNXH)', def: 'Thoát thai từ TBCN, còn mang nhiều dấu vết của xã hội cũ' },
  { id: 2, term: 'Giai đoạn CAO (CNCS)', def: 'Phát triển hoàn toàn trên cơ sở của chính nó, quan hệ chín muồi' },
  { id: 3, term: 'Quá độ gián tiếp', def: 'Nước chưa qua CNTB → lên CNXH, cần thời kỳ lâu dài, gian khổ' },
  { id: 4, term: 'Quá độ trực tiếp', def: 'Nước đã qua CNTB phát triển cao → cải biến lên CNCS' },
  { id: 5, term: 'Chuyên chính cách mạng', def: 'Hình thức nhà nước tất yếu trong thời kỳ quá độ chính trị' },
];
const MATCHING_RIGHT_ORDER = [2, 4, 1, 5, 3];

const FLASHCARDS = [
  { id: 1, term: '4 góc độ tiếp cận CNXH', def: 'Phong trào thực tiễn → Trào lưu tư tưởng → Khoa học về sứ mệnh GCCN → Chế độ xã hội (giai đoạn đầu hình thái CSCN)' },
  { id: 2, term: 'Học thuyết hình thái KT-XH', def: 'Mác-Ăngghen sáng lập, vạch rõ quy luật vận động xã hội; gồm LLSX, QHSX, Kiến trúc thượng tầng' },
  { id: 3, term: 'Tiền đề vật chất tất yếu thứ nhất', def: 'LLSX xã hội hóa mâu thuẫn với QHSX tư nhân TBCN → buộc phải thay thế' },
  { id: 4, term: 'Tiền đề vật chất tất yếu thứ hai', def: 'Giai cấp công nhân trưởng thành — chủ thể cách mạng tiên phong, lật đổ CNTB' },
  { id: 5, term: '"Cơn đau đẻ kéo dài"', def: 'Ẩn dụ của Lênin về quá độ gián tiếp: thời kỳ lâu dài, gian khổ cho nước chưa qua CNTB phát triển' },
  { id: 6, term: 'Phê phán cương lĩnh Gôta (1875)', def: 'Tác phẩm C. Mác — nguồn trích dẫn về thời kỳ quá độ và chuyên chính cách mạng của giai cấp vô sản' },
  { id: 7, term: 'CNXH khác CNCS ở điểm nào?', def: 'CNXH = giai đoạn thấp, còn dấu vết cũ. CNCS = giai đoạn cao, phát triển hoàn toàn trên cơ sở của chính nó' },
  { id: 8, term: 'Việt Nam & thời kỳ quá độ', def: 'Thuộc nghĩa thứ nhất (gián tiếp): đi lên CNXH từ nước thuộc địa nửa phong kiến, chưa qua CNTB phát triển' },
];

const TF_QUESTIONS = [
  { statement: 'Việt Nam thuộc trường hợp quá độ TRỰC TIẾP theo V.I. Lênin.', answer: false, explain: 'Sai. Việt Nam quá độ GIÁN TIẾP — chưa trải qua CNTB phát triển, thuộc nghĩa thứ nhất.' },
  { statement: 'Chủ nghĩa xã hội là giai đoạn THẤP của hình thái KT-XH cộng sản chủ nghĩa.', answer: true, explain: 'Đúng. CNXH là giai đoạn đầu, vừa thoát thai từ TBCN, còn mang dấu vết của xã hội cũ.' },
  { statement: 'C. Mác viết "Phê phán cương lĩnh Gôta" vào năm 1875.', answer: true, explain: 'Đúng. Đây là nguồn trích dẫn nổi tiếng về thời kỳ quá độ chính trị và chuyên chính vô sản.' },
  { statement: 'Hình thái KT-XH cộng sản chủ nghĩa chỉ có DUY NHẤT một giai đoạn.', answer: false, explain: 'Sai. Có HAI giai đoạn: giai đoạn thấp (CNXH) và giai đoạn cao (CNCS).' },
  { statement: 'CNXH được tiếp cận từ đúng 3 góc độ theo quan điểm Mác-Lênin.', answer: false, explain: 'Sai. Có 4 góc độ: phong trào thực tiễn, trào lưu tư tưởng, khoa học và chế độ xã hội.' },
  { statement: 'Sự thay thế TBCN bằng CNXH là quá trình lịch sử - tự nhiên, không phụ thuộc ý chí chủ quan.', answer: true, explain: 'Đúng. Mác-Lênin khẳng định đây là quy luật khách quan, tất yếu của lịch sử.' },
  { statement: 'V.I. Lênin là người SÁNG LẬP học thuyết hình thái kinh tế - xã hội.', answer: false, explain: 'Sai. C. Mác và Ph. Ăngghen sáng lập. Lênin chỉ phát triển và hiện thực hóa tại Nga Xô viết.' },
  { statement: 'Trong thời kỳ quá độ, nhà nước tất yếu là chuyên chính cách mạng của giai cấp vô sản.', answer: true, explain: 'Đúng. Theo C. Mác, thời kỳ quá độ chính trị gắn liền với chuyên chính cách mạng của GCVS.' },
];

function App() {
  const [activeSection, setActiveSection] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Interactive Quiz State
  const [quizStep, setQuizStep] = useState(0); // 0: intro, 1: q1, 2: q2, 3: q3, 4: results
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // AI Assistant States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  });
  const [tempApiKey, setTempApiKey] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'model', text: import.meta.env.VITE_GEMINI_API_KEY
        ? 'Xin chào! Tôi là Trợ lý AI chuyên về Chương 3: Chủ nghĩa xã hội và thời kỳ quá độ. Hãy đặt câu hỏi hoặc chọn gợi ý nhanh bên dưới!'
        : 'Xin chào! Tôi là Trợ lý AI chuyên về Chương 3: Chủ nghĩa xã hội và thời kỳ quá độ. Hãy nhập API Key Gemini để bắt đầu.'
    }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const totalSlides = 10;
  const chatEndRef = useRef(null);

  // ── Toast & Confetti ──────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2800);
  }, []);

  const triggerConfetti = useCallback(() => {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    const colors = ['#ef233c', '#ffb703', '#10b981', '#3b82f6', '#d946ef', '#ff6b35', '#ffd21f'];
    for (let i = 0; i < 90; i++) {
      const piece = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = 10 + Math.random() * 80;
      const delay = Math.random() * 0.6;
      const duration = 1.6 + Math.random() * 1.4;
      const isRect = Math.random() > 0.45;
      piece.style.cssText = [
        'position:absolute', `left:${left}vw`, 'top:-14px', `background:${color}`,
        `animation:confettiFall ${duration}s ease-in ${delay}s forwards`,
        isRect
          ? `width:${6 + Math.floor(Math.random() * 6)}px;height:${10 + Math.floor(Math.random() * 6)}px;border-radius:2px`
          : `width:${8 + Math.floor(Math.random() * 5)}px;height:${8 + Math.floor(Math.random() * 5)}px;border-radius:50%`,
        `transform:rotate(${Math.floor(Math.random() * 360)}deg)`,
      ].join(';');
      container.appendChild(piece);
      setTimeout(() => piece.remove(), (delay + duration + 0.3) * 1000);
    }
  }, []);

  // ── Game Hub ──────────────────────────────────────────────────────────────
  const [activeGame, setActiveGame] = useState('quiz');

  // Matching game
  const [matchLeft, setMatchLeft] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [matchWrong, setMatchWrong] = useState(false);

  // Flashcard
  const [fcIndex, setFcIndex] = useState(0);
  const [fcFlipped, setFcFlipped] = useState(false);
  const [fcKnown, setFcKnown] = useState([]);
  const [fcUnknown, setFcUnknown] = useState([]);

  // True / False
  const [tfIndex, setTfIndex] = useState(0);
  const [tfScore, setTfScore] = useState(0);
  const [tfStreak, setTfStreak] = useState(0);
  const [tfTimeLeft, setTfTimeLeft] = useState(10);
  const [tfAnswered, setTfAnswered] = useState(null);
  const [tfGameStatus, setTfGameStatus] = useState('idle');

  const navItems = [
    { num: 1,  label: "Trang bìa",   icon: <Sparkles  size={13} /> },
    { num: 2,  label: "Mục tiêu",    icon: <Target    size={13} /> },
    { num: 3,  label: "Góc độ",      icon: <Eye       size={13} /> },
    { num: 4,  label: "Học thuyết",  icon: <BookMarked size={13} /> },
    { num: 5,  label: "Tất yếu",     icon: <TrendingUp size={13} /> },
    { num: 6,  label: "2 Giai đoạn", icon: <Layers    size={13} /> },
    { num: 7,  label: "Quá độ",      icon: <ArrowRight size={13} /> },
    { num: 8,  label: "2 Nghĩa",     icon: <GitBranch size={13} /> },
    { num: 9,  label: "Sơ đồ",       icon: <Network   size={13} /> },
    { num: 10, label: "Game",         icon: <Gamepad2  size={13} /> },
  ];

  const quizQuestions = [
    {
      q: "Chủ nghĩa xã hội được tiếp cận dưới góc độ khoa học xã hội từ mấy góc độ chính?",
      options: [
        "2 góc độ (phong trào thực tiễn và trào lưu tư tưởng)",
        "3 góc độ (phong trào thực tiễn, trào lưu tư tưởng và chế độ xã hội)",
        "4 góc độ (phong trào, tư tưởng, khoa học và chế độ xã hội)"
      ],
      correct: 2,
      explain: "Đáp án đúng là 4 góc độ. Bao gồm: Phong trào thực tiễn, Trào lưu tư tưởng, Khoa học (về sứ mệnh lịch sử GCCN) và Chế độ xã hội (giai đoạn đầu của hình thái kinh tế cộng sản)."
    },
    {
      q: "Hai tiền đề vật chất quan trọng nhất thúc đẩy sự thay thế tất yếu hình thái KT-XH TBCN bằng CSCN là gì?",
      options: [
        "Ý muốn chủ quan của nhân dân và sự suy sụp của nhà nước tư sản",
        "Sự phát triển của Lực lượng sản xuất và sự trưởng thành của Giai cấp công nhân",
        "Sự phát triển của khoa học công nghệ hiện đại và tinh thần tự hào dân tộc"
      ],
      correct: 1,
      explain: "Đáp án đúng là Lực lượng sản xuất xã hội hóa mâu thuẫn với quan hệ sản xuất tư nhân, kết hợp với chủ thể cách mạng là Giai cấp công nhân tự giác, lớn mạnh."
    },
    {
      q: "Nước ta (Việt Nam) đi lên chủ nghĩa xã hội thuộc trường hợp quá độ theo nghĩa nào của V.I. Lênin?",
      options: [
        "Nghĩa thứ nhất: Quá độ gián tiếp (từ nước chưa trải qua CNTB phát triển lên CNXH)",
        "Nghĩa thứ hai: Quá độ trực tiếp (từ nước đã trải qua CNTB phát triển lên CNCS)",
        "Cả hai nghĩa đều không đúng với thực tiễn Việt Nam"
      ],
      correct: 0,
      explain: "Đáp án đúng là Nghĩa thứ nhất. Việt Nam đi lên CNXH từ một nước thuộc địa nửa phong kiến, chưa trải qua CNTB phát triển, là một 'cơn đau đẻ kéo dài' cần thời kỳ quá độ lâu dài."
    }
  ];

  // Smooth scroll helper
  const scrollToSection = (num) => {
    if (num >= 1 && num <= totalSlides) {
      const element = document.getElementById(`slide-${num}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(num);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // If typing in any input element, bypass keyboard navigation to prevent typing arrows triggering slides
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToSection(activeSection + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToSection(activeSection - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToSection(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 6000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [activeSection]);

  // Monitor scroll for active section highlight and progress bar
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolled);

      const sections = navItems.map(item => document.getElementById(`slide-${item.num}`));
      const scrollPosition = window.scrollY + 150; 

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(i + 1);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiLoading]);

  // TF countdown timer
  useEffect(() => {
    if (tfGameStatus !== 'playing' || tfAnswered !== null) return;
    if (tfTimeLeft <= 0) {
      setTfAnswered('timeout');
      setTfStreak(0);
      addToast('⏰ Hết giờ! Mất lượt câu này', 'warning');
      return;
    }
    const t = setTimeout(() => setTfTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [tfGameStatus, tfTimeLeft, tfAnswered]);

  // Auto-confetti on perfect scores
  useEffect(() => {
    if (quizStep === 4 && quizScore === 3) {
      setTimeout(triggerConfetti, 350);
      addToast('🏆 Hoàn hảo! 3/3 câu chính xác!', 'streak');
    }
  }, [quizStep]);

  useEffect(() => {
    if (tfGameStatus === 'done' && tfScore >= 80) {
      setTimeout(triggerConfetti, 400);
      addToast('🏆 Xuất sắc! Điểm cao tuyệt vời!', 'streak');
    }
  }, [tfGameStatus]);

  // Ripple effect on interactive buttons
  useEffect(() => {
    const handleMouseDown = (e) => {
      const target = e.target.closest('.control-btn, .game-tab-btn, .step-node, .tf-btn, .match-card, .quick-prompt-btn');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
      target.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  // ── Game Handlers ─────────────────────────────────────────────────────────

  const handleMatchLeft = (id) => {
    if (matchedPairs.includes(id)) return;
    setMatchLeft(id);
    setMatchWrong(false);
  };

  const handleMatchRight = (id) => {
    if (!matchLeft || matchedPairs.includes(id)) return;
    if (matchLeft === id) {
      const newPairs = [...matchedPairs, id];
      setMatchedPairs(newPairs);
      setMatchLeft(null);
      setMatchWrong(false);
      if (newPairs.length === MATCHING_PAIRS.length) {
        addToast('🎉 Hoàn thành tất cả cặp ghép!', 'success');
        setTimeout(triggerConfetti, 300);
      } else {
        addToast(`✅ Ghép đúng! ${newPairs.length}/${MATCHING_PAIRS.length} cặp`, 'success');
      }
    } else {
      setMatchWrong(true);
      addToast('❌ Không khớp! Thử lại nhé', 'error');
      setTimeout(() => { setMatchLeft(null); setMatchWrong(false); }, 700);
    }
  };

  const resetMatchGame = () => { setMatchLeft(null); setMatchedPairs([]); setMatchWrong(false); };

  const handleFlipCard = () => setFcFlipped(p => !p);
  const handleFcKnown = () => { setFcKnown(p => [...p, fcIndex]); setFcFlipped(false); setFcIndex(p => p + 1); };
  const handleFcUnknown = () => { setFcUnknown(p => [...p, fcIndex]); setFcFlipped(false); setFcIndex(p => p + 1); };
  const resetFlashcards = () => { setFcIndex(0); setFcFlipped(false); setFcKnown([]); setFcUnknown([]); };

  const handleTfAnswer = (ans) => {
    if (tfAnswered !== null || tfGameStatus !== 'playing') return;
    const correct = ans === TF_QUESTIONS[tfIndex].answer;
    setTfAnswered(ans);
    if (correct) {
      const bonus = Math.ceil(tfTimeLeft / 2);
      const points = 10 + bonus;
      const newStreak = tfStreak + 1;
      setTfScore(p => p + points);
      setTfStreak(newStreak);
      if (newStreak >= 3) {
        addToast(`🔥 Chuỗi ${newStreak} câu đúng liên tiếp!`, 'streak');
      } else {
        addToast(`✅ Chính xác! +${points} điểm`, 'success');
      }
    } else {
      const willDeduct = tfScore > 0;
      setTfScore(p => Math.max(0, p - 5));
      setTfStreak(0);
      addToast(
        willDeduct ? '❌ Chưa đúng! −5 điểm' : '❌ Chưa đúng! Điểm đang ở 0, giữ nguyên',
        'error'
      );
    }
  };

  const handleTfNext = () => {
    if (tfIndex >= TF_QUESTIONS.length - 1) { setTfGameStatus('done'); return; }
    setTfIndex(p => p + 1);
    setTfAnswered(null);
    setTfTimeLeft(10);
  };

  const resetTfGame = () => { setTfIndex(0); setTfScore(0); setTfStreak(0); setTfTimeLeft(10); setTfAnswered(null); setTfGameStatus('idle'); };

  // Save API key
  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem('gemini_api_key', tempApiKey.trim());
      setApiKey(tempApiKey.trim());
      setChatMessages(prev => [
        ...prev,
        { role: 'model', text: 'Lưu API Key thành công! Tôi đã sẵn sàng kết nối. Hãy đặt câu hỏi hoặc click vào một trong những gợi ý nhanh bên dưới.' }
      ]);
    }
  };

  // Clear API key
  const handleClearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setTempApiKey('');
    setChatMessages(prev => [
      ...prev,
      { role: 'model', text: 'Đã xóa API Key. Vui lòng nhập API Key mới để có thể tiếp tục sử dụng trợ lý AI.' }
    ]);
  };

  // AI Context Provider based on Slide Number
  const getActiveSlideContext = (num) => {
    switch (num) {
      case 1: return "Trang bìa: Chương 3: Chủ nghĩa xã hội và thời kỳ quá độ lên chủ nghĩa xã hội. I. Chủ nghĩa xã hội. 1. Chủ nghĩa xã hội, giai đoạn đầu của hình thái kinh tế - xã hội cộng sản chủ nghĩa.";
      case 2: return "Mục tiêu chương: Kiến thức (nắm vững lý luận Mác - Lênin về CNXH, thời kỳ quá độ, sự vận dụng của ĐCSVN); Kỹ năng (phân tích vấn đề CNXH và con đường lên CNXH ở VN); Tư tưởng (niềm tin vào chế độ XHCN, ủng hộ đường lối đổi mới).";
      case 3: return "Các góc độ tiếp cận CNXH: 1. Phong trào thực tiễn đấu tranh của nhân dân lao động; 2. Trào lưu tư tưởng lý luận phản ánh lý tưởng giải phóng nhân dân; 3. Khoa học về sứ mệnh lịch sử của giai cấp công nhân; 4. Chế độ xã hội tốt đẹp, giai đoạn đầu của hình thái cộng sản chủ nghĩa.";
      case 4: return "Học thuyết hình thái kinh tế - xã hội: C. Mác & Ph. Ăngghen sáng lập quy luật cơ bản của vận động xã hội, cấu thành hình thái kinh tế - xã hội. V.I. Lênin phát triển và hiện thực hóa tại Nga Xô viết.";
      case 5: return "Tính tất yếu của sự thay thế hình thái KT-XH: 1. Sự phát triển của Lực lượng sản xuất (xã hội hóa mâu thuẫn quan hệ sản xuất tư nhân); 2. Sự trưởng thành của Giai cấp công nhân (lực lượng tiên phong). Thay thế là quá trình lịch sử - tự nhiên.";
      case 6: return "Hai giai đoạn của hình thái KT-XH cộng sản: Giai đoạn thấp (Chủ nghĩa xã hội): thoát thai từ TBCN, còn nhiều dấu vết của xã hội cũ. Giai đoạn cao (Chủ nghĩa cộng sản): phát triển hoàn toàn trên cơ sở của chính nó, quan hệ chín muồi.";
      case 7: return "Thời kỳ quá độ lên chủ nghĩa xã hội: Là thời kỳ cải biến cách mạng từ xã hội tư bản lên xã hội cộng sản. Đi liền với thời kỳ quá độ chính trị và chuyên chính cách mạng của giai cấp vô sản.";
      case 8: return "Hai nghĩa của thời kỳ quá độ: Nghĩa thứ nhất (gián tiếp): các nước chưa qua CNTB phát triển, là 'cơn đau đẻ kéo dài' cần thời kỳ lâu dài, gian khổ (như Việt Nam). Nghĩa thứ hai (trực tiếp): các nước đã qua CNTB phát triển cao lên thẳng CNCS.";
      case 9: return "Sơ đồ tổng quát chương học: Hình thái cộng sản chủ nghĩa chia làm: 1. Giai đoạn thấp (CNXH - thoát thai từ cũ); 2. Giai đoạn cao (CNCS - phát triển trên cơ sở mới); 3. Thời kỳ quá độ (giữa TBCN lên CSCN theo 2 nghĩa).";
      case 10: return "Trắc nghiệm ôn tập nhanh và không gian thảo luận cuối bài học.";
      default: return "";
    }
  };

  // Send message to Gemini API
  const sendChatMessage = async (textToSend) => {
    const promptText = textToSend || chatInput;
    if (!promptText.trim() || !apiKey) return;

    const userMessage = { role: 'user', text: promptText };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsAiLoading(true);

    const activeSlideText = getActiveSlideContext(activeSection);
    const systemPrompt = `Bạn là trợ lý học tập chuyên sâu về Chương 3: "Chủ nghĩa xã hội và thời kỳ quá độ lên chủ nghĩa xã hội" trong môn Chủ nghĩa xã hội khoa học, dành cho sinh viên đại học Việt Nam.

PHẠM VI: Chỉ trả lời câu hỏi thuộc Chương 3, gồm:
1. Các góc độ tiếp cận CNXH (phong trào thực tiễn, trào lưu tư tưởng, khoa học, chế độ xã hội)
2. Học thuyết hình thái kinh tế - xã hội (Mác - Ăngghen - Lênin)
3. Tính tất yếu thay thế hình thái KT-XH TBCN bằng hình thái CSCN
4. Hai giai đoạn hình thái CSCN: giai đoạn thấp (CNXH) và giai đoạn cao (CNCS)
5. Thời kỳ quá độ và hai nghĩa quá độ theo V.I. Lênin
6. Con đường đi lên CNXH ở Việt Nam

Nếu câu hỏi nằm ngoài Chương 3, từ chối lịch sự và nhắc sinh viên tập trung vào nội dung chương.
Trả lời ngắn gọn, học thuật, dễ hiểu. Liên hệ thực tiễn Việt Nam khi phù hợp.

Nội dung slide hiện tại sinh viên đang xem:
"${activeSlideText}"`;

    // Map history to Gemini format: [{ role: 'user'|'model', parts: [{ text: '...' }] }]
    const historyPayload = [
      ...chatMessages.filter(m => m.role === 'user' || m.role === 'model'),
      userMessage
    ].map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: historyPayload,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          }
        })
      });

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Không nhận được phản hồi. Vui lòng kiểm tra lại API Key hoặc cài đặt mạng.";
      
      setChatMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'model', text: "Lỗi kết nối. Không thể liên lạc được với API Google Gemini. Vui lòng thử lại sau." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleQuizOptionClick = (idx) => {
    if (quizSubmitted) return;
    setSelectedOption(idx);
    setQuizSubmitted(true);
    if (idx === quizQuestions[quizStep - 1].correct) {
      setQuizScore(prev => prev + 1);
      addToast('✅ Chính xác!', 'success');
    } else {
      addToast('❌ Chưa đúng! Xem giải thích bên dưới', 'error');
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setQuizSubmitted(false);
    setQuizStep(prev => prev + 1);
  };

  const handleRestartQuiz = () => {
    setQuizStep(1);
    setQuizScore(0);
    setSelectedOption(null);
    setQuizSubmitted(false);
  };

  return (
    <div className="presentation-container">
      <div className="vietnam-flag-silk" aria-hidden="true"></div>
      {/* Fixed background ambient lights */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      {/* Sticky top header */}
      <header className="presentation-header">
        <div className="header-left">
          <div className="header-title">Giáo trình Chủ nghĩa xã hội khoa học — Quốc gia</div>
          <div className="header-chapter">Chương 3: Chủ nghĩa xã hội & Thời kỳ quá độ</div>
        </div>

        {/* Expanding capsule navigation */}
        <nav className="capsule-nav">
          {navItems.map((item) => (
            <button
              key={item.num}
              className={`capsule-item ${activeSection === item.num ? 'active' : activeSection > item.num ? 'done' : ''}`}
              onClick={() => scrollToSection(item.num)}
              title={item.label}
            >
              {item.icon}
              <span className="capsule-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Top edge reading progress bar */}
        <div 
          className="reading-progress-bar" 
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </header>

      {/* Main content body stacked vertically */}
      <main className="presentation-body">
        {navItems.map(item => (
          <section 
            key={item.num} 
            id={`slide-${item.num}`} 
            className="slide-section"
          >
            <div className="slide-content">
              {renderSlideSection(item.num, {
                quizStep, setQuizStep, quizQuestions, selectedOption, handleQuizOptionClick,
                quizSubmitted, handleNextQuiz, quizScore, handleRestartQuiz,
                activeGame, setActiveGame,
                matchLeft, matchedPairs, matchWrong, handleMatchLeft, handleMatchRight, resetMatchGame,
                fcIndex, fcFlipped, fcKnown, fcUnknown, handleFlipCard, handleFcKnown, handleFcUnknown, resetFlashcards,
                tfIndex, tfScore, tfStreak, tfTimeLeft, tfAnswered, tfGameStatus,
                setTfGameStatus, handleTfAnswer, handleTfNext, resetTfGame,
              })}
            </div>
          </section>
        ))}
      </main>

      {/* Keyboard Controls Hint */}
      <div className={`keyboard-hint ${showHint ? 'visible' : ''}`}>
        <Info size={14} />
        Dùng phím <span className="key-tag">↑</span> <span className="key-tag">↓</span> hoặc cuộn trang để di chuyển
      </div>

      {/* Floating AI Study Assistant Bubble */}
      <button 
        className="ai-chat-bubble"
        onClick={() => setIsChatOpen(!isChatOpen)}
        title="Trợ lý học tập AI"
      >
        <Sparkles size={20} />
      </button>

      {/* AI Chat Drawer Sidebar */}
      <div className={`ai-chat-drawer ${isChatOpen ? 'open' : ''}`}>
        <div className="ai-chat-header">
          <h3><Sparkles size={16} style={{ color: '#d946ef' }} /> Trợ lý học tập AI</h3>
          <button className="close-btn" onClick={() => setIsChatOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="chat-body">
          {/* API Key Setup block if not loaded */}
          

          {/* Chat Messages */}
          <div className="chat-message-list">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.role}`}>
                {msg.text}
              </div>
            ))}

            {isAiLoading && (
              <div className="ai-loading-bubble">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick suggestions - Chương 3 focused */}
          {apiKey && (
            <div className="quick-prompts">
              <button
                className="quick-prompt-btn"
                onClick={() => sendChatMessage("Hãy giải thích ý nghĩa cốt lõi của nội dung slide này trong Chương 3 và tại sao nó quan trọng.")}
              >
                💡 Giải thích slide này
              </button>
              <button
                className="quick-prompt-btn"
                onClick={() => sendChatMessage("Đặt một câu hỏi thi hoặc thảo luận hay về nội dung Chương 3 đang học ở slide này.")}
              >
                📋 Câu hỏi ôn thi
              </button>
              <button
                className="quick-prompt-btn"
                onClick={() => sendChatMessage("Liên hệ nội dung Chương 3 này với thực tiễn công cuộc xây dựng CNXH ở Việt Nam hiện nay.")}
              >
                🇻🇳 Liên hệ Việt Nam
              </button>
              
            </div>
          )}
        </div>

        {/* Chat input footer */}
        <div className="chat-footer">
          <form 
            className="chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              sendChatMessage();
            }}
          >
            <input 
              type="text" 
              placeholder={apiKey ? "Nhập câu hỏi triết học..." : "Vui lòng nhập API Key..."} 
              className="chat-text-input"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={!apiKey || isAiLoading}
            />
            <button 
              type="submit" 
              className="chat-send-btn"
              disabled={!apiKey || !chatInput.trim() || isAiLoading}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Mini-map dot-rail sidebar */}
      <div className="minimap-sidebar">
        <div className="minimap-rail">
          {navItems.map(item => (
            <button
              key={item.num}
              className={`minimap-dot-btn ${activeSection === item.num ? 'active' : activeSection > item.num ? 'done' : ''}`}
              onClick={() => scrollToSection(item.num)}
              title={item.label}
            >
              <span className="minimap-dot" />
            </button>
          ))}
        </div>
        <div className="minimap-labels">
          {navItems.map(item => (
            <button
              key={item.num}
              className={`minimap-label-item ${activeSection === item.num ? 'active' : activeSection > item.num ? 'done' : ''}`}
              onClick={() => scrollToSection(item.num)}
            >
              <span className="minimap-label-num">{item.num}</span>
              <span className="minimap-label-text">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Confetti container */}
      <div id="confetti-container" className="confetti-container" aria-hidden="true" />

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>

      {/* Floating Info & Control Panel */}
      <div className="floating-info-panel">
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700' }}>
          Đoạn {activeSection} / {totalSlides}
        </span>
        <button 
          className="floating-btn" 
          onClick={() => scrollToSection(1)} 
          title="Lên đầu trang"
        >
          <ArrowUp size={16} />
        </button>
        <button 
          className="floating-btn" 
          onClick={toggleFullscreen} 
          title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </div>
  );
}

// Function to render slide sections vertically
function renderSlideSection(slideNum, quizProps) {
  // Mnemonic formulas
  const mnemonics = {
    2: { formula: "Công thức 3K/T", text: "Để học tốt cần đạt: <em>Kiến thức</em> (lý luận) ➔ <em>Kỹ năng</em> (phân tích) ➔ <em>Tư tưởng</em> (niềm tin chế độ)." },
    3: { formula: "Góc nhớ nhanh 4 chữ P-T-K-C", text: "CNXH có 4 góc độ: <em>P</em>hong trào đấu tranh ➔ <em>T</em>rào lưu lý luận ➔ <em>K</em>hoa học sứ mệnh GCCN ➔ <em>C</em>hế độ xã hội mới." },
    4: { formula: "Quy luật cốt lõi M-Ă-L", text: "Học thuyết hình thái KT-XH vạch rõ quy luật vận động xã hội: <em>M</em>ác & <em>Ă</em>ngghen sáng lập ➔ <em>L</em>ênin hiện thực hóa." },
    5: { formula: "Phương trình tất yếu", text: "Thay thế tất yếu = <em>Lực lượng sản xuất xã hội hóa</em> (vật chất) + <em>Giai cấp công nhân lớn mạnh</em> (chủ thể)." },
    6: { formula: "Mẹo so sánh 2 giai đoạn", text: "Giai đoạn thấp (CNXH): vừa <em>thoát thai</em> từ cũ, còn dấu vết cũ. Giai đoạn cao (CNCS): phát triển hoàn toàn trên <em>cơ sở của chính nó</em>." },
    7: { formula: "Từ khóa chuyên chính", text: "Thời kỳ quá độ là <em>cải biến cách mạng</em> lâu dài ➔ Nhà nước bắt buộc là <em>chuyên chính cách mạng của giai cấp vô sản</em>." },
    8: { formula: "Ẩn dụ cơn đau đẻ", text: "Quá độ gián tiếp (chưa qua CNTB) = <em>'Cơn đau đẻ kéo dài'</em>. Cần chặng đường quá độ lâu dài, gian khổ với nhiều bước trung gian." },
    9: { formula: "Tóm tắt 1-2-1", text: "Chốt kiến thức: <em>1</em> Hình thái kinh tế cộng sản ➔ chia làm <em>2</em> Giai đoạn (Thấp & Cao) ➔ đi qua <em>1</em> Thời kỳ quá độ (hiểu theo 2 nghĩa)." }
  };

  const currentMnemonic = mnemonics[slideNum];

  const getSlideContent = () => {
    switch (slideNum) {
      case 1:
        return (
          <div className="cover-slide">
            <span className="cover-badge">
              <Sparkles size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> THUYẾT TRÌNH BÀI GIẢNG SÁNG TẠO
            </span>
            <h1 className="cover-title">CHƯƠNG 3: CHỦ NGHĨA XÃ HỘI VÀ THỜI KỲ QUÁ ĐỘ LÊN CHỦ NGHĨA XÃ HỘI</h1>
            <h2 className="cover-subtitle">I. CHỦ NGHĨA XÃ HỘI</h2>
            <div style={{ fontSize: '1.1rem', color: 'var(--accent)', fontWeight: '600', marginBottom: '24px' }}>
              1. Chủ nghĩa xã hội, giai đoạn đầu của hình thái kinh tế - xã hội cộng sản chủ nghĩa
            </div>
            <div className="cover-info">
              <span>(Nguồn: Giáo trình Chủ nghĩa xã hội khoa học — Quốc gia, Chương 3, tr.86-89)</span>
            </div>
            <div className="cover-image-panel">
              <img src={bacHoMacLeninImage} alt="Bác Hồ, Mác, Lênin và biểu tượng búa liềm trên nền cờ đỏ" />
            </div>
          </div>
        );
      
      case 2:
        return (
          <>
            <div className="slide-title-area">
              <div className="slide-subtitle">GIỚI THIỆU CHUNG</div>
              <h2 className="slide-title">Mục tiêu của Chương</h2>
            </div>
            <div className="slide-body">
              <div className="objectives-grid">
                <div className="objective-card">
                  <div className="objective-icon">
                    <BookOpen size={22} />
                  </div>
                  <h3 className="objective-title">Về kiến thức</h3>
                  <p className="objective-desc">
                    Sinh viên nắm được kiến thức cơ bản những quan điểm của chủ nghĩa Mác - Lênin về chủ nghĩa xã hội, thời kỳ quá độ lên chủ nghĩa xã hội và sự vận dụng sáng tạo của Đảng Cộng sản Việt Nam vào điều kiện cụ thể Việt Nam.
                  </p>
                </div>

                <div className="objective-card">
                  <div className="objective-icon">
                    <Award size={22} />
                  </div>
                  <h3 className="objective-title">Về kỹ năng</h3>
                  <p className="objective-desc">
                    Biết vận dụng những tri thức đã học vào phân tích những vấn đề cơ bản về chủ nghĩa xã hội và con đường đi lên chủ nghĩa xã hội ở Việt Nam hiện nay.
                  </p>
                </div>

                <div className="objective-card">
                  <div className="objective-icon">
                    <ShieldAlert size={22} />
                  </div>
                  <h3 className="objective-title">Về tư tưởng</h3>
                  <p className="objective-desc">
                    Có niềm tin vào chế độ xã hội chủ nghĩa, luôn tin và ủng hộ đường lối đổi mới theo định hướng xã hội chủ nghĩa dưới sự lãnh đạo của Đảng Cộng sản Việt Nam.
                  </p>
                </div>
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div className="slide-title-area">
              <div className="slide-subtitle">GÓC NHÌN ĐA CHIỀU</div>
              <h2 className="slide-title">Các góc độ tiếp cận Chủ nghĩa xã hội</h2>
            </div>
            <div className="slide-body slide-split-layout">
              <div className="angles-grid slide-split-text">
                <div className="angle-card">
                  <div className="angle-num">01</div>
                  <h3 className="angle-title">Phong trào thực tiễn</h3>
                  <p className="angle-desc">
                    Phong trào đấu tranh của nhân dân lao động chống lại áp bức, bất công, chống các giai cấp thống trị.
                  </p>
                </div>

                <div className="angle-card">
                  <div className="angle-num">02</div>
                  <h3 className="angle-title">Trào lưu tư tưởng</h3>
                  <p className="angle-desc">
                    Trào lưu tư tưởng, lý luận phản ánh lý tưởng giải phóng nhân dân lao động khỏi áp bức, bóc lột, bất công.
                  </p>
                </div>

                <div className="angle-card">
                  <div className="angle-num">03</div>
                  <h3 className="angle-title">Khoa học</h3>
                  <p className="angle-desc">
                    Chủ nghĩa xã hội khoa học là khoa học về sứ mệnh lịch sử của giai cấp công nhân.
                  </p>
                </div>

                <div className="angle-card">
                  <div className="angle-num">04</div>
                  <h3 className="angle-title">Chế độ xã hội</h3>
                  <p className="angle-desc">
                    Một chế độ xã hội tốt đẹp, giai đoạn đầu của hình thái kinh tế - xã hội cộng sản chủ nghĩa.
                  </p>
                </div>
              </div>
              <div className="slide-split-img">
                <img src="/images/slide3.png" alt="Các góc độ Chủ nghĩa xã hội" />
              </div>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <div className="slide-title-area">
              <div className="slide-subtitle">CƠ SỞ LÝ LUẬN KHOA HỌC</div>
              <h2 className="slide-title">Học thuyết hình thái kinh tế - xã hội</h2>
            </div>
            <div className="slide-body">
              <div className="slide-banner-img">
                <img src="/images/slide4.png" alt="C. Mác, Ph. Ăngghen, V.I. Lênin" />
              </div>
              <div className="theory-layout">
                <div className="theory-author-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <Users size={20} className="bullet-icon" />
                    <span className="author-title">C. Mác & Ph. Ăngghen</span>
                  </div>
                  <p className="author-detail">
                    <strong>Người sáng lập:</strong> Hai nhà triết học lỗi lạc vĩ đại đã nghiên cứu sâu sắc lịch sử phát triển của xã hội loài người, đặc biệt là xã hội tư bản, để xây dựng nên học thuyết khoa học này.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', marginBottom: '10px' }}>
                    <TrendingUp size={20} className="bullet-icon" style={{ color: 'var(--accent)' }} />
                    <span className="author-title" style={{ color: 'var(--accent)' }}>V.I. Lênin</span>
                  </div>
                  <p className="author-detail">
                    <strong>Phát triển & Hiện thực hóa:</strong> Được V.I. Lênin bổ sung, phát triển và áp dụng trực tiếp vào công cuộc xây dựng chủ nghĩa xã hội ở nước Nga Xôviết sau Cách mạng Tháng Mười.
                  </p>
                </div>

                <div className="theory-bullets">
                  <div className="bullet-item">
                    <BookMarked className="bullet-icon" size={18} />
                    <div className="bullet-text">
                      Vạch rõ những <strong>quy luật cơ bản của vận động xã hội</strong>, chỉ ra phương pháp khoa học để giải thích tiến trình lịch sử loài người.
                    </div>
                  </div>

                  <div className="bullet-item">
                    <Cpu className="bullet-icon" size={18} />
                    <div className="bullet-text">
                      Làm rõ các <strong>yếu tố cấu thành</strong> hình thái kinh tế - xã hội (lực lượng sản xuất, quan hệ sản xuất, kiến trúc thượng tầng).
                    </div>
                  </div>

                  <div className="bullet-item">
                    <Layers className="bullet-icon" size={18} />
                    <div className="bullet-text">
                      Xem xét xã hội trong quá trình <strong>biến đổi và phát triển không ngừng</strong> như một cơ thể sống vận động liên tục.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 5:
        return (
          <>
            <div className="slide-title-area">
              <div className="slide-subtitle">SỰ VẬN ĐỘNG TẤT YẾU</div>
              <h2 className="slide-title">Tính tất yếu của sự thay thế hình thái KT-XH</h2>
            </div>
            <div className="slide-body">
              <div className="slide-banner-img">
                <img src="/images/slide5.png" alt="Lực lượng sản xuất và Quan hệ sản xuất" />
              </div>
              <div className="inevitability-grid">
                <div className="inevitability-card">
                  <div className="inevitability-header">
                    <div className="objective-icon" style={{ width: '36px', height: '36px', margin: 0 }}>
                      <Cpu size={18} />
                    </div>
                    <h3>1. Sự phát triển của Lực lượng sản xuất</h3>
                  </div>
                  <p>
                    Sự phát triển mạnh mẽ của lực lượng sản xuất xã hội hóa ngày càng mâu thuẫn gay gắt với quan hệ sản xuất tư nhân tư bản chủ nghĩa, đòi hỏi phải thiết lập một quan hệ sản xuất mới phù hợp hơn.
                  </p>
                </div>

                <div className="inevitability-card">
                  <div className="inevitability-header">
                    <div className="objective-icon" style={{ width: '36px', height: '36px', margin: 0, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                      <Users size={18} />
                    </div>
                    <h3>2. Sự trưởng thành của Giai cấp công nhân</h3>
                  </div>
                  <p>
                    Sự lớn mạnh về số lượng, trình độ và tinh thần tự giác của giai cấp công nhân - lực lượng xã hội tiên phong, hiện đại, có sứ mệnh lịch sử lật đổ CNTB và xây dựng chủ nghĩa xã hội.
                  </p>
                </div>
              </div>

              <div className="inevitability-callout">
                <p>
                  💡 Luận điểm cốt lõi: Sự thay thế hình thái KT-XH tư bản chủ nghĩa bằng hình thái KT-XH cộng sản chủ nghĩa là một quá trình lịch sử - tự nhiên (không phụ thuộc vào ý muốn chủ quan).
                </p>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  Học thuyết cung cấp tiêu chuẩn thực sự duy vật, khoa học cho sự phân kỳ lịch sử loài người.
                </div>
              </div>
            </div>
          </>
        );

      case 6:
        return (
          <>
            <div className="slide-title-area">
              <div className="slide-subtitle">PHÂN KỲ LỊCH SỬ</div>
              <h2 className="slide-title">Hai giai đoạn của hình thái KT-XH cộng sản chủ nghĩa</h2>
            </div>
            <div className="slide-body">
              <div className="comparison-table-wrapper">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Tiêu chí</th>
                      <th>Giai đoạn thấp</th>
                      <th>Giai đoạn cao</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="highlight-cell">Tên gọi</td>
                      <td>Chủ nghĩa xã hội (CNXH)</td>
                      <td>Chủ nghĩa cộng sản (CNCS)</td>
                    </tr>
                    <tr>
                      <td className="highlight-cell">Vị trí</td>
                      <td>
                        <span className="tag-cell tag-low">Giai đoạn đầu</span>
                      </td>
                      <td>
                        <span className="tag-cell tag-high">Giai đoạn phát triển hoàn thiện</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="highlight-cell">Đặc điểm cơ bản</td>
                      <td>
                        Xã hội vừa <strong>"thoát thai"</strong> từ xã hội TBCN, do đó còn mang nhiều dấu vết của xã hội cũ về mọi phương diện (kinh tế, đạo đức, tinh thần).
                      </td>
                      <td>
                        Xã hội đã phát triển hoàn toàn trên <strong>cơ sở của chính nó</strong>, các quan hệ xã hội đạt đến độ chín muồi và hoàn thiện nhất.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--accent)', fontWeight: '600', textAlign: 'center' }}>
                → Hình thái kinh tế - xã hội cộng sản chủ nghĩa phát triển từ thấp lên cao qua hai giai đoạn này.
              </div>
            </div>
          </>
        );

      case 7:
        return (
          <>
            <div className="slide-title-area">
              <div className="slide-subtitle">QUAN ĐIỂM CỦA CÁC KINH ĐIỂN CHỦ NGHĨA MÁC-LÊNIN</div>
              <h2 className="slide-title">Thời kỳ quá độ lên Chủ nghĩa xã hội</h2>
            </div>
            <div className="slide-body">
              <div className="slide-banner-img">
                <img src="/images/slide7.png" alt="Thời kỳ quá độ" />
              </div>
              <div className="quote-layout">
                <div className="quote-card">
                  <p className="quote-text">
                    "Giữa xã hội tư bản chủ nghĩa và xã hội cộng sản chủ nghĩa là một thời kỳ cải biến cách mạng từ xã hội nọ sang xã hội kia. Thích ứng với thời kỳ ấy là một thời kỳ quá độ chính trị, và nhà nước của thời kỳ ấy không thể là cái gì khác hơn là nền chuyên chính cách mạng của giai cấp vô sản."
                  </p>
                  <div className="quote-author">— C. Mác (Phê phán cương lĩnh Gôta, 1875)</div>
                  <div className="citation-detail">(C. Mác và Ph. Ăngghen: Toàn tập, Sdd, t.19, tr.47)</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="quote-card" style={{ padding: '16px 20px' }}>
                    <p className="quote-text" style={{ fontSize: '0.95rem', marginBottom: '6px' }}>
                      "Giữa chủ nghĩa tư bản và chủ nghĩa cộng sản, có một thời kỳ quá độ nhất định."
                    </p>
                    <div className="quote-author" style={{ fontSize: '0.75rem' }}>— V.I. Lênin</div>
                    <div className="citation-detail" style={{ fontSize: '0.7rem' }}>(V.I. Lênin: Toàn tập, Sdd, t.39, tr.309)</div>
                  </div>

                  <div className="quote-card" style={{ padding: '16px 20px' }}>
                    <p className="quote-text" style={{ fontSize: '0.95rem', marginBottom: '6px' }}>
                      "Xã hội cộng sản chủ nghĩa vừa thoát thai từ xã hội tư bản chủ nghĩa, về mọi phương diện — kinh tế, đạo đức, tinh thần — còn mang những dấu vết của xã hội cũ..."
                    </p>
                    <div className="quote-author" style={{ fontSize: '0.75rem' }}>— C. Mác</div>
                    <div className="citation-detail" style={{ fontSize: '0.7rem' }}>(C. Mác và Ph. Ăngghen: Toàn tập, Sdd, t.19, tr.33)</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 8:
        return (
          <>
            <div className="slide-title-area">
              <div className="slide-subtitle">SƠ ĐỒ LỘ TRÌNH KHÁI NIỆM</div>
              <h2 className="slide-title">Hai nghĩa của thời kỳ quá độ</h2>
            </div>
            <div className="slide-body">
              <div className="roadmap-flow">
                <div className="flow-step">
                  <div className="flow-header">Nghĩa thứ nhất (Quá độ gián tiếp)</div>
                  <div className="flow-body">
                    <div> <strong>Đối tượng:</strong> Các nước chưa trải qua chủ nghĩa tư bản phát triển (vd: Việt Nam, Nga Xô viết).</div>
                    <div> <strong>Đặc điểm:</strong> Cần thời kỳ quá độ khá lâu dài và gian khổ — ví như những <em>\"cơn đau đẻ kéo dài\"</em>.</div>
                    <div> <strong>Bước đi:</strong> Chủ nghĩa tư bản ➔ <strong>Chủ nghĩa xã hội</strong>.</div>
                  </div>
                </div>

                <div className="flow-arrow-conn">
                  <ArrowRight size={22} style={{ opacity: 0.5 }} />
                </div>

                <div className="flow-step" style={{ borderLeftColor: 'var(--primary-light)' }}>
                  <div className="flow-header" style={{ color: 'var(--primary-light)' }}>Nghĩa thứ hai (Quá độ trực tiếp)</div>
                  <div className="flow-body">
                    <div> <strong>Đối tượng:</strong> Các nước đã trải qua chủ nghĩa tư bản phát triển cao (như các nước Tây Âu).</div>
                    <div> <strong>Đặc điểm:</strong> Cải biến cách mạng từ xã hội cũ sang xã hội mới, trực tiếp và diễn ra có lộ trình ngắn hơn.</div>
                    <div> <strong>Bước đi:</strong> Chủ nghĩa tư bản ➔ <strong>Chủ nghĩa cộng sản</strong>.</div>
                  </div>
                </div>
              </div>

              <div className="inevitability-callout" style={{ marginTop: '16px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <QuoteIcon size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <div>
                  <span style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>
                    \"Đối với những nước chưa có CNTB phát triển cao, cần phải có một thời kỳ quá độ khá lâu dài từ CNTB lên CNXH.\"
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '10px' }}>
                    — V.I. Lênin (V.I. Lênin: Toàn tập, Sdd, t.38, tr.464)
                  </span>
                </div>
              </div>
            </div>
          </>
        );

      case 9:
        return (
          <>
            <div className="slide-title-area">
              <div className="slide-subtitle">TỔNG KẾT HỆ THỐNG</div>
              <h2 className="slide-title">Sơ đồ tổng quát chương học</h2>
            </div>
            <div className="slide-body">
              <div className="diagram-container">
                <div className="diagram-root">
                  HÌNH THÁI KINH TẾ - XÃ HỘI CỘNG SẢN CHỦ NGHĨA
                </div>

                <div className="diagram-branch-line"></div>
                <div className="diagram-branch-vertical left"></div>
                <div className="diagram-branch-vertical middle"></div>
                <div className="diagram-branch-vertical right"></div>

                <div className="diagram-branches">
                  <div className="diagram-card">
                    <div className="diagram-card-title">Giai đoạn THẤP</div>
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                      CHỦ NGHĨA XÃ HỘI (CNXH)
                    </div>
                    <div className="diagram-card-desc">
                      Xã hội vừa thoát thai từ chủ nghĩa tư bản, còn mang nhiều dấu vết của xã hội cũ.
                    </div>
                  </div>

                  <div className="diagram-card">
                    <div className="diagram-card-title" style={{ color: '#10b981' }}>Giai đoạn CAO</div>
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                      CHỦ NGHĨA CỘNG SẢN (CNCS)
                    </div>
                    <div className="diagram-card-desc">
                      Xã hội phát triển hoàn chỉnh, hoàn thiện hoàn toàn trên cơ sở của chính nó.
                    </div>
                  </div>

                  <div className="diagram-card">
                    <div className="diagram-card-title" style={{ color: 'var(--primary-light)' }}>THỜI KỲ QUÁ ĐỘ</div>
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      Giữa XHTBCN → XHCSCN
                    </div>
                    <div className="diagram-sub-branch">
                      <div className="diagram-sub-item">
                        <div>📌</div>
                        <div><strong>Nghĩa 1:</strong> Nước chưa qua CNTB → Quá độ lâu dài lên CNXH.</div>
                      </div>
                      <div className="diagram-sub-item">
                        <div>📌</div>
                        <div><strong>Nghĩa 2:</strong> Nước đã qua CNTB → Quá độ nhất định lên CNCS.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 10: {
        const {
          quizStep, setQuizStep, quizQuestions, selectedOption, handleQuizOptionClick,
          quizSubmitted, handleNextQuiz, quizScore, handleRestartQuiz,
          activeGame, setActiveGame,
          matchLeft, matchedPairs, matchWrong, handleMatchLeft, handleMatchRight, resetMatchGame,
          fcIndex, fcFlipped, fcKnown, fcUnknown, handleFlipCard, handleFcKnown, handleFcUnknown, resetFlashcards,
          tfIndex, tfScore, tfStreak, tfTimeLeft, tfAnswered, tfGameStatus,
          setTfGameStatus, handleTfAnswer, handleTfNext, resetTfGame,
        } = quizProps;

        const gameTabs = [
          { id: 'quiz', label: '📝 Trắc nghiệm' },
          { id: 'match', label: '🔗 Ghép đôi' },
          { id: 'flash', label: '🃏 Thẻ nhớ' },
          { id: 'tf',    label: '⚡ Đúng / Sai' },
        ];

        return (
          <>
            <div className="slide-title-area">
              <div className="slide-subtitle">TRÒ CHƠI TƯƠNG TÁC LỚP HỌC</div>
              <h2 className="slide-title">Kho trò chơi ôn tập Chương 3</h2>
            </div>
            <div className="slide-body" style={{ justifyContent: 'flex-start', marginTop: '10px' }}>

              {/* ── Tab switcher ── */}
              <div className="game-tabs">
                {gameTabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`game-tab-btn ${activeGame === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveGame(tab.id)}
                  >{tab.label}</button>
                ))}
              </div>

              {/* ── Quiz tab ── */}
              {activeGame === 'quiz' && (
                <div className="quiz-container">
                  {quizStep === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 10px' }}>
                      <div className="objective-icon" style={{ margin: '0 auto 20px', width: '50px', height: '50px' }}>
                        <QuizIcon size={26} />
                      </div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px' }}>Trắc nghiệm cùng cả lớp</h3>
                      <p style={{ color: '#6f3d42', fontSize: '0.9rem', margin: '0 auto 24px', maxWidth: '560px' }}>
                        3 câu hỏi kiểm tra mức độ hiểu bài trước khi thảo luận sâu hơn.
                      </p>
                      <button className="control-btn primary-btn" style={{ margin: '0 auto' }} onClick={() => setQuizStep(1)}>
                        Bắt đầu <ArrowRight size={16} />
                      </button>
                    </div>
                  ) : quizStep <= 3 ? (
                    <div>
                      <div className="quiz-status">
                        <span>Câu {quizStep} / 3</span>
                        <span>Điểm: {quizScore} / {quizStep - 1}</span>
                      </div>
                      <div className="quiz-question-box" style={{ marginTop: '8px' }}>
                        <div className="quiz-question">{quizQuestions[quizStep - 1].q}</div>
                        <div className="quiz-options">
                          {quizQuestions[quizStep - 1].options.map((opt, idx) => {
                            const isCorrect = idx === quizQuestions[quizStep - 1].correct;
                            const isSelected = idx === selectedOption;
                            let optionClass = '';
                            if (quizSubmitted) {
                              if (isSelected) optionClass = isCorrect ? 'correct selected' : 'incorrect selected';
                              else if (isCorrect) optionClass = 'correct';
                            }
                            return (
                              <div key={idx} className={`quiz-option ${optionClass}`} onClick={() => handleQuizOptionClick(idx)}>
                                <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                                {quizSubmitted && isCorrect && <CheckCircle2 size={16} style={{ color: '#10b981' }} />}
                                {quizSubmitted && isSelected && !isCorrect && <XCircle size={16} style={{ color: '#ef4444' }} />}
                              </div>
                            );
                          })}
                        </div>
                        {quizSubmitted && (
                          <div className="quiz-explanation">
                            <strong>💡 Giải thích: </strong>{quizQuestions[quizStep - 1].explain}
                          </div>
                        )}
                      </div>
                      {quizSubmitted && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                          <button className="control-btn primary-btn" onClick={quizStep === 3 ? () => setQuizStep(4) : handleNextQuiz}>
                            {quizStep === 3 ? 'Xem kết quả' : 'Câu tiếp'} <ArrowRight size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '24px 10px' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#b10f1d', marginBottom: '10px' }}>Tổng kết</h3>
                      <div style={{ fontSize: '2.4rem', fontWeight: '900', margin: '12px 0', color: quizScore >= 2 ? '#10b981' : '#f59e0b' }}>
                        {quizScore} / 3
                      </div>
                      <p style={{ color: '#6f3d42', marginBottom: '20px' }}>
                        {quizScore === 3 ? '🎉 Tuyệt vời! Nắm bài rất sâu sắc.' : quizScore === 2 ? '👍 Khá tốt! Đã nắm được luận điểm cốt lõi.' : '📚 Cần ôn lại các slide lý luận nhé!'}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                        <button className="control-btn" onClick={handleRestartQuiz}><RotateCcw size={16} /> Chơi lại</button>
                        <button className="control-btn primary-btn" onClick={() => setQuizStep(0)}>Về giới thiệu</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Matching tab ── */}
              {activeGame === 'match' && (
                <div className="match-container">
                  <div className="match-header">
                    <span>Chọn khái niệm ở trái → chọn định nghĩa ở phải để ghép đôi</span>
                    <span className="match-score">{matchedPairs.length} / {MATCHING_PAIRS.length} ✓</span>
                  </div>
                  {matchedPairs.length === MATCHING_PAIRS.length ? (
                    <div style={{ textAlign: 'center', padding: '28px 0' }}>
                      <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>🎉</div>
                      <h3 style={{ fontWeight: '800', color: '#b10f1d', marginBottom: '16px' }}>Hoàn thành tất cả {MATCHING_PAIRS.length} cặp!</h3>
                      <button className="control-btn primary-btn" onClick={resetMatchGame}><RotateCcw size={16} /> Chơi lại</button>
                    </div>
                  ) : (
                    <div className="match-grid">
                      <div className="match-col">
                        {MATCHING_PAIRS.map(pair => (
                          <div
                            key={pair.id}
                            className={`match-card match-left ${matchLeft === pair.id ? 'selected' : ''} ${matchedPairs.includes(pair.id) ? 'matched' : ''} ${matchWrong && matchLeft === pair.id ? 'wrong' : ''}`}
                            onClick={() => handleMatchLeft(pair.id)}
                          >{pair.term}</div>
                        ))}
                      </div>
                      <div className="match-col">
                        {MATCHING_RIGHT_ORDER.map(id => {
                          const pair = MATCHING_PAIRS.find(p => p.id === id);
                          return (
                            <div
                              key={pair.id}
                              className={`match-card match-right ${matchedPairs.includes(pair.id) ? 'matched' : ''}`}
                              onClick={() => handleMatchRight(pair.id)}
                            >{pair.def}</div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Flashcard tab ── */}
              {activeGame === 'flash' && (
                <div className="flash-container">
                  <div className="flash-progress-row">
                    <span>Thẻ {Math.min(fcIndex + 1, FLASHCARDS.length)} / {FLASHCARDS.length}</span>
                    <span>✅ {fcKnown.length} nhớ rồi &nbsp;|&nbsp; 🔄 {fcUnknown.length} xem lại</span>
                  </div>
                  {fcIndex >= FLASHCARDS.length ? (
                    <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🃏</div>
                      <h3 style={{ fontWeight: '800', marginBottom: '8px' }}>Xong {FLASHCARDS.length} thẻ!</h3>
                      <p style={{ color: '#6f3d42', marginBottom: '20px' }}>
                        Nhớ: <strong>{fcKnown.length}</strong> &nbsp;|&nbsp; Cần ôn: <strong>{fcUnknown.length}</strong>
                      </p>
                      <button className="control-btn primary-btn" onClick={resetFlashcards}><RotateCcw size={16} /> Ôn lại từ đầu</button>
                    </div>
                  ) : (
                    <>
                      <div className={`flashcard ${fcFlipped ? 'flipped' : ''}`} onClick={handleFlipCard}>
                        <div className="flashcard-inner">
                          <div className="flashcard-front">
                            <div className="fc-label">Thuật ngữ / Câu hỏi</div>
                            <div className="fc-term">{FLASHCARDS[fcIndex].term}</div>
                            <div className="fc-hint">Click để xem định nghĩa ↓</div>
                          </div>
                          <div className="flashcard-back">
                            <div className="fc-label">Định nghĩa / Trả lời</div>
                            <div className="fc-def">{FLASHCARDS[fcIndex].def}</div>
                          </div>
                        </div>
                      </div>
                      {fcFlipped && (
                        <div className="fc-actions">
                          <button className="control-btn fc-unknown-btn" onClick={handleFcUnknown}>🔄 Xem lại</button>
                          <button className="control-btn primary-btn" onClick={handleFcKnown}>✅ Nhớ rồi</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ── True/False tab ── */}
              {activeGame === 'tf' && (
                <div className="tf-container">
                  {tfGameStatus === 'idle' && (
                    <div style={{ textAlign: 'center', padding: '28px 10px' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚡</div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>Đúng hay Sai?</h3>
                      <p style={{ color: '#6f3d42', fontSize: '0.88rem', marginBottom: '22px', maxWidth: '480px', margin: '0 auto 22px' }}>
                        {TF_QUESTIONS.length} phát biểu — Mỗi câu 10 giây<br/>
                        +10 nếu đúng (thưởng thêm nếu nhanh) &nbsp;|&nbsp; -5 nếu sai
                      </p>
                      <button className="control-btn primary-btn" onClick={() => setTfGameStatus('playing')}>
                        Bắt đầu <ArrowRight size={16} />
                      </button>
                    </div>
                  )}

                  {tfGameStatus === 'playing' && (
                    <>
                      <div className="tf-header">
                        <div className="tf-stats">
                          <span>🏆 {tfScore} điểm</span>
                          <span>Câu {tfIndex + 1} / {TF_QUESTIONS.length}</span>
                          {tfStreak >= 2 && <span>🔥 ×{tfStreak} streak</span>}
                        </div>
                        <div className="tf-timer-bar">
                          <div className={`tf-timer-fill ${tfTimeLeft <= 3 ? 'urgent' : ''}`} style={{ width: `${(tfTimeLeft / 10) * 100}%` }}></div>
                        </div>
                        <div className={`tf-time-label ${tfTimeLeft <= 3 ? 'urgent' : ''}`}>⏱ {tfTimeLeft}s</div>
                      </div>
                      <div className="tf-question-box">
                        <div className="tf-question">{TF_QUESTIONS[tfIndex].statement}</div>
                      </div>
                      {tfAnswered === null ? (
                        <div className="tf-buttons">
                          <button className="tf-btn tf-true" onClick={() => handleTfAnswer(true)}>✅ ĐÚNG</button>
                          <button className="tf-btn tf-false" onClick={() => handleTfAnswer(false)}>❌ SAI</button>
                        </div>
                      ) : (
                        <div className="tf-result">
                          <div className={`tf-result-badge ${tfAnswered === 'timeout' ? 'timeout' : tfAnswered === TF_QUESTIONS[tfIndex].answer ? 'correct' : 'incorrect'}`}>
                            {tfAnswered === 'timeout' ? '⏰ Hết giờ!' : tfAnswered === TF_QUESTIONS[tfIndex].answer ? '✅ Chính xác!' : '❌ Chưa đúng'}
                          </div>
                          <div className="tf-explain">{TF_QUESTIONS[tfIndex].explain}</div>
                          <button className="control-btn primary-btn" onClick={handleTfNext} style={{ marginTop: '14px' }}>
                            {tfIndex >= TF_QUESTIONS.length - 1 ? 'Xem kết quả' : 'Tiếp theo'} <ArrowRight size={16} />
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {tfGameStatus === 'done' && (
                    <div style={{ textAlign: 'center', padding: '24px 10px' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#b10f1d', marginBottom: '10px' }}>Kết quả</h3>
                      <div style={{ fontSize: '2.8rem', fontWeight: '900', margin: '10px 0', color: tfScore >= 80 ? '#10b981' : tfScore >= 50 ? '#f59e0b' : '#ef4444' }}>
                        {tfScore} điểm
                      </div>
                      <p style={{ color: '#6f3d42', marginBottom: '22px' }}>
                        {tfScore >= 80 ? '🏆 Xuất sắc! Nắm vững Chương 3!' : tfScore >= 50 ? '👍 Khá tốt! Ôn lại một số khái niệm nhé.' : '📚 Hãy xem lại các slide lý thuyết nhé!'}
                      </p>
                      <button className="control-btn primary-btn" onClick={resetTfGame}><RotateCcw size={16} /> Chơi lại</button>
                    </div>
                  )}
                </div>
              )}

            </div>
          </>
        );
      }

      default:
        return <div>Slide không tìm thấy</div>;
    }
  };

  return (
    <>
      {getSlideContent()}

      {/* Mnemonic Corner */}
      {currentMnemonic && (
        <div className="mnemonic-corner">
          <div className="mnemonic-badge">
            <Lightbulb size={12} /> {currentMnemonic.formula}
          </div>
          <div 
            className="mnemonic-text" 
            dangerouslySetInnerHTML={{ __html: currentMnemonic.text }}
          />
        </div>
      )}
    </>
  );
}

export default App;
