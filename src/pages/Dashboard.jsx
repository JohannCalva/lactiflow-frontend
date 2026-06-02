import React, { useContext, useState } from "react";
import { Button, Alert, Table, Spinner } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
    processed: 0,
    suggestions: 0,
    reclassified: 0,
  });
  const [success, setSuccess] = useState("");

  const handleGenerate = async () => {
    setError("");
    setIsGenerating(true);
    try {
      const resp = await api.post("/suggestions/generate");
      const data = resp.data || {};
      setSummary({
        processed: data.processed ?? 0,
        suggestions: data.suggestions ?? 0,
        reclassified: data.reclassified ?? 0,
      });
      setSuccess("Proyecciones actualizadas correctamente");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.error || "Error al generar proyecciones");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 text-dark fw-bold">Dashboard</h2>
          <p className="text-muted mb-0">Bienvenido al sistema Lactiflow.</p>
        </div>
        {isAdmin && (
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="rounded-pill px-4"
          >
            {isGenerating ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Generando...
              </>
            ) : (
              "Generar proyecciones"
            )}
          </Button>
        )}
      </div>

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError("")}
          className="mt-3 shadow-sm"
        >
          {error}
        </Alert>
      )}

      {isAdmin && (
        <div className="mt-3">
          {success && (
            <Alert variant="success" className="shadow-sm">
              {success}
            </Alert>
          )}

          <div className="table-responsive bg-white shadow-sm rounded">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light text-muted">
                <tr>
                  <th className="border-bottom-0 py-3">Métrica</th>
                  <th className="border-bottom-0 py-3">Valor</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                <tr>
                  <td className="py-3">Clientes procesados</td>
                  <td className="py-3">{summary.processed}</td>
                </tr>
                <tr>
                  <td className="py-3">Sugerencias generadas</td>
                  <td className="py-3">{summary.suggestions}</td>
                </tr>
                <tr>
                  <td className="py-3">Clientes reclasificados</td>
                  <td className="py-3">{summary.reclassified}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
