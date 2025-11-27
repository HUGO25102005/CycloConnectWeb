import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Space,
  Input,
  Button,
  Spin,
  Alert,
  Row,
  Col,
  Typography,
  Segmented,
} from "antd";
import { apiService } from "../../../services";
import type { Lock } from "../../../types/api";
import { AdminLockCard } from "./AdminLockCard";
import { Filter, Search, RefreshCw } from "lucide-react";

const { Text } = Typography;

type FilterType = "all" | "low_battery" | "offline" | "unlocked";

export const AdminLocksGrid = () => {
  const [locks, setLocks] = useState<Lock[]>([]);
  const [filteredLocks, setFilteredLocks] = useState<Lock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const navigate = useNavigate();

  const fetchLocks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.locks.getAll();
      if (response.success && response.data) {
        setLocks(response.data);
        setFilteredLocks(response.data);
      } else {
        setError(response.error || "No se pudieron cargar los candados");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocks();
  }, []);

  useEffect(() => {
    let filtered = locks;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (lock) =>
          lock.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (
            lock.position?.toLowerCase() || `candado ${lock.id}`.toLowerCase()
          ).includes(searchTerm.toLowerCase())
      );
    }

    // Apply filter
    switch (activeFilter) {
      case "low_battery":
        filtered = filtered.filter((lock) => lock.last_battery < 20);
        break;
      case "offline":
        filtered = filtered.filter(
          (lock) => lock.controller_status === "offline"
        );
        break;
      case "unlocked":
        filtered = filtered.filter((lock) => lock.last_state === "unlocked");
        break;
    }

    setFilteredLocks(filtered);
  }, [searchTerm, activeFilter, locks]);

  const handleLockClick = (lockId: string) => {
    navigate(`/app/admin/locks/${lockId}`);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "64px 0" }}>
        <Spin
          size="large"
          indicator={<RefreshCw className="animate-spin" size={32} />}
        />
        <Text type="secondary" style={{ display: "block", marginTop: 12 }}>
          Cargando candados...
        </Text>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        action={
          <Button type="primary" danger onClick={fetchLocks}>
            Reintentar
          </Button>
        }
      />
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Controls */}
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
          {/* Search */}
          <Input
            placeholder="Buscar por ID o posición..."
            prefix={<Search size={18} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />

          {/* Filters */}
          <Space>
            <Filter size={18} style={{ color: "#666" }} />
            <Segmented
              value={activeFilter}
              onChange={(value) => setActiveFilter(value as FilterType)}
              options={[
                { label: "Todos", value: "all" },
                { label: "Batería Baja", value: "low_battery" },
                { label: "Offline", value: "offline" },
                { label: "Abiertos", value: "unlocked" },
              ]}
            />
            <Button
              icon={<RefreshCw size={18} />}
              onClick={fetchLocks}
              title="Refrescar"
            />
          </Space>
        </Space>

        {/* Results Count */}
        <Text type="secondary">
          Mostrando {filteredLocks.length} de {locks.length} candados
        </Text>
      </Space>

      {/* Grid */}
      {filteredLocks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <Text type="secondary">
            No se encontraron candados con los filtros aplicados
          </Text>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredLocks.map((lock) => (
            <Col key={lock.id} xs={24} sm={12} lg={8} xl={6}>
              <AdminLockCard
                lock={lock}
                onClick={() => handleLockClick(lock.id)}
              />
            </Col>
          ))}
        </Row>
      )}
    </Space>
  );
};
