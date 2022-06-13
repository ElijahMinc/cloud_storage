import { useState } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Header } from "../Header/Header";
import { PrivateRoute } from "../../common/PrivateRouter/PrivateRoute";
import { routes } from "../../routes/routes";
import { LoginRoute } from "../../common/LoginRoute/LoginRoute";


export const App = () => {


  return (
    <div className="App">
          <Router>
            <Header />
            <main>
              <div className="container">
                    {routes.map(({path, component, exact, auth}) => (
                      auth ? (
                        <PrivateRoute 
                          key={`route-${path}`}
                          path={path}
                          component={component}
                          exact={exact} 
                        />
                      ) : (
                        <LoginRoute
                          key={`route-${path}`}
                          path={path}
                          component={component}
                          exact={exact} 
                        /> 
                      )
                       
                    ))}
              </div>
            </main>
        </Router>
    </div>
  );
}
