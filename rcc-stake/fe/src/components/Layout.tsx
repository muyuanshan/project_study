import styles from "../styles/Home.module.css";
import Header from "./Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.container}>
      <Header></Header>
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default Layout;
