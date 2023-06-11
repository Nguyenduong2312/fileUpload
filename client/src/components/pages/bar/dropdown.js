import React, { useEffect, useState } from 'react';

import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { VscAccount } from 'react-icons/vsc';

import './dropdown.css';

function DropUser(props) {
    const [lengthOfRequestList, setLengthOfRequestList] = useState(0);
    useEffect(() => {
        fetch('http://localhost:5000/login/user', {
            credentials: 'include',
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => res.json())
            .then((account) => {
                fetch(
                    `http://localhost:5000/membership/receiver/${account.id}`,
                    {
                        credentials: 'include',
                        method: 'GET',
                    },
                )
                    .then((res) => res.json())
                    .then((requests) => {
                        setLengthOfRequestList(requests.length);
                    });
            });
    }, [lengthOfRequestList]);

    const onClick = () => {
        localStorage.removeItem('token');
    };

    return (
        <div>
            <Dropdown as={ButtonGroup}>
                <Button style={{ background: 'none', border: 'none' }}>
                    <VscAccount color="#191825" fontSize={30} />
                </Button>
                <Dropdown.Toggle
                    split
                    variant="success"
                    id="dropdown-split-basic"
                    style={{
                        color: 'black',
                        background: 'none',
                        border: 'none',
                    }}
                />
                <Dropdown.Menu className="dropdown" variant="dark">
                    <div className="dropdownItemTag">
                        <Dropdown.Item
                            className="dropdownItem"
                            href="/myProfile"
                            style={{ color: 'black' }}
                        >
                            View profile
                        </Dropdown.Item>
                    </div>
                    {props.role === 'Patient' && (
                        <div className="dropdownItemTag">
                            <Dropdown.Item
                                className="dropdownItem"
                                href="/mybranch"
                                style={{ color: 'black' }}
                            >
                                Relationship
                            </Dropdown.Item>
                        </div>
                    )}
                    {props.role === 'Patient' && (
                        <div className="dropdownItemTag">
                            <Dropdown.Item
                                className="dropdownItem"
                                href="/relationshipRequestForReceiver"
                                style={{ color: 'black' }}
                            >
                                Relationship request
                            </Dropdown.Item>
                            {lengthOfRequestList !== 0 && (
                                <div className="notice">
                                    {lengthOfRequestList}
                                </div>
                            )}
                        </div>
                    )}
                    <Dropdown.Item
                        className="dropdownItemTag"
                        href="/"
                        onClick={onClick}
                    >
                        Log out
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

export default DropUser;
