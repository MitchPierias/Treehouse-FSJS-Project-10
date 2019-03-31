The `PrivateRoute` HOC is in the form of an authorization wrapper `requiresAuth` exported from `./src/context/AuthService`. The wrapping functions inject the auth context and utilities into the wrapped component.

Wrapped the header's `Course` logo tag with a link to the root courses page because there was no navigation home apart from the rare redirect action.

Storing the user's username and password in browser sessions is obviously not safe, though required integrate with the API from the previous assignment while maintaining persistence for this one.

Added inline styles within the `./src/components/Courses/Courses.js` component to restrict description text within bounds and maintain course item size consistency.

Had to manually expose the `Location` header in the Express API server's response, this allowed the client application to utilize the location header for redirection paths.

The `UpdateCourse` and `CreateCourse` could easily be consolidated into a single component which switches between updating and creating upon existance of a course `id` property, passed through url params.