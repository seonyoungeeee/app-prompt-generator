import React, { useMemo, useState } from "react";

const NEW_LINE = "\n";

const APP_TYPES = [
  { id: "random", icon: "🎲", title: "랜덤 추천 앱", desc: "여러 선택지 중 하나를 골라주는 앱" },
  { id: "checklist", icon: "✅", title: "체크리스트 앱", desc: "해야 할 일을 체크하는 앱" },
  { id: "test", icon: "💬", title: "성향 테스트 앱", desc: "질문에 답하면 결과를 알려주는 앱" },
  { id: "record", icon: "⭐", title: "기록·평가 앱", desc: "점수나 감상을 기록하는 앱" },
  { id: "game", icon: "🎮", title: "미니게임 앱", desc: "간단한 규칙으로 즐기는 게임 앱" },
  { id: "custom", icon: "✏️", title: "기타 / 직접 만들기", desc: "목록에 없는 앱을 직접 설명하기" },
];

const MOODS = ["귀여운", "깔끔한", "감성적인", "게임 같은", "심플한", "파스텔톤"];
const AUDIENCES = ["나", "친구들", "우리 반", "중학생", "가족", "직접 입력"];
const TOPIC_EXAMPLES = [
  "점심 메뉴 추천",
  "공부 계획 체크",
  "친구 유형 테스트",
  "랜덤 미션 뽑기",
  "10초 클릭 게임",
  "오늘의 기분 기록",
  "숫자 맞히기 게임",
  "준비물 체크",
  "오늘의 운세",
  "고민 응원 문구",
];

const TOPIC_EXAMPLES_BY_TYPE = {
  random: ["점심 메뉴 추천", "랜덤 미션 뽑기", "오늘의 운세", "행운 색깔 뽑기", "발표 순서 뽑기", "자리 뽑기", "랜덤 캐릭터 추천", "오늘의 공부 미션"],
  checklist: ["공부 계획 체크", "준비물 체크", "여행 짐 체크", "시험 공부 체크", "하루 루틴 체크", "숙제 체크", "운동 루틴 체크", "동아리 준비 체크"],
  test: ["친구 유형 테스트", "공부 유형 테스트", "취미 추천 테스트", "나의 성격 유형 테스트", "짝꿍 유형 테스트", "여행 스타일 테스트", "간식 취향 테스트", "나에게 맞는 공부법 테스트"],
  record: ["오늘의 기분 기록", "급식 별점 기록", "운동 기록", "하루 감사 기록", "독서 기록", "공부 시간 기록", "수면 기록", "오늘의 한 줄 일기"],
  game: ["10초 클릭 게임", "숫자 맞히기 게임", "가위바위보 게임", "O/X 퀴즈 게임", "반응속도 테스트", "기억력 카드 게임", "운석 피하기 게임", "랜덤 뽑기 게임"],
  custom: ["오늘의 운세", "고민 응원 문구", "행운 아이템 추천", "나에게 어울리는 색 추천", "랜덤 캐릭터 추천", "기분별 문장 추천", "공부 응원 문구", "나만의 취향 추천"],
};

const FEATURES = {
  random: ["선택지 입력하기", "랜덤으로 하나 뽑기", "결과 크게 보여주기", "다시 뽑기", "전체 초기화", "추천 결과에 짧은 설명 붙이기"],
  checklist: ["할 일 입력하기", "완료 체크하기", "남은 항목 확인하기", "전체 초기화", "완료 개수 보여주기", "카테고리별로 나누기"],
  test: ["질문 보여주기", "선택지 고르기", "결과 유형 계산하기", "결과 설명 보여주기", "다시 테스트하기", "결과에 맞는 조언 보여주기"],
  record: ["기록 입력하기", "점수 또는 별점 선택하기", "결과 목록 보여주기", "전체 초기화", "평균 점수 보여주기", "오늘의 한 줄 메모 남기기"],
  game: ["시작 버튼", "점수 표시", "제한 시간 또는 시도 횟수", "다시 시작", "성공/실패 메시지", "간단한 애니메이션 효과"],
};

const GAMES = [
  { id: "draw", title: "랜덤 뽑기 게임", desc: "버튼을 누르면 랜덤 결과 출력", stars: "★★★★★" },
  { id: "quiz", title: "퀴즈 게임", desc: "문제를 풀고 점수 확인", stars: "★★★★★" },
  { id: "rps", title: "가위바위보 게임", desc: "사용자와 컴퓨터가 대결", stars: "★★★★★" },
  { id: "number", title: "숫자 맞히기 게임", desc: "힌트를 보고 숫자 맞히기", stars: "★★★★☆" },
  { id: "click", title: "클릭 카운터 게임", desc: "정해진 시간 동안 많이 클릭", stars: "★★★★☆" },
  { id: "reaction", title: "반응속도 테스트", desc: "신호가 나오면 빠르게 클릭", stars: "★★★☆☆" },
  { id: "memory", title: "기억력 카드 게임", desc: "같은 카드 2장 찾기", stars: "★★★☆☆" },
  { id: "avoid", title: "피하기 게임", desc: "장애물을 피하며 버티기", stars: "★★☆☆☆" },
];

