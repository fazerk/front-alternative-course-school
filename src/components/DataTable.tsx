import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';


interface IStudent {
  id_t_usuarios: number,
  nombre: string,
  ap_paterno: string,
  ap_materno: string  
}

interface ICourse {
  id_t_materias: number,
  materia: string,
  calificacion: number
}

type props = {
  rows: IStudent[] | ICourse[],
  columns: GridColDef[]
};

export default function DataTable(props: props) {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={props.rows}
        columns={props.columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        getRowId={(row) => row?.id_t_usuarios | row?.id_t_materias}
      />
    </div>
  );
}