"use client";

import { useEffect } from "react";
const AGENT_ID = "agent_4401m7e4gjxfejwbvx9t4vgr8bth";
const EMBED_URL = "https://unpkg.com/@elevenlabs/convai-widget-embed";
type ConvaiElement = HTMLElement & { startConversation?: () => Promise<void>; endConversation?: () => Promise<void> };

export default function ElevenLabsVoiceWidget() {
  useEffect(() => {
    const host = document.getElementById("neas-elevenlabs-widget");
    if (!host) return;
    let widget = host.querySelector("elevenlabs-convai") as ConvaiElement | null;
    if (!widget) {
      widget = document.createElement("elevenlabs-convai") as ConvaiElement;
      widget.setAttribute("agent-id", AGENT_ID);
      widget.setAttribute("action-text", "Talk to NEAS AI");
      widget.setAttribute("start-call-text", "Start voice conversation");
      widget.setAttribute("end-call-text", "End conversation");
      widget.setAttribute("listening-text", "NEAS AI is listening");
      widget.setAttribute("speaking-text", "NEAS AI is responding");
      widget.setAttribute("variant", "expanded");
      host.appendChild(widget);
    }
    host.style.display = "none";
    host.style.position = "fixed"; host.style.right = "18px"; host.style.bottom = "18px"; host.style.zIndex = "1000";
    const emit = (state: string) => window.dispatchEvent(new CustomEvent("neas:voice-state", { detail: state }));
    const onStart = async () => { emit("listening"); try { await widget?.startConversation?.(); } catch { emit("error"); } };
    const onPhoto = () => { host.style.display = "block"; widget?.setAttribute("variant","expanded"); window.dispatchEvent(new CustomEvent("neas:photo-opened")); };
    const onStarted = () => emit("listening");
    const onEnded = () => emit("standby");
    const onAgentResponse = () => emit("speaking");
    const onAgentResponseComplete = () => emit("listening");
    const onUserTranscript = () => emit("thinking");
    const onClientError = () => emit("error");
    window.addEventListener("neas:voice-start", onStart);
    window.addEventListener("neas:photo-open", onPhoto);
    widget.addEventListener("conversationStarted", onStarted);
    widget.addEventListener("conversationEnded", onEnded);
    widget.addEventListener("agentResponse", onAgentResponse);
    widget.addEventListener("agentResponseComplete", onAgentResponseComplete);
    widget.addEventListener("userTranscript", onUserTranscript);
    widget.addEventListener("clientError", onClientError);
    const existing = document.querySelector('script[data-neas-elevenlabs="true"]');
    if (!existing) {
      const script = document.createElement("script"); script.src = EMBED_URL; script.async = true; script.type = "text/javascript"; script.dataset.neasElevenlabs = "true"; document.body.appendChild(script);
    }
    return () => {
      window.removeEventListener("neas:voice-start", onStart); window.removeEventListener("neas:photo-open", onPhoto);
      widget?.removeEventListener("conversationStarted", onStarted); widget?.removeEventListener("conversationEnded", onEnded);
      widget?.removeEventListener("agentResponse", onAgentResponse); widget?.removeEventListener("agentResponseComplete", onAgentResponseComplete);
      widget?.removeEventListener("userTranscript", onUserTranscript); widget?.removeEventListener("clientError", onClientError);
    };
  }, []);
  return <div id="neas-elevenlabs-widget" aria-label="NEAS AI voice and multimodal conversation"/>;
}
