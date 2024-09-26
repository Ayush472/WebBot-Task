import { Input, Select } from "antd";
import { RiMapPinLine } from "react-icons/ri";
import { FaWifi } from "react-icons/fa";

const { Option } = Select;

const FilterBar = ({ filterParams, setFilterParams, data }) => {
  const handleFilterChange = (e) => {
    setFilterParams({ ...filterParams, filter: e.target.value });
  };

  const handleLocationFilterChange = (value) => {
    setFilterParams({ ...filterParams, locationFilter: value });
  };

  const handleStatusFilterChange = (value) => {
    setFilterParams({ ...filterParams, statusFilter: value });
  };

  return (
    <div style={{ display: "flex", marginBottom: 16 }}>
      <Input
        placeholder="Filter tasks"
        value={filterParams.filter}
        onChange={handleFilterChange}
        style={{ marginRight: 16, width: 200 }}
      />
      <Select
        placeholder={<span><RiMapPinLine /> Location</span>}
        value={filterParams.locationFilter}
        onChange={handleLocationFilterChange}
        style={{ marginRight: 16, width: 200 }}
        allowClear
      >
        {Array.from(new Set(data?.data?.data?.map(item => item.location))).map(location => (
          <Option key={location} value={location}>{location}</Option>
        ))}
      </Select>
      <Select
        placeholder={<span><FaWifi /> Status</span>}
        value={filterParams.statusFilter}
        onChange={handleStatusFilterChange}
        style={{ width: 200 }}
        allowClear
      >
        <Option value="Active">Active</Option>
        <Option value="Inactive">Inactive</Option>
      </Select>
    </div>
  );
};

export default FilterBar;
