import React from 'react';
import { Switch, Route } from 'react-router-dom';
// Components
import { Courses, CourseDetail, UpdateCourse , CreateCourse } from './components/Courses';
import { UserSignIn, UserSignUp } from './components/Users';
import { Errors, Forbidden, NotFound } from './components/Errors';

/**
 * Application
 * @desc Assigns view components to their perspective routes
 */
const App = () => {
    return (
        <Switch>
            <Route exact path="/" component={Courses}/>
            <Route path="/courses/create" component={CreateCourse}/>
            <Route path="/courses/:id/update" component={UpdateCourse}/>
            <Route exact path="/courses/:id" component={CourseDetail}/>
            <Route path="/signin" component={UserSignIn}/>
            <Route path="/signup" component={UserSignUp}/>
            <Route path="/signout"/>
            <Route path="/notfound" component={NotFound}/>
            <Route path="/forbidden" component={Forbidden}/>
            <Route path="/error" component={Errors}/>
            <Route component={NotFound}/>
        </Switch>
    )
}

export default App;