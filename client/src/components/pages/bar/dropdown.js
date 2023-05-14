import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { VscAccount } from 'react-icons/vsc';

import './dropdown.css'

function DropUser(props) {

  const onClick = () => {
    fetch('http://localhost:5000/login/logout',{
      credentials: 'include',
      method: 'GET',
    })
  }

  return (
    <div>
      <Dropdown as={ButtonGroup}>
        <Button style={{background :"none", border:"none"}}><VscAccount color="white" fontSize={30}  /></Button>
        <Dropdown.Toggle split variant="success" id="dropdown-split-basic" style={{background :"none", border:"none"}} />
        <Dropdown.Menu className = "dropdownnn" variant="dark">
          <div className = "dropdownItemTag">
            <Dropdown.Item className = "dropdownItem" href="/myProfile" style={{color: 'black'}}> View profile </Dropdown.Item>
          </div>
          {props.role === 'Patient' && 
          <div className = "dropdownItemTag">
            <Dropdown.Item className = "dropdownItem" href="/mybranch" style={{color: 'black'}}> Membership </Dropdown.Item>
          </div>}
          {props.role === 'Patient' && 
          <div className = "dropdownItemTag">
            <Dropdown.Item className = "dropdownItem" href="/relationshipRequestForReceiver" style={{color: 'black'}}>  Request membership </Dropdown.Item>
          </div>}
          <Dropdown.Divider />
          <Dropdown.Item className = "dropdownItemTag"  href="/" style={{color: 'black'}} onClick={onClick}>Log out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default DropUser;