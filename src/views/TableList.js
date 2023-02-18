import React, {useState, useEffect} from "react";

// react-bootstrap components
import {
  Button,
  Container,
  Spinner
} from "react-bootstrap";

// AG Grid
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import ModalAddUpdateBook from "components/Modals/ModalAddUpdateBook";
import ModalDeleteBook from "components/Modals/ModalDeleteBook";
import { fetchAuthors, fetchBooks } from "http/API";

import loadImg from '../assets/img/loading.gif';


function TableList() {
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [columnAuthors] = useState([{ field: "id" }, { field: "name" }, { field: "country" }, { field: "birthday" }]);
  const [columnBooks] = useState([{ field: "id" }, { field: "author" }, { field: "title" }, { field: "published" }]);
  const [starter, setStarter] = useState(false);
  const [visible, setVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [operation, setOperation] = useState('');
  const [gridApi, setGridApi] = useState(null);

  useEffect(() => {
    fetchAuthors()
      .then(data => {
        setAuthors(data);
        setStarter(!starter);
      })
      .catch(err => alert(err.message));
  }, []);

  useEffect(() => {
    fetchBooks()
    .then(data => {
      const newArr = data.map((obj) => {
        return {...obj, author: authors.length ? authors.filter(author => author.id === obj.authorId)[0].name : ''}
      });
      setBooks(newArr);
    })
    .catch(err => alert(err.message))
    .finally(() => setLoading(false));
  }, [visible, deleteVisible, starter])

  const onClick = e => {
    setOperation(e.target.innerText);
    setVisible(true);
  };

  const datasource = {
    getRows(params) {
        console.log(JSON.stringify(params, null, 1));
        const { startRow, endRow } = params
        let url = `${process.env.REACT_APP_API_URL}api/authors?`
        
        url += `_start=${startRow}&_end=${endRow}`
        fetch(url)
            .then(httpResponse => httpResponse.json())
            .then(response => {
                const newArr = response.map((obj) => {
                    obj.birthday = (new Date(obj.birthday)).toDateString()
                    return obj;
                });
                params.successCallback(newArr, 100);
            })
            .catch(error => {
                console.error(error);
                params.failCallback();
            })
        }
    };

    const onGridReady = (params) => {
        setGridApi(params);
        params.api.setDatasource(datasource);
    };

    const components={
        loading:(params)=>{
            if (params.value !== undefined) {
                return params.value
            } else {
                return <img src={loadImg}/>
            }
        }
    };

  if (loading) {
    return <Spinner animation={"border"}/>
  }

  return (
    <>
      <Container>
        <h3>Авторы:</h3>
        <div className="ag-theme-alpine" style={{ height: 300, width: "90%" }}>
          <AgGridReact 
            columnDefs={columnAuthors}
            rowModelType="infinite"
            onGridReady={onGridReady}
            components={components}
          />
        </div>
        <h3 style={{ marginTop: 40 }}>Книги:</h3>
        <div style={{ marginBottom: 20 }}>
          <Button 
            className="btn-round btn-fill" 
            variant="success" 
            style={{ marginRight: 20 }} 
            onClick={onClick}
            >Добавить
          </Button>
          <Button 
            className="btn-round btn-fill" 
            variant="primary" 
            style={{ marginRight: 20 }} 
            onClick={onClick}
            >Изменить
          </Button>
          <Button 
            className="btn-round btn-fill"
             variant="danger" 
            onClick={() => setDeleteVisible(true)}
            >Удалить
          </Button>
        </div>
        <div className="ag-theme-alpine" style={{ height: 300, width: "90%" }}>
          <AgGridReact rowData={books} columnDefs={columnBooks} />
        </div>
        <ModalAddUpdateBook show={visible} onHide={() => setVisible(false)} operation={operation} authors={authors} books={books} />
        <ModalDeleteBook show={deleteVisible} onHide={() => setDeleteVisible(false)} books={books} />
      </Container>
    </>
  );
}

export default TableList;
