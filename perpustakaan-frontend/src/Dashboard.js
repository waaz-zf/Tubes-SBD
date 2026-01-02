/* eslint-disable */
import { useEffect, useMemo, useState } from "react";
import api from "./Api_tmp";
import Forbidden from "./Forbidden";
import "./styles/dashboard.css";

function Dashboard({ user, onLogout }) {
  // =========================
  // STATE
  // =========================
  const [rawData, setRawData] = useState([]);
  const [mode, setMode] = useState("pagination"); // pagination | all
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("id_anggota");
  const [direction, setDirection] = useState("asc");

  // Simulasi Forbidden
  const [forceForbidden, setForceForbidden] = useState(false);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [mode, search, orderBy, direction]);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      let res;

      if (mode === "pagination") {
        res = await api.get("/anggota", {
          params: {
            per_page: 10,
            search,
            orderBy,
            direction,
          },
        });
        setRawData(res.data.data);
      } else {
        // TANPA PAGINATION (ADMIN ONLY)
        res = await api.get("/anggota-all");
        setRawData(res.data);
      }
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CLIENT-SIDE SEARCH & SORT
  // (UNTUK MODE TANPA PAGINATION)
  // =========================
  const processedData = useMemo(() => {
    let data = [...rawData];

    // SEARCH
    if (search) {
      data = data.filter((item) =>
        item.nama.toLowerCase().includes(search.toLowerCase())
      );
    }

    // SORT
    data.sort((a, b) => {
      const valA = a[orderBy];
      const valB = b[orderBy];

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [rawData, search, orderBy, direction]);

  const toggleSort = (field) => {
    if (orderBy === field) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(field);
      setDirection("asc");
    }
  };

  // =========================
  // FORBIDDEN PAGE
  // =========================
  if (forceForbidden) {
    return (
      <Forbidden
        onBack={() => setForceForbidden(false)}
        onLogout={onLogout}
      />
    );
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div className="dashboard-wrapper">
      {/* HEADER */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Dashboard Sistem Perpustakaan</h1>
          <p>Manajemen data anggota & kontrol akses berbasis peran</p>
        </div>

        <div className="dashboard-right">
          <span className="role-badge">{user.roles.join(", ")}</span>
          <button className="btn-logout" onClick={onLogout}>
            ⎋ Logout
          </button>
        </div>
      </div>

      {/* CONTROL BAR */}
      <div className="control-bar">
        <button
          className={`btn-primary ${mode === "pagination" ? "active" : ""}`}
          onClick={() => setMode("pagination")}
        >
          Pagination
        </button>

        {user.roles.includes("Admin") && (
          <button
            className={`btn-secondary ${mode === "all" ? "active" : ""}`}
            onClick={() => setMode("all")}
          >
            Tanpa Pagination
          </button>
        )}

        <button
          className="btn-danger"
          onClick={() => setForceForbidden(true)}
        >
          Simulasi 403
        </button>
      </div>

      {/* SEARCH */}
      <input
        className="search-input"
        placeholder="Cari nama anggota..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* STATUS */}
      {loading && <p className="info">Loading data...</p>}
      {error && <p className="error">{error}</p>}

      {/* TABLE */}
      {!loading && !error && (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort("id_anggota")}>ID</th>
                <th onClick={() => toggleSort("nama")}>Nama</th>
                <th>Email</th>
                <th>Alamat</th>
                <th onClick={() => toggleSort("tanggal_daftar")}>
                  Tanggal Daftar
                </th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {processedData.map((a) => (
                <tr key={a.id_anggota}>
                  <td>{a.id_anggota}</td>
                  <td>{a.nama}</td>
                  <td>{a.email}</td>
                  <td>{a.alamat}</td>
                  <td>{a.tanggal_daftar}</td>
                  <td className="action-cell">
                    {(user.roles.includes("Admin") ||
                      user.roles.includes("Editor")) && (
                      <button
                        className="btn-edit"
                        onClick={() =>
                          alert(
                            `Simulasi Edit\nID: ${a.id_anggota}\nNama: ${a.nama}`
                          )
                        }
                      >
                        Edit
                      </button>
                    )}

                    {user.roles.includes("Admin") && (
                      <button
                        className="btn-delete"
                        onClick={() =>
                          alert(
                            `Simulasi Hapus\nID: ${a.id_anggota}\nNama: ${a.nama}`
                          )
                        }
                      >
                        Hapus
                      </button>
                    )}

                    {user.roles.includes("Viewer") && <span>-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
