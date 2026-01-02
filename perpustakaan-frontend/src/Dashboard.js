/* eslint-disable */
import { useEffect, useMemo, useState } from "react";
import api from "./Api_tmp";
import Forbidden from "./Forbidden";
import "./styles/dashboard.css";

function Dashboard({ user }) {
  const [rawData, setRawData] = useState([]);
  const [mode, setMode] = useState("pagination");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("id_anggota");
  const [direction, setDirection] = useState("asc");

  const [forceForbidden, setForceForbidden] = useState(false);

  // Modal state
  const [modal, setModal] = useState({
    open: false,
    type: "",
    data: null,
  });

  useEffect(() => {
    fetchData();
  }, [mode, search, orderBy, direction]);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      let res;
      if (mode === "pagination") {
        res = await api.get("/anggota", {
          params: { per_page: 10, search, orderBy, direction },
        });
        setRawData(res.data.data);
      } else {
        res = await api.get("/anggota-all");
        setRawData(res.data);
      }
    } catch {
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const processedData = useMemo(() => {
    let data = [...rawData];

    if (search) {
      data = data.filter((i) =>
        i.nama.toLowerCase().includes(search.toLowerCase())
      );
    }

    data.sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return direction === "asc" ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return direction === "asc" ? 1 : -1;
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

  if (forceForbidden) {
    return <Forbidden onBack={() => setForceForbidden(false)} />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <span className="role-badge">{user.roles.join(", ")}</span>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <button onClick={() => setMode("pagination")}>Pagination</button>

        {user.roles.includes("Admin") && (
          <button onClick={() => setMode("all")}>Tanpa Pagination</button>
        )}

        <button className="danger" onClick={() => setForceForbidden(true)}>
          Simulasi 403
        </button>
      </div>

      <input
        className="search-input"
        placeholder="Cari nama anggota..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="info">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
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
                <td>
                  {(user.roles.includes("Admin") ||
                    user.roles.includes("Editor")) && (
                    <button
                      className="btn-edit"
                      onClick={() =>
                        setModal({ open: true, type: "edit", data: a })
                      }
                    >
                      Edit
                    </button>
                  )}

                  {user.roles.includes("Admin") && (
                    <button
                      className="btn-delete"
                      onClick={() =>
                        setModal({ open: true, type: "delete", data: a })
                      }
                    >
                      Hapus
                    </button>
                  )}

                  {user.roles.includes("Viewer") && "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL */}
      {modal.open && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>
              {modal.type === "edit" ? "Edit Data" : "Hapus Data"}
            </h3>
            <p>
              ID: <b>{modal.data.id_anggota}</b>
              <br />
              Nama: <b>{modal.data.nama}</b>
            </p>

            <div className="modal-actions">
              <button onClick={() => setModal({ open: false })}>
                Batal
              </button>
              <button
                className={modal.type === "edit" ? "btn-edit" : "btn-delete"}
                onClick={() => setModal({ open: false })}
              >
                {modal.type === "edit" ? "Simpan" : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
