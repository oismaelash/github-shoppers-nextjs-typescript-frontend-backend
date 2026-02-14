"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

type NavItem = {
  label: string;
  href: string;
};

type Stat = {
  value: string;
  label: ReactNode;
};

type HowItWorksStep = {
  icon: string;
  title: string;
  description: string;
};

type Feature = {
  icon: string;
  title: string;
  description: string;
  accentLeftBorder?: boolean;
};

type UseCase = {
  icon: string;
  label: string;
};

type ProductMock = {
  title: string;
  price: string;
  handle: string;
  stock: string;
  icon: string;
  iconClassName: string;
  imageClassName: string;
  offset?: "down";
};

const navItems: NavItem[] = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Features", href: "#features" },
  { label: "Documentation", href: "#documentation" },
  { label: "Pricing", href: "#pricing" },
];

const productMocks: ProductMock[] = [
  {
    title: "React Component Pro",
    price: "$49.00",
    handle: "@dev_master",
    stock: "12 Units",
    icon: "terminal",
    iconClassName: "text-primary",
    imageClassName: "from-primary/20 to-blue-600/20",
  },
  {
    title: "Auth Logic Kit",
    price: "$25.00",
    handle: "@security_guru",
    stock: "5 Units",
    icon: "database",
    iconClassName: "text-purple-400",
    imageClassName: "from-purple-500/20 to-primary/20",
    offset: "down",
  },
  {
    title: "Deployment Script",
    price: "$12.00",
    handle: "@ops_ninja",
    stock: "89 Units",
    icon: "verified_user",
    iconClassName: "text-green-400",
    imageClassName: "from-green-500/20 to-primary/20",
  },
  {
    title: "API Credits (1k)",
    price: "$19.99",
    handle: "@api_provider",
    stock: "500+",
    icon: "api",
    iconClassName: "text-orange-400",
    imageClassName: "from-orange-500/20 to-primary/20",
    offset: "down",
  },
];

const socialProofStats: Stat[] = [
  {
    value: "1,000+",
    label: (
      <>
        GitHub users
        <br />
        selling inventory
      </>
    ),
  },
  {
    value: "10,000+",
    label: (
      <>
        Purchases
        <br />
        executed atomically
      </>
    ),
  },
  {
    value: "99.9%",
    label: (
      <>
        Verified identity
        <br />
        accuracy rate
      </>
    ),
  },
];

const howItWorksSteps: HowItWorksStep[] = [
  {
    icon: "login",
    title: "Login with OAuth",
    description:
      "Securely connect your GitHub account in one click. No registration required.",
  },
  {
    icon: "add_box",
    title: "List Products",
    description:
      "Set your price and quantity. Our engine handles inventory updates automatically.",
  },
  {
    icon: "shopping_cart",
    title: "Buy & Link",
    description:
      "Every transaction is permanently linked to your verified GitHub identity.",
  },
  {
    icon: "history",
    title: "Track History",
    description:
      "Access a complete audit trail of your purchases and sales via your dashboard.",
  },
];

const features: Feature[] = [
  {
    icon: "fingerprint",
    title: "GitHub Identity",
    description:
      "Identity verification built into every trade. See the public profile and commit history of every seller.",
    accentLeftBorder: true,
  },
  {
    icon: "layers",
    title: "Atomic Stock Control",
    description:
      "Our engine ensures inventory is locked during checkout. Zero overselling, zero manual updates.",
  },
  {
    icon: "auto_awesome",
    title: "AI Descriptions",
    description:
      "Paste your repo URL and let our AI generate professional, technical product descriptions automatically.",
  },
  {
    icon: "public",
    title: "Public History",
    description:
      "Transparency is key. Each purchase creates a cryptographic proof linked to your GitHub profile.",
  },
  {
    icon: "link",
    title: "Shareable Links",
    description:
      "Embed product cards directly into your README.md or share clean checkout links on social media.",
  },
  {
    icon: "translate",
    title: "Multilingual",
    description:
      "Global trade simplified with automatic interface translation for developers worldwide.",
  },
];

const useCases: UseCase[] = [
  { icon: "folder_special", label: "Repo Access" },
  { icon: "groups", label: "Mentorship" },
  { icon: "token", label: "Digital Assets" },
  { icon: "cloud_done", label: "API Credits" },
  { icon: "key_visualizer", label: "SaaS Licenses" },
  { icon: "school", label: "Course Seats" },
];

const footerLinks: NavItem[] = [
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Security", href: "#" },
  { label: "GitHub Repo", href: "#" },
];

