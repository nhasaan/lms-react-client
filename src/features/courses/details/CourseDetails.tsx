import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import CourseDetailedInfo from './CourseDetailedInfo';
import CourseDetailedHeader from './CourseDetaledHeader';

export default observer(function CourseDetails() {
    const { courseStore } = useStore();
    const { selectedCourse: course, loadCourse, loadingInitial, clearSelectedCourse } = courseStore;
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) loadCourse(id);
        return () => clearSelectedCourse();
    }, [id, loadCourse, clearSelectedCourse]);

    if (loadingInitial || !course) return <LoadingComponent />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <CourseDetailedHeader course={course} />
                <CourseDetailedInfo course={course} />
            </Grid.Column>
            <Grid.Column width={6}>
            </Grid.Column>
        </Grid>
    )
})