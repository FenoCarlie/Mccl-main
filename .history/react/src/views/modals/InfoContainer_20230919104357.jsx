import React, { useEffect } from "react";

function InfoContainer({ id_container, setOpenModal }) {
    const [loading, setLoading] = useState(false);
    
    useEffect (() => {
        axios.get(`http://localhost:8081/container/${id_container}`)
        .then(({ data }) => {
          setLoading(false);
          setContainer(data[0]);
          consol.log('id in info: ' +data);
        })
        .catch(() => {
          setLoading(false);
        });
    })
  
    const onDeleteClick = () => {
      if (!window.confirm("Are you sure you want to delete this data?")) {
        return;
      }
      axios
        .delete(`http://localhost:8081/delete/${id_container}`)
        .then((response) => {
          getContainer();
          console.log(response.data);
        })
        .catch((error) => {
          console.error("An error occurred while deleting the container:", error);
        });
    };

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="title">
          <h1>Are You Sure You Want to Continue?</h1>
        </div>
        <div className="body">
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
            <input className="input_form" value={container.num_container} onChange={ev => setContainer({ ...container, num_container: ev.target.value })} placeholder="Number of container" />
              <input className="input_form" value={container.name_container} onChange={ev => setContainer({ ...container, name_container: ev.target.value })} placeholder="Name of container" />
              <input className="input_form" value={container.type} onChange={ev => setContainer({ ...container, type: ev.target.value })} placeholder="Type" />
              <input className="input_form" value={container.category} onChange={ev => setContainer({ ...container, category: ev.target.value })} placeholder="Category" />
              <input className="input_form" value={container.status} onChange={ev => setContainer({ ...container, Status: ev.target.value })} placeholder="status" />
              <input className="input_form" value={container.live} onChange={ev => setContainer({ ...container, live: ev.target.value })} placeholder="Live" />
              <input className="input_form" value={container.code_location_tp} onChange={ev => setContainer({ ...container, code_location_tp: ev.target.value })} placeholder="Code of location T.P" />
              <input className="input_form" value={container.tp_name} onChange={ev => setContainer({ ...container, tp_name: ev.target.value })} placeholder="Name of T.P" />
              <input className="input_form" value={container.position} onChange={ev => setContainer({ ...container, position: ev.target.value })} placeholder="Position" />
              <input className="input_form" type="date" onChange={ev => setContainer({ ...container, date_in: ev.target.value })} placeholder="Date in" />
              <input className="input_form" type="date" onChange={ev => setContainer({ ...container, date_out: ev.target.value })} placeholder="date out" />
              <button className="btn">Save</button>
            </form>
          )}
        </div>
        </div>
        <div className="footer">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button onClick={onDeleteClick}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default InfoContainer;