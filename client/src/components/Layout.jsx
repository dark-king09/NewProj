import { Outlet } from "react-router-dom";
import { useSiteContent } from "../hooks/useSiteContent";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { ScrollToTop } from "./ScrollToTop";

export const Layout = () => {
  const site = useSiteContent();

  return (
    <div className="site-shell">
      <ScrollToTop />
      {site.source === "fallback" ? (
        <div className="preview-banner">
          Preview mode is active. Connect MongoDB Atlas to replace demo content with live content.
        </div>
      ) : null}
      <Navbar />
      <main>
        <Outlet context={site} />
      </main>
      <Footer />
    </div>
  );
};
