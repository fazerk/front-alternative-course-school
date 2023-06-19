import React from 'react';
import {Container, CssBaseline} from "@mui/material";
import Students from "./containers/Students";

export default function App(): JSX.Element {
    return (
          <React.Fragment>
              <CssBaseline/>
              <Container maxWidth="lg" className={"p-3"}>
                <Students/>
              </Container>
          </React.Fragment>
    );
}
