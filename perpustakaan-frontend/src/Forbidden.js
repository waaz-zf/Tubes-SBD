import "./styles/forbidden.css";

function Forbidden({ onBack, onLogout }) {
  return (
    <div className="forbidden-wrapper">
      <div className="forbidden-card">
        <div className="forbidden-icon">⛔</div>

        <h1>403 Forbidden</h1>
        <p>
          Anda tidak memiliki izin untuk mengakses halaman ini.
          <br />
          Silakan kembali atau logout untuk masuk dengan akun lain.
        </p>

        <div className="forbidden-actions">
          {onBack && (
            <button className="btn-secondary" onClick={onBack}>
              ⬅ Kembali
            </button>
          )}

          {onLogout && (
            <button className="btn-danger" onClick={onLogout}>
              🚪 Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Forbidden;
