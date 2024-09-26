import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import api from "./api/api";
import { Button, notification, Popconfirm, Progress, Table,Input } from "antd";
import { RiCloudLine, RiServerFill } from "react-icons/ri";
import { PiWarningCircleBold } from "react-icons/pi";
import { CgUnavailable } from "react-icons/cg";
import { CiCircleCheck } from "react-icons/ci";

function App() {
  const { data, isLoading, isSuccess } = useQuery("todos", api.fetchCameras);
  const updateCameraStatus = useMutation(api.updateCameraStatus);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [filter, setFilter] = useState("");

  // Handle table change (pagination, filtering, sorting)
  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination({
      ...newPagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
    console.log("Table parameters:", newPagination, filters, sorter);
  };
  const handleSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectChange,
  };
  // Define table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (name, data1) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor:
                data1.current_status === "Online" ? "green" : "red",
              marginRight: 8,
            }}
          />
          <span>{name}</span>
          {data1.hasWarning && (
            <span style={{ marginLeft: 10, color: "yellow" }}>
              <PiWarningCircleBold style={{ marginRight: 4 }} />
            </span>
          )}
        </div>
      ),
      filters: [
        { text: "Online", value: "Online" },
        { text: "Offline", value: "Offline" },
      ],
      onFilter: (value, record) => record.current_status === value,
    },
    {
      title: "HEALTH",
      dataIndex: "health",
      render: (healthData) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <RiCloudLine style={{ marginRight: 4 }} />
          <Progress
            type="circle"
            percent={75}
            size={25}
            strokeColor={healthData.cloud === "A" ? "green" : "orange"}
            format={() => healthData.cloud}
          />
          <RiServerFill style={{ marginInline: 4 }} />
          <Progress
            type="circle"
            percent={75}
            size={25}
            strokeColor={healthData.device === "A" ? "green" : "orange"}
            format={() => healthData.device}
          />
        </div>
      ),
      filters: [
        { text: "Healthy", value: "A" },
        { text: "Warning", value: "B" },
      ],
      onFilter: (value, record) => record.health.cloud === value,
    },
    {
      title: "LOCATION",
      dataIndex: "location",
      sorter: (a, b) => a.location.localeCompare(b.location),
    },
    {
      title: "RECORDER",
      dataIndex: "recorder",
      sorter: (a, b) => a.tasks - b.tasks,
    },
    {
      title: "TASKS",
      dataIndex: "tasks",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      render: (status, record) => (
        <Button
          type="primary"
          style={{
            backgroundColor: status === "Active" ? "lightgreen" : "#e6e6e6",
            color: status === "Active" ? "green" : "black",
            // borderColor: status === "Active" ? "green" : "black",
          }}
        >
          {status}
        </Button>
      ),
    },
    {
      title: "ACTION",
      dataIndex: "status",
      render: (status, objectData) => (
        <Popconfirm
          title="Update Status"
          description="Are you sure you update the server stauts?"
          onConfirm={() => handleUpdateStauts(objectData)}
          onCancel={() => console.log("Not Update the Value ")}
          okText="submit"
          cancelText="Cancel"
        >
          <div
            onClick={(e) => {
              console.log(e, status);
            }}
          >
            {status === "Active" ? (
              <CgUnavailable style={{ fontSize: "18px" }} />
            ) : (
              <CiCircleCheck style={{ color: "green", fontSize: "18px" }} />
            )}
          </div>
        </Popconfirm>
      ),
    },
  ];
  const handleUpdateStauts = (value) => {
    console.log("handle Update Status", value);
    updateCameraStatus.mutate(
      {
        id: value.id,
        status: value.status === "Active" ? "Inactive" : "Active",
      },
      {
        onSuccess: (data) => {
          console.log("Update Successfully", data);
          notification.success();
        },
        onError: (error) => {
          console.log("Error", error);
        },
      }
    );
  };
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredData = data?.filter((item) =>
    item.tasks.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <>
      <h1>Camera Management</h1>
      <Input
        placeholder="Filter tasks"
        value={filter}
        onChange={handleFilterChange}
        style={{ marginBottom: 16 }}
      />
      <Table
        loading={isLoading}
        dataSource={data?.data?.data} // Assuming data is structured this way
        columns={columns}
        rowSelection={rowSelection}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
        onChange={handleTableChange} // Handle table changes for pagination, filters, sorting
      />
    </>
  );
}

export default App;
