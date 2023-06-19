import React, {useState} from "react";
import {GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import DataTable from "../components/DataTable";
import { SchoolAPI } from "../api/service";
import Loading from "../components/Loading";
import FullScreenDialog from "../components/dialog/FullScreen";
import FormDialog from "../components/dialog/Form";
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';

export default function Students(){
    const [students, setStudents] = React.useState([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [openFullScreenDialog, setOpenFullScreenDialog] = useState<boolean>(false);
    const [studentRatings, setStudentRatings] = React.useState([]);
    const [fullScreenDialogContent, setFullScreenDialogContent] = useState<JSX.Element>(<div/>);
    const [studentName, setStudentName] = useState<string>("");
    const [ratingId, setRatingId] = useState<number>(0);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
    const [titleFormDialog, setTitleFormDialog] = useState<string>("");
    const [ratingCourse, setRatingCourse] = useState<string>("");
    const [textContent, setTextContent] = useState<string>("");
    const [selectedStudent, setSelectedStudent] = useState<number>(0);
    const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
    const [messageSnackBar, setMessageSnackBar] = useState<string>("");
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [courses, setCourses] = React.useState<any[]>([]);
    const [average, setAverage] = useState<number>(0);
    
    

    const handleSelectStudent = (row: any) => {
      setStudentName(row.nombre + " " + row.ap_paterno + " " + row.ap_materno);
      setSelectedStudent(row.id_t_usuarios);
      getStudentRating(row.id_t_usuarios);
    }

    const getStudents = () => SchoolAPI.get("/students").then(
        (res) => {
            console.log(res);
            setStudents(res);
            setIsLoading(false);
        }
    )

    React.useEffect(()=>{
        getStudents()
    }, [])

    const columns: GridColDef[] = [
        { field: 'id_t_usuarios', headerName: '#', flex: 100 },
        { field: 'nombre', headerName: 'Nombre', flex: 300 },
        { field: 'ap_paterno', headerName: 'Apellido paterno', flex: 300 },
        { field: 'ap_materno', headerName: 'Apellido materno', flex: 300 },
        {
          field: '',
          flex: 150,
          headerName: 'Calificaciones',
          renderCell: (params: GridRenderCellParams<BigInteger>) => (
            <strong>
              <Button
                variant="contained"
                size="small"
                color='success'
                style={{ marginLeft: 16 }}
                tabIndex={params.hasFocus ? 0 : -1}
                onClick={()=>handleSelectStudent(params.row)}
              >
                Ver
              </Button>
            </strong>
          ),
        }
      ];

      const handleCloseFullScreenDialog = () => {
        setOpenFullScreenDialog(false)
    }

    /** 
     * Ratings per student 
     **/
    const columnsRatings: GridColDef[] = [
        { field: 'id_t_materias', headerName: '#', flex: 100 },
        { field: 'materia', headerName: 'Materia', flex: 200 },
        { field: 'calificacion', headerName: 'Calificación', flex: 200 },
        { field: 'fecha_registro', headerName: 'Fecha de registro', flex: 100 },
        {
          field: '',
          flex: 150,
          headerName: '',
          renderCell: (params: GridRenderCellParams<BigInteger>) => (
            <strong>
              <Button
                variant="contained"
                size="small"
                color='success'
                style={{ marginLeft: 16 }}
                tabIndex={params.hasFocus ? 0 : -1}
                onClick={()=>openUpdateModal(params.row)}
              >
                Actualizar
              </Button>
              <Button
                variant="contained"
                size="small"
                color='error'
                style={{ marginLeft: 16 }}
                tabIndex={params.hasFocus ? 0 : -1}
                onClick={()=>deleteRating(params.row)}
              >
                Eliminar
              </Button>
            </strong>
          ),
        }
      ];
    const getStudentRating = (studentId: number) => SchoolAPI.get("/student/" + studentId + "/ratings").then(
        (res) => {
            setAverage(res[res.length - 1].promedio);
            setStudentRatings(res.slice(0, res.length - 1));
            setOpenFullScreenDialog(true);
        }
    )

    const openUpdateModal = (row: any) => {
      setIsUpdate(true);
      setRatingId(row.id_t_calificaciones);
      setRatingCourse(row.calificacion);
      setTitleFormDialog("Actualizar calificación para la materia: " + row.materia);
      setTextContent("Ingresa la nueva calificación. Actual: " + row.calificacion);
      setOpenFormDialog(true);
    }

    const handleAcceptUpdate = () => {
      let data = {
        "rating": ratingCourse
      }
      SchoolAPI.put("/rating/" + ratingId, data).then(
        (res) => {
          getStudentRating(selectedStudent);
          setMessageSnackBar(res.msg);
          setOpenSnackBar(true);
        }
    ).catch(
      (error) => {
        setMessageSnackBar(error.response.data.message);
        setOpenSnackBar(true);
      }
    ).finally(
      () => {
        setOpenFormDialog(false);
      }
    )
      
    }

    const handleCancelUpdate = () => {
      setOpenFormDialog(false);
    }

    const handleCloseSnackBar = () => {
      setOpenSnackBar(false);
    }
    
    const action = (
      <React.Fragment>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleCloseSnackBar}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    );

    /**
     * Add rating
    */
   const handleOpenAddRatingDialog = () => {
    setIsUpdate(false);
    getCourses();
    setTitleFormDialog("Agregar materia");
    setTextContent("Completa los campos para agregar una materia con su calificación.");
    setOpenFormDialog(true);
   }

   const getCourses = () => {
      SchoolAPI.get("/courses").then(
        (res) => {
          setCourses(res);
        }
    )
   }

   const handleChangeCourse = (event: SelectChangeEvent) => {
    setSelectedCourseId(event.target.value);
   }

   const handleAddRating = () => {
    let data = {
      "rating": ratingCourse
    }
    SchoolAPI.post("/student/" + selectedStudent + "/course/" + selectedCourseId, data).then(
      (res) => {
        getStudentRating(selectedStudent);
        setMessageSnackBar(res.msg);
        setOpenSnackBar(true);
      }
  ).catch(
    (error) => {
      setMessageSnackBar(error.response.data.message);
      setOpenSnackBar(true);
    }
  ).finally(
    () => {
      setOpenFormDialog(false);
    }
  )
   };

   /* 
    Detele rating
   */
  const deleteRating = (row: any) => {
    console.log("/rating/" + row.id_t_calificaciones);
    SchoolAPI.delete("/rating/" + row.id_t_calificaciones, {}).then(
      (res) => {
        getStudentRating(selectedStudent);
        setMessageSnackBar(res.msg);
        setOpenSnackBar(true);
      }
  ).catch(
    (error) => {
      setMessageSnackBar("Error: " + error.response.data.message);
      setOpenSnackBar(true);
    }
  )
  };

    return (
        <div>
            {
                isLoading ? <Loading/> : <DataTable 
                rows={students}
                columns={columns}/>               
                
            }

            <FullScreenDialog 
              open={openFullScreenDialog} 
              title={studentName}
              handleClose={handleCloseFullScreenDialog}
              content={<div>
                <Typography variant="h5" gutterBottom>
                  {"Promedio: " + average}
                </Typography>
                <DataTable 
                rows={studentRatings}
                columns={columnsRatings}/> 
              </div>
              }
              handleAdd={handleOpenAddRatingDialog}
            />      

            <FormDialog
              open={openFormDialog}
              title={titleFormDialog}
              textContent={textContent}
              content={isUpdate ? <TextField
                autoFocus
                margin="dense"
                id="rating"
                label="Nueva calificación"
                type="text"
                fullWidth
                variant="standard"
                value={ratingCourse}
                onChange={(e) => setRatingCourse(e.target.value)}
              />: <div>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth={true}>
                    <InputLabel id="demo-simple-select-standard-label">Materia</InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={selectedCourseId}
                      onChange={handleChangeCourse}
                      label="Materia"
                    >
                      <MenuItem value={0}>
                        <em>Selecciona</em>
                      </MenuItem>
                      {courses.map(item => (
                        <MenuItem value={item.id}>{item.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="rating"
                    label="Calificación"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={ratingCourse}
                    onChange={(e) => setRatingCourse(e.target.value)}/>
              </div>}
              handleAccept={isUpdate ? handleAcceptUpdate: handleAddRating}
              handleClose={handleCancelUpdate}
            />     

            <Snackbar
              open={openSnackBar}
              autoHideDuration={6000}
              onClose={handleCloseSnackBar}
              message={messageSnackBar}
              action={action}
            />
                   
        </div>
    )
}