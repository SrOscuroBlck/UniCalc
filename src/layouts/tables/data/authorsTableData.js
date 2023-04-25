import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

import { getRegisters } from "firebaseConfig/config";

export default function data() {
  const [globalRows, setGlobalRows] = useState([]);

  useEffect(() => {
    getRegisters().then((result) => {
      console.log(result);
      const rows = result.map((register) => ({
        author: <Author image={register.photo} name={register.name} email={register.email} />,
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {register.createdAt.toDate().toLocaleDateString()}
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Edit
          </MDTypography>
        ),
      }));
      setGlobalRows(rows);
    });
  }, []);

  function Author({ image, name, email }) {
    return (
      <MDBox display="flex" alignItems="center" lineHeight={1}>
        <MDAvatar src={image} name={name} size="sm" />
        <MDBox ml={2} lineHeight={1}>
          <MDTypography display="block" variant="button" fontWeight="medium">
            {name}
          </MDTypography>
          <MDTypography variant="caption">{email}</MDTypography>
        </MDBox>
      </MDBox>
    );
  }

  Author.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  };

  return {
    columns: [
      { Header: "Usuario", accessor: "author", width: "45%", align: "left" },
      { Header: "Ultima Actualización", accessor: "employed", align: "center" },
      { Header: "Acción", accessor: "action", align: "center" },
    ],
    rows: globalRows,
  };
}
