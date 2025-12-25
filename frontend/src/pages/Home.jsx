import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>AI ATS Resume Builder</h1>
      <p>Create an ATS-friendly resume in minutes</p>

      <div style={{ marginTop: "30px" }}>
        <Link to="/register">
          <button style={{ marginRight: "10px" }}>
            Create Resume
          </button>
        </Link>

        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
