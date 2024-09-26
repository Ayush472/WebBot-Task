import { Table, Button, Popconfirm } from "antd";
import { CgUnavailable } from "react-icons/cg";
import { CiCircleCheck } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import HealthIndicator from "./HealthIndicator";

const CameraTable = ({ data, loading, pagination, setPagination, handleUpdateStatus, handleDelete }) => {
  const handleTableChange = (newPagination) => {
    setPagination({ ...newPagination, current: newPagination.current, pageSize: newPagination.pageSize });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (name, data) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>{name}</span>
        </div>
      ),
    },
    {
      title: "HEALTH",
      dataIndex: "health",
      render: (healthData) => <HealthIndicator healthData={healthData} />,
    },
    { title: "LOCATION", dataIndex: "location", sorter: (a, b) => a.location.localeCompare(b.location) },
    { title: "TASKS", dataIndex: "tasks" },
    {
      title: "STATUS",
      dataIndex: "status",
      render: (status) => (
        <Button type="primary" style={{ backgroundColor: status === "Active" ? "lightgreen" : "#e6e6e6" }}>
          {status}
        </Button>
      ),
    },
    {
      title: "ACTION",
      dataIndex: "status",
      render: (status, record) => (
        <div style={{ display: "flex" }}>
          <Popconfirm title={`change status to ${status === "Active" ? "Inactive" : "Active"}?`} onConfirm={() => handleUpdateStatus(record)}>
            {status === "Active" ? <CgUnavailable style={{ cursor: "pointer" }} /> : <CiCircleCheck style={{ color: "green", cursor: "pointer" }} />}
          </Popconfirm>
          <RiDeleteBinLine style={{ color: "red", marginLeft: 16, cursor: "pointer" }} onClick={() => handleDelete(record.id)} />
        </div>
      ),
    },
  ];

  return (
    <Table
      loading={loading}
      dataSource={data}
      columns={columns}
      rowKey="id"
      pagination={pagination}
      onChange={handleTableChange}
    />
  );
};

export default CameraTable;
