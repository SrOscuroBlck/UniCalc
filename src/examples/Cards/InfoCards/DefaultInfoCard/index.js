// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

import { useState, useEffect } from "react";
import { createSubject, editSubject } from "firebaseConfig/config";
import { useAuth } from "context/AuthContext";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

function DefaultInfoCard({
  color,
  icon,
  title,
  description,
  value,
  action,
  rSubject = {
    subject: undefined,
    credits: undefined,
    firstCut: undefined,
    secondCut: undefined,
    thirdCut: undefined,
  },
  close,
}) {
  const { user } = useAuth();
  

  const [subject, setSubject] = useState(rSubject.subject);
  const [credits, setCredits] = useState(rSubject.credits);

  const [firstCut, setFirstCut] = useState(rSubject.firstCut === -1 ? undefined : rSubject.firstCut);
  const [secondCut, setSecondCut] = useState(rSubject.secondCut === -1 ? undefined : rSubject.secondCut);
  const [thirdCut, setThirdCut] = useState(rSubject.thirdCut === -1 ? undefined : rSubject.thirdCut);

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (rSubject.subject !== undefined) {
      setEdit(true);
    }
  }, [rSubject]);

  useEffect(() => {
    if (rSubject.subject !== undefined) {
      setEdit(true);
    }
  
    if (rSubject.firstCut !== undefined && rSubject.firstCut !== -1) {
      setFirstCut(rSubject.firstCut);
    } else {
      setFirstCut(undefined);
    }
  
    if (rSubject.secondCut !== undefined && rSubject.secondCut !== -1) {
      setSecondCut(rSubject.secondCut);
    } else {
      setSecondCut(undefined);
    }
  
    if (rSubject.thirdCut !== undefined && rSubject.thirdCut !== -1) {
      setThirdCut(rSubject.thirdCut);
    } else {
      setThirdCut(undefined);
    }
  
    if (rSubject.credits !== undefined && rSubject.credits !== 0) {
      setCredits(rSubject.credits);
    } else {
      setCredits(undefined);
    }
    console.log(user, subject, credits, firstCut, secondCut, thirdCut);
  }, []);



  const handleAddSubject = () => {
    console.log(user, subject, credits, firstCut, secondCut, thirdCut);
    createSubject(user, subject, credits, firstCut, secondCut, thirdCut);
    setFirstCut(undefined);
    setSecondCut(undefined);
    setThirdCut(undefined);
    setSubject(undefined);
    setCredits(undefined);
    close();
  };

  const handleEditSubject = (subjectChange) => {
    editSubject(user, subjectChange, subject, credits, firstCut, secondCut, thirdCut);
    setFirstCut(undefined);
    setSecondCut(undefined);
    setThirdCut(undefined);
    setSubject(undefined);
    setCredits(undefined);
    close();
  }


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
        <MDBox display="flex" justifyContent="center" alignItems="center" mt={2}>
          <MDInput label="Nombre de la materia" onChange={(e) => setSubject(e.target.value)} value={subject} />
        </MDBox>

        <MDBox display="flex" justifyContent="center" alignItems="center" mt={2}>
          <MDInput label="Creditos" onChange={(e) => setCredits(e.target.value)} value={credits} />
        </MDBox>

        <MDBox display="flex" justifyContent="center" alignItems="center" mt={2}>
          <MDInput label="Nota Corte 1" onChange={(e) => setFirstCut(e.target.value)} value={firstCut} />
        </MDBox>

        <MDBox display="flex" justifyContent="center" alignItems="center" mt={2}>
          <MDInput label="Nota Corte 2" onChange={(e) => setSecondCut(e.target.value)} value={secondCut} />
        </MDBox>

        <MDBox display="flex" justifyContent="center" alignItems="center" mt={2}>
          <MDInput label="Nota Corte 3" onChange={(e) => setThirdCut(e.target.value)} value={thirdCut} />
        </MDBox>

        <MDBox mt={2}>
          {edit ? (
            <MDButton variant="gradient" color="success" onClick={() => handleEditSubject(rSubject.id)}>  
              Editar
            </MDButton>
          ) : (
            <MDButton variant="gradient" color="success" onClick={handleAddSubject}>
              Agregar
            </MDButton>
          )}
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
