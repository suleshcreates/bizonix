"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, ArrowUpRight, Check, Clock3, Video, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { demoAgenda, successCopy, type DemoTrack } from "@/lib/content/contact/contact-content";
import { readUtmParams, track } from "@/lib/analytics";
import { DemoForm, type FormValues } from "./sections/demo-form";
import { BookingPanel } from "./sections/booking-panel";
import { DemoFaq } from "./sections/demo-faq";
import { AltContact } from "./sections/alt-contact";
import { DemoStudioScene } from "./sections/demo-studio-scene";
import styles from "./contact.module.css";

const subscribe = () => () => {};
const landingTrack = (): DemoTrack => new URLSearchParams(window.location.search).get("track") === "book" ? "book" : "brief";
const serverTrack = (): DemoTrack => "brief";

export function ContactPage() {
  const initialTrack = useSyncExternalStore(subscribe, landingTrack, serverTrack);
  const [chosen, setChosen] = useState<DemoTrack | null>(null);
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const action = useRef<HTMLDivElement>(null);
  const success = useRef<HTMLDivElement>(null);
  const counted = useRef(false);
  const reduced = useReducedMotion();
  const activeTrack = chosen ?? initialTrack;

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;
    track("contact_page_view", { ...readUtmParams(new URLSearchParams(window.location.search)), entry_track: landingTrack() });
  }, []);

  useEffect(() => {
    if (reduced || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from("[data-studio-enter]", { opacity: 0, y: 20, stagger: 0.09, duration: 0.85, ease: "power3.out" });
      gsap.utils.toArray<HTMLElement>("[data-studio-reveal]").forEach((element) => {
        gsap.from(element, { opacity: 0, y: 22, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 90%", once: true } });
      });
    }, root);
    return () => context.revert();
  }, [reduced]);

  useEffect(() => {
    if (submitted) success.current?.scrollIntoView({ block: "center", behavior: reduced ? "instant" : "smooth" });
  }, [submitted, reduced]);

  function choose(next: DemoTrack, scroll = false) {
    setChosen(next);
    track("contact_track_selected", { track: next });
    if (scroll) action.current?.scrollIntoView({ block: "start", behavior: reduced ? "instant" : "smooth" });
  }

  return (
    <div ref={root} className={styles.contact__page + " " + styles.studioPage}>
      <section className={styles.studioHero} id="book" aria-labelledby="contact-title">
        <div className={styles.studioAura} aria-hidden="true" />
        <div className={styles.studioShell}>
          <div className={styles.studioTopline} data-studio-enter><span><i /> BIZONIX / DEMO STUDIO</span><span>A closer look. A clearer decision.</span></div>
          <div className={styles.studioGrid}>
            <div className={styles.studioEditorial}>
              <p className={styles.studioEyebrow} data-studio-enter>YOUR BUSINESS. IN THE PICTURE.</p>
              <h1 id="contact-title" data-studio-enter>Bring your operation.<br /><em>See it connected.</em></h1>
              <p className={styles.studioLede} data-studio-enter>From the first receipt to the final entry in your books. See how Bizonix brings your warehouse, stores and franchise network together.</p>
              <div className={styles.studioMeta} data-studio-enter><span><Clock3 size={15} /> 30-minute working session</span><span><Video size={16} /> One-to-one walkthrough</span></div>
              <a className={styles.studioMobileCta} href="#demo-request">Shape my demo <ArrowRight size={16} /></a>
            </div>
            <div className={styles.studioVisual} data-studio-enter><DemoStudioScene /><p className={styles.studioFootnote}><ShieldCheck size={15} /> We’ll explore the fit, the gaps and the next step.</p></div>
            <div className={styles.studioRequest} id="demo-request" ref={action} data-studio-enter>
              <div className={styles.studioRequestLabel}><span><i /> YOUR PERSONAL WALKTHROUGH</span><ArrowUpRight size={18} /></div>
              {submitted ? <div ref={success} className={styles.studioConfirmation} role="status">
                <CheckCircle2 size={34} /><h2>{successCopy.title}</h2><p>{successCopy.body}</p>
                <BookingPanel compact prefill={{ email: submitted.email, company: submitted.companyName }} />
              </div> : <>
                <div className={styles.studioTabs} role="group" aria-label="Choose how to book your demo">
                  <button type="button" aria-pressed={activeTrack === "brief"} onClick={() => choose("brief")}>Tailor my demo</button>
                  <button type="button" aria-pressed={activeTrack === "book"} onClick={() => choose("book")}>Find a time <ArrowUpRight size={13} /></button>
                </div>
                <div hidden={activeTrack !== "brief"}><DemoForm onSuccess={setSubmitted} /></div>
                {activeTrack === "book" && <div className={styles.studioCalendar}><h2>Make room for a clearer view.</h2><p>Choose a time for your team’s working session.</p><BookingPanel compact onRequestDetails={() => choose("brief")} /></div>}
                <div className={styles.studioPrivacy}><ShieldCheck size={14} /><span>Your details are used to coordinate your demo. <a href="/privacy">Privacy policy</a></span></div>
              </>}
            </div>
          </div>
          <div className={styles.studioPromise} data-studio-enter><span>BUILT AROUND YOUR REALITY</span><p><Check size={14} /> Your workflows</p><p><Check size={14} /> Your operating entities</p><p><Check size={14} /> Your questions</p></div>
        </div>
      </section>
      <section className={styles.studioShell + " " + styles.studioAgenda} aria-labelledby="agenda-title">
        <header data-studio-reveal><div><p className={styles.studioLightEyebrow}>THE SESSION, UNPACKED</p><h2 id="agenda-title">Thirty minutes.<br /><em>A much clearer picture.</em></h2></div><p>We open the product and follow the work.<br />Here’s how the conversation unfolds.</p></header>
        <ol className={styles.studioAgendaGrid}>
          {demoAgenda.items.map((item, index) => <li key={item.title} data-studio-reveal><div><span>0{index + 1}</span><small>{item.duration}</small></div><h3>{item.title}</h3><p>{item.body}</p><i aria-hidden="true" /></li>)}
        </ol>
        <div className={styles.studioTakeaway} data-studio-reveal><div><span className={styles.studioLightEyebrow}>LEAVE WITH DIRECTION</span><h3>A practical view of what comes next.</h3><p>Your priorities, the product fit and a conversation about rollout.</p></div><button type="button" onClick={() => choose("brief", true)}>Let’s map your operation <ArrowRight size={17} /></button></div>
      </section>
      <div className={styles.studioShell + " " + styles.studioQuestions}><DemoFaq /><AltContact /></div>
    </div>
  );
}