const CUSTOM_ELEMENTS = ["앱 제목", "간단한 설명", "입력창", "선택 버튼", "실행 버튼", "결과 표시 영역", "다시 하기 버튼", "초기화 버튼"];
const RESULT_TYPES = ["랜덤 결과", "입력에 따른 결과", "선택지에 따른 결과", "점수 계산 결과", "단순 안내 결과"];
const STEP_NAMES = ["시작", "앱 유형", "분위기", "앱 주제", "사용 대상", "게임 종류", "핵심 기능", "직접 설명", "결과"];

function getTopicExamples(appType) {
  return TOPIC_EXAMPLES_BY_TYPE[appType] || TOPIC_EXAMPLES;
}

function getTopicTitle(appType) {
  if (appType === "game") return "어떤 게임을 만들고 싶나요?";
  if (appType === "random") return "무엇을 추천하거나 뽑고 싶나요?";
  if (appType === "checklist") return "무엇을 체크하는 앱인가요?";
  if (appType === "test") return "어떤 테스트를 만들고 싶나요?";
  if (appType === "record") return "무엇을 기록하거나 평가할까요?";
  if (appType === "custom") return "앱 주제를 자유롭게 적어주세요";
  return "앱 주제를 적어주세요";
}

function getTopicDesc(appType) {
  if (appType === "game") return "미니게임에 어울리는 주제만 보여줍니다. 예시를 누르면 자동 입력됩니다.";
  if (appType === "custom") return "정해진 유형에 없던 아이디어도 괜찮아요. 자유롭게 적어보세요.";
  return "선택한 앱 유형에 맞는 예시만 보여줍니다. 예시를 누르면 자동 입력됩니다.";
}

function getTopicPlaceholder(appType) {
  if (appType === "game") return "예: 10초 클릭 게임, 숫자 맞히기 게임, O/X 퀴즈 게임";
  if (appType === "random") return "예: 점심 메뉴 추천, 오늘의 운세, 랜덤 미션 뽑기";
  if (appType === "checklist") return "예: 공부 계획 체크, 준비물 체크, 하루 루틴 체크";
  if (appType === "test") return "예: 친구 유형 테스트, 공부 유형 테스트, 취미 추천 테스트";
  if (appType === "record") return "예: 오늘의 기분 기록, 급식 별점 기록, 운동 기록";
  if (appType === "custom") return "예: 고민 응원 문구, 행운 아이템 추천, 색깔 추천";
  return "예: 오늘의 운세, 점심 메뉴 추천, 10초 클릭 게임";
}

const initialState = {
  appType: "",
  mood: "",
  topic: "",
  audience: "",
  customAudience: "",
  gameType: "",
  features: [],
  customFeatures: [],
  customFeatureInput: "",
  customDescription: "",
  customAction: "",
  customElements: [],
  resultType: "",
};

function getAppTypeLabel(id) {
  return APP_TYPES.find((item) => item.id === id)?.title || "웹앱";
}

function getGameLabel(id) {
  return GAMES.find((item) => item.id === id)?.title || "선택한 미니게임";
}

function getAllFeatures(state) {
  const selected = Array.isArray(state.features) ? state.features : [];
  const custom = Array.isArray(state.customFeatures) ? state.customFeatures : [];
  return [...selected, ...custom];
}

function joinFeatures(list) {
  if (!Array.isArray(list) || list.length === 0) return "선택한 핵심 기능";
  return list.join(", ");
}

function getScreenElements(state) {
  if (state.appType === "custom") {
    return state.customElements.length > 0
      ? state.customElements
      : ["앱 제목", "간단한 설명", "실행 버튼", "결과 표시 영역"];
  }

  if (state.appType === "random") return ["앱 제목", "간단한 설명", "선택지 입력창", "추가 버튼", "선택지 목록", "랜덤 추천 버튼", "결과 표시 영역", "다시 뽑기 버튼"];
  if (state.appType === "checklist") return ["앱 제목", "간단한 설명", "할 일 입력창", "추가 버튼", "체크리스트 영역", "완료 개수 표시", "전체 초기화 버튼"];
  if (state.appType === "test") return ["앱 제목", "간단한 설명", "질문 영역", "선택지 버튼", "다음 버튼", "결과 유형 표시 영역", "다시 테스트 버튼"];
  if (state.appType === "record") return ["앱 제목", "간단한 설명", "기록 입력창", "점수 또는 별점 선택 영역", "저장 버튼", "기록 목록", "전체 초기화 버튼"];
  if (state.appType === "game") return ["게임 제목", "간단한 설명", "시작 버튼", "게임 진행 영역", "점수 표시", "성공/실패 메시지", "다시 시작 버튼"];

  return ["앱 제목", "간단한 설명", "버튼", "결과 표시 영역"];
}

