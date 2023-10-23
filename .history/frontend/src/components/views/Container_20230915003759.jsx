import { useEffect, useState } from "react"
import ContentTop from "../ContentTop/ContentTop"
import AddContainer from "../modals/AddContainer"

const Container = () => {

  const [ container, setContainer ] = useState([])
  const [openModal, setOpenModal] = useState(false)
  useEffect(() => {
    axios.get('http://localhost:8081/')
    .then(res => setContainer(res.data))
    .catch(err => console.log(err));
  }, [])

  return (
    <div className='main-content'>
        <ContentTop/>
        <div>
          <button className="button_add"
          onClick={() => {
            setOpenModal(true);
          }}
          >
          add
          </button>
          {openModal && <AddContainer={setOpenModal} />}
          <table className="table">
            <thead>
              <tr>
                <th>Container number</th>
                <th>Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Status</th>
                <th>Live</th>
                <th>Code of location T.P</th>
                <th>position</th>
                <th>Entry date</th>
                <th>Release date</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              container.map((data, i)=> (
                <tr key={i}>
                  <td>{data.num_container}</td>
                  <td>{data.name_container}</td>
                  <td>{data.type}</td>
                  <td>{data.status}</td>
                  <td>{data.live}</td>
                  <td>{data.code_location_tp}</td>
                  <td>{data.position}</td>
                  <td>{data.date_in}</td>
                  <td>{data.date_out}</td>
                  <td>
                    <button className="btn_edit">Edit</button>
                    <button className="btn_delete">Delete</button>
                  </td>
                </tr>
              ))
            </tbody>
          </table>
        </div>
    </div>
  )
}

export default Container