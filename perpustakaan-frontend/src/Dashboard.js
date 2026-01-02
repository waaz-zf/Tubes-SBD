/* eslint-disable */
import { useEffect, useMemo, useState } from "react";
import api from "./Api_tmp";
import Forbidden from "./Forbidden";

function Dashboard({ user }) {
  const [rawData, setRawData] = useState([]);
  const [mode, setMode] = useState("pagination");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // SEARCH & SORT
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("id_anggota");
  const [direction, setDirection] = useState("asc");

  // SIMULASI 403
  const [forceForbidden, setForceForbidden] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [mode, search, orderBy, direction]);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      let response;

      if (mode === "pagination") {
        response = await api.get("/anggota", {
          params: {
            per_page: 10,
            search,
            orderBy,
            direction,
          },
        });
        setRawData(response.data.data);
      } else {
        response = await api.get("/anggota-all");
        setRawData(response.data);
      }
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================
   * CLIENT-SIDE SEARCH & SORT
   * (UNTUK TANPA PAGINATION)
   * ===================================== */
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
      let valA = a[orderBy];
      let valB = b[orderBy];

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

  // 403 PAGE
  if (forceForbidden) {
    return <Forbidden onBack={() => setForceForbidden(false)} />;
  }

  return (
    <div>
      <h2>Dashboard ({user.roles.join(", ")})</h2>

      {/* MODE BUTTON */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setMode("pagination")}>Pagination</button>

        {user.roles.includes("Admin") && (
          <button onClick={() => setMode("all")} style={{ marginLeft: "5px" }}>
            Tanpa Pagination
          </button>
        )}

        <button
          onClick={() => setForceForbidden(true)}
          style={{
            marginLeft: "10px",
            backgroundColor: "#f44336",
            color: "white",
          }}
        >
          Simulasi 403
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Cari nama anggota..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px", width: "200px" }}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table border="1" cellPadding="5">
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
                      style={{ marginLeft: "5px" }}
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
      )}
    </div>
  );
}

export default Dashboard;
