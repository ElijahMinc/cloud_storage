import { BrowserRouter as Router } from 'react-router-dom'
import { Header } from "@components/Header/Header";
import { Toast } from "@common/Toast/Toast";
import { AppRouter } from "@components/AppRouter/AppRouter";


export const App = () => {



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
