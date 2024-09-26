import { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import api from "./api/api";
import { notification, Input } from "antd";
import WebBotImg from "../src/assets/images/wobot_logo_blue.svg";
import CameraTable from "./components/CameraTable";
import FilterBar from "./components/FilterBar";

function App() {
  const { data, isLoading, refetch } = useQuery("todos", api.fetchCameras);
  const updateCameraStatus = useMutation(api.updateCameraStatus);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [localData, setLocalData] = useState([]);
  const [generalSearch, setGeneralSearch] = useState("");
  const [filterParams, setFilterParams] = useState({ filter: "", locationFilter: null, statusFilter: null });

  // Update localData when API data changes
  useEffect(() => {
    if (data?.data?.data) {
      setLocalData(data.data.data);
    }
  }, [data]);

  const handleUpdateStatus = (camera) => {
    updateCameraStatus.mutate(
      { id: camera.id, status: camera.status === "Active" ? "Inactive" : "Active" },
      {
        onSuccess: () => {
          notification.success({ description: "Status updated successfully" });
          refetch();
        },
        onError: (error) => console.error("Error updating status:", error),
      }
    );
  };

  const handleDelete = (id) => {
    setLocalData(localData.filter(item => item.id !== id));
  };

  const filteredData = localData
    .filter(item => item.tasks.toLowerCase().includes(filterParams.filter.toLowerCase()))
    .filter(item => (filterParams.locationFilter ? item.location === filterParams.locationFilter : true))
    .filter(item => (filterParams.statusFilter ? item.status === filterParams.statusFilter : true))
    .filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(generalSearch.toLowerCase())));

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <img src={WebBotImg} alt="WebBotImg" />
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>

      <h1>Camera Management</h1>
      <Input
        placeholder="Search..."
        value={generalSearch}
        onChange={(e) => setGeneralSearch(e.target.value)}
        style={{ width: 200,height:30 }}
      />
      </div>
      <FilterBar filterParams={filterParams} setFilterParams={setFilterParams} data={data} />
      <CameraTable
        loading={isLoading}
        data={filteredData}
        pagination={pagination}
        setPagination={setPagination}
        handleUpdateStatus={handleUpdateStatus}
        handleDelete={handleDelete}
      />
    </>
  );
}

export default App;
