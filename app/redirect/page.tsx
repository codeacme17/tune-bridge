"use client";

import { useEffect } from "react";

const Redirect = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    if (authCode) {
      localStorage.setItem("spotify_authCode", authCode);
      window.close();
    }
  }, []);

  return (
    <div>
      <h1>Redirect</h1>
    </div>
  );
};

export default Redirect;
