import "./App.css";
import { HashRouter, Route, Routes, Link } from "react-router-dom";
import * as React from "react";
import { css } from "@emotion/react";
import BeatLoader from "react-spinners/BeatLoader";
const Watch = React.lazy(() => import("./Watch"));

function App() {

  return (
    <HashRouter>
     
      <div className="p-3  bg-gradient-to-br from-black via-gray-900 to-black bg-cover" style={{height:"auto"}}>
        <Routes>
          <Route
            path="/"
            element={
              <React.Suspense fallback={<LoadingPage />}>
                <Watch />
              </React.Suspense>
            }
          />
        </Routes>
      </div>
    </HashRouter>
  );
}
function LoadingPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <BeatLoader color={"#ffffff"} loading={true} css={css} size={50} />
    </div>
  );
}
export default App;
