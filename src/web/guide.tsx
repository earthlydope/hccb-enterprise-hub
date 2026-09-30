import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { hintFor, type HintCopy } from "../guide";
import { useHub } from "../store";

type Spot = { id: string; r: DOMRect };

const CARD_W = 252;
const CARD_H = 104;
const GAP = 58;
const EDGE = 16;

/**
 * Hover guide for the web application.
 *
 * Same idea as the mobile HintStage — highlight the control, draw a curved
 * arrow, explain what it does — but placed as a popover beside the element
 * rather than in the stage gutter, because the desktop layout fills the
 * viewport and scrolls.
 */
export function WebHintStage({ children }: { children: ReactNode }) {
  const hold = useRef<HTMLElement | null>(null);
  const [spot, setSpot] = useState<Spot | null>(null);
  const loc = useLocation();
  const { user, pendingCount, unread } = useHub();

  const measure = (el: HTMLElement) => {
    hold.current = el;
    setSpot({ id: el.dataset.hint ?? "", r: el.getBoundingClientRect() });
  };

  const clear = () => {
    hold.current = null;
    setSpot(null);
  };

  const find = (n: EventTarget | null) => {
    if (!(n instanceof Element)) return null;
    const el = n.closest("[data-hint]");
    return el instanceof HTMLElement && el.dataset.hint ? el : null;
  };

  // Route change invalidates whatever was hovered.
  useEffect(clear, [loc.pathname]);

  // The whole page scrolls, so re-measure (or drop the hint if it left the viewport).
  useEffect(() => {
    const onMove = () => {
      const el = hold.current;
      if (!el || !el.isConnected) return clear();
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return clear();
      setSpot({ id: el.dataset.hint ?? "", r });
    };
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, []);

  const copy = spot ? hintFor(spot.id, user, pendingCount, unread) : null;

  return (
    <div
      onMouseOver={(e) => {
        const el = find(e.target);
        if (el) measure(el);
      }}
      onMouseOut={(e) => {
        const from = find(e.target);
        const to = find(e.relatedTarget);
        if (from && from !== to) {
          if (to) measure(to);
          else clear();
        }
      }}
    >
      {children}
      {spot && copy && <WebHintPaint spot={spot} copy={copy} />}
    </div>
  );
}

function WebHintPaint({ spot, copy }: { spot: Spot; copy: HintCopy }) {
  const { r } = spot;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

  const fitsRight = r.right + GAP + CARD_W <= vw - EDGE;
  const fitsLeft = r.left - GAP - CARD_W >= EDGE;
  const fitsBelow = r.bottom + GAP + CARD_H <= vh - EDGE;
  const fitsAbove = r.top - GAP - CARD_H >= EDGE;

  // A wide section has no useful space beside it — anything placed there lands
  // on the neighbouring content — so those get the card above or below instead.
  const wide = r.width > vw * 0.46;
  const order: ("right" | "left" | "below" | "above")[] = wide
    ? ["below", "above", "right", "left"]
    : ["right", "left", "below", "above"];
  const fits = { right: fitsRight, left: fitsLeft, below: fitsBelow, above: fitsAbove };
  const side = order.find((o) => fits[o]) ?? "below";

  let cardX: number;
  let cardY: number;
  if (side === "right" || side === "left") {
    cardX = side === "right" ? r.right + GAP : r.left - GAP - CARD_W;
    cardY = clamp(cy - CARD_H / 2, EDGE, vh - CARD_H - EDGE);
  } else {
    cardX = clamp(cx - CARD_W / 2, EDGE, vw - CARD_W - EDGE);
    cardY = side === "below" ? r.bottom + GAP : r.top - GAP - CARD_H;
  }

  // Arrow runs from the card towards the nearest edge of the element.
  let sx: number;
  let sy: number;
  let ex: number;
  let ey: number;
  let d: string;

  if (side === "right" || side === "left") {
    sx = side === "right" ? cardX + 6 : cardX + CARD_W - 6;
    sy = cardY + CARD_H / 2;
    ex = side === "right" ? r.right + 10 : r.left - 10;
    ey = clamp(cy, cardY + 8, cardY + CARD_H - 8);
    const span = ex - sx;
    const bow = clamp(Math.abs(span) * 0.45, 30, 76);
    const lift = (ey < vh / 2 ? 1 : -1) * bow;
    d = `M ${sx} ${sy} C ${sx + span * 0.32} ${sy + lift}, ${ex - span * 0.18} ${ey + lift * 0.34}, ${ex} ${ey}`;
  } else {
    sx = clamp(cx, cardX + 16, cardX + CARD_W - 16);
    sy = side === "below" ? cardY + 6 : cardY + CARD_H - 6;
    ex = sx;
    ey = side === "below" ? r.bottom + 10 : r.top - 10;
    const span = ey - sy;
    const bow = clamp(Math.abs(span) * 0.6, 28, 68) * (cx < vw / 2 ? 1 : -1);
    d = `M ${sx} ${sy} C ${sx + bow} ${sy + span * 0.3}, ${ex + bow} ${ey - span * 0.25}, ${ex} ${ey}`;
  }

  return (
    <div className="whint" aria-hidden>
      <div
        className="whint-spot"
        style={{ left: r.left - 3, top: r.top - 3, width: r.width + 6, height: r.height + 6 }}
      />
      <svg className="whint-svg" width={vw} height={vh} viewBox={`0 0 ${vw} ${vh}`}>
        <defs>
          <marker id="whint-head" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0 0 L9 4.5 L0 9 Z" fill="#f40009" />
          </marker>
        </defs>
        <path className="whint-curve" pathLength={1} d={d} markerEnd="url(#whint-head)" />
      </svg>
      <div className="whint-card" style={{ left: cardX, top: cardY, width: CARD_W }}>
        <b>{copy.title}</b>
        <span>{copy.body}</span>
      </div>
    </div>
  );
}
