import { useEffect, useState } from "react"
import ContentTop from "../ContentTop/ContentTop"

const Container = () => {

  const [ container, setContainer ] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8081/')
    .then(res => setContainer(res.data))
    .catch(err => console.log(err));
  }, [])

  return (
    <div className='main-content'>
        <ContentTop/>
        <div>
          <button className="button_add">add</button>
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
                <th>Release date</th>
                <th>Entry date</th>
              </tr>
            </thead>
            <tbody>

            </tbody>
          </table>
        </div>
    </div>
  )
}

export default Container