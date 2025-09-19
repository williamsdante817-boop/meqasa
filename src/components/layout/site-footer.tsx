import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { SiteConfig } from "@/types";
import Shell from "@/layouts/shell";
import ScrollTotop from "@/components/scroll-to-top";
import PropertyAlertsForm from "@/components/property/forms/property-alerts-form";

function isExternalHref(href: string): boolean {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

export function SiteFooter() {
  return (
    <footer
      className="w-full bg-[#252535] text-white"
      aria-labelledby="footer-heading"
      role="contentinfo"
    >
      <PropertyAlertsForm />
      <Shell>
        <section className="flex flex-col gap-10 py-16">
          <h2 id="footer-heading" className="sr-only">
            Site Footer
          </h2>
          <nav
            aria-label="Footer Navigation"
            className="xxs:grid-cols-2 grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-10"
          >
            {siteConfig.footerNav.map((item) => (
              <div key={item.title} className="space-y-3">
                <h3 className="text-base font-medium">{item.title}</h3>
                <ul className="space-y-0.5" role="list">
                  {item.items.map((link) => {
                    const isExternal =
                      link.external ?? isExternalHref(link.href);
                    return (
                      <li key={link.title}>
                        <Link
                          href={link.href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noreferrer noopener" : undefined}
                          className="text-sm text-[#d2d3dc] transition-colors hover:text-[#8d8e97]"
                          aria-label={link.title}
                        >
                          {link.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          <FooterCompanyLink />
          <div className="mt-8 border-t border-gray-600 pt-8 text-xs text-gray-400">
            <p>© {new Date().getFullYear()} meQasa. All rights reserved.</p>
          </div>
        </section>
      </Shell>
      <ScrollTotop />
    </footer>
  );
}

function FooterCompanyLink() {
  type LinkItem = {
    href: string;
    label: string;
  };

  const config = siteConfig as SiteConfig;

  const contactLinks: LinkItem[] = [
    { href: `mailto:${config.email}`, label: config.email },
    { href: "/faq", label: "FAQ" },
    { href: "/work", label: "Work with us" },
    { href: "/feedback", label: "Feedback" },
    { href: "/house", label: "Housing guide" },
    { href: "/guide", label: "Real estate guide 2020" },
    { href: "/ads", label: "Advertise with us" },
    { href: "/terms", label: "Terms of use" },
  ];

  const socialLinks: LinkItem[] = [
    { href: config.socialLinks.facebook, label: "Facebook" },
    { href: config.socialLinks.twitter, label: "X (formerly Twitter)" },
    { href: config.socialLinks.instagram, label: "Instagram" },
    { href: config.socialLinks.youtube, label: "YouTube" },
  ];

  return (
    <section
      className="mt-8 border-t border-gray-600 pt-8"
      aria-labelledby="footer-company-heading"
    >
      <h3 id="footer-company-heading" className="sr-only">
        Company Links
      </h3>
      <div className="xxs:grid-cols-2 grid flex-1 grid-cols-2 gap-10 sm:grid-cols-4">
        <div className="space-y-3">
          <h4 className="text-base font-medium">Contact</h4>
          <ul className="space-y-0.5" role="list">
            {contactLinks.map((link) => (
              <FooterLink
                key={link.label}
                href={link.href}
                label={link.label}
              />
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-base font-medium">Company</h4>
          <ul className="space-y-0.5" role="list">
            <FooterLink href="/about" label="About us" />
            {socialLinks.map((link) => (
              <FooterLink
                key={link.label}
                href={link.href}
                label={link.label}
                external={true}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FooterLink({
  href,
  label,
  external = false,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-[#d2d3dc] transition-colors hover:text-[#8d8e97]"
        aria-label={label}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
      >
        {label}
      </Link>
    </li>
  );
}
