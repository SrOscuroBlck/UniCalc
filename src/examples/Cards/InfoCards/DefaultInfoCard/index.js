// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

import { useState } from "react";
import { createSubject } from "firebaseConfig/config";
import { useAuth } from "context/AuthContext";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

function DefaultInfoCard({ color, icon, title, description, value, action }) {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [firstCut, setFirstCut] = useState();
  const [secondCut, setSecondCut] = useState();
  const [thirdCut, setThirdCut] = useState();
  const handleAddSubject = () => {
    createSubject(user, subject, firstCut, secondCut, thirdCut);
    setFirstCut(-1);
    setSecondCut(-1);
    setThirdCut(-1);
    setSubject("");
  };
  return (
    <Card>
      <MDBox p={2} mx={3} display="flex" justifyContent="center">
        <MDBox
          display="grid"
          justifyContent="center"
          alignItems="center"
          bgColor={color}
          color="white"
          width="4rem"
          height="4rem"
          shadow="md"
          borderRadius="lg"
          variant="gradient"
        >
          <Icon fontSize="default">{icon}</Icon>
        </MDBox>
      </MDBox>
      <MDBox pb={2} px={2} textAlign="center" lineHeight={1.25}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
        {description && (
          <MDTypography variant="caption" color="text" fontWeight="regular">
            {description}
          </MDTypography>
        )}
        {description && !value ? null : <Divider />}
        {value && (
          <MDTypography variant="h5" fontWeight="medium">
            {value}
          </MDTypography>
        )}
        <MDInput label="Nombre de la materia" onChange={(e) => setSubject(e.target.value)} />
        <br />
        <MDInput label="Nota Corte 1" onChange={(e) => setFirstCut(e.target.value)} />
        <MDInput label="Nota Corte 2" onChange={(e) => setSecondCut(e.target.value)} />
        <MDInput label="Nota Corte 3" onChange={(e) => setThirdCut(e.target.value)} />
        <MDBox mt={2}>
          <MDButton variant="gradient" color="success" onClick={handleAddSubject}>
            Agregar
          </MDButton>
        </MDBox>
        {action && <MDBox mt={2}>{action}</MDBox>}
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of DefaultInfoCard
DefaultInfoCard.defaultProps = {
  color: "info",
  value: "",
  description: "",
  action: null,
};

// Typechecking props for the DefaultInfoCard
DefaultInfoCard.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  action: PropTypes.node,
};

export default DefaultInfoCard;
