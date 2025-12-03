import Header from './Header';
import styles from './Layout.module.css';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>{children}</main>
    </div>
  );
}

export default Layout;
