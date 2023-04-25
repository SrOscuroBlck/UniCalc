/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

import { useAuth } from "context/AuthContext";

import { useState, useEffect } from "react";

import { getSubjects } from "firebaseConfig/config";

function average(first, second, third) {
  if (first === -1 || second === -1 || third === -1) {
    return "Sin calificar";
  }

  console.log((first * 0.3 + second * 0.3 + third * 0.4).toFixed(2));
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

export default function data() {
  const [rows, setRows] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getSubjects(user).then((result) => {
      const newRows = result.map((subject) => ({
        subject: <Subject name={subject.subject} />,
        average: <Average grade={average(subject.firstCut, subject.secondCut, subject.thirdCut)} />,
        status: (
          <MDBox ml={-1}>
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
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      }));
      setRows(newRows);
    });
  }, [rows]);

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
      { Header: "Materia", accessor: "subject", width: "45%", align: "left" },
      { Header: "Promedio", accessor: "average", align: "left" },
      { Header: "Estado", accessor: "status", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows,
  };
}
