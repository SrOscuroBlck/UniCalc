// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import { useState, useEffect } from "react";
import axios from "axios";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import MDButton from "components/MDButton";

import { createSubject } from "firebaseConfig/config";

import { useAuth } from "context/AuthContext";

function Tables() {
  const { user } = useAuth();
  const [toggleCard, setToggleCard] = useState(false);
  const [toggleEditCard, setToggleEditCard] = useState(false);
  const [auxSubject, setAuxSubject] = useState(null);
  const [file, setFile] = useState(null);

  const handleToggleCard = () => {
    setToggleCard(!toggleCard);
  };

  const handleOnEditCard = (subject) => {
    setAuxSubject(subject);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    await axios
      .post("https://api-unicalc.herokuapp.com/upload/pdf", formData)
      .then((res) => {
        console.log(res);
        for (let i = 0; i < res.data.length; i++) {
          const subject = res.data[i];
          createSubject(
            user,
            subject.nombre,
            subject.credito,
            subject.primer_corte == null ? -1 : subject.primer_corte,
            subject.segundo_corte == null ? -1 : subject.segundo_corte,
            subject.tercer_corte == null ? -1 : subject.tercer_corte
          );
        }
        setFile(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };



  useEffect(() => {
    if (auxSubject !== null) {
      setToggleEditCard(true);
    }
  }, [auxSubject]);


  const handleOffEditCard = () => {
    setAuxSubject(null);
    setToggleEditCard(false);
  };

  const { columns, rows } = authorsTableData({ handleOnEditCard });



  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {toggleCard && (
          <DefaultInfoCard
            title="Agregar materia"
            description="Agregar una nueva materia"
            icon="add"
            action={
              <MDBox mt={2} mb={2}>
                <MDButton variant="gradient" color="warning" onClick={handleToggleCard}>
                  Cerrar
                </MDButton>
              </MDBox>
            }
            close = {handleToggleCard}
          />
        )}

        {toggleEditCard && (
          <DefaultInfoCard
            title="Editar materia"
            description="Editar una materia"
            icon="edit"
            action={
              <MDBox mt={2} mb={2}>
                <MDButton variant="gradient" color="warning" onClick={handleOffEditCard}>
                  Cerrar
                </MDButton>
              </MDBox>
            }
            rSubject={auxSubject}
            close = {handleOffEditCard}
          />
        )}

        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Materias
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
                <MDBox mt={3} mb={3}>
                  <center>
                    <MDButton variant="gradient" color="success" onClick={handleToggleCard}>
                      Agregar materia
                    </MDButton>
                  </center>
                </MDBox>
                <MDBox mt={3} mb={3}>
                  <center>
                    <MDInput type="file" onChange={(e) => setFile(e.target.files[0])} />
                  </center>
                </MDBox>
                <MDBox mt={3} mb={3}>
                  <center>
                    <MDButton variant="gradient" color="success" onClick={() => uploadFile(file)}>
                      Subir archivo
                    </MDButton>
                  </center>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
