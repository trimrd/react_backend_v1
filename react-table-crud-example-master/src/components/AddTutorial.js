import React, {useState} from "react";
import TutorialDataService from "../services/TutorialService";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const AddTutorial = () => {
  const initialTutorialState = {
    id: null,
    title: "",
    description: "",
    povrsina: "",
    duzina: "",
    sirina: "",
    wifi: false,
    parking: false,
    struja: false,
    published: false
  };
  const [tutorial, setTutorial] = useState(initialTutorialState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    const {name, value} = event.target;
    setTutorial({
      ...tutorial,
      [name]: value
    });
  };

  const handleCheckBoxChange = event => {
    const name = event.target.name;
    const value = event.target.checked;
    console.log('Name: ', name);
    console.log('Vrijednost: ', value);
    setTutorial({
      ...tutorial,
      [name]: value
    });
  };

  const saveTutorial = () => {
    var data = {
      title: tutorial.title,
      description: tutorial.description,
      povrsina: tutorial.povrsina,
      duzina: tutorial.duzina,
      sirina: tutorial.sirina,
      wifi: tutorial.wifi,
      parking: tutorial.parking,
      struja: tutorial.struja
    };

    TutorialDataService.create(data).then(response => {
      setTutorial({
        id: response.data.id,
        title: response.data.title,
        description: response.data.description,
        povrsina: response.data.povrsina,
        duzina: response.data.duzina,
        sirina: response.data.sirina,
        wifi: response.data.wifi,
        parking: response.data.parking,
        struja: response.data.struja,
        published: response.data.published
      });
      setSubmitted(true);
      console.log(response.data);
    }).catch(e => {
      console.log(e);
    });
  };

  const newTutorial = () => {
    setTutorial(initialTutorialState);
    setSubmitted(false);
  };

  return (<div className="submit-form">
    {
      submitted
        ? (<div>
          <h4>Spremljeno u bazu!</h4>
          <button className="btn btn-success" onClick={newTutorial}>
            Dodaj novu parcelu
          </button>
        </div>)
        : (<div>
          <div className="form-group">
            <label htmlFor="title">Naziv</label>
            <input type="text" className="form-control" id="title" required="required" value={tutorial.title} onChange={handleInputChange} name="title"/>
          </div>

          <div className="form-group">
            <label htmlFor="description">Opis</label>
            <input type="text" className="form-control" id="description" required="required" value={tutorial.description} onChange={handleInputChange} name="description"/>
          </div>

          <div className="form-group">
            <label htmlFor="povrsina">Površina</label>
            <input type="text" className="form-control" id="povrsina" required="required" value={tutorial.povrsina} onChange={handleInputChange} name="povrsina"/>
          </div>

          <div className="form-group">
            <label htmlFor="duzina">Dužina</label>
            <input type="text" className="form-control" id="duzina" required="required" value={tutorial.duzina} onChange={handleInputChange} name="duzina"/>
          </div>

          <div className="form-group">
            <label htmlFor="sirina">Širina</label>
            <input type="text" className="form-control" id="sirina" required="required" value={tutorial.sirina} onChange={handleInputChange} name="sirina"/>
          </div>

          <FormControlLabel control={<Checkbox
            value = {
              tutorial.parking
            }
            name = "parking"
            onChange = {
              handleCheckBoxChange
            }
            />} label="Parking"/>
          <FormControlLabel control={<Checkbox
            value = {
              tutorial.wifi
            }
            onChange = {
              handleCheckBoxChange
            }
            name = "wifi"
            />} label="WiFi"/>
          <FormControlLabel control={<Checkbox
            value = {
              tutorial.struja
            }
            onChange = {
              handleCheckBoxChange
            }
            name = "struja"
            />} label="Struja"/>

          <div className="form-group">
          <Button startIcon={<SaveIcon />} variant="contained" color="primary" size="small" type="submit" onClick={saveTutorial}>
            Spremi
          </Button>
          </div>

        </div>)
    }
  </div>);
};

export default AddTutorial;
