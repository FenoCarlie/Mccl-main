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

          </table>
        </div>
    </div>
  )
}

export default Container