import { observer } from 'mobx-react-lite';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Menu, Image, Dropdown } from 'semantic-ui-react';
import { useStore } from '../stores/store';

export default observer(function NavBar() {
    const { userStore: { user, logout, isLoggedIn } } = useStore();
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} exact to='/' header>
                    <img src='/assets/logo.png' alt='logo' style={{ marginRight: '10px' }} />
                    LMS App
                </Menu.Item>
                {isLoggedIn &&
                    <>
                        <Menu.Item as={NavLink} to='/courses' name='All Courses' />
                        {/* <Menu.Item as={NavLink} to='/errors' name='Errors' /> */}
                        {user && user.role === 'admin' &&
                            <>
                                <Menu.Item as={NavLink} to='/createCourse' name='Create Course' />
                                {/* <Menu.Item as={NavLink} to='/createLesson' name='Create Lesson' />
                                <Menu.Item as={NavLink} to='/createQuestion' name='Create Question' /> */}
                            </>
                        }
                        <Menu.Item position='right'>
                            <Image src={user?.image || '/assets/user.png'} avatar spaced='right' />
                            <Dropdown pointing='top left' text={user?.name}>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={logout} text='Logout' icon='power' />
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>
                    </>}

            </Container>
        </Menu>
    )
})