import styles from "./layout.module.css";
import { ApiDocLightMode } from "./light-mode";

export default function ApiDocLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.wrapper}>
      <ApiDocLightMode />
      {children}
    </div>
  );
}
