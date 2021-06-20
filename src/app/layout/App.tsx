import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import TestErrors from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
import { useStore } from '../stores/store';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import PrivateRoute from './PrivateRoute';
import RegisterSuccess from '../../features/users/RegisterSuccess';
import ConfirmEmail from '../../features/users/ConfirmEmail';
import CourseDashboard from '../../features/courses/dashboard/CourseDashboard';
import CourseDetails from '../../features/courses/details/CourseDetails';
import CourseForm from '../../features/courses/form/CourseForm';
import LessonDashboard from '../../features/lessons/dashboard/LessonDashboard';
import LessonForm from '../../features/lessons/form/LessonForm';
import LessonDetails from '../../features/lessons/details/LessonDetails';
import QuestionDashboard from '../../features/questions/dashboard/QuestionDashboard';
import QuestionDetails from '../../features/questions/details/QuestionDetails';
import QuestionForm from '../../features/questions/form/QuestionForm';

function App() {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore])

  if (!commonStore.appLoaded) return <LoadingComponent content='Loading app...' />

  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />
      <Route exact path='/' component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <PrivateRoute exact path='/courses' component={CourseDashboard} />
                <PrivateRoute path='/courses/:id' component={CourseDetails} />
                <PrivateRoute key={location.key} path={['/createCourse', '/manage/:id']} role={'admin'} component={CourseForm} />
                <PrivateRoute exact path='/courseLessons/:courseId' component={LessonDashboard} />
                <PrivateRoute path='/courseLesson/:courseId/lessonDetail/:id' component={LessonDetails} />
                <PrivateRoute key={location.key} path={['/createLesson/:courseId', '/manage/:id']} role={'admin'} component={LessonForm} />
                <PrivateRoute exact path='/lessonQuestions/:lessonId' component={QuestionDashboard} />
                <PrivateRoute path='/lessonQuestion/:lessonId/questionDetail/:id' component={QuestionDetails} />
                <PrivateRoute key={location.key} path={['/createQuestion/:lessonId', '/manage/:id']} role={'admin'} component={QuestionForm} />
                <PrivateRoute path='/errors' component={TestErrors} />
                <Route path='/server-error' component={ServerError} />
                <Route path='/account/registerSuccess' component={RegisterSuccess} />
                <Route path='/account/verifyEmail' component={ConfirmEmail} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
