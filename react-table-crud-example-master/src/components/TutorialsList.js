import React, {useState, useEffect, useMemo, useRef} from "react";
import TutorialDataService from "../services/TutorialService";
import {useTable} from "react-table";
import {confirmDialog} from "../components/ConfirmDialog";
import ConfirmDialog from "../components/ConfirmDialog";

const TutorialsList = (props) => {
  const [tutorials, setTutorials] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const tutorialsRef = useRef();

  tutorialsRef.current = tutorials;

  useEffect(() => {
    retrieveTutorials();
  }, []);

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const retrieveTutorials = () => {
    TutorialDataService.getAll().then((response) => {
      setTutorials(response.data);
    }).catch((e) => {
      console.log(e);
    });
  };

  const refreshList = () => {
    retrieveTutorials();
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
      setTutorials(response.data);
    }).catch((e) => {
      console.log(e);
    });
  };

  const openTutorial = (rowIndex) => {
    const id = tutorialsRef.current[rowIndex].id;

    props.history.push("/tutorials/" + id);
  };

  const deleteTutorial = (rowIndex) => {
    const id = tutorialsRef.current[rowIndex].id;

    TutorialDataService.remove(id).then((response) => {
      props.history.push("/tutorials");

      let newTutorials = [...tutorialsRef.current];
      newTutorials.splice(rowIndex, 1);

      setTutorials(newTutorials);
    }).catch((e) => {
      console.log(e);
    });
  };

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

          <span onClick={() => (confirmDialog('Da li želite obrisati parcelu?', () => deleteTutorial(rowIdx)))
}>
            <i className="fas fa-trash action"></i>
          </span>

        </div>);
      }
    }
  ], []);

  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable({columns, data: tutorials});

  return (<div className="list row">
    <div className="col-md-8">
      <div className="input-group mb-3">
        <input type="text" className="form-control" placeholder="Traži po nazivu" value={searchTitle} onChange={onChangeSearchTitle}/>
        <div className="input-group-append">
          <button className="btn btn-outline-secondary" type="button" onClick={findByTitle}>
            Traži
          </button>
        </div>
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
