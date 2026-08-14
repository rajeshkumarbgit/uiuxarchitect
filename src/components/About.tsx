import { Code, Palette, Users, Zap, Target, BookOpen, Briefcase } from 'lucide-react';
import { useAboutContent } from '../hooks/useContent';
import { useSkillCategories, useTimeline } from '../hooks/useSkills';

const iconMap: Record<string, any> = {
  Users,
  Zap,
  Target,
  Code,
  BookOpen,
  Palette,
  Briefcase,
};

export default function About() {
  const content = useAboutContent();
  const skillCategories = useSkillCategories();
  const timeline = useTimeline();

  return (
    <section className="pt-28 sm:pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="section-container">
        <div className="max-w-4xl mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            About
          </div>
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
                  className="group p-7 bg-ink-50/60 rounded-2xl hover:bg-white hover:shadow-card transition-all duration-300 border border-transparent hover:border-ink-200"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-white" />
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
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
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
          <div className="relative">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-brand-500 via-ink-200 to-transparent" />
            <div className="space-y-8">
              {timeline.map((entry, idx) => (
                <div
                  key={idx}
                  className="relative pl-14 pb-8 last:pb-0 group"
                >
                  <div className="absolute left-2.5 top-1 w-4 h-4 rounded-full bg-white border-2 border-brand-500 group-hover:bg-brand-500 transition-colors duration-300 z-10" />
                  <div className="p-6 bg-ink-50/60 rounded-2xl border border-ink-100 group-hover:border-brand-200 group-hover:bg-white group-hover:shadow-card transition-all duration-300">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full">{entry.year}</span>
                    </div>
                    <h3 className="text-xl font-bold text-ink-900 mb-0.5">{entry.role}</h3>
                    <div className="text-base text-ink-500 mb-3 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      {entry.company}
                    </div>
                    <p className="text-sm text-ink-600 leading-relaxed mb-3">{entry.description}</p>
                    {entry.achievements && entry.achievements.length > 0 && (
                      <ul className="grid sm:grid-cols-2 gap-2 mt-4">
                        {entry.achievements.map((achievement, achIdx) => (
                          <li key={achIdx} className="flex items-start gap-2.5 text-ink-600">
                            <span className="text-brand-600 font-bold mt-0.5 text-sm">•</span>
                            <span className="text-sm leading-relaxed">{achievement}</span>
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
      </div>
    </section>
  );
}
