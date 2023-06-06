/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

import { useAuth } from "context/AuthContext";

import { useState, useEffect } from "react";

import { getSubjects, subscribeToSubjects, deleteSubject } from "firebaseConfig/config";
import MDButton from "components/MDButton";
import { Icon } from "@mui/material";

function average(first, second, third) {
  if (first === -1 || second === -1 || third === -1) {
    return "Sin calificar";
  }
  return (first * 0.3 + second * 0.3 + third * 0.4).toFixed(2);
}

function status(grade) {
  if (grade === "Sin calificar") {
    return {
      color: "dark",
      text: "Sin calificar",
    };
  }
  if (grade < 3) {
    return {
      color: "error",
      text: "Reprobado",
    };
  }
  if (grade >= 3) {
    return {
      color: "success",
      text: "Aprobado",
    };
  }
  return {
    color: "dark",
    text: "Sin calificar",
  };
}

export default function data({ handleOnEditCard }) {
  const [rows, setRows] = useState([]);
  // const [initialized, setInitialized] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleSubjectsUpdate = (updatedSubjects) => {
      const newRows = updatedSubjects.map((subject) => ({
        subject: <Subject name={subject.subject} />,
        credits: (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {subject.credits}
          </MDTypography>
        ),
        average: <Average grade={average(subject.firstCut, subject.secondCut, subject.thirdCut)} />,
        status: (
          <MDBox ml={1}>
            <MDBadge
              badgeContent={
                status(average(subject.firstCut, subject.secondCut, subject.thirdCut)).text
              }
              color={status(average(subject.firstCut, subject.secondCut, subject.thirdCut)).color}
              variant="gradient"
              size="sm"
            />
          </MDBox>
        ),
        action: (
          <MDBox display="flex" justifyContent="center">
            <MDBox mr={1}>
              <MDButton
                variant="outlined"
                color="info"
                size="small"
                onClick={() => handleOnEditCard(subject)}
              >
                <Icon>edit</Icon>&nbsp;Editar
              </MDButton>
            </MDBox>
            <MDBox>
              <MDButton
                variant="outlined"
                color="error"
                size="small"
                onClick={() => deleteSubject(user, subject.id)}
              >
                <Icon>delete</Icon>&nbsp;Eliminar
              </MDButton>
            </MDBox>
          </MDBox>
        ),
      }));
      setRows(newRows);
    };

    getSubjects(user).then((subjects) => {
      const initialRows = subjects.map((subject) => ({
        subject: <Subject name={subject.subject} />,
        credits: (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            {subject.credits}
          </MDTypography>
        ),
        average: <Average grade={average(subject.firstCut, subject.secondCut, subject.thirdCut)} />,
        status: (
          <MDBox ml={1}>
            <MDBadge
              badgeContent={
                status(average(subject.firstCut, subject.secondCut, subject.thirdCut)).text
              }
              color={status(average(subject.firstCut, subject.secondCut, subject.thirdCut)).color}
              variant="gradient"
              size="sm"
            />
          </MDBox>
        ),
        action: (
          <MDBox display="flex" justifyContent="center">
            <MDBox mr={1}>
              <MDButton
                variant="outlined"
                color="info"
                size="small"
                onClick={() => handleOnEditCard(subject)}
              >
                <Icon>edit</Icon>&nbsp;Editar
              </MDButton>
            </MDBox>
            <MDBox>
              <MDButton
                variant="outlined"
                color="error"
                size="small"
                onClick={() => deleteSubject(user, subject.id)}
              >
                <Icon>delete</Icon>&nbsp;Eliminar
              </MDButton>
            </MDBox>
          </MDBox>
        ),
      }));
      setRows(initialRows);
    });

    const unsubscribe = subscribeToSubjects(user, handleSubjectsUpdate);

    return () => unsubscribe();
  }, []);

  const Subject = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium">
        {name}
      </MDTypography>
    </MDBox>
  );

  const Average = ({ grade }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        Ponderado
      </MDTypography>
      <MDTypography variant="caption">{grade.toString()}</MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "Materia", accessor: "subject", width: "30%", align: "left" },
      { Header: "Créditos", accessor: "credits", align: "left" },
      { Header: "Promedio", accessor: "average", align: "left" },
      { Header: "Estado", accessor: "status", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows,
  };
}
