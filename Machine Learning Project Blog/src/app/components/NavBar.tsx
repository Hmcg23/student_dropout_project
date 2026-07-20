import { useState } from "react";
import { Link, useLocation } from "react-router";

const GITHUB_URL = "https://github.com/Hmcg23/student_dropout_project";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const links = [
    { label: "Overview", to: "/" },
    { label: "Methodology", to: "/methodology" },
  ];

  return (
    <header className="border-b border-border sticky top-0 bg-background z-50">
      <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-['DM_Mono'] text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          Predicting Student Dropouts
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-['DM_Sans'] text-sm transition-colors ${
                pathname === link.to
                  ? "text-foreground border-b border-crimson pb-0.5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="font-['DM_Sans'] text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub ↗
          </a>
        </nav>

        <button
          className="md:hidden font-['DM_Mono'] text-xs tracking-widest uppercase"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="max-w-3xl mx-auto px-6 py-4 flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="font-['DM_Sans'] text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="font-['DM_Sans'] text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub ↗
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
