"use client";

import Link from "next/link";
import { PurchaseLink } from "@/components/marketing/PurchaseLink";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
  type SyntheticEvent,
} from "react";
import {
  BOOK_COVER_BG_ALT,
  BOOK_TITLE,
  HERO_VIDEO_POSTER_URL,
  HERO_VIDEO_URL,
} from "@/lib/constants";
import { heroTitleFont } from "@/lib/fonts/hero-title";
import { cn } from "@/lib/utils";

/** px scroll → tam daralma (0–1) */
const SCROLL_SHRINK_DISTANCE = 180;

function useHeroShrinkProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const next = Math.min(
        1,
        Math.max(0, window.scrollY / SCROLL_SHRINK_DISTANCE),
      );
      setProgress(next);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

function HeroVideoDialog({
  open,
  onClose,
  videoRef,
}: {
  open: boolean;
  onClose: () => void;
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        void video.play();
      }
    } else if (!open && dialog.open) {
      dialog.close();
      videoRef.current?.pause();
    }
  }, [open, videoRef]);

  return (
    <dialog
      ref={dialogRef}
      className="landing-hero-video__dialog"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="landing-hero-video__dialog-inner">
        <button
          type="button"
          className="landing-hero-video__dialog-close"
          onClick={onClose}
          aria-label="Kapat"
        >
          ×
        </button>
        <video
          ref={videoRef}
          className="landing-hero-video__dialog-video"
          src={HERO_VIDEO_URL}
          poster={HERO_VIDEO_POSTER_URL}
          controls
          playsInline
        />
      </div>
    </dialog>
  );
}

export function LandingHero() {
  const shrinkProgress = useHeroShrinkProgress();
  const [watchOpen, setWatchOpen] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const dialogVideoRef = useRef<HTMLVideoElement>(null);

  const onBgVideoError = useCallback((e: SyntheticEvent<HTMLVideoElement>) => {
    setVideoFailed(true);
    e.currentTarget.style.display = "none";
  }, []);

  return (
    <section className="landing-hero-video" aria-label="Giriş">
      <div className="landing-hero-video__sticky">
        <div
          className="landing-hero-video__frame"
          style={
            { "--hero-shrink": shrinkProgress } as React.CSSProperties
          }
        >
          <div className="landing-hero-video__media" aria-hidden>
            {!videoFailed ? (
              <video
                ref={bgVideoRef}
                className="landing-hero-video__bg"
                src={HERO_VIDEO_URL}
                poster={HERO_VIDEO_POSTER_URL}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onError={onBgVideoError}
              />
            ) : (
              <div
                className="landing-hero-video__poster-fallback"
                style={{
                  backgroundImage: `url(${HERO_VIDEO_POSTER_URL})`,
                }}
              />
            )}
            <div className="landing-hero-video__scrim" />
          </div>

          <header className="landing-hero-video__top">
            <Link
              href="/"
              className={cn(heroTitleFont.className, "landing-hero-video__brand")}
              aria-label={`${BOOK_TITLE} — ana sayfa`}
            >
              {BOOK_TITLE}
            </Link>
            <PurchaseLink className="btn-primary landing-hero-video__buy">
              Satın al
            </PurchaseLink>
          </header>

          <div className="landing-hero-video__bottom">
            <button
              type="button"
              className="btn-hero-white"
              onClick={() => setWatchOpen(true)}
            >
              Videoyu izle
            </button>
          </div>
        </div>
      </div>

      <HeroVideoDialog
        open={watchOpen}
        onClose={() => setWatchOpen(false)}
        videoRef={dialogVideoRef}
      />
    </section>
  );
}
