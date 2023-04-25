// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import { useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import MDButton from "components/MDButton";

function Tables() {
  const { columns, rows } = authorsTableData();
  const [toggleCard, setToggleCard] = useState(false);

  const handleToggleCard = () => {
    setToggleCard(!toggleCard);
  };

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
              <MDBox mt={2}>
                <MDButton variant="gradient" color="warning" onClick={handleToggleCard}>
                  Cerrar
                </MDButton>
              </MDBox>
            }
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
