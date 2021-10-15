import React, {useState, useEffect} from "react";
import TutorialDataService from "../services/TutorialService";
import {useHistory} from "react-router-dom";
import {
  makeStyles,
  createTheme,
  ThemeProvider
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import { purple } from "@material-ui/core/colors";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const Tutorial = props => {
  const initialTutorialState = {
    id: null,
    title: "",
    description: "",
    povrsina: "",
    duzina: "",
    sirina: "",
    parking: false,
    wifi: false,
    struja: false,
    published: false
  };

  const history = useHistory();

  const [currentTutorial, setCurrentTutorial] = useState(initialTutorialState);
  const [message, setMessage] = useState("");

  const getTutorial = id => {
    TutorialDataService.get(id).then(response => {
      setCurrentTutorial(response.data);
      console.log(response.data);
    }).catch(e => {
      console.log(e);
    });
  };

  useEffect(() => {
    getTutorial(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const {name, value} = event.target;
    setCurrentTutorial({
      ...currentTutorial,
      [name]: value
    });
  };

  const handleCheckBoxChange = event => {
    const name = event.target.name;
    const value = event.target.checked;
    console.log('Name: ', name);
    console.log('Vrijednost: ', value);
    setCurrentTutorial({
      ...currentTutorial,
      [name]: value
    });
  };

  const updatePublished = status => {
    var data = {
      id: currentTutorial.id,
      title: currentTutorial.title,
      description: currentTutorial.description,
      published: status
    };

    TutorialDataService.update(currentTutorial.id, data).then(response => {
      setCurrentTutorial({
        ...currentTutorial,
        published: status
      });
      console.log(response.data);
      setMessage("The status was updated successfully!");
    }).catch(e => {
      console.log(e);
    });
  };

  const updateTutorial = () => {
    TutorialDataService.update(currentTutorial.id, currentTutorial).then(response => {
      console.log(response.data);
      setMessage("Promjene su uspješno spremljene!");
      history.push("/tutorials");
    }).catch(e => {
      console.log(e);
    });
  };

  const deleteTutorial = () => {
    TutorialDataService.remove(currentTutorial.id).then(response => {
      console.log(response.data);
      props.history.push("/tutorials");
    }).catch(e => {
      console.log(e);
    });
  };

  //stilovi
  const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1)
    },
    spacer: {
      marginBottom: theme.spacing(10)
    }
  }));

  const defaultTheme = createTheme({
    palette: {
      primary: {
      // Purple and green play nicely together.
      main: purple[500],
    },
    secondary: {
    light: '#d32f2f',
    main: '#d32f2f',
    // dark: will be calculated from palette.secondary.main,
    contrastText: '#FFFFFF',
  }
    }
  });

  const classes = useStyles();

  return (<div>
    {
      currentTutorial
        ? (
          <ThemeProvider theme={defaultTheme}><Container>
          <div className="edit-form classes.margin">
          <h4>Parcela</h4>
          <form>
            <div className="form-group">
              <label htmlFor="title">Naziv</label>
              <input type="text" className="form-control" id="title" name="title" value={currentTutorial.title} onChange={handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="description">Opis</label>
              <input type="text" className="form-control" id="description" name="description" value={currentTutorial.description} onChange={handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="povrsina">Površina</label>
              <input type="text" className="form-control" id="povrsina" name="povrsina" value={currentTutorial.povrsina} onChange={handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="duzina">Dužina</label>
              <input type="text" className="form-control" id="duzina" name="duzina" value={currentTutorial.duzina} onChange={handleInputChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="sirina">Širina</label>
              <input type="text" className="form-control" id="sirina" name="sirina" value={currentTutorial.sirina} onChange={handleInputChange}/>
            </div>

            <div className="form-group">
              <label>
                <strong>Status:</strong>
              </label>
              {
                currentTutorial.published
                  ? "Published"
                  : "Pending"
              }
            </div>

            <FormControlLabel control={<Checkbox
              checked = {
                currentTutorial.parking
              }
              name = "parking"
              onChange = {
                handleCheckBoxChange
              }
              />} label="Parking"/>
            <FormControlLabel control={<Checkbox
              checked = {
                currentTutorial.wifi
              }
              onChange = {
                handleCheckBoxChange
              }
              name = "wifi"
              />} label="WiFi"/>
            <FormControlLabel control={<Checkbox
              checked = {
                currentTutorial.struja
              }
              onChange = {
                handleCheckBoxChange
              }
              name = "struja"
              />} label="Struja"/>

          </form>

          {
            currentTutorial.published
              ? (<Button className={classes.margin} variant="contained" color="primary" size="small" onClick={() => updatePublished(false)}>
                UnPublish
              </Button>)
              : (<Button className={classes.margin} variant="contained" color="primary" size="small" onClick={() => updatePublished(true)}>
                Publish
              </Button>)
          }

          <Button startIcon={<DeleteIcon />} className={classes.margin} variant="contained" color="secondary" size="small" onClick={deleteTutorial}>
            Briši
          </Button>

          <Button startIcon={<SaveIcon />} className={classes.margin} variant="contained" color="primary" size="small" type="submit" onClick={updateTutorial}>
            Spremi
          </Button>
          <p>{message}</p>
        </div></Container></ThemeProvider>)
        : (<div>
          <br/>
          <p>Molim odaberite parcelu...</p>
        </div>)
    }
  </div>);
};

export default Tutorial;
