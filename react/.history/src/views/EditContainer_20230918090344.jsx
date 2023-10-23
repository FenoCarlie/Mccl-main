import React from 'react';

export default function EditContainer() {
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
     (id_container) {
      setLoading(true);
      axios.get(`http://localhost:8081/container/${id_container}`)
        .then(({ data }) => {
          setLoading(false);
          setContainer(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id_container]);

  return (
    <div>
      <h1>{`Update container: ${container.num_container}`}</h1>
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
            <input value={container.name_container} onChange={ev => setContainer({ ...container, name_container: ev.target.value })} placeholder="Name of container" />
            <input value={container.type} onChange={ev => setContainer({ ...container, type: ev.target.value })} placeholder="Type" />
            <input value={container.category} onChange={ev => setContainer({ ...container, category: ev.target.value })} placeholder="Category" />
            <input value={container.status} onChange={ev => setContainer({ ...container, Status: ev.target.value })} placeholder="status" />
            <input value={container.live} onChange={ev => setContainer({ ...container, live: ev.target.value })} placeholder="Live" />
            <input value={container.code_location_tp} onChange={ev => setContainer({ ...container, code_location_tp: ev.target.value })} placeholder="Code of location T.P" />
            <input value={container.tp_name} onChange={ev => setContainer({ ...container, tp_name: ev.target.value })} placeholder="Name of T.P" />
            <input value={container.position} onChange={ev => setContainer({ ...container, position: ev.target.value })} placeholder="Position" />
            <input type="date" onChange={ev => setContainer({ ...container, password: ev.target.value })} placeholder="Password" />
            <input type="date" onChange={ev => setContainer({ ...container, password_confirmation: ev.target.value })} placeholder="Password Confirmation" />
            <button className="btn" type="submit">Save</button>
          </form>
        )}
      </div>
    </div>
  );
}
