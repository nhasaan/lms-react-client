import { observer } from 'mobx-react-lite';
import React from 'react'
import { Segment, Grid, Icon, Button } from 'semantic-ui-react'
import { Lesson } from "../../../app/models/lesson";
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface Props {
    lesson: Lesson
}

export default observer(function LessonDetailedInfo({ lesson }: Props) {
    return (
        <Segment.Group>
            <Segment attached='top'>
                <Grid>
                    <Grid.Column width={1}>
                        <Icon size='large' color='teal' name='info' />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <p>{lesson.description}</p>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='calendar' size='large' color='teal' />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <span>
                            {format(new Date(lesson.created_at!), 'dd MMM yyyy h:mm aa')}
                        </span>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='leanpub' size='large' color='teal' />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <Button
                            as={Link}
                            to={`/lessonQuestions/${lesson.id}`}
                            color='teal'
                            floated='right'
                            content='Go to lesson Questions'
                        />
                    </Grid.Column>
                </Grid>
            </Segment>
        </Segment.Group>
    )
})