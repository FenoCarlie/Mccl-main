import React from 'react'

export default function Container() {

    useEffect(() => {
        axios
          .get('http://localhost:8081/')
          .then(res => setContainer(res.data))
          .catch(err => console.log(err));
      }, []);
      
    return (
      <div>
        <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
          <h1>Container</h1>
          <Link className="btn-add" to="/users/new">Add new</Link>
        </div>
        <div className="card animated fadeInDown">
          <table>
            <thead>
            <tr>
            <th >Number of container</th>
                <th >Name</th>
                <th >Type</th>
                <th >Category</th>
                <th >Status</th>
                <th >Live</th>
                <th >Code of location T.P</th>
                <th >Position</th>
                <th >Entry date</th>
                <th >Release date</th>
                <th >Action</th>
            </tr>
            </thead>
            {loading &&
              <tbody>
              <tr>
                <td colSpan="5" class="text-center">
                  Loading...
                </td>
              </tr>
              </tbody>
            }
            {!loading &&
              <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.created_at}</td>
                  <td>
                    <Link className="btn-edit" >Edit</Link>
                    &nbsp;
                    <button className="btn-delete" >Delete</button>
                  </td>
                </tr>
              ))}
              </tbody>
            }
          </table>
        </div>
      </div>
    )
  }