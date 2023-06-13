import '../src/app/custom-styles.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from './AuthContext'; // Update import statement

const inter = Inter({ subsets: ['latin'] });

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider> {/* Wrap the component with AuthProvider */}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
