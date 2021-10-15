import React, {useState, useEffect, useMemo, useRef, useCallback} from "react";
import TutorialDataService from "../services/TutorialService";
import {useTable} from "react-table";
import {confirmDialog} from "../components/ConfirmDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import Pagination from "@material-ui/lab/Pagination";

const TutorialsList = (props) => {
  const [tutorials, setTutorials] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const pageSizes = [ 10, 20, 30, 100 ];

  const tutorialsRef = useRef();

  tutorialsRef.current = tutorials;

  useEffect(() => {
    retrieveTutorials();
  }, []);

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);

    TutorialDataService.findByTitle(searchTitle).then((response) => {
      setTutorials(response.data.tutorials);
    }).catch((e) => {
      console.log(e);
    });
  };

  const getRequestParams = (searchTitle, page, pageSize) => {
    let params = {};

    if (searchTitle) {
      params["title"] = searchTitle;
    }

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }
    console.log('parametri', params);
    return params;
  };

  const retrieveTutorials = () => {
    const params = getRequestParams(searchTitle, page, pageSize);

    console.log(params);

    TutorialDataService.getAll(params)
      .then((response) => {
        const { tutorials, totalPages } = response.data;

        setTutorials(tutorials);
        setCount(totalPages);

        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(retrieveTutorials, [page, pageSize]);

  const refreshList = () => {
    retrieveTutorials();
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const removeAllTutorials = () => {
    TutorialDataService.removeAll().then((response) => {
      console.log(response.data);
      refreshList();
    }).catch((e) => {
      console.log(e);
    });
  };

  const findByTitle = () => {
    TutorialDataService.findByTitle(searchTitle).then((response) => {
      setPage(1);
      setTutorials(response.data);
    }).catch((e) => {
      console.log(e);
    });
  };

  //const openTutorial = useCallback((rowIndex) => {  ... }, [],)
  const openTutorial = useCallback((rowIndex) => {
    const id = tutorialsRef.current[rowIndex].id;

    props.history.push("/tutorials/" + id);
  }, [props.history]);

  const deleteTutorial = useCallback((rowIndex) => {
    const id = tutorialsRef.current[rowIndex].id;

    TutorialDataService.remove(id).then((response) => {
      props.history.push("/tutorials");

      let newTutorials = [...tutorialsRef.current];
      newTutorials.splice(rowIndex, 1);

      setTutorials(newTutorials);
    }).catch((e) => {
      console.log(e);
    });
  }, [props.history]);

  const columns = useMemo(() => [
    {
      Header: "Naziv",
      accessor: "title"
    }, {
      Header: "Opis",
      accessor: "description"
    }, {
      Header: "Površina",
      accessor: "povrsina"
    }, {
      Header: "Dužina x Širina",
      accessor: properties => properties.duzina + ' x ' + properties.sirina
    }, {
      Header: "",
      accessor: "actions",
      Cell: (props) => {
        const rowIdx = props.row.id;

        return (<div>
          <span onClick={() => openTutorial(rowIdx)}>
            <i className="far fa-edit action mr-2"></i>
          </span>

          <span onClick={() => (confirmDialog('Da li želite obrisati parcelu?', () => deleteTutorial(rowIdx)))}>
            <i className="fas fa-trash action"></i>
          </span>

        </div>);
      }
    }
  ], [deleteTutorial, openTutorial]);

  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable({columns, data: tutorials});

  return (<div className="list row">
    <div className="col-md-8">
      <div className="input-group mb-3">
        <input type="text" className="form-control" placeholder="Traži po nazivu" value={searchTitle} onChange={onChangeSearchTitle}/>
      </div>

      <div className="mt-3">
            {"Redova po stranici: "}
            <select onChange={handlePageSizeChange} value={pageSize}>
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <Pagination
              className="my-3"
              count={count}
              page={page}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
              onChange={handlePageChange}
            />
          </div>

    </div>

    <div className="col-md-12 list">
      <table className="table table-striped table-bordered" {...getTableProps()}>
        <thead>
          {
            headerGroups.map((headerGroup) => (<tr {...headerGroup.getHeaderGroupProps()}>
              {
                headerGroup.headers.map((column) => (<th {...column.getHeaderProps()}>
                  {column.render("Header")}
                </th>))
              }
            </tr>))
          }
        </thead>
        <tbody {...getTableBodyProps()}>
          {
            rows.map((row, i) => {
              prepareRow(row);
              return (<tr {...row.getRowProps()}>
                {
                  row.cells.map((cell) => {
                    return (<td {...cell.getCellProps()}>{cell.render("Cell")}</td>);
                  })
                }
              </tr>);
            })
          }
        </tbody>
      </table>
    </div>
    <div className="col-md-8">
      <button className="btn btn-sm btn-danger" onClick={removeAllTutorials}>
        Briši sve - samo za demo
      </button>
      <ConfirmDialog/>
    </div>
  </div>);
};

export default TutorialsList;
