import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import LessonDetailedInfo from './LessonDetailedInfo';
import LessonDetailedHeader from './LessonDetaledHeader';

export default observer(function LessonDetails() {
    const { lessonStore } = useStore();
    const { selectedLesson: lesson, loadLesson, loadingInitial, clearSelectedLesson } = lessonStore;
    const { courseId } = useParams<{ courseId: string }>();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id && courseId) loadLesson(courseId, id);
        return () => clearSelectedLesson();
    }, [id, courseId, loadLesson, clearSelectedLesson]);

    if (loadingInitial || !lesson) return <LoadingComponent />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <LessonDetailedHeader lesson={lesson} />
                <LessonDetailedInfo lesson={lesson} />
            </Grid.Column>
            <Grid.Column width={6}>
            </Grid.Column>
        </Grid>
    )
})