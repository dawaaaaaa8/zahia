"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ===================== ЭНДЭЭС ТЕКСТҮҮДЭЭ ЗАСНА ===================== */

const TO = "Зөвхөн Ариунгэрэлд 💌";
const INTRO_BUTTON = "Чамд нэг жижигхэн зүйл бэлдсэн юм аа...";
const SIGNATURE = "— чамд хайртай хүн чинь";

// t = өнгөний сэдэв: blush | dawn | night | plum | gold | sky | lilac | rose
const SCENES = [
  {
    t: "blush",
    icon: "❤️",
    title: "Уучлаарай",
    mascot: { mood: "sorry", say: "Уучлаарай... 🥺" },
    text: "Юуны өмнө чамаас үнэхээр чин сэтгэлээсээ уучлалт гуймаар байна. Чамайг гомдоож, сэтгэлийг чинь ойлгож чадаагүйдээ би маш их харамсаж байгаа. Тэр үед чиний юу мэдэрч байгааг сайн бодож, ойлгохыг хичээгээгүй юм  байна. Одоо эргээд бодох тусам чамд ямар хэцүү байсан бол гэж бодогддог. Болсон бүхнийг буцааж чадахгүй ч чамайг гомдоосондоо үнэхээр уучлалт гуйж байна. Намайг уучлаарай.",
    next: "Цааш нь унших",
  },
  {
    t: "night",
    icon: "🥺",
    title: "Чамайг санаж байна",
    mascot: { mood: "sleepy", say: "Санаж байна..." },
    text: "Чамайг үнэхээр их санаж байна. Анх танилцаж байсан үе, чамтай ярилцах гэж догдолдог байсан мөчүүд хүртэл санаанд ордог. Утсаа харах бүрдээ чамаас зурвас ирсэн болов уу гэж өөрийн эрхгүй боддог. Чамтай ярилцаж, инээлдэж, өдөр бүр жижигхэн зүйлсээ хуваалцдаг байсан үеэ их санадаг юм .",
    next: "Цааш",
  },
  {
    t: "lilac",
    icon: "🤍",
    title: "Би өөрийнхөө алдааг ойлгож байна",
    mascot: { mood: "happy", say: "Ойлгоорой 🤍" },
    text: "Би заримдаа сэтгэлээ зөв илэрхийлж чаддаггүй байжээ. Хэлэх гэсэн үгээ буруу хэлж, чамайг ойлгохын оронд өөрийгөө л ойлгуулах гэж зүтгэсэн байх. Гэхдээ чамайг гэх миний сэтгэл хэзээ ч худлаа байгаагүй. Би чамайг гомдоох биш, харин хайрлаж, ойлгож, аз жаргалтай байлгах ёстой байсан юм. Одоо л өөрийнхөө алдааг илүү сайн ойлгож байна.",
    next: "Цааш",
  },
  {
    t: "gold",
    icon: "💗",
    title: "Чи надад үнэ цэнтэй",
    mascot: { mood: "love", say: "Чи нандин 💗" },
    text: "Чи миний хувьд зүгээр нэг хүн биш шүү. Чамтай танилцсан, ярилцсан, бага багаар бие биенээ таньж мэдсэн бүх мөч надад үнэхээр нандин. Чиний инээмсэглэл, дуу хоолой, заримдаа гомддог байдал гээд жижигхэн зүйлс хүртэл санаанд ордог. Энэ бүхнийг би ямар их нандигнадаг байснаа тэр үед хангалттай харуулж, хэлж чаддаггүй байжээ. Чи надад үнэхээр үнэ цэнтэй хүн.\n\nГэхдээ өнгөрснийг өөрчилж чадахгүйгээ мэдэж байна. Харин алдаагаа ойлгож, дахиж давтахгүй байхыг үнэхээр хичээмээр байна. Чамд учруулсан тэр бүх хэцүү мэдрэмжийн төлөө уучлаарай.",
    next: "Цааш",
  },
  {
    t: "plum",
    icon: "🥀",
    title: "Дахин нэг боломж",
    mascot: { mood: "sorry", say: "Нэг боломж? 🥺" },
    text: "Бас ганцхан уучлаарай гэж хэлээд бүхнийг мартуулахыг хүсэхгүй. Зүгээр л надад дахин нэг боломж олдоосой гэж хүсэж байна. Энэ удаа Чамайг илүү сайн сонсож, ойлгож, мэдрэмжийг чинь бодож сурмаар байна.",
    next: "Цааш",
  },
  {
    t: "dawn",
    icon: "🫶",
    title: "Чиний мэдрэмжийг хүндэтгэнэ",
    mascot: { mood: "happy", say: "Ойлгоно оо 🤍" },
    text: "Чамд одоо ямар байгааг би бүрэн ойлгохгүй байж магадгүй. Надад гомдсон хэвээрээ байгаа бол би ойлгоно. Зүгээр л энэ захиаг уншаад миний сэтгэлд юу байгааг ойлгоосой гэж хүссэн юм. Чамд бодох хугацаа хэрэгтэй бол би хүндэтгэнэ. Чиний юу мэдэрч байгааг ч бас бодолцохыг хүсэж байна.",
    next: "Цааш",
  },
  {
    t: "sky",
    icon: "🌷",
    title: "Чамтай учирсандаа баярладаг",
    mascot: { mood: "happy", say: "Баярлалаа 🌷" },
    text: "Чамтай учирсандаа би хэзээ ч харамсахгүй. Харин ч чамтай танилцаж, хамтдаа олон сайхан дурсамж бүтээсэндээ баярладаг. Чамд хэлж амжаагүй, харуулж чадаагүй зүйл надад их бий. Би чамайг одоо ч гэсэн алдахыг хүсэхгүй байна. Боломж байвал дахиад эхнээс нь эхэлж, энэ удаа нэг нэгнээ илүү сайн ойлгож, хайрлаж, гомдоохгүй байхыг хүсэж байна.",
    next: "Сүүлийнх нь...",
  },
  {
    t: "rose",
    icon: "❤️",
    title: "Эцэст нь хэлэхэд...",
    mascot: { mood: "love", say: "Хайртай ❤️" },
    text: "Эцэст нь хэлэхэд, чи миний хувьд одоо ч үнэ цэнтэй хэвээрээ. Би чамайг үнэхээр их санаж байна. Чамайг гомдоосондоо дахин уучлалт гуйя. Намайг уучлаарай.",
    final: true,
    yes: {
      button: "Тийм, ярилцъя ♡",
      reply: "Баярлалаа ♡ Чамтай ярилцахыг тэсэн ядан хүлээж байна.",
      mascot: { mood: "love", say: "Ураа! 🎉" },
    },
    wait: {
      button: "Жаахан хугацаа хэрэгтэй",
      reply: "Зүгээр ээ, би хүлээнэ. Чамд хэрэгтэй хугацаагаа аваарай ♡",
      mascot: { mood: "happy", say: "Хүлээнэ ээ ♡" },
    },
  },
];

