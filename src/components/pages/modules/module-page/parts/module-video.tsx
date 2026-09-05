"use client";

import { trackModuleEvent } from "@/lib/analytics";
import type { ModuleVideo as Video } from "@/lib/content/modules/module-pages/types";
import styles from "@/components/pages/modules/modules.module.css";

/**
 * The module walkthrough.
 *
 * Rendered only when a recording actually exists — the template does not call
 * this otherwise, so there is no player sitting on the page implying a video
 * that has never been made. Native controls keep it keyboard-accessible; the
 * poster reserves the frame so nothing shifts when the file loads.
 */
export function ModuleVideo({
  video,
  moduleSlug,
}: {
  video: Video;
  moduleSlug: string;
}) {
  const minutes = Math.floor(video.duration / 60);
  const seconds = String(video.duration % 60).padStart(2, "0");

  return (
    <section className={styles.modulePage__video} aria-labelledby="module-video">
      <div className={styles.modulePage__shell}>
        <header className={styles.modulePage__sectionHead}>
          <p className={styles.modulePage__eyebrow} data-reveal>
            <span className={styles.modulePage__eyebrowDot} aria-hidden="true" />
            Walkthrough · {minutes}:{seconds}
          </p>
          <h2 id="module-video" data-reveal>
            {video.title}
          </h2>
        </header>

        <div className={styles.modulePage__videoFrame} data-reveal>
          <video
            controls
            preload="none"
            poster={video.poster}
            onPlay={() =>
              trackModuleEvent("module_video_played", { module: moduleSlug })
            }
          >
            <source src={video.url} type="video/mp4" />
            Your browser cannot play this recording.
          </video>
        </div>
      </div>
    </section>
  );
}
