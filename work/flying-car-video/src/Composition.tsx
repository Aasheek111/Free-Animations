import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* ------------------------------------------------------------------ */
/* Config & colors                                                     */
/* ------------------------------------------------------------------ */
const FPS = 30;
const DURATION = 600; // 20 seconds
const WHITE = "#FFFFFF";
const BLACK = "#202124";
const GREY = "#858B94";
const LIGHT = "#F3F5F4";
const GREEN = "#20B879";
const GOLD = "#FFC83D";
const PURPLE = "#7C5CFF";

// Brand colors
const YT_RED = "#FF0000";
const FB_BLUE = "#1877F2";
const FIVERR = "#1DBF73";
const UPWORK = "#14A800";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const ease = Easing.bezier(0.16, 1, 0.3, 1);

const appear = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
const rise = (f: number, a: number, b: number, d = 40) =>
  interpolate(f, [a, b], [d, 0], { ...clamp, easing: ease });

const money = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;

/* ------------------------------------------------------------------ */
/* Text                                                                */
/* ------------------------------------------------------------------ */
const Txt: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 32, color = BLACK, weight = 600, style }) => (
  <div
    style={{
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: size,
      color,
      fontWeight: weight,
      lineHeight: 1.15,
      ...style,
    }}
  >
    {children}
  </div>
);

const Label: React.FC<{ children: React.ReactNode; bg: string; color: string }> = ({
  children,
  bg,
  color,
}) => (
  <div
    style={{
      display: "inline-block",
      padding: "10px 22px",
      background: bg,
      color,
      borderRadius: 30,
      fontSize: 22,
      fontWeight: 800,
      letterSpacing: 2,
      fontFamily: "Arial, Helvetica, sans-serif",
    }}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* Animation helpers                                                   */
/* ------------------------------------------------------------------ */
// Springy pop-in (uses the scene's local frame)
const Pop: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at, children, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: Math.max(0, f - at),
    fps,
    config: { damping: 11, stiffness: 150 },
  });
  const o = interpolate(f, [at, at + 4], [0, 1], clamp);
  return (
    <div style={{ opacity: o, transform: `scale(${0.3 + 0.7 * s})`, ...style }}>
      {children}
    </div>
  );
};

