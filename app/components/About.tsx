import React from "react";

export interface AboutData {
  badgeText?: string;
  heading?: string;
  paragraphs?: string[];
  stats?: Array<{ label: string; value: string }>;
  timelineBadge?: string;
  timelineHeading?: string;
  journey?: Array<{ year: string; title: string; description: string }>;
}

interface AboutProps {
  data?: AboutData | null;
}

export default function About({ data }: AboutProps) {
  const badgeText = data?.badgeText;
  const heading = data?.heading;
  const paragraphs = data?.paragraphs || [];
  const stats = data?.stats || [];
  const timelineBadge = data?.timelineBadge;
  const timelineHeading = data?.timelineHeading;
  const journey = data?.journey || [];

  return (
    <section id="about" className="py-8 md:py-10 border-b border-border/40 scroll-mt-16">
      <div className="max-w-4xl mx-auto px-6 space-y-10 md:space-y-12">
        {/* Narrative & Stats */}
        <div className="space-y-6">
          {(badgeText || heading) && (
            <div>
              {badgeText && (
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  {badgeText}
                </p>
              )}
              {heading && (
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  {heading}
                </h2>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div className="md:col-span-2 space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Metric Cards */}
            {stats.length > 0 && (
              <div className="space-y-3">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-0.5"
                  >
                    <span className="text-[11px] font-medium text-muted-foreground block">
                      {stat.label}
                    </span>
                    <span className="text-base font-bold text-foreground block">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Experience Timeline */}
        {journey.length > 0 && (
          <div className="space-y-6 pt-2">
            {(timelineBadge || timelineHeading) && (
              <div>
                {timelineBadge && (
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    {timelineBadge}
                  </p>
                )}
                {timelineHeading && (
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {timelineHeading}
                  </h3>
                )}
              </div>
            )}

            <div className="relative pl-6 sm:pl-8 border-l border-border space-y-6 sm:space-y-8">
              {journey.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Dot Marker on Timeline */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3 h-3 rounded-full bg-background border-2 border-muted-foreground/60 group-hover:border-foreground group-hover:scale-125 transition-all" />

                  <div className="space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-muted text-muted-foreground">
                      {item.year}
                    </span>

                    <h4 className="text-base font-semibold text-foreground tracking-tight">
                      {item.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
