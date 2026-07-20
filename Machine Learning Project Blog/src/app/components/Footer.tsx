const LINKS = [
  { label: "GitHub", href: "https://github.com/Hmcg23/student_dropout_project" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hudsonmcgough" },
  { label: "Email", href: "mailto:hudsonmcgough@college.harvard.edu" },
];

export default function Footer() {
  return (
    <footer className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="font-['DM_Sans'] text-sm text-muted-foreground font-light">
          © 2026 Hudson McGough. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noreferrer"
              className="font-['DM_Sans'] text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
