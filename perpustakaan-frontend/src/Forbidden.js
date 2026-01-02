function Forbidden({ onBack }) {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>403 Forbidden</h1>
      <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>

      {onBack && (
        <button
          onClick={onBack}
          style={{ marginTop: "20px", padding: "8px 16px" }}
        >
          Kembali
        </button>
      )}
    </div>
  );
}

export default Forbidden;
