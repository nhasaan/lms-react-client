import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Grid, Header } from 'semantic-ui-react';
import { Lesson } from '../../../app/models/lesson';
import { useStore } from '../../../app/stores/store';
import LessonListItem from './LessonListItem';

export default observer(function LessonList() {
    const { lessonStore } = useStore();
    const { lessonsByDate } = lessonStore;
    const { courseId } = useParams<{ courseId: string }>();

    return (
        <>
            <Fragment>
                <Header sub color='teal'>Lesson List</Header>
                {lessonsByDate.map((lesson: Lesson) => (
                    <LessonListItem key={lesson.id} lesson={lesson} />
                ))}
                {lessonsByDate && lessonsByDate.length === 0 &&
                    <Grid style={{ marginTop: '7em' }}>
                        <Grid.Column width={16} >
                            <Header sub style={{ marginBottom: '7em' }}>No Lessons found!</Header>
                            <Button
                                as={Link}
                                to={`/createLesson/${courseId}`}
                                color='teal'
                                content='Create lesson'
                            />
                        </Grid.Column>
                    </Grid>
                }
            </Fragment>
        </>

    )
})