export function LandingPage() {
  return (
    <div
      className={[
        inter.className,
        "bg-background-light dark:bg-background-dark",
        "text-slate-900 dark:text-slate-100",
        "selection:bg-primary/30",
      ].join(" ")}
    >
      <TopNavigation />
      <main>
        <HeroSection />
        <SocialProofBar />
        <HowItWorksSection />
        <CoreFeaturesSection />
        <UseCasesSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}

function TopNavigation() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-background-dark/80 backdrop-blur-md">
      <SectionContainer className="h-16 flex items-center justify-between">
        <Brand />
        <DesktopNav />
        <div className="flex items-center gap-4">
          <GithubAuthCta variant="nav" />
        </div>
      </SectionContainer>
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary p-1.5 rounded-lg">
        <LogoMark className="w-5 h-5 text-white" />
      </div>
      <span className="font-bold text-lg tracking-tight">GitHub Shoppers</span>
    </div>
  );
}

function DesktopNav() {
  return (
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
      {navItems.map((item) => (
        <a
          key={item.label}
          className="hover:text-primary transition-colors"
          href={item.href}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}

function HeroSection() {
  return (
    <section
      id="marketplace"
      className="relative pt-20 pb-32 overflow-hidden grid-pattern"
    >
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <SectionContainer className="grid lg:grid-cols-2 gap-16 items-center">
        <HeroCopy />
        <ProductMockupGrid />
      </SectionContainer>
    </section>
  );
}

function HeroCopy() {
  return (
    <div className="space-y-8 relative z-10">
      <BetaPill />
      <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-white">
        Buy and Sell Products Using Your{" "}
        <span className="text-primary">GitHub Identity</span>.
      </h1>
      <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
        A developer-powered marketplace where every purchase is tied to a real
        GitHub account and stock is enforced atomically.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <GithubAuthCta variant="hero" />
        <ExploreMarketplaceCta />
      </div>
      <HeroHighlights />
    </div>
  );
}

function ExploreMarketplaceCta() {
  return (
    <Link
      href="/marketplace"
      className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-lg font-bold transition-all border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary/40 text-white"
    >
      <Icon name="explore" className="material-symbols-outlined" />
      Explore Marketplace
    </Link>
  );
}

function BetaPill() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
      </span>
      Now in Private Beta
    </div>
  );
}

function HeroHighlights() {
  const highlights = [
    { icon: "code", label: "No emails" },
    { icon: "key", label: "No passwords" },
    { icon: "check_circle", label: "Only code" },
  ];

  return (
    <div className="flex items-center gap-6 text-sm text-slate-500 font-medium italic">
      {highlights.map((h) => (
        <span key={h.label} className="flex items-center gap-1.5">
          <Icon
            name={h.icon}
            className="text-[18px] text-primary material-symbols-outlined"
          />
          {h.label}
        </span>
      ))}
    </div>
  );
}

function ProductMockupGrid() {
  return (
    <div className="relative group">
      <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-20 rounded-full group-hover:opacity-30 transition-opacity" />
      <div className="grid grid-cols-2 gap-4 relative">
        {productMocks.map((product) => (
          <ProductMockupCard key={product.title} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductMockupCard({ product }: { product: ProductMock }) {
  return (
    <div
      className={[
        "glass-card p-4 rounded-xl space-y-4 transform hover:-translate-y-1 transition-transform",
        product.offset === "down" ? "translate-y-8" : "",
      ].join(" ")}
    >
      <div
        className={[
          "aspect-video bg-gradient-to-br rounded-lg flex items-center justify-center border border-white/5 overflow-hidden",
          product.imageClassName,
        ].join(" ")}
      >
        <Icon
          name={product.icon}
          className={[
            product.iconClassName,
            "text-4xl material-symbols-outlined",
          ].join(" ")}
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white text-sm">{product.title}</h3>
          <span className="text-primary font-mono text-xs font-bold">
            {product.price}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full bg-slate-700 border border-white/10"
            data-alt="GitHub user avatar profile circle"
          />
          <span className="text-xs text-slate-400">{product.handle}</span>
        </div>
        <div className="pt-2 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-slate-500">
          <span>Stock: {product.stock}</span>
          <span className="text-green-500 flex items-center gap-1">
            ● Atomic
          </span>
        </div>
      </div>
    </div>
  );
}

function SocialProofBar() {
  return (
    <section className="border-y border-white/5 bg-white/[0.02] py-8">
      <SectionContainer className="flex flex-col md:flex-row justify-around items-center gap-8 md:gap-4">
        {socialProofStats.map((stat, idx) => (
          <SocialProofStat
            key={stat.value}
            stat={stat}
            showDivider={idx !== socialProofStats.length - 1}
          />
        ))}
      </SectionContainer>
    </section>
  );
}

function SocialProofStat({
  stat,
  showDivider,
}: {
  stat: Stat;
  showDivider: boolean;
}) {
  return (
    <>
      <div className="flex items-center gap-4">
        <span className="text-3xl font-black text-white">{stat.value}</span>
        <span className="text-slate-400 text-sm font-medium">{stat.label}</span>
      </div>
      {showDivider ? (
        <div className="h-10 w-px bg-white/10 hidden md:block" aria-hidden />
      ) : null}
    </>
  );
}

function HowItWorksSection() {
  return (
    <section id="features" className="py-24 bg-background-dark">
      <SectionContainer>
        <SectionHeading
          title="How It Works"
          description="Trading inventory on GitHub Shoppers is as easy as pushing a commit. Built for developers, by developers."
        />
        <HowItWorksSteps />
      </SectionContainer>
    </section>
  );
}

function HowItWorksSteps() {
  return (
    <div className="grid md:grid-cols-4 gap-8 relative">
      <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {howItWorksSteps.map((step) => (
        <HowItWorksCard key={step.title} step={step} />
      ))}
    </div>
  );
}

function HowItWorksCard({ step }: { step: HowItWorksStep }) {
  return (
    <div className="relative flex flex-col items-center text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary relative z-10 shadow-lg shadow-primary/10">
        <Icon
          name={step.icon}
          className="text-3xl material-symbols-outlined"
        />
      </div>
      <div>
        <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
        <p className="text-sm text-slate-500">{step.description}</p>
      </div>
    </div>
  );
}

function CoreFeaturesSection() {
  return (
    <section id="documentation" className="py-24 border-t border-white/5">
      <SectionContainer>
        <div className="mb-16">
          <h2 className="text-3xl font-black text-white mb-4">
            Core Infrastructure
          </h2>
          <p className="text-slate-400">
            Everything you need to trade digital assets with confidence.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div
      className={[
        "glass-card p-8 rounded-2xl group",
        feature.accentLeftBorder ? "border-l-2 border-l-primary/50" : "",
      ].join(" ")}
    >
      <Icon
        name={feature.icon}
        className="text-primary mb-6 block text-3xl material-symbols-outlined"
      />
      <h4 className="text-white font-bold text-xl mb-3">{feature.title}</h4>
      <p className="text-slate-400 leading-relaxed">{feature.description}</p>
    </div>
  );
}

function UseCasesSection() {
  return (
    <section id="pricing" className="py-24 bg-white/[0.02]">
      <SectionContainer>
        <SectionHeading
          title="Infinite Use Cases"
          description="If it lives on GitHub, you can sell it here."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {useCases.map((useCase) => (
            <UseCaseCard key={useCase.label} useCase={useCase} />
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}

function UseCaseCard({ useCase }: { useCase: UseCase }) {
  return (
    <div className="glass-card p-6 rounded-xl text-center space-y-4 hover:border-primary/40 transition-colors">
      <Icon
        name={useCase.icon}
        className="text-primary text-4xl material-symbols-outlined"
      />
      <span className="block text-white font-bold text-sm">{useCase.label}</span>
    </div>
  );
}

function FinalCtaSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full translate-y-1/2" />
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-10">
        <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">
          Start selling inventory tied to your{" "}
          <span className="text-primary underline decoration-primary/30">
            GitHub identity
          </span>
          .
        </h2>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
          Join thousands of developers monetizing their code, time, and digital
          assets in the most secure way possible.
        </p>
        <div className="flex flex-col items-center gap-6">
          <GithubAuthCta variant="cta" />
          <p className="text-slate-500 text-sm font-mono">
            No credit card required to browse.
          </p>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-white/5 py-12 bg-background-dark text-slate-500 text-sm">
      <SectionContainer className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1 rounded-md">
            <LogoMark className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-white">GitHub Shoppers</span>
        </div>
        <div className="flex gap-8">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              className="hover:text-primary transition-colors"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
        <p>© 2024 GitHub Shoppers. Not affiliated with GitHub, Inc.</p>
      </SectionContainer>
    </footer>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-center mb-16 space-y-4">
      <h2 className="text-4xl font-black text-white tracking-tight">{title}</h2>
      <p className="text-slate-400 max-w-2xl mx-auto">{description}</p>
    </div>
  );
}

function GithubAuthCta({ variant }: { variant: "nav" | "hero" | "cta" }) {
  const base =
    "flex items-center justify-center gap-3 text-white font-bold transition-all";

  const variantClassName =
    variant === "nav"
      ? "px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-semibold shadow-lg shadow-primary/20"
      : variant === "hero"
        ? "px-8 py-4 bg-primary hover:bg-primary/90 rounded-xl text-lg shadow-xl shadow-primary/20"
        : "px-10 py-5 bg-primary hover:bg-primary/90 rounded-2xl text-xl shadow-2xl shadow-primary/30 transform hover:scale-105 active:scale-95";

  const iconSizeClassName =
    variant === "nav" ? "text-[18px]" : variant === "cta" ? "text-2xl" : "";

  const iconName = variant === "nav" ? "login" : "account_circle";

  return (
    <button
      onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
      className={[base, variantClassName].join(" ")}
    >
      <Icon
        name={iconName}
        className={[iconSizeClassName, "material-symbols-outlined"].join(" ")}
      />
      Continue with GitHub
    </button>
  );
}

function SectionContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={["max-w-7xl mx-auto px-6", className ?? ""].join(" ")}>
      {children}
    </div>
  );
}

function Icon({ name, className }: { name: string; className?: string }) {
  return <span className={className}>{name}</span>;
}

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
        fill="currentColor"
      />
    </svg>
  );
}