function getFunctionLines(state) {
  if (state.appType === "custom") {
    return [
      `사용자가 버튼을 누르거나 입력하면 ${state.customAction || "원하는 결과를 보여준다"}.`,
      `결과는 '${state.resultType || "단순 안내 결과"}' 방식으로 보여준다.`,
      "결과는 화면 가운데에 보기 좋게 표시한다.",
      "다시 하기 또는 초기화 버튼을 누르면 처음 상태로 돌아간다.",
    ];
  }

  if (state.appType === "random") {
    return [
      "사용자가 선택지를 입력하고 추가 버튼을 누르면 목록에 추가된다.",
      "랜덤 추천 버튼을 누르면 목록 중 하나가 랜덤으로 선택된다.",
      "추천 결과는 화면 가운데에 크고 눈에 띄게 표시된다.",
      "다시 뽑기 버튼을 누르면 같은 목록에서 다시 추천한다.",
    ];
  }

  if (state.appType === "checklist") {
    return [
      "사용자가 할 일을 입력하면 목록에 추가된다.",
      "각 항목은 체크할 수 있고, 체크한 항목은 완료 표시가 된다.",
      "완료 개수와 남은 항목 수를 보여준다.",
      "전체 초기화 버튼을 누르면 목록이 처음 상태로 돌아간다.",
    ];
  }

  if (state.appType === "test") {
    return [
      "사용자가 질문에 답하면 선택 결과가 누적된다.",
      "모든 질문이 끝나면 결과 유형을 보여준다.",
      "결과에는 간단한 설명과 조언이 포함된다.",
      "다시 테스트 버튼을 누르면 처음부터 다시 시작한다.",
    ];
  }

  if (state.appType === "record") {
    return [
      "사용자가 기록을 입력하고 점수나 별점을 선택할 수 있다.",
      "저장 버튼을 누르면 현재 화면의 목록에 추가된다.",
      "입력된 기록은 화면에서 확인할 수 있다.",
      "서버 저장 없이 현재 화면에서만 관리한다.",
    ];
  }

  if (state.appType === "game") {
    return [
      "사용자가 시작 버튼을 누르면 게임이 시작된다.",
      `게임은 '${getGameLabel(state.gameType)}' 방식으로 진행된다.`,
      "게임 진행 중 점수 또는 결과가 화면에 표시된다.",
      "게임이 끝나면 성공 또는 실패 메시지를 보여준다.",
      "다시 시작 버튼을 누르면 게임이 초기화된다.",
    ];
  }

  return ["사용자가 버튼을 누르면 핵심 기능이 작동한다."];
}

function makePrompt(state) {
  const topic = state.topic || state.customDescription || "나만의 앱";
  const audience = state.audience === "직접 입력" ? state.customAudience : state.audience || "중학생";
  const elements = getScreenElements(state);
  const lines = getFunctionLines(state);

  const allFeatures = getAllFeatures(state);
  let typeText = `앱 유형은 ${getAppTypeLabel(state.appType)}이고, 핵심 기능은 ${joinFeatures(allFeatures)}이야.`;

  if (state.appType === "game") {
    typeText += `${NEW_LINE}이 앱은 ${getGameLabel(state.gameType)} 형태의 미니게임이야.`;
  }

  if (state.appType === "custom") {
    typeText = [
      `이 앱은 ${state.customDescription || topic}이야.`,
      `주요 기능은 ${state.customAction || "사용자가 원하는 결과를 보여주는 것"}이야.`,
      `결과 방식은 ${state.resultType || "단순 안내 결과"} 방식이야.`,
    ].join(NEW_LINE);
  }

  const elementText = elements.map((item, index) => `${index + 1}. ${item}`).join(NEW_LINE);
  const functionText = lines.map((line) => `- ${line}`).join(NEW_LINE);

  return [
    "너는 중학생을 위한 웹앱 개발자야.",
    "",
    `나는 '${topic}' 앱을 만들고 싶어.`,
    "",
    `이 앱은 ${audience}이/가 사용하는 앱이야.`,
    typeText,
    "",
    "화면에는 다음 요소가 있어야 해.",
    elementText,
    "",
    "기능은 다음과 같이 작동해야 해.",
    functionText,
    "",
    `디자인은 ${state.mood || "깔끔한"} 느낌으로 만들어줘.`,
    "버튼은 큼직하고 둥글게 만들어줘.",
    "중학생이 처음 봐도 쉽게 사용할 수 있게 구성해줘.",
    "",
    "중요한 조건:",
    "서버, 백엔드, 데이터베이스, 로그인 기능은 사용하지 마.",
    "외부 라이브러리도 사용하지 마.",
    "HTML, CSS, JavaScript가 모두 포함된 하나의 HTML 파일로 만들어줘.",
    "브라우저에서 바로 실행할 수 있게 작성해줘.",
    "점수나 기록은 현재 화면에서만 보여주고, 새로고침하면 초기화되어도 괜찮아.",
    "",
    "코드는 바로 복사해서 메모장에 붙여넣은 뒤 .html 파일로 저장하면 실행될 수 있게 작성해줘.",
  ].join(NEW_LINE);
}

function copyTextFallback(text) {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

async function copyTextToClipboard(text) {
  if (!text) return false;

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return copyTextFallback(text);
    }
  }

  return copyTextFallback(text);
}