// Бамбарууш дээр дарахад хэлэх үгс
const INTRO_SAY = "Чамд захиа ирлээ! 💌";
const POKE_LINES = [ "Тэврээч 🧸", "Чи хөөрхөн шүү 🌸", ];

/* ================================================================== */

function Bear({ mood = "happy", say, hop = 0, dance = false, onPoke }) {
  const eye = (cx) => (
    <>
      <ellipse cx={cx} cy="66" rx="4" ry="5" fill="#2e1d18" />
      <circle cx={cx + 1.5} cy="64" r="1.4" fill="#fff" />
    </>
  );
  const heartEye = (cx) => (
    <path transform={`translate(${cx} 66)`} d="M0 -2 C-2 -7 -9 -5 -7 1 L0 7 L7 1 C9 -5 2 -7 0 -2Z" fill="#e8457a" />
  );

  return (
    <div className={`mascot ${mood} ${dance ? "dance" : ""}`}>
      {say && <div className="bubble" key={say}>{say}</div>}
      {mood === "sleepy" && (
        <div className="zzz" aria-hidden="true"><i>z</i><i>z</i><i>z</i></div>
      )}
      <button className="hopper-btn" onClick={onPoke} aria-label="Бамбарууш">
        <div key={hop} className={`hopper ${hop ? "hop" : ""}`}>
          <svg viewBox="0 0 120 120" aria-hidden="true">
            {/* чих */}
            <g className="ear l">
              <circle cx="33" cy="42" r="14" className="fur" />
              <circle cx="33" cy="42" r="7" className="inner" />
            </g>
            <g className="ear r">
              <circle cx="87" cy="42" r="14" className="fur" />
              <circle cx="87" cy="42" r="7" className="inner" />
            </g>

            {/* толгой */}
            <circle cx="60" cy="68" r="33" className="fur" />
            <ellipse cx="60" cy="82" rx="15" ry="11" className="light" />
            <ellipse cx="38" cy="78" rx="6" ry="3.6" fill="#ff9fb5" opacity=".8" />
            <ellipse cx="82" cy="78" rx="6" ry="3.6" fill="#ff9fb5" opacity=".8" />

            {/* нүд */}
            {(mood === "happy" || mood === "sorry") && (
              <g className="eyes">{eye(46)}{eye(74)}</g>
            )}
            {mood === "love" && <g className="heart-eyes">{heartEye(46)}{heartEye(74)}</g>}
            {mood === "sleepy" && (
              <>
                <path d="M41 66 q5 4 10 0" className="line" />
                <path d="M69 66 q5 4 10 0" className="line" />
              </>
            )}
            {mood === "sorry" && (
              <>
                <path d="M38 58 L50 54" className="line" />
                <path d="M82 58 L70 54" className="line" />
                <path className="tear" d="M40 72 q-3.5 6 0 8 q3.5 -2 0 -8z" fill="#9fd3ff" />
              </>
            )}

            {/* хамар, ам */}
            <ellipse cx="60" cy="77" rx="5" ry="3.6" fill="#2e1d18" />
            {mood === "sorry" ? (
              <path d="M55 88 q5 -4 10 0" className="line" />
            ) : mood === "sleepy" ? (
              <circle cx="60" cy="86" r="2" fill="#2e1d18" />
            ) : (
              <path d="M60 80.5 v3 M54 83 q3 4 6 0 q3 4 6 0" className="line" />
            )}

            {/* тэвэрсэн зүрх + сарвуу */}
            <g className="held-heart">
              <path d="M60 99 C56 91 44 93 47 103 L60 116 L73 103 C76 93 64 91 60 99Z" fill="#e8457a" stroke="#8a2346" strokeWidth="2" />
              <path d="M51 99 q2 -3 5 -2" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".8" />
              {mood === "sorry" && <path d="M60 99 l-3 5 l4 3 l-3 6" stroke="#8a2346" strokeWidth="1.6" fill="none" strokeLinejoin="round" />}
            </g>
            <g className="paws">
              <ellipse cx="42" cy="106" rx="10" ry="8" className="fur" />
              <ellipse cx="78" cy="106" rx="10" ry="8" className="fur" />
              <ellipse cx="42" cy="107" rx="4.5" ry="3.5" className="inner" />
              <ellipse cx="78" cy="107" rx="4.5" ry="3.5" className="inner" />
            </g>
          </svg>
        </div>
      </button>
    </div>
  );
}

