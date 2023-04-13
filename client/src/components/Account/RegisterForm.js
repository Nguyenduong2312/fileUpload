import { useState } from "react";
import './AccountForm.css';

function RegisterForm() {
    const [inputs, setInputs] = useState({});
  
    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setInputs(values => ({...values, [name]: value}))
    }
  
    const handleSubmit = (event) => {
      event.preventDefault();
      console.log(inputs);
    }
    return (
      <form onSubmit={handleSubmit}>
        <div className="inputField">
          <label>Username:<br></br>
          <input 
            type="text" 
            name="username" 
            value={inputs.username || ""} 
            onChange={handleChange}
          />
          </label>
        </div>
        <div className="inputField">
          <label>Password:<br></br>
            <input 
              type="text" 
              name="password" 
              value={inputs.password || ""} 
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="inputField">
          <label>Email:<br></br>
            <input 
              type="text" 
              name="email" 
              value={inputs.email || ""} 
              onChange={handleChange}
            />
          </label>
        </div>
        <input className="submit" type="submit" />
      </form>
    )
  }
  export default RegisterForm;
  