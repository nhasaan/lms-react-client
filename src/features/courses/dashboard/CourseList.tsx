import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import { Header } from 'semantic-ui-react';
import { Course } from '../../../app/models/course';
import { useStore } from '../../../app/stores/store';
import CourseListItem from './CourseListItem';

export default observer(function CourseList() {
    const { courseStore } = useStore();
    const { coursesByDate } = courseStore;

    return (
        <>
            <Fragment>
                <Header sub color='teal'>Course List</Header>
                {coursesByDate.map((course: Course) => (
                    <CourseListItem key={course.id} course={course} />
                ))}
            </Fragment>
        </>

    )
})