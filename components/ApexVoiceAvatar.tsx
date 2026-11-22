"use client";

import { useEffect, useState } from "react";
import { Camera, Mic, MicOff, MessageSquare, Radio } from "lucide-react";

type VoiceState = "standby" | "listening" | "thinking" | "speaking" | "error";
const LABEL: Record<VoiceState, string> = { standby:"STANDBY", listening:"LISTENING", thinking:"THINKING", speaking:"SPEAKING", error:"VOICE CONNECTION ERROR" };

export default function ApexVoiceAvatar() {
  const [state, setState] = useState<VoiceState>("standby");
  const [photoMode, setPhotoMode] = useState(false);
  useEffect(() => {
    const onState = (event: Event) => {
      const next = (event as CustomEvent<string>).detail;
      if (["standby","listening","thinking","speaking","error"].includes(next)) setState(next as VoiceState);
    };
    const onPhotoOpened = () => setPhotoMode(true);
    window.addEventListener("neas:voice-state", onState);
    window.addEventListener("neas:photo-opened", onPhotoOpened);
    return () => { window.removeEventListener("neas:voice-state", onState); window.removeEventListener("neas:photo-opened", onPhotoOpened); };
  }, []);
  const startVoice = () => { setPhotoMode(false); window.dispatchEvent(new CustomEvent("neas:voice-start")); };
  const openPhoto = () => { setPhotoMode(true); window.dispatchEvent(new CustomEvent("neas:photo-open")); };
  return (
    <div className="neas-avatar-console" data-state={state} aria-label="NEAS AI voice avatar">
      <div className="neas-avatar-portrait" aria-hidden="true">
        <div className="neas-avatar-halo" />
        <svg viewBox="0 0 240 260">
          <defs>
            <linearGradient id="neasFace" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b8f7ff" stopOpacity=".92"/><stop offset=".42" stopColor="#168fba" stopOpacity=".72"/><stop offset="1" stopColor="#052d4a" stopOpacity=".96"/></linearGradient>
            <linearGradient id="neasStroke" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a5f7ff"/><stop offset="1" stopColor="#168dc5"/></linearGradient>
            <filter id="neasGlow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <path d="M120 10 C69 10 43 49 43 103 L48 164 C52 211 81 238 120 246 C159 238 188 211 192 164 L197 103 C197 49 171 10 120 10Z" fill="url(#neasFace)" fillOpacity=".34" stroke="url(#neasStroke)" strokeWidth="2.2" filter="url(#neasGlow)"/>
          <path d="M62 104 Q63 44 120 35 Q177 44 178 104 L170 164 Q160 214 120 226 Q80 214 70 164Z" fill="#061e35" fillOpacity=".58" stroke="#53dfff" strokeOpacity=".62"/>
          <path d="M46 103 Q23 95 30 133 Q34 155 54 157 M194 103 Q217 95 210 133 Q206 155 186 157" fill="none" stroke="#53dfff" strokeWidth="3" strokeOpacity=".8"/>
          <path d="M78 104 Q96 88 112 104 Q96 121 78 104Z M128 104 Q144 88 162 104 Q144 121 128 104Z" fill="#06182c" stroke="#65eaff" strokeWidth="2"/>
          <ellipse className="neas-avatar-eye" cx="95" cy="104" rx="8" ry="6" fill="#9ffaff" filter="url(#neasGlow)"/><ellipse className="neas-avatar-eye" cx="145" cy="104" rx="8" ry="6" fill="#9ffaff" filter="url(#neasGlow)"/>
          <path d="M120 112 L109 157 Q120 165 131 157" fill="none" stroke="#62dfff" strokeWidth="2" strokeOpacity=".75"/>
          <path d="M91 178 Q120 190 149 178" fill="none" stroke="#2db8e8" strokeWidth="2" strokeOpacity=".8"/>
          <g className="neas-avatar-mouth" filter="url(#neasGlow)"><path d="M91 187 Q120 198 149 187" fill="none" stroke="#a5faff" strokeWidth="3" strokeLinecap="round"/><path d="M101 190 Q120 195 139 190" fill="none" stroke="#38d6ff" strokeWidth="1.5"/></g>
          <path d="M64 65 L84 55 L93 63 M176 65 L156 55 L147 63 M68 143 L84 151 M172 143 L156 151" fill="none" stroke="#72e8ff" strokeWidth="1.2" strokeOpacity=".7"/>
          <path d="M120 15 V43 M111 24 H129 M54 184 L74 194 M186 184 L166 194 M89 226 L95 243 M151 226 L145 243" fill="none" stroke="#54dfff" strokeOpacity=".55" strokeWidth="1.2"/>
          <path d="M75 78 H91 M149 78 H165 M106 70 H134 M105 212 H135" stroke="#a3faff" strokeOpacity=".45" strokeWidth="1"/><circle cx="120" cy="53" r="3" fill="#c4ffff" filter="url(#neasGlow)"/>
        </svg>
        <div className="neas-avatar-scanline" />
      </div>
      <div className="neas-avatar-caption"><span className="neas-avatar-live-dot"/><span>NEAS AI CORE</span><span className="neas-avatar-state">{LABEL[state]}</span></div>
      <div className="neas-avatar-controls">
        <button type="button" className="neas-avatar-action neas-avatar-mic" onClick={startVoice} aria-label="Start or resume NEAS AI voice conversation" title="Talk to NEAS AI">
          {state === "listening" ? <Radio size={17}/> : state === "speaking" ? <MicOff size={17}/> : <Mic size={17}/>}<span>{state === "listening" ? "LISTENING" : "TALK"}</span>
        </button>
        <button type="button" className={`neas-avatar-action neas-avatar-photo ${photoMode ? "is-active" : ""}`} onClick={openPhoto} aria-label="Open NEAS AI photo and visual input" title="Share a photo with NEAS AI"><Camera size={17}/><span>PHOTO</span></button>
      </div>
      {photoMode && <div className="neas-avatar-photo-hint"><MessageSquare size={12}/> Attach your image in the NEAS AI conversation panel.</div>}
    </div>
  );
}
