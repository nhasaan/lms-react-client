import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Item, Segment } from 'semantic-ui-react';
import { Course } from '../../../app/models/course';
import { format } from 'date-fns';

interface Props {
    course: Course
}

export default function CourseListItem({ course }: Props) {

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image style={{ marginBottom: 3 }} size='tiny' circular src={'/assets/created_at/film.jpg'} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/courses/${course.id}`}>
                                {course.title}
                            </Item.Header>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {format(course.created_at!, 'dd MMM yyyy h:mm aa')}
                </span>
            </Segment>
            <Segment clearing>
                <span>{course.description}</span>
                <Button
                    as={Link}
                    to={`/courses/${course.id}`}
                    color='teal'
                    floated='right'
                    content='View'
                />
            </Segment>
        </Segment.Group>
    )
}