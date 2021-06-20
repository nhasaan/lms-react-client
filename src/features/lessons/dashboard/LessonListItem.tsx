import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Icon, Item, Segment } from 'semantic-ui-react';
import { Lesson } from '../../../app/models/lesson';
import { format } from 'date-fns';

interface Props {
    lesson: Lesson
}

export default function LessonListItem({ lesson }: Props) {
    const { courseId } = useParams<{ courseId: string }>();

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image style={{ marginBottom: 3 }} size='tiny' circular src={'/assets/categoryImages/film.jpg'} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/lessons/${lesson.id}`}>
                                {lesson.title}
                            </Item.Header>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {format(new Date(lesson.created_at!), 'dd MMM yyyy h:mm aa')}
                </span>
            </Segment>
            <Segment clearing>
                <span>{lesson.description}</span>
                <Button
                    as={Link}
                    to={`/courseLesson/${courseId}/lessonDetail/${lesson.id}`}
                    color='teal'
                    floated='right'
                    content='View'
                />
            </Segment>
        </Segment.Group>
    )
}