function runPromptGeneratorSelfTests() {
  const randomPrompt = makePrompt({
    ...initialState,
    appType: "random",
    mood: "파스텔톤",
    topic: "점심 메뉴 추천",
    audience: "친구들",
    features: ["선택지 입력하기", "랜덤으로 하나 뽑기"],
  });

  console.assert(randomPrompt.includes("점심 메뉴 추천"), "테스트 실패: 주제가 프롬프트에 포함되어야 함");
  console.assert(randomPrompt.includes("랜덤 추천 앱"), "테스트 실패: 앱 유형이 프롬프트에 포함되어야 함");
  console.assert(randomPrompt.includes("HTML, CSS, JavaScript"), "테스트 실패: 기술 조건이 포함되어야 함");
  console.assert(randomPrompt.includes("1. 앱 제목"), "테스트 실패: 화면 요소 번호 목록이 포함되어야 함");

  const customPrompt = makePrompt({
    ...initialState,
    appType: "custom",
    mood: "감성적인",
    topic: "오늘의 운세",
    audience: "중학생",
    customDescription: "오늘의 운세를 알려주는 앱",
    customAction: "랜덤으로 운세 결과를 보여준다",
    customElements: ["앱 제목", "실행 버튼", "결과 표시 영역"],
    resultType: "랜덤 결과",
  });

  console.assert(customPrompt.includes("오늘의 운세를 알려주는 앱"), "테스트 실패: 기타 앱 설명이 포함되어야 함");
  console.assert(customPrompt.includes("랜덤 결과"), "테스트 실패: 결과 방식이 포함되어야 함");
  console.assert(typeof copyTextFallback === "function", "테스트 실패: 복사 fallback 함수가 있어야 함");

  const customFeaturePrompt = makePrompt({
    ...initialState,
    appType: "checklist",
    mood: "깔끔한",
    topic: "공부 계획 체크",
    audience: "나",
    features: ["할 일 입력하기"],
    customFeatures: ["중요도 표시하기"],
  });
  console.assert(customFeaturePrompt.includes("중요도 표시하기"), "테스트 실패: 직접 입력한 핵심 기능이 포함되어야 함");
}

if (typeof window !== "undefined") {
  runPromptGeneratorSelfTests();
}

