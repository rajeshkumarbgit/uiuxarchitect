import { Code, Palette, Users, Zap, Target, BookOpen } from 'lucide-react';
import { useAboutContent } from '../hooks/useContent';
import { useSkillCategories, useTimeline } from '../hooks/useSkills';

const iconMap: Record<string, any> = {
  Users,
  Zap,
  Target,
  Code,
  BookOpen,
  Palette
};

export default function About() {
  const content = useAboutContent();
  const skillCategories = useSkillCategories();
  const timeline = useTimeline();

  return (
    <section className="pt-28 sm:pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="section-container">
        <div className="max-w-4xl mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-900 mb-8 tracking-tight">{content.title}</h1>
          <div className="space-y-5 text-lg text-ink-600 leading-relaxed">
            {content.introduction.map((paragraph, idx) => (
              <p key={idx} className="leading-[1.7]">{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-3xl font-bold text-ink-900 mb-10 tracking-tight">{content.principlesTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.principles.map((principle, idx) => {
              const Icon = iconMap[principle.icon];
              return (
                <div
                  key={idx}
                  className="group p-7 bg-ink-50/60 rounded-2xl hover:bg-ink-50 transition-all duration-300 border border-transparent hover:border-ink-200 hover:shadow-soft"
                >
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-soft transition-all duration-300">
                    <Icon className="w-5 h-5 text-ink-900" />
                  </div>
                  <h3 className="text-lg font-bold text-ink-900 mb-2">{principle.title}</h3>
                  <p className="text-ink-600 text-sm leading-relaxed">{principle.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-3xl font-bold text-ink-900 mb-10 tracking-tight">{content.skillsTitle}</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {skillCategories.map((category, idx) => {
              const Icon = iconMap[category.icon];
              return (
                <div key={idx} className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-ink-50 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-ink-900" />
                    </div>
                    <h3 className="text-xl font-bold text-ink-900">{category.category}</h3>
                  </div>
                  <div className="space-y-4 pl-1">
                    {category.skills.map((skill, skillIdx) => (
                      <div key={skillIdx} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-ink-900">{skill.name}</span>
                          <span className="text-ink-500">{skill.years}</span>
                        </div>
                        <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brand-600 to-accent-500 rounded-full transition-all duration-1000"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-ink-900 mb-10 tracking-tight">{content.timelineTitle}</h2>
          <div className="space-y-6">
            {timeline.map((entry, idx) => (
              <div
                key={idx}
                className="relative pl-10 pb-6 border-l-2 border-ink-200 last:border-transparent last:pb-0"
              >
                <div className="absolute -left-[7px] top-0 w-3.5 h-3.5 bg-brand-600 rounded-full ring-4 ring-brand-100" />
                <div className="text-sm font-semibold text-brand-600 mb-1.5">{entry.year}</div>
                <h3 className="text-xl font-bold text-ink-900 mb-0.5">{entry.role}</h3>
                <div className="text-base text-ink-600 mb-3">{entry.company}</div>
                <p className="text-sm text-ink-600 leading-relaxed mb-3">{entry.description}</p>
                {entry.achievements && entry.achievements.length > 0 && (
                  <ul className="space-y-1.5">
                    {entry.achievements.map((achievement, achIdx) => (
                      <li key={achIdx} className="flex items-start gap-2.5 text-ink-600">
                        <span className="text-brand-600 font-bold mt-0.5 text-sm">•</span>
                        <span className="text-sm leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
