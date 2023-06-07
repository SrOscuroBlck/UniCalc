// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import DoughnutChart from "examples/Charts/DoughnutCharts/DefaultDoughnutChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import { useState, useEffect } from "react";
import { useAuth } from "context/AuthContext";
import { getSubjects } from "firebaseConfig/config";
import probabilityDoughChartData from "./data/probabilityDoughChartData";

function Dashboard() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [subjectDoughnutCharts, setSubjectDoughnutCharts] = useState([]);
  const { sales, tasks } = reportsLineChartData;

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    getSubjects(user).then((subjects) => {
      setSubjects(subjects);
    });
  }, [user]);

  useEffect(() => {
    const generateDoughnutCharts = () => {
      const doughnutCharts = [];

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < subjects.length; i++) {
        let probability = 0;
        let decimal = 0;
        let needed = 0.00;
        let message = "";

        if (
          subjects[i].firstCut === -1 &&
          subjects[i].secondCut === -1 &&
          subjects[i].thirdCut === -1
        ) {
          probability = 50;
          message = "No has presentado ningún corte";
        } else if (
          subjects[i].firstCut !== -1 &&
          subjects[i].secondCut === -1 &&
          subjects[i].thirdCut === -1
        ) {
          needed = ((3 - subjects[i].firstCut * 0.3) / 0.7);
          message = `Necesitas un ${needed.toFixed(2)} en los dos siguientes cortes para pasar`;
        } else if (
          subjects[i].firstCut !== -1 &&
          subjects[i].secondCut !== -1 &&
          subjects[i].thirdCut === -1
        ) {
          needed = ((3 - subjects[i].firstCut * 0.3 - subjects[i].secondCut * 0.3) / 0.4);
          message = `Necesitas un ${needed.toFixed(2)} en el siguiente corte para pasar`;
        } else if (
          subjects[i].firstCut !== -1 &&
          subjects[i].secondCut !== -1 &&
          subjects[i].thirdCut !== -1
        ) {
          if (
            subjects[i].firstCut * 0.3 + subjects[i].secondCut * 0.3 + subjects[i].thirdCut * 0.4 >=
            3
          ) {
            needed = 0;
            // eslint-disable-next-line no-unused-vars
            message = "Ya pasaste la materia";
          }
        }

        decimal = needed - Math.floor(needed) * 10;
        if (decimal < 1) {
          decimal = 10 + decimal;
        }
        if (needed > 5) {
          probability = 0;
        } else if (needed > 4 && needed <= 5) {
          probability = (11 - decimal) * 2;
        } else if (needed > 3 && needed <= 4) {
          probability = (11 - decimal) * 2 + 20;
        } else if (needed > 2 && needed <= 3) {
          probability = (11 - decimal) * 2 + 40;
        } else if (needed > 1 && needed <= 2) {
          probability = (11 - decimal) * 2 + 60;
        } else if (needed > 0 && needed <= 1) {
          probability = (11 - decimal) * 2 + 80;
        } else if (needed === 0.00 && (subjects[i].firstCut !== -1 || subjects[i].secondCut !== -1 || subjects[i].thirdCut !== -1)) {
          probability = 100;
        }

        const chartData = {
          labels: ["Ganar", "Perder"],
          datasets: {
            label: subjects[i].id,
            backgroundColors: ["success", "error"],
            data: [probability, 100 - probability],
          },
        };

        doughnutCharts.push(
          <Grid item xs={12} md={6} lg={4} key={i}>
            <MDBox mb={3}>
              <DoughnutChart
                color="info"
                title={subjects[i].id}
                description={message}
                chart={chartData}
              />
            </MDBox>
          </Grid>
        );
      }

      return doughnutCharts;
    };
    setSubjectDoughnutCharts(generateDoughnutCharts());
  }, [subjects]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            {subjectDoughnutCharts}
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
