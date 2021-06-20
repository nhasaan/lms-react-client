import { observer } from 'mobx-react-lite';
import React from 'react'
import { Segment, Grid, Icon, Button } from 'semantic-ui-react'
import { Course } from "../../../app/models/course";
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface Props {
    course: Course
}

export default observer(function CourseDetailedInfo({ course }: Props) {
    return (
        <Segment.Group>
            <Segment attached='top'>
                <Grid>
                    <Grid.Column width={1}>
                        <Icon size='large' color='teal' name='info' />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <p>{course.description}</p>
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
                            {format(new Date(course.created_at!), 'dd MMM yyyy h:mm aa')}
                        </span>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={16}>
                        <Button
                            as={Link}
                            to={`/createLesson/${course.id}`}
                            color='grey'
                            floated='left'
                            content='Create lesson'
                        />
                        <Button
                            as={Link}
                            to={`/courseLessons/${course.id}`}
                            color='teal'
                            floated='right'
                            content='Go to course Lessons'
                        />
                    </Grid.Column>
                </Grid>
            </Segment>
        </Segment.Group>
    )
})