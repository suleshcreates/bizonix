import { challenges } from "@/lib/content/home";

export function ChallengesSection() {
  return (
    <section id="challenges" className="section bg-bz-navy text-white">
      <div className="shell grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <span className="eyebrow !text-bz-teal">
            When disconnected tools stop scaling
          </span>
          <h2 className="h2 mt-5">Why brands outgrow spreadsheets.</h2>
          <p className="mt-6 max-w-md text-white/62">
            The problem is rarely one missing report. It is the delay between
            what happened on the floor and what the business believes happened.
          </p>
        </div>
        <div className="grid gap-x-9 sm:grid-cols-2">
          {challenges.map(([title, body], i) => (
            <article key={title} className="border-t border-white/15 py-7">
              <div className="mb-5 text-xs font-bold tracking-[.16em] text-bz-teal">
                0{i + 1}
              </div>
              <h3 className="text-xl font-bold tracking-[-.03em]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/58">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
