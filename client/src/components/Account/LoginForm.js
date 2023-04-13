import { Fragment, useState } from "react";
import './AccountForm.css';
import Message from '../Message';

function LoginForm() {
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
    <Fragment>
      <form onSubmit={handleSubmit}>
        <div className="inputField">
          <label>Username:<br></br>
          <input 
            type="text" 
            name="username" 
            id='email'
            value={inputs.username || ""} 
            onChange={handleChange}
          />
          </label>
        </div>
        <div className="inputField">
          <label>Password:<br></br>
            <input 
              type="password"
              name="password" 
              id="password" 
              value={inputs.password || ""} 
              onChange={handleChange}
            />
            </label>
        </div>
        <input className="submit" type="submit" />
      </form>
    </Fragment>
  )
}
export default LoginForm;


