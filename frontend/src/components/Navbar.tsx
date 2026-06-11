type NavbarProps = {
  currentPage: string;
  onPageChange: (page: string) => void;
};

function Navbar({ currentPage, onPageChange }: NavbarProps) {
  return (
    <nav className="navbar">
      <h1>IRONLOG</h1>

      <div className="nav-links">
        <button
          className={currentPage === "home" ? "active-nav" : ""}
          onClick={() => onPageChange("home")}
        >
          Home
        </button>

        <button
          className={currentPage === "workouts" ? "active-nav" : ""}
          onClick={() => onPageChange("workouts")}
        >
          Workouts
        </button>

        <button
          className={currentPage === "progress" ? "active-nav" : ""}
          onClick={() => onPageChange("progress")}
        >
          Progress
        </button>
      </div>
    </nav>
  );
}

export default Navbar;