  import { useNavigate, useParams } from "react-router-dom";
  import { useEffect, useState } from "react";
  import axios from 'axios';
  import { useStateContext } from "../context/ContextProvider.jsx";

  export default function ContainerForm() {
    const navigate = useNavigate();
    let { id_container } = useParams();
    const [container, setContainer] = useState({
      id_container: null,
      num_container: '',
      name_container: '',
      type: '',
      category: '',
      status: '',
      live: '',
      code_location_tp: '',
      tp_name: '',
      position: '',
      date_in: '',
      date_out: ''
    });
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();

    useEffect(() => {
      if (id_container) {
        setLoading(true);
        axios.get(`http://localhost:8081/container/${id_container}`)
          .then(({ data }) => {
            setLoading(false);
            setContainer(data);
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        setContainer({
          id_container: null,
          num_container: "",
          name_container: "",
          type: "",
          category: "",
          status: "",
          live: "",
          code_location_tp: "",
          tp_name: "",
          position: "",
          date_departure: "",
          date_arrived: "",
          tare: "",
          gross_weight: "",
          weight_cum: "",
          weight_dep: "",
          transit_time: "",
          shipment: "",
          date_in: '',
          date_out: ''
        });
      }
    }, [id_container]);

    const onSubmit = ev => {
      ev.preventDefault();
      if (container.id_container) {
        axios.put(`http://localhost:8081/container/${container.id_container}`, container)
          .then(() => {
            setNotification('Container was successfully updated');
            navigate('/container');
          })
          .catch(err => {
            const response = err.response;
            if (response && response.status === 422) {
              setErrors(response.data.errors);
            }
          });
      } else {
        axios
          .post('http://localhost:8081/create', container)
          .then(() => {
            setNotification('Container was successfully created');
            navigate('/container');
          })
          .catch(err => {
            const response = err.response;
            if (response && response.status === 422) {
              setErrors(response.data.errors);
            }
          });
      }
    };

    return (
      <>
        <h1>{container.id_container ? `Update container: ${container.num_container}` : 'New Container'}</h1>
        <div className="card animated fadeInDown">
          {loading && (
            <div className="text-center">
              Loading...
            </div>
          )}
          {errors && (
            <div className="alert">
              {Object.keys(errors).map(key => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}
          {!loading && (
            <form onSubmit={onSubmit}>
            <div className="input-container">
  <input placeholder="Number of container" className="input-field" type="text" value={container.num_container} onChange={(ev) =>
      setContainer({ ...container, num_container: ev.target.value })
    }
  />
  <label htmlFor="num_container" className="input-label">
    Number of container
  </label>
  <span className="input-highlight"></span>
</div>

<div className="input-container">
  <input placeholder="Name of container" className="input-field" type="text" value={container.name_container} onChange={(ev) =>
      setContainer({ ...container, name_container: ev.target.value })
    }
  />
  <label htmlFor="name_container" className="input-label">
    Name of container
  </label>
  <span className="input-highlight"></span>
</div>

<div className="input-container">
  <input placeholder="Type" className="input-field" type="text" value={container.type}
    onChange={(ev) => setContainer({ ...container, type: ev.target.value })}
  />
  <label htmlFor="type" className="input-label">
    Type
  </label>
  <span className="input-highlight"></span>
</div>

<div className="input-container">
  <input placeholder="Category" className="input-field" type="text" value={container.category} onChange={(ev) =>
      setContainer({ ...container, category: ev.target.value })
    }
  />
  <label htmlFor="category" className="input-label">
    Category
  </label>
  <span className="input-highlight"></span>
</div>

<div className="input-container">
  <input placeholder="Status" className="input-field" type="text" value={container.status}
    onChange={(ev) => setContainer({ ...container, status: ev.target.value })}
  />
  <label htmlFor="status" className="input-label">
    Status
  </label>
  <span className="input-highlight"></span>
</div>

<div className="input-container">
  <input placeholder="Live" className="input-field" type="text" value={container.live}
    onChange={(ev) => setContainer({ ...container, live: ev.target.value })}
  />
  <label htmlFor="live" className="input-label">
    Live
  </label>
  <span className="input-highlight"></span>
</div>

<div className="input-container">
  <input placeholder="Code of location T.P" className="input-field" type="text" value={container.code_location_tp}
    onChange={(ev) =>
      setContainer({ ...container, code_location_tp: ev.target.value })
    }
  />
  <label htmlFor="code_location_tp" className="input-label">
    Code of location T.P
  </label>
  <span className="input-highlight"></span>
</div>

<div className="input-container">
  <input placeholder="Name of T.P" className="input-field" type="text" value={container.tp_name}
    onChange={(ev) => setContainer({ ...container, tp_name: ev.target.value })}
  />
  <label htmlFor="tp_name" className="input-label">
    Name of T.P
  </label>
  <span className="input-highlight"></span>
</div>

<div className="input-container">
  <input placeholder="Position" className="input-field" type="text" value={container.position}
    onChange={(ev) => setContainer({ ...container, position: ev.target.value })}
  />
  <label htmlFor="position" className="input-label">
    Position
  </label>
  <span className="input-highlight"></span>
</div>
<div className="input-container">
  <input placeholder="Position" className="input-field" type="text" value={container.position}
    onChange={(ev) => setContainer({ ...container, position: ev.target.value })}
  />
  <label htmlFor="position" className="input-label">
    Position
  </label>
  <span className="input-highlight"></span>
</div>
<div className="input-container">
  <input placeholder="Position" className="input-field" type="text" value={container.position}
    onChange={(ev) => setContainer({ ...container, position: ev.target.value })}
  />
  <label htmlFor="position" className="input-label">
    Position
  </label>
  <span className="input-highlight"></span>
</div>
<div className="input-container">
  <input placeholder="Position" className="input-field" type="text" value={container.position}
    onChange={(ev) => setContainer({ ...container, position: ev.target.value })}
  />
  <label htmlFor="position" className="input-label">
    Position
  </label>
  <span className="input-highlight"></span>
</div>
<div className="input-container">
  <input placeholder="Position" className="input-field" type="text" value={container.position}
    onChange={(ev) => setContainer({ ...container, position: ev.target.value })}
  />
  <label htmlFor="position" className="input-label">
    Position
  </label>
  <span className="input-highlight"></span>
</div>

<div className="input-container">
  <input className="input-field" type="date" value={container.date_in} onChange={(ev) => setContainer({ ...container, date_in: ev.target.value })}
    placeholder="Date in"
  />
  <label htmlFor="date_in" className="input-label">
    Date in
  </label>
  <span className="input-highlight"></span>
</div>

<div className="input-container">
  <input className="input-field" type="date" value={container.date_out} onChange={(ev) =>
      setContainer({ ...container, date_out: ev.target.value })
    }
    placeholder="Date out"
  />
  <label htmlFor="date_out" className="input-label">
    Date out
  </label>
  <span className="input-highlight"></span>
</div>
              <button className="btn">Save</button>
            </form>
          )}
        </div>
      </>
    );
  }