// Slide-up fade-in
const Rise: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at, children, style }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        opacity: appear(f, at, at + 16),
        transform: `translateY(${rise(f, at, at + 16)}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Gentle floating loop for icons
const Float: React.FC<{ children: React.ReactNode; phase?: number }> = ({
  children,
  phase = 0,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ transform: `translateY(${Math.sin(f / 10 + phase) * 8}px)` }}>
      {children}
    </div>
  );
};

// Scene wrapper: local timeline + fade in/out
const Scene: React.FC<{
  from: number;
  duration: number;
  children: React.ReactNode;
  fadeOut?: boolean;
}> = ({ from, duration, children, fadeOut = true }) => (
  <Sequence from={from} durationInFrames={duration}>
    <SceneInner duration={duration} fadeOut={fadeOut}>
      {children}
    </SceneInner>
  </Sequence>
);

const SceneInner: React.FC<{
  duration: number;
  fadeOut: boolean;
  children: React.ReactNode;
}> = ({ duration, fadeOut, children }) => {
  const f = useCurrentFrame();
  const o = Math.min(
    appear(f, 0, 10),
    fadeOut ? 1 - appear(f, duration - 10, duration) : 1
  );
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

// Sound effect (frame is local to the scene)
const Sfx: React.FC<{
  name: "whoosh" | "pop" | "ding" | "tick" | "tada";
  at: number;
  volume?: number;
}> = ({ name, at, volume = 0.6 }) => (
  <Sequence from={at} durationInFrames={60}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */
const YouTubeIcon: React.FC<{ size?: number }> = ({ size = 160 }) => (
  <svg viewBox="0 0 120 84" width={size} height={(size * 84) / 120}>
    <rect width="120" height="84" rx="22" fill={YT_RED} />
    <polygon points="48,24 48,60 82,42" fill="#fff" />
  </svg>
);

const FacebookIcon: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    <defs>
      <clipPath id="fbclip">
        <circle cx="50" cy="50" r="50" />
      </clipPath>
    </defs>
    <circle cx="50" cy="50" r="50" fill={FB_BLUE} />
    <path
      clipPath="url(#fbclip)"
      d="M56 100V62h13l2-15H56v-9c0-4 1.2-7 7-7h8V18c-1.4-.2-6.2-.6-11.8-.6C48 17.4 40 24.6 40 37v10H27v15h13v38z"
      fill="#fff"
    />
  </svg>
);

const InstagramIcon: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    <defs>
      <linearGradient id="ig" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#FEDA75" />
        <stop offset="0.3" stopColor="#FA7E1E" />
        <stop offset="0.55" stopColor="#D62976" />
        <stop offset="0.8" stopColor="#962FBF" />
        <stop offset="1" stopColor="#4F5BD5" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="28" fill="url(#ig)" />
    <rect x="23" y="23" width="54" height="54" rx="17" fill="none" stroke="#fff" strokeWidth="6" />
    <circle cx="50" cy="50" r="13" fill="none" stroke="#fff" strokeWidth="6" />
    <circle cx="67" cy="33" r="4" fill="#fff" />
  </svg>
);

const Badge: React.FC<{ text: string; bg: string; size?: number; fs?: number }> = ({
  text,
  bg,
  size = 140,
  fs = 38,
}) => (
  <svg viewBox="0 0 140 100" width={size} height={(size * 100) / 140}>
    <rect width="140" height="100" rx="26" fill={bg} />
    <text
      x="70"
      y="60"
      textAnchor="middle"
      fontSize={fs}
      fontWeight="800"
      fontFamily="Arial, Helvetica, sans-serif"
      fill="#fff"
    >
      {text}
    </text>
  </svg>
);

const Coin: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    <circle cx="50" cy="50" r="46" fill={GOLD} stroke="#E8A200" strokeWidth="6" />
    <circle cx="50" cy="50" r="34" fill="none" stroke="#FFE08A" strokeWidth="3" />
    <text
      x="50"
      y="67"
      textAnchor="middle"
      fontSize="50"
      fontWeight="800"
      fontFamily="Arial, Helvetica, sans-serif"
      fill="#B77900"
    >
      $
    </text>
  </svg>
);

const Sparkle: React.FC<{ size?: number; color?: string }> = ({
  size = 100,
  color = PURPLE,
}) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    <path
      d="M50 4C54 30 70 46 96 50C70 54 54 70 50 96C46 70 30 54 4 50C30 46 46 30 50 4Z"
      fill={color}
    />
  </svg>
);

// Line icons
const Line: React.FC<{ color: string; size?: number; children: React.ReactNode }> = ({
  color,
  size = 60,
  children,
}) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const DocIcon = ({ c = PURPLE, s = 60 }) => (
  <Line color={c} size={s}>
    <rect x="26" y="14" width="48" height="72" rx="8" />
    <path d="M38 38H62M38 52H62M38 66H54" />
  </Line>
);
const MicIcon = ({ c = "#F5A000", s = 60 }) => (
  <Line color={c} size={s}>
    <rect x="38" y="12" width="24" height="44" rx="12" />
    <path d="M26 44c0 16 10 26 24 26s24-10 24-26M50 70V86M38 86H62" />
  </Line>
);
const UploadIcon = ({ c = YT_RED, s = 60 }) => (
  <Line color={c} size={s}>
    <path d="M50 66V26M32 42L50 24L68 42M22 80H78" />
  </Line>
);
const CalendarIcon = ({ c = FB_BLUE, s = 60 }) => (
  <Line color={c} size={s}>
    <rect x="18" y="24" width="64" height="58" rx="10" />
    <path d="M18 44H82M36 14V32M64 14V32" />
    <circle cx="38" cy="62" r="3" fill={c} />
    <circle cx="62" cy="62" r="3" fill={c} />
  </Line>
);
const ChatIcon = ({ c = GREEN, s = 60 }) => (
  <Line color={c} size={s}>
    <path d="M22 20H78a6 6 0 0 1 6 6V58a6 6 0 0 1-6 6H48L32 80V64H22a6 6 0 0 1-6-6V26a6 6 0 0 1 6-6Z" />
  </Line>
);

const IconBox: React.FC<{ bg: string; children: React.ReactNode }> = ({
  bg,
  children,
}) => (
  <div
    style={{
      width: 96,
      height: 96,
      borderRadius: 26,
      background: bg,
      display: "grid",
      placeItems: "center",
      flexShrink: 0,
    }}
  >
    {children}
  </div>
);

const StepRow: React.FC<{
  bg: string;
  icon: React.ReactNode;
  title: string;
}> = ({ bg, icon, title }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 26,
      padding: "16px 26px",
      borderRadius: 28,
      background: WHITE,
      border: "2px solid #E4E8E5",
      boxShadow: "0 10px 28px #0000000a",
    }}
  >
    <IconBox bg={bg}>{icon}</IconBox>
    <Txt size={34} weight={700}>
      {title}
    </Txt>
  </div>
);

/* ------------------------------------------------------------------ */
/* Scene 1: Intro (0 - 100)                                            */
/* ------------------------------------------------------------------ */
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Sfx name="whoosh" at={0} />
      <Sfx name="ding" at={6} volume={0.5} />
      <Sfx name="pop" at={42} />
      <Sfx name="pop" at={60} />
      <Sfx name="ding" at={78} volume={0.5} />

      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Pop at={4}>
          <div style={{ transform: `rotate(${f * 1.2}deg)` }}>
            <Sparkle size={190} />
          </div>
        </Pop>
      </div>

      <div style={{ position: "absolute", top: 520, left: 60, right: 60, textAlign: "center" }}>
        <Rise at={12}>
          <Txt size={86} weight={800}>2 Ways to Earn</Txt>
        </Rise>
        <Rise at={20}>
          <Txt size={104} weight={800} color={GREEN}>Money with AI</Txt>
        </Rise>
      </div>

      <div style={{ position: "absolute", top: 940, left: 80, right: 80, display: "flex", flexDirection: "column", gap: 34 }}>
        <Pop at={40}>
          <WayCard n="1" color={YT_RED} title="Videos & Reels">
            <YouTubeIcon size={90} />
            <FacebookIcon size={64} />
          </WayCard>
        </Pop>
        <Pop at={58}>
          <WayCard n="2" color={FB_BLUE} title="Social Media & Freelancing">
            <InstagramIcon size={64} />
            <Badge text="fiverr" bg={FIVERR} size={90} fs={34} />
          </WayCard>
        </Pop>
      </div>

      <div style={{ position: "absolute", top: 1560, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Pop at={72}>
          <Float>
            <Coin size={140} />
          </Float>
        </Pop>
      </div>
    </>
  );
};

const WayCard: React.FC<{
  n: string;
  color: string;
  title: string;
  children: React.ReactNode;
}> = ({ n, color, title, children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 26,
      padding: "26px 32px",
      borderRadius: 32,
      background: LIGHT,
    }}
  >
    <div
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        background: color,
        color: WHITE,
        display: "grid",
        placeItems: "center",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 38,
        fontWeight: 800,
        flexShrink: 0,
      }}
    >
      {n}
    </div>
    <Txt size={34} weight={800} style={{ flex: 1 }}>
      {title}
    </Txt>
    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>{children}</div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Scene 2: Way 1 - Videos & Reels (100 - 300)                          */
/* ------------------------------------------------------------------ */
const WayOne: React.FC = () => {
  const f = useCurrentFrame();
  const earn = interpolate(f, [130, 185], [0, 1200], { ...clamp, easing: ease });
  return (
    <>
      <Sfx name="whoosh" at={0} />
      <Sfx name="pop" at={12} />
      <Sfx name="pop" at={24} />
      <Sfx name="pop" at={48} />
      <Sfx name="pop" at={74} />
      <Sfx name="pop" at={100} />
      <Sfx name="ding" at={130} volume={0.5} />
      <Sfx name="tick" at={140} volume={0.3} />
      <Sfx name="tick" at={152} volume={0.3} />
      <Sfx name="tick" at={164} volume={0.3} />
      <Sfx name="tick" at={176} volume={0.3} />
      <Sfx name="ding" at={186} />

      <div style={{ position: "absolute", top: 170, left: 75, right: 75 }}>
        <Rise at={0}>
          <Label bg="#FFE9E9" color={YT_RED}>WAY 1</Label>
        </Rise>
        <Rise at={6} style={{ marginTop: 26 }}>
          <Txt size={84} weight={800}>Videos & Reels</Txt>
          <Txt size={84} weight={800} color={GREEN}>made with AI</Txt>
        </Rise>
      </div>

      {/* Platform icons */}
      <div style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 60 }}>
        <Pop at={12}>
          <Float>
            <YouTubeIcon size={250} />
          </Float>
        </Pop>
        <Pop at={24}>
          <Float phase={2}>
            <div style={{ textAlign: "center" }}>
              <FacebookIcon size={180} />
              <Txt size={26} weight={800} color={FB_BLUE} style={{ marginTop: 8 }}>
                REELS
              </Txt>
            </div>
          </Float>
        </Pop>
      </div>

      {/* Steps */}
      <div style={{ position: "absolute", top: 860, left: 75, right: 75, display: "flex", flexDirection: "column", gap: 24 }}>
        <Pop at={48}>
          <StepRow bg="#EFEAFF" icon={<DocIcon />} title="AI writes the script" />
        </Pop>
        <Pop at={74}>
          <StepRow bg="#FFF3DB" icon={<MicIcon />} title="AI adds voice & visuals" />
        </Pop>
        <Pop at={100}>
          <StepRow bg="#FFE9E9" icon={<UploadIcon />} title="Post daily & grow views" />
        </Pop>
      </div>

      {/* Earnings */}
      <Rise at={125} style={{ position: "absolute", top: 1410, left: 75, right: 75 }}>
        <div
          style={{
            padding: "28px 34px",
            borderRadius: 30,
            background: "#E8F8F0",
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <Coin size={100} />
          <div style={{ flex: 1 }}>
            <Txt size={22} color={GREY} weight={700}>AD REVENUE + BONUSES</Txt>
            <Txt size={74} weight={800} color={GREEN}>{money(earn)}</Txt>
          </div>
        </div>
      </Rise>

      <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, textAlign: "center" }}>
        <Txt size={19} color={GREY}>ILLUSTRATIVE FIGURES</Txt>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 3: Way 2 - Social media handling & freelancing (300 - 500)     */
/* ------------------------------------------------------------------ */
const Client: React.FC<{ letter: string; color: string; name: string; amount: string }> = ({
  letter,
  color,
  name,
  amount,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 22,
      padding: "14px 26px",
      borderRadius: 26,
      background: WHITE,
      border: "2px solid #E4E8E5",
    }}
  >
    <div
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        background: color,
        color: WHITE,
        display: "grid",
        placeItems: "center",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 34,
        fontWeight: 800,
      }}
    >
      {letter}
    </div>
    <Txt size={32} weight={700} style={{ flex: 1 }}>{name}</Txt>
    <Txt size={38} weight={800} color={GREEN}>{amount}</Txt>
  </div>
);

const WayTwo: React.FC = () => {
  const f = useCurrentFrame();
  const total = interpolate(f, [120, 170], [0, 650], { ...clamp, easing: ease });
  return (
    <>
      <Sfx name="whoosh" at={0} />
      <Sfx name="pop" at={10} />
      <Sfx name="pop" at={18} />
      <Sfx name="pop" at={26} />
      <Sfx name="pop" at={34} />
      <Sfx name="pop" at={55} />
      <Sfx name="pop" at={70} />
      <Sfx name="pop" at={85} />
      <Sfx name="ding" at={100} volume={0.5} />
      <Sfx name="ding" at={112} volume={0.5} />
      <Sfx name="ding" at={124} volume={0.5} />
      <Sfx name="tick" at={136} volume={0.3} />
      <Sfx name="tick" at={148} volume={0.3} />
      <Sfx name="tick" at={160} volume={0.3} />
      <Sfx name="ding" at={172} />

      <div style={{ position: "absolute", top: 170, left: 75, right: 75 }}>
        <Rise at={0}>
          <Label bg="#E8F1FF" color={FB_BLUE}>WAY 2</Label>
        </Rise>
        <Rise at={6} style={{ marginTop: 26 }}>
          <Txt size={78} weight={800}>Social Media</Txt>
          <Txt size={78} weight={800} color={GREEN}>& Freelancing</Txt>
        </Rise>
      </div>

      {/* Platform icons */}
      <div style={{ position: "absolute", top: 480, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 34 }}>
        <Pop at={10}><Float><FacebookIcon size={140} /></Float></Pop>
        <Pop at={18}><Float phase={1}><InstagramIcon size={140} /></Float></Pop>
        <Pop at={26}><Float phase={2}><Badge text="fiverr" bg={FIVERR} size={170} fs={34} /></Float></Pop>
        <Pop at={34}><Float phase={3}><Badge text="Upwork" bg={UPWORK} size={170} fs={28} /></Float></Pop>
      </div>

      {/* Tasks AI helps with */}
      <div style={{ position: "absolute", top: 720, left: 75, right: 75, display: "flex", flexDirection: "column", gap: 20 }}>
        <Pop at={55}>
          <StepRow bg="#E8F1FF" icon={<CalendarIcon />} title="Schedule posts with AI" />
        </Pop>
        <Pop at={70}>
          <StepRow bg="#E6F8EF" icon={<ChatIcon />} title="Reply to comments & DMs" />
        </Pop>
        <Pop at={85}>
          <StepRow bg="#EFEAFF" icon={<Sparkle size={52} />} title="Write captions in seconds" />
        </Pop>
      </div>

      {/* Clients */}
      <div style={{ position: "absolute", top: 1170, left: 75, right: 75, display: "flex", flexDirection: "column", gap: 18 }}>
        <Pop at={100}><Client letter="A" color="#FF8A3D" name="Client A" amount="+$150" /></Pop>
        <Pop at={112}><Client letter="B" color={FB_BLUE} name="Client B" amount="+$200" /></Pop>
        <Pop at={124}><Client letter="C" color={PURPLE} name="Client C" amount="+$300" /></Pop>
      </div>

      <Rise at={135} style={{ position: "absolute", top: 1590, left: 75, right: 75 }}>
        <div
          style={{
            padding: "22px 34px",
            borderRadius: 28,
            background: "#E8F8F0",
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <Coin size={80} />
          <Txt size={26} color={GREY} weight={700} style={{ flex: 1 }}>PER MONTH</Txt>
          <Txt size={68} weight={800} color={GREEN}>{money(total)}</Txt>
        </div>
      </Rise>

      <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, textAlign: "center" }}>
        <Txt size={19} color={GREY}>ILLUSTRATIVE FIGURES</Txt>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 4: Outro (500 - 600)                                          */
/* ------------------------------------------------------------------ */
const CoinRain: React.FC = () => {
  const f = useCurrentFrame();
  const xs = [90, 240, 390, 540, 690, 840, 960];
  return (
    <>
      {xs.map((x, i) => {
        const y = ((f * 9 + i * 330) % 2200) - 200;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              opacity: 0.9,
              transform: `rotate(${f * 4 + i * 40}deg)`,
            }}
          >
            <Coin size={60} />
          </div>
        );
      })}
    </>
  );
};

const Outro: React.FC = () => (
  <>
    <Sfx name="tada" at={6} volume={0.7} />
    <Sfx name="pop" at={30} />
    <Sfx name="pop" at={42} />
    <CoinRain />

    <div style={{ position: "absolute", top: 420, left: 60, right: 60, textAlign: "center" }}>
      <Rise at={4}><Txt size={96} weight={800}>Pick one.</Txt></Rise>
      <Rise at={12}><Txt size={110} weight={800} color={GREEN}>Start today.</Txt></Rise>
    </div>

    <div style={{ position: "absolute", top: 860, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 50 }}>
      <Pop at={30}>
        <div style={{ padding: 34, borderRadius: 36, background: WHITE, border: "2px solid #E4E8E5", boxShadow: "0 12px 34px #0000000d", textAlign: "center" }}>
          <YouTubeIcon size={170} />
          <Txt size={30} weight={800} style={{ marginTop: 20 }}>Videos & Reels</Txt>
        </div>
      </Pop>
      <Pop at={42}>
        <div style={{ padding: 34, borderRadius: 36, background: WHITE, border: "2px solid #E4E8E5", boxShadow: "0 12px 34px #0000000d", textAlign: "center" }}>
          <Badge text="fiverr" bg={FIVERR} size={170} fs={34} />
          <Txt size={30} weight={800} style={{ marginTop: 20 }}>Freelancing</Txt>
        </div>
      </Pop>
    </div>

    <Rise at={55} style={{ position: "absolute", top: 1330, left: 90, right: 90 }}>
      <div style={{ padding: 28, borderRadius: 24, background: "#E8F8F0", textAlign: "center" }}>
        <Txt size={32} color="#176C4B" weight={800}>AI + SKILL + CONSISTENCY</Txt>
      </div>
    </Rise>

    <div style={{ position: "absolute", bottom: 120, left: 0, right: 0, textAlign: "center" }}>
      <Txt size={19} color={GREY}>EARNINGS SHOWN ARE ILLUSTRATIVE</Txt>
    </div>
  </>
);

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */
const MyComponent: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: WHITE,
        overflow: "hidden",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* Progress line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: "#EDF0EE",
          zIndex: 10,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(f / (DURATION - 1)) * 100}%`,
            background: GREEN,
          }}
        />
      </div>

      <Scene from={0} duration={100}><Intro /></Scene>
      <Scene from={100} duration={200}><WayOne /></Scene>
      <Scene from={300} duration={200}><WayTwo /></Scene>
      <Scene from={500} duration={100} fadeOut={false}><Outro /></Scene>
    </AbsoluteFill>
  );
};

export const MyComposition: React.FC = () => (
  <Composition
    id="AIMoneyTwoWays"
    component={MyComponent}
    durationInFrames={DURATION}
    fps={FPS}
    width={1080}
    height={1920}
  />
);