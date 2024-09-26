import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import api from "./api/api";
import { Button, notification, Popconfirm, Progress, Table, Input, Select } from "antd";
import { RiCloudLine, RiServerFill, RiSearchLine, RiMapPinLine, RiDeleteBinLine } from "react-icons/ri";
import { PiWarningCircleBold } from "react-icons/pi";
import { CgUnavailable } from "react-icons/cg";
import { CiCircleCheck } from "react-icons/ci";
import { FaWifi } from "react-icons/fa";
import WebBotImg from "../src/assets/images/wobot_logo_blue.svg"
const { Option } = Select;

function App() {
  const { data, isLoading, isSuccess, refetch } = useQuery("todos", api.fetchCameras);
  const updateCameraStatus = useMutation(api.updateCameraStatus);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [filter, setFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [generalSearch, setGeneralSearch] = useState("");
  const [localData, setLocalData] = useState(data?.data?.data || []);

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
  useEffect(() => {
    if (data?.data?.data) {
      setLocalData(data.data.data);
    }
  }, [data]);
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
        <div style={{ display: "flex" }}>

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
          <RiDeleteBinLine
            style={{ color: "red", fontSize: "18px", marginLeft: 16, cursor: "pointer" }}
            onClick={() => handleDelete(objectData.id)}
          />
        </div>
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
          notification.success({
            description: "Update Successfully",
          });
          refetch(); // Refetch the data after successful update
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

  const handleLocationFilterChange = (value) => {
    setLocationFilter(value);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleGeneralSearchChange = (e) => {
    setGeneralSearch(e.target.value);
  };

  const filteredData = localData
    ?.filter((item) =>
      item.tasks.toLowerCase().includes(filter.toLowerCase())
    )
    ?.filter((item) =>
      locationFilter ? item.location === locationFilter : true
    )
    ?.filter((item) =>
      statusFilter ? item.status === statusFilter : true
    )
    ?.filter((item) =>
      generalSearch ?
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(generalSearch.toLowerCase())
        )
        : true
    ); const handleDelete = (id) => {
      setLocalData(localData.filter(item => item.id !== id));
    };

  return (
    <>
    <div style={{textAlign:"center"}}>
      <img src={WebBotImg} alt="WebBotImg" />
    </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Camera Management</h1>
        <Input
          placeholder="Search..."
          value={generalSearch}
          onChange={handleGeneralSearchChange}
          style={{ width: 200 }}
          prefix={<RiSearchLine />}
        />
      </div>
      <div style={{ display: "flex", marginBottom: 16 }}>
        <Input
          placeholder="Filter tasks"
          value={filter}
          onChange={handleFilterChange}
          style={{ marginRight: 16, width: 200 }}
        />
        <Select
          placeholder={<span style={{ display: "flex", alignItems: "center" }}><RiMapPinLine style={{ marginRight: 10 }} /> Location</span>}
          value={locationFilter}
          onChange={handleLocationFilterChange}
          style={{ marginRight: 16, width: 200 }}
        >
          {Array.from(new Set(data?.data?.data?.map(item => item.location))).map(location => (
            <Option key={location} value={location}>{location}</Option>
          ))}
        </Select>
        <Select
          placeholder={<span style={{ display: "flex", alignItems: "center" }}><FaWifi style={{ marginRight: 10, transform: 'rotateZ(45deg)' }} /> Status</span>}
          value={statusFilter}
          onChange={handleStatusFilterChange}
          style={{ width: 200 }}
        >
          <Option value="Active">Active</Option>
          <Option value="Inactive">Inactive</Option>
        </Select>
      </div>
      <Table
        loading={isLoading}
        dataSource={filteredData} // Use filtered data
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