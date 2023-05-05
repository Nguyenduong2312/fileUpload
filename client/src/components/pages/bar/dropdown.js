import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { VscAccount } from 'react-icons/vsc';

function DropUser() {

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
        <Dropdown.Menu variant="dark" style={{background :"white", color: 'black'}} >
          <Dropdown.Item href="/myProfile" style={{color: 'black'}}> View profile </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="/" style={{color: 'black'}} onClick={onClick}>Log out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default DropUser;