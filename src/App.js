import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navigation from "./components/Navigation";
import Loading from "./components/Loading";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { selectAppLoading } from "./store/appState/selectors";
import { getUserWithStoredToken } from "./store/user/actions";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAppLoading);

  useEffect(() => {
    dispatch(getUserWithStoredToken());
  }, [dispatch]);
  return (
    <div>
      <Navigation />
      {isLoading ? <Loading /> : null}

      <Switch>
        <Route exact path="/" />
        <Route path="/about" />
        <Route path="/login" component={Login} />
        <Route path="/Signup" component={Signup} />
      </Switch>
    </div>
  );
}
