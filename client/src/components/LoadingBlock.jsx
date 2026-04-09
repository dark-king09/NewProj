export const LoadingBlock = ({ message = "Loading content..." }) => (
  <div className="loading-block">
    <span className="loading-dot" />
    <p>{message}</p>
  </div>
);
