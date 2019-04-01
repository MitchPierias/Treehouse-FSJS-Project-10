import React from 'react';
import { NavLink } from 'react-router-dom';
// Context
import { connectAuthentication } from './../context/AuthService';

const Header = ({ user }) => {
    return (
        <div className="header">
            <div className="bounds">
                <NavLink to="/">
                    <h1 className="header--logo">Courses</h1>
                </NavLink>
                {(user.isLogged()) ? <NavigationUser user={user}/> : <NavigationVisitor/>}
            </div>
        </div>
    )
}

const NavigationUser = ({ user }) => (
    <nav>
        <span>Welcome {user.fullName()}!</span>
        <NavLink to="/signout" className="signout" onClick={event => {
            event.preventDefault();
            user.signOut();
        }}>Sign Out</NavLink>
    </nav>
)

const NavigationVisitor = () => (
    <nav>
        <NavLink to="/signup" className="signup">Sign Up</NavLink>
        <NavLink to="/signin" className="signin">Sign In</NavLink>
    </nav>
)

export default connectAuthentication(Header);