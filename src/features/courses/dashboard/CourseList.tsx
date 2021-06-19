import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import { Header } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import CourseListItem from './CourseListItem';

export default observer(function CourseList() {
    const { courseStore } = useStore();
    const { groupedCourses } = courseStore;

    return (
        <>
            {groupedCourses.map(([group, courses]) => (
                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>
                    {courses.map(course => (
                        <CourseListItem key={course.id} course={course} />
                    ))}
                </Fragment>
            ))}
        </>

    )
})