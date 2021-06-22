import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Grid, Header } from 'semantic-ui-react';
import { Lesson } from '../../../app/models/lesson';
import { useStore } from '../../../app/stores/store';
import LessonListItem from './LessonListItem';

export default observer(function LessonList() {
    const { lessonStore, userStore } = useStore();
    const { lessonsByDate } = lessonStore;
    const { user } = userStore;
    const { courseId } = useParams<{ courseId: string }>();

    return (
        <>
            <Fragment>
                <Grid>
                    <Grid.Column width={8} >
                        <Header color='teal'>Lesson List</Header>
                    </Grid.Column>
                    <Grid.Column width={8} >
                        {(user && user.role === 'admin') &&
                            <Button
                                as={Link}
                                to={`/createLesson/${courseId}`}
                                color='teal'
                                floated='right'
                                content='Create lesson'
                            />
                        }
                    </Grid.Column>
                </Grid>
                <Grid>
                    <Grid.Column width={16} >
                        {lessonsByDate.map((lesson: Lesson) => (
                            <LessonListItem key={lesson.id} lesson={lesson} />
                        ))}
                    </Grid.Column>
                </Grid>
                {lessonsByDate && lessonsByDate.length === 0 &&
                    <Grid style={{ marginTop: '7em' }}>
                        <Grid.Column width={16} >
                            <Header sub style={{ marginBottom: '7em' }}>No Lessons found!</Header>
                        </Grid.Column>
                    </Grid>
                }
            </Fragment>
        </>

    )
})