function HeartRain() {
  const drops = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 2.5,
        dur: 2.6 + Math.random() * 2.6,
        size: 14 + Math.random() * 16,
        c: ["♥", "♡", "💗", "✿"][i % 4],
      })),
    []
  );
  return (
    <div className="fx rain" aria-hidden="true">
      {drops.map((d, i) => (
        <span key={i} style={{ left: `${d.left}%`, fontSize: d.size, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }}>
          {d.c}
        </span>
      ))}
    </div>
  );
}

function Typewriter({ text, onDone, className, delay = 700 }) {
  const chars = useMemo(() => Array.from(text), [text]);
  const speed = Math.min(34, Math.max(12, 6000 / chars.length)); // урт текст ~6 секундэд дуусна
  const [n, setN] = useState(0);
  const done = n >= chars.length;

  useEffect(() => {
    let id;
    const wait = setTimeout(() => {
      id = setInterval(() => {
        setN((v) => {
          if (v >= chars.length) {
            clearInterval(id);
            return v;
          }
          return v + 1;
        });
      }, speed);
    }, delay);
    return () => {
      clearTimeout(wait);
      clearInterval(id);
    };
  }, [chars, speed, delay]);

  useEffect(() => {
    if (done) onDone(true);
  }, [done, onDone]);

  return (
    <p className={className} onClick={() => setN(chars.length)}>
      {chars.slice(0, n).join("")}
      {!done && <span className="caret" />}
      <span className="ghost">{chars.slice(n).join("")}</span>
    </p>
  );
}

