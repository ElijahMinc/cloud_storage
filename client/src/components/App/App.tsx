import { BrowserRouter as Router } from 'react-router-dom'
import { Header } from "@components/Header/Header";
import { Toast } from "@common/Toast/Toast";
import { AppRouter } from "@components/AppRouter/AppRouter";
import { useTranslate } from '@/hooks/useTranslations';
import { useEffect } from 'react';
import { LANGUAGES, LocalStorageKeys } from '@/constant';


export const App = () => {
  // const { i18n } = useTranslate()

  useEffect(() => {
    localStorage.setItem(LocalStorageKeys.LANGUAGE, LANGUAGES.EN)

  }, [])

  return (
    <div className="App">
        <Router>
          <Header />
          <main>
            <div className="container">
               <AppRouter/>
            </div>
          </main>
        </Router>
        <Toast/>
    </div>
  );
}
