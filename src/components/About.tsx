import { Code, Palette, Users, Zap, Target, BookOpen, Briefcase, Globe, MapPin, GraduationCap, BadgeCheck, Award, type LucideIcon } from 'lucide-react';
import { useAboutContent } from '../hooks/useContent';
import { useSkillCategories, useTimeline } from '../hooks/useSkills';

const iconMap: Record<string, LucideIcon> = {
  Users,
  Zap,
  Target,
  Code,
  BookOpen,
  Palette,
  Briefcase,
};

// Skills at or above this level are shown as core strengths; the level itself is never displayed.
const CORE_LEVEL = 90;

export default function About() {
  const content = useAboutContent();
  const skillCategories = useSkillCategories();
  const timeline = useTimeline();

  return (
    <section className="pt-28 sm:pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-white dark:bg-ink-950 transition-colors duration-500">
      <div className="section-container">
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 rounded-full text-xs font-medium mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            About
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 dark:text-white mb-6 tracking-tight">{content.title}</h1>
          <div className="space-y-4 text-base text-ink-600 dark:text-ink-300 leading-[1.7]">
            {content.introduction.map((paragraph, idx) => (
              <p key={idx} className="leading-[1.7]">{paragraph}</p>
            ))}
          </div>
        </div>

        {content.globalCollaboration && (
          <div className="mb-20 p-6 sm:p-8 rounded-3xl bg-ink-50/60 dark:bg-ink-900/60 border border-ink-100 dark:border-ink-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-ink-900 dark:text-white tracking-tight">{content.globalCollaboration.title}</h2>
            </div>
            <p className="max-w-3xl text-base text-ink-600 dark:text-ink-300 leading-[1.7] mb-6">{content.globalCollaboration.description}</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {content.globalCollaboration.regions.map((region) => (
                <span key={region} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-ink-700 dark:text-ink-200 text-sm font-medium rounded-full">
                  <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  {region}
                </span>
              ))}
            </div>
            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {content.globalCollaboration.steps.map((step, idx) => (
                <li key={idx} className="p-4 bg-white dark:bg-ink-800/60 rounded-2xl border border-ink-100 dark:border-ink-700">
                  <span className="text-xs font-bold text-brand-700 dark:text-brand-400">Step {idx + 1}</span>
                  <h3 className="text-base font-bold text-ink-900 dark:text-white mt-1 mb-1.5">{step.title}</h3>
                  <p className="text-sm text-ink-600 dark:text-ink-400 leading-[1.7]">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mb-20">
          <h2 className="text-2xl font-bold text-ink-900 dark:text-white mb-8 tracking-tight">{content.principlesTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {content.principles.map((principle, idx) => {
              const Icon = iconMap[principle.icon];
              return (
                <div
                  key={idx}
                  className="group p-5 bg-ink-50/60 dark:bg-ink-900/60 rounded-2xl hover:bg-white dark:hover:bg-ink-800 hover:shadow-card hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-ink-200 dark:hover:border-ink-700"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-4.5 h-4.5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-ink-900 dark:text-white mb-2">{principle.title}</h3>
                  <p className="text-ink-600 dark:text-ink-400 text-sm leading-[1.7]">{principle.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-ink-900 dark:text-white tracking-tight">{content.skillsTitle}</h2>
            <ul className="flex items-center gap-4 text-xs text-ink-500 dark:text-ink-400" aria-label="Legend">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" aria-hidden="true" />
                Core strength
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded-full border border-dashed border-ink-400 dark:border-ink-500" aria-hidden="true" />
                Also work with
              </li>
            </ul>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {skillCategories.map((category, idx) => {
              const Icon = iconMap[category.icon];
              const core = category.skills.filter((s) => s.level >= CORE_LEVEL);
              const supporting = category.skills.filter((s) => s.level < CORE_LEVEL);
              // With an odd number of categories the last card spans the full row.
              const wide = idx === skillCategories.length - 1 && skillCategories.length % 2 === 1;
              return (
                <article
                  key={category.category}
                  className={`group flex flex-col p-6 bg-white dark:bg-ink-900 rounded-2xl border border-ink-200/70 dark:border-ink-800 hover:border-brand-200 dark:hover:border-brand-500/40 hover:shadow-card transition-all duration-300 ${
                    wide ? 'md:col-span-2' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-brand-500 group-hover:to-accent-500 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-brand-600 dark:text-brand-300 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-ink-900 dark:text-white leading-tight">{category.category}</h3>
                      {category.summary && (
                        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400 leading-[1.6]">{category.summary}</p>
                      )}
                    </div>
                  </div>

                  <ul className="flex flex-wrap gap-2" aria-label={`${category.category}: core strengths`}>
                    {core.map((skill) => (
                      <li
                        key={skill.name}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink-50 dark:bg-ink-800/70 border border-ink-200 dark:border-ink-700 text-[13px] font-medium text-ink-800 dark:text-ink-100"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500" aria-hidden="true" />
                        {skill.name}
                      </li>
                    ))}
                  </ul>

                  {supporting.length > 0 && (
                    <ul
                      className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-dashed border-ink-200 dark:border-ink-800"
                      aria-label={`${category.category}: also work with`}
                    >
                      {supporting.map((skill) => (
                        <li
                          key={skill.name}
                          className="inline-flex items-center px-3 py-1.5 rounded-full border border-dashed border-ink-300 dark:border-ink-700 text-[13px] text-ink-600 dark:text-ink-400"
                        >
                          {skill.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-ink-900 dark:text-white mb-8 tracking-tight">{content.timelineTitle}</h2>
          <div className="relative">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-brand-500 via-ink-200 dark:via-ink-700 to-transparent" />
            <div className="space-y-6">
              {timeline.map((entry, idx) => (
                <div
                  key={idx}
                  className="relative pl-12 pb-6 last:pb-0 group"
                >
                  <div className="absolute left-2.5 top-1 w-4 h-4 rounded-full bg-white dark:bg-ink-900 border-2 border-brand-500 group-hover:bg-brand-500 transition-colors duration-300 z-10" />
                  <div className="p-5 bg-ink-50/60 dark:bg-ink-900/60 rounded-2xl border border-ink-100 dark:border-ink-800 group-hover:border-brand-200 dark:group-hover:border-brand-900/50 group-hover:bg-white dark:group-hover:bg-ink-800 group-hover:shadow-card group-hover:-translate-y-0.5 transition-all duration-300">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-full">{entry.year}</span>
                    </div>
                    <h3 className="text-lg font-bold text-ink-900 dark:text-white mb-0.5">{entry.role}</h3>
                    <div className="text-sm text-ink-500 dark:text-ink-400 mb-3 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      {entry.company}
                    </div>
                    <p className="text-sm text-ink-600 dark:text-ink-300 leading-[1.7] mb-3">{entry.description}</p>
                    {entry.achievements && entry.achievements.length > 0 && (
                      <ul className="grid sm:grid-cols-2 gap-2 mt-4">
                        {entry.achievements.map((achievement, achIdx) => (
                          <li key={achIdx} className="flex items-start gap-2.5 text-ink-600 dark:text-ink-300">
                            <span className="text-brand-600 dark:text-brand-400 font-bold mt-0.5 text-sm">•</span>
                            <span className="text-sm leading-[1.7]">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {content.credentials && (
          <div className="mt-20 grid md:grid-cols-3 gap-5">
            {[
              { icon: GraduationCap, title: content.credentials.educationTitle, items: content.credentials.education },
              { icon: BadgeCheck, title: content.credentials.certificationsTitle, items: content.credentials.certifications },
              { icon: Award, title: content.credentials.awardsTitle, items: content.credentials.awards },
            ].map(({ icon: Icon, title, items }) => (
              <div key={title} className="p-5 bg-ink-50/60 dark:bg-ink-900/60 rounded-2xl border border-ink-100 dark:border-ink-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-ink-900 dark:text-white">{title}</h2>
                </div>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-ink-600 dark:text-ink-300 leading-[1.6]">
                      <span className="text-brand-600 dark:text-brand-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