function PromiseList({ items, onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone(true), 900 + items.length * 350);
    return () => clearTimeout(t);
  }, [items, onDone]);

  return (
    <ul className="l">
      {items.map((x, i) => (
        <li key={i} style={{ "--i": i }}>
          <svg className="chk" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}

function Title({ text, long }) {
  return (
    <h1 className={long ? "long" : ""}>
      {text.split(" ").map((w, i) => (
        <Fragment key={i}>
          <span className="w" style={{ "--i": i }}>{w}</span>{" "}
        </Fragment>
      ))}
    </h1>
  );
}

function Ambient() {
  const data = useMemo(
    () => ({
      hearts: Array.from({ length: 16 }, (_, i) => ({
        left: Math.random() * 100,
        size: 12 + Math.random() * 18,
        dur: 11 + Math.random() * 10,
        delay: -Math.random() * 14,
        c: ["♡", "♥", "❀", "✦"][i % 4],
      })),
      stars: Array.from({ length: 60 }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2.4,
        delay: Math.random() * 4,
      })),
      flies: Array.from({ length: 14 }, () => ({
        top: 10 + Math.random() * 80,
        left: Math.random() * 100,
        dur: 7 + Math.random() * 6,
        delay: -Math.random() * 8,
      })),
    }),
    []
  );

  return (
    <>
      <div className="fx sun" aria-hidden="true" />
      <div className="fx clouds" aria-hidden="true">
        <i /><i /><i />
      </div>
      <div className="fx stars" aria-hidden="true">
        {data.stars.map((s, i) => (
          <i key={i} style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />
        ))}
        <b className="shoot" />
      </div>
      <div className="fx flies" aria-hidden="true">
        {data.flies.map((f, i) => (
          <i key={i} style={{ top: `${f.top}%`, left: `${f.left}%`, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }} />
        ))}
      </div>
      <div className="fx hearts" aria-hidden="true">
        {data.hearts.map((h, i) => (
          <span key={i} style={{ left: `${h.left}%`, fontSize: h.size, animationDuration: `${h.dur}s`, animationDelay: `${h.delay}s` }}>
            {h.c}
          </span>
        ))}
      </div>
    </>
  );
}

function Burst() {
  const bits = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        a: (360 / 28) * i,
        d: 110 + Math.random() * 130,
        s: 14 + Math.random() * 10,
        c: ["♥", "♡", "✿", "✦"][i % 4],
      })),
    []
  );
  return (
    <div className="burst" aria-hidden="true">
      {bits.map((b, i) => (
        <span key={i} style={{ "--a": `${b.a}deg`, "--d": `${b.d}px`, fontSize: b.s }}>{b.c}</span>
      ))}
    </div>
  );
}

