import styles from "./layout.module.css";
import { SwaggerLightMode } from "./light-mode";

export default function SwaggerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.wrapper}>
      <SwaggerLightMode />
      {children}
    </div>
  );
}
