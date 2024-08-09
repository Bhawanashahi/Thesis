export default function LoadingBox() {
  return (
    <div className="container d-flex justify-content-center mt-5 mb-5">
      <svg className="loading_svg" viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
    </div>
  );
}
