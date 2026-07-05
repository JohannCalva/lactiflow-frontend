import React, { useState, useEffect, useMemo } from "react";
import { Alert, Table, Badge, Spinner, Button, Form } from "react-bootstrap";
import suggestionsService from "../../services/suggestions.service";

const Suggestions = () => {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [productFilter, setProductFilter] = useState("");

  const fetchSuggestions = async (selectedDate) => {
    setIsLoading(true);
    setError("");
    try {
      const results = await Promise.allSettled([
        suggestionsService.get(selectedDate),
        suggestionsService.summary(selectedDate),
      ]);

      const suggestionsRes = results[0];
      const totalsRes = results[1];

      // suggestions
      if (suggestionsRes.status === "fulfilled") {
        const items = suggestionsRes.value.data;
        const mapped = items.map((it, idx) => ({
          id: it.id ?? idx,
          client: it.client?.name ?? "",
          business_type: it.client?.business_type?.name ?? "",
          product: it.product?.name ?? "",
          suggested_qty: it.suggested_qty,
          method: it.method,
          confidence: it.confidence,
        }));
        setData(mapped);
      } else {
        setError((prev) =>
          prev
            ? prev + " | Error al cargar las sugerencias"
            : "Error al cargar las sugerencias",
        );
        setData([]);
      }

      // totals
      if (totalsRes.status === "fulfilled") {
        setTotals(totalsRes.value.data || []);
      } else {
        setError((prev) =>
          prev
            ? prev + " | Error al cargar los totales"
            : "Error al cargar los totales",
        );
        setTotals([]);
      }
    } catch (err) {
      // Fallback; should not reach here because we use allSettled
      setError("Error al cargar las sugerencias");
      setData([]);
      setTotals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions(date);
  }, [date]);

  const renderConfidence = (val) => {
    const v = (val || "").toLowerCase();
    if (v === "alta") return <Badge bg="success">Alta</Badge>;
    if (v === "media")
      return (
        <Badge bg="warning" text="dark">
          Media
        </Badge>
      );
    if (v === "baja") return <Badge bg="danger">Baja</Badge>;
    return <Badge bg="secondary">{val || "N/A"}</Badge>;
  };

  // Date helpers (local-date safe)
  const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
  const toISO = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseISO = (iso) => {
    const [y, m, day] = iso.split("-").map(Number);
    return new Date(y, m - 1, day);
  };

  const getStartOfWeek = (d) => {
    const dateObj = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = dateObj.getDay(); // 0 (Sun) - 6 (Sat)
    const diff = (day + 6) % 7; // convert so Monday=0
    dateObj.setDate(dateObj.getDate() - diff);
    return dateObj;
  };

  const addDays = (d, days) => {
    const r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    r.setDate(r.getDate() + days);
    return r;
  };

  const weekdayShort = (d) => {
    const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const idx = (d.getDay() + 6) % 7;
    return names[idx];
  };

  const getWeekDates = (isoDate) => {
    const d = parseISO(isoDate);
    const start = getStartOfWeek(d);
    const arr = [];
    for (let i = 0; i < 7; i++) arr.push(addDays(start, i));
    return arr;
  };

  const weekDates = getWeekDates(date);

  const productOptions = useMemo(() => {
    const names = new Set(data.map((row) => row.product).filter(Boolean));
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [data]);

  const filteredData = useMemo(() => {
    const term = clientSearch.trim().toLowerCase();
    return data.filter((row) => {
      const matchesClient = !term || row.client.toLowerCase().includes(term);
      const matchesProduct = !productFilter || row.product === productFilter;
      return matchesClient && matchesProduct;
    });
  }, [data, clientSearch, productFilter]);

  const monthName = (d) => d.toLocaleString(undefined, { month: "long" });
  const weekHeader = `${monthName(weekDates[0])} ${weekDates[0].getDate()} - ${monthName(
    weekDates[6],
  )} ${weekDates[6].getDate()}, ${weekDates[6].getFullYear()}`;

  const changeWeek = (direction) => {
    const current = parseISO(date);
    const weekdayIndex = (current.getDay() + 6) % 7; // 0..6 (Mon=0)
    const start = getStartOfWeek(current);
    const newStart = addDays(start, direction * 7);
    const newSelected = addDays(newStart, weekdayIndex);
    setDate(toISO(newSelected));
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 text-dark fw-bold">Sugerencias</h2>
          <p className="text-muted mb-0">Sugerencias por fecha</p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded p-3 mb-4">
        <div className="d-flex align-items-center mb-3">
          <div className="me-2">
            <Button
              variant="light"
              onClick={() => changeWeek(-1)}
              className="border rounded-circle p-0 week-nav-btn"
              aria-label="Previous week"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 12L6 8l4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>

          <div className="flex-grow-1 text-center">
            <strong>{weekHeader}</strong>
          </div>

          <div className="ms-2">
            <Button
              variant="light"
              onClick={() => changeWeek(1)}
              className="border rounded-circle p-0 week-nav-btn"
              aria-label="Next week"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>
        </div>

        <div className="d-flex gap-2 mt-2">
          {weekDates.map((d) => {
            const iso = toISO(d);
            const isSelected = iso === date;
            return (
              <Button
                key={iso}
                variant={isSelected ? "primary" : "light"}
                size="sm"
                onClick={() => setDate(iso)}
                className={
                  "flex-fill d-flex flex-column justify-content-center align-items-center py-2 week-day-btn " +
                  (isSelected ? "text-white" : "")
                }
              >
                <div className={"small" + (isSelected ? "" : " text-muted")}>
                  {weekdayShort(d)}
                </div>
                <div className="fw-bold">{d.getDate()}</div>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
        <div className="position-relative flex-grow-1 suggestions-search-wrapper">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="position-absolute text-muted suggestions-search-icon"
          >
            <circle
              cx="7"
              cy="7"
              r="5.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M11.5 11.5L14.5 14.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <Form.Control
            type="text"
            placeholder="Buscar cliente..."
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
            className="rounded-pill shadow-sm suggestions-search-input"
          />
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="text-muted text-uppercase small fw-semibold">
            Filtro:
          </span>
          <Form.Select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="rounded-pill shadow-sm suggestions-product-select"
          >
            <option value="">Todos los productos</option>
            {productOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>

      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError("")}
          className="shadow-sm"
        >
          {error}
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Cargando sugerencias...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="alert alert-empty text-center mt-3 shadow-sm">
          {data.length === 0
            ? "No hay sugerencias para mostrar."
            : "No hay sugerencias que coincidan con la búsqueda."}
        </div>
      ) : (
        <div className="table-responsive bg-white shadow-sm rounded">
          <Table hover className="mb-0 align-middle">
            <thead className="bg-light text-muted">
              <tr>
                <th className="border-bottom-0 py-3">Cliente</th>
                <th className="border-bottom-0 py-3">Tipo de negocio</th>
                <th className="border-bottom-0 py-3">Producto</th>
                <th className="border-bottom-0 py-3">Cantidad sugerida</th>
                <th className="border-bottom-0 py-3">Método</th>
                <th className="border-bottom-0 py-3">Confianza</th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {filteredData.map((row) => (
                <tr key={row.id}>
                  <td className="py-3">{row.client}</td>
                  <td className="py-3">{row.business_type}</td>
                  <td className="py-3">{row.product}</td>
                  <td className="py-3">{row.suggested_qty}</td>
                  <td className="py-3">{row.method}</td>
                  <td className="py-3">{renderConfidence(row.confidence)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Totals by product section */}
      <div className="mt-4">
        <h5 className="mb-3">Totales por producto</h5>
        {totals.length === 0 ? (
          <div className="alert alert-empty text-center mt-1 shadow-sm">
            No hay totales para mostrar.
          </div>
        ) : (
          <div className="table-responsive bg-white shadow-sm rounded">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light text-muted">
                <tr>
                  <th className="border-bottom-0 py-3">Producto</th>
                  <th className="border-bottom-0 py-3">Cantidad total</th>
                  <th className="border-bottom-0 py-3">Unidad</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {totals.map((t, i) => (
                  <tr key={t.product_name ?? i}>
                    <td className="py-3">{t.product_name}</td>
                    <td className="py-3">{t.total_qty}</td>
                    <td className="py-3">{t.product_unit ?? "unidades"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

export default Suggestions;
