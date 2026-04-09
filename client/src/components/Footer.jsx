import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="site-footer">
    <div className="container footer-grid">
      <div>
        <p className="eyebrow">Rural Education & Skills</p>
        <h3>Learning and livelihood pathways that reach every village, learner, and next step.</h3>
      </div>
      <div>
        <p className="footer-title">Explore</p>
        <Link to="/programs">Programs</Link>
        <Link to="/stories">Stories</Link>
        <Link to="/resources">Resources</Link>
      </div>
      <div>
        <p className="footer-title">Connect</p>
        <Link to="/contact">Partnership inquiries</Link>
        <Link to="/impact">Impact overview</Link>
        <Link to="/admin/login">Admin access</Link>
      </div>
    </div>
    <div className="container footer-base">
      <p>Built for rural education teams, skilling initiatives, donors, and community partners.</p>
      <p>Open architecture, MongoDB Atlas ready, easy to extend.</p>
    </div>
  </footer>
);