export default function Home() {
  const [stage, setStage] = useState(0); // 0 = дугтуй
  const [phase, setPhase] = useState("enter"); // enter | leave
  const [dir, setDir] = useState(0); // 0 = анх, 1 = урагш, -1 = хойш
  const [opening, setOpening] = useState(false);
  const [introOut, setIntroOut] = useState(false);
  const [typed, setTyped] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [pops, setPops] = useState([]);
  const busy = useRef(false);
  const touch = useRef(null);
  const tiltRef = useRef(null);
  const [hop, setHop] = useState(0);
  const [poke, setPoke] = useState(null);
  const pokeTimer = useRef(null);
  const trailRef = useRef(null);
  const lastTrail = useRef(0);

  useEffect(() => setMounted(true), []);

  const scene = stage > 0 ? SCENES[stage - 1] : null;

  const goTo = useCallback(
    (n) => {
      if (busy.current || n < 0 || n > SCENES.length || n === stage) return;
      busy.current = true;
      setDir(n > stage ? 1 : -1);
      setPhase("leave");
      setHop((h) => h + 1);
      setTimeout(() => {
        setTyped(false);
        setAnswer(null);
        if (n === 0) {
          setOpening(false);
          setIntroOut(false);
        }
        setStage(n);
        setPhase("enter");
        window.scrollTo({ top: 0, behavior: "smooth" });
        busy.current = false;
      }, 420);
    },
    [stage]
  );

  const openEnvelope = () => {
    if (opening) return;
    setOpening(true);
    setHop((h) => h + 1);
    setTimeout(() => setIntroOut(true), 1500);
    setTimeout(() => {
      setDir(0);
      setTyped(false);
      setPhase("enter");
      setStage(1);
    }, 2100);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (!scene) return;
      if (e.key === "ArrowRight" && scene.next) goTo(stage + 1);
      if (e.key === "ArrowLeft") goTo(stage - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scene, stage, goTo]);

  // Сүүлийн сонголтыг хийхэд танд мэдэгдэл илгээнэ
  const choose = (key) => {
    setAnswer(key);
    fetch("/api/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: key, label: SCENES[SCENES.length - 1][key].button }),
      keepalive: true,
    }).catch(() => {});
  };

  const spawnHeart = (e) => {
    const id = Date.now() + Math.random();
    setPops((p) => [...p.slice(-12), { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setPops((p) => p.filter((q) => q.id !== id)), 1000);
  };

  const pokeMascot = (e) => {
    e.stopPropagation();
    setHop((h) => h + 1);
    setPoke(POKE_LINES[Math.floor(Math.random() * POKE_LINES.length)]);
    clearTimeout(pokeTimer.current);
    pokeTimer.current = setTimeout(() => setPoke(null), 1800);
    spawnHeart(e);
  };

  // хуруу / хулганы араас гялбаа үлдээнэ
  const sparkle = (e) => {
    const now = performance.now();
    if (now - lastTrail.current < 45 || !trailRef.current) return;
    lastTrail.current = now;
    const el = document.createElement("span");
    el.textContent = Math.random() < 0.6 ? "✦" : "♥";
    el.style.left = `${e.clientX}px`;
    el.style.top = `${e.clientY}px`;
    el.style.setProperty("--dx", `${Math.random() * 30 - 15}px`);
    trailRef.current.appendChild(el);
    setTimeout(() => el.remove(), 800);
  };

  const onTouchEnd = (e) => {
    if (!touch.current || !scene) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) < Math.abs(dy) * 1.5) return; // дээш доош гүйлгэвэл шилжихгүй
    if (dx < -60 && scene.next) goTo(stage + 1);
    if (dx > 60) goTo(stage - 1);
  };

  const tilt = (e) => {
    const el = tiltRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${x * 6}deg`);
    el.style.setProperty("--rx", `${-y * 6}deg`);
  };
  const untilt = () => {
    tiltRef.current?.style.setProperty("--rx", "0deg");
    tiltRef.current?.style.setProperty("--ry", "0deg");
  };

  const paperAnim =
    phase === "leave"
      ? dir >= 0 ? "leave-fwd" : "leave-bwd"
      : dir === 0 ? "enter-first" : dir > 0 ? "enter-fwd" : "enter-bwd";

  return (
    <main
      className="root"
      data-t={scene ? scene.t : "blush"}
      onPointerDown={spawnHeart}
      onPointerMove={sparkle}
      onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
      onTouchEnd={onTouchEnd}
    >
      {mounted && <Ambient />}

      <div className="trail" ref={trailRef} aria-hidden="true" />
      {answer === "yes" && <HeartRain />}

      <div className="pops" aria-hidden="true">
        {pops.map((p) => (
          <span key={p.id} style={{ left: p.x, top: p.y }}>♥</span>
        ))}
      </div>

      {stage === 0 && (
        <>
          <p className="to">{TO}</p>
          <section className={`intro ${introOut ? "out" : ""} ${phase === "leave" ? "out" : ""}`}>
            <div className={`env ${opening ? "open" : ""}`}>
              <Bear mood="happy" say={poke || INTRO_SAY} hop={hop} onPoke={pokeMascot} />
              <div className="back" />
              <div className="pap"><span>♡</span></div>
              <div className="fr" />
              <div className="fl" />
              <button className="seal" onClick={openEnvelope} aria-label="Дугтуйг нээх">♥</button>
            </div>
            {!opening ? (
              <button className="btn" onClick={openEnvelope}>{INTRO_BUTTON}</button>
            ) : (
              <p className="hint">нээгдэж байна...</p>
            )}
          </section>
        </>
      )}

      {scene && (
        <section className="page" onPointerMove={tilt} onPointerLeave={untilt}>
          <div className="tilt" ref={tiltRef}>
            <Bear
              mood={(answer ? scene[answer].mascot : scene.mascot).mood}
              say={poke || (answer ? scene[answer].mascot : scene.mascot).say}
              hop={hop}
              dance={answer === "yes"}
              onPoke={pokeMascot}
            />
            <article key={stage} className={`paper ${paperAnim}`} aria-live="polite">
              <div className="stamp" aria-hidden="true">
                <span>♡</span>
                <small>{String(stage).padStart(2, "0")}</small>
              </div>
              <div className="ic">{scene.icon}</div>
              <Title text={scene.title} long={scene.title.length > 24} />

              {scene.list ? (
                <PromiseList items={scene.list} onDone={setTyped} />
              ) : (
                <Typewriter text={scene.text} onDone={setTyped} className={`tx ${scene.final ? "q" : ""}`} />
              )}

              {scene.next && (
                <div className={`row actions ${typed ? "show" : ""}`}>
                  <button className="btn" onClick={() => goTo(stage + 1)}>{scene.next} →</button>
                </div>
              )}

              {scene.final && (
                <div className={`actions ${typed ? "show" : ""}`}>
                  {answer === null ? (
                    <div className="row choices">
                      <button className="btn" onClick={() => choose("yes")}>{scene.yes.button}</button>
                      <button className="btn ghost" onClick={() => choose("wait")}>{scene.wait.button}</button>
                    </div>
                  ) : (
                    <div className="reply">
                      <p>{scene[answer].reply}</p>
                      <p className="sign">{SIGNATURE}</p>
                      <div className="row">
                        <button className="btn ghost" onClick={() => goTo(0)}>↺ Дахин унших</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {scene.final && <Burst key={answer || "first"} />}
            </article>
          </div>

          <nav className="nav">
            <button className="b" onClick={() => goTo(stage - 1)}>← өмнөх</button>
            <div className="dots" aria-label={`${stage} / ${SCENES.length}`}>
              {SCENES.map((_, i) => (
                <i key={i} className={i < stage ? "on" : ""} />
              ))}
            </div>
          </nav>
        </section>
      )}
    </main>
  );
}