export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const visibleSteps = useMemo(() => {
    if (form.appType === "game") return [0, 1, 2, 5, 4, 6, 8];
    if (form.appType === "custom") return [0, 1, 2, 3, 4, 7, 8];
    return [0, 1, 2, 3, 4, 6, 8];
  }, [form.appType]);

  const currentIndex = Math.max(0, visibleSteps.indexOf(step));
  const progress = Math.max(0, ((currentIndex + 1) / visibleSteps.length) * 100);
  const prompt = useMemo(() => makePrompt(form), [form]);

  const completion = useMemo(() => {
    let score = 0;
    if (form.appType) score += 1;
    if (form.mood) score += 1;
    if (form.topic || form.customDescription) score += 1;
    if (form.audience && (form.audience !== "직접 입력" || form.customAudience.trim())) score += 1;
    if (form.appType === "custom") {
      if (form.customDescription && form.customAction && form.resultType) score += 1;
    } else if (getAllFeatures(form).length >= 2) {
      score += 1;
    }
    return score;
  }, [form]);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArray(key, value) {
    setForm((prev) => {
      const current = Array.isArray(prev[key]) ? prev[key] : [];
      const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
      return { ...prev, [key]: next };
    });
  }

  function addCustomFeature() {
    const value = form.customFeatureInput.trim();
    if (!value) return;
    setForm((prev) => {
      const current = Array.isArray(prev.customFeatures) ? prev.customFeatures : [];
      if (current.includes(value)) {
        return { ...prev, customFeatureInput: "" };
      }
      return {
        ...prev,
        customFeatures: [...current, value],
        customFeatureInput: "",
      };
    });
  }

  function removeCustomFeature(value) {
    setForm((prev) => ({
      ...prev,
      customFeatures: prev.customFeatures.filter((item) => item !== value),
    }));
  }

  function validate() {
    if (step === 1 && !form.appType) return "앱 유형을 선택해 주세요.";
    if (step === 2 && !form.mood) return "앱 분위기를 선택해 주세요.";
    if (step === 3 && form.appType !== "custom" && form.appType !== "game" && !form.topic.trim()) return "앱 주제를 입력해 주세요.";
    if (step === 4) {
      if (!form.audience) return "사용 대상을 선택해 주세요.";
      if (form.audience === "직접 입력" && !form.customAudience.trim()) return "사용 대상을 입력해 주세요.";
    }
    if (step === 5 && !form.gameType) return "게임 종류를 선택해 주세요.";
    if (step === 6 && getAllFeatures(form).length < 2) return "핵심 기능을 2개 이상 선택하거나 직접 입력해 주세요.";
    if (step === 7) {
      if (!form.customDescription.trim()) return "만들고 싶은 앱을 설명해 주세요.";
      if (!form.customAction.trim()) return "앱이 해줬으면 하는 일을 입력해 주세요.";
      if (form.customElements.length < 3) return "화면 요소를 3개 이상 선택해 주세요.";
      if (!form.resultType) return "결과 방식을 선택해 주세요.";
    }
    return "";
  }

  function next() {
    const message = validate();
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setCopied(false);
    const nextStep = visibleSteps[currentIndex + 1];
    if (nextStep !== undefined) setStep(nextStep);
  }

  function prev() {
    setError("");
    setCopied(false);
    const prevStep = visibleSteps[currentIndex - 1];
    if (prevStep !== undefined) setStep(prevStep);
  }

  async function copyPrompt() {
    const ok = await copyTextToClipboard(prompt);
    if (ok) {
      setCopied(true);
      setError("");
      return;
    }

    setCopied(false);
    setError("자동 복사가 막혔어요. 아래 프롬프트 박스를 클릭한 뒤 Ctrl+A, Ctrl+C로 복사해 주세요.");
  }

  function reset() {
    setForm(initialState);
    setStep(0);
    setError("");
    setCopied(false);
  }

  return (
    <div className="page">
      <style>{styles}</style>
      <div className="wrap">
        <header className="topbar">
          <div className="brand">
            <div className="logo">✨</div>
            <div>
              <h1>나만의 앱 주문서 생성기</h1>
              <p>선택하고 입력하면 AI 제작 프롬프트 완성</p>
            </div>
          </div>
          <div className="progressBox">
            <div className="progressText">
              <span>{currentIndex + 1} / {visibleSteps.length}</span>
              <span>{STEP_NAMES[step]}</span>
            </div>
            <div className="progress"><div style={{ width: `${progress}%` }} /></div>
          </div>
        </header>

        <main className="content">
          {step === 0 && (
            <section className="hero">
              <div className="heroText">
                <span className="badge">활동지 대신 쓰는 앱</span>
                <h2>앱 기획서,<br />이제 고르면서 완성</h2>
                <p>앱 기획서를 길게 쓰지 않아도 괜찮아요.<br />선택하고 입력하면 나만의 앱 주문서가 자동으로 만들어집니다.</p>
                <button className="primary big" onClick={() => setStep(1)}>시작하기 →</button>
              </div>
              <div className="preview">
                <div className="phone">
                  <div className="phoneTop" />
                  <div className="phoneCard">📱<br /><b>프롬프트 생성</b></div>
                  <div className="miniGrid"><span>🎲</span><span>🎮</span><span>✅</span><span>⭐</span></div>
                </div>
              </div>
            </section>
          )}

          {step === 1 && (
            <Section title="어떤 앱을 만들고 싶나요?" desc="목록에 딱 맞는 유형이 없다면 ‘기타 / 직접 만들기’를 선택하세요.">
              <div className="cards three">
                {APP_TYPES.map((item) => (
                  <Choice
                    key={item.id}
                    selected={form.appType === item.id}
                    onClick={() => setForm((prev) => ({ ...prev, appType: item.id, features: [], customFeatures: [], customFeatureInput: "", gameType: "" }))}
                    icon={item.icon}
                    title={item.title}
                    desc={item.desc}
                  />
                ))}
              </div>
              <Nav onPrev={prev} onNext={next} error={error} />
            </Section>
          )}

          {step === 2 && (
            <Section title="앱의 분위기를 골라주세요" desc="선택한 분위기는 최종 프롬프트에 자동으로 들어갑니다.">
              <div className="pills">
                {MOODS.map((mood) => (
                  <button key={mood} className={form.mood === mood ? "pill selected" : "pill"} onClick={() => update("mood", mood)}>{mood}</button>
                ))}
              </div>
              <Nav onPrev={prev} onNext={next} error={error} />
            </Section>
          )}

          {step === 3 && (
            <Section title={getTopicTitle(form.appType)} desc={getTopicDesc(form.appType)}>
              <div className="formCard">
                <label>{form.appType === "game" ? "만들고 싶은 게임 주제" : "만들고 싶은 앱 주제"}</label>
                <input value={form.topic} onChange={(e) => update("topic", e.target.value)} placeholder={getTopicPlaceholder(form.appType)} />
                <div className="chips">
                  {getTopicExamples(form.appType).map((ex) => (
                    <button key={ex} onClick={() => update("topic", ex)}>{ex}</button>
                  ))}
                </div>
              </div>
              <Nav onPrev={prev} onNext={next} error={error} />
            </Section>
          )}

          {step === 4 && (
            <Section title="누가 사용할 앱인가요?" desc="직접 입력을 선택하면 원하는 대상을 적을 수 있습니다.">
              <div className="cards three simple">
                {AUDIENCES.map((item) => (
                  <button key={item} className={form.audience === item ? "simpleCard selected" : "simpleCard"} onClick={() => update("audience", item)}>{item === "직접 입력" ? "✏️" : "👤"} {item}</button>
                ))}
              </div>
              {form.audience === "직접 입력" && (
                <div className="formCard small">
                  <label>사용 대상 직접 입력</label>
                  <input value={form.customAudience} onChange={(e) => update("customAudience", e.target.value)} placeholder="예: 동아리 친구들, 시험 기간 학생들" />
                </div>
              )}
              <Nav onPrev={prev} onNext={next} error={error} />
            </Section>
          )}

          {step === 5 && (
            <Section title="어떤 미니게임을 만들까요?" desc="처음이라면 추천도 높은 게임이 안정적입니다.">
              <div className="cards four">
                {GAMES.map((game) => (
                  <Choice key={game.id} selected={form.gameType === game.id} onClick={() => setForm((prev) => ({ ...prev, gameType: game.id, topic: game.title }))} icon="🎮" title={game.title} desc={`${game.desc} · 추천도 ${game.stars}`} />
                ))}
              </div>
              <Nav onPrev={prev} onNext={next} error={error} />
            </Section>
          )}

          {step === 6 && (
            <Section title="핵심 기능을 골라주세요" desc="2개 이상 선택하면 앱 주문서가 훨씬 구체적이 됩니다.">
              <div className="checks">
                {(FEATURES[form.appType] || []).map((feature) => (
                  <Check key={feature} checked={form.features.includes(feature)} onChange={() => toggleArray("features", feature)} label={feature} />
                ))}
              </div>
              <div className="customFeatureBox">
                <label>직접 추가할 핵심 기능</label>
                <div className="customFeatureInputRow">
                  <input
                    value={form.customFeatureInput}
                    onChange={(e) => update("customFeatureInput", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomFeature();
                      }
                    }}
                    placeholder="예: 난이도 선택하기, 힌트 보여주기, 중요도 표시하기"
                  />
                  <button type="button" className="primary" onClick={addCustomFeature}>추가</button>
                </div>
                {form.customFeatures.length > 0 && (
                  <div className="customFeatureList">
                    {form.customFeatures.map((feature) => (
                      <button key={feature} type="button" onClick={() => removeCustomFeature(feature)}>
                        {feature} ×
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="hint">선택한 기능: {getAllFeatures(form).length ? getAllFeatures(form).join(" · ") : "아직 없음"}</p>
              <Nav onPrev={prev} onNext={next} error={error} />
            </Section>
          )}

          {step === 7 && (
            <Section title="직접 만들 앱을 설명해주세요" desc="운세, 응원 문구, 색깔 추천처럼 목록에 없는 앱도 만들 수 있습니다.">
              <div className="twoCol">
                <div className="formCard">
                  <label>어떤 앱을 만들고 싶나요?</label>
                  <input value={form.customDescription} onChange={(e) => update("customDescription", e.target.value)} placeholder="예: 오늘의 운세를 알려주는 앱" />
                </div>
                <div className="formCard">
                  <label>앱이 해줬으면 하는 일</label>
                  <input value={form.customAction} onChange={(e) => update("customAction", e.target.value)} placeholder="예: 버튼을 누르면 랜덤으로 운세 결과를 보여준다" />
                </div>
              </div>
              <h3 className="subTitle">화면에 필요한 요소</h3>
              <div className="checks fourChecks">
                {CUSTOM_ELEMENTS.map((el) => (
                  <Check key={el} checked={form.customElements.includes(el)} onChange={() => toggleArray("customElements", el)} label={el} />
                ))}
              </div>
              <h3 className="subTitle">결과 방식</h3>
              <div className="pills">
                {RESULT_TYPES.map((type) => (
                  <button key={type} className={form.resultType === type ? "pill selected" : "pill"} onClick={() => update("resultType", type)}>{type}</button>
                ))}
              </div>
              <Nav onPrev={prev} onNext={next} error={error} />
            </Section>
          )}

          {step === 8 && (
            <section>
              <div className="resultHero">
                <div>
                  <span className="badge light">결과 완성</span>
                  <h2>나의 앱 주문서 완성!</h2>
                  <p>아래 프롬프트를 복사해서 Gemini Canvas에 붙여넣으세요.</p>
                </div>
                <div className="score"><span>프롬프트 완성도</span><b>{"★".repeat(completion)}{"☆".repeat(5 - completion)}</b></div>
              </div>

              <div className="resultGrid">
                <div className="summary">
                  <h3>선택 내용</h3>
                  <Summary label="앱 유형" value={getAppTypeLabel(form.appType)} />
                  <Summary label="앱 분위기" value={form.mood || "-"} />
                  <Summary label="앱 주제" value={form.topic || form.customDescription || "-"} />
                  <Summary label="사용 대상" value={form.audience === "직접 입력" ? form.customAudience : form.audience || "-"} />
                  {form.appType === "game" && <Summary label="게임 종류" value={getGameLabel(form.gameType)} />}
                  {form.appType === "custom" ? <Summary label="직접 설명" value={form.customDescription || "-"} /> : <Summary label="핵심 기능" value={getAllFeatures(form).length ? getAllFeatures(form).join(" · ") : "-"} />}
                  <p className="feedback">{completion >= 5 ? "좋아요! 바로 Gemini Canvas에 넣어도 충분히 구체적입니다." : "조금만 더 구체적으로 다듬으면 더 좋은 앱이 나올 수 있습니다."}</p>
                </div>
                <div className="promptBox">
                  <textarea readOnly value={prompt} onClick={(e) => e.currentTarget.select()} aria-label="생성된 프롬프트" />
                  <div className="buttonRow">
                    <button className="primary" onClick={copyPrompt}>프롬프트 복사하기</button>
                    <button className="secondary" onClick={reset}>처음부터 다시</button>
                  </div>
                  {copied && <p className="copyMsg">프롬프트가 복사되었습니다!</p>}
                  {error && step === 8 && <p className="error">{error}</p>}
                </div>
              </div>
              <div className="backOnly"><button className="secondary" onClick={prev}>← 이전 단계로</button></div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function Section({ title, desc, children }) {
  return (
    <section>
      <div className="sectionTitle">
        <h2>{title}</h2>
        <p>{desc}</p>
      </div>
      {children}
    </section>
  );
}

function Choice({ selected, onClick, icon, title, desc }) {
  return (
    <button className={selected ? "choice selected" : "choice"} onClick={onClick}>
      <div className="choiceTop"><span className="choiceIcon">{icon}</span><span className="mark">✓</span></div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </button>
  );
}

function Check({ checked, onChange, label }) {
  return (
    <label className={checked ? "check selected" : "check"}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

function Nav({ onPrev, onNext, error }) {
  return (
    <>
      <div className="nav">
        <button className="secondary" onClick={onPrev}>← 이전</button>
        <button className="primary" onClick={onNext}>다음 →</button>
      </div>
      {error && <p className="error">{error}</p>}
    </>
  );
}

function Summary({ label, value }) {
  return (
    <div className="summaryItem">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

const styles = `
* { box-sizing: border-box; }
body { margin: 0; }
.page { min-height: 100vh; padding: 32px 16px; color: #1f2a44; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: radial-gradient(circle at top left, #ffe1d6, transparent 420px), radial-gradient(circle at bottom right, #dce9ff, transparent 460px), #fffaf2; }
.wrap { max-width: 1120px; margin: 0 auto; background: rgba(255,255,255,.86); border: 1px solid rgba(255,255,255,.9); border-radius: 32px; overflow: hidden; box-shadow: 0 24px 70px rgba(31,42,68,.16); }
.topbar { display: flex; justify-content: space-between; gap: 20px; align-items: center; padding: 24px 28px; border-bottom: 1px solid #eef1f7; background: rgba(255,255,255,.75); }
.brand { display: flex; align-items: center; gap: 14px; }
.logo { width: 52px; height: 52px; display: grid; place-items: center; border-radius: 18px; background: linear-gradient(135deg, #7c8cff, #ff9ec8); color: white; font-size: 26px; }
h1 { margin: 0; font-size: 28px; letter-spacing: -1px; }
.brand p { margin: 4px 0 0; color: #68738a; font-weight: 600; }
.progressBox { width: min(320px, 100%); }
.progressText { display: flex; justify-content: space-between; margin-bottom: 8px; color: #68738a; font-size: 13px; font-weight: 800; }
.progress { height: 12px; background: #eef1f7; border-radius: 99px; overflow: hidden; }
.progress div { height: 100%; background: linear-gradient(90deg, #7c8cff, #ff9ec8); border-radius: 99px; transition: width .3s; }
.content { padding: 32px; }
.hero { display: grid; grid-template-columns: 1.15fr .85fr; gap: 28px; align-items: center; }
.heroText, .preview, .formCard, .summary, .promptBox { background: white; border: 1px solid #eef1f7; border-radius: 28px; box-shadow: 0 12px 28px rgba(31,42,68,.08); }
.heroText { padding: 48px; }
.badge { display: inline-block; padding: 9px 14px; border-radius: 99px; background: #fff0b8; color: #725900; font-weight: 900; font-size: 14px; }
.badge.light { background: rgba(255,255,255,.24); color: white; }
.hero h2, .sectionTitle h2, .resultHero h2 { margin: 18px 0 0; font-size: clamp(34px, 5vw, 58px); line-height: 1.08; letter-spacing: -2px; }
.hero p, .sectionTitle p, .resultHero p { color: #68738a; font-size: 18px; line-height: 1.7; }
.primary, .secondary { border: none; border-radius: 18px; padding: 15px 22px; cursor: pointer; font-weight: 900; font-size: 16px; transition: .16s; }
.primary { background: #7c8cff; color: white; box-shadow: 0 10px 22px rgba(124,140,255,.3); }
.primary:hover, .secondary:hover, .choice:hover, .simpleCard:hover { transform: translateY(-2px); }
.secondary { background: #eef1f7; color: #1f2a44; }
.big { margin-top: 22px; font-size: 18px; padding: 17px 26px; }
.preview { min-height: 420px; display: grid; place-items: center; background: linear-gradient(145deg, #fff, #f3f6ff); }
.phone { width: min(320px, 100%); padding: 18px; border: 10px solid #1f2a44; border-radius: 30px; background: white; box-shadow: 0 20px 40px rgba(31,42,68,.2); }
.phoneTop { width: 80px; height: 8px; border-radius: 99px; background: #dfe4ef; margin: 0 auto 18px; }
.phoneCard { padding: 24px; text-align: center; font-size: 34px; border-radius: 22px; background: #eef1ff; }
.phoneCard b { display: block; margin-top: 10px; font-size: 18px; }
.miniGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; }
.miniGrid span { padding: 18px; border-radius: 18px; text-align: center; font-size: 28px; background: #fff0b8; }
.sectionTitle { margin-bottom: 24px; }
.cards { display: grid; gap: 16px; }
.cards.three { grid-template-columns: repeat(3, 1fr); }
.cards.four { grid-template-columns: repeat(4, 1fr); }
.choice, .simpleCard { text-align: left; border: 2px solid #eef1f7; background: white; border-radius: 24px; padding: 20px; cursor: pointer; box-shadow: 0 10px 22px rgba(31,42,68,.06); transition: .16s; color: #1f2a44; font-family: inherit; }
.choice.selected, .simpleCard.selected, .pill.selected, .check.selected { border-color: #7c8cff; background: #f3f5ff; }
.choiceTop { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
.choiceIcon { width: 54px; height: 54px; display: grid; place-items: center; border-radius: 18px; background: #dce9ff; font-size: 28px; }
.mark { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; background: #eef1f7; color: #b8c0d2; font-weight: 900; }
.selected .mark { background: #7c8cff; color: white; }
.choice h3 { margin: 0; font-size: 20px; }
.choice p { color: #68738a; line-height: 1.5; margin-bottom: 0; }
.pills, .chips { display: flex; flex-wrap: wrap; gap: 12px; }
.pill, .chips button { border: 2px solid #eef1f7; background: white; border-radius: 999px; padding: 14px 18px; cursor: pointer; font-weight: 900; color: #1f2a44; }
.formCard { padding: 24px; margin-top: 16px; }
.formCard.small { max-width: 560px; }
.formCard label { display: block; margin-bottom: 10px; font-size: 18px; font-weight: 900; }
input { width: 100%; border: 2px solid #dfe4ef; border-radius: 18px; padding: 16px; font-size: 17px; outline: none; }
input:focus, textarea:focus { border-color: #7c8cff; box-shadow: 0 0 0 4px rgba(124,140,255,.15); }
.chips { margin-top: 16px; }
.simple .simpleCard { font-size: 20px; font-weight: 900; }
.checks { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.fourChecks { grid-template-columns: repeat(4, 1fr); }
.check { display: flex; gap: 10px; align-items: center; border: 2px solid #eef1f7; background: white; border-radius: 18px; padding: 15px; font-weight: 900; cursor: pointer; }
.check input { width: 20px; height: 20px; accent-color: #7c8cff; }
.hint, .feedback { margin-top: 16px; padding: 14px 16px; border-radius: 18px; background: #f6f8fc; color: #68738a; font-weight: 800; line-height: 1.5; }
.customFeatureBox { margin-top: 18px; padding: 18px; border: 1px solid #eef1f7; border-radius: 22px; background: #fff; box-shadow: 0 10px 22px rgba(31,42,68,.06); }
.customFeatureBox label { display: block; margin-bottom: 10px; font-size: 18px; font-weight: 900; }
.customFeatureInputRow { display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: center; }
.customFeatureList { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px; }
.customFeatureList button { border: 2px solid #dfe4ef; background: #f3f5ff; color: #1f2a44; border-radius: 999px; padding: 10px 14px; font-weight: 900; cursor: pointer; }
.customFeatureList button:hover { border-color: #7c8cff; }
.error { margin-top: 16px; padding: 14px 16px; border-radius: 18px; background: #fff0f2; color: #d13b54; font-weight: 900; }
.nav { margin-top: 28px; display: flex; justify-content: space-between; gap: 12px; }
.twoCol { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.subTitle { margin: 28px 0 12px; font-size: 20px; }
.resultHero { display: flex; justify-content: space-between; gap: 20px; align-items: center; margin-bottom: 22px; padding: 28px; border-radius: 28px; color: white; background: linear-gradient(135deg, #7c8cff, #ff9ec8); }
.resultHero h2 { color: white; }
.resultHero p { color: rgba(255,255,255,.9); margin-bottom: 0; }
.score { text-align: center; padding: 18px; min-width: 220px; border-radius: 22px; background: rgba(255,255,255,.22); }
.score span { display: block; font-weight: 900; }
.score b { display: block; margin-top: 8px; color: #fff0b8; font-size: 30px; letter-spacing: 2px; }
.resultGrid { display: grid; grid-template-columns: .85fr 1.15fr; gap: 18px; }
.summary, .promptBox { padding: 22px; }
.summary h3 { margin-top: 0; font-size: 22px; }
.summaryItem { padding: 13px; border-radius: 16px; background: #f6f8fc; margin-bottom: 10px; }
.summaryItem span { display: block; color: #7a8499; font-size: 12px; font-weight: 900; }
.summaryItem b { display: block; margin-top: 4px; line-height: 1.45; }
textarea { width: 100%; height: 520px; resize: vertical; border: 2px solid #dfe4ef; border-radius: 20px; padding: 18px; background: #f8f9fc; font-size: 14px; line-height: 1.6; }
.buttonRow { display: flex; gap: 10px; margin-top: 12px; }
.buttonRow .primary { flex: 1; }
.copyMsg { padding: 12px 14px; border-radius: 16px; background: #ecfdf4; color: #12834d; font-weight: 900; }
.backOnly { margin-top: 20px; }
@media (max-width: 900px) {
  .topbar, .hero, .twoCol, .resultGrid, .resultHero { grid-template-columns: 1fr; flex-direction: column; align-items: stretch; }
  .cards.three, .cards.four, .checks, .fourChecks { grid-template-columns: 1fr; }
  .customFeatureInputRow { grid-template-columns: 1fr; }
  .heroText { padding: 30px; }
  .content { padding: 20px; }
  .resultHero { display: block; }
  .score { margin-top: 18px; }
}
`;
