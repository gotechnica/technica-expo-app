import React from "react";

import SearchandFilter from "SearchandFilter";
import SiteWrapper from "SiteWrapper.js";

import "App.css";

export default function Home() {
  return SiteWrapper(
    <div class="Home">
      <div class="row">
        <div class="col">
          <SearchandFilter origin="home" />
        </div>
      </div>
    </div>
  );
}
