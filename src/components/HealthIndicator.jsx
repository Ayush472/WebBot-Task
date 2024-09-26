import { Progress } from "antd";
import { RiCloudLine, RiServerFill } from "react-icons/ri";

const HealthIndicator = ({ healthData }) => (
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
);

export default HealthIndicator;
