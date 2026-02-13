import Link from "next/link";
import styles from "./page.module.css";

export default function RootPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo} aria-hidden="true" />
          <span className={styles.brandName}>GitHub Shoppers</span>
        </div>
        <nav className={styles.nav}>
          <Link className={styles.navLink} href="/api-doc">
            API Docs
          </Link>
          <Link className={styles.navLink} href="/en">
            App (EN)
          </Link>
          <Link className={styles.navLink} href="/pt">
            App (PT)
          </Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>GitHub Shoppers</h1>
          <p className={styles.subtitle}>
            Aplicação full stack para explorar repositórios, organizar itens e
            automatizar melhorias com filas e workers.
          </p>

          <div className={styles.ctaRow}>
            <Link className={styles.primaryCta} href="/en">
              Abrir a aplicação
            </Link>
            <Link className={styles.secondaryCta} href="/api/auth/signin">
              Entrar
            </Link>
          </div>
        </section>

        <section className={styles.grid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Auth</h2>
            <p className={styles.cardBody}>
              Login via NextAuth com provedores como GitHub e Google.
            </p>
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Banco</h2>
            <p className={styles.cardBody}>
              Prisma + Postgres para persistência e consultas.
            </p>
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Filas</h2>
            <p className={styles.cardBody}>
              BullMQ + Redis para tarefas assíncronas e processamento em
              background.
            </p>
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>i18n</h2>
            <p className={styles.cardBody}>
              Internacionalização com next-intl e rotas por locale.
            </p>
          </div>
        </section>

        <section className={styles.footer}>
          <p className={styles.footerText}>
            Dica: para navegar direto no app, use <code>/en</code> ou{" "}
            <code>/pt</code>.
          </p>
        </section>
      </main>
    </div>
  );
}
